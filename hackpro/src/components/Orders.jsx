import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styled, { keyframes } from 'styled-components';
import LoadingSpinner from './LoadingSpinner';
import { 
  FiRefreshCw, 
  FiFilter, 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch, 
  FiArrowLeft,
  FiMapPin,
  FiTruck,
  FiCreditCard
} from 'react-icons/fi';

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

// Enhanced Styled Components
const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 100px auto 50px;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(135deg, #fef8f5 0%, #fff5f5 100%);
  min-height: 100vh;

  @media (max-width: 768px) {
    margin: 80px auto 30px;
    padding: 15px;
  }
`;

const OrdersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h1`
  color: #ff4081;
  text-align: center;
  margin: 0;
  font-size: 3rem;
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
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #ff4081, #ff6f61);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    text-align: left;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
    animation: ${glow} 1s infinite;
  }

  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  input {
    width: 100%;
    padding: 12px 45px 12px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3s ease;
    background: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    &:focus {
      outline: none;
      border-color: #ff4081;
      box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  }

  svg {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    transition: color 0.3s ease;

    input:focus + & {
      color: #ff4081;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border: 2px solid ${props => props.active ? '#ff4081' : '#e0e0e0'};
  background: ${props => props.active ? 'linear-gradient(135deg, #ff4081, #ff6f61)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${props => props.active ? '0 4px 15px rgba(255, 64, 129, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: #ff4081;
    color: #ff4081;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.3);
  }

  &.active:hover {
    background: linear-gradient(135deg, #ff6f61, #ff4081);
    color: white;
  }
`;

const RefreshButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
    animation: ${pulse} 1s infinite;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg.spinning {
    animation: ${pulse} 1s infinite;
  }
`;

const OrderGrid = styled.div`
  display: grid;
  gap: 25px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1025px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${props => {
      switch (props.status) {
        case 'Delivered': return 'linear-gradient(180deg, #4CAF50, #81C784)';
        case 'Cancelled': return 'linear-gradient(180deg, #F44336, #E57373)';
        case 'Processing': return 'linear-gradient(180deg, #FFC107, #FFEE58)';
        default: return 'linear-gradient(180deg, #2196F3, #64B5F6)';
      }
    }};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f5f5f5;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const OrderId = styled.span`
  font-weight: 700;
  color: #333;
  font-size: 1.2rem;
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const OrderStatus = styled.div`
  color: ${props => {
    switch (props.status) {
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      case 'Processing': return '#FFC107';
      default: return '#2196F3';
    }
  }};
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 25px;
  background: ${props => {
    switch (props.status) {
      case 'Delivered': return 'rgba(76, 175, 80, 0.1)';
      case 'Cancelled': return 'rgba(244, 67, 54, 0.1)';
      case 'Processing': return 'rgba(255, 193, 7, 0.1)';
      default: return 'rgba(33, 150, 243, 0.1)';
    }
  }};
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const OrderItems = styled.div`
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
  border-top: 2px solid #f5f5f5;
  font-size: 1.3rem;
  color: #333;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  color: white;
  border: none;
  border-radius: 15px;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
`;

const EmptyIllustration = styled.div`
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #333;
`;

const EmptyDescription = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff4081, #ff6f61);
  color: white;
  border: none;
  border-radius: 25px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #f44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(239, 83, 80, 0.05) 100%);
  border-radius: 15px;
  margin: 20px 0;
  border: 1px solid rgba(244, 67, 54, 0.1);
`;

const RetryButton = styled.button`
  padding: 10px 25px;
  background: linear-gradient(135deg, #f44336, #e53935);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);

  &:hover {
    background: linear-gradient(135deg, #d32f2f, #c62828);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
  }
`;

// Enhanced Component
const Orders = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const statusFilters = [
    { key: 'all', label: 'All Orders', icon: FiPackage },
    { key: 'Processing', label: 'Processing', icon: FiClock },
    { key: 'Delivered', label: 'Delivered', icon: FiCheckCircle },
    { key: 'Cancelled', label: 'Cancelled', icon: FiXCircle }
  ];

  const fetchOrders = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (!token) return;
    
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError('');
      const response = await fetch(`http://localhost:8885/api/orders?page=${pageNum}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      if (pageNum === 1) {
        setOrders(data.orders || data);
      } else {
        setOrders(prev => [...prev, ...(data.orders || data)]);
      }
      
      setHasMore((data.orders || data).length === 10);
      
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchOrders(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Filter and search orders
  useEffect(() => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(term) ||
        order.items?.some(item => 
          item.name.toLowerCase().includes(term)
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  // Pull to refresh functionality (enhanced)
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const pullDistance = touchStartY - touchEndY;
      if (pullDistance > 100 && window.scrollY === 0) {
        handleRefresh();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle />;
      case 'Cancelled': return <FiXCircle />;
      case 'Processing': return <FiClock />;
      default: return <FiPackage />;
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error && orders.length === 0) {
    return (
      <OrdersContainer>
        <ErrorState>
          <FiXCircle size={48} style={{ marginBottom: '15px' }} />
          <h3>Unable to Load Orders</h3>
          <p>{error}</p>
          <RetryButton onClick={handleRefresh}>
            Try Again
          </RetryButton>
        </ErrorState>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersHeader>
        <BackButton onClick={handleBack}>
          <FiArrowLeft />
          Back
        </BackButton>
        <HeaderTitle>My Orders</HeaderTitle>
        <div style={{ width: '60px' }} /> {/* Spacer for symmetry */}
      </OrdersHeader>
      
      <ControlsContainer>
        <SearchBox>
          <input
            type="text"
            placeholder="Search orders or items..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch />
        </SearchBox>
        
        <FilterContainer>
          {statusFilters.map(({ key, label, icon: Icon }) => (
            <FilterButton
              key={key}
              active={statusFilter === key}
              onClick={() => handleStatusFilter(key)}
              className={statusFilter === key ? 'active' : ''}
            >
              <Icon />
              {label}
            </FilterButton>
          ))}
        </FilterContainer>
        
        <RefreshButton 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </ControlsContainer>

      {filteredOrders.length > 0 ? (
        <>
          <OrderGrid>
            {filteredOrders.map(order => (
              <OrderCard key={order._id} status={order.status}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderId>Order #{order.orderNumber}</OrderId>
                    <OrderDate>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </OrderDate>
                  </OrderInfo>
                  <OrderStatus status={order.status}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </OrderStatus>
                </OrderHeader>
                
                <OrderItems>
                  {order.items.map(item => (
                    <OrderItem key={item._id}>
                      <ItemName>
                        {item.name} × {item.quantity}
                      </ItemName>
                      <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                    </OrderItem>
                  ))}
                </OrderItems>
                
                <OrderTotal>Total: ₹{(order.total || 0).toFixed(2)}</OrderTotal>
              </OrderCard>
            ))}
          </OrderGrid>

          {hasMore && (
            <LoadMoreButton 
              onClick={handleLoadMore} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Orders'}
            </LoadMoreButton>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIllustration>
            <FiPackage />
          </EmptyIllustration>
          <EmptyTitle>No Orders Found</EmptyTitle>
          <EmptyDescription>
            {searchTerm || statusFilter !== 'all' 
              ? 'No orders match your current filters. Try adjusting your search or filters.'
              : "You haven't placed any orders yet. Start exploring our menu and place your first order!"}
          </EmptyDescription>
          {(searchTerm || statusFilter !== 'all') ? (
            <ActionButton onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </ActionButton>
          ) : (
            <ActionButton onClick={() => navigate('/menu')}>
              Explore Menu
            </ActionButton>
          )}
        </EmptyState>
      )}

      {error && orders.length > 0 && (
        <ErrorState>
          <p>{error}</p>
          <RetryButton onClick={handleRefresh}>
            Try Again
          </RetryButton>
        </ErrorState>
      )}
    </OrdersContainer>
  );
};

export default Orders;