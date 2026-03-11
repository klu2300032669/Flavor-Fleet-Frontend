// Home.jsx - Minimal Home Page
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Hero from "./Hero";
import { useAuth } from "./AuthContext";  // AuthContext is in the same folder
import { toast } from "react-toastify";
import PasswordModal from "./profile/modals/PasswordModal";  // modals folder is in the same folder

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  const { user, mustChangePassword, updatePassword, markPasswordChanged } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check if user is restaurant owner
  const isRestaurantOwner = user?.role === "ROLE_RESTAURANT_OWNER" || user?.role === "RESTAURANT_OWNER";

  // Calculate password strength
  useEffect(() => {
    if (passwordForm.newPassword) {
      let strength = 0;
      if (passwordForm.newPassword.length >= 8) strength += 25;
      if (/[a-z]/.test(passwordForm.newPassword)) strength += 25;
      if (/[A-Z]/.test(passwordForm.newPassword)) strength += 25;
      if (/[0-9]/.test(passwordForm.newPassword)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(passwordForm.newPassword)) strength += 10;
      setPasswordStrength(Math.min(strength, 100));
    } else {
      setPasswordStrength(0);
    }
  }, [passwordForm.newPassword]);

  // Show modal only for restaurant owners when mustChangePassword is true
  useEffect(() => {
    if (isRestaurantOwner && mustChangePassword) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setShowPasswordModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRestaurantOwner, mustChangePassword]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
      return;
    }

    try {
      const result = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (result.success) {
        await markPasswordChanged();
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Failed to change password");
    }
  };

  const handleCloseModal = () => {
    // Only allow closing if password change is not required
    if (!mustChangePassword) {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // Get theme from context or use default
  const theme = {}; // You can get this from your theme context if available

  return (
    <HomeContainer>
      <Hero />

      {/* Password Change Modal - Only shows for restaurant owners */}
      {isRestaurantOwner && (
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={handleCloseModal}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          passwordStrength={passwordStrength}
          handlePasswordUpdate={handlePasswordUpdate}
          theme={theme}
        />
      )}
    </HomeContainer>
  );
};

export default Home;