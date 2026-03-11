// Header.jsx - Final Optimized Version
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { 
  FaHome, FaUtensils, FaGift, FaHandshake,
  FaUser, FaUserCircle, FaChevronDown, FaShoppingCart, 
  FaHeart, FaTachometerAlt 
} from "react-icons/fa";
import { FiLogOut, FiBell } from "react-icons/fi";
import { useAuth } from "../components/AuthContext";

// Memoized icons
const MemoizedIcons = {
  Home: memo(FaHome),
  Utensils: memo(FaUtensils),
  Gift: memo(FaGift),
  Handshake: memo(FaHandshake),
  User: memo(FaUser),
  UserCircle: memo(FaUserCircle),
  ChevronDown: memo(FaChevronDown),
  ShoppingCart: memo(FaShoppingCart),
  Heart: memo(FaHeart),
  Dashboard: memo(FaTachometerAlt),
  LogOut: memo(FiLogOut),
  Bell: memo(FiBell)
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// Styled Components
const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  color: #111827;
  padding: 18px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 14px 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.03);
  }
`;

const LogoText = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.8px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
  
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 40px;
  }

  li {
    margin: 0;
  }

  a.nav-link, button.nav-link {
    color: #4b5563;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    position: relative;
    padding: 8px 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: #111827;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover, &.active {
      color: #111827;
      &::after {
        width: 100%;
      }
    }

    svg {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ActionButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    background: #e5e7eb;
    color: #111827;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: white;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    animation: ${pulse} 2s infinite;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }
`;

