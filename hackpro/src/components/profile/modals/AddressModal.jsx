import React from "react";
import { FaSave } from "react-icons/fa";
import Modal from "../Modal";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  Button,
  ErrorMessage,
} from "../styles";

const AddressModal = ({
  isOpen,
  onClose,
  editAddress,
  addressForm,
  setAddressForm,
  handleAddressSubmit,
  theme,
  errors = {},
  setErrors = () => {},
}) => {
  const isDirty = Boolean(
    addressForm.addressLine1?.trim() ||
    addressForm.addressLine2?.trim() ||
    addressForm.city?.trim() ||
    addressForm.pincode?.trim()
  );

  const handleInputChange = (field, value) => {
    setAddressForm({ ...addressForm, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validatePincode = (pincode) => {
    if (!pincode) return "Pincode is required";
    if (!/^\d{6}$/.test(pincode)) return "Pincode must be 6 digits";
    return "";
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    handleInputChange("pincode", value);

    if (value.length === 6) {
      const error = validatePincode(value);
      setErrors({ ...errors, pincode: error || "" });
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAddress ? "Edit Address" : "Add New Address"}
      ariaLabel={editAddress ? "Edit address form" : "Add new address form"}
      isDirty={isDirty}
      theme={theme}
    >
      <Form onSubmit={handleAddressSubmit}>
        <FormGroup>
          <FormLabel htmlFor="addressLine1" theme={theme}>
            Address Line 1 *
          </FormLabel>
          <FormInput
            id="addressLine1"
            type="text"
            value={addressForm.addressLine1 || ""}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            required
            theme={theme}
            $hasError={!!errors.addressLine1}
            placeholder="Enter street address"
            aria-required="true"
            aria-invalid={!!errors.addressLine1}
            aria-describedby={errors.addressLine1 ? "addressLine1-error" : undefined}
          />
          {errors.addressLine1 && (
            <ErrorMessage id="addressLine1-error" theme={theme}>
              {errors.addressLine1}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="addressLine2" theme={theme}>
            Address Line 2 (Optional)
          </FormLabel>
          <FormInput
            id="addressLine2"
            type="text"
            value={addressForm.addressLine2 || ""}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            theme={theme}
            placeholder="Apartment, suite, unit, etc."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="city" theme={theme}>
            City *
          </FormLabel>
          <FormInput
            id="city"
            type="text"
            value={addressForm.city || ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
            theme={theme}
            $hasError={!!errors.city}
            placeholder="Enter city name"
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
          />
          {errors.city && (
            <ErrorMessage id="city-error" theme={theme}>
              {errors.city}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="pincode" theme={theme}>
            Pincode *
          </FormLabel>
          <FormInput
            id="pincode"
            type="text"
            value={addressForm.pincode || ""}
            onChange={handlePincodeChange}
            required
            theme={theme}
            $hasError={!!errors.pincode}
            placeholder="6-digit pincode"
            inputMode="numeric"
            maxLength="6"
            aria-required="true"
            aria-invalid={!!errors.pincode}
            aria-describedby={errors.pincode ? "pincode-error" : undefined}
          />
          {errors.pincode && (
            <ErrorMessage id="pincode-error" theme={theme}>
              {errors.pincode}
            </ErrorMessage>
          )}
        </FormGroup>

        <Button
          type="submit"
          disabled={!isDirty || hasErrors}
          theme={theme}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          <FaSave aria-hidden="true" /> {editAddress ? "Update Address" : "Save Address"}
        </Button>
      </Form>
    </Modal>
  );
};

export default React.memo(AddressModal);