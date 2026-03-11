import React from "react";
import { FaSave, FaTag } from "react-icons/fa";
import Modal from "../Modal";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  Button,
  ErrorMessage,
} from "../styles";

const CategoryModal = ({
  isOpen,
  onClose,
  editCategory,
  categoryForm,
  setCategoryForm,
  handleAddCategory,
  theme,
  errors = {},
  setErrors = () => {},
}) => {
  const isDirty = Boolean(categoryForm.name?.trim());

  const handleInputChange = (value) => {
    setCategoryForm({ ...categoryForm, name: value.trimStart() }); // Prevent leading spaces
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddCategory(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaTag style={{ marginRight: "0.75rem" }} aria-hidden="true" />
          {editCategory ? "Edit Category" : "Add New Category"}
        </>
      }
      ariaLabel={editCategory ? "Edit category form" : "Add new category form"}
      isDirty={isDirty}
      theme={theme}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel theme={theme}>
            <FaTag style={{ marginRight: "0.5rem" }} aria-hidden="true" />
            Category Name *
          </FormLabel>
          <FormInput
            type="text"
            value={categoryForm.name || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            required
            autoFocus
            theme={theme}
            $hasError={!!errors.name}
            placeholder="e.g., Pizza, Beverages, Desserts"
            maxLength="50"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "category-name-error" : undefined}
          />
          {errors.name && (
            <ErrorMessage id="category-name-error" theme={theme}>
              {errors.name}
            </ErrorMessage>
          )}
        </FormGroup>

        <Button
          type="submit"
          disabled={!isDirty || !!errors.name}
          theme={theme}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          <FaSave aria-hidden="true" style={{ marginRight: "0.5rem" }} />
          {editCategory ? "Update Category" : "Add Category"}
        </Button>
      </Form>
    </Modal>
  );
};

export default React.memo(CategoryModal);