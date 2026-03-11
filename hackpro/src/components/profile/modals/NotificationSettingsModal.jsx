import React, { useState, useEffect } from "react";
import { FaSave, FaBell, FaEnvelope, FaDesktop } from "react-icons/fa";
import Modal from "../Modal";
import { Form, FormGroup, FormLabel, Button } from "../styles";

const NotificationSettingsModal = ({
  isOpen,
  onClose,
  notificationSettings = {},
  setNotificationSettings,
  handleNotificationSettingsUpdate,
  theme,
}) => {
  const [initialSettings, setInitialSettings] = useState({});

  useEffect(() => {
    if (isOpen) {
      setInitialSettings({ ...notificationSettings });
    }
  }, [isOpen, notificationSettings]);

  const isDirty = JSON.stringify(notificationSettings) !== JSON.stringify(initialSettings);

  const handleToggle = (field) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNotificationSettingsUpdate(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaBell style={{ marginRight: "0.75rem" }} aria-hidden="true" />
          Notification Settings
        </>
      }
      ariaLabel="Notification settings form"
      isDirty={isDirty}
      theme={theme}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup style={{ marginBottom: "1.5rem" }}>
          <FormLabel theme={theme} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaEnvelope style={{ marginRight: "0.75rem" }} aria-hidden="true" />
              <div>
                <div style={{ fontWeight: "600" }}>Order Updates</div>
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Receive email notifications about your orders
                </div>
              </div>
            </div>
            <Button
              type="button"
              $secondary={!notificationSettings.emailOrderUpdates}
              onClick={() => handleToggle("emailOrderUpdates")}
              theme={theme}
              style={{
                minWidth: "60px",
                padding: "0.5rem",
                background: notificationSettings.emailOrderUpdates
                  ? "linear-gradient(135deg, #ff6666, #ff9999)"
                  : undefined,
                color: notificationSettings.emailOrderUpdates ? "white" : undefined,
              }}
              aria-pressed={notificationSettings.emailOrderUpdates}
            >
              {notificationSettings.emailOrderUpdates ? "ON" : "OFF"}
            </Button>
          </FormLabel>
        </FormGroup>

        <FormGroup style={{ marginBottom: "1.5rem" }}>
          <FormLabel theme={theme} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaEnvelope style={{ marginRight: "0.75rem" }} aria-hidden="true" />
              <div>
                <div style={{ fontWeight: "600" }}>Promotions & Offers</div>
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Get notified about special offers and discounts
                </div>
              </div>
            </div>
            <Button
              type="button"
              $secondary={!notificationSettings.emailPromotions}
              onClick={() => handleToggle("emailPromotions")}
              theme={theme}
              style={{
                minWidth: "60px",
                padding: "0.5rem",
                background: notificationSettings.emailPromotions
                  ? "linear-gradient(135deg, #ff6666, #ff9999)"
                  : undefined,
                color: notificationSettings.emailPromotions ? "white" : undefined,
              }}
              aria-pressed={notificationSettings.emailPromotions}
            >
              {notificationSettings.emailPromotions ? "ON" : "OFF"}
            </Button>
          </FormLabel>
        </FormGroup>

        <FormGroup style={{ marginBottom: "2rem" }}>
          <FormLabel theme={theme} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaDesktop style={{ marginRight: "0.75rem" }} aria-hidden="true" />
              <div>
                <div style={{ fontWeight: "600" }}>Desktop Notifications</div>
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Show browser notifications when online
                </div>
              </div>
            </div>
            <Button
              type="button"
              $secondary={!notificationSettings.desktopNotifications}
              onClick={() => handleToggle("desktopNotifications")}
              theme={theme}
              style={{
                minWidth: "60px",
                padding: "0.5rem",
                background: notificationSettings.desktopNotifications
                  ? "linear-gradient(135deg, #ff6666, #ff9999)"
                  : undefined,
                color: notificationSettings.desktopNotifications ? "white" : undefined,
              }}
              aria-pressed={notificationSettings.desktopNotifications}
            >
              {notificationSettings.desktopNotifications ? "ON" : "OFF"}
            </Button>
          </FormLabel>
        </FormGroup>

        <Button
          type="submit"
          disabled={!isDirty}
          theme={theme}
          style={{ width: "100%" }}
        >
          <FaSave aria-hidden="true" style={{ marginRight: "0.5rem" }} />
          Save Settings
        </Button>
      </Form>
    </Modal>
  );
};

export default React.memo(NotificationSettingsModal);