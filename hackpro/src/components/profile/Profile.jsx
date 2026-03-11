// src/components/profile/Profile.jsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaUserCircle,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaStar,
  FaTrash,
  FaCartPlus,
  FaMapPin,
  FaLock,
  FaBell,
  FaArrowLeft,
  FaUtensils,
  FaUsers,
  FaPlus,
  FaSave,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartLine,
  FaEye,
  FaSun,
  FaMoon,
  FaEyeSlash,
  FaTimes,
  FaHistory,
  FaChartBar,
  FaUserShield,
  FaBolt,
  FaSyncAlt,
  FaTachometerAlt,
  FaHandshake,
} from "react-icons/fa";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import useProfileData from "./useProfileData";
import usePagination from "./usePagination";
import Modal from "./Modal";
import { ProfileSkeleton, OrdersSkeleton, AdminSkeleton } from "./Skeleton";
import {
  ProfileWrapper,
  BackButton,
  ThemeToggle,
  ProfileContainer,
  ProfileSidebar,
  Avatar,
  AvatarInput,
  AvatarLabel,
  UserName,
  UserEmail,
  UserMemberSince,
  NotificationBell,
  NotificationDropdown,
  NotificationItem,
  NotificationTypeIndicator,
  NavMenu,
  NavItem,
  NavLink,
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
  Button,
  ProfileSection,
  SectionTitle,
  InfoGrid,
  Card,
  AdminCard,
  InfoLabel,
  InfoValue,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  OrderCard,
  OrderHeader,
  OrderId,
  OrderStatus,
  OrderDetails,
  OrderImage,
  OrderInfo,
  OrderTitle,
  OrderMeta,
  OrderMetaContent,
  OrderItems,
  OrderItem,
  FavoriteItem,
  FavoriteImage,
  FavoriteContent,
  FavoriteTitle,
  FavoriteMeta,
  LoadingContainer,
  Spinner,
  LoadingText,
  ErrorMessage,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminTableCell,
  AdminSelect,
  AdminFormInput,
  MessagesLoadingContainer,
  MessagesErrorMessage,
  ConfirmationModalContent,
  ConfirmationText,
  ConfirmationButtons,
  SearchContainer,
  SearchInput,
  SkeletonCard,
  PaginationContainer,
  PaginationButton,
  PasswordStrengthMeter,
  ProgressBar,
  ProgressFill,
  BulkActions,
  ExportButton,
  AnalyticsCard,
  AnalyticsItem,
  AnalyticsValue,
  AnalyticsLabel,
  NotificationPanel,
  UserListContainer,
  UserCheckboxLabel,
  SelectAllLabel,
} from "./styles";
import ProfileSectionComponent from "./sections/ProfileSection";
import OrdersSection from "./sections/OrdersSection";
import FavoritesSection from "./sections/FavoritesSection";
import NotificationsSection from "./sections/NotificationsSection";
import SettingsSection from "./sections/SettingsSection";
import AdminSection from "./sections/AdminSection";
import ContactMessagesSection from "./sections/ContactMessagesSection";
import EditProfileModal from "./modals/EditProfileModal";
import AddressModal from "./modals/AddressModal";
import PasswordModal from "./modals/PasswordModal";
import MenuItemModal from "./modals/MenuItemModal";
import CategoryModal from "./modals/CategoryModal";
import OrderDetailsModal from "./modals/OrderDetailsModal";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
import NotificationSettingsModal from "./modals/NotificationSettingsModal";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    logout,
    user,
    loading: authLoading,
    fetchPartnerApplications: fetchPartnerApps,
    approvePartnerApplication: approvePartnerApp,
    rejectPartnerApplication: rejectPartnerApp,
    token
  } = useAuth();

  const {
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
  } = useProfileData();

  // Redirect admin from /profile to /admin/profile
  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN" && location.pathname === "/profile") {
      navigate("/admin/profile", { replace: true });
    }
  }, [user?.role, authLoading, location.pathname, navigate]);

  // API URL helpers
  const isDev = window.location.origin.includes('localhost');
  const getApiUrl = useCallback((path) => {
    return isDev ? `http://localhost:8885${path}` : path;
  }, [isDev]);

  // ─── State ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isNotificationSettingsModalOpen, setIsNotificationSettingsModalOpen] = useState(false);
  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", id: null });
  const [editAddress, setEditAddress] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profilePicture: "" });
  const [addressForm, setAddressForm] = useState({
    addressLine1: "", addressLine2: "", city: "", pincode: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [menuItemForm, setMenuItemForm] = useState({
    name: "", price: "", description: "", image: "", categoryId: "", type: "Veg",
  });
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrderUpdates: true, emailPromotions: true, desktopNotifications: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("All");
  const [notificationForm, setNotificationForm] = useState({
    userIds: [], title: '', content: '', imageUrl: '', type: 'promotion', scheduleDate: null,
  });
  const [categories, setCategories] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // ─── Partner Applications ─────────────────────────────────────────────────
  const [partnerApplications, setPartnerApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);

  // ─── Normalize role ───────────────────────────────────────────────────────
  const normalizeRole = useCallback((role) => {
    if (!role) return "USER";
    return role.replace("ROLE_", "").toUpperCase();
  }, []);

  const formatRoleForBackend = useCallback((role) => {
    return `ROLE_${role.toUpperCase()}`;
  }, []);

  // ─── Partner application handlers ─────────────────────────────────────────
  const loadPartnerApplications = useCallback(async () => {
    if (!user || normalizeRole(user?.role) !== "ADMIN") return;
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const data = await fetchPartnerApps('ALL');
      setPartnerApplications(data || []);
    } catch (err) {
      console.error('Error loading partner applications:', err);
      setApplicationsError(err.message || 'Failed to load applications');
      toast.error('Failed to load partner applications');
    } finally {
      setApplicationsLoading(false);
    }
  }, [user, fetchPartnerApps, normalizeRole]);

  const handleApproveApplication = useCallback(async (id) => {
    try {
      const result = await approvePartnerApp(id);
      if (result?.success) {
        toast.success('Application approved successfully');
        await loadPartnerApplications();
      }
    } catch (err) {
      console.error('Error approving application:', err);
      toast.error(err.message || 'Failed to approve application');
    }
  }, [approvePartnerApp, loadPartnerApplications]);

  const handleRejectApplication = useCallback(async (id, reason) => {
    try {
      const result = await rejectPartnerApp(id, reason);
      if (result?.success) {
        toast.success('Application rejected successfully');
        await loadPartnerApplications();
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      toast.error(err.message || 'Failed to reject application');
    }
  }, [rejectPartnerApp, loadPartnerApplications]);

  // ─── Effects ──────────────────────────────────────────────────────────────

  // Profile completion
  useEffect(() => {
    if (profileData) {
      let completion = 0;
      if (profileData.name) completion += 25;
      if (profileData.email) completion += 25;
      if (profileData.profilePicture) completion += 25;
      if (profileData.addresses?.length > 0) completion += 25;
      setProfileCompletion(completion);
    }
  }, [profileData]);

  // Password strength
  const calculatePasswordStrength = useCallback((password) => {
    if (password.length === 0) return "";
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (strength <= 1) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  }, []);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordForm.newPassword));
  }, [passwordForm.newPassword, calculatePasswordStrength]);

  // Debounced search
  const debouncedSearch = useRef(debounce((q) => setSearchQuery(q), 300)).current;
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  // Notifications fetch + SSE
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(getApiUrl('/api/notifications'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.content || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [token, getApiUrl]);

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
    const es = new EventSource(`${getApiUrl('/api/notifications/sse')}?token=${token}`);
    es.onmessage = (event) => {
      try {
        const n = JSON.parse(event.data);
        setNotifications(prev => [n, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.info(`New notification: ${n.title}`);
      } catch { /* ignore parse errors */ }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [token, getApiUrl, fetchNotifications]);

  // Load profile + admin data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      await fetchProfileAndData();
      if (normalizeRole(user?.role) === "ADMIN") {
        const adminData = await fetchAdminData();
        if (mounted) {
          setAllUsers(adminData.users || []);
          setAllOrders(adminData.orders || []);
          setMenuItems(adminData.menuItems || []);
          setCategories(adminData.categories || []);
          setPendingOrders(adminData.orders.filter(o => o.status === "Pending"));
        }
      }
    };
    load();
    if ("Notification" in window && notificationSettings.desktopNotifications) {
      Notification.requestPermission();
    }
    return () => { mounted = false; };
  }, [user?.role, fetchProfileAndData, fetchAdminData, token,
      notificationSettings.desktopNotifications, getApiUrl, normalizeRole]);

  // Load partner applications
  useEffect(() => {
    if (user && normalizeRole(user?.role) === "ADMIN") {
      loadPartnerApplications();
    }
  }, [user, loadPartnerApplications, normalizeRole]);

  // Notification preferences from profile
  useEffect(() => {
    if (profileData) {
      setNotificationSettings({
        emailOrderUpdates: profileData.emailOrderUpdates ?? true,
        emailPromotions: profileData.emailPromotions ?? true,
        desktopNotifications: profileData.desktopNotifications ?? false,
      });
    }
  }, [profileData]);

  // Load messages on tab open
  useEffect(() => {
    if (normalizeRole(user?.role) === "ADMIN" && activeTab === "contact-messages") {
      fetchMessages();
    }
  }, [user?.role, activeTab, fetchMessages, normalizeRole]);

  // Load categories on admin tab
  useEffect(() => {
    if (normalizeRole(user?.role) === "ADMIN" && activeTab === "admin") {
      fetchCategories().then(c => setCategories(c || []));
    }
  }, [user?.role, activeTab, fetchCategories, normalizeRole]);

  // ─── Filtered / paginated data ────────────────────────────────────────────
  const filteredOrders = useMemo(
    () => orders.filter(o => orderFilter === "All" ? true : o.status === orderFilter),
    [orders, orderFilter]
  );

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [allUsers, searchQuery]);

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems;
    const q = searchQuery.toLowerCase();
    return menuItems.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
  }, [menuItems, searchQuery]);

  const filteredContactMessages = useMemo(() => {
    if (!searchQuery) return contactMessages;
    const q = searchQuery.toLowerCase();
    return contactMessages.filter(m =>
      m.firstName?.toLowerCase().includes(q) || m.lastName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) || m.message?.toLowerCase().includes(q)
    );
  }, [contactMessages, searchQuery]);

  const filteredNotifications = useMemo(() => notifications.filter(n => {
    if (notificationFilter === "Unread") return !n.read;
    if (notificationFilter === "Orders") return n.type === 'order';
    if (notificationFilter === "Promotions") return n.type === 'promotion';
    return true;
  }), [notifications, notificationFilter]);

  const usersPagination = usePagination(filteredUsers, 5);
  const menuItemsPagination = usePagination(filteredMenuItems, 5);
  const contactMessagesPagination = usePagination(filteredContactMessages, 5);
  const notificationsPagination = usePagination(filteredNotifications, 10);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    logout();
    toast.dismiss();
    toast.success("Logged out successfully!", { toastId: "logout-unique" });
    navigate("/login");
  }, [logout, navigate]);

  // ─── Profile handlers ─────────────────────────────────────────────────────
  const handleProfilePictureChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload a valid image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image size must be less than 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const b64 = reader.result;
      setProfilePicture(b64);
      try {
        const result = await updateProfile({ ...formData, profilePicture: b64 });
        if (result.success) {
          setProfileData(prev => ({ ...prev, profilePicture: b64 }));
          setFormData(prev => ({ ...prev, profilePicture: b64 }));
          toast.success("Profile picture updated!");
        } else throw new Error(result.error || "Failed");
      } catch (err) {
        toast.error(`Failed to update picture: ${err.message}`);
      }
    };
    reader.readAsDataURL(file);
  }, [formData, updateProfile, setProfileData]);

  const handleProfileUpdate = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    if (!/^[A-Za-z\s]{2,50}$/.test(formData.name)) {
      toast.error("Name must be 2-50 characters, letters only"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format"); return;
    }
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setProfileData(prev => ({ ...prev, ...formData }));
        setIsEditModalOpen(false);
        toast.success("Profile updated!");
      } else throw new Error(result.error);
    } catch (err) {
      toast.error(`Failed to update profile: ${err.message}`);
    }
  }, [formData, updateProfile, setProfileData]);

  // ─── Address handlers ─────────────────────────────────────────────────────
  const handleAddressSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { addressLine1, city, pincode } = addressForm;
    if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Address Line 1, City, and Pincode are required"); return;
    }
    if (!/^\d{6}$/.test(pincode)) { toast.error("Pincode must be 6 digits"); return; }
    try {
      if (editAddress) {
        const result = await updateAddress(editAddress.id, { addressLine1, addressLine2: addressForm.addressLine2, city, pincode });
        if (result.success) {
          setProfileData(prev => ({ ...prev, addresses: prev.addresses?.map(a => a.id === editAddress.id ? result.address : a) || [] }));
          toast.success("Address updated!");
        } else throw new Error(result.error);
      } else {
        const result = await addAddress({ addressLine1, addressLine2: addressForm.addressLine2, city, pincode });
        if (result.success) {
          setProfileData(prev => ({ ...prev, addresses: [...(prev.addresses || []), result.address] }));
          toast.success("Address added!");
        } else throw new Error(result.error);
      }
      setIsAddressModalOpen(false);
      setAddressForm({ addressLine1: "", addressLine2: "", city: "", pincode: "" });
      setEditAddress(null);
    } catch (err) {
      toast.error(`Failed to save address: ${err.message}`);
    }
  }, [addressForm, editAddress, updateAddress, addAddress, setProfileData]);

  const handleDeleteAddress = useCallback((id) => {
    setDeleteTarget({ type: "address", id });
    setIsConfirmDeleteModalOpen(true);
  }, []);

  // ─── Master delete handler (handles all types) ─────────────────────────────
  const handleDelete = useCallback(async () => {
    try {
      const { type, id } = deleteTarget;
      if (type === "address") {
        const result = await deleteAddress(id);
        if (!result.success) throw new Error(result.error);
        setProfileData(prev => ({ ...prev, addresses: prev.addresses?.filter(a => a.id !== id) || [] }));
        toast.success("Address deleted!");
      } else if (type === "user") {
        const result = await deleteUser(id);
        if (!result.success) throw new Error(result.error);
        setAllUsers(prev => prev.filter(u => u.id !== id));
        setAllOrders(prev => prev.filter(o => o.userId !== id));
        toast.success("User deleted!");
      } else if (type === "menuItem") {
        const result = await deleteMenuItem(id);
        if (!result.success) throw new Error(result.error);
        setMenuItems(prev => prev.filter(i => i.id !== id));
        toast.success("Menu item deleted!");
      } else if (type === "contactMessage") {
        const result = await deleteContactMessage(id);
        if (!result.success) throw new Error(result.error);
        fetchMessages();
        toast.success("Message deleted!");
      } else if (type === "category") {
        const result = await deleteCategory(id);
        if (!result.success) throw new Error(result.error);
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success("Category deleted!");
      }
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setDeleteTarget({ type: "", id: null });
    }
  }, [deleteTarget, deleteAddress, deleteUser, deleteMenuItem, deleteContactMessage, deleteCategory, fetchMessages, setProfileData]);

  // ─── Direct delete functions for AdminSection (no modal needed — AdminSection has its own) ──
  const handleDeleteUserDirect = useCallback(async (userId) => {
    if (userId === user?.id) { toast.error("You cannot delete your own account!"); return; }
    try {
      const result = await deleteUser(userId);
      if (!result.success) throw new Error(result.error);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      setAllOrders(prev => prev.filter(o => o.userId !== userId));
      toast.success("User deleted!");
    } catch (err) {
      toast.error(`Failed to delete user: ${err.message}`);
    }
  }, [user?.id, deleteUser]);

  const handleDeleteMenuItemDirect = useCallback(async (id) => {
    try {
      const result = await deleteMenuItem(id);
      if (!result.success) throw new Error(result.error);
      setMenuItems(prev => prev.filter(i => i.id !== id));
      toast.success("Menu item deleted!");
    } catch (err) {
      toast.error(`Failed to delete menu item: ${err.message}`);
    }
  }, [deleteMenuItem]);

  const handleDeleteCategoryDirect = useCallback(async (id) => {
    try {
      const result = await deleteCategory(id);
      if (!result.success) throw new Error(result.error);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted!");
    } catch (err) {
      toast.error(`Failed to delete category: ${err.message}`);
    }
  }, [deleteCategory]);

  // ─── Order handlers ───────────────────────────────────────────────────────
  const handleReorder = useCallback(async (order) => {
    try {
      if (Array.isArray(order.items) && order.items.length > 0) {
        for (const item of order.items) {
          await addToCart({ id: item.itemId, name: item.name, price: item.price, quantity: item.quantity, image: item.image });
        }
        toast.success("Items added to cart!");
        navigate("/cart");
      } else {
        toast.error("No items found in this order.");
      }
    } catch (err) {
      toast.error(`Failed to reorder: ${err.message}`);
    }
  }, [addToCart, navigate]);

  const handleViewOrder = useCallback((order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  }, []);

  const handleUpdateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) throw new Error(result.error);
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setPendingOrders(prev => prev.filter(o => o.id !== orderId || newStatus === "Pending"));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      toast.success("Order status updated!");
    } catch (err) {
      toast.error(`Failed to update order: ${err.message}`);
    }
  }, [updateOrderStatus, selectedOrder?.id]);

  // ─── Menu Item handlers ───────────────────────────────────────────────────
  const openMenuItemModal = useCallback(() => {
    if (categories.length === 0) {
      toast.error("No categories available. Please add a category first.");
      setIsCategoryModalOpen(true);
      return;
    }
    setEditMenuItem(null);
    setMenuItemForm({ name: "", price: "", description: "", image: "", categoryId: categories[0]?.id || "", type: "Veg" });
    setIsMenuItemModalOpen(true);
  }, [categories]);

  const handleAddMenuItem = useCallback(async (e) => {
    e.preventDefault();
    if (!menuItemForm.name.trim()) { toast.error("Name is required"); return; }
    if (isNaN(menuItemForm.price) || Number(menuItemForm.price) <= 0) { toast.error("Price must be a positive number"); return; }
    if (!menuItemForm.categoryId) { toast.error("Category is required"); return; }
    if (!menuItemForm.type) { toast.error("Type is required"); return; }
    try {
      const payload = {
        name: menuItemForm.name,
        price: Number(menuItemForm.price),
        description: menuItemForm.description,
        image: menuItemForm.image,
        categoryId: Number(menuItemForm.categoryId),
        type: menuItemForm.type,
      };
      const result = editMenuItem
        ? await updateMenuItem(editMenuItem.id, payload)
        : await addMenuItem(payload);
      if (!result.success) throw new Error(result.error);
      const updated = await fetchAdminMenu();
      setMenuItems(updated || []);
      setIsMenuItemModalOpen(false);
      setMenuItemForm({ name: "", price: "", description: "", image: "", categoryId: categories[0]?.id || "", type: "Veg" });
      setEditMenuItem(null);
      toast.success(editMenuItem ? "Menu item updated!" : "Menu item added!");
    } catch (err) {
      toast.error(`Failed to save menu item: ${err.message}`);
    }
  }, [menuItemForm, editMenuItem, updateMenuItem, addMenuItem, fetchAdminMenu, categories]);

  const handleEditMenuItem = useCallback((item) => {
    setEditMenuItem(item);
    setMenuItemForm({
      name: item.name || "",
      price: item.price ? item.price.toString() : "",
      description: item.description || "",
      image: item.image || "",
      categoryId: item.categoryId || item.category?.id || categories[0]?.id || "",
      type: item.type || "Veg",
    });
    setIsMenuItemModalOpen(true);
  }, [categories]);

  // handleDeleteMenuItem used in profile (opens confirm modal)
  const handleDeleteMenuItem = useCallback((id) => {
    setDeleteTarget({ type: "menuItem", id });
    setIsConfirmDeleteModalOpen(true);
  }, []);

  // ─── Category handlers ────────────────────────────────────────────────────
  const handleAddCategory = useCallback(async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) { toast.error("Category name is required"); return; }
    try {
      if (editCategory) {
        const result = await updateCategory(editCategory.id, { name: categoryForm.name });
        if (!result.success) throw new Error(result.error);
        setCategories(prev => prev.map(c => c.id === editCategory.id ? { ...c, name: categoryForm.name } : c));
        toast.success("Category updated!");
      } else {
        const result = await addCategory({ name: categoryForm.name });
        if (!result.success) throw new Error(result.error);
        setCategories(prev => [...prev, result.category]);
        toast.success("Category added!");
      }
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: "" });
      setEditCategory(null);
    } catch (err) {
      toast.error(`Failed to save category: ${err.message}`);
    }
  }, [categoryForm, editCategory, updateCategory, addCategory]);

  const handleEditCategory = useCallback((category) => {
    setEditCategory(category);
    setCategoryForm({ name: category.name || "" });
    setIsCategoryModalOpen(true);
  }, []);

  const handleDeleteCategory = useCallback((id) => {
    setDeleteTarget({ type: "category", id });
    setIsConfirmDeleteModalOpen(true);
  }, []);

  // ─── Favorites ────────────────────────────────────────────────────────────
  const handleRemoveFromFavorites = useCallback(async (itemId) => {
    try {
      await removeFromFavorites(itemId);
      setLocalFavorites(prev => prev.filter(i => i.itemId !== itemId));
      toast.success("Removed from favorites!");
    } catch (err) {
      toast.error(`Failed to remove: ${err.message}`);
    }
  }, [removeFromFavorites, setLocalFavorites]);

  // ─── Contact messages ─────────────────────────────────────────────────────
  const handleDeleteContactMessage = useCallback((id) => {
    setDeleteTarget({ type: "contactMessage", id });
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const handleFetchContactMessages = useCallback(async () => {
    await fetchMessages();
  }, [fetchMessages]);

  // ─── Search ───────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  // ─── Bulk actions ─────────────────────────────────────────────────────────
  const handleBulkAction = useCallback(async (action, value) => {
    if (selectedItems.length === 0) { toast.error("Please select items first"); return; }
    try {
      if (action === "delete") {
        for (const id of selectedItems) await deleteUser(id);
        setAllUsers(prev => prev.filter(u => !selectedItems.includes(u.id)));
        setSelectedItems([]);
        toast.success("Selected users deleted!");
      } else if (action === "role" && value) {
        for (const id of selectedItems) await updateUser(id, { role: formatRoleForBackend(value) });
        setAllUsers(prev => prev.map(u => selectedItems.includes(u.id) ? { ...u, role: value } : u));
        setSelectedItems([]);
        toast.success(`Role updated to ${value}!`);
      }
    } catch (err) {
      toast.error(`Bulk action failed: ${err.message}`);
    }
  }, [selectedItems, deleteUser, updateUser, formatRoleForBackend]);

  // ─── User role ────────────────────────────────────────────────────────────
  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    try {
      const result = await updateUser(userId, { role: formatRoleForBackend(newRole) });
      if (!result.success) throw new Error(result.error);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated!");
    } catch (err) {
      toast.error(`Failed to update role: ${err.message}`);
    }
  }, [updateUser, formatRoleForBackend]);

  // handleDeleteUser for profile modals (uses confirm modal)
  const handleDeleteUser = useCallback((userId) => {
    if (userId === user?.id) { toast.error("You cannot delete your own account!"); return; }
    setDeleteTarget({ type: "user", id: userId });
    setIsConfirmDeleteModalOpen(true);
  }, [user?.id]);

  // ─── Export ───────────────────────────────────────────────────────────────
  const exportToCSV = useCallback((data, filename) => {
    if (!data.length) { toast.error("No data to export"); return; }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item =>
      Object.values(item).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(",")
    ).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${filename}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success(`${filename} exported!`);
  }, []);

  const handleExportData = useCallback(() => {
    exportToCSV([{ profile: profileData, orders, favorites: localFavorites, addresses: profileData?.addresses || [] }], 'user-data');
  }, [profileData, orders, localFavorites, exportToCSV]);

  // ─── Notification handlers ────────────────────────────────────────────────
  const toggleNotifications = useCallback(() => setShowNotifications(p => !p), []);

  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await axios.put(getApiUrl(`/api/notifications/${id}/read`), {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { toast.error("Failed to mark as read"); }
  }, [getApiUrl, token]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await axios.post(getApiUrl('/api/notifications/mark-all-read'), {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (err) { toast.error("Failed"); }
  }, [getApiUrl, token]);

  const handleDeleteNotification = useCallback(async (id, e) => {
    e?.stopPropagation();
    try {
      await axios.delete(getApiUrl(`/api/notifications/${id}`), { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success("Notification deleted");
    } catch (err) { toast.error("Failed to delete"); }
  }, [getApiUrl, token]);

  const handleClearAll = useCallback(async () => {
    try {
      await axios.delete(getApiUrl('/api/notifications/clear-all'), { headers: { Authorization: `Bearer ${token}` } });
      setNotifications([]); setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (err) { toast.error("Failed to clear"); }
  }, [getApiUrl, token]);

  const handleNotificationSettingsUpdate = useCallback(async (e) => {
    e.preventDefault();
    try {
      await axios.put(getApiUrl('/api/notifications/preferences'), notificationSettings, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Notification settings updated!");
      setIsNotificationSettingsModalOpen(false);
      if (notificationSettings.desktopNotifications && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } catch (err) { toast.error(`Failed: ${err.message}`); }
  }, [getApiUrl, token, notificationSettings]);

  const handleSendNotification = useCallback(async (e) => {
    e.preventDefault();
    if (!notificationForm.title.trim() || !notificationForm.content.trim()) {
      toast.error("Title and content are required"); return;
    }
    try {
      const payload = { ...notificationForm, scheduleDate: notificationForm.scheduleDate?.toISOString() || null };
      await axios.post(getApiUrl('/api/admin/notifications'), payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Notification sent!");
      setIsSendNotificationModalOpen(false);
      setNotificationForm({ userIds: [], title: '', content: '', imageUrl: '', type: 'promotion', scheduleDate: null });
    } catch (err) { toast.error("Failed to send notification"); }
  }, [getApiUrl, token, notificationForm]);

  // ─── Password ─────────────────────────────────────────────────────────────
  const handlePasswordUpdate = useCallback(async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (passwordStrength === "weak") { toast.error("Password is too weak"); return; }
    try {
      const result = await updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      if (!result.success) throw new Error(result.error);
      toast.success("Password updated!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast.error(`Failed: ${err.message}`); }
  }, [passwordForm, passwordStrength, updatePassword]);

  // ─── Navigation ───────────────────────────────────────────────────────────
  const handleGoBack = useCallback(() => navigate("/"), [navigate]);
  const openAdminDashboard = useCallback(() => navigate("/admin/dashboard"), [navigate]);

  // ─── Refresh data for AdminSection ───────────────────────────────────────
  const refreshData = useMemo(() => ({
    users: async () => {
      const d = await fetchAdminData();
      setAllUsers(d.users || []);
    },
    orders: async () => {
      const o = await fetchAllOrders();
      setAllOrders(o || []);
    },
    menu: async () => {
      const m = await fetchAdminMenu();
      setMenuItems(m || []);
    },
    categories: async () => {
      const c = await fetchCategories();
      setCategories(c || []);
    },
    applications: loadPartnerApplications,
    notifications: fetchNotifications,
    all: async () => {
      const [d, o, m, c] = await Promise.all([fetchAdminData(), fetchAllOrders(), fetchAdminMenu(), fetchCategories()]);
      setAllUsers(d.users || []);
      setAllOrders(o || []);
      setMenuItems(m || []);
      setCategories(c || []);
      loadPartnerApplications();
    },
  }), [fetchAdminData, fetchAllOrders, fetchAdminMenu, fetchCategories, loadPartnerApplications, fetchNotifications]);

  // ─── Early returns ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <LoadingContainer>
          <Spinner theme={{ mode: theme }} />
          <LoadingText theme={{ mode: theme }}>Please log in to view your profile...</LoadingText>
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  if (loading) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <LoadingContainer>
          <Spinner theme={{ mode: theme }} />
          <LoadingText theme={{ mode: theme }}>Loading your profile...</LoadingText>
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  if (error) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <ProfileContainer>
          <ProfileContent theme={{ mode: theme }}>
            <ErrorMessage theme={{ mode: theme }}>{error}</ErrorMessage>
          </ProfileContent>
        </ProfileContainer>
      </ProfileWrapper>
    );
  }

  const isAdmin = normalizeRole(user?.role) === "ADMIN";
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  // ─── ALL MODALS (always rendered regardless of route) ─────────────────────
  const modals = (
    <>
      <MenuItemModal
        isOpen={isMenuItemModalOpen}
        onClose={() => setIsMenuItemModalOpen(false)}
        editMenuItem={editMenuItem}
        menuItemForm={menuItemForm}
        setMenuItemForm={setMenuItemForm}
        categories={categories}
        handleAddMenuItem={handleAddMenuItem}
        theme={theme}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        editCategory={editCategory}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        handleAddCategory={handleAddCategory}
        theme={theme}
      />
      <OrderDetailsModal
        isOpen={isOrderDetailsModalOpen}
        onClose={() => setIsOrderDetailsModalOpen(false)}
        selectedOrder={selectedOrder}
        normalizeRole={normalizeRole}
        user={user}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        theme={theme}
      />
      <DeleteConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        deleteTarget={deleteTarget}
        handleDelete={handleDelete}
        theme={theme}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleProfileUpdate={handleProfileUpdate}
        theme={theme}
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        editAddress={editAddress}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        handleAddressSubmit={handleAddressSubmit}
        theme={theme}
      />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        passwordStrength={passwordStrength}
        handlePasswordUpdate={handlePasswordUpdate}
        theme={theme}
      />
      <NotificationSettingsModal
        isOpen={isNotificationSettingsModalOpen}
        onClose={() => setIsNotificationSettingsModalOpen(false)}
        notificationSettings={notificationSettings}
        setNotificationSettings={setNotificationSettings}
        handleNotificationSettingsUpdate={handleNotificationSettingsUpdate}
        theme={theme}
      />
    </>
  );

  // ─── Admin Dashboard route (full-page) ────────────────────────────────────
  if (isAdminDashboard) {
    return (
      <>
        <AdminSection
          key="admin-section"
          allUsers={filteredUsers}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          handleBulkAction={handleBulkAction}
          exportToCSV={exportToCSV}
          allOrders={allOrders}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          handleViewOrder={handleViewOrder}
          menuItems={filteredMenuItems}
          categories={categories}
          // ── These open Profile's modals (which are always mounted now) ──
          openMenuItemModal={openMenuItemModal}
          handleEditMenuItem={handleEditMenuItem}
          handleEditCategory={handleEditCategory}
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          setEditCategory={setEditCategory}
          setCategoryForm={setCategoryForm}
          // ── Direct action functions (no intermediate modal) ──
          handleDeleteMenuItem={handleDeleteMenuItemDirect}
          handleDeleteCategory={handleDeleteCategoryDirect}
          handleDeleteUser={handleDeleteUserDirect}
          normalizeRole={normalizeRole}
          handleUpdateUserRole={handleUpdateUserRole}
          theme={theme}
          usersLoading={loading}
          usersError={error}
          ordersLoading={ordersLoading}
          ordersError={null}
          menuLoading={loading}
          menuError={null}
          categoriesLoading={loading}
          categoriesError={null}
          onBack={() => navigate(-1)}
          refreshData={refreshData}
          token={token}
          getApiUrl={getApiUrl}
          partnerApplications={partnerApplications}
          handleApproveApplication={handleApproveApplication}
          handleRejectApplication={handleRejectApplication}
          applicationsLoading={applicationsLoading}
          applicationsError={applicationsError}
        />
        {/* Modals always rendered so openMenuItemModal / category modal work */}
        {modals}
      </>
    );
  }

  // ─── Regular profile view ─────────────────────────────────────────────────
  return (
    <ProfileWrapper theme={{ mode: theme }}>
      <BackButton onClick={handleGoBack} aria-label="Go back to homepage" theme={{ mode: theme }}>
        <FaArrowLeft />
      </BackButton>
      <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme" theme={{ mode: theme }}>
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </ThemeToggle>

      <ProfileContainer>
        {/* ── Sidebar ── */}
        <ProfileSidebar theme={{ mode: theme }}>
          <Avatar theme={{ mode: theme }}>
            {profilePicture || profileData?.profilePicture ? (
              <img
                src={profilePicture || profileData.profilePicture}
                alt="Profile"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : null}
            <FaUserCircle style={{
              display: profilePicture || profileData?.profilePicture ? 'none' : 'flex',
              fontSize: '4rem',
              color: theme === 'dark' ? '#ff9999' : '#ff6666'
            }} />
            <AvatarLabel htmlFor="profile-pic-upload" theme={{ mode: theme }}>
              <FaEdit />
            </AvatarLabel>
          </Avatar>
          <AvatarInput
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            aria-label="Upload profile picture"
          />
          <UserName theme={{ mode: theme }}>{profileData?.name || user?.name || "User"}</UserName>
          <UserEmail theme={{ mode: theme }}>{profileData?.email || user?.email || "No email"}</UserEmail>
          <UserMemberSince theme={{ mode: theme }}>
            <FiCalendar /> Since{" "}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString("default", { month: "short", year: "numeric" })}
          </UserMemberSince>

          {/* Notification Bell */}
          <div style={{ position: "relative" }}>
            <NotificationBell
              onClick={toggleNotifications}
              aria-label={`View notifications`}
              aria-expanded={showNotifications}
              theme={{ mode: theme }}
            >
              <FaBell />
              {(unreadCount + pendingOrders.length) > 0 && (
                <span>{unreadCount + pendingOrders.length}</span>
              )}
            </NotificationBell>
            {showNotifications && (
              <NotificationDropdown theme={{ mode: theme }}>
                {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
                  <NotificationItem key={n.id} onClick={() => handleMarkAsRead(n.id)} theme={{ mode: theme }}>
                    {n.type && <NotificationTypeIndicator type={n.type}>{n.type}</NotificationTypeIndicator>}
                    {n.title && <div className="notification-title">{n.title}</div>}
                    <div dangerouslySetInnerHTML={{ __html: n.content }} />
                    {n.imageUrl && <img src={n.imageUrl} alt="notification" />}
                    <div className="notification-time">{new Date(n.sentAt).toLocaleString()}</div>
                    <Button $secondary onClick={(e) => handleDeleteNotification(n.id, e)} theme={{ mode: theme }} style={{ marginTop: '0.5rem' }}>
                      <FaTrash />
                    </Button>
                  </NotificationItem>
                )) : (
                  <NotificationItem theme={{ mode: theme }}>No notifications</NotificationItem>
                )}
                {isAdmin && (
                  <>
                    <div style={{ padding: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      Pending Orders
                    </div>
                    {pendingOrders.length > 0 ? pendingOrders.slice(0, 3).map(o => (
                      <NotificationItem key={o.id} onClick={() => handleViewOrder(o)} theme={{ mode: theme }}>
                        Order #{o.id} - Pending ({o.userName || "Unknown"})
                      </NotificationItem>
                    )) : (
                      <NotificationItem theme={{ mode: theme }}>No pending orders</NotificationItem>
                    )}
                  </>
                )}
                {notifications.length > 5 && (
                  <NotificationItem theme={{ mode: theme }} style={{ justifyContent: 'center' }}>
                    <Button $secondary onClick={handleMarkAllRead} theme={{ mode: theme }}>Mark All Read</Button>
                    <Button $secondary onClick={handleClearAll} theme={{ mode: theme }} style={{ marginLeft: '0.5rem' }}>Clear All</Button>
                  </NotificationItem>
                )}
              </NotificationDropdown>
            )}
          </div>

          {/* Nav */}
          <NavMenu>
            {[
              { tab: "profile", icon: <FaUserCircle />, label: "Profile" },
              { tab: "orders", icon: <FaShoppingBag />, label: "Orders" },
              { tab: "favorites", icon: <FaHeart />, label: "Favorites" },
              { tab: "notifications", icon: <FaBell />, label: "Notifications" },
              { tab: "settings", icon: <FaCog />, label: "Settings" },
            ].map(({ tab, icon, label }) => (
              <NavItem key={tab}>
                <NavLink $active={activeTab === tab} onClick={() => setActiveTab(tab)} theme={{ mode: theme }}>
                  {icon} {label}
                </NavLink>
              </NavItem>
            ))}
            {isAdmin && (
              <>
                <NavItem>
                  <NavLink $active={location.pathname.startsWith("/admin/")} onClick={openAdminDashboard} theme={{ mode: theme }}>
                    <FaUtensils /> Admin Dashboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink $active={activeTab === "contact-messages"} onClick={() => setActiveTab("contact-messages")} theme={{ mode: theme }}>
                    <FaEnvelope /> Contact Messages
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItem>
              <NavLink onClick={handleLogout} aria-label="Logout" theme={{ mode: theme }}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </NavItem>
          </NavMenu>
        </ProfileSidebar>

        {/* ── Content ── */}
        <ProfileContent theme={{ mode: theme }}>
          <ProfileHeader theme={{ mode: theme }}>
            <ProfileTitle theme={{ mode: theme }}>
              {activeTab === "profile" && <><FaUserCircle /> My Profile</>}
              {activeTab === "orders" && <><FaShoppingBag /> My Orders</>}
              {activeTab === "favorites" && <><FaHeart /> Favorite Treats</>}
              {activeTab === "notifications" && <><FaBell /> Notifications Center</>}
              {activeTab === "settings" && <><FaCog /> Settings</>}
              {activeTab === "contact-messages" && <><FaEnvelope /> Contact Messages</>}
            </ProfileTitle>
            {activeTab === "profile" && (
              <Button onClick={() => setIsEditModalOpen(true)} theme={{ mode: theme }}>
                <FaEdit /> Edit Profile
              </Button>
            )}
            {activeTab === "contact-messages" && (
              <Button onClick={handleFetchContactMessages} theme={{ mode: theme }}>
                <FaSyncAlt /> Refresh Messages
              </Button>
            )}
          </ProfileHeader>

          {activeTab === "profile" && (
            <ProfileSectionComponent
              profileData={profileData}
              user={user}
              normalizeRole={normalizeRole}
              menuItems={menuItems}
              orders={orders}
              localFavorites={localFavorites}
              profileCompletion={profileCompletion}
              setIsEditModalOpen={setIsEditModalOpen}
              setIsAddressModalOpen={setIsAddressModalOpen}
              setEditAddress={setEditAddress}
              setAddressForm={setAddressForm}
              handleDeleteAddress={handleDeleteAddress}
              theme={theme}
            />
          )}
          {activeTab === "orders" && (
            <OrdersSection
              orders={filteredOrders}
              orderFilter={orderFilter}
              setOrderFilter={setOrderFilter}
              ordersLoading={ordersLoading}
              handleReorder={handleReorder}
              handleViewOrder={handleViewOrder}
              theme={theme}
            />
          )}
          {activeTab === "favorites" && (
            <FavoritesSection
              localFavorites={localFavorites}
              addToCart={addToCart}
              handleRemoveFromFavorites={handleRemoveFromFavorites}
              theme={theme}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationsSection
              notifications={filteredNotifications}
              notificationFilter={notificationFilter}
              setNotificationFilter={setNotificationFilter}
              handleMarkAsRead={handleMarkAsRead}
              handleMarkAllRead={handleMarkAllRead}
              handleClearAll={handleClearAll}
              handleDeleteNotification={handleDeleteNotification}
              notificationsPagination={notificationsPagination}
              theme={theme}
            />
          )}
          {activeTab === "settings" && (
            <SettingsSection
              setIsPasswordModalOpen={setIsPasswordModalOpen}
              setIsNotificationSettingsModalOpen={setIsNotificationSettingsModalOpen}
              toggleTheme={toggleTheme}
              theme={theme}
              handleExportData={handleExportData}
            />
          )}
          {activeTab === "contact-messages" && isAdmin && (
            <ContactMessagesSection
              contactMessages={filteredContactMessages}
              messagesLoading={messagesLoading}
              messagesError={messagesError}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              handleDeleteContactMessage={handleDeleteContactMessage}
              contactMessagesPagination={contactMessagesPagination}
              theme={theme}
            />
          )}
        </ProfileContent>
      </ProfileContainer>

      {/* Modals */}
      {modals}
    </ProfileWrapper>
  );
};

Profile.propTypes = {};

export default React.memo(Profile);
