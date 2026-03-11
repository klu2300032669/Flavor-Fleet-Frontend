// src/components/profile/sections/NotificationHistorySection.jsx
import React from "react";
import { FaBell, FaTrash, FaCheck } from "react-icons/fa";
import {
  ProfileSection,
  SectionTitle,
  FilterContainer,
  FilterButton,
  Button,
  Card,
  PaginationContainer,
  PaginationButton,
} from "../styles";

const NotificationHistorySection = ({
  notifications = [], // Safe default
  notificationFilter = "All",
  setNotificationFilter,
  handleMarkAsRead,
  handleMarkAllRead,
  handleClearAll,
  handleDeleteNotification,
  notificationsPagination = {
    currentItems: [],
    totalPages: 1,
    paginate: () => {},
    currentPage: 1,
  },
  theme,
}) => {
  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // Filter notifications safely
  const filteredNotifications = safeNotifications.filter((n) => {
    if (!n) return false;
    if (notificationFilter === "Unread") return !n.read;
    if (notificationFilter === "Orders") return n.type?.toLowerCase() === "order";
    if (notificationFilter === "Promotions") return n.type?.toLowerCase() === "promotion";
    return true;
  });

  // Use paginated items if available, otherwise use filtered list
  const displayNotifications =
    notificationsPagination.currentItems.length > 0
      ? notificationsPagination.currentItems
      : filteredNotifications;

  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaBell aria-hidden="true" style={{ marginRight: "0.75rem" }} />
        Notification History
      </SectionTitle>

      {/* Filter Tabs */}
      <FilterContainer>
        {["All", "Unread", "Orders", "Promotions"].map((filter) => (
          <FilterButton
            key={filter}
            $active={notificationFilter === filter}
            onClick={() => setNotificationFilter && setNotificationFilter(filter)}
            theme={theme}
          >
            {filter}
            {filter === "Unread" && unreadCount > 0 && (
              <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", opacity: 0.8 }}>
                ({unreadCount})
              </span>
            )}
          </FilterButton>
        ))}
      </FilterContainer>

      {/* Bulk Actions */}
      <div style={{ margin: "1rem 0", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button $secondary onClick={handleMarkAllRead} theme={theme}>
          <FaCheck style={{ marginRight: "0.5rem" }} />
          Mark All as Read
        </Button>
        <Button $secondary onClick={handleClearAll} theme={theme}>
          <FaTrash style={{ marginRight: "0.5rem" }} />
          Clear All
        </Button>
      </div>

      {/* Notifications List */}
      <Card theme={theme} style={{ padding: "0" }}>
        {displayNotifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", opacity: 0.7 }}>
            No notifications to display.
          </div>
        ) : (
          displayNotifications.map((notification) => {
            if (!notification) return null;

            return (
              <div
                key={notification.id || Math.random()}
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid rgba(255,102,102,0.15)",
                  background: !notification.read ? "rgba(255,102,102,0.05)" : "transparent",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                {/* Type Badge */}
                {notification.type && (
                  <span
                    style={{
                      padding: "0.3rem 0.7rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      background:
                        notification.type.toLowerCase() === "order"
                          ? "rgba(255,193,7,0.2)"
                          : notification.type.toLowerCase() === "promotion"
                          ? "rgba(40,167,69,0.2)"
                          : "rgba(255,102,102,0.2)",
                      color:
                        notification.type.toLowerCase() === "order"
                          ? "#ffc107"
                          : notification.type.toLowerCase() === "promotion"
                          ? "#28a745"
                          : "#ff6666",
                    }}
                  >
                    {notification.type}
                  </span>
                )}

                {/* Content */}
                <div style={{ flexGrow: 1 }}>
                  {notification.title && (
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                      {notification.title}
                    </h4>
                  )}
                  <div
                    style={{ lineHeight: "1.5", marginBottom: "0.5rem" }}
                    dangerouslySetInnerHTML={{ __html: notification.content || "No content" }}
                  />
                  {notification.imageUrl && (
                    <img
                      src={notification.imageUrl}
                      alt="Notification"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        margin: "0.75rem 0",
                      }}
                      loading="lazy"
                    />
                  )}
                  <small style={{ opacity: 0.7, display: "block", marginTop: "0.5rem" }}>
                    {notification.sentAt || notification.createdAt
                      ? new Date(notification.sentAt || notification.createdAt).toLocaleString()
                      : "Unknown time"}
                  </small>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {!notification.read && (
                    <Button
                      $secondary
                      size="small"
                      onClick={() => handleMarkAsRead && handleMarkAsRead(notification.id)}
                      theme={theme}
                      style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    $secondary
                    size="small"
                    onClick={() => handleDeleteNotification && handleDeleteNotification(notification.id)}
                    theme={theme}
                    style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Pagination */}
      {notificationsPagination.totalPages > 1 && (
        <PaginationContainer style={{ marginTop: "1.5rem" }}>
          <PaginationButton
            onClick={() => notificationsPagination.paginate(notificationsPagination.currentPage - 1)}
            disabled={notificationsPagination.currentPage === 1}
            theme={theme}
          >
            Previous
          </PaginationButton>

          {Array.from({ length: notificationsPagination.totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              $active={notificationsPagination.currentPage === page}
              onClick={() => notificationsPagination.paginate(page)}
              theme={theme}
            >
              {page}
            </PaginationButton>
          ))}

          <PaginationButton
            onClick={() => notificationsPagination.paginate(notificationsPagination.currentPage + 1)}
            disabled={notificationsPagination.currentPage === notificationsPagination.totalPages}
            theme={theme}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </ProfileSection>
  );
};

export default React.memo(NotificationHistorySection);