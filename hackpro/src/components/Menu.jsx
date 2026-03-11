// src/components/Menu.jsx
import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useCallback, useReducer } from "react";
import {
  Container, Grid, Card, CardMedia, CardContent, Typography,
  Button, Box, Chip, useMediaQuery, IconButton, Tooltip,
  alpha, Zoom, AppBar, Toolbar, Fab, Badge, Drawer,
  List, ListItem, ListItemText, Divider, TextField, InputAdornment,
  Rating, Snackbar, Alert, MenuItem as MuiMenuItem, Select, FormControl,
  InputLabel, CircularProgress, Skeleton, SwipeableDrawer, Avatar,
  Slider, FormGroup, FormControlLabel, Checkbox, Dialog, DialogContent,
  DialogTitle, DialogActions, CardActionArea, Paper, SpeedDial,
  SpeedDialAction, SpeedDialIcon, BottomNavigation, BottomNavigationAction,
  Stepper, Step, StepLabel, Tabs, Tab, LinearProgress, Fade
} from "@mui/material";
import {
  motion, AnimatePresence, useScroll, useTransform, LayoutGroup, useAnimation
} from "framer-motion";
import { useTheme } from "@mui/material/styles";
import {
  FiHeart, FiChevronUp, FiShoppingCart, FiHome, FiX, FiSearch,
  FiMenu, FiUser, FiLogIn, FiClock, FiStar,
  FiFilter, FiDollarSign, FiAward, FiTrash2, FiPlus, FiMinus,
  FiInfo, FiShare2, FiBookmark, FiChevronRight, FiChevronLeft,
  FiMapPin, FiPhone, FiMail, FiGlobe, FiEye
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

// 🚀 PERFORMANCE OPTIMIZED CUSTOM HOOKS
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// 🆕 ENHANCED REDUCER WITH MORE FILTERS
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedType: action.payload };
    case 'SET_FOOD_TYPE':
      return { ...state, selectedFoodType: action.payload };
    case 'SET_PRICE':
      return { ...state, priceRange: action.payload };
    case 'SET_DIETARY':
      return { ...state, dietaryPreferences: action.payload };
    case 'SET_RATING':
      return { ...state, ratingFilter: action.payload };
    case 'SET_PREP_TIME':
      return { ...state, prepTimeFilter: action.payload };
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload };
    case 'SET_DISCOUNT':
      return { ...state, discountFilter: action.payload };
    case 'TOGGLE_QUICK_DELIVERY':
      return { ...state, quickDelivery: !state.quickDelivery };
    case 'SET_DELIVERY_TIME':
      return { ...state, maxDeliveryTime: action.payload };
    case 'RESET_ALL':
      return {
        searchTerm: '',
        sortBy: 'default',
        selectedType: 'all',
        selectedFoodType: 'all',
        priceRange: [0, 1000],
        dietaryPreferences: [],
        ratingFilter: 0,
        prepTimeFilter: 'any',
        availability: 'all',
        discountFilter: 0,
        quickDelivery: false,
        maxDeliveryTime: 60
      };
    default:
      return state;
  }
};

