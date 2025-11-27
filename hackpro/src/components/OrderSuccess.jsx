import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { 
  FiCheckCircle, FiHome, FiMenu, FiUser, FiRefreshCw, FiMapPin, 
  FiPackage, FiClock, FiTruck, FiCreditCard
} from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";

// Enhanced Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 64, 129, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 64, 129, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 64, 129, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const confettiFloat = keyframes`
  0% { 
    transform: translateY(100vh) rotate(0deg); 
    opacity: 1; 
  }
  100% { 
    transform: translateY(-100px) rotate(720deg); 
    opacity: 0; 
  }
`;

// Styled Components - PERFECT MATCH!
const SuccessContainer = styled.div`
  width: 90%;
  height: auto;
  max-width: 800px;
  margin: 100px auto 50px;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(135deg, #fef8f5 0%, #fff5f5 100%);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 80px auto 30px;
    padding: 15px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255, 64, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 111, 97, 0.1) 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }
`;

const SuccessCard = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 64, 129, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  animation: ${glow} 2s ease-in-out infinite alternate;

  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 25px;
  }
`;

const SuccessIcon = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  box-shadow: 0 10px 30px rgba(255, 64, 129, 0.3);
  animation: ${pulse} 2s infinite;

  svg {
    width: 50px;
    height: 50px;
    color: white;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const SuccessTitle = styled.h1`
  color: #ff4081;
  text-align: center;
  margin: 0 0 15px;
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #ff4081, #ff6f61);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SuccessSubtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TrackingChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  margin: 0 auto 40px;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
  animation: ${pulse} 2s infinite;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const OrderDetailsSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 64, 129, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  color: #ff4081;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 20px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 64, 129, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
`;

const OrderId = styled.span`
  font-weight: 700;
  color: #333;
  font-size: 1.2rem;
`;

const StatusChip = styled.div`
  padding: 8px 16px;
  border-radius: 25px;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const OrderDate = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ItemName = styled.span`
  font-weight: 500;
  color: #333;
`;

const ItemPrice = styled.span`
  color: #ff4081;
  font-weight: 600;
`;

const OrderTotal = styled.div`
  text-align: right;
  font-weight: 700;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid rgba(255, 64, 129, 0.1);
  font-size: 1.5rem;
  color: #333;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DeliveryInfo = styled.div`
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%);
  padding: 15px;
  border-radius: 12px;
  margin: 15px 0;
  border: 1px solid rgba(76, 175, 80, 0.2);
