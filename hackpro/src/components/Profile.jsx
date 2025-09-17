import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaUserCircle,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaStar,
  FaTrash,
  FaCartPlus,
  FaMapPin,
  FaLock,
  FaBell,
  FaArrowLeft,
  FaUtensils,
  FaUsers,
  FaPlus,
  FaSave,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartLine,
  FaEye,
  FaSun, 
  FaMoon,
  FaEyeSlash,
  FaTimes,
  FaHistory,
} from "react-icons/fa";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 102, 102, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// Styled Components
const ProfileWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => 
    theme.mode === 'dark' 
      ? 'linear-gradient(135deg, #2c2c2c, #1a1a1a, #2a2a2a, #333333)' 
      : 'linear-gradient(135deg, #ffecd2, #fce8e6, #e6f0fa, #f4e8ff)'
  };
  background-size: 300% 300%;
  animation: ${gradientBG} 12s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  position: relative;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : 'inherit'};
  transition: background 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 50%;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ffd700' : '#ff6666'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ffd700' : '#ff6666'};
  border-radius: 50%;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ffd700' : '#ff6666'};
    outline-offset: 2px;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  animation: ${fadeIn} 0.7s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProfileSidebar = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 40, 40, 0.8)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  position: sticky;
  top: 2rem;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
  }
`;

const Avatar = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'linear-gradient(135deg, #3a3a3a, #2a2a2a)' 
    : 'linear-gradient(135deg, #fff0f5, #e6f0fa)'
  };
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  border: 3px solid ${({ theme }) => theme.mode === 'dark' ? '#444' : '#fff5f5'};
  animation: ${bounce} 2.5s infinite ease-in-out;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  svg {
    font-size: 4rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff9999'};
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)'
  };
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(80, 80, 80, 0.9)' 
      : 'rgba(255, 255, 255, 1)'
    };
  }

  svg {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  }
`;

const UserName = styled.h2`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.7rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  text-align: center;
`;

const UserEmail = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ffb3b3' : '#ff9999'};
  font-size: 0.95rem;
  margin-bottom: 1rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserMemberSince = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const NotificationBell = styled.div`
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.mode === 'dark' ? '#ffb3b3' : '#ff9999'};
  }

  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)'
  };
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;
  animation: ${slideIn} 0.3s ease-out;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
`;

const NotificationItem = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 180, 180, 0.1)' 
      : 'rgba(255, 180, 180, 0.2)'
    };
  }

  &:last-child {
    border-bottom: none;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .notification-title {
    font-weight: 600;
  }

  .notification-time {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  }
`;

const NavMenu = styled.nav`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.6rem;
`;

const NavLink = styled.button.attrs((props) => ({
  $active: props.active,
  'aria-current': props.active ? 'page' : undefined,
}))`
  width: 100%;
  background: ${({ $active, theme }) => 
    $active 
      ? theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.2)' 
        : 'rgba(255, 255, 255, 0.3)' 
      : 'transparent'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 255, 255, 0.25)'
    };
    transform: translateX(4px);
  }

  svg {
    margin-right: 0.7rem;
    font-size: 1.2rem;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }
`;

const ProfileContent = styled.main`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 40, 40, 0.8)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileTitle = styled.h1`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.9rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Button = styled.button.attrs((props) => ({
  $secondary: props.secondary,
}))`
  background: ${({ $secondary, theme }) => 
    $secondary 
      ? 'transparent' 
      : theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.2)' 
        : 'rgba(255, 255, 255, 0.3)'
  };
  color: ${({ theme }) => 
    theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: ${({ $secondary, theme }) => 
    $secondary 
      ? `1px solid ${theme.mode === 'dark' ? '#ff9999' : '#ff6666'}` 
      : 'none'
  };
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $secondary, theme }) => 
      $secondary 
        ? theme.mode === 'dark' 
          ? 'rgba(255, 153, 153, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)' 
        : theme.mode === 'dark' 
          ? 'rgba(255, 153, 153, 0.3)' 
          : 'rgba(255, 255, 255, 0.4)'
  };
  transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  svg {
    margin-right: ${({ iconOnly }) => (iconOnly ? "0" : "0.5rem")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProfileSection = styled.section`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.5)'
  };
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  svg {
    margin-right: 0.6rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.5)' 
    : 'rgba(255, 255, 255, 0.15)'
  };
  border-radius: 12px;
  padding: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 0.1)'
  };

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(60, 60, 60, 0.6)' 
      : 'rgba(255, 255, 255, 0.25)'
    };
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  }
`;

const AdminCard = styled(Card)`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 100, 100, 0.2)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff7777' : '#ff6666'};
  animation: ${glow} 2s infinite ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 100, 100, 0.3)' 
      : 'rgba(255, 180, 180, 0.4)'
    };
  }
`;

const InfoLabel = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InfoValue = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OrderCard = styled(Card)`
  margin-bottom: 1.2rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.95rem;
`;

const OrderStatus = styled.div`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${(props) => {
    if (props.status === "Delivered") {
      return props.theme.mode === 'dark' ? "rgba(40, 167, 69, 0.3)" : "rgba(40, 167, 69, 0.2)";
    } else if (props.status === "Pending") {
      return props.theme.mode === 'dark' ? "rgba(255, 193, 7, 0.3)" : "rgba(255, 193, 7, 0.2)";
    } else {
      return props.theme.mode === 'dark' ? "rgba(220, 53, 69, 0.3)" : "rgba(220, 53, 69, 0.2)";
    }
  }};
  color: ${(props) =>
    props.status === "Delivered" ? "#28a745" : props.status === "Pending" ? "#ffc107" : "#dc3545"};
`;

const OrderDetails = styled.div`
  display: flex;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const OrderImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.5)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  svg {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff9999'};
  }

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
    height: 120px;
  }
`;

const OrderInfo = styled.div`
  flex-grow: 1;
`;

const OrderTitle = styled.h4`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
`;

const OrderMeta = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const OrderMetaContent = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.4rem;
  }
`;

const OrderItems = styled.div`
  margin-top: 0.5rem;
`;

const OrderItem = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const FavoriteItem = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FavoriteImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.5)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  svg {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff9999'};
  }

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
    height: 120px;
  }
`;

const FavoriteContent = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const FavoriteTitle = styled.h4`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
`;

const FavoriteMeta = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

const ModalOverlay = styled.div.attrs((props) => ({
  $isOpen: props.isOpen,
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' ? '#2a2a2a' : '#fff'};
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 600px; // Increased for better usability
  animation: ${slideIn} 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 102, 102, 0.1)'
    };
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormInput = styled.input`
  padding: 0.7rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#fff'};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 5px rgba(255, 102, 102, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.mode === 'dark' ? '#888' : '#ccc'};
  }
`;

const FormSelect = styled.select`
  padding: 0.7rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#fff'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 5px rgba(255, 102, 102, 0.3);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.7rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#fff'};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 5px rgba(255, 102, 102, 0.3);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button.attrs((props) => ({
  $active: props.active,
}))`
  background: ${({ $active, theme }) => 
    $active 
      ? theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.3)' 
        : 'rgba(255, 255, 255, 0.3)' 
      : 'transparent'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 255, 255, 0.2)'
    };
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }
`;

const AddressCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AddressActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const AddressText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  margin: 0;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  border-top: 4px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 50%;
  animation: spin 2s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.2rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 100, 100, 0.2)' 
    : 'rgba(255, 150, 150, 0.2)'
  };
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  overflow-x: auto;
  display: block;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const AdminTableHeader = styled.th`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 100, 100, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  padding: 0.8rem;
  text-align: left;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const AdminTableRow = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.1)'
    };
  }
`;

const AdminTableCell = styled.td`
  padding: 0.8rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const AdminSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : 'rgba(255, 255, 255, 0.2)'};
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  }
`;

const AdminFormInput = styled(FormInput)`
  padding: 0.7rem;
  font-size: 0.9rem;
`;

const MessagesLoadingContainer = styled(LoadingContainer)`
  padding: 1rem;
`;

const MessagesErrorMessage = styled(ErrorMessage)`
  margin-top: 1rem;
`;

const ConfirmationModalContent = styled(ModalContent)`
  max-width: 350px;
  text-align: center;
`;

const ConfirmationText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SearchInput = styled(FormInput)`
  flex-grow: 1;
`;

const SkeletonCard = styled(Card)`
  animation: ${shimmer} 2s infinite linear;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'linear-gradient(90deg, #333 0%, #444 50%, #333 100%)' 
    : 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)'
  };
  background-size: 1000px 100%;
  height: ${({ height }) => height || '100px'};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  background: ${({ active, theme }) => 
    active 
      ? theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.3)' 
        : 'rgba(255, 102, 102, 0.3)' 
      : 'transparent'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 5px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 102, 102, 0.1)'
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PasswordStrengthMeter = styled.div`
  height: 5px;
  border-radius: 3px;
  margin-top: 0.5rem;
  background: ${({ strength }) => {
    if (strength === 'weak') return '#ff4757';
    if (strength === 'medium') return '#ffa502';
    if (strength === 'strong') return '#2ed573';
    return '#ddd';
  }};
  width: ${({ strength }) => {
    if (strength === 'weak') return '33%';
    if (strength === 'medium') return '66%';
    if (strength === 'strong') return '100%';
    return '0%';
  }};
  transition: width 0.3s ease, background 0.3s ease;
`;

const ProgressBar = styled.div`
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#f0f0f0'};
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease;
`;

const BulkActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ExportButton = styled(Button)`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 167, 69, 0.2)' 
    : 'rgba(40, 167, 69, 0.1)'
  };
  color: #28a745;
  border: 1px solid #28a745;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(40, 167, 69, 0.3)' 
      : 'rgba(40, 167, 69, 0.2)'
    };
  }
`;

const AnalyticsCard = styled(Card)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const AnalyticsItem = styled.div`
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
`;

const AnalyticsValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  margin-bottom: 0.5rem;
`;

const AnalyticsLabel = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.9rem;
`;

const ReviewContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
`;

const Star = styled.span`
  color: ${({ filled, theme }) => filled 
    ? '#ffd700' 
    : theme.mode === 'dark' ? '#555' : '#ddd'
  };
`;

const ReviewText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.9rem;
  margin: 0;
`;

