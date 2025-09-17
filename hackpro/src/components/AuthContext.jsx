import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const isDev = window.location.origin.includes('localhost');
  const API_BASE_URL = isDev ? 'http://localhost:8885' : '';

  const getProfile = useCallback(async (authToken = token) => {
    if (!authToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Profile fetch failed with status: ${response.status}`);
      }

      const profile = await response.json();
      const validatedProfile = {
        id: profile.id,
        email: profile.email,
        name: profile.name || "",
        role: profile.role || "USER",
        profilePicture: profile.profilePicture || "",
        ordersCount: profile.ordersCount || 0,
        cartItemsCount: profile.cartItemsCount || 0,
        favoriteItemsCount: profile.favoriteItemsCount || 0,
        addresses: Array.isArray(profile.addresses) ? profile.addresses : [],
        emailOrderUpdates: profile.emailOrderUpdates !== null ? profile.emailOrderUpdates : false,
        emailPromotions: profile.emailPromotions !== null ? profile.emailPromotions : false,
        desktopNotifications: profile.desktopNotifications !== null ? profile.desktopNotifications : false,
      };
      console.log("Fetched profile:", validatedProfile);
      return validatedProfile;
    } catch (error) {
      console.error("getProfile error:", error.message);
      throw error;
    }
  }, [token]);

  const fetchCart = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
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
  }, [token]);

  const fetchFavorites = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
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
  }, [token]);

  const fetchOrders = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
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
  }, [token]);

  const fetchNotifications = useCallback(async (authToken = token) => {
    if (!authToken) return [];
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = response.data.content || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
      console.log("Fetched notifications:", data);
      return data;
    } catch (error) {
      console.error("fetchNotifications error:", error.message);
      return [];
    }
  }, [token]);

  const markNotificationAsRead = useCallback(async (id) => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("markNotificationAsRead error:", error.message);
    }
  }, [token]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!token) return;
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("markAllNotificationsRead error:", error.message);
    }
  }, [token]);

  const deleteNotification = useCallback(async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("deleteNotification error:", error.message);
    }
  }, [token]);

  const clearAllNotifications = useCallback(async () => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/clear-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("clearAllNotifications error:", error.message);
    }
  }, [token]);

  const updateNotificationPreferences = useCallback(async (prefs) => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/preferences`, prefs, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedProfile = await getProfile(token);
      setUser(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      toast.success("Notification preferences updated!");
    } catch (error) {
      console.error("updateNotificationPreferences error:", error.message);
      toast.error("Failed to update preferences");
    }
  }, [token, getProfile]);

  const fetchMenu = useCallback(async (type = null) => {
    try {
      const url = type
        ? `${API_BASE_URL}/api/menu?type=${encodeURIComponent(type)}`
        : `${API_BASE_URL}/api/menu`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  }, []);

  const fetchAdminMenu = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      console.error("Unauthorized access to admin menu");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
  }, [token, user]);

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
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  }, []);

  const updateProfile = useCallback(
    async (updatedData) => {
      if (!token) {
        toast.error("Please log in to update your profile");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        const updatedProfile = await getProfile(token);
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
    [token, getProfile]
  );

  const updatePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      if (!token) {
        toast.error("Please log in to update your password");
        return { success: false };
      }
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
        const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update password: ${response.status}`);
        }

        const data = await response.json();
        toast.success(data.message || "Password updated successfully!");
        return { success: true };
      } catch (error) {
        console.error("updatePassword error:", error.message);
        toast.error(error.message || "Failed to update password");
        return { success: false, error: error.message };
      }
    },
    [token]
  );

  const addAddress = useCallback(
    async (addressData) => {
      if (!token) {
        toast.error("Please log in to add an address");
        return { success: false };
      }
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
        const response = await fetch(`${API_BASE_URL}/api/auth/addresses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        const updatedProfile = await getProfile(token);
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
    [token, getProfile]
  );

  const updateAddress = useCallback(
    async (addressId, addressData) => {
      if (!token) {
        toast.error("Please log in to update an address");
        return { success: false };
      }
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
        const response = await fetch(`${API_BASE_URL}/api/auth/addresses/${addressId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        const updatedProfile = await getProfile(token);
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
    [token, getProfile]
  );

  const deleteAddress = useCallback(
    async (addressId) => {
      if (!token) {
        toast.error("Please log in to delete an address");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/addresses/${addressId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete address: ${response.status}`);
        }

        const updatedProfile = await getProfile(token);
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
    [token, getProfile]
  );

  const fetchAllUsers = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
  }, [token, user]);

  const updateUser = useCallback(
    async (userId, updates) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update user: ${response.status}`);
        }
        toast.success("User updated successfully!");
        return { success: true };
      } catch (error) {
        console.error("updateUser error:", error.message);
        toast.error(error.message || "Failed to update user");
        return { success: false, error: error.message };
      }
    },
    [token, user]
  );

  const deleteUser = useCallback(
    async (userId) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      if (userId === user?.id) {
        toast.error("You cannot delete your own account");
        return { success: false, error: "Cannot delete own account" };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const fetchAllOrders = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
  }, [token, user]);

  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const addMenuItem = useCallback(
    async (item) => {
      if (!token || user?.role !== "ADMIN") {
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
        const response = await fetch(`${API_BASE_URL}/api/admin/menu`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const updateMenuItem = useCallback(
    async (id, item) => {
      if (!token || user?.role !== "ADMIN") {
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
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const deleteMenuItem = useCallback(
    async (id) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const fetchContactMessages = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
  }, [token, user]);

  const deleteContactMessage = useCallback(
    async (id) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contact/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const submitContactForm = useCallback(async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit contact form: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "Message sent successfully!");
      return { success: true };
    } catch (error) {
      console.error("submitContactForm error:", error.message);
      toast.error(error.message || "Failed to submit contact form");
      return { success: false, error: error.message };
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") {
      toast.error("Unauthorized access");
      return [];
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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
  }, [token, user]);

  const addCategory = useCallback(
    async (categoryData) => {
      if (!token || user?.role !== "ADMIN") {
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
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/categories`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (!token || user?.role !== "ADMIN") {
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
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/categories/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  const deleteCategory = useCallback(
    async (id) => {
      if (!token || user?.role !== "ADMIN") {
        toast.error("Unauthorized access");
        return { success: false };
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    [token, user]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedLastOrder = localStorage.getItem("lastOrder");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (storedLastOrder) {
            setLastOrder(JSON.parse(storedLastOrder));
          }

          const [profile, cartData, favoritesData, ordersData, notificationsData] = await Promise.all([
            getProfile(storedToken).catch(() => null),
            fetchCart(storedToken).catch(() => []),
            fetchFavorites(storedToken).catch(() => []),
            fetchOrders(storedToken).catch(() => []),
            fetchNotifications(storedToken).catch(() => []),
          ]);

          if (profile) {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
          setCart(cartData || []);
          setFavorites(favoritesData || []);
          setOrders(ordersData || []);
          setNotifications(notificationsData || []);
          setUnreadCount(notificationsData.filter(n => !n.read).length || 0);
        } catch (error) {
          console.error("initializeAuth error:", error.message);
          if (error.message?.includes("401")) {
            logout();
            toast.error("Session expired. Please log in again.");
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [getProfile, fetchCart, fetchFavorites, fetchOrders, fetchNotifications]);

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setToken(data.token);
      setUser(userProfile);

      const [cartData, favoritesData, ordersData, notificationsData] = await Promise.all([
        fetchCart(data.token),
        fetchFavorites(data.token),
        fetchOrders(data.token),
        fetchNotifications(data.token),
      ]);

      setCart(cartData || []);
      setFavorites(favoritesData || []);
      setOrders(ordersData || []);
      setNotifications(notificationsData || []);
      setUnreadCount(notificationsData.filter(n => !n.read).length || 0);

      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("login error:", error.message);
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setAuthLoading(true);
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        const errorMessage =
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();
      toast.success(data.message || "OTP sent to your email!");
      return { success: true, email };
    } catch (error) {
      console.error("signup error:", error.message);
      toast.error(error.message || "Signup failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const verifySignupOtp = async (email, otp) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userProfile = await getProfile(data.token);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setToken(data.token);
      setUser(userProfile);

      setCart([]);
      setFavorites([]);
      setOrders([]);
      setLastOrder(null);
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem("lastOrder");

      toast.success(`Welcome aboard, ${data.name}!`);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("verifySignupOtp error:", error.message);
      toast.error(error.message || "OTP verification failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastOrder");
    setToken(null);
    setUser(null);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    setLastOrder(null);
    setContactMessages([]);
    setNotifications([]);
    setUnreadCount(0);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const placeOrder = async (orderDetails) => {
    if (!token) {
      toast.error("Please log in to place an order");
      return { success: false };
    }

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

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

  const addToCart = async (item) => {
    if (!token) {
      toast.error("Please log in to add items to cart");
      return;
    }
    try {
      const cartItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      };
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("addToCart error:", error.message);
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) {
      toast.error("Please log in to remove items from cart");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

  const updateCartItem = async (itemId, newQuantity) => {
    if (!token) {
      toast.error("Please log in to update cart");
      return;
    }
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      const cartItem = cart.find((item) => item.id === itemId);
      if (!cartItem) throw new Error("Item not found in cart");

      const updatedItem = { ...cartItem, quantity: newQuantity };
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update cart item: ${response.status}`);
      }

      const savedItem = await response.json();
      setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? savedItem : item)));
      toast.success(`Updated ${cartItem.name} to ${newQuantity}`);
    } catch (error) {
      console.error("updateCartItem error:", error.message);
      toast.error(error.message || "Failed to update cart item");
    }
  };

  const addToFavorites = async (item) => {
    if (!token) {
      toast.error("Please log in to add items to favorites");
      return;
    }
    try {
      const favoriteItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        type: item.type,
      };
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      toast.success(`${item.name} added to favorites!`);
    } catch (error) {
      console.error("addToFavorites error:", error.message);
      toast.error(error.message || "Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (itemId) => {
    if (!token) {
      toast.error("Please log in to remove items from favorites");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to remove from favorites: ${response.status}`);
      }

      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.itemId !== itemId));
      toast.success("Item removed from favorites!");
    } catch (error) {
      console.error("removeFromFavorites error:", error.message);
      toast.error(error.message || "Failed to remove from favorites");
    }
  };

  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to send OTP: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "OTP sent to your email!");
      return { success: true };
    } catch (error) {
      console.error("forgotPassword error:", error.message);
      toast.error(error.message || "Failed to send OTP");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      setAuthLoading(true);
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

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Password reset failed: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
      return { success: true };
    } catch (error) {
      console.error("resetPassword error:", error.message);
      toast.error(error.message || "Password reset failed");
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    authLoading,
    cart,
    favorites,
    orders,
    lastOrder,
    contactMessages,
    notifications,
    unreadCount,
    login,
    signup,
    verifySignupOtp,
    logout,
    getProfile,
    addToCart,
    removeFromCart,
    updateCartItem,
    addToFavorites,
    removeFromFavorites,
    forgotPassword,
    resetPassword,
    placeOrder,
    fetchOrders,
    fetchCart,
    fetchFavorites,
    fetchMenu,
    fetchAdminMenu,
    fetchMenuByCategory,
    updateProfile,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchAllUsers,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchContactMessages,
    deleteContactMessage,
    submitContactForm,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    updateNotificationPreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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