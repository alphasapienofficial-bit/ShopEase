// TanStack Query mutations for login / register.
// On success we store the session in Redux (the interceptor then sends the token).
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAppDispatch } from "../../app/hooks";
import { loggedIn } from "./authSlice";

export function useLogin() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: session => {
      dispatch(loggedIn(session));
    },
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: session => {
      dispatch(loggedIn(session));
    },
  });
}
