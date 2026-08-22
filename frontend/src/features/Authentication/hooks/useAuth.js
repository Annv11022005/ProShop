import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyOTP,
} from '../api/apiUsers';
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

export function useForgotPassword() {
  const {
    mutate: forgotPasswordUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: forgotPassword,
  });

  return { forgotPasswordUser, isPending, error };
}

export function useResetPassword() {
  const {
    mutate: resetPasswordUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return { resetPasswordUser, isPending, error };
}
