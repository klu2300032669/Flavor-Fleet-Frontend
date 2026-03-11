// src/components/profile/sections/ContactMessagesSection.jsx
import React from "react";
import { FaEnvelope, FaSearch, FaTrash, FaExclamationCircle } from "react-icons/fa";
import {
  ProfileSection,
  SectionTitle,
  SearchContainer,
  SearchInput,
  Button,
  Card,
  InfoValue,
  MessagesLoadingContainer,
  Spinner,
  LoadingText,
  MessagesErrorMessage,
  PaginationContainer,
  PaginationButton,
} from "../styles";

const ContactMessagesSection = ({
  contactMessages,
  messagesLoading,
  messagesError,
  searchQuery,
  handleSearchChange,
  handleDeleteContactMessage,
  contactMessagesPagination,
  theme,
}) => {
  const filteredMessages = contactMessages.filter((message) =>
    searchQuery
      ? message.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const hasMessages = filteredMessages.length > 0;

  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaEnvelope aria-hidden="true" /> Contact Messages
      </SectionTitle>

      <SearchContainer>
        <SearchInput
          type="search"
          placeholder="Search by name, email, or message..."
          value={searchQuery}
          onChange={handleSearchChange}
          theme={theme}
          aria-label="Search contact messages"
        />
        <Button type="button" theme={theme}>
          <FaSearch aria-hidden="true" /> Search
        </Button>
      </SearchContainer>

      {messagesLoading ? (
        <MessagesLoadingContainer>
          <Spinner theme={theme} />
          <LoadingText theme={theme}>Loading messages...</LoadingText>
        </MessagesLoadingContainer>
      ) : messagesError ? (
        <MessagesErrorMessage theme={theme}>
          <FaExclamationCircle style={{ marginRight: "0.5rem" }} />
          {messagesError}
        </MessagesErrorMessage>
      ) : !hasMessages ? (
        <Card theme={theme}>
          <InfoValue theme={theme}>No contact messages found.</InfoValue>
        </Card>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Contact messages table">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>Message Preview</th>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>Received At</th>
                  <th style={{ textAlign: "left", padding: "1rem", background: "rgba(255,102,102,0.1)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessagesPagination.currentItems.map((message) => (
                  <tr key={message.id} style={{ borderBottom: "1px solid rgba(255,102,102,0.2)" }}>
                    <td style={{ padding: "1rem" }}>{message.id}</td>
                    <td style={{ padding: "1rem" }}>
                      {`${message.firstName || ""} ${message.lastName || ""}`.trim() || "Unknown"}
                    </td>
                    <td style={{ padding: "1rem" }}>{message.email || "No email"}</td>
                    <td style={{ padding: "1rem" }}>
                      {message.message ? `${message.message.substring(0, 50)}...` : "No message"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {message.createdAt ? new Date(message.createdAt).toLocaleString() : "Unknown"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <Button
                        $secondary
                        type="button"
                        onClick={() => handleDeleteContactMessage(message.id)}
                        theme={theme}
                      >
                        <FaTrash aria-hidden="true" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {contactMessagesPagination.totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => contactMessagesPagination.paginate(contactMessagesPagination.currentPage - 1)}
                disabled={contactMessagesPagination.currentPage === 1}
                theme={theme}
              >
                Previous
              </PaginationButton>
              {Array.from({ length: contactMessagesPagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationButton
                  key={page}
                  $active={contactMessagesPagination.currentPage === page}
                  onClick={() => contactMessagesPagination.paginate(page)}
                  theme={theme}
                >
                  {page}
                </PaginationButton>
              ))}
              <PaginationButton
                onClick={() => contactMessagesPagination.paginate(contactMessagesPagination.currentPage + 1)}
                disabled={contactMessagesPagination.currentPage === contactMessagesPagination.totalPages}
                theme={theme}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </ProfileSection>
  );
};

export default React.memo(ContactMessagesSection);