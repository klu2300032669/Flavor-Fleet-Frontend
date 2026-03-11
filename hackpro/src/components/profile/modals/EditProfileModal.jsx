import React from "react";
import { FaSave } from "react-icons/fa";
import Modal from "../Modal";
import { Form, FormGroup, FormLabel, FormInput, Button } from "../styles";

const EditProfileModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleProfileUpdate,
  theme,
}) => {
  const isDirty = Boolean(
    formData.name?.trim() ||
    formData.email?.trim() ||
    formData.profilePicture
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      ariaLabel="Edit profile information"
      isDirty={isDirty}
      theme={theme}
    >
      <Form onSubmit={handleProfileUpdate}>
        <FormGroup>
          <FormLabel htmlFor="name" theme={theme}>Name</FormLabel>
          <FormInput
            id="name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            theme={theme}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="email" theme={theme}>Email</FormLabel>
          <FormInput
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            theme={theme}
          />
        </FormGroup>

        <Button type="submit" theme={theme} style={{ width: "100%" }}>
          <FaSave aria-hidden="true" /> Save Changes
        </Button>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;