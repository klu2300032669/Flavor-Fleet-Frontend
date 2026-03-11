import styled, { keyframes, css } from "styled-components";

// Enhanced Animations with smoother easing, better performance, and accessibility considerations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(15px) scale(0.98);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
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
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.99);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 102, 102, 0.8), 0 0 25px rgba(255, 102, 102, 0.3); }
  100% { box-shadow: 0 0 5px rgba(255, 102, 102, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// New: Pulse animation for interactive elements
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

// New: Rotate for spinners or icons
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components with enhanced theming, accessibility, responsiveness, and visual polish
export const ProfileWrapper = styled.div`
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
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

export const BackButton = styled.button`
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.2rem;
  z-index: 10;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 102, 102, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

export const ThemeToggle = styled.button`
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.2rem;
  z-index: 10;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px) rotate(180deg);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ffd700' : '#ff6666'};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0) rotate(0deg);
  }

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

export const ProfileContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  animation: ${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    max-width: 100%;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ProfileSidebar = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 40, 40, 0.9)' 
    : 'rgba(255, 255, 255, 0.85)'
  };
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  overflow: hidden;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    border-radius: 16px;
    padding: 1.5rem;
  }
`;

export const Avatar = styled.div`
  width: 140px;
  height: 140px;
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
  animation: ${bounce} 3s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  svg {
    font-size: 4.2rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff9999'};
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;

    svg {
      font-size: 3.5rem;
    }
  }
`;

export const AvatarInput = styled.input`
  display: none;
`;

export const AvatarLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)'
  };
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(80, 80, 80, 1)' 
      : 'rgba(255, 255, 255, 1)'
    };
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(255, 102, 102, 0.3);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  svg {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  }
`;

export const UserName = styled.h2`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  text-align: center;
  letter-spacing: -0.025em;
`;

export const UserEmail = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ffb3b3' : '#ff9999'};
  font-size: 0.95rem;
  margin-bottom: 1rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-style: italic;
`;

export const UserMemberSince = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  opacity: 0.8;

  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

export const NotificationBell = styled.div`
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.mode === 'dark' ? '#ffb3b3' : '#ff9999'};
    transform: rotate(15deg) scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(135deg, #ff4444, #ff6666);
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
    animation: ${pulse} 2s infinite;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const NotificationDropdown = styled.div`
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'
  };
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: 450px;
  overflow-y: auto;
  z-index: 10;
  animation: ${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(255, 180, 180, 0.3)'
  };

  @media (max-width: 768px) {
    width: 280px;
    left: 0;
    transform: none;
  }
`;

export const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 180, 180, 0.1)' 
      : 'rgba(255, 180, 180, 0.2)'
    };
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  &:last-child {
    border-bottom: none;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .notification-title {
    font-weight: 600;
    color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  }

  .notification-time {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
    opacity: 0.8;
  }
`;

export const NotificationTypeIndicator = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ type }) => {
    if (type === 'order') return 'rgba(255, 193, 7, 0.2)';
    if (type === 'promotion') return 'rgba(40, 167, 69, 0.2)';
    if (type === 'system') return 'rgba(220, 53, 69, 0.2)';
    return 'rgba(0, 0, 0, 0.1)';
  }};
  color: ${({ type }) => {
    if (type === 'order') return '#ffc107';
    if (type === 'promotion') return '#28a745';
    if (type === 'system') return '#dc3545';
    return '#666';
  }};
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const NavMenu = styled.nav`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
`;

