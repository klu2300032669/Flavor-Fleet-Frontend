// Checkout.jsx - Premium Enhanced Version
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, 
  List, ListItem, ListItemText, Divider, Stepper, Step, StepLabel, IconButton, 
  Container, Paper, alpha, CircularProgress, Modal, InputAdornment, Chip,
  Card, CardContent, Alert, Fade, Zoom, Tooltip, Avatar, Badge, Grid
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiClock, 
  FiShield, FiTruck, FiCheck, FiAlertCircle, FiStar, FiHome, FiEdit3
} from "react-icons/fi";
import { toast } from "react-toastify";

// Enhanced validation with better error messages
const validateForm = (formData) => {
  const errors = {};
  if (!formData.name?.trim()) errors.name = "Full name is required";
  if (!formData.addressLine1?.trim()) errors.addressLine1 = "Street address is required";
  if (!formData.city?.trim()) errors.city = "City is required";
  if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Valid 6-digit pincode required";
  if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = "Valid 10-digit phone number required";
  return errors;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token, cart, placeOrder, fetchCart, clearCart } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash",
    deliveryInstructions: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(49);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });
  
  const [upiDetails, setUpiDetails] = useState({
    upiId: ""
  });

  const steps = ["Cart", "Delivery", "Payment"];
  const deliveryTime = "25-35 min";

  // Calculate prices
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
    
    // Apply discount for orders above ₹300
    const discountAmount = total > 300 ? total * 0.1 : 0;
    setDiscount(discountAmount);
    
    // Free delivery for orders above ₹500
    const deliveryCharge = total > 500 ? 0 : 49;
    setDeliveryFee(deliveryCharge);
    
    setFinalPrice(total - discountAmount + deliveryCharge);
  }, [cart]);

  // Load user data and cart
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to proceed with checkout.");
      navigate("/", { state: { showLoginModal: true, intendedPath: "/checkout" } });
      return;
    }

    // Pre-populate form from user profile
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || ""
      }));

      // Load saved addresses
      if (user.addresses && user.addresses.length > 0) {
        setSavedAddresses(user.addresses);
        const primaryAddress = user.addresses.find(addr => addr.isPrimary) || user.addresses[0];
        if (primaryAddress) {
          setSelectedAddress(primaryAddress.id);
          setFormData(prev => ({
            ...prev,
            addressLine1: primaryAddress.line1 || "",
            addressLine2: primaryAddress.line2 || "",
            city: primaryAddress.city || "",
            pincode: primaryAddress.pincode || ""
          }));
        }
      }
    }

    fetchCartItems();
  }, [token, navigate, user]);

  const fetchCartItems = async () => {
    setCartLoading(true);
    try {
      const cartItems = await fetchCart();
      if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart data received");
      }
      if (cartItems.length === 0) {
        toast.info("Your cart is empty! Adding some delicious items first.");
        navigate("/menu");
        return;
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(`Failed to load cart: ${error.message}`);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id);
    setFormData(prev => ({
      ...prev,
      addressLine1: address.line1 || "",
      addressLine2: address.line2 || "",
      city: address.city || "",
      pincode: address.pincode || ""
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Enhanced location detection with real reverse geocoding
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FlavorFleetApp/1.0' // Required for Nominatim
          }
        }
      );
      if (!response.ok) throw new Error('Geocoding API error');
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        return {
          addressLine1: `${address.road || address.street || ''}, ${address.house_number || ''}`.trim() || 'Detected address',
          city: address.city || address.town || address.village || address.state_district || '',
          pincode: address.postcode || ''
        };
      }
      throw new Error('No address found');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  };

  const detectLocation = async () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const addressData = await reverseGeocode(latitude, longitude);
          
          setFormData(prev => ({
            ...prev,
            addressLine1: addressData.addressLine1,
            city: addressData.city,
            pincode: addressData.pincode
          }));
          
          toast.success("📍 Exact location detected! Address filled automatically.");
        } catch (error) {
          console.error("Location detection error:", error);
          toast.error("Failed to fetch exact address. Using approximate location or enter manually.");
          // Fallback to mock if needed
          setFormData(prev => ({
            ...prev,
            addressLine1: "Detected via GPS",
            city: "Your City",
            pincode: "000000"
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Unable to detect location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access or enter manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        toast.error(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardName: "" });
    setUpiDetails({ upiId: "" });
  };

  // Enhanced payment validation
  const validateCard = () => {
    if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) return "Card number must be 16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) return "Expiry date must be in MM/YY format";
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) return "CVV must be 3-4 digits";
    if (!cardDetails.cardName.trim()) return "Cardholder name is required";
    return null;
  };

  const validateUpi = () => {
    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiDetails.upiId)) {
      return "Invalid UPI ID format (e.g., name@upi)";
    }
    return null;
  };

  const processPayment = async () => {
    setOrderProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate for demo
          Math.random() > 0.1 ? resolve() : reject(new Error("Payment declined by bank"));
        }, 2000);
      });
      
      return true;
    } catch (error) {
      throw error;
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    const error = validateCard();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await processPayment();
      await placeOrderAndNavigate();
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    }
  };

  const handleUpiPayment = async () => {
    const error = validateUpi();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await processPayment();
      await placeOrderAndNavigate();
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    }
  };

  const placeOrderAndNavigate = async () => {
    const orderData = {
      name: formData.name,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || "",
      city: formData.city,
      pincode: formData.pincode,
      paymentMethod: formData.paymentMethod,
      deliveryInstructions: formData.deliveryInstructions,
      totalPrice: finalPrice,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const result = await placeOrder(orderData);
      
      if (result.success) {
        // Clear cart on successful order, but don't fail navigation if it errors
        try {
          if (typeof clearCart === 'function') {
            await clearCart();
          } else {
            console.warn('clearCart function not available');
          }
        } catch (clearError) {
          console.error('Failed to clear cart:', clearError);
          toast.warn('Order placed, but cart clear failed. You can clear it manually next time.');
        }
        
        toast.success("🎉 Order placed successfully!");
        handlePaymentModalClose();
        
        // Navigate to success page with full order details
        navigate("/order-success", { 
          state: { 
            orderId: result.orderId,
            estimatedDelivery: deliveryTime,
            totalAmount: finalPrice,
            name: formData.name,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || "",
            city: formData.city,
            pincode: formData.pincode,
            paymentMethod: formData.paymentMethod,
            deliveryInstructions: formData.deliveryInstructions,
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          }
        });
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add some delicious items first!");
      navigate("/menu");
      return;
    }

    const errors = validateForm(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (formData.paymentMethod === "Cash") {
      setLoading(true);
      try {
        await placeOrderAndNavigate();
      } catch (error) {
        toast.error(`Order failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setPaymentModalOpen(true);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  if (cartLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha("#fef8f5", 0.95)}, ${alpha("#fff", 0.98)})`
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={60} 
              sx={{ 
                color: "#ff6f61",
                mb: 2
              }} 
            />
            <Typography variant="h6" sx={{ color: "#ff6f61", fontFamily: "'Poppins', sans-serif" }}>
              Loading your delicious order...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#fef8f5", 0.95)}, ${alpha("#fff", 0.98)})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced Background Elements */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
          filter: "blur(4px)",
        }}
      />
      
      {/* Animated Background Shapes - Enhanced */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#ff6f61", 0.1)} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#ff4839", 0.08)} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            background: "#ff6f61",
            borderRadius: "50%",
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          {/* Header Section - Enhanced */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Tooltip title="Back to menu">
              <IconButton 
                onClick={() => navigate("/menu")} 
                sx={{ 
                  color: "#ff6f61",
                  background: alpha("#ff6f61", 0.1),
                  mr: 2,
                  '&:hover': {
                    background: alpha("#ff6f61", 0.2),
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <FiArrowLeft size={24} />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.5rem" },
                background: "linear-gradient(45deg, #ff6f61, #ff4839, #ff8a80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                flexGrow: 1,
              }}
            >
              Checkout
            </Typography>
            
            <Chip 
              icon={<FiClock />}
              label={`Delivery: ${deliveryTime}`}
              sx={{
                background: `linear-gradient(45deg, ${alpha("#10B981", 0.9)}, ${alpha("#059669", 0.9)})`,
                color: "white",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </Box>

          {/* Progress Stepper - Enhanced */}
          <Stepper activeStep={1} alternativeLabel sx={{ mb: 6 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={(props) => (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: props.active || props.completed 
                            ? "linear-gradient(45deg, #ff6f61, #ff4839)"
                            : alpha("#ff6f61", 0.1),
                          color: props.active || props.completed ? "white" : "#ff6f61",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          boxShadow: props.active ? `0 0 20px ${alpha("#ff6f61", 0.3)}` : 'none',
                        }}
                      >
                        {props.completed ? <FiCheck size={16} /> : index + 1}
                      </Box>
                    </motion.div>
                  )}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#ff6f61",
                      fontSize: "0.9rem",
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={4}>
            {/* Left Column - Order Summary */}
            <Grid item xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: "25px",
                    background: `linear-gradient(145deg, ${alpha("#fff", 0.95)}, ${alpha("#fef8f5", 0.9)})`,
                    boxShadow: `0 20px 50px ${alpha("#ff6f61", 0.15)}, inset 0 1px 0 ${alpha("#fff", 0.8)}`,
                    border: `1px solid ${alpha("#ff6f61", 0.1)}`,
                    backdropFilter: "blur(10px)",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "#ff6f61",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FiPackage /> Order Summary
                  </Typography>

                  <AnimatePresence>
                    {cart.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#666", mb: 2 }}>
                            Your cart is empty
                          </Typography>
                          <Button 
                            variant="contained"
                            onClick={() => navigate("/menu")}
                            sx={{
                              background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                              borderRadius: "20px",
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            Browse Menu
                          </Button>
                        </Box>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                      >
                        <List sx={{ mb: 2 }}>
                          {cart.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <ListItem 
                                sx={{ 
                                  px: 0,
                                  py: 2,
                                  borderBottom: `1px solid ${alpha("#ff6f61", 0.1)}`,
                                  borderRadius: "12px",
                                  background: alpha("#ff6f61", 0.02),
                                  marginBottom: 1,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    background: alpha("#ff6f61", 0.05),
                                    transform: "translateX(5px)",
                                  }
                                }}
                              >
                                <Badge
                                  badgeContent={item.quantity}
                                  color="primary"
                                  sx={{
                                    "& .MuiBadge-badge": {
                                      background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                                      fontFamily: "'Poppins', sans-serif",
                                      fontWeight: "bold",
                                    }
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      mr: 2,
                                      background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                                    }}
                                  >
                                    <FiPackage />
                                  </Avatar>
                                </Badge>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                                      {item.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#ff6f61", fontWeight: 600 }}>
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                  }
                                />
                                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#666", fontSize: "0.9rem" }}>
                                  {item.quantity} × ₹{item.price}
                                </Typography>
                              </ListItem>
                            </motion.div>
                          ))}
                        </List>

                        {/* Price Breakdown - Enhanced */}
                        <Box sx={{ mt: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, borderRadius: "8px", background: alpha("#ff6f61", 0.03) }}>
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}>
                              Subtotal
                            </Typography>
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                              ₹{totalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                          
                          {discount > 0 && (
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, borderRadius: "8px", background: alpha("#10B981", 0.05) }}>
                              <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#10B981" }}>
                                Discount (10%)
                              </Typography>
                              <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#10B981" }}>
                                -₹{discount.toFixed(2)}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, borderRadius: "8px", background: deliveryFee === 0 ? alpha("#10B981", 0.05) : alpha("#ff6f61", 0.03) }}>
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}>
                              Delivery Fee
                            </Typography>
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: deliveryFee === 0 ? "#10B981" : "inherit" }}>
                              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ my: 2, borderColor: alpha("#ff6f61", 0.2) }} />
                          
                          <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderRadius: "12px", background: "linear-gradient(45deg, #ff6f61, #ff4839)", color: "white" }}>
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>
                              Total Amount
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontFamily: "'Poppins', sans-serif", 
                                fontWeight: 800, 
                                fontSize: "1.3rem",
                              }}
                            >
                              ₹{finalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Paper>

                {/* Trust Badges - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      background: `linear-gradient(145deg, ${alpha("#fff", 0.9)}, ${alpha("#f8fafc", 0.9)})`,
                      border: `1px solid ${alpha("#ff6f61", 0.1)}`,
                      boxShadow: `0 10px 30px ${alpha("#ff6f61", 0.1)}`,
                    }}
                  >
                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, mb: 2, textAlign: "center" }}>
                      Why Choose Flavor Fleet?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                      {[
                        { icon: <FiShield />, text: "Secure Payment" },
                        { icon: <FiTruck />, text: "Fast Delivery" },
                        { icon: <FiStar />, text: "Premium Quality" }
                      ].map((item, index) => (
                        <Grid item key={index} xs={4}>
                          <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                            <IconButton sx={{ color: "#ff6f61", mb: 0.5, width: "100%" }}>
                              {item.icon}
                            </IconButton>
                            <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", display: "block", textAlign: "center" }}>
                              {item.text}
                            </Typography>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Right Column - Delivery Form */}
            <Grid item xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: "25px",
                    background: `linear-gradient(145deg, ${alpha("#fff", 0.95)}, ${alpha("#fef8f5", 0.9)})`,
                    boxShadow: `0 20px 50px ${alpha("#ff6f61", 0.15)}, inset 0 1px 0 ${alpha("#fff", 0.8)}`,
                    border: `1px solid ${alpha("#ff6f61", 0.1)}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "#ff6f61",
                      mb: 3,
                    }}
                  >
                    Delivery Information
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    {/* Saved Addresses - Enhanced */}
                    {savedAddresses.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                          <FiHome /> Saved Addresses
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                          {savedAddresses.map((address) => (
                            <motion.div
                              key={address.id}
                              whileHover={{ scale: 1.02 }}
                            >
                              <Card
                                sx={{
                                  minWidth: 200,
                                  cursor: "pointer",
                                  border: selectedAddress === address.id ? `2px solid #ff6f61` : `1px solid ${alpha("#ff6f61", 0.2)}`,
                                  background: selectedAddress === address.id ? alpha("#ff6f61", 0.05) : "white",
                                  borderRadius: "15px",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    borderColor: "#ff6f61",
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 5px 15px ${alpha("#ff6f61", 0.2)}`,
                                  },
                                }}
                                onClick={() => handleAddressSelect(address)}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                                    {address.tag || "Home"}
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: "#666" }}>
                                    {address.line1}, {address.city}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "15px",
                          "&:hover fieldset": { borderColor: "#ff6f61" },
                          "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                        },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                        "& label.Mui-focused": { color: "#ff6f61" },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      error={!!formErrors.phone}
                      helperText={formErrors.phone || "For delivery updates"}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "15px",
                          "&:hover fieldset": { borderColor: "#ff6f61" },
                          "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                        },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                        "& label.Mui-focused": { color: "#ff6f61" },
                      }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        error={!!formErrors.addressLine1}
                        helperText={formErrors.addressLine1}
                        sx={{
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: "15px",
                            "&:hover fieldset": { borderColor: "#ff6f61" },
                            "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                          },
                          "& label": { fontFamily: "'Poppins', sans-serif" },
                          "& label.Mui-focused": { color: "#ff6f61" },
                        }}
                      />
                      <Tooltip title="Detect my exact location">
                        <IconButton
                          onClick={detectLocation}
                          disabled={locationLoading}
                          sx={{ 
                            ml: 1, 
                            color: "#ff6f61",
                            background: alpha("#ff6f61", 0.1),
                            "&:hover": {
                              background: alpha("#ff6f61", 0.2),
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          {locationLoading ? (
                            <CircularProgress size={24} sx={{ color: "#ff6f61" }} />
                          ) : (
                            <FiMapPin size={24} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <TextField
                      fullWidth
                      label="Apartment, Suite, etc. (Optional)"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "15px",
                          "&:hover fieldset": { borderColor: "#ff6f61" },
                          "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                        },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                        "& label.Mui-focused": { color: "#ff6f61" },
                      }}
                    />

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          error={!!formErrors.city}
                          helperText={formErrors.city}
                          sx={{
                            "& .MuiOutlinedInput-root": { 
                              borderRadius: "15px",
                              "&:hover fieldset": { borderColor: "#ff6f61" },
                              "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                            },
                            "& label": { fontFamily: "'Poppins', sans-serif" },
                            "& label.Mui-focused": { color: "#ff6f61" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          error={!!formErrors.pincode}
                          helperText={formErrors.pincode}
                          sx={{
                            "& .MuiOutlinedInput-root": { 
                              borderRadius: "15px",
                              "&:hover fieldset": { borderColor: "#ff6f61" },
                              "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                            },
                            "& label": { fontFamily: "'Poppins', sans-serif" },
                            "& label.Mui-focused": { color: "#ff6f61" },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      label="Delivery Instructions (Optional)"
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder="e.g., Leave at door, Call before delivery, etc."
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "15px",
                          "&:hover fieldset": { borderColor: "#ff6f61" },
                          "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
                        },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                        "& label.Mui-focused": { color: "#ff6f61" },
                      }}
                    />

                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <InputLabel
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          "&.Mui-focused": { color: "#ff6f61" },
                        }}
                      >
                        Payment Method
                      </InputLabel>
                      <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        sx={{
                          borderRadius: "15px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha("#ff6f61", 0.3),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ff6f61",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ff6f61",
                          },
                        }}
                      >
                        <MenuItem value="Cash">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 20, height: 20, borderRadius: "50%", background: "#10B981" }} />
                            Cash on Delivery
                          </Box>
                        </MenuItem>
                        <MenuItem value="Card">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FiCreditCard />
                            Credit/Debit Card
                          </Box>
                        </MenuItem>
                        <MenuItem value="UPI">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 20, height: 20, borderRadius: "50%", background: "#8B5CF6" }} />
                            UPI Payment
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || cart.length === 0}
                        sx={{
                          background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                          borderRadius: "15px",
                          padding: "15px 0",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          textTransform: "none",
                          width: "100%",
                          boxShadow: "0 8px 25px rgba(255, 111, 97, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #ff4839, #ff6f61)",
                            boxShadow: "0 12px 35px rgba(255, 111, 97, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          "&:disabled": {
                            background: alpha("#ff6f61", 0.5),
                            boxShadow: "none",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#fff" }} />
                        ) : (
                          `Place Order • ₹${finalPrice.toFixed(2)}`
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Enhanced Payment Modal */}
      <Modal 
        open={paymentModalOpen} 
        onClose={handlePaymentModalClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Fade in={paymentModalOpen}>
          <Paper
            sx={{
              width: { xs: "90%", sm: 500 },
              borderRadius: "25px",
              p: 4,
              background: `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha("#fef8f5", 0.95)})`,
              boxShadow: `0 25px 60px ${alpha("#ff6f61", 0.3)}, inset 0 1px 0 ${alpha("#fff", 0.8)}`,
              border: `1px solid ${alpha("#ff6f61", 0.2)}`,
            }}
          >
            {formData.paymentMethod === "Card" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#ff6f61",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  💳 Card Payment
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3, borderRadius: "15px", fontFamily: "'Poppins', sans-serif" }}>
                  Test Card: 4111 1111 1111 1111
                </Alert>

                <TextField
                  fullWidth
                  label="Cardholder Name"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                    "& label": { fontFamily: "'Poppins', sans-serif" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Card Number"
                  value={formatCardNumber(cardDetails.cardNumber)}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\s/g, '').slice(0, 16) })}
                  placeholder="1234 5678 9012 3456"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                    "& label": { fontFamily: "'Poppins', sans-serif" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiCreditCard />
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2') })}
                      placeholder="MM/YY"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      type="password"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                        "& label": { fontFamily: "'Poppins', sans-serif" },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handlePaymentModalClose}
                    sx={{
                      borderRadius: "15px",
                      py: 1.5,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      borderColor: "#ff6f61",
                      color: "#ff6f61",
                      "&:hover": {
                        borderColor: "#ff4839",
                        background: alpha("#ff6f61", 0.05),
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCardPayment}
                    disabled={orderProcessing}
                    sx={{
                      background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                      borderRadius: "15px",
                      py: 1.5,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      "&:hover": {
                        background: "linear-gradient(45deg, #ff4839, #ff6f61)",
                      },
                    }}
                  >
                    {orderProcessing ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      `Pay ₹${finalPrice.toFixed(2)}`
                    )}
                  </Button>
                </Box>
              </motion.div>
            )}

            {formData.paymentMethod === "UPI" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#ff6f61",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  📱 UPI Payment
                </Typography>

                <TextField
                  fullWidth
                  label="UPI ID"
                  value={upiDetails.upiId}
                  onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                  placeholder="yourname@upi"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                    "& label": { fontFamily: "'Poppins', sans-serif" },
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.9rem",
                    color: "#666",
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Or scan the QR code
                </Typography>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "200px",
                      background: `linear-gradient(45deg, ${alpha("#ff6f61", 0.1)}, ${alpha("#ff4839", 0.1)})`,
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      border: `2px dashed ${alpha("#ff6f61", 0.3)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "#666",
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      QR Code Placeholder
                      <br />
                      (Scan with any UPI app)
                    </Typography>
                  </Box>
                </motion.div>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handlePaymentModalClose}
                    sx={{
                      borderRadius: "15px",
                      py: 1.5,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      borderColor: "#ff6f61",
                      color: "#ff6f61",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleUpiPayment}
                    disabled={orderProcessing}
                    sx={{
                      background: "linear-gradient(45deg, #ff6f61, #ff4839)",
                      borderRadius: "15px",
                      py: 1.5,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {orderProcessing ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      `Pay ₹${finalPrice.toFixed(2)}`
                    )}
                  </Button>
                </Box>
              </motion.div>
            )}
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Checkout;