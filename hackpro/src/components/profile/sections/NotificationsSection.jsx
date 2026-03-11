import React from "react";
import { FaBell, FaTrash } from "react-icons/fa";
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

const NotificationsSection = ({
  notifications,
  notificationFilter,
  setNotificationFilter,
  handleMarkAsRead,
  handleMarkAllRead,
  handleClearAll,
  handleDeleteNotification,
  notificationsPagination,
  theme,
}) => {
  const filteredNotifications = notifications.filter((n) => {
    if (notificationFilter === "Unread") return !n.read;
    if (notificationFilter === "Orders") return n.type === "order";
    if (notificationFilter === "Promotions") return n.type === "promotion";
    return true;
  });

  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaBell aria-hidden="true" /> Notifications Center
      </SectionTitle>

      <FilterContainer>
        {["All", "Unread", "Orders", "Promotions"].map((filter) => (
          <FilterButton
            key={filter}
            $active={notificationFilter === filter}
            onClick={() => setNotificationFilter(filter)}
            theme={theme}
          >
            {filter}
          </FilterButton>
        ))}
      </FilterContainer>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button $secondary onClick={handleMarkAllRead} theme={theme}>
          Mark All Read
        </Button>
        <Button $secondary onClick={handleClearAll} theme={theme}>
          Clear All
        </Button>
      </div>

      <Card theme={theme} style={{ padding: "1rem" }}>
        {notificationsPagination.currentItems.length > 0 ? (
          notificationsPagination.currentItems.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: "1rem",
                borderBottom: "1px solid rgba(255,102,102,0.2)",
                marginBottom: "0.5rem",
              }}
            >
              {notification.type && (
                <span style={{
                  padding: "0.3rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  background: notification.type === "order" ? "rgba(255,193,7,0.2)" : "rgba(40,167,69,0.2)",
                  color: notification.type === "order" ? "#ffc107" : "#28a745",
                }}>
                  {notification.type}
                </span>
              )}
              {notification.title && <h4 style={{ margin: "0.5rem 0" }}>{notification.title}</h4>}
              <div dangerouslySetInnerHTML={{ __html: notification.content }} />
              {notification.imageUrl && (
                <img src={notification.imageUrl} alt="Notification" style={{ maxWidth: "100%", borderRadius: "8px", margin: "0.5rem 0" }} />
              )}
              <small style={{ opacity: 0.7 }}>
                {new Date(notification.sentAt).toLocaleString()}
              </small>
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                {!notification.read && (
                  <Button $secondary onClick={() => handleMarkAsRead(notification.id)} theme={theme}>
                    Mark Read
                  </Button>
                )}
                <Button $secondary onClick={() => handleDeleteNotification(notification.id)} theme={theme}>
                  <FaTrash /> Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", opacity: 0.7 }}>No notifications in this category</p>
        )}
      </Card>

      {notificationsPagination.totalPages > 1 && (
        <PaginationContainer>
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

export default React.memo(NotificationsSection);