export const NavItem = styled.li`
  margin-bottom: 0.6rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const NavLink = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$active'].includes(prop),
})`
  width: 100%;
  background: ${({ $active, theme }) => 
    $active 
      ? theme.mode === 'dark' 
        ? 'linear-gradient(135deg, rgba(255, 153, 153, 0.3), rgba(255, 102, 102, 0.2))' 
        : 'rgba(255, 255, 255, 0.4)'
      : 'transparent'
  };
  color: ${({ theme }) => 
    theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: ${({ $active, theme }) => $active ? '1px solid rgba(255, 153, 153, 0.3)' : 'none'};
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.15)' 
      : 'rgba(255, 255, 255, 0.3)'
    };
    transform: translateX(6px);
    box-shadow: 0 4px 12px rgba(255, 102, 102, 0.15);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  svg {
    margin-right: 0.8rem;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

export const ProfileContent = styled.main`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 40, 40, 0.9)' 
    : 'rgba(255, 255, 255, 0.85)'
  };
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  min-height: 600px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  background: inherit;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.2)' : 'rgba(255, 180, 180, 0.2)'};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
`;

export const ProfileTitle = styled.h1`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  letter-spacing: -0.025em;

  svg {
    margin-right: 0.6rem;
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    justify-content: center;
  }
`;

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$secondary', '$iconOnly', '$variant'].includes(prop),
})`
  ${({ $variant = 'primary' }) => $variant === 'primary' && css`
    background: linear-gradient(135deg, ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.3)' : 'rgba(255, 255, 255, 0.4)'}, ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 102, 102, 0.2)' : 'rgba(255, 255, 255, 0.3)'});
  `}

  background: ${({ $secondary, theme }) => 
    $secondary 
      ? 'transparent' 
      : theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.25)' 
        : 'rgba(255, 255, 255, 0.35)'
  };
  color: ${({ theme }) => 
    theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: ${({ $secondary, theme }) => 
    $secondary 
      ? `1px solid ${theme.mode === 'dark' ? '#ff9999' : '#ff6666'}` 
      : '1px solid transparent'
  };
  border-radius: 12px;
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 44px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
    opacity: 0;
  }

  &:hover::before {
    left: 100%;
    opacity: 1;
  }

  &:hover {
    background: ${({ $secondary, theme }) => 
      $secondary 
        ? theme.mode === 'dark' 
          ? 'rgba(255, 153, 153, 0.15)' 
          : 'rgba(255, 102, 102, 0.15)' 
        : theme.mode === 'dark' 
          ? 'rgba(255, 153, 153, 0.35)' 
          : 'rgba(255, 255, 255, 0.5)'
    };
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 102, 102, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-right: ${({ $iconOnly }) => ($iconOnly ? "0" : "0.5rem")};
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    min-height: 40px;
  }
`;

export const ProfileSection = styled.section`
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation-fill-mode: forwards;

  &:nth-child(even) {
    animation-delay: 0.1s;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.4)' 
    : 'rgba(255, 180, 180, 0.6)'
  };
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    border-radius: 1px;
  }

  svg {
    margin-right: 0.6rem;
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.6)' 
    : 'rgba(255, 255, 255, 0.25)'
  };
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(255, 255, 255, 0.15)'
  };
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'}, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(60, 60, 60, 0.8)' 
      : 'rgba(255, 255, 255, 0.4)'
    };
    transform: translateY(-6px) rotateX(2deg);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

export const AdminCard = styled(Card)`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 100, 100, 0.25), rgba(255, 50, 50, 0.15))' 
    : 'linear-gradient(135deg, rgba(255, 180, 180, 0.4), rgba(255, 150, 150, 0.2))'
  };
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff7777' : '#ff6666'};
  animation: ${glow} 2.5s infinite ease-in-out;
  position: relative;

  &::after {
    content: 'Admin';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 119, 119, 0.8)' : 'rgba(255, 102, 102, 0.6)'};
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(255, 100, 100, 0.35), rgba(255, 50, 50, 0.25))' 
      : 'linear-gradient(135deg, rgba(255, 180, 180, 0.5), rgba(255, 150, 150, 0.3))'
    };
    animation-play-state: paused;
  }
`;

export const InfoLabel = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
  opacity: 0.9;
`;

export const InfoValue = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const StatCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const StatNumber = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  svg {
    margin-right: 0.5rem;
    color: #ffd700;
    font-size: 1.8rem;
  }
`;

export const StatLabel = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
  opacity: 0.9;
`;

export const OrderCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-left: 4px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};

  &:hover {
    border-left-color: ${({ theme }) => theme.mode === 'dark' ? '#ffb3b3' : '#ff9999'};
  }
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const OrderId = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1rem;
`;

export const OrderStatus = styled.div`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const OrderDetails = styled.div`
  display: flex;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const OrderImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.5)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
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

export const OrderInfo = styled.div`
  flex-grow: 1;
