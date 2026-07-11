import { isTauriEnv } from "../utils/tauriEnv";
import { tauriAuthApi } from "./tauriAuthApi";
import { mockAuthApi } from "./mockAuthApi";
import type { AuthApi } from "./authApi";

export const authApi: AuthApi = isTauriEnv() ? tauriAuthApi : mockAuthApi;
export type { AuthApi } from "./authApi";