const NotificationPanel = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`;

const NotificationTypeIndicator = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${({ type }) => {
    if (type === 'order') return 'rgba(255, 193, 7, 0.3)';
    if (type === 'promotion') return 'rgba(40, 167, 69, 0.3)';
    if (type === 'system') return 'rgba(220, 53, 69, 0.3)';
    return 'rgba(0, 0, 0, 0.1)';
  }};
  color: ${({ type }) => {
    if (type === 'order') return '#ffc107';
    if (type === 'promotion') return '#28a745';
    if (type === 'system') return '#dc3545';
    return '#000';
  }};
`;

const UserListContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  padding: 0.5rem;
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#fff'};
  margin-bottom: 1rem;
`;

const UserCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  cursor: pointer;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#444' : '#eee'};
  &:last-child {
    border-bottom: none;
  }
`;

const SelectAllLabel = styled(UserCheckboxLabel)`
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ddd'};
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
`;

const SchedulerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  padding: 1rem;
  background: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#fff'};
  margin-bottom: 1rem;
`;

const SchedulerNote = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  margin-top: 0.5rem;
`;

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children, ariaLabel, isDirty = false }) => {
  const modalRef = useRef();

  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <ModalClose onClick={handleClose} aria-label="Close modal">
            <FaTimes />
          </ModalClose>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  isDirty: PropTypes.bool,
};

// Skeleton Loading Components
const ProfileSkeleton = () => (
  <>
    <ProfileSection>
      <SkeletonCard height="120px" />
    </ProfileSection>
    <ProfileSection>
      <SectionTitle>
        <FaMapPin /> Delivery Addresses
      </SectionTitle>
      <InfoGrid>
        <SkeletonCard height="150px" />
        <SkeletonCard height="150px" />
      </InfoGrid>
    </ProfileSection>
    <ProfileSection>
      <SectionTitle>My Stats</SectionTitle>
      <StatsContainer>
        <SkeletonCard height="100px" />
        <SkeletonCard height="100px" />
        <SkeletonCard height="100px" />
      </StatsContainer>
    </ProfileSection>
  </>
);

const OrdersSkeleton = () => (
  <ProfileSection>
    <FilterContainer>
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
      <SkeletonCard height="40px" style={{ width: '80px' }} />
    </FilterContainer>
    <SkeletonCard height="200px" />
    <SkeletonCard height="200px" />
  </ProfileSection>
);

const AdminSkeleton = () => (
  <>
    <ProfileSection>
      <SkeletonCard height="40px" style={{ width: '200px', marginBottom: '1rem' }} />
      <SkeletonCard height="300px" />
    </ProfileSection>
    <ProfileSection>
      <SkeletonCard height="40px" style={{ width: '200px', marginBottom: '1rem' }} />
      <SkeletonCard height="300px" />
    </ProfileSection>
  </>
);

// Theme Context
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom Hooks
const useProfileData = () => {
  const {
    user,
    token,
    getProfile,
    favorites,
    orders,
    fetchOrders,
    addToCart,
    removeFromFavorites,
    updateProfile,
    fetchContactMessages,
    deleteContactMessage,
    contactMessages,
    fetchAllUsers,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  // Sync localFavorites with favorites from useAuth
  useEffect(() => {
    setLocalFavorites(favorites || []);
  }, [favorites]);

  const fetchProfileAndData = useCallback(async () => {
    if (!token) {
      setError("Please log in to view your profile");
      setLoading(false);
      setOrdersLoading(false);
      return;
    }

    try {
      setLoading(true);
      setOrdersLoading(true);
      const timeout = (promise, time) =>
        Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), time)
          ),
        ]);
      const [profile] = await Promise.all([
        timeout(getProfile(), 5000),
        timeout(fetchOrders(), 5000),
      ]);
      if (profile) {
        setProfileData(profile);
      } else {
        throw new Error("Failed to load profile data");
      }
    } catch (err) {
      setError(`Failed to load profile: ${err.message || "An unexpected error occurred"}`);
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  }, [token, getProfile, fetchOrders]);

  const fetchAdminData = useCallback(async () => {
    try {
      const [usersData, ordersData, menuData, categoriesData] = await Promise.all([
        fetchAllUsers().catch(() => []),
        fetchAllOrders().catch(() => []),
        fetchAdminMenu().catch(() => []),
        fetchCategories().catch(() => []),
      ]);
      
      // Normalize roles for users
      const normalizedUsers = usersData.map(u => ({
        ...u,
        role: u.role?.replace("ROLE_", "").toUpperCase() || "USER",
      }));
      
      return {
        users: normalizedUsers || [],
        orders: ordersData || [],
        menuItems: menuData || [],
        categories: categoriesData || [],
      };
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      return {
        users: [],
        orders: [],
        menuItems: [],
        categories: [],
      };
    }
  }, [fetchAllUsers, fetchAllOrders, fetchAdminMenu, fetchCategories]);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      await fetchContactMessages();
    } catch (err) {
      setMessagesError(`Failed to fetch contact messages: ${err.message || "An unexpected error occurred"}`);
      toast.error("Failed to fetch contact messages");
    } finally {
      setMessagesLoading(false);
    }
  }, [fetchContactMessages]);

  return {
    user,
    token,
    profileData,
    setProfileData,
    error,
    loading,
    ordersLoading,
    orders,
    localFavorites,
    setLocalFavorites,
    messagesLoading,
    messagesError,
    contactMessages,
    fetchProfileAndData,
    fetchAdminData,
    fetchMessages,
    addToCart,
    removeFromFavorites,
    updateProfile,
    deleteContactMessage,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

const usePagination = (data, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    paginate,
  };
};