`;

export const OrderTitle = styled.h4`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.3rem 0;
`;

export const OrderMeta = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const OrderMetaContent = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

export const OrderItems = styled.div`
  margin-top: 0.5rem;
`;

export const OrderItem = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  padding: 0.2rem;
  border-radius: 4px;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.1)' : 'rgba(255, 180, 180, 0.1)'};
`;

export const FavoriteItem = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FavoriteImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(60, 60, 60, 0.5)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
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

export const FavoriteContent = styled.div`
  flex-grow: 1;
  width: 100%;
`;

export const FavoriteTitle = styled.h4`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.3rem 0;
`;

export const FavoriteMeta = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.4rem;
    color: #ffd700;
  }
`;

export const ModalOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); // Darker overlay
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(42, 42, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  animation: ${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.2)' : 'rgba(255, 180, 180, 0.2)'};

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

export const Modal = styled(ModalContent)`
  // Modal is an alias for ModalContent to match component usage
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.2)' : 'rgba(255, 180, 180, 0.2)'};
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

export const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.6rem;
  font-weight: 700;
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 102, 102, 0.1)'
    };
    transform: rotate(90deg) scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // More space
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FormInput = styled.input`
  padding: 0.8rem 1rem; // More padding
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : '#fff'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
    transform: scale(1.02);
  }

  &::placeholder {
    color: ${({ theme }) => theme.mode === 'dark' ? '#888' : '#ccc'};
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
  }
`;

export const FormSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : '#fff'};
  min-height: 44px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : '#fff'};
  font-family: inherit;
  resize: vertical;
  min-height: 100px; // Taller default
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
  }
`;

export const TextArea = styled(FormTextarea)`
  // Alias for TextArea to match component usage
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const FilterButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$active'].includes(prop),
})`
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 255, 255, 0.2)'
    };
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 102, 102, 0.15);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
`;

export const AddressCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AddressActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

export const AddressText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem; // More padding
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  border-top: 4px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite; // Smoother spin
  margin: 0 auto;
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.8;
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 100, 100, 0.2)' 
    : 'rgba(255, 150, 150, 0.2)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
  border-left: 4px solid ${({ theme }) => theme.mode === 'dark' ? '#ff7777' : '#ff6666'};
  box-shadow: 0 4px 12px rgba(255, 100, 100, 0.1);
`;

export const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  overflow-x: auto;
  display: block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const AdminTableHeader = styled.th`
  background: linear-gradient(135deg, ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 100, 100, 0.4)' 
    : 'rgba(255, 180, 180, 0.4)'}, ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 50, 50, 0.2)' 
    : 'rgba(255, 150, 150, 0.2)'});
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  padding: 1rem 0.8rem; // More padding
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 5;

  @media (max-width: 768px) {
    padding: 0.6rem 0.5rem;
  }
