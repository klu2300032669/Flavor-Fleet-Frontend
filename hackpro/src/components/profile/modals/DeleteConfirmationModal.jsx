// src/components/profile/modals/DeleteConfirmationModal.jsx
import React from "react";
import { FaTrash } from "react-icons/fa";
import Modal from "../Modal";
import styled from "styled-components";

const ConfirmationModalContent = styled.div`
  padding: 1.5rem;
`;

const ConfirmationText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f1f5f9' : '#0f172a'};
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  ${({ $secondary, theme }) => $secondary ? `
    background: transparent;
    border-color: ${theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    color: ${theme.mode === 'dark' ? '#94a3b8' : '#64748b'};
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }
  ` : `
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  deleteTarget,
  handleDelete,
  theme,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      ariaLabel="Confirm deletion"
    >
      <ConfirmationModalContent>
        <ConfirmationText theme={{ mode: theme }}>
          Are you sure you want to delete this {deleteTarget.type}?
        </ConfirmationText>
        <ConfirmationButtons>
          <Button $secondary onClick={onClose} theme={{ mode: theme }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} theme={{ mode: theme }}>
            <FaTrash style={{ marginRight: '0.5rem' }} /> Delete
          </Button>
        </ConfirmationButtons>
      </ConfirmationModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;