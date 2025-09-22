// Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaUtensils, FaGift, FaInfoCircle, FaPhone, FaUser, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../components/AuthContext";

const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  color: #333;
  padding: 15px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.3s ease;

  &.hidden {
    transform: translateY(-100%);
  }

  &:hover {
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(25px);
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    height: 65px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    max-width: 55%;
  }
`;

const LogoText = styled.span`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const LogoSubtext = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #777;
  letter-spacing: 1.2px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    margin: 0;
  }

  li {
    margin: 0 28px;
  }

  a.nav-link, .nav-link {
    color: #444;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    padding: 8px 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #ff6b6b, #ffd93d);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      transition: width 0.3s ease;
    }

    &:hover, &.active {
      color: #ff6b6b;
      &::after {
        width: 70%;
      }
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const BottomNav = styled.div`
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
    backdrop-filter: blur(15px);
    padding: 10px 0;
    box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.08);
    z-index: 1001;
    border-top: 1px solid rgba(0, 0, 0, 0.03);
    transition: transform 0.4s ease;

    &.hidden {
      transform: translateY(100%);
    }
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #444;
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.3s ease;

  &:hover, &.active {
    color: #ff6b6b;
    transform: scale(1.1);
  }

  svg {
    font-size: 24px;
    margin-bottom: 5px;
    color: #ff6b6b;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  &:hover svg {
    color: #ffd93d;
    transform: rotate(15deg);
  }
`;

const LoginButton = styled(Link)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    color: #ff6b6b;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 18px;
    border: 1px solid #ff6b6b;
    border-radius: 30px;
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);

    &:hover {
      background: #ff6b6b;
      color: #fff;
      box-shadow: 0 3px 15px rgba(255, 107, 107, 0.3);
      transform: translateY(-50%) scale(1.05);
    }
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #444;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.3s ease;

  &:hover {
    color: #ff6b6b;
  }

  svg:first-child {
    margin-right: 10px;
    font-size: 22px;
    color: #ff6b6b;
  }

  svg:last-child {
    margin-left: 6px;
    transition: transform 0.3s ease;
  }

  &.open svg:last-child {
    transform: rotate(180deg);
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 240px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1;
  border-radius: 15px;
  margin-top: 15px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;

  ${props => props.isOpen && `
    opacity: 1;
    transform: translateY(0);
  `}
`;

const DropdownItem = styled(Link)`
  color: #333;
  padding: 15px 22px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    background-color: rgba(255, 107, 107, 0.05);
    color: #ff6b6b;
    padding-left: 25px;
  }

  svg {
    margin-right: 12px;
    font-size: 18px;
    color: #ff6b6b;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  color: #333;
  padding: 15px 22px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 15px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 107, 107, 0.05);
    color: #ff6b6b;
    padding-left: 25px;
  }

  svg {
    margin-right: 12px;
    font-size: 18px;
    color: #ff6b6b;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const MobileProfileButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    color: #ff6b6b;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 18px;
    border: 1px solid #ff6b6b;
    border-radius: 30px;
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
    background: transparent;
    cursor: pointer;

    &:hover {
      background: #ff6b6b;
      color: #fff;
      box-shadow: 0 3px 15px rgba(255, 107, 107, 0.3);
      transform: translateY(-50%) scale(1.05);
    }

    svg {
      margin-right: 6px;
      color: #ff6b6b;
    }
  }
`;

const Header = ({ onOffersClick = () => {} }) => {
  const { user, logout } = useAuth();
  const isAboutPage = useMatch("/aboutus");
  const [headerHidden, setHeaderHidden] = useState(false);
  const [bottomNavHidden, setBottomNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAboutPage) {
      const handleScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY > lastScrollY && currentScrollY > 70) {
          setHeaderHidden(true);
          setBottomNavHidden(true);
        } else if (currentScrollY < lastScrollY) {
          setHeaderHidden(false);
          setBottomNavHidden(false);
        }

        setLastScrollY(currentScrollY);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isAboutPage, lastScrollY]);

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOffersClickLocal = () => {
    navigate("/menu");
    onOffersClick();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return !isAboutPage ? (
    <>
      <HeaderWrapper id="header" className={headerHidden ? "hidden" : ""}>
        <Logo onClick={handleLogoClick}>
          <LogoText>Flavor Fleet</LogoText>
          <LogoSubtext>A Culinary Voyage</LogoSubtext>
        </Logo>
        <Nav>
          <ul>
            <li><Link to="/" className="nav-link"><FaHome style={{ marginRight: '8px' }} /> Home</Link></li>
            <li><Link to="/menu" className="nav-link"><FaUtensils style={{ marginRight: '8px' }} /> Menu</Link></li>
            <li><span className="nav-link" onClick={handleOffersClickLocal}><FaGift style={{ marginRight: '8px' }} /> Offers</span></li>
            <li><Link to="/aboutus" className="nav-link"><FaInfoCircle style={{ marginRight: '8px' }} /> About</Link></li>
            <li><Link to="/contact-us" className="nav-link"><FaPhone style={{ marginRight: '8px' }} /> Contact</Link></li>
            {user ? (
              <li>
                <ProfileDropdown>
                  <ProfileButton onClick={toggleDropdown} className={dropdownOpen ? "open" : ""}>
                    <FaUserCircle />
                    Profile
                    <FaChevronDown />
                  </ProfileButton>
                  <DropdownContent isOpen={dropdownOpen}>
                    <DropdownItem to="/profile">
                      <FaUser /> My Profile
                    </DropdownItem>
                    <DropdownItem to="/orders">
                      <FaUtensils /> My Orders
                    </DropdownItem>
                    <LogoutButton onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </LogoutButton>
                  </DropdownContent>
                </ProfileDropdown>
              </li>
            ) : (
              <li><Link to="#" className="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal"><FaUser style={{ marginRight: '8px' }} /> Login</Link></li>
            )}
          </ul>
        </Nav>
        {user ? (
          <MobileProfileButton onClick={toggleDropdown}>
            <FaUserCircle /> Profile
          </MobileProfileButton>
        ) : (
          <LoginButton to="#" data-bs-toggle="modal" data-bs-target="#loginModal">
            <FaUser /> Login
          </LoginButton>
        )}
      </HeaderWrapper>
      <BottomNav id="bottom-nav" className={bottomNavHidden ? "hidden" : ""}>
        <NavItem to="/"><FaHome /> Home</NavItem>
        <NavItem to="/menu"><FaUtensils /> Menu</NavItem>
        <NavItem onClick={handleOffersClickLocal}><FaGift /> Offers</NavItem>
        <NavItem to="/aboutus"><FaInfoCircle /> About</NavItem>
        <NavItem to="/contact-us"><FaPhone /> Contact</NavItem>
      </BottomNav>
    </>
  ) : null;
};

export default Header;