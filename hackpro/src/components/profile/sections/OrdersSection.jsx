// src/components/profile/sections/OrdersSection.jsx
import React from "react";
import { FaShoppingBag, FaCartPlus } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import {
  ProfileSection,
  SectionTitle,
  FilterContainer,
  FilterButton,
  Card,
  Button,
  InfoValue,
} from "../styles";

const OrdersSection = ({
  orders,
  orderFilter,
  setOrderFilter,
  ordersLoading,
  handleReorder,
  handleViewOrder,
  theme,
}) => {
  const filteredOrders = orders.filter((order) =>
    orderFilter === "All" ? true : order.status === orderFilter
  );

  return (
    <ProfileSection>
      <SectionTitle theme={theme}>
        <FaShoppingBag aria-hidden="true" /> Recent Orders
      </SectionTitle>

      <FilterContainer>
        {["All", "Delivered", "Pending", "Cancelled"].map((status) => (
          <FilterButton
            key={status}
            $active={orderFilter === status}
            onClick={() => setOrderFilter(status)}
            theme={theme}
          >
            {status}
          </FilterButton>
        ))}
      </FilterContainer>

      {ordersLoading ? (
        <Card theme={theme}><InfoValue theme={theme}>Loading orders...</InfoValue></Card>
      ) : filteredOrders.length === 0 ? (
        <Card theme={theme}>
          <InfoValue theme={theme}>
            {orderFilter === "All" ? "No orders yet. Start shopping!" : `No ${orderFilter.toLowerCase()} orders.`}
          </InfoValue>
        </Card>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} theme={theme} style={{ marginBottom: "1rem", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <strong>#{order.id}</strong>
              <span style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "20px",
                background: order.status === "Delivered" ? "rgba(40,167,69,0.2)" : "rgba(255,193,7,0.2)",
                color: order.status === "Delivered" ? "#28a745" : "#ffc107",
              }}>
                {order.status}
              </span>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ width: "80px", height: "80px", background: "#eee", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {order.items?.[0]?.image ? (
                  <img src={order.items[0].image} alt={order.items[0].name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                ) : (
                  <FaShoppingBag style={{ fontSize: "2rem" }} />
                )}
              </div>

              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Order by {order.userName || "You"}</h4>
                <div style={{ marginBottom: "0.5rem" }}>
                  {order.items?.map((item) => (
                    <div key={item.id}>{item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}</div>
                  ))}
                </div>
                <p><FiMapPin /> {order.addressLine1}, {order.city}, {order.pincode}</p>
                <p>Total: ${order.totalPrice?.toFixed(2) || "0.00"}</p>
                <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <Button $secondary onClick={() => handleReorder(order)} theme={theme}>
                    <FaCartPlus /> Reorder
                  </Button>
                  <Button $secondary onClick={() => handleViewOrder(order)} theme={theme}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </ProfileSection>
  );
};

export default OrdersSection;