// 🔥 ENHANCED SEARCHBAR WITH REAL-TIME SUGGESTIONS
const SearchBar = React.memo(({ onSearch, onSortChange, sortBy, searchSuggestions, onSuggestionClick, recentSearches }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const suggestionRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(value.length > 0);
  }, [onSearch]);

  const handleSuggestionClick = useCallback((suggestion) => {
    handleSearch(suggestion);
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
  }, [handleSearch, onSuggestionClick]);

  const clearSearch = useCallback(() => {
    handleSearch("");
    setShowSuggestions(false);
  }, [handleSearch]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box ref={suggestionRef} sx={{
      display: "flex", gap: { xs: 1, md: 2 }, mb: { xs: 4, md: 8 },
      alignItems: "center", maxWidth: { xs: "95%", md: 1100 }, mx: "auto",
      background: alpha(theme.palette.common.white, 0.98), borderRadius: "24px",
      p: { xs: 1.5, md: 2 }, boxShadow: focused ? `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}` : `0 15px 40px ${alpha(theme.palette.grey[900], 0.1)}`,
      border: `2px solid ${focused ? theme.palette.primary.main : alpha(theme.palette.grey[200], 0.2)}`, transition: "all 0.3s ease",
      position: "relative", backdropFilter: "blur(10px)",
    }}>
      <Box sx={{ position: "relative", flex: 1 }}>
        <TextField
          fullWidth variant="outlined" placeholder="Search for tasty delights..."
          value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { setShowSuggestions(true); setFocused(true); }}
          onBlur={() => setFocused(false)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><FiSearch color={focused ? theme.palette.primary.main : theme.palette.grey[600]} size={24} /></InputAdornment>,
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small" sx={{ color: theme.palette.grey[500] }}>
                  <FiX size={18} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", border: "none",
              transition: "all 0.4s ease",
              "&:hover": { borderColor: "transparent" },
              "&.Mui-focused": { borderColor: "transparent", boxShadow: "none" },
              "& .MuiInputBase-input": { 
                fontFamily: "'Poppins', sans-serif", 
                fontSize: { xs: "1rem", md: "1.2rem" }, 
                py: { xs: 1.5, md: 1.8 }, 
                color: theme.palette.text.primary,
                "&::placeholder": { color: alpha(theme.palette.text.secondary, 0.6) }
              }
            }
          }}
        />
        
        <AnimatePresence>
          {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ 
                position: "absolute", 
                top: "calc(100% + 8px)", 
                left: 0, 
                right: 0, 
                background: "white", 
                borderRadius: "20px", 
                boxShadow: "0 25px 60px rgba(0,0,0,0.2)", 
                zIndex: 1000, 
                overflow: "hidden", 
                border: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`, 
                backdropFilter: "blur(20px)",
                maxHeight: "400px",
                overflowY: "auto"
              }}
            >
              {searchTerm && searchSuggestions.length > 0 && (
                <>
                  <Box sx={{ 
                    p: 2, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`, 
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}>
                    <FiSearch color={theme.palette.primary.main} size={18} />
                    <Typography variant="subtitle2" sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      color: theme.palette.primary.main, 
                      fontWeight: 600, 
                      fontSize: "0.9rem" 
                    }}>
                      Search Suggestions
                    </Typography>
                  </Box>
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box sx={{ 
                        p: 2, 
                        cursor: "pointer", 
                        transition: "all 0.2s ease", 
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderBottom: index < searchSuggestions.length - 1 ? `1px solid ${alpha(theme.palette.grey[100], 0.5)}` : "none" 
                      }} 
                      onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Box sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <FiSearch size={14} color={theme.palette.primary.main} />
                        </Box>
                        <Typography sx={{ 
                          fontFamily: "'Poppins', sans-serif", 
                          fontSize: "0.95rem", 
                          color: theme.palette.text.primary, 
                          fontWeight: 500 
                        }}>
                          {suggestion}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </>
              )}
              
              {recentSearches.length > 0 && (
                <>
                  <Box sx={{ 
                    p: 2, 
                    background: alpha(theme.palette.grey[100], 0.8), 
                    borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}>
                    <FiClock color={theme.palette.text.secondary} size={18} />
                    <Typography variant="subtitle2" sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      color: "text.secondary", 
                      fontWeight: 600, 
                      fontSize: "0.9rem" 
                    }}>
                      Recent Searches
                    </Typography>
                  </Box>
                  {recentSearches.map((search, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ backgroundColor: alpha(theme.palette.grey[50], 0.8) }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box sx={{ 
                        p: 2, 
                        cursor: "pointer", 
                        transition: "all 0.2s ease", 
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderBottom: index < recentSearches.length - 1 ? `1px solid ${alpha(theme.palette.grey[100], 0.5)}` : "none" 
                      }} 
                      onClick={() => handleSuggestionClick(search)}
                      >
                        <Box sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: alpha(theme.palette.grey[300], 0.2),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <FiClock size={14} color={theme.palette.text.secondary} />
                        </Box>
                        <Typography sx={{ 
                          fontFamily: "'Poppins', sans-serif", 
                          fontSize: "0.95rem", 
                          color: theme.palette.text.secondary 
                        }}>
                          {search}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      
      <FormControl sx={{ minWidth: { xs: 120, md: 160 } }}>
        <InputLabel sx={{ 
          fontFamily: "'Poppins', sans-serif", 
          fontSize: { xs: "0.9rem", md: "1rem" }, 
          fontWeight: 500 
        }}>
          Sort By
        </InputLabel>
        <Select 
          value={sortBy} 
          onChange={onSortChange} 
          label="Sort By" 
          sx={{
            borderRadius: "20px", 
            border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`, 
            background: "white",
            "& .MuiSelect-select": { 
              py: { xs: 1.4, md: 1.6 }, 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: { xs: "0.9rem", md: "1rem" }, 
              fontWeight: 500 
            },
            "&:hover": { 
              borderColor: theme.palette.primary.main, 
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}` 
            },
            "&.Mui-focused": { 
              borderColor: theme.palette.primary.main, 
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}` 
            }
          }}
        >
          <MuiMenuItem value="default" sx={{ fontFamily: "'Poppins', sans-serif" }}>✨ Featured</MuiMenuItem>
          <MuiMenuItem value="price-low" sx={{ fontFamily: "'Poppins', sans-serif" }}>💰 Price: Low to High</MuiMenuItem>
          <MuiMenuItem value="price-high" sx={{ fontFamily: "'Poppins', sans-serif" }}>💎 Price: High to Low</MuiMenuItem>
          <MuiMenuItem value="name" sx={{ fontFamily: "'Poppins', sans-serif" }}>🔤 Name (A-Z)</MuiMenuItem>
          <MuiMenuItem value="rating" sx={{ fontFamily: "'Poppins', sans-serif" }}>⭐ Highest Rated</MuiMenuItem>
          <MuiMenuItem value="prep-time" sx={{ fontFamily: "'Poppins', sans-serif" }}>⚡ Fastest Preparation</MuiMenuItem>
          <MuiMenuItem value="popular" sx={{ fontFamily: "'Poppins', sans-serif" }}>🔥 Most Popular</MuiMenuItem>
        </Select>
      </FormControl>
    </Box>
  );
});

// 🔥 ENHANCED FILTERS COMPONENT
const AdvancedFilters = React.memo(({ filters, dispatch }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const theme = useTheme();

  const dietaryOptions = [
    { value: 'vegetarian', label: '🥗 Vegetarian' },
    { value: 'vegan', label: '🌱 Vegan' },
    { value: 'gluten-free', label: '🌾 Gluten Free' },
    { value: 'spicy', label: '🌶️ Spicy' },
    { value: 'low-calorie', label: '🥬 Low Calorie' },
    { value: 'organic', label: '🍃 Organic' },
    { value: 'dairy-free', label: '🥛 Dairy Free' }
  ];

  const prepTimeOptions = [
    { value: 'quick', label: '⚡ Quick (Under 15 min)', maxTime: 15 },
    { value: 'medium', label: '⏱️ Medium (15-30 min)', maxTime: 30 },
    { value: 'any', label: '🕒 Any Time' }
  ];

  const discountOptions = [
    { value: 10, label: '10% or more' },
    { value: 20, label: '20% or more' },
    { value: 30, label: '30% or more' },
    { value: 40, label: '40% or more' },
  ];

  const hasActiveFilters = filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 || 
    filters.dietaryPreferences.length > 0 || filters.ratingFilter > 0 || 
    filters.prepTimeFilter !== 'any' || filters.discountFilter > 0 || 
    filters.quickDelivery || filters.maxDeliveryTime < 60;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<FiFilter />}
          endIcon={<FiChevronRight style={{ transform: filtersOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          sx={{
            color: '#ff6f61', 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 700,
            background: alpha('#ff6f61', 0.08), 
            borderRadius: '25px', 
            px: 4, 
            py: 1.5,
            fontSize: '1rem',
            '&:hover': { 
              background: alpha('#ff6f61', 0.12), 
              transform: 'translateY(-2px)', 
              boxShadow: `0 12px 30px ${alpha('#ff6f61', 0.2)}` 
            },
            transition: 'all 0.3s ease'
          }}
        >
          Advanced Filters {hasActiveFilters && '• Active'}
        </Button>
        
        {hasActiveFilters && (
          <Chip 
            label="Clear All" 
            size="medium" 
            color="primary" 
            onClick={() => dispatch({ type: 'RESET_ALL' })}
            onDelete={() => dispatch({ type: 'RESET_ALL' })}
            deleteIcon={<FiX />}
            sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
              color: 'white',
              '& .MuiChip-deleteIcon': { color: 'white' },
              '&:hover': { background: `linear-gradient(135deg, #ff8a65, #ff6f61)` }
            }}
          />
        )}
      </Box>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              p: 4, 
              background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`, 
              borderRadius: '25px', 
              border: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`, 
              boxShadow: `0 20px 60px ${alpha(theme.palette.grey[900], 0.1)}`, 
              backdropFilter: 'blur(20px)',
              mt: 2
            }}>
              <Grid container spacing={3}>
                {/* Price Range */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: theme.palette.text.primary, 
                      fontSize: '1.1rem' 
                    }}>
                      <FiDollarSign color="#ff6f61" /> Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                    </Typography>
                    <Slider 
                      value={filters.priceRange} 
                      onChange={(_, newValue) => dispatch({ type: 'SET_PRICE', payload: newValue })} 
                      valueLabelDisplay="auto" 
                      min={0} 
                      max={1000} 
                      step={10} 
                      sx={{
                        color: '#ff6f61', 
                        '& .MuiSlider-valueLabel': { 
                          background: '#ff6f61', 
                          fontFamily: "'Poppins', sans-serif", 
                          fontWeight: 600, 
                          borderRadius: '10px',
                          padding: '4px 12px'
                        }, 
                        '& .MuiSlider-track': { 
                          background: `linear-gradient(90deg, #ff6f61, #ff8a65)` 
                        },
                        '& .MuiSlider-rail': {
                          background: alpha(theme.palette.grey[300], 0.5)
                        }
                      }} 
                    />
                  </Box>
                </Grid>

                {/* Rating Filter */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: theme.palette.text.primary, 
                      fontSize: '1.1rem' 
                    }}>
                      <FiAward color="#ff6f61" /> Minimum Rating: {filters.ratingFilter > 0 ? `${filters.ratingFilter}+ Stars` : 'Any'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div 
                          key={star} 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconButton 
                            onClick={() => dispatch({ type: 'SET_RATING', payload: filters.ratingFilter === star ? 0 : star })} 
                            sx={{
                              color: star <= filters.ratingFilter ? '#ffc107' : alpha(theme.palette.grey[400], 0.7), 
                              background: star <= filters.ratingFilter ? alpha('#ffc107', 0.1) : 'transparent', 
                              p: 1.5, 
                              border: `2px solid ${star <= filters.ratingFilter ? '#ffc107' : 'transparent'}`, 
                              borderRadius: '12px',
                              transition: 'all 0.3s ease', 
                              '&:hover': { 
                                background: star <= filters.ratingFilter ? alpha('#ffc107', 0.2) : alpha(theme.palette.grey[200], 0.5), 
                                transform: 'scale(1.05)' 
                              }
                            }}
                          >
                            <FiStar fill={star <= filters.ratingFilter ? '#ffc107' : 'none'} size={20} />
                          </IconButton>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Dietary Preferences */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      mb: 2, 
                      color: theme.palette.text.primary, 
                      fontSize: '1.1rem' 
                    }}>
                      🍽️ Dietary Preferences
                    </Typography>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                      {dietaryOptions.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FormControlLabel 
                            control={
                              <Checkbox 
                                checked={filters.dietaryPreferences.includes(option.value)} 
                                onChange={(e) => {
                                  if (e.target.checked) dispatch({ type: 'SET_DIETARY', payload: [...filters.dietaryPreferences, option.value] });
                                  else dispatch({ type: 'SET_DIETARY', payload: filters.dietaryPreferences.filter(pref => pref !== option.value) });
                                }} 
                                sx={{ 
                                  color: '#ff6f61', 
                                  '&.Mui-checked': { 
                                    color: '#ff6f61', 
                                    transform: 'scale(1.1)' 
                                  }, 
                                  transition: 'all 0.2s ease' 
                                }} 
                              />
                            } 
                            label={option.label} 
                            sx={{ 
                              fontFamily: "'Poppins', sans-serif", 
                              fontWeight: 500, 
                              background: filters.dietaryPreferences.includes(option.value) ? alpha('#ff6f61', 0.1) : alpha(theme.palette.grey[100], 0.5), 
                              padding: '10px 20px', 
                              borderRadius: '15px', 
                              border: `2px solid ${filters.dietaryPreferences.includes(option.value) ? '#ff6f61' : alpha(theme.palette.grey[300], 0.3)}`, 
                              transition: 'all 0.3s ease', 
                              m: 0,
                              '&:hover': { 
                                background: filters.dietaryPreferences.includes(option.value) ? alpha('#ff6f61', 0.15) : alpha(theme.palette.grey[200], 0.5), 
                                transform: 'translateY(-2px)' 
                              } 
                            }} 
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </Box>
                </Grid>

                {/* Preparation Time & Quick Delivery */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: theme.palette.text.primary, 
                      fontSize: '1.1rem' 
                    }}>
                      <FiClock color="#ff6f61" /> Preparation Time
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {prepTimeOptions.map((option) => (
                        <motion.div 
                          key={option.value} 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip 
                            label={option.label} 
                            onClick={() => dispatch({ type: 'SET_PREP_TIME', payload: option.value })} 
                            color={filters.prepTimeFilter === option.value ? 'primary' : 'default'} 
                            sx={{ 
                              fontFamily: "'Poppins', sans-serif", 
                              fontWeight: 600, 
                              background: filters.prepTimeFilter === option.value ? `linear-gradient(135deg, #ff6f61, #ff8a65)` : alpha(theme.palette.grey[100], 0.5), 
                              color: filters.prepTimeFilter === option.value ? 'white' : theme.palette.text.primary, 
                              border: filters.prepTimeFilter === option.value ? 'none' : `2px solid ${alpha(theme.palette.grey[300], 0.3)}`, 
                              transition: 'all 0.3s ease', 
                              '&:hover': { 
                                background: filters.prepTimeFilter === option.value ? `linear-gradient(135deg, #ff8a65, #ff6f61)` : alpha(theme.palette.grey[200], 0.5) 
                              },
                              height: 'auto',
                              py: 1
                            }} 
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Discount Filter */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: theme.palette.text.primary, 
                      fontSize: '1.1rem' 
                    }}>
                      💰 Discount
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {discountOptions.map((option) => (
                        <motion.div 
                          key={option.value} 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip 
                            label={option.label} 
                            onClick={() => dispatch({ type: 'SET_DISCOUNT', payload: filters.discountFilter === option.value ? 0 : option.value })} 
                            color={filters.discountFilter === option.value ? 'primary' : 'default'} 
                            sx={{ 
                              fontFamily: "'Poppins', sans-serif", 
                              fontWeight: 600, 
                              background: filters.discountFilter === option.value ? `linear-gradient(135deg, #ff6f61, #ff8a65)` : alpha(theme.palette.grey[100], 0.5), 
                              color: filters.discountFilter === option.value ? 'white' : theme.palette.text.primary, 
                              border: filters.discountFilter === option.value ? 'none' : `2px solid ${alpha(theme.palette.grey[300], 0.3)}`, 
                              transition: 'all 0.3s ease', 
                              '&:hover': { 
                                background: filters.discountFilter === option.value ? `linear-gradient(135deg, #ff8a65, #ff6f61)` : alpha(theme.palette.grey[200], 0.5) 
                              },
                              height: 'auto',
                              py: 1
                            }} 
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
});

// 🔥 SWIGGY-STYLE OFFERS CAROUSEL
const OffersCarousel = React.memo(({ offersRef, offers }) => {
  const [activeOffer, setActiveOffer] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setActiveOffer((prev) => (prev + 1) % offers.length), 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const handleTouchStart = useCallback((e) => setTouchStart(e.touches[0].clientX), []);
  const handleTouchMove = useCallback((e) => {
    if (!touchStart) return;
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      setActiveOffer((prev) => diff > 0 ? (prev + 1) % offers.length : (prev - 1 + offers.length) % offers.length);
      setTouchStart(null);
    }
  }, [touchStart, offers.length]);

  return (
    <Box 
      ref={offersRef} 
      sx={{ 
        position: "relative", 
        overflow: "hidden", 
        height: { xs: 180, sm: 220, md: 250 }, 
        mb: { xs: 4, md: 6 }, 
        borderRadius: "20px", 
        boxShadow: `0 20px 50px ${alpha(theme.palette.grey[900], 0.15)}`,
        border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}`
      }} 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div 
          key={activeOffer} 
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -100 }} 
          transition={{ duration: 0.5, ease: "easeInOut" }} 
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <Box sx={{ 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            backgroundImage: `url(${offers[activeOffer].image})`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            position: "relative", 
            px: { xs: 3, md: 6 },
            borderRadius: "20px"
          }}>
            <Box sx={{ 
              position: "absolute", 
              inset: 0, 
              background: `linear-gradient(90deg, ${alpha(theme.palette.grey[900], 0.8)} 0%, ${alpha(theme.palette.grey[900], 0.4)} 100%)`, 
              borderRadius: "20px" 
            }} />
            <Box sx={{ 
              position: "relative", 
              zIndex: 1, 
              p: { xs: 2, md: 4 }, 
              borderRadius: "15px", 
              color: "white", 
              maxWidth: { xs: "90%", md: "70%" },
              background: `linear-gradient(135deg, ${alpha(theme.palette.common.black, 0.4)} 0%, ${alpha(theme.palette.common.black, 0.2)} 100%)`, 
              boxShadow: `0 15px 40px ${alpha(theme.palette.grey[900], 0.3)}`, 
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, 
              backdropFilter: "blur(10px)" 
            }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="h5" sx={{ 
                  fontWeight: 800, 
                  mb: 1.5, 
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" }, 
                  fontFamily: "'Poppins', sans-serif", 
                  letterSpacing: "0.5px", 
                  textShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.7)}`, 
                  lineHeight: 1.2 
                }}>
                  {offers[activeOffer].title}
                </Typography>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography variant="body1" sx={{ 
                  fontWeight: 500, 
                  mb: 3, 
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" }, 
                  fontFamily: "'Poppins', sans-serif", 
                  opacity: 0.9, 
                  lineHeight: 1.4, 
                  textShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.5)}` 
                }}>
                  {offers[activeOffer].subtitle}
                </Typography>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  variant="contained" 
                  size="medium" 
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} 
                  sx={{
                    background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`, 
                    color: "#ff6f61", 
                    fontWeight: 700, 
                    px: { xs: 4, md: 6 }, 
                    py: { xs: 1, md: 1.2 }, 
                    borderRadius: "25px", 
                    fontSize: { xs: "0.9rem", md: "1rem" }, 
                    textTransform: "none", 
                    boxShadow: `0 8px 25px ${alpha("#000", 0.2)}`, 
                    "&:hover": { 
                      background: `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)`, 
                      transform: "translateY(-2px)", 
                      boxShadow: `0 12px 35px ${alpha("#000", 0.3)}` 
                    }, 
                    transition: "all 0.3s ease", 
                    fontFamily: "'Poppins', sans-serif" 
                  }} 
                  aria-label="Order Now"
                >
                  Order Now
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
      <Box sx={{ 
        position: "absolute", 
        bottom: 15, 
        left: "50%", 
        transform: "translateX(-50%)", 
        display: "flex", 
        gap: 1.5, 
        zIndex: 2 
      }}>
        {offers.map((_, index) => (
          <motion.div 
            key={index} 
            onClick={() => setActiveOffer(index)} 
            style={{ 
              width: 10, 
              height: 10, 
              borderRadius: "50%", 
              backgroundColor: activeOffer === index ? "#ffffff" : alpha(theme.palette.grey[400], 0.8), 
              cursor: "pointer", 
              border: `1px solid ${theme.palette.common.white}`, 
              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}` 
            }} 
            whileHover={{ scale: 1.3 }} 
            whileTap={{ scale: 0.9 }} 
            transition={{ type: "spring", stiffness: 400 }} 
            role="button" 
            aria-label={`Go to offer ${index + 1}`} 
          />
        ))}
      </Box>
    </Box>
  );
});

// 🔥 SWIGGY-STYLE MENU ITEM (ENHANCED)
const MenuItem = React.memo(({ item, addToCart, addToFavorites, removeFromFavorites, isFavorite, itemRef, cart }) => {
  const [liked, setLiked] = useState(isFavorite);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(cart.find(cartItem => cartItem.id === item.id)?.quantity || 0);
  const theme = useTheme();
  const controls = useAnimation();

  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = useCallback(async () => {
    if (added) return;
    setAdded(true);
    try {
      await addToCart({ ...item, quantity: 1 });
      setQuantity(prev => prev + 1);
      await controls.start({ 
        scale: [1, 1.2, 1], 
        transition: { duration: 0.4 } 
      });
      toast.success(`${item.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error("Failed to add to cart");
    }
    setTimeout(() => setAdded(false), 1500);
  }, [addToCart, item, controls, added]);

  const handleIncreaseQuantity = useCallback(async () => {
    try {
      await addToCart({ ...item, quantity: 1 });
      setQuantity(prev => prev + 1);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  }, [addToCart, item]);

  const handleDecreaseQuantity = useCallback(async () => {
    if (quantity <= 1) {
      // Remove from cart if quantity becomes 0
      try {
        await addToCart({ ...item, quantity: -1 });
        setQuantity(0);
      } catch (err) {
        toast.error("Failed to update quantity");
      }
    } else {
      try {
        await addToCart({ ...item, quantity: -1 });
        setQuantity(prev => prev - 1);
      } catch (err) {
        toast.error("Failed to update quantity");
      }
    }
  }, [addToCart, item, quantity]);

  const handleToggleFavorite = useCallback(async () => {
    setLiked(!liked);
    try {
      if (!liked) { 
        await addToFavorites(item); 
        toast.success("Added to favorites!", {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: true,
        });
      } else { 
        await removeFromFavorites(item.id); 
        toast.success("Removed from favorites!", {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: true,
        });
      }
    } catch (err) { 
      setLiked(liked); 
      toast.error("Failed to update favorites");
    }
  }, [liked, addToFavorites, removeFromFavorites, item]);

  const itemType = item.type?.toLowerCase() || "veg";

  return (
    <>
      <motion.div 
        ref={itemRef} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ type: "spring", stiffness: 300, damping: 25 }} 
        whileHover={{ scale: 1.02, y: -5 }} 
        whileTap={{ scale: 0.98 }} 
        style={{ position: "relative" }}
      >
        <Card sx={{ 
          borderRadius: "20px", 
          overflow: "hidden", 
          position: "relative", 
          background: "white", 
          boxShadow: `0 10px 30px ${alpha(theme.palette.grey[300], 0.15)}`, 
          transition: "all 0.4s ease", 
          border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}`, 
          "&:hover": { 
            boxShadow: `0 20px 50px ${alpha(theme.palette.grey[400], 0.2)}`, 
            "& .food-image": { transform: "scale(1.05)" } 
          }
        }}>
          <Box sx={{ position: "relative", overflow: "hidden", paddingTop: "65%" }}>
            {/* Image Loading Skeleton */}
            {!imageLoaded && (
              <Box sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%",
                background: `linear-gradient(90deg, ${alpha(theme.palette.grey[200], 0.8)} 25%, ${alpha(theme.palette.grey[300], 0.8)} 50%, ${alpha(theme.palette.grey[200], 0.8)} 75%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear'
              }} />
            )}
            
            {/* Main Image */}
            <CardMedia 
              component="img" 
              image={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
              alt={item.name} 
              className="food-image" 
              onLoad={() => setImageLoaded(true)} 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)", 
                display: imageLoaded ? "block" : "none" 
              }} 
            />
            
            {/* Gradient Overlay */}
            <Box sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0)} 50%, ${alpha(theme.palette.common.black, 0.7)} 100%)` 
            }} />
            
            {/* Offer Badge */}
            {item.offer && (
              <Box sx={{ 
                position: "absolute", 
                top: 15, 
                left: -35, 
                background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                color: "white", 
                padding: "6px 35px", 
                transform: "rotate(-45deg)", 
                fontWeight: 800, 
                boxShadow: `0 6px 20px ${alpha("#ff6f61", 0.4)}`, 
                zIndex: 1, 
                fontSize: { xs: "0.7rem", md: "0.8rem" }, 
                fontFamily: "'Poppins', sans-serif", 
                letterSpacing: "0.5px" 
              }}>
                {item.offer}
              </Box>
            )}
            
            {/* Veg/Non-Veg Icon */}
            <Chip 
              label={itemType === "veg" ? "🥬 Veg" : "🍗 Non-Veg"} 
              color={itemType === "veg" ? "success" : "error"} 
              sx={{ 
                position: "absolute", 
                top: 15, 
                right: 15, 
                fontWeight: 700, 
                padding: "4px 10px", 
                borderRadius: "15px", 
                fontFamily: "'Poppins', sans-serif", 
                boxShadow: `0 4px 12px ${alpha(theme.palette.grey[900], 0.2)}`, 
                fontSize: "0.75rem", 
                background: itemType === "veg" ? `linear-gradient(135deg, #4caf50, #66bb6a)` : `linear-gradient(135deg, #f44336, #ef5350)`, 
                color: "white", 
                border: `1px solid white` 
              }} 
            />

            {/* Favorite Button */}
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              style={{ position: "absolute", top: 15, left: 15, zIndex: 2 }}
            >
              <IconButton 
                onClick={handleToggleFavorite} 
                sx={{ 
                  bgcolor: alpha(theme.palette.common.white, 0.95), 
                  color: liked ? "#ff6f61" : alpha(theme.palette.grey[600], 0.8), 
                  "&:hover": { bgcolor: "white" }, 
                  boxShadow: `0 4px 15px ${alpha(theme.palette.grey[400], 0.3)}`, 
                  width: 38, 
                  height: 38, 
                  backdropFilter: "blur(10px)", 
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.3)}` 
                }} 
                aria-label={liked ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
              >
                <FiHeart size={18} fill={liked ? "#ff6f61" : "none"} />
              </IconButton>
            </motion.div>

            {/* Prep Time */}
            {item.prepTime && (
              <Box sx={{ 
                position: "absolute", 
                bottom: 15, 
                left: 15, 
                background: alpha(theme.palette.common.black, 0.75), 
                color: "white", 
                padding: "4px 12px", 
                borderRadius: "15px", 
                fontSize: "0.75rem", 
                display: "flex", 
                alignItems: "center", 
                gap: 1, 
                backdropFilter: "blur(10px)", 
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, 
                fontFamily: "'Poppins', sans-serif", 
                fontWeight: 600 
              }}>
                <FiClock size={10} />{item.prepTime}
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: { xs: 2.5, md: 3 }, position: "relative" }}>
            {/* Item Name */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: "text.primary", 
                mb: 1.5, 
                lineHeight: 1.3, 
                fontFamily: "'Poppins', sans-serif", 
                fontSize: { xs: "1rem", md: "1.1rem" }, 
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main }
              }}
              onClick={() => setShowDetails(true)}
            >
              {item.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Rating 
                value={item.rating || 4.5} 
                readOnly 
                precision={0.5} 
                size="small"
                sx={{ color: "#ffc107" }} 
                aria-label={`Rating: ${item.rating || 4.5} out of 5`} 
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontSize: "0.85rem", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5, 
                  fontWeight: 600 
                }}
              >
                ({item.reviews || "New"})
              </Typography>
            </Box>

            {/* Description */}
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: "text.secondary", 
                lineHeight: 1.5, 
                fontFamily: "'Poppins', sans-serif", 
                fontSize: { xs: "0.8rem", md: "0.85rem" }, 
                opacity: 0.8,
                height: "40px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}
            >
              {item.description || "Delicious and freshly prepared with the finest ingredients."}
            </Typography>

            {/* Price and Add Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  color: "#ff6f61", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  fontFamily: "'Poppins', sans-serif", 
                  fontSize: { xs: "1.2rem", md: "1.3rem" }
                }}
              >
                <motion.span animate={added ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.6 }}>
                  ₹{item.price.toFixed(2)}
                </motion.span>
              </Typography>

              {currentQuantity > 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  background: `linear-gradient(135deg, ${alpha('#ff6f61', 0.1)} 0%, ${alpha('#ff8a65', 0.05)} 100%)`, 
                  borderRadius: "20px", 
                  padding: "4px 12px",
                  border: `1px solid ${alpha('#ff6f61', 0.2)}`
                }}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton 
                      size="small" 
                      onClick={handleDecreaseQuantity}
                      sx={{ 
                        color: "#ff6f61", 
                        p: 0.5,
                        "&:hover": { background: alpha('#ff6f61', 0.1) }
                      }}
                    >
                      <FiMinus size={14} />
                    </IconButton>
                  </motion.div>
                  <Typography sx={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 700, 
                    fontSize: "0.9rem", 
                    minWidth: "24px", 
                    textAlign: "center",
                    color: "#ff6f61"
                  }}>
                    {currentQuantity}
                  </Typography>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton 
                      size="small" 
                      onClick={handleIncreaseQuantity}
                      sx={{ 
                        color: "#ff6f61", 
                        p: 0.5,
                        "&:hover": { background: alpha('#ff6f61', 0.1) }
                      }}
                    >
                      <FiPlus size={14} />
                    </IconButton>
                  </motion.div>
                </Box>
              ) : (
                <motion.div 
                  animate={controls} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant="contained" 
                    onClick={handleAddToCart} 
                    sx={{
                      background: `linear-gradient(135deg, #ff6f61 0%, #ff8a65 100%)`, 
                      "&:hover": { 
                        background: `linear-gradient(135deg, #ff8a65 0%, #ff6f61 100%)`, 
                        transform: "translateY(-2px)" 
                      }, 
                      borderRadius: "20px", 
                      px: { xs: 2.5, md: 3 }, 
                      py: 0.8, 
                      fontWeight: 700, 
                      textTransform: "none", 
                      boxShadow: `0 6px 20px ${alpha("#ff6f61", 0.3)}`, 
                      fontSize: { xs: "0.8rem", md: "0.9rem" }, 
                      fontFamily: "'Poppins', sans-serif", 
                      minWidth: { xs: '90px', md: '100px' }, 
                      transition: "all 0.3s ease"
                    }} 
                    aria-label={`Add ${item.name} to cart`}
                  >
                    {added ? "✓ Added" : "+ Add"}
                  </Button>
                </motion.div>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick View Modal */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 30px 80px ${alpha(theme.palette.grey[900], 0.3)}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: 800, 
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`,
          pb: 2
        }}>
          {item.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="200"
              image={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
              alt={item.name}
              sx={{ borderRadius: "15px", objectFit: "cover" }}
            />
          </Box>
          <Typography variant="body1" sx={{ mb: 3, fontFamily: "'Poppins', sans-serif" }}>
            {item.description || "Delicious and freshly prepared with the finest ingredients."}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip label={itemType === "veg" ? "🥬 Vegetarian" : "🍗 Non-Vegetarian"} color={itemType === "veg" ? "success" : "error"} size="small" />
            {item.prepTime && <Chip icon={<FiClock />} label={item.prepTime} size="small" />}
            <Chip icon={<FiStar />} label={`${item.rating || 4.5}/5`} size="small" />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: "#ff6f61" }}>
            ₹{item.price.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowDetails(false)} sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddToCart}
            sx={{ 
              fontFamily: "'Poppins', sans-serif",
              background: `linear-gradient(135deg, #ff6f61, #ff8a65)`,
              "&:hover": { background: `linear-gradient(135deg, #ff8a65, #ff6f61)` }
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

// 🔥 ENHANCED CART DRAWER
const CartDrawer = React.memo(({ open, onClose, cartItems, removeFromCart, navigate, updateQuantity, user }) => {
  const theme = useTheme();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const handleCheckout = useCallback(() => {
    if (!user) { 
      toast.error("Please log in to proceed to checkout"); 
      navigate("/?login=true"); 
      onClose(); 
      return; 
    }
    setIsCheckingOut(true);
    setTimeout(() => { 
      setIsCheckingOut(false); 
      onClose(); 
      navigate("/checkout"); 
    }, 800);
  }, [user, navigate, onClose]);

  const handleTouchStart = useCallback((e) => setTouchStart(e.touches[0].clientX), []);
  const handleTouchMove = useCallback((e) => {
    if (!touchStart) return;
    const diff = touchStart - e.touches[0].clientX;
    if (diff > 100) { onClose(); setTouchStart(null); }
  }, [touchStart, onClose]);

  const getTotalItems = useCallback(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  return (
    <SwipeableDrawer 
      anchor="right" 
      open={open} 
      onClose={onClose} 
      onOpen={() => {}} 
      swipeAreaWidth={20} 
      disableSwipeToOpen={false} 
      ModalProps={{ keepMounted: true }} 
      sx={{ 
        "& .MuiDrawer-paper": { 
          width: { xs: "95vw", sm: 450 }, 
          background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`, 
          boxShadow: `-20px 0 60px ${alpha(theme.palette.grey[900], 0.3)}`, 
          borderRadius: "30px 0 0 30px", 
          border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}`, 
          overflow: "hidden", 
          backdropFilter: "blur(20px)" 
        } 
      }} 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove}
    >
      <Box sx={{ 
        p: 4, 
        background: `linear-gradient(135deg, #ff6f61 0%, #ff8a65 100%)`, 
        color: "white", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderRadius: "30px 0 0 0", 
        boxShadow: `0 8px 30px ${alpha("#ff6f61", 0.4)}`, 
        position: "relative", 
        overflow: "hidden", 
        '&::before': { 
          content: '""', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")` 
        } 
      }}>
        <Box>
          <Typography variant="h5" sx={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 800, 
            letterSpacing: "0.5px", 
            textShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.3)}`, 
            fontSize: "1.5rem", 
            display: "flex", 
            alignItems: "center", 
            gap: 1 
          }}>
            🛒 Your Cart
            <Badge 
              badgeContent={getTotalItems()} 
              color="secondary" 
              sx={{ 
                '& .MuiBadge-badge': { 
                  background: 'white', 
                  color: '#ff6f61', 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 'bold', 
                  fontSize: '0.8rem', 
                  minWidth: '20px', 
                  height: '20px', 
                  borderRadius: '10px' 
                } 
              }} 
            />
          </Typography>
          <Typography variant="body2" sx={{ 
            fontFamily: "'Poppins', sans-serif", 
            opacity: 0.9, 
            fontSize: "0.9rem", 
            mt: 0.5 
          }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
          </Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            onClick={onClose} 
            aria-label="Close cart" 
            sx={{ 
              color: "white", 
              background: alpha(theme.palette.common.white, 0.2), 
              backdropFilter: "blur(10px)", 
              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`, 
              '&:hover': { 
                background: alpha(theme.palette.common.white, 0.3) 
              }, 
              transition: 'all 0.3s ease' 
            }}
          >
            <FiX size={24} />
          </IconButton>
        </motion.div>
      </Box>

      <List sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ fontSize: "4rem", mb: 2, opacity: 0.5 }}>🛒</Box>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 700, 
                  fontSize: "1.6rem", 
                  mb: 2 
                }}
              >
                Your Cart is Empty
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontSize: "1rem", 
                  mb: 3, 
                  opacity: 0.7, 
                  maxWidth: '300px', 
                  mx: 'auto', 
                  lineHeight: 1.6 
                }}
              >
                Explore our delicious menu and add some tasty items to get started!
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  onClick={() => { onClose(); navigate("/menu"); }} 
                  sx={{ 
                    background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                    borderRadius: "25px", 
                    py: 1.5, 
                    px: 4, 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    fontSize: "1.1rem", 
                    boxShadow: `0 8px 25px ${alpha("#ff6f61", 0.3)}`, 
                    '&:hover': { 
                      background: `linear-gradient(135deg, #ff8a65, #ff6f61)`, 
                      transform: 'translateY(-2px)', 
                      boxShadow: `0 12px 30px ${alpha("#ff6f61", 0.4)}` 
                    }, 
                    transition: 'all 0.3s ease' 
                  }} 
                  aria-label="Explore Menu"
                >
                  🍽️ Explore Menu
                </Button>
              </motion.div>
            </motion.div>
          </Box>
        ) : (
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                transition={{ duration: 0.3 }} 
                layout
              >
                <ListItem sx={{ 
                  py: 2, 
                  px: 3, 
                  mb: 2, 
                  borderRadius: "20px", 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.9)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`, 
                  boxShadow: `0 8px 25px ${alpha(theme.palette.grey[300], 0.15)}`, 
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}`, 
                  "&:hover": { 
                    background: `linear-gradient(135deg, ${alpha('#ff6f61', 0.03)} 0%, ${alpha(theme.palette.common.white, 0.95)} 100%)`, 
                    boxShadow: `0 12px 35px ${alpha(theme.palette.grey[400], 0.2)}`, 
                    transform: 'translateY(-2px)' 
                  }, 
                  transition: "all 0.3s ease", 
                  backdropFilter: "blur(10px)" 
                }}>
                  <CardMedia 
                    component="img" 
                    image={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                    alt={item.name} 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: "15px", 
                      mr: 3, 
                      boxShadow: `0 6px 20px ${alpha(theme.palette.grey[400], 0.2)}`, 
                      objectFit: 'cover' 
                    }} 
                  />
                  <ListItemText 
                    primary={
                      <Typography sx={{ 
                        fontFamily: "'Poppins', sans-serif", 
                        fontWeight: 700, 
                        fontSize: "1rem", 
                        color: theme.palette.text.primary, 
                        mb: 0.5 
                      }}>
                        {item.name}
                      </Typography>
                    } 
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                              disabled={item.quantity <= 1} 
                              sx={{ 
                                width: 30, 
                                height: 30, 
                                borderRadius: "50%", 
                                border: `1px solid ${item.quantity <= 1 ? theme.palette.grey[300] : "#ff6f61"}`, 
                                color: item.quantity <= 1 ? theme.palette.grey[400] : "#ff6f61", 
                                "&:hover": { 
                                  borderColor: item.quantity <= 1 ? theme.palette.grey[300] : "#ff4839", 
                                  color: item.quantity <= 1 ? theme.palette.grey[400] : "#ff4839", 
                                  background: alpha('#ff6f61', 0.05) 
                                }, 
                                "&:disabled": { 
                                  borderColor: theme.palette.grey[300], 
                                  color: theme.palette.grey[400] 
                                } 
                              }} 
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <FiMinus size={14} />
                            </IconButton>
                          </motion.div>
                          <Typography sx={{ 
                            fontFamily: "'Poppins', sans-serif", 
                            fontSize: "1.1rem", 
                            fontWeight: 700, 
                            minWidth: 30, 
                            textAlign: "center", 
                            color: theme.palette.text.primary 
                          }}>
                            {item.quantity}
                          </Typography>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                              sx={{ 
                                width: 30, 
                                height: 30, 
                                borderRadius: "50%", 
                                border: `1px solid #ff6f61`, 
                                color: "#ff6f61", 
                                "&:hover": { 
                                  borderColor: "#ff4839", 
                                  color: "#ff4839", 
                                  background: alpha('#ff6f61', 0.05) 
                                } 
                              }} 
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <FiPlus size={14} />
                            </IconButton>
                          </motion.div>
                        </Box>
                        <Typography sx={{ 
                          fontFamily: "'Poppins', sans-serif", 
                          color: "#ff6f61", 
                          fontWeight: 700, 
                          fontSize: "1.2rem" 
                        }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    } 
                  />
                  <motion.div whileHover={{ scale: 1.1, rotate: 12 }} whileTap={{ scale: 0.9 }}>
                    <IconButton 
                      onClick={() => removeFromCart(item.id)} 
                      sx={{ 
                        color: theme.palette.error.main, 
                        background: alpha(theme.palette.error.main, 0.1), 
                        '&:hover': { 
                          background: alpha(theme.palette.error.main, 0.2) 
                        }, 
                        transition: 'all 0.3s ease', 
                        ml: 1 
                      }} 
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </motion.div>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </List>

      {cartItems.length > 0 && (
        <Box sx={{ 
          p: 4, 
          borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.95)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`, 
          borderRadius: "0 0 0 30px", 
          boxShadow: `0 -8px 25px ${alpha(theme.palette.grey[200], 0.2)}`, 
          backdropFilter: "blur(10px)" 
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, px: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontWeight: 700, 
                fontSize: "1.3rem", 
                color: theme.palette.text.primary 
              }}
            >
              💰 Subtotal
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontWeight: 800, 
                color: "#ff6f61", 
                fontSize: "1.6rem" 
              }}
            >
              ₹{totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            animate={isCheckingOut ? { 
              scale: [1, 1.05, 1], 
              background: [
                `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                `linear-gradient(135deg, #4caf50, #66bb6a)`, 
                `linear-gradient(135deg, #ff6f61, #ff8a65)`
              ] 
            } : {}} 
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleCheckout} 
              disabled={isCheckingOut} 
              sx={{
                background: `linear-gradient(135deg, #ff6f61 0%, #ff8a65 100%)`, 
                borderRadius: "25px", 
                py: 1.5, 
                fontSize: "1.1rem", 
                fontWeight: 700, 
                fontFamily: "'Poppins', sans-serif", 
                textTransform: "none", 
                boxShadow: `0 12px 35px ${alpha("#ff6f61", 0.4)}`, 
                "&:hover": { 
                  background: `linear-gradient(135deg, #ff8a65 0%, #ff6f61 100%)`, 
                  boxShadow: `0 16px 45px ${alpha("#ff6f61", 0.5)}` 
                }, 
                "&:disabled": { 
                  background: `linear-gradient(135deg, ${alpha('#ff6f61', 0.6)} 0%, ${alpha('#ff8a65', 0.6)} 100%)`, 
                  transform: 'none' 
                }, 
                transition: "all 0.4s ease", 
                position: 'relative', 
                overflow: 'hidden', 
                '&::before': { 
                  content: '""', 
                  position: 'absolute', 
                  top: 0, 
                  left: '-100%', 
                  width: '100%', 
                  height: '100%', 
                  background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`, 
                  transition: 'left 0.6s ease' 
                }, 
                '&:hover::before': { left: '100%' }
              }} 
              aria-label="Proceed to Checkout"
            >
              {isCheckingOut ? (
                <>
                  <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
                  Processing...
                </>
              ) : (
                `🚀 Proceed to Checkout (${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'})`
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => { onClose(); navigate("/menu"); }} 
              sx={{ 
                borderRadius: "25px", 
                py: 1.2, 
                fontSize: "0.95rem", 
                fontWeight: 600, 
                fontFamily: "'Poppins', sans-serif", 
                textTransform: "none", 
                borderColor: alpha(theme.palette.primary.main, 0.5), 
                color: theme.palette.primary.main, 
                mt: 2, 
                "&:hover": { 
                  borderColor: theme.palette.primary.main, 
                  background: alpha(theme.palette.primary.main, 0.05), 
                  transform: "translateY(-1px)" 
                }, 
                transition: "all 0.3s ease" 
              }}
            >
              🛍️ Continue Shopping
            </Button>
          </motion.div>
        </Box>
      )}
    </SwipeableDrawer>
  );
});

