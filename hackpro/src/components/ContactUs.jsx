import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Box, Grid, useTheme, useMediaQuery,
  IconButton, Paper, styled, alpha, Zoom, Tooltip, Fab, AppBar, Toolbar, Snackbar, Alert,
  Avatar, CircularProgress
} from '@mui/material';
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiPhone, FiMapPin, FiArrowRight, FiChevronUp, FiHome, FiMenu, 
  FiSend, FiX, FiMessageCircle, FiUser, FiClock 
} from 'react-icons/fi';
import { useAuth } from './AuthContext';

const flavorFleetTheme = {
  primary: '#ff6f61',
  secondary: '#ff4839',
  light: '#fef8f5',
  success: '#10B981',
};

const FloatingShape = styled(motion.div)(() => ({
  position: 'absolute',
  background: `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${alpha(flavorFleetTheme.secondary, 0.7)})`,
  borderRadius: '40% 60% 70% 30% / 50% 30% 70% 60%',
  filter: 'blur(90px)',
  opacity: 0.25,
  zIndex: 0,
}));

const EnhancedFloatingShape = styled(FloatingShape)(({ theme }) => ({
  background: `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${alpha(flavorFleetTheme.secondary, 0.7)})`,
  '&:nth-of-type(2)': {
    background: `linear-gradient(135deg, ${flavorFleetTheme.success}, ${alpha(flavorFleetTheme.primary, 0.7)})`,
    opacity: 0.2,
  },
}));

