"use client";

class AuthStorage {
  private memoryStorage: {
    token: string | null;
    user: any | null;
  } = {
    token: null,
    user: null,
  };

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    if (typeof window === "undefined") return;

    try {
      // Try localStorage first
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        this.memoryStorage.token = token;
        this.memoryStorage.user = JSON.parse(user);
        console.log("AuthStorage: Initialized from localStorage");
      } else {
        // Fallback to sessionStorage
        const sessionToken = sessionStorage.getItem("token");
        const sessionUser = sessionStorage.getItem("user");

        if (sessionToken && sessionUser) {
          this.memoryStorage.token = sessionToken;
          this.memoryStorage.user = JSON.parse(sessionUser);
          console.log("AuthStorage: Initialized from sessionStorage");
          // Sync back to localStorage
          this.syncToLocalStorage();
        }
      }
    } catch (error) {
      console.error("AuthStorage initialization error:", error);
    }
  }

  private syncToLocalStorage() {
    if (typeof window === "undefined") return;

    try {
      if (this.memoryStorage.token) {
        localStorage.setItem("token", this.memoryStorage.token);
      }
      if (this.memoryStorage.user) {
        localStorage.setItem("user", JSON.stringify(this.memoryStorage.user));
      }
    } catch (error) {
      console.error("AuthStorage sync error:", error);
    }
  }

  setToken(token: string) {
    this.memoryStorage.token = token;

    if (typeof window === "undefined") return;

    try {
      // Store in multiple places
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
    } catch (error) {
      console.error("AuthStorage setToken error:", error);
    }
  }

  setUser(user: any) {
    this.memoryStorage.user = user;

    if (typeof window === "undefined") return;

    try {
      const userStr = JSON.stringify(user);
      localStorage.setItem("user", userStr);
      sessionStorage.setItem("user", userStr);
    } catch (error) {
      console.error("AuthStorage setUser error:", error);
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return this.memoryStorage.token;

    try {
      // Check memory first
      if (this.memoryStorage.token) return this.memoryStorage.token;

      // Fallback to localStorage
      const token = localStorage.getItem("token");
      if (token) {
        this.memoryStorage.token = token;
        return token;
      }

      // Fallback to sessionStorage
      const sessionToken = sessionStorage.getItem("token");
      if (sessionToken) {
        this.memoryStorage.token = sessionToken;
        return sessionToken;
      }

      // Fallback to cookie
      const cookieToken = this.getCookie("token");
      if (cookieToken) {
        this.memoryStorage.token = cookieToken;
        return cookieToken;
      }

      return null;
    } catch (error) {
      console.error("AuthStorage getToken error:", error);
      return this.memoryStorage.token;
    }
  }

  getUser(): any | null {
    if (typeof window === "undefined") return this.memoryStorage.user;

    try {
      // Check memory first
      if (this.memoryStorage.user) return this.memoryStorage.user;

      // Fallback to localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        this.memoryStorage.user = user;
        return user;
      }

      // Fallback to sessionStorage
      const sessionUserStr = sessionStorage.getItem("user");
      if (sessionUserStr) {
        const user = JSON.parse(sessionUserStr);
        this.memoryStorage.user = user;
        return user;
      }

      return null;
    } catch (error) {
      console.error("AuthStorage getUser error:", error);
      return this.memoryStorage.user;
    }
  }

  clear() {
    this.memoryStorage.token = null;
    this.memoryStorage.user = null;

    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (error) {
      console.error("AuthStorage clear error:", error);
    }
  }

  private getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create singleton instance
export const authStorage = new AuthStorage();
