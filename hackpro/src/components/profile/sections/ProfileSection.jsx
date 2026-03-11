// src/components/profile/sections/ProfileSectionComponent.jsx
import React from "react";
import { FaUserCircle, FaMapPin, FaShoppingBag, FaHeart, FaStar, FaUtensils, FaEdit, FaTrash } from "react-icons/fa";
import {
  ProfileSection,
  SectionTitle,
  InfoGrid,
  Card,
  InfoLabel,
  InfoValue,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  Button,
  ProgressBar,
  ProgressFill,
} from "../styles";

const ProfileSectionComponent = ({
  profileData,
  user,
  normalizeRole,
  menuItems,
  orders,
  localFavorites,
  profileCompletion,
  setIsEditModalOpen,
  setIsAddressModalOpen,
  setEditAddress,
  setAddressForm,
  handleDeleteAddress,
  theme,
}) => {
  return (
    <>
      <ProfileSection>
        <SectionTitle theme={theme}>Personal Info</SectionTitle>
        <InfoGrid>
          <Card theme={theme}>
            <InfoLabel theme={theme}>Name</InfoLabel>
            <InfoValue theme={theme}>{profileData?.name || user?.name || "User"}</InfoValue>
          </Card>
          <Card theme={theme}>
            <InfoLabel theme={theme}>Email</InfoLabel>
            <InfoValue theme={theme}>{profileData?.email || user?.email || "No email"}</InfoValue>
          </Card>
          <Card theme={theme}>
            <InfoLabel theme={theme}>Member Since</InfoLabel>
            <InfoValue theme={theme}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</InfoValue>
          </Card>
          <Card theme={theme}>
            <InfoLabel theme={theme}>Role</InfoLabel>
            <InfoValue theme={theme}>{normalizeRole(user?.role) || "User"}</InfoValue>
          </Card>
        </InfoGrid>
      </ProfileSection>

      <ProfileSection>
        <SectionTitle theme={theme}>
          <FaMapPin /> Delivery Addresses
          <Button
            $secondary
            onClick={() => {
              setEditAddress(null);
              setAddressForm({ addressLine1: "", addressLine2: "", city: "", pincode: "" });
              setIsAddressModalOpen(true);
            }}
            theme={theme}
            style={{ marginLeft: "auto" }}
          >
            Add Address
          </Button>
        </SectionTitle>
        {(!profileData?.addresses || profileData.addresses.length === 0) ? (
          <Card theme={theme}>
            <InfoValue theme={theme}>No addresses saved yet.</InfoValue>
          </Card>
        ) : (
          <InfoGrid>
            {profileData.addresses.map((address) => (
              <Card key={address.id} theme={theme} style={{ position: "relative" }}>
                <div>
                  <p style={{ margin: "0.5rem 0" }}><strong>{address.addressLine1}</strong></p>
                  {address.addressLine2 && <p style={{ margin: "0.5rem 0" }}>{address.addressLine2}</p>}
                  <p style={{ margin: "0.5rem 0" }}>{address.city}, {address.pincode}</p>
                </div>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
                  <Button $secondary onClick={() => {
                    setEditAddress(address);
                    setAddressForm(address);
                    setIsAddressModalOpen(true);
                  }} theme={theme}><FaEdit /></Button>
                  <Button $secondary onClick={() => handleDeleteAddress(address.id)} theme={theme}><FaTrash /></Button>
                </div>
              </Card>
            ))}
          </InfoGrid>
        )}
      </ProfileSection>

      <ProfileSection>
        <SectionTitle theme={theme}>My Stats</SectionTitle>
        <StatsContainer>
          <StatCard theme={theme}>
            <StatNumber theme={theme}><FaShoppingBag /> {orders.length}</StatNumber>
            <StatLabel theme={theme}>Orders</StatLabel>
          </StatCard>
          <StatCard theme={theme}>
            <StatNumber theme={theme}><FaHeart /> {localFavorites.length}</StatNumber>
            <StatLabel theme={theme}>Favorites</StatLabel>
          </StatCard>
          <StatCard theme={theme}>
            <StatNumber theme={theme}><FaStar /> 4.8</StatNumber>
            <StatLabel theme={theme}>Rating</StatLabel>
          </StatCard>
          {normalizeRole(user?.role) === "ADMIN" && (
            <StatCard theme={theme}>
              <StatNumber theme={theme}><FaUtensils /> {menuItems.length}</StatNumber>
              <StatLabel theme={theme}>Menu Items</StatLabel>
            </StatCard>
          )}
        </StatsContainer>
      </ProfileSection>

      <ProfileSection>
        <SectionTitle theme={theme}>Profile Completion</SectionTitle>
        <Card theme={theme}>
          <ProgressBar theme={theme}>
            <ProgressFill $progress={profileCompletion} theme={theme} />
          </ProgressBar>
          <InfoValue theme={theme}>{profileCompletion}% Complete</InfoValue>
          {profileCompletion < 100 && (
            <Button $secondary onClick={() => setIsEditModalOpen(true)} theme={theme} style={{ marginTop: "1rem" }}>
              Complete Profile
            </Button>
          )}
        </Card>
      </ProfileSection>
    </>
  );
};

export default ProfileSectionComponent;