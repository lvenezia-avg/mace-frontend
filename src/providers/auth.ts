import type { AuthProvider } from "@refinedev/core";

const AUTH_KEY = "isAuthenticated";
const HARDCODED_USERNAME = "admin";
const HARDCODED_PASSWORD = "admin123";

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      return { success: true, redirectTo: "/contents" };
    }
    return {
      success: false,
      error: { name: "Login Failed", message: "Invalid username or password." },
    };
  },

  async logout() {
    localStorage.removeItem(AUTH_KEY);
    return { success: true, redirectTo: "/login" };
  },

  async check() {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    if (isAuthenticated) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  async onError(error) {
    const status = error?.response?.status || error?.status;
    if (status === 401 || status === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },

  async getIdentity() {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    if (isAuthenticated) {
      return { id: 1, name: "Admin", avatar: undefined };
    }
    return null;
  },

  async register() {
    throw new Error("register not implemented");
  },

  async forgotPassword() {
    throw new Error("forgotPassword not implemented");
  },

  async updatePassword() {
    throw new Error("updatePassword not implemented");
  },

  async getPermissions() {
    throw new Error("getPermissions not implemented");
  },
};
