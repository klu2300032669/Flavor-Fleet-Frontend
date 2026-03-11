import React from "react";
import { FaSave } from "react-icons/fa";
import Modal from "../Modal";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  Button,
  PasswordStrengthMeter,
} from "../styles";

const PasswordModal = ({
  isOpen,
  onClose,
  passwordForm,
  setPasswordForm,
  passwordStrength,
  handlePasswordUpdate,
  theme,
}) => {
  const isDirty = Boolean(
    passwordForm.currentPassword ||
    passwordForm.newPassword ||
    passwordForm.confirmPassword
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      ariaLabel="Change password form"
      isDirty={isDirty}
      theme={theme}
    >
      <Form onSubmit={handlePasswordUpdate}>
        <FormGroup>
          <FormLabel htmlFor="currentPassword" theme={theme}>
            Current Password
          </FormLabel>
          <FormInput
            id="currentPassword"
            type="password"
            value={passwordForm.currentPassword || ""}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
            required
            theme={theme}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="newPassword" theme={theme}>
            New Password
          </FormLabel>
          <FormInput
            id="newPassword"
            type="password"
            value={passwordForm.newPassword || ""}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            required
            theme={theme}
          />
          {passwordForm.newPassword && (
            <PasswordStrengthMeter $strength={passwordStrength} />
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="confirmPassword" theme={theme}>
            Confirm New Password
          </FormLabel>
          <FormInput
            id="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword || ""}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
            required
            theme={theme}
          />
        </FormGroup>

        <Button type="submit" theme={theme} style={{ width: "100%" }}>
          <FaSave aria-hidden="true" /> Update Password
        </Button>
      </Form>
    </Modal>
  );
};

export default PasswordModal;