`;

export const AdminTableRow = styled.tr`
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(255, 255, 255, 0.15)'
    };
  }

  &:nth-child(even) {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const AdminTableCell = styled.td`
  padding: 1rem 0.8rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  font-size: 0.95rem;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.2)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 0.6rem 0.5rem;
  }
`;

export const AdminSelect = styled.select`
  padding: 0.6rem 0.8rem;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 8px;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 0.9rem;
  min-width: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.6rem;
  }
`;

export const AdminFormInput = styled(FormInput)`
  padding: 0.7rem;
  font-size: 0.9rem;
`;

export const MessagesLoadingContainer = styled(LoadingContainer)`
  padding: 1rem;
`;

export const MessagesErrorMessage = styled(ErrorMessage)`
  margin-top: 1rem;
`;

export const ConfirmationModalContent = styled(ModalContent)`
  max-width: 400px; // Slightly wider
  text-align: center;
`;

export const ConfirmationText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled(FormInput)`
  flex-grow: 1;
  min-width: 200px;
`;

export const SkeletonCard = styled(Card)`
  animation: ${shimmer} 2s infinite linear;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'linear-gradient(90deg, #333 0%, #444 50%, #333 100%)' 
    : 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)'
  };
  background-size: 1000px 100%;
  height: ${({ height }) => height || '100px'};
  border: none;
  box-shadow: none;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$active'].includes(prop),
})`
  background: ${({ $active, theme }) => 
    $active 
      ? theme.mode === 'dark' 
        ? 'rgba(255, 153, 153, 0.3)' 
        : 'rgba(255, 102, 102, 0.3)' 
      : 'transparent'
  };
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  border-radius: 8px; // Softer
  padding: 0.6rem 1rem; // More padding
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(255, 153, 153, 0.1)' 
      : 'rgba(255, 102, 102, 0.1)'
    };
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 102, 102, 0.15);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px solid ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
`;

export const PasswordStrengthMeter = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$strength'].includes(prop),
})`
  height: 6px; // Thicker bar
  border-radius: 3px;
  margin-top: 0.5rem;
  background: ${({ $strength }) => {
    if ($strength === 'weak') return '#ff4757';
    if ($strength === 'medium') return '#ffa502';
    if ($strength === 'strong') return '#2ed573';
    return '#ddd';
  }};
  width: ${({ $strength }) => {
    if ($strength === 'weak') return '33%';
    if ($strength === 'medium') return '66%';
    if ($strength === 'strong') return '100%';
    return '0%';
  }};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProgressBar = styled.div`
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : '#f0f0f0'};
  margin-top: 0.5rem;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProgressFill = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$progress'].includes(prop),
})`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(135deg, ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'}, ${({ theme }) => theme.mode === 'dark' ? '#ff6666' : '#ff9999'});
  width: ${({ $progress }) => `${$progress}%`};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(255, 102, 102, 0.3);
`;

export const BulkActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const ExportButton = styled(Button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 167, 69, 0.3)' 
    : 'rgba(40, 167, 69, 0.2)'}, ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(40, 167, 69, 0.2)' 
    : 'rgba(40, 167, 69, 0.1)'});
  color: #28a745;
  border: 1px solid #28a745;

  &:hover {
    background: linear-gradient(135deg, ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(40, 167, 69, 0.4)' 
      : 'rgba(40, 167, 69, 0.3)'}, ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(40, 167, 69, 0.3)' 
      : 'rgba(40, 167, 69, 0.2)'});
  }
`;

export const AnalyticsCard = styled(Card)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); // Wider items
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 20px;
`;

export const AnalyticsItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(50, 50, 50, 0.6)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const AnalyticsValue = styled.div`
  font-size: 2.2rem; // Larger
  font-weight: 800;
  color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'};
  margin-bottom: 0.5rem;
  line-height: 1;
`;

export const AnalyticsLabel = styled.div`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const ReviewContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 153, 153, 0.3)' 
    : 'rgba(255, 180, 180, 0.3)'
  };
`;

export const ReviewStars = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
`;

export const Star = styled.span`
  color: ${({ filled, theme }) => filled 
    ? '#ffd700' 
    : theme.mode === 'dark' ? '#555' : '#ddd'
  };
  transition: color 0.3s ease;
  font-size: 1.2rem;
`;

export const ReviewText = styled.p`
  color: ${({ theme }) => theme.mode === 'dark' ? '#cc9999' : '#ffb3b3'};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
`;

export const NotificationPanel = styled.div`
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const UserListContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ffb3b3'};
  border-radius: 12px;
  padding: 0.5rem;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(50, 50, 50, 0.8)' : '#fff'};
  margin-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.mode === 'dark' ? '#ff9999' : '#ff6666'} transparent;
`;

export const UserCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f5f5f5' : '#333'};
  cursor: pointer;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#444' : '#eee'};
  transition: background 0.3s ease;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 153, 153, 0.1)' : 'rgba(255, 180, 180, 0.1)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SelectAllLabel = styled(UserCheckboxLabel)`
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' ? '#555' : '#ddd'};
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
`;

// Export animations as well
export { 
  fadeIn, 
  gradientBG, 
  bounce, 
  slideIn, 
  glow, 
  shimmer,
  pulse,
  rotate
};