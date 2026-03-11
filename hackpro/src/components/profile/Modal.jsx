import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalClose } from "./styles";

const Modal = ({ isOpen, onClose, title, children, ariaLabel, isDirty = false }) => {
  const modalRef = useRef();

  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <ModalClose onClick={handleClose} aria-label="Close modal">
            <FaTimes />
          </ModalClose>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  isDirty: PropTypes.bool,
};

export default Modal;