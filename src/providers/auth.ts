import type { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  async login() {
    // Login endpoint not defined in auth configuration
    throw new Error("login not implemented");
  },

  async logout() {
    // Logout endpoint not defined in auth configuration
    throw new Error("logout not implemented");
  },

  async check() {
    // No authentication configured - always return authenticated
    return { authenticated: true };
  },

  async onError(error) {
    // Handle authentication errors
    const status = error?.response?.status || error?.status;
    if (status === 401 || status === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },

  async getIdentity() {
    // Get identity endpoint not defined in auth configuration
    throw new Error("getIdentity not implemented");
  },

  async register() {
    // Register endpoint not defined in auth configuration
    throw new Error("register not implemented");
  },

  async forgotPassword() {
    // Forgot password endpoint not defined in auth configuration
    throw new Error("forgotPassword not implemented");
  },

  async updatePassword() {
    // Update password endpoint not defined in auth configuration
    throw new Error("updatePassword not implemented");
  },

  async getPermissions() {
    // Get permissions endpoint not defined in auth configuration
    throw new Error("getPermissions not implemented");
  },
};