import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext";

const useProfileData = () => {
  const {
    user,
    token,
    getProfile,
    favorites,
    orders,
    fetchOrders,
    addToCart,
    removeFromFavorites,
    updateProfile,
    fetchContactMessages,
    deleteContactMessage,
    contactMessages,
    fetchAllUsers,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  // Sync localFavorites with favorites from useAuth
  useEffect(() => {
    setLocalFavorites(favorites || []);
  }, [favorites]);

  const fetchProfileAndData = useCallback(async () => {
    if (!token) {
      setError("Please log in to view your profile");
      setLoading(false);
      setOrdersLoading(false);
      return;
    }

    try {
      setLoading(true);
      setOrdersLoading(true);
      const timeout = (promise, time) =>
        Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), time)
          ),
        ]);
      const [profile] = await Promise.all([
        timeout(getProfile(), 5000),
        timeout(fetchOrders(), 5000),
      ]);
      if (profile) {
        setProfileData(profile);
      } else {
        throw new Error("Failed to load profile data");
      }
    } catch (err) {
      setError(`Failed to load profile: ${err.message || "An unexpected error occurred"}`);
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  }, [token, getProfile, fetchOrders]);

  const fetchAdminData = useCallback(async () => {
    try {
      const [usersData, ordersData, menuData, categoriesData] = await Promise.all([
        fetchAllUsers().catch(() => []),
        fetchAllOrders().catch(() => []),
        fetchAdminMenu().catch(() => []),
        fetchCategories().catch(() => []),
      ]);
      
      // Normalize roles for users
      const normalizedUsers = usersData.map(u => ({
        ...u,
        role: u.role?.replace("ROLE_", "").toUpperCase() || "USER",
      }));
      
      return {
        users: normalizedUsers || [],
        orders: ordersData || [],
        menuItems: menuData || [],
        categories: categoriesData || [],
      };
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      return {
        users: [],
        orders: [],
        menuItems: [],
        categories: [],
      };
    }
  }, [fetchAllUsers, fetchAllOrders, fetchAdminMenu, fetchCategories]);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      await fetchContactMessages();
    } catch (err) {
      setMessagesError(`Failed to fetch contact messages: ${err.message || "An unexpected error occurred"}`);
    } finally {
      setMessagesLoading(false);
    }
  }, [fetchContactMessages]);

  return {
    user,
    token,
    profileData,
    setProfileData,
    error,
    loading,
    ordersLoading,
    orders,
    localFavorites,
    setLocalFavorites,
    messagesLoading,
    messagesError,
    contactMessages,
    fetchProfileAndData,
    fetchAdminData,
    fetchMessages,
    addToCart,
    removeFromFavorites,
    updateProfile,
    deleteContactMessage,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useProfileData;