const ContactCard = styled(motion(Paper))(() => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  background: `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(flavorFleetTheme.light, 0.85)})`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 12px 40px rgba(255, 111, 97, 0.15)',
  border: `1px solid ${alpha(flavorFleetTheme.primary, 0.1)}`,
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 50px rgba(255, 111, 97, 0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${flavorFleetTheme.primary}, transparent)`,
  },
}));

const ChatBot = ({ open, onClose, initialQuestion }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi! I'm Flavor Fleet AI assistant powered by Grok. I can help with delivery times, menu questions, order status, and more! How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuth(); // Get token from AuthContext
  const isDev = window.location.origin.includes('localhost');
  const API_BASE_URL = isDev ? 'http://localhost:8885' : '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuestion && messages.length === 1) {
      const userMessage = { 
        role: 'user', 
        content: initialQuestion,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      getAIResponse(initialQuestion)
        .then(response => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response,
            timestamp: new Date()
          }]);
        })
        .catch(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm having trouble connecting right now. Please email us at hello@flavorfleet.com for immediate assistance.",
            timestamp: new Date()
          }]);
        })
        .finally(() => setLoading(false));
    }
  }, [initialQuestion]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await getAIResponse(input);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please email us at hello@flavorfleet.com for immediate assistance.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (userInput) => {
    if (!token) {
      throw new Error('Please log in to use the chat');
    }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${token}`,
      },
      body: userInput,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please log in to use the chat');
      }
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.message.trim(); // Extract from SuccessResponse
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 0 : 100,
            right: isMobile ? 0 : 32,
            width: isMobile ? '100%' : 380,
            height: isMobile ? '70%' : 500,
            zIndex: 9999,
            border: isMobile ? 'none' : `1px solid ${alpha(flavorFleetTheme.primary, 0.2)}`,
            borderRadius: isMobile ? '24px 24px 0 0' : '24px',
          }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: isMobile ? '24px 24px 0 0' : '24px',
              background: `linear-gradient(180deg, ${alpha(flavorFleetTheme.light, 0.98)}, white)`,
            }}
          >
            {/* Enhanced Header with Gradient and Shadow */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
              color: 'white',
              borderRadius: isMobile ? '24px 24px 0 0' : '24px 24px 0 0',
              boxShadow: '0 4px 20px rgba(255, 72, 57, 0.3)',
            }}>
              <Avatar sx={{ bgcolor: 'white', width: 40, height: 40, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <Box sx={{ color: flavorFleetTheme.primary, fontSize: '1.2rem' }}>AI</Box>
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Flavor Fleet AI (Powered by Grok)
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Online • Instant Responses 🚀
                </Typography>
              </Box>
              <IconButton 
                onClick={onClose} 
                size="small"
                sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}
              >
                <FiX size={18} />
              </IconButton>
            </Box>

            {/* Messages with Improved Styling */}
            <Box sx={{ 
              flexGrow: 1, 
              p: 2, 
              overflow: 'auto',
              background: `linear-gradient(to bottom, ${alpha(flavorFleetTheme.light, 0.5)}, white)`,
            }}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    mb: 2, 
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' 
                  }}>
                    <Box sx={{ 
                      maxWidth: '85%', 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5
                      }}>
                        {msg.role === 'assistant' && (
                          <Avatar sx={{ width: 24, height: 24, bgcolor: flavorFleetTheme.primary }}>
                            <Box sx={{ fontSize: '0.7rem', color: 'white' }}>AI</Box>
                          </Avatar>
                        )}
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                          {msg.role === 'user' ? 'You' : 'Flavor Fleet AI'} • {formatTime(msg.timestamp)}
                        </Typography>
                        {msg.role === 'user' && (
                          <Avatar sx={{ width: 24, height: 24, bgcolor: flavorFleetTheme.success }}>
                            <FiUser size={12} />
                          </Avatar>
                        )}
                      </Box>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        background: msg.role === 'user' 
                          ? `linear-gradient(135deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`
                          : alpha('#fff', 0.95),
                        color: msg.role === 'user' ? 'white' : 'text.primary',
                        boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(255, 111, 97, 0.15)' : '0 2px 8px rgba(16, 185, 129, 0.15)',
                        border: msg.role === 'assistant' ? `1px solid ${alpha(flavorFleetTheme.primary, 0.1)}` : `1px solid ${alpha(flavorFleetTheme.success, 0.1)}`,
                      }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          {msg.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderRadius: 3, background: 'white', border: `1px solid ${alpha(flavorFleetTheme.primary, 0.1)}` }}>
                      <motion.div
                        style={{ display: 'flex', gap: '4px' }}
                      >
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                          style={{ fontSize: '1.2rem', color: flavorFleetTheme.primary }}
                        >
                          •
                        </motion.span>
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                          style={{ fontSize: '1.2rem', color: flavorFleetTheme.primary }}
                        >
                          •
                        </motion.span>
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                          style={{ fontSize: '1.2rem', color: flavorFleetTheme.primary }}
                        >
                          •
                        </motion.span>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Enhanced Input with Gradient Button */}
            <Box sx={{ 
              p: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              background: alpha('#fff', 0.98),
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask about delivery, menu, hours..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={loading}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '0.9rem',
                      '& fieldset': { borderColor: alpha(flavorFleetTheme.primary, 0.3) },
                      '&:hover fieldset': { borderColor: flavorFleetTheme.primary },
                      '&.Mui-focused fieldset': { borderColor: flavorFleetTheme.secondary },
                    }
                  }}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IconButton 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                    sx={{ 
                      bgcolor: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                      color: 'white',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})` },
                      '&:disabled': { bgcolor: 'grey.300' }
                    }}
                  >
                    <FiSend size={16} />
                  </IconButton>
                </motion.div>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', textAlign: 'center' }}>
                Powered by Grok AI • Ask anything about Flavor Fleet! 🍔🚀
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const ContactUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [notification, setNotification] = useState({ open: false, type: null, message: '' });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);
  const firstNameRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const ySpring = useSpring(y, { stiffness: 200, damping: 60 });
  const { submitContactForm } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      controls.start(currentScrollY > 50 ? 'scrolled' : 'initial');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  useEffect(() => {
    // Auto-focus first name field on component mount
    const timer = setTimeout(() => {
      if (firstNameRef.current) {
        firstNameRef.current.focus();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email, message } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setNotification({ open: true, type: 'error', message: 'Please fill out all fields!' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotification({ open: true, type: 'error', message: 'Please enter a valid email address!' });
      return;
    }

    if (message.trim().length < 10) {
      setNotification({ open: true, type: 'error', message: 'Message should be at least 10 characters long!' });
      return;
    }

    setFormLoading(true);
    const contactMessage = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    try {
      const result = await submitContactForm(contactMessage);
      if (result.success) {
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setNotification({ open: true, type: 'success', message: 'Message Sent Successfully! We\'ll get back to you within 24 hours.' });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      setNotification({ open: true, type: 'error', message: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, type: null, message: '' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleHomeClick = () => navigate('/');

  const quickQuestions = [
    "What's your delivery time?",
    "Do you have vegan options?",
    "What are your operating hours?",
    "How can I track my order?"
  ];

  const handleQuickQuestion = (question) => {
    setInitialQuestion(question);
    setChatbotOpen(true);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(flavorFleetTheme.light, 0.95)}, ${alpha('#fff', 0.8)})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: `linear-gradient(90deg, ${alpha(flavorFleetTheme.light, 0.95)}, ${alpha(flavorFleetTheme.primary, 0.2)})`,
          backdropFilter: 'blur(15px)',
          boxShadow: scrolled
            ? '0 4px 20px rgba(255, 111, 97, 0.25)'
            : '0 2px 10px rgba(255, 111, 97, 0.1)',
          borderBottom: `1px solid ${alpha(flavorFleetTheme.primary, 0.15)}`,
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1.5, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tooltip title="Back to Home" arrow>
              <IconButton
                edge="start"
                onClick={handleHomeClick}
                sx={{
                  mr: { xs: 1, md: 2 },
                  color: flavorFleetTheme.primary,
                  '&:hover': {
                    background: alpha(flavorFleetTheme.primary, 0.1),
                    boxShadow: '0 0 15px rgba(255, 111, 97, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiHome size={isMobile ? 20 : 24} />
                </motion.div>
              </IconButton>
            </Tooltip>
          </motion.div>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              flexGrow: 1,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: 1,
              textShadow: '0 2px 10px rgba(255, 111, 97, 0.2)',
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
            >
              Flavor Fleet
            </motion.span>
          </Typography>
          {isMobile ? (
            <IconButton
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{
                color: flavorFleetTheme.primary,
                '&:hover': { background: alpha(flavorFleetTheme.primary, 0.1) },
              }}
            >
              <FiMenu size={22} />
            </IconButton>
          ) : (
            <Box sx={{ width: 48 }} />
          )}
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />

      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('https://images.unsplash.com/photo-1543353071-10c8ba85a904')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: ySpring,
          opacity: 0.15,
        }}
      />

      <EnhancedFloatingShape
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180],
          borderRadius: ['40% 60% 70% 30% / 50% 30% 70% 60%', '60% 40% 30% 70% / 30% 60% 40% 70%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 600, height: 600, top: -150, left: -150 }}
      />

      <EnhancedFloatingShape
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [180, 0],
          borderRadius: ['60% 40% 30% 70% / 30% 60% 40% 70%', '40% 60% 70% 30% / 50% 30% 70% 60%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        style={{ width: 400, height: 400, bottom: -100, right: -100 }}
      />

      <EnhancedFloatingShape
        animate={{
          scale: [0.8, 1.1, 0.8],
          rotate: [90, 270],
          borderRadius: ['50% 50% 50% 50% / 50% 50% 50% 50%', '30% 70% 30% 70% / 50% 50% 50% 50%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ width: 300, height: 300, top: 200, right: 100, opacity: 0.15 }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ marginBottom: '3rem' }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '5rem' },
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                mb: 2,
                background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
                letterSpacing: '-0.02em',
              }}
            >
              Let's Connect
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                color: '#666',
                maxWidth: { xs: 500, md: 700 },
                mx: 'auto',
                textAlign: 'center',
                fontFamily: "'Lato', sans-serif",
                mb: { xs: 3, md: 6 },
                fontSize: { xs: '1rem', md: '1.5rem' },
                lineHeight: 1.5,
              }}
            >
              Have questions, suggestions, or just want to chat about food? We're all ears and can't wait to hear from you!
            </Typography>
          </motion.div>

          {/* Quick Questions Section */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                Quick questions? Try our AI assistant:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 600, mx: 'auto' }}>
                {quickQuestions.map((question, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickQuestion(question)}
                      startIcon={<FiMessageCircle size={14} />}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        borderColor: alpha(flavorFleetTheme.primary, 0.3),
                        color: flavorFleetTheme.primary,
                        fontSize: '0.8rem',
                        '&:hover': {
                          borderColor: flavorFleetTheme.primary,
                          background: alpha(flavorFleetTheme.primary, 0.05),
                        },
                      }}
                    >
                      {question}
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        <Grid container spacing={isMobile ? 3 : 6} sx={{ mb: 6 }}>
          <Grid item xs={12} md={5}>
            <ContactCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 50 }}
              elevation={8}
            >
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <motion.div variants={containerVariants}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Contact Information
                  </Typography>
                  {[
                    { icon: <FiMail />, title: 'Email Address', content: 'hello@flavorfleet.com', link: 'mailto:hello@flavorfleet.com' },
                    { icon: <FiPhone />, title: 'Phone Number', content: '+91 123 456 7890', link: 'tel:+911234567890' },
                    { icon: <FiMapPin />, title: 'Our Location', content: 'Mumbai, India', link: 'https://maps.app.goo.gl/' },
                    { icon: <FiClock />, title: 'Response Time', content: 'Within 24 hours', link: null },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Box
                        component={item.link ? "a" : "div"}
                        href={item.link}
                        target={item.link ? "_blank" : undefined}
                        rel={item.link ? "noopener noreferrer" : undefined}
                        sx={{
                          display: 'block',
                          p: { xs: 2, md: 3 },
                          mb: 2,
                          borderRadius: 4,
                          textDecoration: 'none',
                          background: alpha(flavorFleetTheme.primary, 0.08),
                          transition: 'all 0.3s ease',
                          cursor: item.link ? 'pointer' : 'default',
                          '&:hover': { 
                            background: item.link ? alpha(flavorFleetTheme.primary, 0.15) : alpha(flavorFleetTheme.primary, 0.08)
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
                          <motion.div whileHover={{ rotate: item.link ? 10 : 0 }}>
                            <Box
                              sx={{
                                width: { xs: 36, md: 50 },
                                height: { xs: 36, md: 50 },
                                borderRadius: '50%',
                                background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 4px 15px rgba(255, 111, 97, 0.2)',
                              }}
                            >
                              {item.icon}
                            </Box>
                          </motion.div>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1.1rem' }, color: '#333' }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', md: '1rem' } }}
                            >
                              {item.content}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </motion.div>
              </Box>
            </ContactCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <ContactCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 50, delay: 0.1 }}
              elevation={8}
            >
              <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 } }}>
                <motion.div variants={containerVariants}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Send Us a Message
                  </Typography>
                  <Grid container spacing={isMobile ? 2 : 3}>
                    {[
                      { label: 'First Name', name: 'firstName', gridProps: { xs: 12, sm: 6 }, inputRef: firstNameRef },
                      { label: 'Last Name', name: 'lastName', gridProps: { xs: 12, sm: 6 } },
                      { label: 'Email', name: 'email', gridProps: { xs: 12 }, type: 'email' },
                      { label: 'Message', name: 'message', gridProps: { xs: 12 }, multiline: true, rows: 4 },
                    ].map((field, index) => (
                      <Grid key={index} item {...field.gridProps}>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 150 }}
                        >
                          <TextField
                            fullWidth
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            variant="outlined"
                            type={field.type || 'text'}
                            multiline={field.multiline}
                            rows={field.rows}
                            required
                            inputRef={field.inputRef}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                fieldset: { borderColor: alpha(flavorFleetTheme.primary, 0.2) },
                                '&:hover fieldset': { borderColor: flavorFleetTheme.primary },
                                '&.Mui-focused fieldset': { borderColor: flavorFleetTheme.secondary },
                              },
                              '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', md: '1rem' } },
                            }}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={formLoading ? <CircularProgress size={16} color="inherit" /> : <FiArrowRight />}
                        disabled={formLoading}
                        sx={{
                          px: { xs: 3, md: 5 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: 3,
                          fontSize: { xs: '0.85rem', md: '1rem' },
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                          boxShadow: '0 6px 20px rgba(255, 111, 97, 0.2)',
                          '&:hover': {
                            background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})`,
                            boxShadow: '0 8px 25px rgba(255, 111, 97, 0.3)',
                          },
                          '&:disabled': {
                            background: 'grey.300',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {formLoading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Box>
            </ContactCard>
          </Grid>
        </Grid>
        
        {/* AI Chatbot */}
        <ChatBot open={chatbotOpen} onClose={() => setChatbotOpen(false)} initialQuestion={initialQuestion} />

        {/* AI Chatbot Toggle Button */}
        <Box sx={{ position: 'fixed', bottom: { xs: 80, md: 100 }, right: { xs: 16, md: 32 }, zIndex: 1000 }}>
          <Tooltip title="AI Assistant - Quick Questions" arrow>
            <Fab
              onClick={() => setChatbotOpen(true)}
              sx={{
                background: `linear-gradient(45deg, ${flavorFleetTheme.success}, #059669)`,
                color: 'white',
                '&:hover': { 
                  background: `linear-gradient(45deg, #059669, #047857)`,
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                },
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}
              size={isMobile ? 'medium' : 'large'}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <FiMessageCircle size={isMobile ? 20 : 24} />
              </motion.div>
            </Fab>
          </Tooltip>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type === 'success' ? 'success' : 'error'}
            icon={notification.type === 'success' ? <FiSend size={18} /> : <FiX size={18} />}
            sx={{
              width: '100%',
              background: notification.type === 'success'
                ? 'linear-gradient(135deg, #4caf50, #81c784)'
                : alpha('#fff', 0.95),
              color: notification.type === 'success' ? '#fff' : flavorFleetTheme.secondary,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              border: notification.type === 'success' ? 'none' : `1px solid ${alpha(flavorFleetTheme.secondary, 0.2)}`,
              '& .MuiAlert-icon': {
                color: notification.type === 'success' ? '#fff' : flavorFleetTheme.secondary,
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        <Zoom in={scrolled} style={{ transitionDelay: scrolled ? '300ms' : '0ms' }}>
          <Box
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, md: 32 },
              right: { xs: 16, md: 32 },
              zIndex: 1000,
            }}
          >
            <Tooltip title="Scroll to top" placement="left" arrow>
              <Fab
                sx={{
                  background: `linear-gradient(45deg, ${flavorFleetTheme.primary}, ${flavorFleetTheme.secondary})`,
                  color: '#fff',
                  '&:hover': { 
                    background: `linear-gradient(45deg, ${flavorFleetTheme.secondary}, ${flavorFleetTheme.primary})`,
                    boxShadow: '0 8px 25px rgba(255, 111, 97, 0.4)',
                  },
                  boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
                }}
                size={isMobile ? 'small' : 'large'}
              >
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <FiChevronUp size={isMobile ? 20 : 26} />
                </motion.div>
              </Fab>
            </Tooltip>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default ContactUs;