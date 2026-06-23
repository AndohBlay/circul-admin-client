import api from "./client";

export const authApi = {
  register: (payload) => api.post("/register", payload),
  login: (payload) => api.post("/login", payload),
  verifyOtp: (payload) => api.post("/verify-otp", payload),
  resendOtp: (payload) => api.post("/resend-otp", payload),
  forgotPassword: (payload) => api.post("/forgot-password", payload),
  resetPassword: (payload) => api.post("/reset-password", payload),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
  changePassword: (payload) => api.put("/user/change-password", payload),
  // Google OAuth — backend redirects to /auth/google/redirect, returns token via callback
  googleRedirectUrl: () => `${api.defaults.baseURL ?? ""}/auth/google/redirect`,
};