// 🔥 SHIMMER SKELETON LOADER
const MenuItemSkeleton = () => (
  <Card sx={{ 
    borderRadius: "20px", 
    overflow: "hidden", 
    boxShadow: `0 8px 25px ${alpha('#000', 0.08)}`,
    background: `linear-gradient(90deg, ${alpha('#f0f0f0', 0.8)} 25%, ${alpha('#e0e0e0', 0.8)} 50%, ${alpha('#f0f0f0', 0.8)} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear'
  }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" height={24} sx={{ mb: 1.5, borderRadius: '8px' }} />
      <Skeleton variant="text" height={20} width="70%" sx={{ mb: 2, borderRadius: '6px' }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Skeleton variant="circular" width={100} height={20} />
        <Skeleton variant="text" width={60} height={20} sx={{ borderRadius: '6px' }} />
      </Box>
      <Skeleton variant="text" height={16} sx={{ mb: 1, borderRadius: '4px' }} />
      <Skeleton variant="text" height={16} width="85%" sx={{ mb: 3, borderRadius: '4px' }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width={70} height={32} sx={{ borderRadius: '8px' }} />
        <Skeleton variant="rounded" width={100} height={42} sx={{ borderRadius: '20px' }} />
      </Box>
    </CardContent>
  </Card>
);

// 🔥 TOP PICKS SECTION
const TopPicksSection = React.memo(({ topPicks, addToCart, cart }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: { xs: 6, md: 8 } }}>
      <Typography variant="h4" sx={{ 
        fontFamily: "'Poppins', sans-serif", 
        fontWeight: 800, 
        mb: 4, 
        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`, 
        backgroundClip: 'text', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent', 
        fontSize: { xs: '1.8rem', md: '2.5rem' },
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        🔥 Top Picks This Week
      </Typography>
      <Grid container spacing={3}>
        {topPicks.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ 
                borderRadius: "20px", 
                overflow: "hidden", 
                position: "relative",
                background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.9)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
                boxShadow: `0 10px 30px ${alpha(theme.palette.grey[300], 0.2)}`,
                border: `1px solid ${alpha(theme.palette.grey[200], 0.3)}`,
                '&:hover': {
                  boxShadow: `0 20px 50px ${alpha(theme.palette.grey[400], 0.3)}`,
                  transform: 'translateY(-5px)'
                },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ position: 'relative', paddingTop: '60%' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: `linear-gradient(135deg, #ff6f61, #ff8a65)`,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    #{index + 1} Pick
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: '1rem'
                  }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      fontFamily: "'Poppins', sans-serif", 
                      fontWeight: 700, 
                      color: '#ff6f61',
                      fontSize: '1.1rem'
                    }}>
                      ₹{item.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                      sx={{
                        background: `linear-gradient(135deg, #ff6f61, #ff8a65)`,
                        borderRadius: '15px',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif",
                        '&:hover': {
                          background: `linear-gradient(135deg, #ff8a65, #ff6f61)`
                        }
                      }}
                    >
                      + Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

// 🚀 MAIN COMPONENT - ULTRA OPTIMIZED
const Menu = forwardRef((props, ref) => {
  const { scrollY } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [menuCache, setMenuCache] = useState(new Map());
  const [offers, setOffers] = useState([]);
  const [foodTypes, setFoodTypes] = useState(["All"]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState("");
  const [noItemsMessage, setNoItemsMessage] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useLocalStorage("recentSearches", []);
  
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: '',
    sortBy: 'default',
    selectedType: 'all',
    selectedFoodType: 'all',
    priceRange: [0, 1000],
    dietaryPreferences: [],
    ratingFilter: 0,
    prepTimeFilter: 'any',
    availability: 'all',
    discountFilter: 0,
    quickDelivery: false,
    maxDeliveryTime: 60
  });

  const { user, cart, favorites, addToCart, removeFromCart, addToFavorites, removeFromFavorites, updateCartItem, fetchMenuByCategory, fetchFavorites, fetchCart } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const filterRef = useRef(null);
  const itemRefs = useRef(new Map());
  const offersRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = "http://localhost:8885";

  useImperativeHandle(ref, () => ({ scrollToOffers: () => offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) }));

  // 🔥 ENHANCED CACHING
  const setWithExpiry = useCallback((key, value, ttl = 300000) => {
    setMenuCache(prev => new Map(prev).set(key, { value, expiry: Date.now() + ttl }));
  }, []);

  const getWithExpiry = useCallback((key) => {
    const item = menuCache.get(key);
    if (!item || Date.now() > item.expiry) { menuCache.delete(key); return null; }
    return item.value;
  }, [menuCache]);

  // 🔥 SEARCH SUGGESTIONS
  useEffect(() => {
    if (filters.searchTerm.length > 0) {
      const suggestions = menuItems
        .filter(item => item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        .map(item => item.name)
        .slice(0, 5);
      const recent = recentSearches
        .filter(term => term.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        .slice(0, 3);
      setSearchSuggestions([...new Set([...suggestions, ...recent])]);
    } else {
      setSearchSuggestions(recentSearches.slice(0, 5));
    }
  }, [filters.searchTerm, menuItems, recentSearches]);

  const handleSuggestionClick = useCallback((suggestion) => {
    dispatch({ type: 'SET_SEARCH', payload: suggestion });
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches(prev => [suggestion, ...prev].slice(0, 10));
    }
  }, [recentSearches, setRecentSearches]);

  // 🔥 SERVICE WORKER
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker Registered');
      }).catch(err => {
        console.log('SW Failed:', err);
      });
    }
  }, []);

  // 🔥 FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/menu/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categories = await response.json();
        setFoodTypes(["All", ...categories.map(category => category.name)]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFoodTypes(["All", "Biryani", "Burger", "Pizza", "Icecream", "Starter", "Main", "Dessert"]);
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  // 🔥 FETCH USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          await Promise.all([
            fetchFavorites().catch(console.error),
            fetchCart().catch(console.error)
          ]);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
      setInitialLoading(false);
    };
    fetchUserData();
  }, [user, fetchFavorites, fetchCart]);

  // 🔥 FETCH MENU DATA
  const debouncedSelectedType = useDebounce(filters.selectedType, 300);
  useEffect(() => {
    const fetchMenuData = async () => {
      const category = debouncedSelectedType === "all" ? "All" : debouncedSelectedType.charAt(0).toUpperCase() + debouncedSelectedType.slice(1);
      const cachedData = getWithExpiry(category);
      
      if (cachedData) { 
        setMenuItems(cachedData); 
        
        // Set top picks (first 3 items with highest rating)
        const sortedByRating = [...cachedData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTopPicks(sortedByRating.slice(0, 3));
        
        setNoItemsMessage(""); 
        return; 
      }

      setMenuLoading(true);
      try {
        const menuData = await fetchMenuByCategory(category);
        
        if (menuData && Array.isArray(menuData)) {
          setMenuItems(menuData);
          setWithExpiry(category, menuData);
          
          // Set top picks
          const sortedByRating = [...menuData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setTopPicks(sortedByRating.slice(0, 3));
          
          setNoItemsMessage(menuData.length === 0 ? `No items found for ${category}` : "");
        } else {
          setMenuItems([]);
          setTopPicks([]);
          setNoItemsMessage(`No items found for ${category}`);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        setMenuItems([]);
        setTopPicks([]);
        setNoItemsMessage("Failed to load menu items");
      } finally {
        setMenuLoading(false);
      }
    };
    
    fetchMenuData();
  }, [debouncedSelectedType, fetchMenuByCategory, getWithExpiry, setWithExpiry]);

  // 🔥 OFFERS
  useEffect(() => {
    setOffers([
      { 
        title: "50% Off First Order", 
        subtitle: "Use code: FIRST50 | Valid till 31st Dec", 
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc926" 
      },
      { 
        title: "Free Delivery", 
        subtitle: "On orders above ₹500 | Min order ₹199", 
        image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6" 
      },
      { 
        title: "Combo Deal", 
        subtitle: "Buy 2, Get 1 Free | Limited time offer", 
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" 
      },
    ]);
  }, []);

  // 🔥 URL SEARCH
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      const decodedSearch = decodeURIComponent(searchQuery);
      dispatch({ type: 'SET_SEARCH', payload: decodedSearch });
      const firstMatch = menuItems.find(item => item.name.toLowerCase().includes(decodedSearch.toLowerCase()));
      if (firstMatch && itemRefs.current.get(firstMatch.id)) {
        setTimeout(() => itemRefs.current.get(firstMatch.id).scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    }
  }, [location.search, menuItems]);

  // 🔥 SCROLL TOP
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 ULTRA-OPTIMIZED FILTERING & SORTING
  const sortedAndFilteredItems = useMemo(() => {
    try {
      return menuItems.filter((item) => {
        const itemType = item.type?.toLowerCase() || "veg";
        const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesCategory = filters.selectedType === "all" || item.category?.toLowerCase() === filters.selectedType.toLowerCase();
        const matchesFoodType = filters.selectedFoodType === "all" || itemType === filters.selectedFoodType;
        const matchesPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
        const matchesRating = filters.ratingFilter === 0 || (item.rating || 0) >= filters.ratingFilter;
        const matchesPrepTime = filters.prepTimeFilter === "any" || 
          (filters.prepTimeFilter === "quick" && item.prepTime && parseInt(item.prepTime) <= 15) || 
          (filters.prepTimeFilter === "medium" && item.prepTime && parseInt(item.prepTime) <= 30);
        const matchesDietary = filters.dietaryPreferences.length === 0 || 
          filters.dietaryPreferences.every(pref => item.tags?.includes(pref) || item.dietary?.includes(pref));

        return matchesSearch && matchesCategory && matchesFoodType && matchesPrice && matchesRating && matchesPrepTime && matchesDietary;
      }).sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low": return a.price - b.price;
          case "price-high": return b.price - a.price;
          case "name": return a.name.localeCompare(b.name);
          case "rating": return (b.rating || 0) - (a.rating || 0);
          case "prep-time": return (a.prepTime ? parseInt(a.prepTime) : 999) - (b.prepTime ? parseInt(b.prepTime) : 999);
          case "popular": return (b.popularity || 0) - (a.popularity || 0);
          default: return 0;
        }
      });
    } catch (err) {
      console.error("Filter error:", err);
      return [];
    }
  }, [menuItems, filters]);

  // 🔥 EVENT HANDLERS
  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);
  const handleHomeClick = useCallback(() => navigate("/"), [navigate]);
  
  const handleAddToCart = useCallback(async (item) => {
    if (!user) { 
      toast.error("Please log in to add items to cart"); 
      navigate("/?login=true"); 
      return; 
    }
    try {
      await addToCart({ ...item, quantity: 1 });
      toast.success(`${item.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  }, [user, addToCart, navigate]);
  
  const handleRemoveFromCart = useCallback(async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart", {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error("Failed to remove from cart");
    }
  }, [removeFromCart]);
  
  const handleUpdateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      try {
        await updateCartItem(itemId, newQuantity);
      } catch (err) {
        toast.error("Failed to update quantity");
      }
    }
  }, [updateCartItem]);
  
  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const y = useTransform(scrollY, [0, 600], [0, -300]);

  if (initialLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;

  return (
    <Box sx={{ 
      background: "linear-gradient(135deg, #fef8f5 0%, #f9fafb 100%)", 
      minHeight: "100vh", 
      position: "relative", 
      fontFamily: "'Poppins', sans-serif", 
      overflowX: "hidden" 
    }}>
      {/* 🔥 APPBAR */}
      <AppBar position="fixed" sx={{ 
        background: `linear-gradient(135deg, ${alpha("#ffffff", 0.98)} 0%, ${alpha("#f8fafc", 0.98)} 100%)`, 
        backdropFilter: "blur(20px)", 
        boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.1)}`, 
        py: { xs: 1, md: 1.5 }, 
        borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.2)}` 
      }}>
        <Toolbar sx={{ 
          justifyContent: "space-between", 
          maxWidth: "xl", 
          mx: "auto", 
          width: "100%", 
          px: { xs: 2, md: 3 } 
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            {isMobile && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  onClick={() => setMenuOpen(true)} 
                  sx={{ 
                    color: "#ff6f61", 
                    background: alpha('#ff6f61', 0.1), 
                    '&:hover': { background: alpha('#ff6f61', 0.2) } 
                  }} 
                  aria-label="Open menu"
                >
                  <FiMenu size={24} />
                </IconButton>
              </motion.div>
            )}
            <motion.div 
              initial={{ opacity: 0, x: -40 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 800, 
                  background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                  backgroundClip: 'text', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent', 
                  letterSpacing: "1.2px", 
                  fontSize: { xs: "1.4rem", md: "1.8rem" }, 
                  cursor: "pointer" 
                }} 
                onClick={handleHomeClick}
              >
                🚀 Flavor Fleet
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 3 } }}>
            {!isMobile && (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Tooltip title="Home" arrow>
                    <IconButton 
                      onClick={handleHomeClick} 
                      sx={{ 
                        color: "#ff6f61", 
                        background: alpha('#ff6f61', 0.1), 
                        '&:hover': { 
                          background: alpha('#ff6f61', 0.2), 
                          transform: 'translateY(-2px)' 
                        }, 
                        transition: 'all 0.3s ease' 
                      }} 
                      aria-label="Go to home"
                    >
                      <FiHome size={22} />
                    </IconButton>
                  </Tooltip>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Tooltip title={user ? "Profile" : "Login"} arrow>
                    <IconButton 
                      onClick={user ? () => navigate("/profile") : () => navigate("/?login=true")} 
                      sx={{ 
                        color: "#ff6f61", 
                        background: alpha('#ff6f61', 0.1), 
                        '&:hover': { 
                          background: alpha('#ff6f61', 0.2), 
                          transform: 'translateY(-2px)' 
                        }, 
                        transition: 'all 0.3s ease' 
                      }} 
                      aria-label={user ? "Go to profile" : "Log in"}
                    >
                      {user ? (
                        <Avatar sx={{ 
                          width: 30, 
                          height: 30, 
                          background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                          fontSize: '0.9rem', 
                          fontWeight: 'bold' 
                        }}>
                          {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                      ) : (
                        <FiUser size={22} />
                      )}
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </>
            )}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Cart" arrow>
                <IconButton 
                  onClick={() => setCartOpen(true)} 
                  sx={{ 
                    color: "#ff6f61", 
                    background: alpha('#ff6f61', 0.1), 
                    '&:hover': { 
                      background: alpha('#ff6f61', 0.2), 
                      transform: 'translateY(-2px)' 
                    }, 
                    transition: 'all 0.3s ease' 
                  }} 
                  aria-label={`Open cart with ${totalItems} items`}
                >
                  <Badge 
                    badgeContent={totalItems} 
                    color="error" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                        fontFamily: "'Poppins', sans-serif", 
                        fontWeight: 'bold', 
                        fontSize: '0.7rem', 
                        minWidth: '18px', 
                        height: '18px', 
                        borderRadius: '9px' 
                      } 
                    }}
                  >
                    <FiShoppingCart size={22} />
                  </Badge>
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔥 MOBILE MENU */}
      <Drawer 
        anchor="left" 
        open={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        sx={{ 
          "& .MuiDrawer-paper": { 
            width: { xs: 280, sm: 320 }, 
            borderRadius: "0 30px 30px 0", 
            background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`, 
            backdropFilter: "blur(20px)", 
            boxShadow: `0 20px 50px ${alpha(theme.palette.grey[900], 0.2)}`, 
            border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}` 
          } 
        }}
      >
        <Box sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 800, 
              background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              fontSize: "1.5rem", 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            🚀 Flavor Fleet
          </Typography>
          <Divider sx={{ my: 2, borderColor: alpha(theme.palette.grey[200], 0.3) }} />
          <List sx={{ flex: 1 }}>
            {[
              { label: "🏠 Home", path: "/" }, 
              { label: "🍽️ Menu", path: "/menu" }, 
              { label: user ? "👤 Profile" : "🔐 Login", path: user ? "/profile" : "/?login=true" }, 
              ...(user ? [{ label: "📦 My Orders", path: "/orders" }] : [])
            ].map((item) => (
              <ListItem 
                key={item.label} 
                button 
                onClick={() => { 
                  navigate(item.path); 
                  setMenuOpen(false); 
                }} 
                sx={{ 
                  borderRadius: '15px', 
                  mb: 1, 
                  '&:hover': { 
                    background: `linear-gradient(135deg, ${alpha('#ff6f61', 0.1)} 0%, transparent 100%)`, 
                    transform: 'translateX(5px)' 
                  }, 
                  transition: 'all 0.3s ease' 
                }}
              >
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    fontSize: "1.1rem" 
                  }} 
                />
              </ListItem>
            ))}
          </List>
          {user && (
            <Box sx={{ 
              p: 3, 
              background: `linear-gradient(135deg, ${alpha('#ff6f61', 0.08)} 0%, ${alpha('#ff8a65', 0.05)} 100%)`, 
              borderRadius: "20px", 
              border: `1px solid ${alpha("#ff6f61", 0.1)}`, 
              backdropFilter: 'blur(10px)' 
            }}>
              <Typography sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontWeight: 700, 
                color: "#ff6f61", 
                fontSize: "1rem", 
                mb: 0.5 
              }}>
                {user.name}
              </Typography>
              <Typography sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                color: theme.palette.text.secondary, 
                fontSize: "0.85rem" 
              }}>
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cart} 
        removeFromCart={handleRemoveFromCart} 
        navigate={navigate} 
        updateQuantity={handleUpdateQuantity} 
        user={user} 
      />

      {/* 🔥 HERO SECTION */}
      <Box sx={{ 
        height: { xs: "85vh", sm: "90vh", md: "95vh" }, 
        position: "relative", 
        overflow: "hidden", 
        mb: { xs: 6, md: 10 } 
      }}>
        <motion.div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          background: `url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          y, 
          filter: "brightness(0.5)" 
        }} />
        <Box sx={{ 
          position: "absolute", 
          inset: 0, 
          background: `linear-gradient(135deg, ${alpha("#ff6f61", 0.7)} 0%, ${alpha("#ff8a65", 0.5)} 100%)` 
        }} />
        <Container maxWidth="xl" sx={{ height: "100%", position: "relative" }}>
          <Box sx={{ 
            position: "absolute", 
            top: "50%", 
            left: 0, 
            right: 0, 
            transform: "translateY(-50%)", 
            textAlign: "center", 
            px: { xs: 3, md: 5 }, 
            zIndex: 1 
          }}>
            <motion.div 
              initial={{ opacity: 0, y: 100 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  color: "common.white", 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 800, 
                  fontSize: { xs: "3rem", sm: "4.5rem", md: "6.5rem" }, 
                  mb: 3, 
                  letterSpacing: "2px", 
                  textShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.7)}`, 
                  lineHeight: 1.1 
                }}
              >
                Flavor Fleet
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "rgba(255,255,255,0.95)", 
                  maxWidth: 900, 
                  mx: "auto", 
                  fontWeight: 500, 
                  fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.2rem" }, 
                  fontFamily: "'Poppins', sans-serif", 
                  textShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.5)}`, 
                  lineHeight: 1.4, 
                  mb: 4 
                }}
              >
                Savor the Flavor, Delivered Fresh to Your Doorstep
              </Typography>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })} 
                  sx={{ 
                    background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`, 
                    color: "#ff6f61", 
                    fontWeight: 700, 
                    px: { xs: 6, md: 8 }, 
                    py: { xs: 1.8, md: 2.2 }, 
                    borderRadius: "50px", 
                    fontSize: { xs: "1.1rem", md: "1.3rem" }, 
                    textTransform: "none", 
                    boxShadow: `0 15px 40px ${alpha("#000", 0.2)}`, 
                    "&:hover": { 
                      background: `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)`, 
                      transform: "translateY(-3px)", 
                      boxShadow: `0 20px 50px ${alpha("#000", 0.3)}` 
                    }, 
                    transition: "all 0.4s ease", 
                    fontFamily: "'Poppins', sans-serif" 
                  }} 
                  aria-label="Explore Menu"
                >
                  🍽️ Explore Our Menu
                </Button>
              </motion.div>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <OffersCarousel offersRef={offersRef} offers={offers} />
      </Container>

      <Container maxWidth="xl" id="menu-section">
        <SearchBar 
          onSearch={(value) => dispatch({ type: 'SET_SEARCH', payload: value })} 
          onSortChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })} 
          sortBy={filters.sortBy} 
          searchSuggestions={searchSuggestions} 
          onSuggestionClick={handleSuggestionClick} 
          recentSearches={recentSearches} 
        />
        <AdvancedFilters filters={filters} dispatch={dispatch} />
      </Container>

      {/* 🔥 TOP PICKS SECTION */}
      {topPicks.length > 0 && (
        <Container maxWidth="xl">
          <TopPicksSection 
            topPicks={topPicks} 
            addToCart={handleAddToCart}
            cart={cart}
          />
        </Container>
      )}

      {/* 🔥 CATEGORY FILTERS */}
      <Box 
        ref={filterRef} 
        sx={{ 
          position: "sticky", 
          top: { xs: 60, md: 80 }, 
          zIndex: 1100, 
          py: { xs: 3, md: 4 }, 
          mb: { xs: 6, md: 8 }, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`, 
          backdropFilter: "blur(20px)", 
          boxShadow: `0 10px 35px ${alpha(theme.palette.grey[900], 0.1)}`, 
          borderRadius: "0 0 30px 30px", 
          border: `1px solid ${alpha(theme.palette.grey[200], 0.2)}`, 
          borderTop: 'none' 
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: "flex", 
            gap: { xs: 1.5, md: 2.5 }, 
            overflowX: "auto", 
            pb: 1, 
            "&::-webkit-scrollbar": { height: 6 }, 
            "&::-webkit-scrollbar-thumb": { background: alpha(theme.palette.primary.main, 0.3), borderRadius: 3 }, 
            justifyContent: "center", 
            alignItems: "center" 
          }}>
            <LayoutGroup>
              {foodTypes.map((type) => (
                <motion.div key={type} layoutId={type} transition={{ type: "spring", stiffness: 350, damping: 25 }}>
                  <Chip 
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
                        {getCategoryIcon(type)}{type}
                      </Box>
                    } 
                    onClick={() => dispatch({ type: 'SET_CATEGORY', payload: type.toLowerCase() })} 
                    sx={{
                      px: { xs: 2.5, md: 3.5 }, 
                      py: 1, 
                      fontSize: { xs: "0.85rem", md: "0.95rem" }, 
                      fontWeight: 700,
                      background: filters.selectedType === type.toLowerCase() ? `linear-gradient(135deg, #ff6f61, #ff8a65)` : `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.8)} 0%, ${alpha(theme.palette.grey[50], 0.8)} 100%)`,
                      color: filters.selectedType === type.toLowerCase() ? "white" : theme.palette.text.primary,
                      "&:hover": { 
                        background: filters.selectedType === type.toLowerCase() ? `linear-gradient(135deg, #ff8a65, #ff6f61)` : `linear-gradient(135deg, ${alpha(theme.palette.grey[200], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.8)} 100%)`, 
                        transform: 'translateY(-2px)', 
                        boxShadow: filters.selectedType === type.toLowerCase() ? `0 8px 25px ${alpha("#ff6f61", 0.4)}` : `0 6px 20px ${alpha(theme.palette.grey[400], 0.2)}` 
                      },
                      transition: "all 0.3s ease", 
                      borderRadius: "25px", 
                      fontFamily: "'Poppins', sans-serif", 
                      boxShadow: filters.selectedType === type.toLowerCase() ? `0 6px 20px ${alpha("#ff6f61", 0.3)}` : `0 4px 15px ${alpha(theme.palette.grey[300], 0.1)}`, 
                      border: filters.selectedType === type.toLowerCase() ? 'none' : `1px solid ${alpha(theme.palette.grey[200], 0.3)}`, 
                      cursor: 'pointer', 
                      minWidth: 'auto'
                    }} 
                    aria-label={`Filter by ${type}`} 
                  />
                </motion.div>
              ))}
            </LayoutGroup>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1.5 }}>
            {["all", "veg", "non-veg"].map((type) => (
              <motion.div key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={type === "all" ? "🌱 All" : type === "veg" ? "🥬 Vegetarian" : "🍗 Non-Vegetarian"} 
                  onClick={() => dispatch({ type: 'SET_FOOD_TYPE', payload: type })} 
                  color={filters.selectedFoodType === type ? "primary" : "default"} 
                  variant={filters.selectedFoodType === type ? "filled" : "outlined"} 
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    background: filters.selectedFoodType === type ? `linear-gradient(135deg, #ff6f61, #ff8a65)` : alpha(theme.palette.grey[100], 0.8), 
                    color: filters.selectedFoodType === type ? 'white' : theme.palette.text.primary, 
                    border: filters.selectedFoodType === type ? 'none' : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`, 
                    '&:hover': { 
                      background: filters.selectedFoodType === type ? `linear-gradient(135deg, #ff8a65, #ff6f61)` : alpha(theme.palette.grey[200], 0.8) 
                    } 
                  }} 
                />
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 🔥 MENU GRID */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, pb: { xs: 10, md: 12 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 800, 
            textAlign: "center", 
            mb: 6, 
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`, 
            backgroundClip: 'text', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontSize: { xs: '2rem', md: '3rem' } 
          }}
        >
          🍽️ Our Delicious Menu
        </Typography>

        {menuLoading ? (
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 8, md: 12 } }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <MenuItemSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : sortedAndFilteredItems.length === 0 ? (
          <EmptyState onReset={() => dispatch({ type: 'RESET_ALL' })} message={noItemsMessage || "No delicious items found matching your criteria"} />
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {sortedAndFilteredItems.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                <MenuItem 
                  item={item} 
                  addToCart={handleAddToCart} 
                  addToFavorites={addToFavorites} 
                  removeFromFavorites={removeFromFavorites} 
                  isFavorite={favorites.some(fav => fav.id === item.id)} 
                  itemRef={(el) => itemRefs.current.set(item.id, el)}
                  cart={cart}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 🔥 SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            transition={{ duration: 0.3 }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop} 
              sx={{ 
                position: 'fixed', 
                bottom: 30, 
                right: 30, 
                background: `linear-gradient(135deg, #ff6f61, #ff8a65)`, 
                '&:hover': { 
                  background: `linear-gradient(135deg, #ff8a65, #ff6f61)`, 
                  transform: 'translateY(-3px)' 
                }, 
                boxShadow: `0 8px 25px ${alpha('#ff6f61', 0.4)}`,
                transition: 'all 0.3s ease'
              }} 
              aria-label="Scroll to top"
            >
              <FiChevronUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 FOOTER */}
      <Box sx={{
        width: "100%",
        py: { xs: 4, md: 6 },
        background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: "common.white",
        textAlign: "center",
      }}>
        <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: { xs: "0.95rem", md: "1.1rem" }, letterSpacing: "0.6px" }}>
          © 2025 Flavor Fleet. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
});

