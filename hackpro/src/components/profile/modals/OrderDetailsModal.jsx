import React, { useState, useEffect } from "react";
import { FaShoppingBag, FaUtensils, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import Modal from "../Modal";
import { FormGroup, FormLabel, FormSelect, Button, Card, InfoValue } from "../styles";

const OrderDetailsModal = ({
  isOpen,
  onClose,
  selectedOrder,
  normalizeRole,
  user,
  handleUpdateOrderStatus,
  theme,
}) => {
  const [localStatus, setLocalStatus] = useState(selectedOrder?.status || "Pending");

  useEffect(() => {
    if (selectedOrder?.status) {
      setLocalStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  if (!selectedOrder) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Order Details" theme={theme}>
        <InfoValue theme={theme} style={{ textAlign: "center", padding: "2rem" }}>
          No order selected.
        </InfoValue>
      </Modal>
    );
  }

  const handleUpdate = () => {
    handleUpdateOrderStatus(selectedOrder.id, localStatus);
  };

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "#10b981",
      Processing: "#3b82f6",
      Shipped: "#8b5cf6",
      Pending: "#f59e0b",
      Cancelled: "#dc2626",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaShoppingBag style={{ marginRight: "0.75rem" }} />
          Order #{selectedOrder.id}
        </>
      }
      theme={theme}
      size="large"
    >
      <Card theme={theme} style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 120px" }}>
            <div style={{ width: "120px", height: "120px", background: "#eee", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedOrder.items?.[0]?.image ? (
                <img src={selectedOrder.items[0].image} alt={selectedOrder.items[0].name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
              ) : (
                <FaUtensils style={{ fontSize: "3rem", color: "#ff6666" }} />
              )}
            </div>
          </div>

          <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Order Summary</h3>
            <div style={{ marginBottom: "1rem" }}>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  <strong>{item.name}</strong> × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                </div>
              ))}
            </div>

            <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
              <div><FaMapMarkerAlt style={{ marginRight: "0.5rem" }} />{selectedOrder.addressLine1}, {selectedOrder.city} - {selectedOrder.pincode}</div>
              <div><FaMoneyBillWave style={{ marginRight: "0.5rem" }} />Total: ${selectedOrder.totalPrice?.toFixed(2)}</div>
              <div><FaCalendarAlt style={{ marginRight: "0.5rem" }} />Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            </div>

            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(255,102,102,0.1)", borderRadius: "8px", display: "inline-block" }}>
              <strong style={{ color: getStatusColor(localStatus) }}>Status: {localStatus}</strong>
            </div>
          </div>
        </div>
      </Card>

      {normalizeRole(user?.role) === "ADMIN" && (
        <FormGroup style={{ marginTop: "1.5rem" }}>
          <FormLabel theme={theme}>Update Status</FormLabel>
          <FormSelect value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} theme={theme}>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </FormSelect>
          <Button onClick={handleUpdate} theme={theme} style={{ marginTop: "1rem", width: "100%" }}>
            Update Status
          </Button>
        </FormGroup>
      )}
    </Modal>
  );
};

export default React.memo(OrderDetailsModal);