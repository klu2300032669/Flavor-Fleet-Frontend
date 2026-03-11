import React from "react";
import {
  FaSave,
  FaUtensils,
  FaDollarSign,
  FaAlignLeft,
  FaImage,
  FaTag,
  FaLeaf,
} from "react-icons/fa";
import Modal from "../Modal";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  ErrorMessage,
} from "../styles";

const MenuItemModal = ({
  isOpen,
  onClose,
  editMenuItem,
  menuItemForm = {},
  setMenuItemForm,
  categories = [],
  handleAddMenuItem,
  theme,
  errors = {},
  setErrors = () => {},
}) => {
  const isDirty = Boolean(
    menuItemForm.name?.trim() ||
    menuItemForm.price ||
    menuItemForm.description?.trim() ||
    menuItemForm.image?.trim() ||
    menuItemForm.categoryId ||
    menuItemForm.type
  );

  const handleInputChange = (field, value) => {
    let newValue = value;

    if (field === "price") {
      const num = parseFloat(value);
      newValue = isNaN(num) ? "" : Math.max(0, Math.min(10000, num));
    } else if (field === "name") {
      newValue = value.slice(0, 100);
    } else if (field === "description") {
      newValue = value.slice(0, 500);
    }

    setMenuItemForm({ ...menuItemForm, [field]: newValue });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaUtensils style={{ marginRight: "0.75rem" }} aria-hidden="true" />
          {editMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        </>
      }
      ariaLabel={editMenuItem ? "Edit menu item form" : "Add new menu item form"}
      isDirty={isDirty}
      theme={theme}
      size="large"
    >
      <Form onSubmit={handleAddMenuItem}>
        {/* Item Name */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaUtensils style={{ marginRight: "0.5rem" }} /> Item Name *
          </FormLabel>
          <FormInput
            type="text"
            value={menuItemForm.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            theme={theme}
            $hasError={!!errors.name}
            placeholder="Enter item name"
          />
          {errors.name && <ErrorMessage theme={theme}>{errors.name}</ErrorMessage>}
        </FormGroup>

        {/* Price */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaDollarSign style={{ marginRight: "0.5rem" }} /> Price *
          </FormLabel>
          <FormInput
            type="number"
            step="0.01"
            min="0"
            max="10000"
            value={menuItemForm.price || ""}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            theme={theme}
            $hasError={!!errors.price}
            placeholder="0.00"
          />
          {errors.price && <ErrorMessage theme={theme}>{errors.price}</ErrorMessage>}
        </FormGroup>

        {/* Description */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaAlignLeft style={{ marginRight: "0.5rem" }} /> Description (Optional)
          </FormLabel>
          <FormTextarea
            value={menuItemForm.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            theme={theme}
            rows="4"
            placeholder="Describe the item..."
          />
          <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.25rem" }}>
            {500 - (menuItemForm.description?.length || 0)} characters remaining
          </div>
        </FormGroup>

        {/* Image URL */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaImage style={{ marginRight: "0.5rem" }} /> Image URL (Optional)
          </FormLabel>
          <FormInput
            type="url"
            value={menuItemForm.image || ""}
            onChange={(e) => handleInputChange("image", e.target.value)}
            theme={theme}
            placeholder="https://example.com/image.jpg"
          />
        </FormGroup>

        {/* Category */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaTag style={{ marginRight: "0.5rem" }} /> Category *
          </FormLabel>
          <FormSelect
            value={menuItemForm.categoryId || ""}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
            required
            theme={theme}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>

        {/* Type (Veg/Non-Veg) */}
        <FormGroup>
          <FormLabel theme={theme}>
            <FaLeaf style={{ marginRight: "0.5rem" }} /> Type *
          </FormLabel>
          <FormSelect
            value={menuItemForm.type || "Veg"}
            onChange={(e) => handleInputChange("type", e.target.value)}
            theme={theme}
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </FormSelect>
        </FormGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isDirty || hasErrors}
          theme={theme}
          style={{ marginTop: "1.5rem", width: "100%" }}
        >
          <FaSave aria-hidden="true" style={{ marginRight: "0.5rem" }} />
          {editMenuItem ? "Update Item" : "Add Item"}
        </Button>
      </Form>
    </Modal>
  );
};

export default React.memo(MenuItemModal);