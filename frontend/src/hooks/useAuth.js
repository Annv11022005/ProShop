import { login, logout, register } from '@/services/apiUsers';
import { useMutation } from '@tanstack/react-query';

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
  const {
    mutate: logoutUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
  });

  return { logoutUser, isPending, error };
}

export function useRegister() {
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
  });

  return { registerUser, isPending };
}