`;

const DeliveryText = styled.p`
  margin: 0;
  color: #4CAF50;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaymentInfo = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 15px 25px;
  border: none;
  border-radius: 25px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: none;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #ff4081, #ff6f61);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
        `;
      case 'secondary':
        return `
          background: linear-gradient(135deg, #2196F3, #64B5F6);
          color: white;
          box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        `;
      case 'outline':
        return `
          background: white;
          color: #ff4081;
          border: 2px solid #ff4081;
          box-shadow: 0 2px 10px rgba(255, 64, 129, 0.2);
        `;
      case 'text':
        return `
          background: transparent;
          color: #666;
        `;
      default:
        return `
          background: linear-gradient(135deg, #ff4081, #ff6f61);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
        `;
    }
  }}

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
`;

const HelpText = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.8rem;
  margin-top: 25px;
`;

// Confetti Component
const ConfettiParticle = styled(motion.div)`
  position: absolute;
  width: ${props => Math.random() * 12 + 6}px;
  height: ${props => Math.random() * 12 + 6}px;
  background: ${props => ['#ff4081', '#ff6f61', '#ffca28', '#4caf50', '#2196f3', '#9c27b0'][Math.floor(Math.random() * 6)]};
  border-radius: ${props => ['50%', '0%', '25%'][Math.floor(Math.random() * 3)]};
  animation: ${confettiFloat} ${props => 3 + Math.random() * 2}s linear infinite;
  left: ${props => Math.random() * 100}%;
  animation-delay: ${props => Math.random() * 2}s;
`;

// Skeleton Loader
const SuccessSkeleton = styled.div`
  max-width: 500px;
  margin: 100px auto;
  padding: 40px 20px;
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 64, 129, 0.1);
`;

const SkeletonItem = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

// Main Component
const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lastOrder, fetchOrders, user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState("Preparing your order");

  const passedState = location.state;

  useEffect(() => {
    const initializeOrder = async () => {
      try {
        setLoading(true);

        let details = null;

        if (passedState) {
          // Use passed state from navigation for immediate display
          details = {
            orderId: passedState.orderId,
            createdAt: new Date().toISOString(),
            items: passedState.items || [],
            total: passedState.totalAmount || 0,
            name: passedState.name || user?.name || "Customer",
            addressLine1: passedState.addressLine1 || "",
            addressLine2: passedState.addressLine2 || "",
            city: passedState.city || "",
            pincode: passedState.pincode || "",
            paymentMethod: passedState.paymentMethod || "Cash",
            estimatedDelivery: passedState.estimatedDelivery || "30-40 minutes",
            status: "confirmed",
            orderNumber: `#ORD${Date.now().toString().slice(-6)}`
          };
        } else if (lastOrder) {
          // Fallback to lastOrder if no state
          await fetchOrders();
          details = {
            id: lastOrder._id || `ORD-${Date.now()}`,
            createdAt: lastOrder.createdAt || new Date().toISOString(),
            items: lastOrder.items || [],
            total: lastOrder.total || lastOrder.totalPrice || 0,
            name: lastOrder.name || user?.name || "Customer",
            addressLine1: lastOrder.addressLine1 || "",
            addressLine2: lastOrder.addressLine2 || "",
            city: lastOrder.city || "",
            pincode: lastOrder.pincode || "",
            paymentMethod: lastOrder.paymentMethod || "Cash",
            estimatedDelivery: lastOrder.estimatedDelivery || "30-40 minutes",
            status: lastOrder.status || "confirmed",
            orderNumber: lastOrder.orderNumber || `#ORD${Date.now().toString().slice(-6)}`
          };
        } else {
          setError("No order details found. Please place an order first.");
          return;
        }

        setOrderDetails(details);

        const statuses = ["Preparing your order", "Order ready", "Out for delivery", "Delivered"];
        let currentStatus = 0;
        
        const statusInterval = setInterval(() => {
          if (currentStatus < statuses.length - 1) {
            currentStatus++;
            setTrackingStatus(statuses[currentStatus]);
          }
        }, 5000);

        return () => clearInterval(statusInterval);
      } catch (err) {
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeOrder();
  }, [passedState, lastOrder, fetchOrders, user]);

  const handleTrackOrder = () => navigate("/orders");
  const handleRetry = () => window.location.reload();

  if (loading) {
    return (
      <SuccessContainer>
        <SuccessSkeleton>
          <SkeletonItem style={{ width: '100px', height: '100px', margin: '0 auto 20px', borderRadius: '50%' }} />
          <SkeletonItem style={{ width: '80%', height: '60px', margin: '0 auto 20px' }} />
          <SkeletonItem style={{ width: '60%', height: '20px', margin: '0 auto 30px' }} />
          <SkeletonItem style={{ width: '100%', height: '40px', marginBottom: '20px' }} />
          <div style={{ background: 'rgba(255,64,129,0.05)', padding: '20px', borderRadius: '15px' }}>
            <SkeletonItem style={{ width: '70%', height: '25px', marginBottom: '10px' }} />
            {[1,2,3].map(i => (
              <SkeletonItem key={i} style={{ width: '90%', height: '20px', marginBottom: '5px' }} />
            ))}
            <SkeletonItem style={{ width: '30%', height: '30px', marginTop: '10px' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <SkeletonItem style={{ width: '120px', height: '50px', borderRadius: '25px' }} />
            <SkeletonItem style={{ width: '120px', height: '50px', borderRadius: '25px' }} />
          </div>
        </SuccessSkeleton>
      </SuccessContainer>
    );
  }

  if (error || !orderDetails) {
    return (
      <SuccessContainer>
        <SuccessCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FiRefreshCw size={48} style={{ color: '#ff4081', margin: '0 auto 20px', display: 'block' }} />
          <SuccessTitle style={{ color: '#ff4081' }}>Oops!</SuccessTitle>
          <SuccessSubtitle>{error || "No order details found."}</SuccessSubtitle>
          <ActionButton onClick={handleRetry} variant="primary">
            <FiRefreshCw /> Try Again
          </ActionButton>
          <ActionButton onClick={() => navigate("/menu")} variant="outline">
            <FiMenu /> Back to Menu
          </ActionButton>
        </SuccessCard>
      </SuccessContainer>
    );
  }

  return (
    <SuccessContainer>
      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          initial={{ y: "100vh" }}
          animate={{ y: "-100px" }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: i * 0.1, 
            ease: "linear" 
          }}
        />
      ))}

      <SuccessCard
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.25 }}
      >
        <SuccessIcon>
          <FiCheckCircle />
        </SuccessIcon>

        <SuccessTitle>Order Placed Successfully!</SuccessTitle>
        <SuccessSubtitle>
          Your delicious meal is on its way—get ready to savor the flavor!
        </SuccessSubtitle>

        <TrackingChip>
          <FiMapPin />
          {trackingStatus}
        </TrackingChip>

        <OrderDetailsSection>
          <SectionTitle>Order Details</SectionTitle>
          
          <OrderHeader>
            <OrderId>Order #{orderDetails.orderNumber}</OrderId>
            <StatusChip>
              <FiCheckCircle /> Confirmed
            </StatusChip>
          </OrderHeader>

          <OrderDate>
            Ordered: {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </OrderDate>

          {orderDetails.items.map((item, index) => (
            <OrderItem key={item.id || index}>
              <ItemName>{item.name} × {item.quantity}</ItemName>
              <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
            </OrderItem>
          ))}

          <OrderTotal>Total: ₹{orderDetails.total.toFixed(2)}</OrderTotal>

          <DeliveryInfo>
            <DeliveryText>
              <FiTruck />
              Delivery to: {orderDetails.name}
            </DeliveryText>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
              {orderDetails.addressLine1}
              {orderDetails.addressLine2 && `, ${orderDetails.addressLine2}`}
              {orderDetails.city && `, ${orderDetails.city}`} {orderDetails.pincode && `- ${orderDetails.pincode}`}
            </p>
          </DeliveryInfo>

          <PaymentInfo>
            <FiCreditCard />
            Payment: {orderDetails.paymentMethod === "Cash" ? "Cash on Delivery" : orderDetails.paymentMethod}
          </PaymentInfo>

          <DeliveryText style={{ justifyContent: 'center', marginTop: '10px' }}>
            <FiClock />
            Estimated: {orderDetails.estimatedDelivery}
          </DeliveryText>
        </OrderDetailsSection>

        <ActionButtons>
          <ActionButton 
            variant="secondary" 
            onClick={handleTrackOrder}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMapPin /> Track Order
          </ActionButton>

          <ActionButton 
            variant="primary" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiHome /> Home
          </ActionButton>

          <ActionButton 
            variant="outline" 
            onClick={() => navigate("/menu")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMenu /> Order More
          </ActionButton>

          <ActionButton 
            variant="text" 
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiUser /> View Profile
          </ActionButton>
        </ActionButtons>

        <HelpText>
          Need help? Contact support at <strong>support@flavorfleet.com</strong>
        </HelpText>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default OrderSuccess;