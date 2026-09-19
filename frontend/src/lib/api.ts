import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from Zustand store
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tutor-lagbe-auth");
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {}
    }
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized / Token Expired - Clean up local storage and redirect to login
      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("tutor-lagbe-auth");

          // Avoid infinite redirect loops if the user is already on the login/register pages
          const path = window.location.pathname;
          if (path !== "/login" && path !== "/register") {
            const redirect = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirect}`;
          }
        }
      }

      // 403 Banned / Suspended
      if (status === 403 && data?.error?.toLowerCase().includes("suspended")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("tutor-lagbe-auth");
          window.location.href = "/login?error=suspended";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