const AuthButton = styled.button`
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(17, 24, 39, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 18px;
    font-size: 13px;
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border: none;
  border-radius: 24px;
  padding: 8px 16px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 8px;

  &:hover {
    background: #e5e7eb;
    color: #111827;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  svg:first-child {
    font-size: 18px;
    color: #111827;
  }

  svg:last-child {
    font-size: 14px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.open svg:last-child {
    transform: rotate(180deg);
  }

  .user-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 8px;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    justify-content: center;

    svg:last-child {
      display: none;
    }
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  background: white;
  min-width: 220px;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 1001;
  overflow: hidden;
  animation: ${fadeIn} 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const DropdownItem = styled(Link)`
  color: #4b5563;
  padding: 14px 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  svg {
    font-size: 16px;
    color: #111827;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  color: #4b5563;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  background: white;
  border: none;
  cursor: pointer;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  svg {
    font-size: 16px;
    color: #111827;
  }
`;

const MobileNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    padding: 10px 0 12px;
    box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
    z-index: 1001;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

const MobileNavItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  padding: 6px 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  max-width: 80px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover, &.active {
    color: #111827;
    transform: translateY(-2px);
  }

  svg {
    font-size: 20px;
    margin-bottom: 4px;
    color: #4b5563;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover svg, &.active svg {
    color: #111827;
    transform: scale(1.1);
  }

  .label {
    margin-top: 2px;
    white-space: nowrap;
  }
`;

// Component
const Header = memo(({ onOffersClick = () => {} }) => {
  const { user, logout, cart = [], favorites = [], unreadCount = 0 } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const cartItemCount = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cart]);

  const favoritesCount = React.useMemo(() => {
    return favorites.length;
  }, [favorites]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogoClick = useCallback(() => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const handleOffersClickLocal = useCallback(() => {
    navigate("/menu");
    setTimeout(() => {
      onOffersClick();
    }, 100);
  }, [navigate, onOffersClick]);

  const toggleDropdown = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setDropdownOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  }, [logout, navigate]);

  const handleAuthClick = useCallback(() => {
    navigate("/login", { state: { intendedPath: location.pathname } });
  }, [navigate, location.pathname]);

  const navigateTo = useCallback((path) => {
    navigate(path);
    setDropdownOpen(false);
  }, [navigate]);

  // Only show header on home page
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <>
      <HeaderWrapper>
        <Logo onClick={handleLogoClick}>
          <LogoText>Flavor Fleet</LogoText>
        </Logo>

        <Nav>
          <ul>
            <li>
              <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                <MemoizedIcons.Home />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/menu" className={`nav-link ${location.pathname === "/menu" ? "active" : ""}`}>
                <MemoizedIcons.Utensils />
                <span>Menu</span>
              </Link>
            </li>
            <li>
              <button 
                className="nav-link" 
                onClick={handleOffersClickLocal}
              >
                <MemoizedIcons.Gift />
                <span>Offers</span>
              </button>
            </li>
            <li>
              <Link to="/partner" className={`nav-link ${location.pathname === "/partner" ? "active" : ""}`}>
                <MemoizedIcons.Handshake />
                <span>Partner With Us</span>
              </Link>
            </li>
          </ul>
        </Nav>

        <ActionButtons>
          {user ? (
            <>
              <ActionButton onClick={() => navigateTo("/notifications")} title="Notifications">
                <MemoizedIcons.Bell />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </ActionButton>
              <ActionButton onClick={() => navigateTo("/favorites")} title="Favorites">
                <MemoizedIcons.Heart />
                {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
              </ActionButton>
              <ActionButton onClick={() => navigateTo("/cart")} title="Cart">
                <MemoizedIcons.ShoppingCart />
                {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
              </ActionButton>
              <ProfileDropdown ref={dropdownRef}>
                <ProfileButton 
                  onClick={toggleDropdown} 
                  className={dropdownOpen ? "open" : ""}
                  title={user.name || "Profile"}
                >
                  <MemoizedIcons.UserCircle />
                  <span className="user-name">{user.name?.split(' ')[0] || 'Profile'}</span>
                  <MemoizedIcons.ChevronDown />
                </ProfileButton>
                <DropdownContent $isOpen={dropdownOpen}>
                  <DropdownItem to="/profile">
                    <MemoizedIcons.UserCircle /> My Profile
                  </DropdownItem>
                  <DropdownItem to="/orders">
                    <MemoizedIcons.Utensils /> My Orders
                  </DropdownItem>
                  <DropdownItem to="/favorites">
                    <MemoizedIcons.Heart /> Favorites
                  </DropdownItem>
                  <DropdownItem to="/cart">
                    <MemoizedIcons.ShoppingCart /> Cart
                  </DropdownItem>
                  {user.role === "ADMIN" && (
                    <DropdownItem to="/admin/profile">
                      <MemoizedIcons.Dashboard /> Admin Panel
                    </DropdownItem>
                  )}
                  <LogoutButton onClick={handleLogout}>
                    <MemoizedIcons.LogOut /> Logout
                  </LogoutButton>
                </DropdownContent>
              </ProfileDropdown>
            </>
          ) : (
            <AuthButton onClick={handleAuthClick}>
              <MemoizedIcons.User /> Sign In
            </AuthButton>
          )}
        </ActionButtons>
      </HeaderWrapper>

      <MobileNav>
        <MobileNavItem 
          as={Link}
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          <MemoizedIcons.Home />
          <span className="label">Home</span>
        </MobileNavItem>
        <MobileNavItem 
          as={Link}
          to="/menu"
          className={location.pathname === "/menu" ? "active" : ""}
        >
          <MemoizedIcons.Utensils />
          <span className="label">Menu</span>
        </MobileNavItem>
        <MobileNavItem 
          onClick={handleOffersClickLocal}
        >
          <MemoizedIcons.Gift />
          <span className="label">Offers</span>
        </MobileNavItem>
        <MobileNavItem 
          as={Link}
          to="/partner"
          className={location.pathname === "/partner" ? "active" : ""}
        >
          <MemoizedIcons.Handshake />
          <span className="label">Partner</span>
        </MobileNavItem>
        {user ? (
          <MobileNavItem 
            as={Link}
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
          >
            <MemoizedIcons.UserCircle />
            <span className="label">Profile</span>
          </MobileNavItem>
        ) : (
          <MobileNavItem 
            onClick={handleAuthClick}
          >
            <MemoizedIcons.User />
            <span className="label">Login</span>
          </MobileNavItem>
        )}
      </MobileNav>
    </>
  );
});

Header.displayName = "Header";

export default Header;