// Profile Component
const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth(); // Destructure logout from useAuth directly in Profile
  
  const {
    user,
    token,
    profileData,
    setProfileData,
    error,
    loading,
    ordersLoading,
    orders,
    localFavorites,
    setLocalFavorites,
    messagesLoading,
    messagesError,
    contactMessages,
    fetchProfileAndData,
    fetchAdminData,
    fetchMessages,
    addToCart,
    removeFromFavorites,
    updateProfile,
    deleteContactMessage,
    updateUser,
    deleteUser,
    fetchAllOrders,
    updateOrderStatus,
    fetchMenu,
    fetchAdminMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProfileData();

  if (!user) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <LoadingContainer>
          <Spinner theme={{ mode: theme }} />
          <LoadingText theme={{ mode: theme }}>Please log in to view your profile...</LoadingText>
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  // API URL helpers
  const isDev = window.location.origin.includes('localhost');
  const getApiUrl = useCallback((path) => {
    return isDev ? `http://localhost:8885${path}` : path;
  }, [isDev]);

  // State Management
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isNotificationSettingsModalOpen, setIsNotificationSettingsModalOpen] = useState(false);
  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", id: null });
  const [editAddress, setEditAddress] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profilePicture: "" });
  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    categoryId: "",
    type: "Veg",
  });
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrderUpdates: true,
    emailPromotions: true,
    desktopNotifications: false,
  });
  const [notifications, setNotifications] = useState([]); 
  const [unreadCount, setUnreadCount] = useState(0); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("All");
  const [notificationForm, setNotificationForm] = useState({ userIds: [], title: '', content: '', imageUrl: '', type: 'promotion', scheduleDate: null });
  const [categories, setCategories] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [historyNotifications, setHistoryNotifications] = useState([]);

  // Calculate profile completion
  useEffect(() => {
    if (profileData) {
      let completion = 0;
      if (profileData.name) completion += 25;
      if (profileData.email) completion += 25;
      if (profileData.profilePicture) completion += 25;
      if (profileData.addresses && profileData.addresses.length > 0) completion += 25;
      setProfileCompletion(completion);
    }
  }, [profileData]);

  // Password strength calculator
  const calculatePasswordStrength = useCallback((password) => {
    if (password.length === 0) return "";
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 1) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  }, []);

  useEffect(() => {
    const strength = calculatePasswordStrength(passwordForm.newPassword);
    setPasswordStrength(strength);
  }, [passwordForm.newPassword, calculatePasswordStrength]);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Normalize role from backend
  const normalizeRole = (role) => {
    if (!role) return "USER";
    return role.replace("ROLE_", "").toUpperCase();
  };

  // Format role for backend
  const formatRoleForBackend = (role) => {
    return `ROLE_${role.toUpperCase()}`;
  };

  // Fetch Notifications with SSE (replaced polling/WebSocket)
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(getApiUrl('/api/notifications'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newNotifications = response.data.content || [];
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [token, getApiUrl]);

  // Setup SSE for real-time notifications
  useEffect(() => {
    if (!token) return;

    fetchNotifications(); // Initial fetch

    const eventSource = new EventSource(`${getApiUrl('/api/notifications/sse')}?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(`New notification: ${newNotification.title}`);
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      // Optional: Fallback to polling if SSE fails
      const fallbackInterval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(fallbackInterval);
    };

    return () => {
      eventSource.close();
    };
  }, [token, getApiUrl, fetchNotifications]);

  // Fetch Profile, Admin Data, Categories, History
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchProfileAndData();
      
      if (normalizeRole(user?.role) === "ADMIN") {
        const adminData = await fetchAdminData();
        if (isMounted) {
          setAllUsers(adminData.users);
          setAllOrders(adminData.orders);
          setMenuItems(adminData.menuItems);
          setCategories(adminData.categories || []);
          const pending = adminData.orders.filter((o) => o.status === "Pending");
          setPendingOrders(pending);
        }

        // Fetch notification history
        try {
          const response = await axios.get(getApiUrl('/api/admin/notifications-history'), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHistoryNotifications(response.data || []);
        } catch (err) {
          console.error("Failed to fetch notification history:", err);
          toast.error("Failed to fetch notification history");
        }
      }
    };

    loadData();

    // Request desktop notification permission
    if ("Notification" in window && notificationSettings.desktopNotifications) {
      Notification.requestPermission();
    }

    return () => {
      isMounted = false;
    };
  }, [user, fetchProfileAndData, fetchAdminData, token, notificationSettings.desktopNotifications, getApiUrl]);

  // Separate useEffect for setting notification preferences
  useEffect(() => {
    if (profileData) {
      setNotificationSettings({
        emailOrderUpdates: profileData.emailOrderUpdates || true,
        emailPromotions: profileData.emailPromotions || true,
        desktopNotifications: profileData.desktopNotifications || false,
      });
    }
  }, [profileData]);

  // Fetch Contact Messages when the tab is opened
  useEffect(() => {
    if (normalizeRole(user?.role) === "ADMIN" && activeTab === "contact-messages") {
      fetchMessages();
    }
  }, [user, activeTab, fetchMessages]);

  // Fetch categories when admin tab is selected
  useEffect(() => {
    if (normalizeRole(user?.role) === "ADMIN" && activeTab === "admin") {
      const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories || []);
      };
      loadCategories();
    }
  }, [user, activeTab, fetchCategories]);

  // Filter and pagination logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      orderFilter === "All" ? true : order.status === orderFilter
    );
  }, [orders, orderFilter]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems;
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery]);

  const filteredContactMessages = useMemo(() => {
    if (!searchQuery) return contactMessages;
    return contactMessages.filter(message => 
      message.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contactMessages, searchQuery]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (notificationFilter === "Unread") return !n.read;
      if (notificationFilter === "Orders") return n.type === 'order';
      if (notificationFilter === "Promotions") return n.type === 'promotion';
      return true;
    });
  }, [notifications, notificationFilter]);

  const filteredHistoryNotifications = useMemo(() => {
    if (!searchQuery) return historyNotifications;
    return historyNotifications.filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [historyNotifications, searchQuery]);

  // Pagination logic
  const usersPagination = usePagination(filteredUsers, 5);
  const menuItemsPagination = usePagination(filteredMenuItems, 5);
  const contactMessagesPagination = usePagination(filteredContactMessages, 5);
  const notificationsPagination = usePagination(filteredNotifications, 10);
  const historyPagination = usePagination(filteredHistoryNotifications, 10);

  // Handlers
  const handleLogout = () => {
    logout();
    toast.dismiss();
    toast.success("Logged out successfully!", {
      toastId: "logout-unique",
      style: {
        background: theme.mode === 'dark' ? "#333" : "#fff0f0",
        color: theme.mode === 'dark' ? "#ff9999" : "#ff6666",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      },
    });
    navigate("/login");
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfilePicture(base64Image);
        try {
          const result = await updateProfile({ ...formData, profilePicture: base64Image });
          if (result.success) {
            setProfileData((prev) => ({ ...prev, profilePicture: base64Image }));
            setFormData((prev) => ({ ...prev, profilePicture: base64Image }));
            toast.success("Profile picture updated successfully!");
          } else {
            throw new Error(result.error || "Failed to update profile picture");
          }
        } catch (err) {
          toast.error(`Failed to update profile picture: ${err.message || "An unexpected error occurred"}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!/^[A-Za-z\s]{2,50}$/.test(formData.name)) {
      toast.error("Name must be between 2 and 50 characters and contain only letters and spaces");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setProfileData((prev) => ({ ...prev, ...formData }));
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error(`Failed to update profile: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const { addressLine1, city, pincode } = addressForm;
    if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Address Line 1, City, and Pincode are required");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be a 6-digit number");
      return;
    }
    try {
      if (editAddress) {
        const result = await updateAddress(editAddress.id, addressForm);
        if (result.success) {
          setProfileData((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr) =>
              addr.id === editAddress.id ? result.address : addr
            ),
          }));
          toast.success("Address updated successfully!");
        } else {
          throw new Error(result.error || "Failed to update address");
        }
      } else {
        const result = await addAddress(addressForm);
        if (result.success) {
          setProfileData((prev) => ({
            ...prev,
            addresses: [...(prev.addresses || []), result.address],
          }));
          toast.success("Address added successfully!");
        } else {
          throw new Error(result.error || "Failed to add address");
        }
      }
      setIsAddressModalOpen(false);
      setAddressForm({ addressLine1: "", addressLine2: "", city: "", pincode: "" });
      setEditAddress(null);
    } catch (err) {
      toast.error(`Failed to save address: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleDeleteAddress = async (id) => {
    setDeleteTarget({ type: "address", id });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget.type === "address") {
        const result = await deleteAddress(deleteTarget.id);
        if (result.success) {
          setProfileData((prev) => ({
            ...prev,
            addresses: prev.addresses.filter((addr) => addr.id !== deleteTarget.id),
          }));
          toast.success("Address deleted successfully!");
        } else {
          throw new Error(result.error || "Failed to delete address");
        }
      } else if (deleteTarget.type === "user") {
        const result = await deleteUser(deleteTarget.id);
        if (result.success) {
          setAllUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
          setAllOrders((prev) => prev.filter((o) => o.userId !== deleteTarget.id));
          toast.success("User and associated data deleted successfully!");
        } else {
          throw new Error(result.error || "Failed to delete user");
        }
      } else if (deleteTarget.type === "menuItem") {
        const result = await deleteMenuItem(deleteTarget.id);
        if (result.success) {
          setMenuItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
          toast.success("Menu item deleted successfully!");
        } else {
          throw new Error(result.error || "Failed to delete menu item");
        }
      } else if (deleteTarget.type === "contactMessage") {
        const result = await deleteContactMessage(deleteTarget.id);
        if (result.success) {
          toast.success("Contact message deleted successfully!");
        } else {
          throw new Error(result.error || "Failed to delete contact message");
        }
      } else if (deleteTarget.type === "category") {
        const result = await deleteCategory(deleteTarget.id);
        if (result.success) {
          setCategories((prev) => prev.filter((cat) => cat.id !== deleteTarget.id));
          toast.success("Category deleted successfully!");
        } else {
          throw new Error(result.error || "Failed to delete category");
        }
      }
    } catch (err) {
      toast.error(`Failed to delete ${deleteTarget.type}: ${err.message || "An unexpected error occurred"}`);
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setDeleteTarget({ type: "", id: null });
    }
  };

  const handleReorder = async (order) => {
    try {
      if (Array.isArray(order.items) && order.items.length > 0) {
        for (const item of order.items) {
          await addToCart({
            id: item.itemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });
        }
        toast.success("Items added to cart for reorder!");
        navigate("/cart");
      } else {
        toast.error("No items found in this order to reorder.");
      }
    } catch (err) {
      toast.error(`Failed to reorder: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(getApiUrl(`/api/notifications/${notificationId}/read`), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Failed to mark as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post(getApiUrl('/api/notifications/mark-all-read'), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(getApiUrl(`/api/notifications/${notificationId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter(n => n.id !== notificationId));
      setUnreadCount((prev) => prev - (prev > 0 ? 1 : 0));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(getApiUrl('/api/notifications/clear-all'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications:", err);
      toast.error("Failed to clear notifications");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const result = await updateUser(userId, { role: formatRoleForBackend(newRole) });
      if (result.success) {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success("User role updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update user role");
      }
    } catch (err) {
      toast.error(`Failed to update user role: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    setDeleteTarget({ type: "user", id: userId });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setPendingOrders((prev) =>
          prev.filter((o) => o.id !== orderId || newStatus === "Pending")
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success("Order status updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update order status");
      }
    } catch (err) {
      toast.error(`Failed to update order status: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const openMenuItemModal = () => {
    if (categories.length === 0) {
      toast.error("No categories available. Please add a category first.");
      setIsCategoryModalOpen(true);
      return;
    }
    setEditMenuItem(null);
    setMenuItemForm({
      name: "",
      price: "",
      description: "",
      image: "",
      categoryId: categories[0]?.id || "",
      type: "Veg",
    });
    setIsMenuItemModalOpen(true);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuItemForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (isNaN(menuItemForm.price) || Number(menuItemForm.price) <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (!menuItemForm.categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!menuItemForm.type) {
      toast.error("Type (Veg/Non-Veg) is required");
      return;
    }
    try {
      const payload = {
        name: menuItemForm.name,
        price: Number(menuItemForm.price),
        description: menuItemForm.description,
        image: menuItemForm.image,
        categoryId: Number(menuItemForm.categoryId),
        type: menuItemForm.type,
      };
      let result;
      if (editMenuItem) {
        result = await updateMenuItem(editMenuItem.id, payload);
      } else {
        result = await addMenuItem(payload);
      }
      if (result.success) {
        const updatedMenu = await fetchAdminMenu();
        setMenuItems(updatedMenu || []);
        setIsMenuItemModalOpen(false);
        setMenuItemForm({
          name: "",
          price: "",
          description: "",
          image: "",
          categoryId: categories[0]?.id || "",
          type: "Veg",
        });
        setEditMenuItem(null);
        toast.success(editMenuItem ? "Menu item updated successfully!" : "Menu item added successfully!");
      } else {
        throw new Error(result.error || "Failed to save menu item");
      }
    } catch (err) {
      toast.error(`Failed to save menu item: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleEditMenuItem = (item) => {
    setEditMenuItem(item);
    setMenuItemForm({
      name: item.name || "",
      price: item.price ? item.price.toString() : "",
      description: item.description || "",
      image: item.image || "",
      categoryId: item.categoryId || item.category?.id || categories[0]?.id,
      type: item.type || "Veg",
    });
    setIsMenuItemModalOpen(true);
  };

  const handleDeleteMenuItem = (id) => {
    setDeleteTarget({ type: "menuItem", id });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      let result;
      if (editCategory) {
        result = await updateCategory(editCategory.id, { name: categoryForm.name });
        if (result.success) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editCategory.id ? { ...cat, name: categoryForm.name } : cat
            )
          );
          toast.success("Category updated successfully!");
        } else {
          throw new Error(result.error || "Failed to update category");
        }
      } else {
        result = await addCategory({ name: categoryForm.name });
        if (result.success) {
          setCategories((prev) => [...prev, result.category]);
          toast.success("Category added successfully!");
        } else {
          throw new Error(result.error || "Failed to add category");
        }
      }
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: "" });
      setEditCategory(null);
    } catch (err) {
      toast.error(`Failed to save category: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setCategoryForm({ name: category.name });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    setDeleteTarget({ type: "category", id });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleRemoveFromFavorites = async (itemId) => {
    try {
      await removeFromFavorites(itemId);
      setLocalFavorites((prev) => prev.filter((item) => item.itemId !== itemId));
      toast.success("Item removed from favorites!");
    } catch (err) {
      toast.error(`Failed to remove from favorites: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleDeleteContactMessage = (id) => {
    setDeleteTarget({ type: "contactMessage", id });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleFetchContactMessages = async () => {
    fetchMessages();
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to perform this action");
      return;
    }

    try {
      if (action === "delete") {
        for (const id of selectedItems) {
          await deleteUser(id);
        }
        setAllUsers((prev) => prev.filter((user) => !selectedItems.includes(user.id)));
        setSelectedItems([]);
        toast.success("Selected users deleted successfully!");
      }
    } catch (err) {
      toast.error(`Failed to perform bulk action: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(usersPagination.currentItems.map(user => user.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(",")
    ).join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: profileData,
      orders: orders,
      favorites: localFavorites,
      addresses: profileData?.addresses || []
    };
    exportToCSV([dataToExport], 'user-data');
  };

  const handleNotificationSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(getApiUrl('/api/notifications/preferences'), notificationSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification settings updated successfully!");
      setIsNotificationSettingsModalOpen(false);
      // Re-request permission if desktop notifications enabled
      if (notificationSettings.desktopNotifications && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } catch (err) {
      console.error("Failed to update notification settings:", err);
      toast.error(`Failed to update notification settings: ${err.message || "An unexpected error occurred"}`);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationForm.title.trim() || !notificationForm.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      const payload = {
        ...notificationForm,
        scheduleDate: notificationForm.scheduleDate ? notificationForm.scheduleDate.toISOString() : null,
      };
      await axios.post(getApiUrl('/api/admin/notifications'), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification sent/scheduled successfully!");
      setIsSendNotificationModalOpen(false);
      setNotificationForm({ userIds: [], title: '', content: '', imageUrl: '', type: 'promotion', scheduleDate: null });
      // Refresh history
      const response = await axios.get(getApiUrl('/api/admin/notifications-history'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoryNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to send/schedule notification:", err);
      toast.error("Failed to send/schedule notification");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordStrength === "weak") {
      toast.error("Password is too weak. Please use a stronger password");
      return;
    }
    try {
      const result = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (result.success) {
        toast.success("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast.error(`Failed to update password: ${error.message || "An unexpected error occurred"}`);
    }
  };

  if (loading) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <LoadingContainer>
          <Spinner theme={{ mode: theme }} />
          <LoadingText theme={{ mode: theme }}>Loading your lovely profile...</LoadingText>
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  if (error) {
    return (
      <ProfileWrapper theme={{ mode: theme }}>
        <ProfileContainer>
          <ProfileContent theme={{ mode: theme }}>
            <ErrorMessage theme={{ mode: theme }}>{error}</ErrorMessage>
          </ProfileContent>
        </ProfileContainer>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper theme={{ mode: theme }}>
      <BackButton onClick={handleGoBack} aria-label="Go back to homepage" theme={{ mode: theme }}>
        <FaArrowLeft />
      </BackButton>
      <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme" theme={{ mode: theme }}>
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </ThemeToggle>
      <ProfileContainer>
        <ProfileSidebar theme={{ mode: theme }}>
          <Avatar theme={{ mode: theme }}>
            {profilePicture || profileData?.profilePicture ? (
              <img src={profilePicture || profileData.profilePicture} alt="Profile" onError={(e) => { e.target.src = 'fallback-image-url'; }} />
            ) : (
              <FaUserCircle />
            )}
            <AvatarLabel htmlFor="profile-pic-upload" theme={{ mode: theme }}>
              <FaEdit />
            </AvatarLabel>
          </Avatar>
          <AvatarInput
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            aria-label="Upload profile picture"
          />
          <UserName theme={{ mode: theme }}>{profileData?.name || user?.name || "User"}</UserName>
          <UserEmail theme={{ mode: theme }}>
            {profileData?.email || user?.email || "No email provided"}
          </UserEmail>
          <UserMemberSince theme={{ mode: theme }}>
            <FiCalendar /> Since{" "}
            {new Date().toLocaleDateString("default", {
              month: "short",
              year: "numeric",
            })}
          </UserMemberSince>
          {/* Unified Notification Bell */}
          <div style={{ position: "relative" }}>
            <NotificationBell
              onClick={toggleNotifications}
              aria-label={`View notifications (${unreadCount + pendingOrders.length} unread/pending)`}
              aria-expanded={showNotifications}
              theme={{ mode: theme }}
            >
              <FaBell />
              {unreadCount + pendingOrders.length > 0 && <span>{unreadCount + pendingOrders.length}</span>}
            </NotificationBell>
            {showNotifications && (
              <NotificationDropdown theme={{ mode: theme }}>
                {/* User Notifications */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      theme={{ mode: theme }}
                    >
                      {notification.type && <NotificationTypeIndicator type={notification.type}>{notification.type}</NotificationTypeIndicator>}
                      {notification.title && <div className="notification-title">{notification.title}</div>}
                      <div dangerouslySetInnerHTML={{ __html: notification.content }} />
                      {notification.imageUrl && <img src={notification.imageUrl} alt="Notification image" />}
                      <div className="notification-time">
                        {new Date(notification.sentAt).toLocaleString()}
                      </div>
                      <Button $secondary onClick={() => handleDeleteNotification(notification.id)} theme={{ mode: theme }}>
                        <FaTrash />
                      </Button>
                    </NotificationItem>
                  ))
                ) : (
                  <NotificationItem theme={{ mode: theme }}>No user notifications</NotificationItem>
                )}
                {/* Admin Pending Orders */}
                {normalizeRole(user?.role) === "ADMIN" && (
                  <>
                    <div style={{ padding: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Pending Orders</div>
                    {pendingOrders.length > 0 ? (
                      pendingOrders.map((order) => (
                        <NotificationItem
                          key={order.id}
                          onClick={() => handleViewOrder(order)}
                          theme={{ mode: theme }}
                        >
                          Order #{order.id} - Pending (User: {order.userName || "Unknown"})
                        </NotificationItem>
                      ))
                    ) : (
                      <NotificationItem theme={{ mode: theme }}>No pending orders</NotificationItem>
                    )}
                  </>
                )}
              </NotificationDropdown>
            )}
          </div>
          <NavMenu>
            <NavItem>
              <NavLink
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                aria-current={activeTab === "profile" ? "page" : undefined}
                theme={{ mode: theme }}
              >
                <FaUserCircle /> Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                aria-current={activeTab === "orders" ? "page" : undefined}
                theme={{ mode: theme }}
              >
                <FaShoppingBag /> Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "favorites"}
                onClick={() => setActiveTab("favorites")}
                aria-current={activeTab === "favorites" ? "page" : undefined}
                theme={{ mode: theme }}
              >
                <FaHeart /> Favorites
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
                aria-current={activeTab === "notifications" ? "page" : undefined}
                theme={{ mode: theme }}
              >
                <FaBell /> Notifications
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                aria-current={activeTab === "settings" ? "page" : undefined}
                theme={{ mode: theme }}
              >
                <FaCog /> Settings
              </NavLink>
            </NavItem>
            {normalizeRole(user?.role) === "ADMIN" && (
              <>
                <NavItem>
                  <NavLink
                    active={activeTab === "admin"}
                    onClick={() => setActiveTab("admin")}
                    aria-current={activeTab === "admin" ? "page" : undefined}
                    theme={{ mode: theme }}
                  >
                    <FaUtensils /> Admin Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === "contact-messages"}
                    onClick={() => setActiveTab("contact-messages")}
                    aria-current={activeTab === "contact-messages" ? "page" : undefined}
                    theme={{ mode: theme }}
                  >
                    <FaEnvelope /> Contact Messages
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === "notification-history"}
                    onClick={() => setActiveTab("notification-history")}
                    aria-current={activeTab === "notification-history" ? "page" : undefined}
                    theme={{ mode: theme }}
                  >
                    <FaHistory /> Notification History
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItem>
              <NavLink onClick={handleLogout} aria-label="Logout" theme={{ mode: theme }}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </NavItem>
          </NavMenu>
        </ProfileSidebar>

        <ProfileContent theme={{ mode: theme }}>
          <ProfileHeader>
            <ProfileTitle theme={{ mode: theme }}>
              {activeTab === "profile" && <FaUserCircle />}
              {activeTab === "orders" && <FaShoppingBag />}
              {activeTab === "favorites" && <FaHeart />}
              {activeTab === "notifications" && <FaBell />}
              {activeTab === "settings" && <FaCog />}
              {activeTab === "admin" && <FaUtensils />}
              {activeTab === "contact-messages" && <FaEnvelope />}
              {activeTab === "notification-history" && <FaHistory />}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "orders" && "My Orders"}
              {activeTab === "favorites" && "Favorite Treats"}
              {activeTab === "notifications" && "Notifications Center"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "admin" && "Admin Profile"}
              {activeTab === "contact-messages" && "Contact Messages"}
              {activeTab === "notification-history" && "Notification History"}
            </ProfileTitle>
            {activeTab === "profile" && (
              <Button onClick={() => setIsEditModalOpen(true)} theme={{ mode: theme }}>
                <FaEdit /> Edit Profile
              </Button>
            )}
            {activeTab === "contact-messages" && (
              <Button onClick={handleFetchContactMessages} theme={{ mode: theme }}>
                Refresh Messages
              </Button>
            )}
            {activeTab === "admin" && normalizeRole(user?.role) === "ADMIN" && (
              <Button onClick={() => setIsSendNotificationModalOpen(true)} theme={{ mode: theme }}>
                <FaEnvelope /> Send Notification
              </Button>
            )}
          </ProfileHeader>

          {activeTab === "profile" && (
            <>
              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>Personal Info</SectionTitle>
                <InfoGrid>
                  <Card theme={{ mode: theme }}>
                    <InfoLabel theme={{ mode: theme }}>Name</InfoLabel>
                    <InfoValue theme={{ mode: theme }}>
                      {profileData?.name || user?.name || "User"}
                    </InfoValue>
                  </Card>
                  <Card theme={{ mode: theme }}>
                    <InfoLabel theme={{ mode: theme }}>Email</InfoLabel>
                    <InfoValue theme={{ mode: theme }}>
                      {profileData?.email || user?.email || "No email provided"}
                    </InfoValue>
                  </Card>
                  <Card theme={{ mode: theme }}>
                    <InfoLabel theme={{ mode: theme }}>Member Since</InfoLabel>
                    <InfoValue theme={{ mode: theme }}>
                      {new Date().toLocaleDateString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </InfoValue>
                  </Card>
                  <Card theme={{ mode: theme }}>
                    <InfoLabel theme={{ mode: theme }}>Role</InfoLabel>
                    <InfoValue theme={{ mode: theme }}>{normalizeRole(user?.role) || "User"}</InfoValue>
                  </Card>
                </InfoGrid>
              </ProfileSection>
              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaMapPin /> Delivery Addresses
                  <Button
                    $secondary
                    onClick={() => {
                      setEditAddress(null);
                      setAddressForm({
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        pincode: "",
                      });
                      setIsAddressModalOpen(true);
                    }}
                    style={{ marginLeft: "1rem", padding: "0.4rem 0.8rem" }}
                    theme={{ mode: theme }}
                  >
                    Add Address
                  </Button>
                </SectionTitle>
                {profileData?.addresses?.length === 0 ? (
                  <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No addresses saved. Add one now!</InfoValue>
                  </Card>
                ) : (
                  <InfoGrid>
                    {profileData?.addresses?.map((address) => (
                      <AddressCard key={address.id} theme={{ mode: theme }}>
                        <AddressText theme={{ mode: theme }}>{address.addressLine1}</AddressText>
                        {address.addressLine2 && (
                          <AddressText theme={{ mode: theme }}>{address.addressLine2}</AddressText>
                        )}
                        <AddressText theme={{ mode: theme }}>{address.city}</AddressText>
                        <AddressText theme={{ mode: theme }}>{address.pincode}</AddressText>
                        <AddressActions>
                          <Button
                            $secondary
                            onClick={() => {
                              setEditAddress(address);
                              setAddressForm({
                                addressLine1: address.addressLine1,
                                addressLine2: address.addressLine2 || "",
                                city: address.city,
                                pincode: address.pincode,
                              });
                              setIsAddressModalOpen(true);
                            }}
                            theme={{ mode: theme }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            $secondary
                            onClick={() => handleDeleteAddress(address.id)}
                            theme={{ mode: theme }}
                          >
                            <FaTrash />
                          </Button>
                        </AddressActions>
                      </AddressCard>
                    ))}
                  </InfoGrid>
                )}
              </ProfileSection>
              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>My Stats</SectionTitle>
                <StatsContainer>
                  <StatCard theme={{ mode: theme }}>
                    <StatNumber theme={{ mode: theme }}>
                      <FaShoppingBag /> {profileData?.ordersCount || orders.length || 0}
                    </StatNumber>
                    <StatLabel theme={{ mode: theme }}>Orders</StatLabel>
                  </StatCard>
                  <StatCard theme={{ mode: theme }}>
                    <StatNumber theme={{ mode: theme }}>
                      <FaHeart />{" "}
                      {profileData?.favoriteItemsCount || localFavorites.length || 0}
                    </StatNumber>
                    <StatLabel theme={{ mode: theme }}>Favorites</StatLabel>
                  </StatCard>
                  <StatCard theme={{ mode: theme }}>
                    <StatNumber theme={{ mode: theme }}>
                      <FaStar /> 4.8
                    </StatNumber>
                    <StatLabel theme={{ mode: theme }}>Avg Rating</StatLabel>
                  </StatCard>
                  {normalizeRole(user?.role) === "ADMIN" && (
                    <StatCard theme={{ mode: theme }}>
                      <StatNumber theme={{ mode: theme }}>
                        <FaUtensils /> {menuItems.length || 0}
                      </StatNumber>
                      <StatLabel theme={{ mode: theme }}>Menu Items</StatLabel>
                    </StatCard>
                  )}
                </StatsContainer>
              </ProfileSection>
              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>Profile Completion</SectionTitle>
                <Card theme={{ mode: theme }}>
                  <InfoLabel theme={{ mode: theme }}>Complete your profile for better experience</InfoLabel>
                  <ProgressBar theme={{ mode: theme }}>
                    <ProgressFill progress={profileCompletion} theme={{ mode: theme }} />
                  </ProgressBar>
                  <InfoValue theme={{ mode: theme }}>{profileCompletion}% Complete</InfoValue>
                  {profileCompletion < 100 && (
                    <Button 
                      $secondary 
                      onClick={() => setIsEditModalOpen(true)}
                      style={{ marginTop: '1rem' }}
                      theme={{ mode: theme }}
                    >
                      Complete Profile
                    </Button>
                  )}
                </Card>
              </ProfileSection>
            </>
          )}

          {activeTab === "orders" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaShoppingBag /> Recent Orders
              </SectionTitle>
              <FilterContainer>
                {["All", "Delivered", "Pending", "Cancelled"].map((status) => (
                  <FilterButton
                    key={status}
                    active={orderFilter === status}
                    onClick={() => setOrderFilter(status)}
                    aria-pressed={orderFilter === status}
                    theme={{ mode: theme }}
                  >
                    {status}
                  </FilterButton>
                ))}
              </FilterContainer>
              {ordersLoading ? (
                <OrdersSkeleton />
              ) : filteredOrders.length === 0 ? (
                <Card theme={{ mode: theme }}>
                  <InfoValue theme={{ mode: theme }}>
                    {orderFilter === "All"
                      ? "No orders yet. Start shopping!"
                      : `No ${orderFilter.toLowerCase()} orders.`}
                  </InfoValue>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} theme={{ mode: theme }}>
                    <OrderHeader>
                      <OrderId theme={{ mode: theme }}>#{order.id}</OrderId>
                      <OrderStatus status={order.status} theme={{ mode: theme }}>{order.status}</OrderStatus>
                    </OrderHeader>
                    <OrderDetails>
                      <OrderImage theme={{ mode: theme }}>
                        {order.items?.[0]?.image ? (
                          <img src={order.items[0].image} alt={order.items[0].name} onError={(e) => { e.target.src = 'fallback-image-url.jpg'; }} />
                        ) : (
                          <FaShoppingBag />
                        )}
                      </OrderImage>
                      <OrderInfo>
                        <OrderTitle theme={{ mode: theme }}>Order by {order.userName || "User"}</OrderTitle>
                        <OrderItems>
                          {Array.isArray(order.items) && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <OrderItem key={item.itemId || item.id} theme={{ mode: theme }}>
                                {item.name} - {item.quantity}x ($
                                {(item.price * item.quantity).toFixed(2)})
                              </OrderItem>
                            ))
                          ) : (
                            <OrderItem theme={{ mode: theme }}>No items available</OrderItem>
                          )}
                        </OrderItems>
                        <OrderMeta theme={{ mode: theme }}>
                          <OrderMetaContent>
                            <FiMapPin />{" "}
                            {order.addressLine1
                              ? `${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ""}, ${order.city}, ${order.pincode}`
                              : "No address provided"}
                          </OrderMetaContent>
                          <OrderMetaContent>
                            Total: ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                          </OrderMetaContent>
                          <OrderMetaContent>
                            Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}
                          </OrderMetaContent>
                        </OrderMeta>
                        <Button
                          $secondary
                          onClick={() => handleReorder(order)}
                          style={{ marginTop: "0.5rem" }}
                          theme={{ mode: theme }}
                        >
                          <FaCartPlus /> Reorder
                        </Button>
                      </OrderInfo>
                    </OrderDetails>
                  </OrderCard>
                ))
              )}
            </ProfileSection>
          )}

          {activeTab === "favorites" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaHeart /> Favorite Treats
              </SectionTitle>
              {localFavorites.length === 0 ? (
                <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No favorites yet. Add some from the menu!</InfoValue>
                </Card>
              ) : (
                localFavorites.map((favorite) => (
                  <FavoriteItem key={favorite.id} theme={{ mode: theme }}>
                    <FavoriteImage theme={{ mode: theme }}>
                      {favorite.image ? (
                        <img src={favorite.image} alt={favorite.name} onError={(e) => { e.target.src = 'fallback-image-url.jpg'; }} />
                      ) : (
                        <FaHeart />
                      )}
                    </FavoriteImage>
                    <FavoriteContent>
                      <FavoriteTitle theme={{ mode: theme }}>{favorite.name}</FavoriteTitle>
                      <FavoriteMeta theme={{ mode: theme }}>
                        <FaStar /> ${favorite.price ? favorite.price.toFixed(2) : "0.00"}
                      </FavoriteMeta>
                      <div>
                        <Button
                          $secondary
                          onClick={() => addToCart(favorite)}
                          style={{ marginRight: "0.5rem" }}
                          theme={{ mode: theme }}
                        >
                          <FaCartPlus /> Add to Cart
                        </Button>
                        <Button
                          $secondary
                          onClick={() => handleRemoveFromFavorites(favorite.itemId)}
                          theme={{ mode: theme }}
                        >
                          <FaTrash /> Remove
                        </Button>
                      </div>
                    </FavoriteContent>
                  </FavoriteItem>
                ))
              )}
            </ProfileSection>
          )}

          {activeTab === "notifications" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaBell /> Notifications Center
              </SectionTitle>
              <FilterContainer>
                {["All", "Unread", "Orders", "Promotions"].map((filter) => (
                  <FilterButton
                    key={filter}
                    active={notificationFilter === filter}
                    onClick={() => setNotificationFilter(filter)}
                    aria-pressed={notificationFilter === filter}
                    theme={{ mode: theme }}
                  >
                    {filter}
                  </FilterButton>
                ))}
              </FilterContainer>
              <BulkActions>
                <Button $secondary onClick={handleMarkAllRead} theme={{ mode: theme }}>
                  Mark All Read
                </Button>
                <Button $secondary onClick={handleClearAll} theme={{ mode: theme }}>
                  Clear All
                </Button>
              </BulkActions>
              <NotificationPanel theme={{ mode: theme }}>
                {filteredNotifications.length > 0 ? (
                  notificationsPagination.currentItems.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      theme={{ mode: theme }}
                    >
                      {notification.type && <NotificationTypeIndicator type={notification.type}>{notification.type}</NotificationTypeIndicator>}
                      {notification.title && <div className="notification-title">{notification.title}</div>}
                      <div dangerouslySetInnerHTML={{ __html: notification.content }} />
                      {notification.imageUrl && <img src={notification.imageUrl} alt="Notification image" />}
                      <div className="notification-time">
                        {new Date(notification.sentAt).toLocaleString()}
                      </div>
                      {!notification.read && (
                        <Button $secondary onClick={() => handleMarkAsRead(notification.id)} theme={{ mode: theme }}>
                          Mark Read
                        </Button>
                      )}
                      <Button $secondary onClick={() => handleDeleteNotification(notification.id)} theme={{ mode: theme }}>
                        <FaTrash /> Delete
                      </Button>
                    </NotificationItem>
                  ))
                ) : (
                  <NotificationItem theme={{ mode: theme }}>No notifications in this category</NotificationItem>
                )}
              </NotificationPanel>
              <PaginationContainer>
                <PaginationButton
                  onClick={() => notificationsPagination.paginate(notificationsPagination.currentPage - 1)}
                  disabled={notificationsPagination.currentPage === 1}
                  theme={{ mode: theme }}
                >
                  Previous
                </PaginationButton>
                {Array.from({ length: notificationsPagination.totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationButton
                    key={page}
                    active={notificationsPagination.currentPage === page}
                    onClick={() => notificationsPagination.paginate(page)}
                    theme={{ mode: theme }}
                  >
                    {page}
                  </PaginationButton>
                ))}
                <PaginationButton
                  onClick={() => notificationsPagination.paginate(notificationsPagination.currentPage + 1)}
                  disabled={notificationsPagination.currentPage === notificationsPagination.totalPages}
                  theme={{ mode: theme }}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            </ProfileSection>
          )}

          {activeTab === "settings" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaCog /> Account Settings
              </SectionTitle>
              <InfoGrid>
                <Card theme={{ mode: theme }}>
                  <InfoLabel theme={{ mode: theme }}>Password</InfoLabel>
                  <InfoValue theme={{ mode: theme }}>
                    <Button
                      $secondary
                      onClick={() => setIsPasswordModalOpen(true)}
                      theme={{ mode: theme }}
                    >
                      <FaLock /> Change Password
                    </Button>
                  </InfoValue>
                </Card>
                <Card theme={{ mode: theme }}>
                  <InfoLabel theme={{ mode: theme }}>Notifications</InfoLabel>
                  <InfoValue theme={{ mode: theme }}>
                    <Button 
                      $secondary 
                      onClick={() => setIsNotificationSettingsModalOpen(true)}
                      theme={{ mode: theme }}
                    >
                      <FaBell /> Manage Alerts
                    </Button>
                  </InfoValue>
                </Card>
                <Card theme={{ mode: theme }}>
                  <InfoLabel theme={{ mode: theme }}>Theme</InfoLabel>
                  <InfoValue theme={{ mode: theme }}>
                    <Button $secondary onClick={toggleTheme} theme={{ mode: theme }}>
                      {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </Button>
                  </InfoValue>
                </Card>
                <Card theme={{ mode: theme }}>
                  <InfoLabel theme={{ mode: theme }}>Data Export</InfoLabel>
                  <InfoValue theme={{ mode: theme }}>
                    <Button $secondary onClick={handleExportData} theme={{ mode: theme }}>
                      <FaDownload /> Export Data
                    </Button>
                  </InfoValue>
                </Card>
              </InfoGrid>
            </ProfileSection>
          )}

          {activeTab === "admin" && normalizeRole(user?.role) === "ADMIN" && (
            <>
              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaUsers /> User Management
                </SectionTitle>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Search users..."
                    onChange={handleSearchChange}
                    theme={{ mode: theme }}
                  />
                  <Button theme={{ mode: theme }}>
                    <FaSearch /> Search
                  </Button>
                </SearchContainer>
                <BulkActions>
                  <Button 
                    $secondary 
                    onClick={() => handleBulkAction("delete")}
                    disabled={selectedItems.length === 0}
                    theme={{ mode: theme }}
                  >
                    <FaTrash /> Delete Selected ({selectedItems.length})
                  </Button>
                  <ExportButton 
                    onClick={() => exportToCSV(allUsers, "users")}
                    theme={{ mode: theme }}
                  >
                    <FaDownload /> Export CSV
                  </ExportButton>
                </BulkActions>
                {allUsers.length === 0 ? (
                  <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No users found.</InfoValue>
                  </Card>
                ) : (
                  <>
                    <AdminTable>
                      <thead>
                        <tr>
                          <AdminTableHeader theme={{ mode: theme }}>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedItems.length === usersPagination.currentItems.length && usersPagination.currentItems.length > 0}
                              aria-label="Select all users"
                            />
                          </AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Name</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Email</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Role</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Actions</AdminTableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {usersPagination.currentItems.map((u) => (
                          <AdminTableRow key={u.id}>
                            <AdminTableCell theme={{ mode: theme }}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(u.id)}
                                onChange={() => handleSelectItem(u.id)}
                                aria-label={`Select ${u.name}`}
                              />
                            </AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{u.id}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{u.name || "User"}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{u.email || "No email"}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>
                              <AdminSelect
                                value={normalizeRole(u.role)}
                                onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                theme={{ mode: theme }}
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                              </AdminSelect>
                            </AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>
                              <Button
                                $secondary
                                onClick={() => handleUpdateUserRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                                style={{ marginRight: "0.5rem" }}
                                theme={{ mode: theme }}
                              >
                                Toggle Role
                              </Button>
                              <Button
                                $secondary
                                onClick={() => handleDeleteUser(u.id)}
                                theme={{ mode: theme }}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </AdminTableCell>
                          </AdminTableRow>
                        ))}
                      </tbody>
                    </AdminTable>
                    <PaginationContainer>
                      <PaginationButton
                        onClick={() => usersPagination.paginate(usersPagination.currentPage - 1)}
                        disabled={usersPagination.currentPage === 1}
                        theme={{ mode: theme }}
                      >
                        Previous
                      </PaginationButton>
                      {Array.from({ length: usersPagination.totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationButton
                          key={page}
                          active={usersPagination.currentPage === page}
                          onClick={() => usersPagination.paginate(page)}
                          theme={{ mode: theme }}
                        >
                          {page}
                        </PaginationButton>
                      ))}
                      <PaginationButton
                        onClick={() => usersPagination.paginate(usersPagination.currentPage + 1)}
                        disabled={usersPagination.currentPage === usersPagination.totalPages}
                        theme={{ mode: theme }}
                      >
                        Next
                      </PaginationButton>
                    </PaginationContainer>
                  </>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaShoppingBag /> Order Management
                </SectionTitle>
                {ordersLoading ? (
                  <LoadingContainer>
                    <Spinner theme={{ mode: theme }} />
                    <LoadingText theme={{ mode: theme }}>Loading orders...</LoadingText>
                  </LoadingContainer>
                ) : allOrders.length === 0 ? (
                  <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No orders found.</InfoValue>
                  </Card>
                ) : (
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>User</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Address</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Total</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Status</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Placed On</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map((order) => (
                        <AdminTableRow key={order.id}>
                          <AdminTableCell theme={{ mode: theme }}>{order.id}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {order.userName || "User"} ({order.userEmail || "No email"})
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {order.addressLine1
                              ? `${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ""}, ${order.city}, ${order.pincode}`
                              : "No address"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            <AdminSelect
                              value={order.status || "Pending"}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              theme={{ mode: theme }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </AdminSelect>
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            <Button
                              $secondary
                              onClick={() => handleViewOrder(order)}
                              theme={{ mode: theme }}
                            >
                              View
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaUtensils /> Menu Management
                  <Button
                    $secondary
                    onClick={openMenuItemModal}
                    style={{ marginLeft: "1rem", padding: "0.4rem 0.8rem" }}
                    theme={{ mode: theme }}
                  >
                    <FaPlus /> Add Menu Item
                  </Button>
                </SectionTitle>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Search menu items..."
                    onChange={handleSearchChange}
                    theme={{ mode: theme }}
                  />
                  <Button theme={{ mode: theme }}>
                    <FaSearch /> Search
                  </Button>
                </SearchContainer>
                {menuItems.length === 0 ? (
                  <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No menu items found. Add one now!</InfoValue>
                  </Card>
                ) : (
                  <>
                    <AdminTable>
                      <thead>
                        <tr>
                          <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Name</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Price</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Category</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Type</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Description</AdminTableHeader>
                          <AdminTableHeader theme={{ mode: theme }}>Actions</AdminTableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItemsPagination.currentItems.map((item) => (
                          <AdminTableRow key={item.id}>
                            <AdminTableCell theme={{ mode: theme }}>{item.id}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{item.name}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>
                              ${item.price ? item.price.toFixed(2) : "0.00"}
                            </AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{item.categoryName || item.category?.name || "Unknown"}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{item.type || "Veg"}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>{item.description || "No description"}</AdminTableCell>
                            <AdminTableCell theme={{ mode: theme }}>
                              <Button
                                $secondary
                                onClick={() => handleEditMenuItem(item)}
                                style={{ marginRight: "0.5rem" }}
                                theme={{ mode: theme }}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                $secondary
                                onClick={() => handleDeleteMenuItem(item.id)}
                                theme={{ mode: theme }}
                              >
                                <FaTrash />
                              </Button>
                            </AdminTableCell>
                          </AdminTableRow>
                        ))}
                      </tbody>
                    </AdminTable>
                    <PaginationContainer>
                      <PaginationButton
                        onClick={() => menuItemsPagination.paginate(menuItemsPagination.currentPage - 1)}
                        disabled={menuItemsPagination.currentPage === 1}
                        theme={{ mode: theme }}
                      >
                        Previous
                      </PaginationButton>
                      {Array.from({ length: menuItemsPagination.totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationButton
                          key={page}
                          active={menuItemsPagination.currentPage === page}
                          onClick={() => menuItemsPagination.paginate(page)}
                          theme={{ mode: theme }}
                        >
                          {page}
                        </PaginationButton>
                      ))}
                      <PaginationButton
                        onClick={() => menuItemsPagination.paginate(menuItemsPagination.currentPage + 1)}
                        disabled={menuItemsPagination.currentPage === menuItemsPagination.totalPages}
                        theme={{ mode: theme }}
                      >
                        Next
                      </PaginationButton>
                    </PaginationContainer>
                  </>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaUtensils /> Category Management
                  <Button
                    $secondary
                    onClick={() => {
                      setEditCategory(null);
                      setCategoryForm({ name: "" });
                      setIsCategoryModalOpen(true);
                    }}
                    style={{ marginLeft: "1rem", padding: "0.4rem 0.8rem" }}
                    theme={{ mode: theme }}
                  >
                    <FaPlus /> Add Category
                  </Button>
                </SectionTitle>
                {categories.length === 0 ? (
                  <Card theme={{ mode: theme }}>
                    <InfoValue theme={{ mode: theme }}>No categories found. Add one now!</InfoValue>
                  </Card>
                ) : (
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Name</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <AdminTableRow key={category.id}>
                          <AdminTableCell theme={{ mode: theme }}>{category.id}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>{category.name || "Unknown"}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            <Button
                              $secondary
                              onClick={() => handleEditCategory(category)}
                              style={{ marginRight: "0.5rem" }}
                              theme={{ mode: theme }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              $secondary
                              onClick={() => handleDeleteCategory(category.id)}
                              theme={{ mode: theme }}
                            >
                              <FaTrash />
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle theme={{ mode: theme }}>
                  <FaChartLine /> Analytics Dashboard
                </SectionTitle>
                <AnalyticsCard theme={{ mode: theme }}>
                  <AnalyticsItem theme={{ mode: theme }}>
                    <AnalyticsValue theme={{ mode: theme }}>{allUsers.length}</AnalyticsValue>
                    <AnalyticsLabel theme={{ mode: theme }}>Total Users</AnalyticsLabel>
                  </AnalyticsItem>
                  <AnalyticsItem theme={{ mode: theme }}>
                    <AnalyticsValue theme={{ mode: theme }}>{allOrders.length}</AnalyticsValue>
                    <AnalyticsLabel theme={{ mode: theme }}>Total Orders</AnalyticsLabel>
                  </AnalyticsItem>
                  <AnalyticsItem theme={{ mode: theme }}>
                    <AnalyticsValue theme={{ mode: theme }}>{menuItems.length}</AnalyticsValue>
                    <AnalyticsLabel theme={{ mode: theme }}>Menu Items</AnalyticsLabel>
                  </AnalyticsItem>
                  <AnalyticsItem theme={{ mode: theme }}>
                    <AnalyticsValue theme={{ mode: theme }}>
                      ${allOrders.reduce((total, order) => total + (order.totalPrice || 0), 0).toFixed(2)}
                    </AnalyticsValue>
                    <AnalyticsLabel theme={{ mode: theme }}>Total Revenue</AnalyticsLabel>
                  </AnalyticsItem>
                </AnalyticsCard>
              </ProfileSection>
            </>
          )}

          {activeTab === "contact-messages" && normalizeRole(user?.role) === "ADMIN" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaEnvelope /> Contact Messages
              </SectionTitle>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Search messages..."
                  onChange={handleSearchChange}
                  theme={{ mode: theme }}
                />
                <Button theme={{ mode: theme }}>
                  <FaSearch /> Search
                </Button>
              </SearchContainer>
              {messagesLoading ? (
                <MessagesLoadingContainer>
                  <Spinner theme={{ mode: theme }} />
                  <LoadingText theme={{ mode: theme }}>Loading messages...</LoadingText>
                </MessagesLoadingContainer>
              ) : messagesError ? (
                <MessagesErrorMessage theme={{ mode: theme }}>{messagesError}</MessagesErrorMessage>
              ) : contactMessages.length === 0 ? (
                <Card theme={{ mode: theme }}>
                  <InfoValue theme={{ mode: theme }}>No contact messages found.</InfoValue>
                </Card>
              ) : (
                <>
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Name</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Email</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Message</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Received At</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Actions</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessagesPagination.currentItems.map((message) => (
                        <AdminTableRow key={message.id}>
                          <AdminTableCell theme={{ mode: theme }}>{message.id}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {`${message.firstName || ""} ${message.lastName || ""}`.trim() || "Unknown"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>{message.email || "No email"}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>{message.message || "No message"}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {message.createdAt ? new Date(message.createdAt).toLocaleString() : "Unknown"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            <Button
                              $secondary
                              onClick={() => handleDeleteContactMessage(message.id)}
                              theme={{ mode: theme }}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                  <PaginationContainer>
                    <PaginationButton
                      onClick={() => contactMessagesPagination.paginate(contactMessagesPagination.currentPage - 1)}
                      disabled={contactMessagesPagination.currentPage === 1}
                      theme={{ mode: theme }}
                    >
                      Previous
                    </PaginationButton>
                    {Array.from({ length: contactMessagesPagination.totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationButton
                        key={page}
                        active={contactMessagesPagination.currentPage === page}
                        onClick={() => contactMessagesPagination.paginate(page)}
                        theme={{ mode: theme }}
                      >
                        {page}
                      </PaginationButton>
                    ))}
                    <PaginationButton
                      onClick={() => contactMessagesPagination.paginate(contactMessagesPagination.currentPage + 1)}
                      disabled={contactMessagesPagination.currentPage === contactMessagesPagination.totalPages}
                      theme={{ mode: theme }}
                    >
                      Next
                    </PaginationButton>
                  </PaginationContainer>
                </>
              )}
            </ProfileSection>
          )}

          {activeTab === "notification-history" && normalizeRole(user?.role) === "ADMIN" && (
            <ProfileSection>
              <SectionTitle theme={{ mode: theme }}>
                <FaHistory /> Notification History
              </SectionTitle>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Search history..."
                  onChange={handleSearchChange}
                  theme={{ mode: theme }}
                />
                <Button theme={{ mode: theme }}>
                  <FaSearch /> Search
                </Button>
              </SearchContainer>
              {historyNotifications.length === 0 ? (
                <Card theme={{ mode: theme }}>
                  <InfoValue theme={{ mode: theme }}>No notification history available.</InfoValue>
                </Card>
              ) : (
                <>
                  <AdminTable>
                    <thead>
                      <tr>
                        <AdminTableHeader theme={{ mode: theme }}>ID</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Title</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Type</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Sent At</AdminTableHeader>
                        <AdminTableHeader theme={{ mode: theme }}>Recipients</AdminTableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {historyPagination.currentItems.map((n) => (
                        <AdminTableRow key={n.id}>
                          <AdminTableCell theme={{ mode: theme }}>{n.id}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>{n.title}</AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            <NotificationTypeIndicator type={n.type}>{n.type}</NotificationTypeIndicator>
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {n.sentAt ? new Date(n.sentAt).toLocaleString() : n.scheduleDate ? `Scheduled: ${new Date(n.scheduleDate).toLocaleString()}` : "Unknown"}
                          </AdminTableCell>
                          <AdminTableCell theme={{ mode: theme }}>
                            {n.userIds && n.userIds.length > 0 ? `${n.userIds.length} users` : "All users"}
                          </AdminTableCell>
                        </AdminTableRow>
                      ))}
                    </tbody>
                  </AdminTable>
                  <PaginationContainer>
                    <PaginationButton
                      onClick={() => historyPagination.paginate(historyPagination.currentPage - 1)}
                      disabled={historyPagination.currentPage === 1}
                      theme={{ mode: theme }}
                    >
                      Previous
                    </PaginationButton>
                    {Array.from({ length: historyPagination.totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationButton
                        key={page}
                        active={historyPagination.currentPage === page}
                        onClick={() => historyPagination.paginate(page)}
                        theme={{ mode: theme }}
                      >
                        {page}
                      </PaginationButton>
                    ))}
                    <PaginationButton
                      onClick={() => historyPagination.paginate(historyPagination.currentPage + 1)}
                      disabled={historyPagination.currentPage === historyPagination.totalPages}
                      theme={{ mode: theme }}
                    >
                      Next
                    </PaginationButton>
                  </PaginationContainer>
                </>
              )}
            </ProfileSection>
          )}
        </ProfileContent>
      </ProfileContainer>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setFormData({ name: "", email: "", profilePicture: "" });
          setIsEditModalOpen(false);
        }}
        title="Edit Profile"
        ariaLabel="Edit profile information"
        isDirty={formData.name || formData.email || formData.profilePicture}
      >
        <Form onSubmit={handleProfileUpdate}>
          <FormGroup>
            <FormLabel htmlFor="name" theme={{ mode: theme }}>Name</FormLabel>
            <FormInput
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="email" theme={{ mode: theme }}>Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Save Changes
          </Button>
        </Form>
      </Modal>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setAddressForm({ addressLine1: "", addressLine2: "", city: "", pincode: "" });
          setIsAddressModalOpen(false);
          setEditAddress(null);
        }}
        title={editAddress ? "Edit Address" : "Add New Address"}
        ariaLabel={editAddress ? "Edit address form" : "Add new address form"}
        isDirty={addressForm.addressLine1 || addressForm.addressLine2 || addressForm.city || addressForm.pincode}
      >
        <Form onSubmit={handleAddressSubmit}>
          <FormGroup>
            <FormLabel htmlFor="addressLine1" theme={{ mode: theme }}>Address Line 1</FormLabel>
            <FormInput
              id="addressLine1"
              type="text"
              value={addressForm.addressLine1}
              onChange={(e) =>
                setAddressForm({ ...addressForm, addressLine1: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="addressLine2" theme={{ mode: theme }}>Address Line 2 (Optional)</FormLabel>
            <FormInput
              id="addressLine2"
              type="text"
              value={addressForm.addressLine2}
              onChange={(e) =>
                setAddressForm({ ...addressForm, addressLine2: e.target.value })
              }
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="city" theme={{ mode: theme }}>City</FormLabel>
            <FormInput
              id="city"
              type="text"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="pincode" theme={{ mode: theme }}>Pincode</FormLabel>
            <FormInput
              id="pincode"
              type="text"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, pincode: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Save Address
          </Button>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setIsPasswordModalOpen(false);
        }}
        title="Change Password"
        ariaLabel="Change password form"
        isDirty={passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword}
      >
        <Form onSubmit={handlePasswordUpdate}>
          <FormGroup>
            <FormLabel htmlFor="currentPassword" theme={{ mode: theme }}>Current Password</FormLabel>
            <FormInput
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="newPassword" theme={{ mode: theme }}>
              New Password
              {passwordForm.newPassword && (
                <span>Strength: {passwordStrength}</span>
              )}
            </FormLabel>
            <FormInput
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
            {passwordForm.newPassword && (
              <PasswordStrengthMeter strength={passwordStrength} />
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="confirmPassword" theme={{ mode: theme }}>Confirm New Password</FormLabel>
            <FormInput
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Update Password
          </Button>
        </Form>
      </Modal>

      {/* Add/Edit Menu Item Modal */}
      <Modal
        isOpen={isMenuItemModalOpen}
        onClose={() => {
          setMenuItemForm({ name: "", price: "", description: "", image: "", categoryId: categories[0]?.id || "", type: "Veg" });
          setIsMenuItemModalOpen(false);
          setEditMenuItem(null);
        }}
        title={editMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        ariaLabel={editMenuItem ? "Edit menu item form" : "Add new menu item form"}
        isDirty={menuItemForm.name || menuItemForm.price || menuItemForm.description || menuItemForm.image}
      >
        <Form onSubmit={handleAddMenuItem}>
          <FormGroup>
            <FormLabel htmlFor="menuItemName" theme={{ mode: theme }}>Name</FormLabel>
            <FormInput
              id="menuItemName"
              type="text"
              value={menuItemForm.name}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, name: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menuItemPrice" theme={{ mode: theme }}>Price</FormLabel>
            <FormInput
              id="menuItemPrice"
              type="number"
              step="0.01"
              min="0"
              value={menuItemForm.price}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, price: e.target.value })
              }
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menuItemDescription" theme={{ mode: theme }}>Description</FormLabel>
            <FormTextarea
              id="menuItemDescription"
              value={menuItemForm.description}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, description: e.target.value })
              }
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menuItemImage" theme={{ mode: theme }}>Image URL</FormLabel>
            <FormInput
              id="menuItemImage"
              type="text"
              value={menuItemForm.image}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, image: e.target.value })
              }
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menuItemCategory" theme={{ mode: theme }}>Category</FormLabel>
            <FormSelect
              id="menuItemCategory"
              value={menuItemForm.categoryId}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, categoryId: e.target.value })
              }
              required
              theme={{ mode: theme }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name || "Unknown"}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="menuItemType" theme={{ mode: theme }}>Type</FormLabel>
            <FormSelect
              id="menuItemType"
              value={menuItemForm.type}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, type: e.target.value })
              }
              required
              theme={{ mode: theme }}
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </FormSelect>
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Save Menu Item
          </Button>
        </Form>
      </Modal>

      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setCategoryForm({ name: "" });
          setIsCategoryModalOpen(false);
          setEditCategory(null);
        }}
        title={editCategory ? "Edit Category" : "Add New Category"}
        ariaLabel={editCategory ? "Edit category form" : "Add new category form"}
        isDirty={categoryForm.name}
      >
        <Form onSubmit={handleAddCategory}>
          <FormGroup>
            <FormLabel htmlFor="categoryName" theme={{ mode: theme }}>Category Name</FormLabel>
            <FormInput
              id="categoryName"
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Save Category
          </Button>
        </Form>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={isOrderDetailsModalOpen}
        onClose={() => setIsOrderDetailsModalOpen(false)}
        title={`Order #${selectedOrder?.id || ""}`}
        ariaLabel="Order details"
      >
        {selectedOrder ? (
          <>
            <OrderDetails>
              <OrderImage theme={{ mode: theme }}>
                {selectedOrder.items?.[0]?.image ? (
                  <img src={selectedOrder.items[0].image} alt={selectedOrder.items[0].name} onError={(e) => { e.target.src = 'fallback-image-url.jpg'; }} />
                ) : (
                  <FaShoppingBag />
                )}
              </OrderImage>
              <OrderInfo>
                <OrderTitle theme={{ mode: theme }}>Order by {selectedOrder.userName || "User"}</OrderTitle>
                <OrderItems>
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <OrderItem key={item.itemId || item.id} theme={{ mode: theme }}>
                        {item.name} - {item.quantity}x ($
                        {(item.price * item.quantity).toFixed(2)})
                      </OrderItem>
                    ))
                  ) : (
                    <OrderItem theme={{ mode: theme }}>No items available</OrderItem>
                  )}
                </OrderItems>
                <OrderMeta theme={{ mode: theme }}>
                  <OrderMetaContent>
                    <FiMapPin />{" "}
                    {selectedOrder.addressLine1
                      ? `${selectedOrder.addressLine1}${selectedOrder.addressLine2 ? `, ${selectedOrder.addressLine2}` : ""}, ${selectedOrder.city}, ${selectedOrder.pincode}`
                      : "No address provided"}
                  </OrderMetaContent>
                  <OrderMetaContent>
                    Total: ${selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : "0.00"}
                  </OrderMetaContent>
                  <OrderMetaContent>
                    Placed on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "Unknown"}
                  </OrderMetaContent>
                  {normalizeRole(user?.role) === "ADMIN" && (
                    <FormGroup>
                      <FormLabel htmlFor="orderStatus" theme={{ mode: theme }}>Status</FormLabel>
                      <FormSelect
                        id="orderStatus"
                        value={selectedOrder.status || "Pending"}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                        theme={{ mode: theme }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </FormSelect>
                    </FormGroup>
                  )}
                </OrderMeta>
              </OrderInfo>
            </OrderDetails>
          </>
        ) : (
          <InfoValue theme={{ mode: theme }}>No order details available</InfoValue>
        )}
      </Modal>

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        title="Confirm Deletion"
        ariaLabel="Confirm deletion"
      >
        <ConfirmationModalContent theme={{ mode: theme }}>
          <ConfirmationText theme={{ mode: theme }}>
            Are you sure you want to delete this {deleteTarget.type}?
          </ConfirmationText>
          <ConfirmationButtons>
            <Button $secondary onClick={() => setIsConfirmDeleteModalOpen(false)} theme={{ mode: theme }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} theme={{ mode: theme }}>
              <FaTrash /> Delete
            </Button>
          </ConfirmationButtons>
        </ConfirmationModalContent>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        isOpen={isNotificationSettingsModalOpen}
        onClose={() => setIsNotificationSettingsModalOpen(false)}
        title="Notification Settings"
        ariaLabel="Notification settings form"
        isDirty={notificationSettings.emailOrderUpdates !== profileData.emailOrderUpdates || notificationSettings.emailPromotions !== profileData.emailPromotions || notificationSettings.desktopNotifications !== profileData.desktopNotifications}
      >
        <Form onSubmit={handleNotificationSettingsUpdate}>
          <FormGroup>
            <FormLabel htmlFor="orderUpdates" theme={{ mode: theme }}>
              Order Updates (Email)
              <input
                id="orderUpdates"
                type="checkbox"
                checked={notificationSettings.emailOrderUpdates}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailOrderUpdates: e.target.checked})}
              />
            </FormLabel>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="promotions" theme={{ mode: theme }}>
              Promotions & Offers (Email)
              <input
                id="promotions"
                type="checkbox"
                checked={notificationSettings.emailPromotions}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailPromotions: e.target.checked})}
              />
            </FormLabel>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="desktopNotifications" theme={{ mode: theme }}>
              Desktop Notifications
              <input
                id="desktopNotifications"
                type="checkbox"
                checked={notificationSettings.desktopNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, desktopNotifications: e.target.checked})}
              />
            </FormLabel>
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaSave /> Save Settings
          </Button>
        </Form>
      </Modal>

      {/* Send Notification Modal */}
      <Modal
        isOpen={isSendNotificationModalOpen}
        onClose={() => {
          setNotificationForm({ userIds: [], title: '', content: '', imageUrl: '', type: 'promotion', scheduleDate: null });
          setIsSendNotificationModalOpen(false);
        }}
        title="Send Promotion Notification"
        ariaLabel="Send notification form"
        isDirty={notificationForm.title || notificationForm.content || notificationForm.imageUrl || notificationForm.userIds.length > 0 || notificationForm.scheduleDate}
      >
        <Form onSubmit={handleSendNotification}>
          <FormGroup>
            <FormLabel htmlFor="notificationType" theme={{ mode: theme }}>Notification Type</FormLabel>
            <FormSelect
              id="notificationType"
              value={notificationForm.type}
              onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
              theme={{ mode: theme }}
            >
              <option value="promotion">Promotion</option>
              <option value="order">Order Update</option>
              <option value="system">System Alert</option>
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <FormLabel theme={{ mode: theme }}>
              Select Users (leave empty to send to all users)
            </FormLabel>
            <UserListContainer theme={{ mode: theme }}>
              <SelectAllLabel theme={{ mode: theme }}>
                <input
                  type="checkbox"
                  checked={notificationForm.userIds.length === allUsers.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNotificationForm({ ...notificationForm, userIds: allUsers.map(u => u.id) });
                    } else {
                      setNotificationForm({ ...notificationForm, userIds: [] });
                    }
                  }}
                />
                Select All
              </SelectAllLabel>
              {allUsers.map((u) => (
                <UserCheckboxLabel key={u.id} theme={{ mode: theme }}>
                  <input
                    type="checkbox"
                    checked={notificationForm.userIds.includes(u.id)}
                    onChange={(e) => {
                      const updatedIds = e.target.checked
                        ? [...notificationForm.userIds, u.id]
                        : notificationForm.userIds.filter(id => id !== u.id);
                      setNotificationForm({ ...notificationForm, userIds: updatedIds });
                    }}
                  />
                  {u.name} ({u.email})
                </UserCheckboxLabel>
              ))}
            </UserListContainer>
            <p style={{ fontSize: '0.8rem', color: theme.mode === 'dark' ? '#cc9999' : '#ffb3b3', marginTop: '0.5rem' }}>
              Note: Leaving all unchecked will send the notification to all users.
            </p>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="title" theme={{ mode: theme }}>Title</FormLabel>
            <FormInput
              id="title"
              type="text"
              value={notificationForm.title}
              onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              required
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="content" theme={{ mode: theme }}>Content</FormLabel>
            <ReactQuill
              value={notificationForm.content}
              onChange={(value) => setNotificationForm({ ...notificationForm, content: value })}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              theme="snow"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="imageUrl" theme={{ mode: theme }}>Image URL (Optional)</FormLabel>
            <FormInput
              id="imageUrl"
              type="text"
              value={notificationForm.imageUrl}
              onChange={(e) => setNotificationForm({ ...notificationForm, imageUrl: e.target.value })}
              theme={{ mode: theme }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel theme={{ mode: theme }}>Schedule Delivery (Optional)</FormLabel>
            <SchedulerContainer theme={{ mode: theme }}>
              <DatePicker
                selected={notificationForm.scheduleDate}
                onChange={(date) => setNotificationForm({ ...notificationForm, scheduleDate: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Send immediately if not set"
                className="custom-date-picker"
                wrapperClassName="date-picker-wrapper"
                calendarClassName="custom-calendar"
                popperClassName="custom-popper"
              />
              <SchedulerNote theme={{ mode: theme }}>
                Select a date and time to schedule the notification. If left blank, it will be sent immediately.
              </SchedulerNote>
            </SchedulerContainer>
          </FormGroup>
          <Button type="submit" theme={{ mode: theme }}>
            <FaEnvelope /> Send Notification
          </Button>
        </Form>
      </Modal>
    </ProfileWrapper>
  );
};

Profile.propTypes = {
  // No props are passed to this component, but defining PropTypes for clarity
};

// Wrap the Profile component with ThemeProvider
const ProfileWithTheme = () => (
  <ThemeProvider>
    <Profile />
  </ThemeProvider>
);

export default ProfileWithTheme;