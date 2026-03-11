import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';

const AuthContext = createContext();

// Constants for better maintainability
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const MAX_REFRESH_ATTEMPTS = 2;
const REQUEST_TIMEOUT = 60000; // 60 seconds
const INIT_TIMEOUT = 20000; // 20 seconds for initialization
const SESSION_EXPIRY_MESSAGE = "Session expired. Please login again.";
const TOAST_ID = {
  SESSION_EXPIRED: 'session-expired',
  NETWORK_ERROR: 'network-error',
  AUTH_ERROR: 'auth-error'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  // ADD THIS - Track if password change is required for restaurant owners
  const [mustChangePassword, setMustChangePassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for managing token refresh state
  const refreshQueue = useRef([]);
  const isRefreshing = useRef(false);
  const refreshController = useRef(null);
  const refreshAttempts = useRef(0);
  const pendingRequests = useRef(new Set());

  const isDev = window.location.origin.includes('localhost');
  const API_BASE_URL = isDev ? 'http://localhost:8885' : '';

  // Helper: Clear all auth data consistently
  const clearAuthData = useCallback((silent = false) => {
    // Clean up pending requests
    pendingRequests.current.forEach(controller => controller.abort?.());
    pendingRequests.current.clear();

    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("lastOrder");
    localStorage.removeItem("passwordChangeRequired"); // ADD THIS

    // Reset state
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    setLastOrder(null);
    setContactMessages([]);
    setNotifications([]);
    setUnreadCount(0);
    setMustChangePassword(false); // ADD THIS
    refreshAttempts.current = 0;

    if (!silent) {
      // Show logout message if not silent
      toast.info("Logged out successfully", { toastId: TOAST_ID.AUTH_ERROR });
    }
  }, []);

  // Helper: Validate JWT token
  const isValidToken = useCallback((tokenString) => {
    if (!tokenString) return false;

    try {
      // Decode JWT payload
      const base64Url = tokenString.split('.')[1];
      if (!base64Url) return false;

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Check if token is valid and not about to expire
      return expiryTime > currentTime + TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }, []);

  // Helper: Extract user info from token
  const getUserFromToken = useCallback((tokenString) => {
    if (!tokenString) return null;

    try {
      const base64Url = tokenString.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name || "",
        role: payload.role || "USER",
      };
    } catch (error) {
      console.error("Failed to extract user from token:", error);
      return null;
    }
  }, []);

  // Enhanced token refresh with queue system and abort controller
  const refreshAccessToken = useCallback(async (isRetry = false) => {
    // If already refreshing, queue the request
    if (isRefreshing.current && !isRetry) {
      return new Promise((resolve, reject) => {
        refreshQueue.current.push({ resolve, reject });
      });
    }

    isRefreshing.current = true;
    refreshController.current = new AbortController();

    // Increment refresh attempts
    refreshAttempts.current += 1;

    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }

      // Check max refresh attempts
      if (refreshAttempts.current > MAX_REFRESH_ATTEMPTS) {
        throw new Error("Too many refresh attempts. Please login again.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        { refreshToken: storedRefreshToken },
        {
          signal: refreshController.current.signal,
          timeout: REQUEST_TIMEOUT
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      // Validate response
      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Invalid token response from server");
      }

      // Store new tokens
      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      setToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // Reset attempts on success
      refreshAttempts.current = 0;
      console.log("Token refreshed successfully");

      // Resolve all queued requests
      refreshQueue.current.forEach(({ resolve }) => resolve({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }));
      refreshQueue.current = [];

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Failed to refresh token:", error);

      // Reject all queued requests
      refreshQueue.current.forEach(({ reject }) => reject(error));
      refreshQueue.current = [];

      // Only show toast and logout if not a retry and not aborted
      if (!isRetry && error.name !== 'AbortError') {
        // Clear auth data
        clearAuthData(true);

        // Show single session expiry toast
        if (!toast.isActive(TOAST_ID.SESSION_EXPIRED)) {
          toast.error(SESSION_EXPIRY_MESSAGE, {
            toastId: TOAST_ID.SESSION_EXPIRED,
            autoClose: 3000
          });
        }

        // Navigate to home page after short delay
        setTimeout(() => {
          if (location.pathname !== '/') {
            navigate("/", { replace: true });
          }
        }, 1000);
      }

      throw error;
    } finally {
      isRefreshing.current = false;
      refreshController.current = null;
    }
  }, [API_BASE_URL, navigate, location, clearAuthData]);

  // ADD THIS - Check if password change is required (only for restaurant owners)
  const checkPasswordChangeRequirement = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return false;

      const response = await fetch(`${API_BASE_URL}/api/auth/require-password-change`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshAccessToken();
          return checkPasswordChangeRequirement();
        }
        return false;
      }

      const data = await response.json();
      setMustChangePassword(data.mustChangePassword);
      localStorage.setItem("passwordChangeRequired", data.mustChangePassword ? "true" : "false");
      return data.mustChangePassword;
    } catch (error) {
      console.error("Error checking password change requirement:", error);
      return false;
    }
  }, [API_BASE_URL, refreshAccessToken]);

  // ADD THIS - Mark password as changed
  const markPasswordChanged = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return false;

      const response = await fetch(`${API_BASE_URL}/api/auth/password-changed`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshAccessToken();
          return markPasswordChanged();
        }
        return false;
      }

      setMustChangePassword(false);
      localStorage.removeItem("passwordChangeRequired");
      
      if (user) {
        const updatedUser = { ...user, passwordChanged: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return true;
    } catch (error) {
      console.error("Error marking password as changed:", error);
      return false;
    }
  }, [API_BASE_URL, refreshAccessToken, user]);

  // Setup axios interceptors with proper cleanup
  useEffect(() => {
    let requestInterceptor;
    let responseInterceptor;

    const setupInterceptors = () => {
      // Request interceptor
      requestInterceptor = axios.interceptors.request.use(
        async (config) => {
          let accessToken = localStorage.getItem("token");

          // Skip token validation for auth endpoints
          const isAuthEndpoint = config.url?.includes('/api/auth/');
          if (isAuthEndpoint && !config.url?.includes('/api/auth/profile')) {
            return config;
          }

          // Add request to pending set for cleanup
          const controller = new AbortController();
          config.signal = controller.signal;
          pendingRequests.current.add(controller);

          // Check if token needs refresh before making request
          if (accessToken && !isValidToken(accessToken)) {
            try {
              const newTokens = await refreshAccessToken();
              accessToken = newTokens.accessToken;
              config.headers.Authorization = `Bearer ${accessToken}`;
            } catch (error) {
              // Don't throw here, let the request fail with 401
              console.log("Token refresh failed before request");
            }
          } else if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }

          return config;
        },
        (error) => {
          // Clean up pending request
          if (error.config?.signal) {
            pendingRequests.current.delete(error.config.signal);
          }
          return Promise.reject(error);
        }
      );

      // Response interceptor
      responseInterceptor = axios.interceptors.response.use(
        (response) => {
          // Clean up pending request on success
          if (response.config?.signal) {
            pendingRequests.current.delete(response.config.signal);
          }
          return response;
        },
        async (error) => {
          // Clean up pending request on error
          if (error.config?.signal) {
            pendingRequests.current.delete(error.config.signal);
          }

          const originalRequest = error.config;

          // Handle network errors
          if (!error.response) {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
              if (!toast.isActive(TOAST_ID.NETWORK_ERROR)) {
                toast.error("Request timeout. Please try again.", {
                  toastId: TOAST_ID.NETWORK_ERROR
                });
              }
            } else if (error.message.includes('Network Error')) {
              if (!toast.isActive(TOAST_ID.NETWORK_ERROR)) {
                toast.error("Network error. Please check your connection.", {
                  toastId: TOAST_ID.NETWORK_ERROR
                });
              }
            }
            return Promise.reject(error);
          }

          // Handle 401 - Unauthorized (token expired)
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              // Try to refresh the token
              const newTokens = await refreshAccessToken(true);

              // Update request header with new token
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

              // Clean up old controller and create new one
              if (originalRequest.signal) {
                pendingRequests.current.delete(originalRequest.signal);
              }
              const newController = new AbortController();
              originalRequest.signal = newController.signal;
              pendingRequests.current.add(newController);

              // Retry the original request
              return axios(originalRequest);
            } catch (refreshError) {
              // Refresh failed, logout will be handled by refreshAccessToken
              return Promise.reject(refreshError);
            }
          }

          // Handle other error statuses
          if (error.response?.status === 403) {
            toast.error("You don't have permission to perform this action.");
          } else if (error.response?.status >= 500) {
            toast.error("Server error. Please try again later.");
          }

          return Promise.reject(error);
        }
      );
    };

    setupInterceptors();

    return () => {
      if (requestInterceptor) {
        axios.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor) {
        axios.interceptors.response.eject(responseInterceptor);
      }
      // Abort any ongoing refresh request
      if (refreshController.current) {
        refreshController.current.abort();
      }
      // Clean up all pending requests
      pendingRequests.current.forEach(controller => controller.abort());
      pendingRequests.current.clear();
    };
  }, [refreshAccessToken, isValidToken]);

  // Enhanced secure fetch with timeout, retry logic, and error handling
  const secureFetch = useCallback(async (url, options = {}) => {
    const retries = options.retries || 3;
    const fetchOptions = { ...options };
    delete fetchOptions.retries;

    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      pendingRequests.current.add(controller);

      try {
        let accessToken = localStorage.getItem("token");

        if (accessToken && !isValidToken(accessToken)) {
          try {
            const newTokens = await refreshAccessToken();
            accessToken = newTokens.accessToken;
          } catch (refreshError) {
            throw new Error("Session expired");
          }
        }

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            ...fetchOptions.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (response.status === 401) {
          throw new Error("Session expired");
        }

        pendingRequests.current.delete(controller);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        pendingRequests.current.delete(controller);
        lastError = error;

        if (error.name === 'AbortError') {
          console.log(`Attempt ${attempt} timed out for ${url}`);
        } else {
          console.error(`Attempt ${attempt} failed for ${url}:`, error.message);
        }

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }

    throw lastError;
  }, [refreshAccessToken, isValidToken]);

  // Get user profile with improved error handling
  const getProfile = useCallback(async (authToken = token) => {
    if (!authToken) return null;

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Profile fetch failed: ${response.status}`);
      }

      const profile = await response.json();

      // Validate and transform profile data
      const validatedProfile = {
        id: profile.id || profile._id,
        email: profile.email || "",
        name: profile.name || "",
        role: profile.role || "USER",
        profilePicture: profile.profilePicture || profile.avatar || "",
        ordersCount: profile.ordersCount || 0,
        cartItemsCount: profile.cartItemsCount || 0,
        favoriteItemsCount: profile.favoriteItemsCount || 0,
        addresses: Array.isArray(profile.addresses) ? profile.addresses : [],
        emailOrderUpdates: profile.emailOrderUpdates !== undefined ? profile.emailOrderUpdates : true,
        emailPromotions: profile.emailPromotions !== undefined ? profile.emailPromotions : true,
        desktopNotifications: profile.desktopNotifications !== undefined ? profile.desktopNotifications : true,
        phone: profile.phone || "",
        createdAt: profile.createdAt || new Date().toISOString(),
      };

      console.log("Fetched profile:", validatedProfile);
      return validatedProfile;
    } catch (error) {
      console.error("getProfile error:", error.message);

      // If session expired, throw specific error
      if (error.message.includes("Session expired") || error.message.includes("401")) {
        throw new Error("Session expired");
      }

      // For other errors, try to get user from token
      const userFromToken = getUserFromToken(authToken);
      if (userFromToken) {
        console.log("Using user data from token");
        return userFromToken;
      }

      throw error;
    }
  }, [token, secureFetch, API_BASE_URL, getUserFromToken]);

  // Initialize authentication with improved error handling and timeout
  useEffect(() => {
    let isMounted = true;
    let initTimeout;

    const initializeAuth = async () => {
      if (!isMounted) return;

      const storedToken = localStorage.getItem("token");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");
      const storedLastOrder = localStorage.getItem("lastOrder");
      const storedPasswordChangeRequired = localStorage.getItem("passwordChangeRequired"); // ADD THIS

      // Set timeout for initialization
      initTimeout = setTimeout(() => {
        if (isMounted) {
          console.warn("Auth initialization timed out");
          setLoading(false);
          setIsInitialized(true);
        }
      }, INIT_TIMEOUT);

      try {
        // Check if we have tokens
        if (storedToken && storedRefreshToken) {
          // Set initial state from localStorage
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (isMounted) setUser(parsedUser);
            } catch (e) {
              console.error("Failed to parse stored user:", e);
            }
          }

          if (storedLastOrder) {
            try {
              const parsedLastOrder = JSON.parse(storedLastOrder);
              if (isMounted) setLastOrder(parsedLastOrder);
            } catch (e) {
              console.error("Failed to parse stored last order:", e);
            }
          }

          // ADD THIS - Set password change required state from localStorage
          if (storedPasswordChangeRequired === "true") {
            setMustChangePassword(true);
          }

          // Check token validity
          if (!isValidToken(storedToken)) {
            // Token is expired or about to expire, try to refresh
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              console.log("Token refresh failed during initialization:", refreshError.message);
              // Don't clear data immediately, user might still have valid session
            }
          }

          // Fetch user data in parallel with individual timeouts
          const fetchData = async () => {
            try {
              const [profile, cartData, favoritesData, ordersData, notificationsData] = await Promise.allSettled([
                getProfile(storedToken).catch(() => null),
                fetchCart().catch(() => []),
                fetchFavorites().catch(() => []),
                fetchOrders().catch(() => []),
                fetchNotifications().catch(() => []),
              ]);

              if (isMounted) {
                // Update profile if fetched successfully
                if (profile.status === 'fulfilled' && profile.value) {
                  const userProfile = profile.value;
                  setUser(userProfile);
                  localStorage.setItem("user", JSON.stringify(userProfile));
                } else if (!storedUser) {
                  // Fallback to token data if no stored user
                  const userFromToken = getUserFromToken(storedToken);
                  if (userFromToken) {
                    setUser(userFromToken);
                    localStorage.setItem("user", JSON.stringify(userFromToken));
                  }
                }

                // Update other data
                if (cartData.status === 'fulfilled') setCart(cartData.value || []);
                if (favoritesData.status === 'fulfilled') setFavorites(favoritesData.value || []);
                if (ordersData.status === 'fulfilled') setOrders(ordersData.value || []);
                if (notificationsData.status === 'fulfilled') {
                  const notifications = notificationsData.value || [];
                  setNotifications(notifications);
                  setUnreadCount(notifications.filter(n => !n.read).length);
                }
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              // Continue with available data
            }
          };

          await fetchData();
        } else if (storedToken && !storedRefreshToken) {
          // Invalid state - clear tokens
          clearAuthData(true);
        }
      } catch (error) {
        console.error("initializeAuth error:", error);
        // Don't logout on initialization errors, keep user logged in
      } finally {
        if (isMounted) {
          clearTimeout(initTimeout);
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up periodic token check
    const tokenCheckInterval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !isValidToken(storedToken) && !isRefreshing.current) {
        // Silently refresh token
        refreshAccessToken().catch(() => {
          // Silent failure
        });
      }
    }, 60000); // Check every minute

    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
      clearInterval(tokenCheckInterval);
    };
  }, [getProfile, refreshAccessToken, clearAuthData, isValidToken, getUserFromToken]);

  // Enhanced logout function
  const logout = useCallback((message = "Logged out successfully", redirectTo = "/") => {
    // Abort any ongoing requests
    pendingRequests.current.forEach(controller => controller.abort());
    pendingRequests.current.clear();

    // Abort refresh if in progress
    if (refreshController.current) {
      refreshController.current.abort();
    }

    // Clear all auth data
    clearAuthData(true);

    // Show logout message
    if (message) {
      toast.info(message);
    }

    // Navigate to specified page (default: home)
    navigate(redirectTo, { replace: true });
  }, [clearAuthData, navigate]);

  // Enhanced login function with better error handling - UPDATED for restaurant owners
  const login = async (email, password) => {
    try {
      setAuthLoading(true);

      // Basic validation
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return { success: false, error: "Email and password are required" };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "Login failed";
        if (response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (response.status === 429) {
          errorMessage = "Too many attempts. Please try again later.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response data
      if (!data.token || !data.refreshToken) {
        throw new Error("Invalid server response");
      }

      // Store tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setToken(data.token);
      setRefreshToken(data.refreshToken);

      // Get and set user profile
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setUser(userProfile);

      // Fetch user data in parallel
      const [cartData, favoritesData, ordersData, notificationsData] = await Promise.allSettled([
        fetchCart(),
        fetchFavorites(),
        fetchOrders(),
        fetchNotifications(),
      ]);

      // Update state with fetched data
      setCart(cartData.status === 'fulfilled' ? cartData.value : []);
      setFavorites(favoritesData.status === 'fulfilled' ? favoritesData.value : []);
      setOrders(ordersData.status === 'fulfilled' ? ordersData.value : []);

      if (notificationsData.status === 'fulfilled') {
        const notifications = notificationsData.value || [];
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }

      // Welcome message
      const welcomeName = data.name || userProfile.name || "there";
      toast.success(`Welcome back, ${welcomeName}!`);

      // Role-based navigation after login
      const role = userProfile.role;
      const isRestaurantOwner = role === "ROLE_RESTAURANT_OWNER" || role === "RESTAURANT_OWNER";
      
      // ADD THIS - Check if password change is required (only for restaurant owners)
      if (isRestaurantOwner) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/require-password-change`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${data.token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.mustChangePassword) {
              setMustChangePassword(true);
              localStorage.setItem("passwordChangeRequired", "true");
            }
          }
        } catch (error) {
          console.error("Error checking password change requirement:", error);
        }
      }

      let redirectPath = "/";
      
      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        redirectPath = "/";
      } else if (isRestaurantOwner) {
        redirectPath = "/"; // Restaurant owners go to home page
      } else {
        redirectPath = location.state?.from?.pathname || "/";
      }
      
      navigate(redirectPath, { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error.message);

      let errorMessage = "Login failed";
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Enhanced signup function with validation
  const signup = async (name, email, password) => {
    try {
      setAuthLoading(true);

      // Client-side validation
      if (!name?.trim()) {
        toast.error("Please enter your name");
        return { success: false, error: "Name is required" };
      }

      if (!email?.trim()) {
        toast.error("Please enter your email");
        return { success: false, error: "Email is required" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return { success: false, error: "Invalid email format" };
      }

      if (!password) {
        toast.error("Please enter a password");
        return { success: false, error: "Password is required" };
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        const errorMessage = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "Signup failed";
        if (response.status === 409) {
          errorMessage = "An account with this email already exists";
        } else if (response.status === 400) {
          errorMessage = errorData.message || "Invalid input data";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success(data.message || "OTP sent to your email!");
      return { success: true, email };
    } catch (error) {
      console.error("Signup error:", error.message);

      let errorMessage = "Signup failed";
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Verify signup OTP
  const verifySignupOtp = async (email, otp) => {
    try {
      setAuthLoading(true);

      if (!email || !otp) {
        toast.error("Email and OTP are required");
        return { success: false, error: "Email and OTP are required" };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "OTP verification failed";
        if (response.status === 400) {
          errorMessage = "Invalid or expired OTP";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response
      if (!data.token || !data.refreshToken) {
        throw new Error("Invalid server response");
      }

      // Store tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setToken(data.token);
      setRefreshToken(data.refreshToken);

      // Get user profile
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setUser(userProfile);

      // Initialize empty data for new user
      setCart([]);
      setFavorites([]);
      setOrders([]);
      setLastOrder(null);
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem("lastOrder");

      // Welcome message
      const welcomeName = data.name || userProfile.name || "there";
      toast.success(`Welcome aboard, ${welcomeName}!`);

      // Role-based navigation after signup verification
      const role = userProfile.role;
      let redirectPath = "/";
      
      if (role === "ROLE_RESTAURANT_OWNER") {
        redirectPath = "/";
      } else if (role === "ROLE_ADMIN") {
        redirectPath = "/admin";
      } else {
        redirectPath = "/";
      }
      
      navigate(redirectPath, { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Verify OTP error:", error.message);

      let errorMessage = "OTP verification failed";
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);

      if (!email?.trim()) {
        toast.error("Please enter your email");
        return { success: false, error: "Email is required" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return { success: false, error: "Invalid email format" };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "Failed to send reset code";
        if (response.status === 404) {
          errorMessage = "No account found with this email";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success(data.message || "Reset code sent to your email!");
      return { success: true };
    } catch (error) {
      console.error("Forgot password error:", error.message);

      let errorMessage = "Failed to send reset code";
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      setAuthLoading(true);

      // Validation
      if (!email || !otp || !newPassword || !confirmPassword) {
        toast.error("All fields are required");
        return { success: false, error: "All fields are required" };
      }

      if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match");
        return { success: false, error: "Passwords do not match" };
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        const errorMessage = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "Password reset failed";
        if (response.status === 400) {
          errorMessage = "Invalid or expired reset code";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success(data.message || "Password reset successfully!");

      // Navigate to login page
      navigate("/auth", { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error.message);

      let errorMessage = "Password reset failed";
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Google login (mock for development)
  const googleLogin = async () => {
    try {
      setAuthLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock response for development
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'google.user@example.com',
        role: 'USER',
        profilePicture: 'https://ui-avatars.com/api/?name=Google+User&background=random',
        phone: null,
        ordersCount: 0,
        cartItemsCount: 0,
        favoriteItemsCount: 0,
        addresses: [],
        emailOrderUpdates: true,
        emailPromotions: true,
        desktopNotifications: true,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock_google_token_' + Date.now();
      const mockRefreshToken = 'mock_google_refresh_token_' + Date.now();

      // Store mock tokens
      localStorage.setItem("token", mockToken);
      localStorage.setItem("refreshToken", mockRefreshToken);
      setToken(mockToken);
      setRefreshToken(mockRefreshToken);

      // Set user
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      // Initialize empty data
      setCart([]);
      setFavorites([]);
      setOrders([]);
      setLastOrder(null);
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem("lastOrder");

      toast.success(`Welcome, ${mockUser.name}!`);

      // Role-based navigation for Google login (though mock is USER)
      const role = mockUser.role;
      let redirectPath = "/";
      
      if (role === "ROLE_RESTAURANT_OWNER") {
        redirectPath = "/";
      } else if (role === "ROLE_ADMIN") {
        redirectPath = "/admin";
      }
      
      navigate(redirectPath, { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error("Google login failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Update user profile
  const updateProfile = useCallback(
    async (updatedData) => {
      try {
        const response = await secureFetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "PUT",
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 409) {
            throw new Error("This email is already in use. Please use a different email.");
          }
          throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
        }

        const data = await response.json();
        const updatedProfile = await getProfile();
        setUser(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        toast.success(data.message || "Profile updated successfully!");
        return { success: true, user: updatedProfile };
      } catch (error) {
        console.error("updateProfile error:", error.message);
        toast.error(error.message || "Failed to update profile");
        return { success: false, error: error.message };
      }
    },
    [getProfile, secureFetch, API_BASE_URL]
  );

  // Update password - UPDATED to call markPasswordChanged
  const updatePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match");
        return { success: false, error: "New password and confirmation do not match" };
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        const errorMessage =
          "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/auth/change-password`, {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update password: ${response.status}`);
        }

        const data = await response.json();
        
        // ADD THIS - Mark password as changed in backend
        await markPasswordChanged();
        
        toast.success(data.message || "Password updated successfully!");
        return { success: true };
      } catch (error) {
        console.error("updatePassword error:", error.message);
        toast.error(error.message || "Failed to update password");
        return { success: false, error: error.message };
      }
    },
    [secureFetch, API_BASE_URL, markPasswordChanged]
  );

  // Add address
  const addAddress = useCallback(
    async (addressData) => {
      const { addressLine1, city, pincode } = addressData;
      if (!addressLine1?.trim() || !city?.trim() || !pincode?.trim()) {
        toast.error("Address Line 1, City, and Pincode are required");
        return { success: false, error: "Address Line 1, City, and Pincode are required" };
      }

      if (!/^\d{6}$/.test(pincode)) {
        toast.error("Pincode must be a 6-digit number");
        return { success: false, error: "Pincode must be a 6-digit number" };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/auth/addresses`, {
          method: "POST",
          body: JSON.stringify({
            line1: addressData.addressLine1,
            line2: addressData.addressLine2 || "",
            city: addressData.city,
            pincode: addressData.pincode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to add address: ${response.status}`);
        }

        const newAddress = await response.json();
        const updatedProfile = await getProfile();
        setUser(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        toast.success("Address added successfully!");
        return { success: true, address: newAddress };
      } catch (error) {
        console.error("addAddress error:", error.message);
        toast.error(error.message || "Failed to add address");
        return { success: false, error: error.message };
      }
    },
    [getProfile, secureFetch, API_BASE_URL]
  );

  // Update address
  const updateAddress = useCallback(
    async (addressId, addressData) => {
      const { addressLine1, city, pincode } = addressData;
      if (!addressLine1?.trim() || !city?.trim() || !pincode?.trim()) {
        toast.error("Address Line 1, City, and Pincode are required");
        return { success: false, error: "Address Line 1, City, and Pincode are required" };
      }

      if (!/^\d{6}$/.test(pincode)) {
        toast.error("Pincode must be a 6-digit number");
        return { success: false, error: "Pincode must be a 6-digit number" };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/auth/addresses/${addressId}`, {
          method: "PUT",
          body: JSON.stringify({
            line1: addressData.addressLine1,
            line2: addressData.addressLine2 || "",
            city: addressData.city,
            pincode: addressData.pincode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update address: ${response.status}`);
        }

        const updatedAddress = await response.json();
        const updatedProfile = await getProfile();
        setUser(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        toast.success("Address updated successfully!");
        return { success: true, address: updatedAddress };
      } catch (error) {
        console.error("updateAddress error:", error.message);
        toast.error(error.message || "Failed to update address");
        return { success: false, error: error.message };
      }
    },
    [getProfile, secureFetch, API_BASE_URL]
  );

  // Delete address
  const deleteAddress = useCallback(
    async (addressId) => {
      try {
        const response = await secureFetch(`${API_BASE_URL}/api/auth/addresses/${addressId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete address: ${response.status}`);
        }

        const updatedProfile = await getProfile();
        setUser(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        toast.success("Address deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("deleteAddress error:", error.message);
        toast.error(error.message || "Failed to delete address");
        return { success: false, error: error.message };
      }
    },
    [getProfile, secureFetch, API_BASE_URL]
  );

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();
      const validatedCart = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            itemId: item.itemId,
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || "https://via.placeholder.com/70",
          }))
        : [];

      console.log("Fetched cart:", validatedCart);
      setCart(validatedCart);
      return validatedCart;
    } catch (error) {
      console.error("fetchCart error:", error.message);
      return [];
    }
  }, [secureFetch, API_BASE_URL]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/favorites`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();
      const validatedFavorites = Array.isArray(data)
        ? data.map((fav) => ({
            id: fav.id,
            itemId: fav.itemId,
            name: fav.name || "Unnamed Item",
            price: Number(fav.price) || 0,
            image: fav.image || "https://via.placeholder.com/300",
            type: fav.type || "Veg",
          }))
        : [];

      console.log("Fetched favorites:", validatedFavorites);
      setFavorites(validatedFavorites);
      return validatedFavorites;
    } catch (error) {
      console.error("fetchFavorites error:", error.message);
      return [];
    }
  }, [secureFetch, API_BASE_URL]);

  // Fetch user orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/orders`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      const validatedOrders = Array.isArray(data) ? data : [];
      console.log("Fetched orders:", validatedOrders);
      setOrders(validatedOrders);
      return validatedOrders;
    } catch (error) {
      console.error("fetchOrders error:", error.message);
      return [];
    }
  }, [secureFetch, API_BASE_URL]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/notifications`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      const notificationsData = data.content || [];
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
      console.log("Fetched notifications:", notificationsData);
      return notificationsData;
    } catch (error) {
      console.error("fetchNotifications error:", error.message);
      return [];
    }
  }, [secureFetch, API_BASE_URL]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (id) => {
    try {
      await secureFetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
      });

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("markNotificationAsRead error:", error.message);
    }
  }, [secureFetch, API_BASE_URL]);

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(async () => {
    try {
      await secureFetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: "POST",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("markAllNotificationsRead error:", error.message);
    }
  }, [secureFetch, API_BASE_URL]);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    try {
      await secureFetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("deleteNotification error:", error.message);
    }
  }, [secureFetch, API_BASE_URL]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      await secureFetch(`${API_BASE_URL}/api/notifications/clear-all`, {
        method: "DELETE",
      });

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("clearAllNotifications error:", error.message);
    }
  }, [secureFetch, API_BASE_URL]);

  // Update notification preferences
  const updateNotificationPreferences = useCallback(async (prefs) => {
    try {
      await secureFetch(`${API_BASE_URL}/api/notifications/preferences`, {
        method: "PUT",
        body: JSON.stringify(prefs),
      });

      const updatedProfile = await getProfile();
      setUser(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      toast.success("Notification preferences updated!");
    } catch (error) {
      console.error("updateNotificationPreferences error:", error.message);
      toast.error("Failed to update preferences");
    }
  }, [getProfile, secureFetch, API_BASE_URL]);

  // Add to cart
  const addToCart = async (item) => {
    try {
      const cartItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      };

      const response = await secureFetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add to cart: ${response.status}`);
      }

      const savedItem = await response.json();
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((i) => i.itemId === savedItem.itemId);
        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = savedItem;
          return updatedCart;
        }
        return [...prevCart, savedItem];
      });

      toast.success("Item added to cart!");
    } catch (error) {
      console.error("addToCart error:", error.message);
      toast.error(error.message || "Failed to add to cart");
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to remove from cart: ${response.status}`);
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("removeFromCart error:", error.message);
      toast.error(error.message || "Failed to remove from cart");
    }
  };

  // Update cart item
  const updateCartItem = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const cartItem = cart.find((item) => item.id === itemId);
      if (!cartItem) throw new Error("Item not found in cart");

      const updatedItem = { ...cartItem, quantity: newQuantity };

      const response = await secureFetch(`${API_BASE_URL}/api/cart`, {
        method: "PUT",
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update cart item: ${response.status}`);
      }

      const savedItem = await response.json();
      setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? savedItem : item)));
      toast.success("Cart updated!");
    } catch (error) {
      console.error("updateCartItem error:", error.message);
      toast.error(error.message || "Failed to update cart item");
    }
  };

  // Add to favorites
  const addToFavorites = async (item) => {
    try {
      const favoriteItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        type: item.type,
      };

      const response = await secureFetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        body: JSON.stringify(favoriteItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add to favorites: ${response.status}`);
      }

      const savedItem = await response.json();
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((fav) => fav.itemId === savedItem.itemId)) {
          return prevFavorites;
        }
        return [...prevFavorites, savedItem];
      });

      toast.success("Added to favorites!");
    } catch (error) {
      console.error("addToFavorites error:", error.message);
      toast.error(error.message || "Failed to add to favorites");
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (itemId) => {
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/favorites/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to remove from favorites: ${response.status}`);
      }

      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.itemId !== itemId));
      toast.success("Removed from favorites!");
    } catch (error) {
      console.error("removeFromFavorites error:", error.message);
      toast.error(error.message || "Failed to remove from favorites");
    }
  };

  // Place order
  const placeOrder = async (orderDetails) => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      toast.error("Cannot place order: Your cart is empty");
      return { success: false };
    }

    try {
      const simplifiedCartItems = cart.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const payload = {
        ...orderDetails,
        addressLine1: orderDetails.addressLine1,
        addressLine2: orderDetails.addressLine2 || "",
        city: orderDetails.city,
        pincode: orderDetails.pincode,
        items: simplifiedCartItems,
        totalPrice: orderDetails.totalPrice || cart.reduce((total, item) => total + item.price * item.quantity, 0),
      };

      const response = await secureFetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to place order: ${response.status}`);
      }

      const savedOrder = await response.json();

      const lastOrderDetails = {
        ...savedOrder,
        addressLine1: orderDetails.addressLine1,
        addressLine2: orderDetails.addressLine2 || "",
        city: orderDetails.city,
        pincode: orderDetails.pincode,
        totalPrice: payload.totalPrice,
        items: simplifiedCartItems,
        createdAt: new Date().toISOString(),
        estimatedDelivery: "30-40 minutes",
      };

      setLastOrder(lastOrderDetails);
      localStorage.setItem("lastOrder", JSON.stringify(lastOrderDetails));
      setCart([]);
      await Promise.all([fetchCart(), fetchOrders()]);
      toast.success("Order placed successfully!");
      return { success: true, order: savedOrder };
    } catch (error) {
      console.error("placeOrder error:", error.message);
      toast.error(error.message || "Failed to place order");
      return { success: false, error: error.message };
    }
  };

  // Fetch menu items (public endpoint)
  const fetchMenu = useCallback(async (type = null) => {
    try {
      const url = type
        ? `${API_BASE_URL}/api/menu?type=${encodeURIComponent(type)}`
        : `${API_BASE_URL}/api/menu`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = "Failed to fetch menu";
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const items = data || [];
      const validatedMenu = Array.isArray(items)
        ? items.map((item) => ({
            id: item.id,
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
            category: item.category || { id: null, name: "unknown" },
            description: item.description || "No description available",
            image: item.image || "https://via.placeholder.com/300",
            offer: item.offer || null,
            rating: Number(item.rating) || 4.5,
            reviews: item.reviews || "New",
            type: item.type || "Veg",
          }))
        : [];

      console.log("Fetched menu:", validatedMenu);
      return validatedMenu;
    } catch (error) {
      console.error("fetchMenu error:", error.message);
      toast.error(error.message || "Failed to fetch menu");
      throw error;
    }
  }, [API_BASE_URL]);

  // Fetch menu by category (public endpoint)
  const fetchMenuByCategory = useCallback(async (category, type = null) => {
    try {
      const queryParams = new URLSearchParams();
      if (category !== "All") {
        queryParams.append("category", category);
      }
      if (type) {
        queryParams.append("type", type);
      }
      const url = `${API_BASE_URL}/api/menu${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Failed to fetch menu for category ${category}`;
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const items = data || [];
      const validatedMenu = Array.isArray(items)
        ? items.map((item) => ({
            id: item.id,
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
            category: item.category || { id: null, name: "unknown" },
            description: item.description || "No description available",
            image: item.image || "https://via.placeholder.com/300",
            offer: item.offer || null,
            rating: Number(item.rating) || 4.5,
            reviews: item.reviews || "New",
            type: item.type || "Veg",
          }))
        : [];

      console.log(`Fetched menu for category ${category}:`, validatedMenu);
      return validatedMenu;
    } catch (error) {
      console.error("fetchMenuByCategory error:", error.message);
      toast.error(error.message || `Failed to fetch menu for category ${category}`);
      throw error;
    }
  }, [API_BASE_URL]);

  // Submit contact form (public endpoint)
  const submitContactForm = useCallback(async (formData) => {
    try {
      console.log('Submitting contact form:', formData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Contact form submission failed:', errorData);
        throw new Error(errorData.message || `Failed to submit contact form: ${response.status}`);
      }

      const data = await response.json();
      console.log('Contact form submitted successfully:', data);
      toast.success(data.message || "Message sent successfully!");
      return { success: true };
    } catch (error) {
      console.error("submitContactForm error:", error.message);
      toast.error(error.message || "Failed to submit contact form");
      return { success: false, error: error.message };
    }
  }, [API_BASE_URL]);

  // ==================== PARTNER APPLICATION FUNCTIONS ====================

  // Submit partner application (public endpoint)
  const submitPartnerApplication = useCallback(async (applicationData) => {
    try {
      console.log('Submitting partner application:', applicationData);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}/api/partners/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Partner application submission failed:', errorData);
        throw new Error(errorData.message || `Failed to submit application: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Partner application submitted successfully:', data);
      toast.success(data.message || "Application submitted successfully!");
      return { success: true, data };
    } catch (error) {
      console.error("submitPartnerApplication error:", error.message);
      toast.error(error.message || "Failed to submit application");
      return { success: false, error: error.message };
    }
  }, [API_BASE_URL]);

  // Fetch partner applications (admin only)
  const fetchPartnerApplications = useCallback(async (status = "ALL") => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.append("status", status);
      
      const url = `${API_BASE_URL}/api/admin/partners${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await secureFetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched partner applications:", data);
      return data;
    } catch (error) {
      console.error("fetchPartnerApplications error:", error.message);
      toast.error(error.message || "Failed to fetch partner applications");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  // Approve partner application (admin only)
  const approvePartnerApplication = useCallback(async (applicationId) => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/partners/${applicationId}/approve`, {
        method: "PUT",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to approve application: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || "Application approved successfully!");
      return { success: true, data };
    } catch (error) {
      console.error("approvePartnerApplication error:", error.message);
      toast.error(error.message || "Failed to approve application");
      return { success: false, error: error.message };
    }
  }, [user, secureFetch, API_BASE_URL]);

  // Reject partner application (admin only)
  const rejectPartnerApplication = useCallback(async (applicationId, reason) => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }
    
    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/partners/${applicationId}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to reject application: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || "Application rejected successfully!");
      return { success: true, data };
    } catch (error) {
      console.error("rejectPartnerApplication error:", error.message);
      toast.error(error.message || "Failed to reject application");
      return { success: false, error: error.message };
    }
  }, [user, secureFetch, API_BASE_URL]);

  // ==================== ADMIN FUNCTIONS ====================

  const fetchAllUsers = useCallback(async (roleFilter = "ALL", statusFilter = "ALL") => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }

    try {
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const url = `${API_BASE_URL}/api/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await secureFetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched users:", data);
      return data;
    } catch (error) {
      console.error("fetchAllUsers error:", error.message);
      toast.error(error.message || "Failed to fetch users");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  const fetchAdminStats = useCallback(async (timeRange = "30d") => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return null;
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/stats?timeRange=${timeRange}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch stats: ${response.status}`);
      }

      const stats = await response.json();
      console.log("Fetched admin stats:", stats);
      return stats;
    } catch (error) {
      console.error("fetchAdminStats error:", error.message);
      toast.error(error.message || "Failed to fetch dashboard stats");
      return null;
    }
  }, [user, secureFetch, API_BASE_URL]);

  const bulkDeleteUsers = useCallback(async (userIds) => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return { success: false };
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      toast.error("No users selected for deletion");
      return { success: false };
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/users/bulk`, {
        method: "DELETE",
        body: JSON.stringify(userIds),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete users: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "Users deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("bulkDeleteUsers error:", error.message);
      toast.error(error.message || "Failed to delete users");
      return { success: false };
    }
  }, [user, secureFetch, API_BASE_URL]);

  const updateUserRole = useCallback(
    async (userId, role) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
          method: "PUT",
          body: JSON.stringify({ role }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update user role: ${response.status}`);
        }

        toast.success("User role updated successfully");
        return { success: true };
      } catch (error) {
        console.error("updateUserRole error:", error.message);
        toast.error(error.message || "Failed to update user role");
        return { success: false };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const deleteUser = useCallback(
    async (userId) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      if (userId === user?.id) {
        toast.error("You cannot delete your own account");
        return { success: false, error: "Cannot delete own account" };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete user: ${response.status}`);
        }

        toast.success("User deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("deleteUser error:", error.message);
        toast.error(error.message || "Failed to delete user");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const fetchAllOrders = useCallback(async () => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/orders`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched all orders:", data);
      return data;
    } catch (error) {
      console.error("fetchAllOrders error:", error.message);
      toast.error(error.message || "Failed to fetch orders");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update order status: ${response.status}`);
        }

        toast.success("Order status updated!");
        return { success: true };
      } catch (error) {
        console.error("updateOrderStatus error:", error.message);
        toast.error(error.message || "Failed to update order status");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const fetchAdminMenu = useCallback(async () => {
    if (user?.role !== "ADMIN") {
      console.error("Unauthorized access to admin menu");
      return [];
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/menu`);

      if (!response.ok) {
        let errorMessage = "Failed to fetch admin menu";
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const items = data || [];
      const validatedMenu = Array.isArray(items)
        ? items.map((item) => ({
            id: item.id,
            name: item.name || "Unnamed Item",
            price: Number(item.price) || 0,
            category: item.category || { id: null, name: "unknown" },
            categoryId: item.categoryId,
            categoryName: item.categoryName || "unknown",
            description: item.description || "No description available",
            image: item.image || "https://via.placeholder.com/300",
            type: item.type || "Veg",
          }))
        : [];

      console.log("Fetched admin menu:", validatedMenu);
      return validatedMenu;
    } catch (error) {
      console.error("fetchAdminMenu error:", error.message);
      toast.error(error.message || "Failed to fetch admin menu");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  const addMenuItem = useCallback(
    async (item) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const payload = {
          name: item.name,
          price: Number(item.price),
          description: item.description || "",
          image: item.image || "",
          categoryId: Number(item.categoryId),
          type: item.type,
        };

        console.log("addMenuItem payload:", payload);

        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to add menu item: ${response.status}`);
        }

        const newItem = await response.json();
        toast.success("Menu item added successfully!");
        return { success: true, item: newItem };
      } catch (error) {
        console.error("addMenuItem error:", error.message);
        toast.error(error.message || "Failed to add menu item");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const updateMenuItem = useCallback(
    async (id, item) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const payload = {
          id: Number(id),
          name: item.name,
          price: Number(item.price),
          description: item.description || "",
          image: item.image || "",
          categoryId: Number(item.categoryId),
          type: item.type,
        };

        console.log("updateMenuItem payload:", payload);

        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update menu item: ${response.status}`);
        }

        const updatedItem = await response.json();
        toast.success("Menu item updated successfully!");
        return { success: true, item: updatedItem };
      } catch (error) {
        console.error("updateMenuItem error:", error.message);
        toast.error(error.message || "Failed to update menu item");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const deleteMenuItem = useCallback(
    async (id) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete menu item: ${response.status}`);
        }

        toast.success("Menu item deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("deleteMenuItem error:", error.message);
        toast.error(error.message || "Failed to delete menu item");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const fetchContactMessages = useCallback(async () => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/contact`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch contact messages: ${response.status}`);
      }

      const messages = await response.json();
      setContactMessages(messages);
      console.log("Fetched contact messages:", messages);
      return messages;
    } catch (error) {
      console.error("fetchContactMessages error:", error.message);
      toast.error(error.message || "Failed to fetch contact messages");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  const deleteContactMessage = useCallback(
    async (id) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/contact/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete contact message: ${response.status}`);
        }

        setContactMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
        toast.success("Contact message deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("deleteContactMessage error:", error.message);
        toast.error(error.message || "Failed to delete contact message");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const fetchCategories = useCallback(async () => {
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }

    try {
      const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/categories`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      const validatedCategories = Array.isArray(data)
        ? data.map((category) => ({
            id: category.id,
            name: category.name || "Unnamed Category",
          }))
        : [];

      console.log("Fetched categories:", validatedCategories);
      return validatedCategories;
    } catch (error) {
      console.error("fetchCategories error:", error.message);
      toast.error(error.message || "Failed to fetch categories");
      return [];
    }
  }, [user, secureFetch, API_BASE_URL]);

  const addCategory = useCallback(
    async (categoryData) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      const { name } = categoryData;
      if (!name?.trim()) {
        toast.error("Category name is required");
        return { success: false, error: "Category name is required" };
      }

      if (name.length > 100) {
        toast.error("Category name must not exceed 100 characters");
        return { success: false, error: "Category name must not exceed 100 characters" };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/categories`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to add category: ${response.status}`);
        }

        const newCategory = await response.json();
        toast.success("Category added successfully!");
        return { success: true, category: newCategory };
      } catch (error) {
        console.error("addCategory error:", error.message);
        toast.error(error.message || "Failed to add category");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      const { name } = categoryData;
      if (!name?.trim()) {
        toast.error("Category name is required");
        return { success: false, error: "Category name is required" };
      }

      if (name.length > 100) {
        toast.error("Category name must not exceed 100 characters");
        return { success: false, error: "Category name must not exceed 100 characters" };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/categories/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update category: ${response.status}`);
        }

        const data = await response.json();
        toast.success(data.message || "Category updated successfully!");
        return { success: true };
      } catch (error) {
        console.error("updateCategory error:", error.message);
        toast.error(error.message || "Failed to update category");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  const deleteCategory = useCallback(
    async (id) => {
      if (user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }

      try {
        const response = await secureFetch(`${API_BASE_URL}/api/admin/menu/categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete category: ${response.status}`);
        }

        toast.success("Category deleted successfully!");
        return { success: true };
      } catch (error) {
        console.error("deleteCategory error:", error.message);
        toast.error(error.message || "Failed to delete category");
        return { success: false, error: error.message };
      }
    },
    [user, secureFetch, API_BASE_URL]
  );

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    return !!(storedToken && storedRefreshToken && user);
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === "ADMIN";
  }, [user]);

  // ADD THIS - Check if user is restaurant owner
  const isRestaurantOwner = useCallback(() => {
    return user?.role === "ROLE_RESTAURANT_OWNER" || user?.role === "RESTAURANT_OWNER";
  }, [user]);

  // Get auth status
  const getAuthStatus = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedToken || !storedRefreshToken) {
      return { isAuthenticated: false, needsRefresh: false, isValid: false };
    }

    const isValid = isValidToken(storedToken);
    const needsRefresh = !isValid;

    return {
      isAuthenticated: true,
      needsRefresh,
      isValid,
      user
    };
  }, [user, isValidToken]);

  // Context value - ADDED mustChangePassword and new functions
  const value = {
    // State
    user,
    token,
    refreshToken,
    loading,
    authLoading,
    cart,
    favorites,
    orders,
    lastOrder,
    contactMessages,
    notifications,
    unreadCount,
    isInitialized,
    mustChangePassword, // ADD THIS

    // Auth functions
    login,
    signup,
    verifySignupOtp,
    logout,
    forgotPassword,
    resetPassword,
    googleLogin,
    refreshAccessToken,

    // ADD THESE - Password change functions
    checkPasswordChangeRequirement,
    markPasswordChanged,

    // User profile functions
    getProfile,
    updateProfile,
    updatePassword,

    // Address functions
    addAddress,
    updateAddress,
    deleteAddress,

    // Cart functions
    addToCart,
    removeFromCart,
    updateCartItem,
    fetchCart,

    // Favorites functions
    addToFavorites,
    removeFromFavorites,
    fetchFavorites,

    // Order functions
    placeOrder,
    fetchOrders,

    // Notification functions
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    updateNotificationPreferences,

    // Menu functions (public)
    fetchMenu,
    fetchMenuByCategory,

    // Contact functions
    submitContactForm,

    // Partner functions
    submitPartnerApplication,
    fetchPartnerApplications,
    approvePartnerApplication,
    rejectPartnerApplication,

    // Admin functions
    fetchAllUsers,
    updateUserRole,
    deleteUser,
    bulkDeleteUsers,
    fetchAdminStats,
    fetchAllOrders,
    updateOrderStatus,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchContactMessages,
    deleteContactMessage,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,

    // Utility functions
    isAuthenticated,
    isAdmin,
    isRestaurantOwner, // ADD THIS
    getAuthStatus,
    isValidToken,
  };

  // Only show children when auth is initialized
  return (
    <AuthContext.Provider value={value}>
      {isInitialized && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;