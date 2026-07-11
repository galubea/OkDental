// context/AuthContext.tsx
import { createContext, useCallback, useEffect, useReducer, type ReactNode } from "react";
import type { AuthState, Doctor, LoginCredentials, RegisterDoctorInput } from "../types/doctor";
import { authApi } from "../api";
import { toAuthErrorMessage } from "../utils/errors";

type AuthAction =
  | { type: "CHECK_START" }
  | { type: "CHECK_DONE"; payload: Doctor | null }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: Doctor }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" };

const estadoInicial: AuthState = { doctor: null, status: "checking", error: null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "CHECK_START":
      return { ...state, status: "checking" };
    case "CHECK_DONE":
      return { doctor: action.payload, status: action.payload ? "authenticated" : "idle", error: null };
    case "LOGIN_START":
      return { ...state, status: "authenticating", error: null };
    case "LOGIN_SUCCESS":
      return { doctor: action.payload, status: "authenticated", error: null };
    case "LOGIN_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "LOGOUT":
      return { doctor: null, status: "idle", error: null };
    default:
      return state;
  }
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterDoctorInput) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, estadoInicial);

  useEffect(() => {
    let cancelado = false;
    dispatch({ type: "CHECK_START" });
    authApi
      .getActiveSession()
      .then((doctor) => { if (!cancelado) dispatch({ type: "CHECK_DONE", payload: doctor }); })
      .catch(() => { if (!cancelado) dispatch({ type: "CHECK_DONE", payload: null }); });
    return () => { cancelado = true; };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const doctor = await authApi.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: doctor });
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: toAuthErrorMessage(error) });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    dispatch({ type: "LOGOUT" });
  }, []);

  const register = useCallback(async (input: RegisterDoctorInput) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await authApi.registerDoctor(input);
      // Auto-login tras registrar
      const doctor = await authApi.login({ email: input.email, password: input.password });
      dispatch({ type: "LOGIN_SUCCESS", payload: doctor });
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: toAuthErrorMessage(error) });
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}