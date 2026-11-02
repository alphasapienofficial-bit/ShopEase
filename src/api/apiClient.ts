// One shared axios instance for the whole app.
import axios from "axios";
import type { ApiErrorBody } from "../types";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Turn any thrown error into a message we can show to the user.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}
