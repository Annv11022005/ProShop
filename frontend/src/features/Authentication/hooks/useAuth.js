import { login, logout, register, verifyOTP } from '../api/apiUsers';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLogin() {
  const {
    mutate: loginUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
  });

  return { loginUser, isPending, error };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const {
    mutate: logoutUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return { logoutUser, isPending, error };
}

export function useRegister() {
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
  });

  return { registerUser, isPending };
}

export function useVerify() {
  const { mutate: verifyUser, isPending } = useMutation({
    mutationFn: verifyOTP,
  });

  return { verifyUser, isPending };
}