// 🔥 UTILITY COMPONENTS
const getCategoryIcon = (type) => {
  const icons = { 
    Biryani: "🍚", 
    Burger: "🍔", 
    Pizza: "🍕", 
    Icecream: "🍨", 
    Starter: "🍢", 
    Main: "🍽️", 
    Dessert: "🍰", 
    All: "🌟" 
  };
  return icons[type] || "🍽️";
};

const LoadingScreen = () => (
  <Box sx={{ 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontFamily: "'Poppins', sans-serif", 
    background: "linear-gradient(135deg, #fef8f5 0%, #f9fafb 100%)" 
  }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: "#ff6f61", mb: 2 }} />
        <Typography sx={{ 
          color: "#ff6f61", 
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: 600, 
          fontSize: '1.2rem' 
        }}>
          Loading delicious items...
        </Typography>
      </Box>
    </motion.div>
  </Box>
);

const ErrorScreen = ({ error, onRetry }) => (
  <Box sx={{ 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontFamily: "'Poppins', sans-serif", 
    background: "linear-gradient(135deg, #fef8f5 0%, #f9fafb 100%)" 
  }}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        textAlign: "center", 
        p: 4, 
        background: alpha("#fff", 0.95), 
        borderRadius: "25px", 
        boxShadow: `0 20px 50px ${alpha("#ff6f61", 0.1)}`, 
        border: `1px solid ${alpha("#ff6f61", 0.1)}`, 
        maxWidth: '400px' 
      }}>
        <Typography sx={{ 
          color: "#ff6f61", 
          fontFamily: "'Poppins', sans-serif", 
          mb: 2, 
          fontSize: '1.1rem', 
          fontWeight: 600 
        }}>
          {error}
        </Typography>
        <Button 
          onClick={onRetry} 
          sx={{ 
            color: "#ff6f61", 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 600, 
            background: alpha('#ff6f61', 0.1), 
            borderRadius: '20px', 
            px: 3, 
            '&:hover': { 
              background: alpha('#ff6f61', 0.2), 
              transform: 'translateY(-2px)' 
            }, 
            transition: 'all 0.3s ease' 
          }} 
          aria-label="Retry"
        >
          🔄 Try Again
        </Button>
      </Box>
    </motion.div>
  </Box>
);

const EmptyState = ({ onReset, message }) => (
  <Box sx={{ textAlign: "center", py: 8 }}>
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ fontSize: "5rem", mb: 2, opacity: 0.3 }}>🔍</Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontFamily: "'Poppins', sans-serif", 
          color: "#ff6f61", 
          mb: 2, 
          fontSize: '1.6rem', 
          fontWeight: 700 
        }}
      >
        {message}
      </Typography>
      <Button 
        onClick={onReset} 
        sx={{ 
          color: "#ff6f61", 
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: 600, 
          background: alpha('#ff6f61', 0.1), 
          borderRadius: '25px', 
          px: 4, 
          py: 1.2, 
          '&:hover': { 
            background: alpha('#ff6f61', 0.2), 
            transform: 'translateY(-2px)' 
          }, 
          transition: 'all 0.3s ease' 
        }} 
        aria-label="Reset all filters"
      >
        🔄 Reset All Filters
      </Button>
    </motion.div>
  </Box>
);

// Add CSS for shimmer animation
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .shimmer {
    animation: shimmer 1.5s infinite linear;
  }
`;

Menu.displayName = 'Menu';

export default Menu;

// Add shimmer styles to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
}