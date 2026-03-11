// src/components/profile/sections/SettingsSection.jsx
import React from "react";
import { FaCog, FaLock, FaBell, FaSun, FaMoon, FaDownload } from "react-icons/fa";
import {
  ProfileSection,
  SectionTitle,
  InfoGrid,
  Card,
  InfoLabel,
  Button,
} from "../styles";

const SettingsSection = ({
  setIsPasswordModalOpen,
  setIsNotificationSettingsModalOpen,
  toggleTheme,
  theme,
  handleExportData,
}) => {
  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaCog aria-hidden="true" /> Account Settings
      </SectionTitle>
      <InfoGrid>
        <Card theme={theme}>
          <InfoLabel theme={theme}>Password</InfoLabel>
          <Button $secondary onClick={() => setIsPasswordModalOpen(true)} theme={theme}>
            <FaLock /> Change Password
          </Button>
        </Card>
        <Card theme={theme}>
          <InfoLabel theme={theme}>Notifications</InfoLabel>
          <Button $secondary onClick={() => setIsNotificationSettingsModalOpen(true)} theme={theme}>
            <FaBell /> Manage Alerts
          </Button>
        </Card>
        <Card theme={theme}>
          <InfoLabel theme={theme}>Theme</InfoLabel>
          <Button $secondary onClick={toggleTheme} theme={theme}>
            {theme.mode === 'dark' ? <FaSun /> : <FaMoon />} {theme.mode === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </Card>
        <Card theme={theme}>
          <InfoLabel theme={theme}>Data Export</InfoLabel>
          <Button $secondary onClick={handleExportData} theme={theme}>
            <FaDownload /> Export My Data
          </Button>
        </Card>
      </InfoGrid>
    </ProfileSection>
  );
};

export default SettingsSection;