import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiEye, FiEyeOff, FiCheck, FiLock, FiMail, FiUser, FiAlertCircle, FiArrowLeft, FiX } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../components/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// ========== ANIMATIONS ==========
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(30px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.9);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-3px) rotate(0.5deg); }
  66% { transform: translateY(2px) rotate(-0.5deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const particleFloat = keyframes`
  0% { 
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { 
    transform: translateY(-100px) rotate(360deg) scale(0);
    opacity: 0;
  }
`;

const checkmarkDraw = keyframes`
  0% { 
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% { 
    opacity: 1;
  }
  100% { 
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

// ========== STYLED COMPONENTS ==========
const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%,
    rgba(250, 250, 250, 1) 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const AuthLeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, 
    rgba(10, 10, 10, 1) 0%,
    rgba(20, 20, 20, 1) 100%
  );
  color: white;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: ${slideInLeft} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 1024px) {
    display: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  }
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
  
  span {
    background: linear-gradient(135deg, #ffffff, #cccccc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const LeftTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
  
  @media (max-width: 1280px) {
    font-size: 2.5rem;
  }
`;

const LeftSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 500px;
  position: relative;
  z-index: 1;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
  }
  
  .feature-content {
    flex: 1;
  }
  
  .feature-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: white;
  }
  
  .feature-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
  }
`;

const DecorativeShape = styled.div`
  position: absolute;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  background: ${props => props.color || 'rgba(255, 255, 255, 0.03)'};
  border-radius: ${props => props.circle ? '50%' : '24px'};
  transform: rotate(${props => props.rotate || '0'}deg);
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const AuthRightPanel = styled.div`
  flex: 1;
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${slideInRight} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  animation: ${scaleIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #111827, #374151);
    border-radius: 24px 24px 0 0;
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  
  p {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 4px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #111827;
    border-radius: 12px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${props => props.activeTab === 'signup' ? 'translateX(100%)' : 'translateX(0)'};
  }
`;

const TabButton = styled.button`
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: color 0.3s ease;
  border-radius: 12px;
  letter-spacing: 0.02em;
  
  &:hover:not(:disabled) {
    color: ${props => props.active ? '#ffffff' : '#111827'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.4s ease-out;
  animation-delay: ${props => props.delay || '0'}ms;
  animation-fill-mode: both;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.$hasError ? '#dc2626' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
  color: #111827;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::placeholder {
    color: transparent;
  }
  
  &:focus {
    outline: none;
    border-color: #111827;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    & ~ .floating-label {
      top: -0.5rem;
      left: 0.75rem;
      font-size: 0.75rem;
      color: #111827;
      background: white;
      padding: 0 0.25rem;
      z-index: 2;
    }
    
    & ~ .input-icon {
      color: #111827;
      transform: scale(1.1);
    }
  }
  
  &:not(:placeholder-shown):not(:focus) {
    & ~ .floating-label {
      top: -0.5rem;
      left: 0.75rem;
      font-size: 0.75rem;
      color: #6b7280;
      background: white;
      padding: 0 0.25rem;
      z-index: 2;
    }
  }
  
  &:hover:not(:focus) {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.9);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 1rem;
  left: 3rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
  background: transparent;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.$hasError ? '#dc2626' : '#9ca3af'};
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #111827;
    background: rgba(0, 0, 0, 0.04);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputError = styled.div`
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PasswordStrength = styled.div`
  margin: 1rem 0;
  animation: ${fadeIn} 0.4s ease-out;
  
  .strength-bar {
    height: 4px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${props => props.$strength}%;
      background: ${props => 
        props.$strength >= 80 ? '#111827' :
        props.$strength >= 60 ? '#374151' :
        props.$strength >= 40 ? '#6b7280' :
        '#9ca3af'};
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 2px;
    }
  }
  
  .strength-text {
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span:last-child {
      font-weight: 600;
      color: ${props => 
        props.$strength >= 80 ? '#111827' :
        props.$strength >= 60 ? '#374151' :
        props.$strength >= 40 ? '#6b7280' :
        '#9ca3af'};
    }
  }
  
  .requirements {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.75rem;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.$met ? '#111827' : '#9ca3af'};
  
  svg {
    font-size: 0.875rem;
    color: ${props => props.$met ? '#111827' : '#d1d5db'};
    transition: all 0.3s ease;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: #111827;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover:not(:disabled) {
    background: #1f2937;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.06);
    color: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
  
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: #ffffff;
    border-right-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .google-icon {
    font-size: 1.25rem;
    color: #4285f4;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  color: #111827;
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.02);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OTPContainer = styled.div`
  margin: 2rem 0;
  
  .instruction {
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    
    strong {
      color: #111827;
      font-weight: 600;
    }
  }
  
  .otp-inputs {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
`;

const OTPInput = styled.input`
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #111827;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transform: scale(1.05);
  }
  
  &.filled {
    border-color: #111827;
    background: rgba(255, 255, 255, 1);
    animation: ${float} 0.3s ease-out;
  }
  
  @media (max-width: 480px) {
    width: 42px;
    height: 50px;
    font-size: 1.25rem;
  }
`;

const ResendButton = styled.button`
  background: transparent;
  border: none;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: block;
  margin-left: auto;
  
  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.04);
    text-decoration: underline;
  }
  
  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  &:hover:not(:disabled) {
    color: #111827;
    background: rgba(0, 0, 0, 0.04);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: ${props => props.$error ? 
    'linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02))' :
    'linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02))'};
  border: 1px solid ${props => props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  animation: ${fadeIn} 0.4s ease-out;
  
  svg {
    color: ${props => props.$error ? '#dc2626' : '#111827'};
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .message {
    flex: 1;
    color: ${props => props.$error ? '#dc2626' : '#111827'};
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .close {
    background: none;
    border: none;
    color: ${props => props.$error ? '#dc2626' : '#111827'};
    opacity: 0.5;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-size: 1.25rem;
    line-height: 1;
    
    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

const SuccessState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  min-height: 400px;
  animation: ${fadeIn} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at center, rgba(0, 0, 0, 0.02) 0%, transparent 70%),
      linear-gradient(135deg, transparent 30%, rgba(0, 0, 0, 0.02) 100%);
    border-radius: 20px;
  }
`;

const CheckmarkContainer = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 2rem;
  position: relative;
  
  svg {
    width: 100%;
    height: 100%;
    
    .checkmark {
      stroke-width: 3;
      stroke: #111827;
      fill: none;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: ${checkmarkDraw} 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
      animation-delay: 0.3s;
    }
    
    .circle {
      stroke-width: 2;
      stroke: rgba(0, 0, 0, 0.1);
      fill: none;
    }
  }
`;

const SuccessTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: 0.6s;
  letter-spacing: -0.02em;
`;

const SuccessMessage = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 320px;
  margin: 0;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: 0.8s;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  animation: ${particleFloat} 2s ease-out forwards;
  opacity: 0;
  
  &:nth-child(1) { color: #111827; top: 20%; left: 20%; animation-delay: 0.1s; }
  &:nth-child(2) { color: #374151; top: 30%; left: 80%; animation-delay: 0.3s; }
  &:nth-child(3) { color: #6b7280; top: 60%; left: 10%; animation-delay: 0.5s; }
  &:nth-child(4) { color: #111827; top: 80%; left: 70%; animation-delay: 0.7s; }
  &:nth-child(5) { color: #374151; top: 40%; left: 40%; animation-delay: 0.9s; }
`;

const AuthPage = ({ onClose, onSuccess }) => {
  const { login, signup, verifySignupOtp, forgotPassword, resetPassword, googleLogin, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intendedPath = location.state?.intendedPath || "/";
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ message: "", isError: false });
  const [activeTab, setActiveTab] = useState("login");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [signupPasswordScore, setSignupPasswordScore] = useState(0);
  const [resetPasswordScore, setResetPasswordScore] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const otpRefs = useRef([]);

  // Use authLoading from context instead of local isLoading
  const isLoading = authLoading;

  // Password validation
  const checkPasswordRequirements = useCallback((password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  }, []);

  const calculatePasswordScore = useCallback((password) => {
    const requirements = checkPasswordRequirements(password);
    const metCount = Object.values(requirements).filter(Boolean).length;
    return (metCount / 5) * 100;
  }, [checkPasswordRequirements]);

  useEffect(() => {
    setSignupPasswordScore(calculatePasswordScore(signupPassword));
  }, [signupPassword, calculatePasswordScore]);

  useEffect(() => {
    setResetPasswordScore(calculatePasswordScore(newPassword));
  }, [newPassword, calculatePasswordScore]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    // Email regex for validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    if (activeTab === "login") {
      if (!loginEmail.trim()) errors.loginEmail = "Email is required";
      else if (!emailRegex.test(loginEmail)) errors.loginEmail = "Invalid email format";
      if (!loginPassword) errors.loginPassword = "Password is required";
    } else if (activeTab === "signup") {
      if (!signupName.trim()) errors.signupName = "Name is required";
      if (!signupEmail.trim()) errors.signupEmail = "Email is required";
      else if (!emailRegex.test(signupEmail)) errors.signupEmail = "Invalid email format";
      if (!signupPassword) errors.signupPassword = "Password is required";
      if (!signupConfirmPassword) errors.signupConfirmPassword = "Confirm password is required";
      if (signupPassword && signupConfirmPassword && signupPassword !== signupConfirmPassword) {
        errors.signupConfirmPassword = "Passwords don't match";
      }
    } else if (activeTab === "forgot") {
      if (!forgotEmail.trim()) errors.forgotEmail = "Email is required";
      else if (!emailRegex.test(forgotEmail)) errors.forgotEmail = "Invalid email format";
    } else if (activeTab === "reset") {
      if (otp.join("").length !== 6) errors.otp = "Enter 6-digit code";
      if (!newPassword) errors.newPassword = "New password is required";
      if (!confirmNewPassword) errors.confirmNewPassword = "Confirm new password is required";
      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = "Passwords don't match";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [
    activeTab, 
    loginEmail, 
    loginPassword, 
    signupName, 
    signupEmail, 
    signupPassword, 
    signupConfirmPassword,
    forgotEmail,
    otp,
    newPassword,
    confirmNewPassword
  ]);

  const resetForm = useCallback(() => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmNewPassword("");
    setNotification({ message: "", isError: false });
    setFormErrors({});
    setActiveTab("login");
    setResendCooldown(0);
    setShowSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    if (onClose) onClose();
    else navigate(-1);
  }, [resetForm, onClose, navigate]);

  const handleSuccess = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => {
      resetForm();
      if (onSuccess) onSuccess();
      else navigate(intendedPath);
    }, 2000);
  }, [resetForm, onSuccess, navigate, intendedPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    setFormErrors({});
    
    if (!validateForm()) return;
    
    const { success, error } = await login(loginEmail, loginPassword);
    
    if (success) {
      handleSuccess();
    } else {
      setNotification({ 
        message: error === "User not found" 
          ? "Account not found. Please check your email." 
          : error === "Invalid credentials" || error === "Invalid email or password"
          ? "Invalid password. Please try again."
          : error || "Login failed. Please try again.",
        isError: true 
      });
    }
  };

  const handleGoogleLogin = async () => {
    setNotification({ message: "", isError: false });
    const { success, error } = await googleLogin();
    
    if (success) {
      handleSuccess();
    } else {
      setNotification({ message: error || "Google login failed", isError: true });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    setFormErrors({});
    
    if (!validateForm()) return;
    
    if (signupPasswordScore < 80) {
      setNotification({ 
        message: "Please create a stronger password with uppercase, lowercase, number, and special character", 
        isError: true 
      });
      return;
    }
    
    const { success, error } = await signup(signupName, signupEmail, signupPassword);
    
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setActiveTab("verify-signup");
      setResendCooldown(30);
      setNotification({ 
        message: "Verification code sent to your email. Please check your inbox.", 
        isError: false 
      });
    } else {
      setNotification({ 
        message: error || "Signup failed. Please try again.", 
        isError: true 
      });
    }
  };

  const handleVerifySignup = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    const otpValue = otp.join("");
    if (!otpValue || otpValue.length !== 6) {
      setNotification({ 
        message: "Please enter the 6-digit verification code", 
        isError: true 
      });
      return;
    }
    
    const { success, error } = await verifySignupOtp(signupEmail, otpValue);
    
    if (success) {
      handleSuccess();
    } else {
      setNotification({ 
        message: error || "Invalid or expired verification code", 
        isError: true 
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    setFormErrors({});
    
    if (!validateForm()) return;
    
    const { success, error } = await forgotPassword(forgotEmail);
    
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setActiveTab("reset");
      setResendCooldown(30);
      setNotification({ 
        message: "Password reset code sent to your email. Please check your inbox.", 
        isError: false 
      });
    } else {
      setNotification({ 
        message: error || "Failed to send reset code. Please try again.", 
        isError: true 
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    setFormErrors({});
    
    if (!validateForm()) return;
    
    if (resetPasswordScore < 80) {
      setNotification({ 
        message: "Please create a stronger password with uppercase, lowercase, number, and special character", 
        isError: true 
      });
      return;
    }
    
    const { success, error } = await resetPassword(forgotEmail, otp.join(""), newPassword, confirmNewPassword);
    
    if (success) {
      handleSuccess();
    } else {
      setNotification({ 
        message: error || "Password reset failed. Please try again.", 
        isError: true 
      });
    }
  };

  const handleOtpChange = useCallback((index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      setTimeout(() => {
        otpRefs.current[index + 1]?.focus();
      }, 10);
    } else if (!value && index > 0) {
      setTimeout(() => {
        otpRefs.current[index - 1]?.focus();
      }, 10);
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    const numbers = paste.replace(/\D/g, '');
    if (numbers) {
      const newOtp = numbers.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      const focusIndex = Math.min(numbers.length, 5);
      setTimeout(() => {
        otpRefs.current[focusIndex]?.focus();
      }, 10);
    }
    e.preventDefault();
  }, []);

  const handleResendOtp = async () => {
    setNotification({ message: "", isError: false });
    
    let success = false;
    if (activeTab === "verify-signup") {
      const result = await signup(signupName, signupEmail, signupPassword);
      success = result.success;
    } else {
      const result = await forgotPassword(forgotEmail);
      success = result.success;
    }
    
    if (success) {
      setResendCooldown(30);
      setNotification({ 
        message: "Code resent successfully. Please check your email.", 
        isError: false 
      });
    } else {
      setNotification({ 
        message: "Failed to resend code. Please try again.", 
        isError: true 
      });
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first OTP input when verifying
  useEffect(() => {
    if ((activeTab === "verify-signup" || activeTab === "reset") && otpRefs.current[0]) {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [activeTab]);

  const renderPasswordStrength = useCallback((password, score) => {
    const requirements = checkPasswordRequirements(password);
    
    return (
      <PasswordStrength $strength={score}>
        <div className="strength-bar" />
        <div className="strength-text">
          <span>Password Strength</span>
          <span>
            {score >= 80 ? "Strong" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Weak"}
          </span>
        </div>
        <div className="requirements">
          {Object.entries(requirements).map(([key, met]) => (
            <Requirement key={key} $met={met}>
              <FiCheck />
              <span>
                {key === 'length' && '8+ characters'}
                {key === 'uppercase' && 'Uppercase letter'}
                {key === 'lowercase' && 'Lowercase letter'}
                {key === 'number' && 'Number'}
                {key === 'special' && 'Special character'}
              </span>
            </Requirement>
          ))}
        </div>
      </PasswordStrength>
    );
  }, [checkPasswordRequirements]);

  const features = [
    {
      icon: "🚀",
      title: "Instant Delivery",
      description: "Get your favorite meals delivered in 30 minutes or less"
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      description: "Only the finest ingredients from trusted suppliers"
    },
    {
      icon: "🎁",
      title: "Exclusive Offers",
      description: "Special discounts and rewards for our members"
    }
  ];

  return (
    <AuthContainer>
      <CloseButton onClick={handleClose} disabled={isLoading}>
        <FiX />
      </CloseButton>
      
      <AuthLeftPanel>
        <Logo><span>Flavor Fleet</span></Logo>
        <LeftTitle>Welcome to Flavor Fleet</LeftTitle>
        <LeftSubtitle>
          Join thousands of food lovers who trust us for premium quality meals, 
          lightning-fast delivery, and an unforgettable dining experience right at your doorstep.
        </LeftSubtitle>
        
        <FeaturesList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <div className="icon">{feature.icon}</div>
              <div className="feature-content">
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
            </FeatureItem>
          ))}
        </FeaturesList>
        
        {/* Decorative shapes */}
        <DecorativeShape 
          size="300px" 
          circle 
          color="rgba(255, 255, 255, 0.02)" 
          top="-100px" 
          right="-100px" 
          rotate="45"
          delay="0s"
        />
        <DecorativeShape 
          size="150px" 
          circle 
          color="rgba(255, 255, 255, 0.03)" 
          bottom="100px" 
          left="-50px" 
          rotate="-45"
          delay="1s"
        />
        <DecorativeShape 
          size="100px" 
          color="rgba(255, 255, 255, 0.02)" 
          top="200px" 
          right="100px" 
          rotate="15"
          delay="2s"
        />
      </AuthLeftPanel>
      
      <AuthRightPanel>
        <AuthCard>
          {showSuccess ? (
            <SuccessState>
              <CheckmarkContainer>
                <svg viewBox="0 0 52 52">
                  <circle className="circle" cx="26" cy="26" r="25" />
                  <path className="checkmark" d="M14 27l7 7 17-17" />
                </svg>
              </CheckmarkContainer>
              <SuccessTitle>Welcome Aboard!</SuccessTitle>
              <SuccessMessage>
                You're now part of the Flavor Fleet family. Enjoy your culinary journey!
              </SuccessMessage>
              {[...Array(5)].map((_, i) => (
                <Particle key={i} />
              ))}
            </SuccessState>
          ) : (
            <>
              <AuthHeader>
                <h2>
                  {activeTab === "login" && "Welcome Back"}
                  {activeTab === "signup" && "Create Account"}
                  {activeTab === "verify-signup" && "Verify Email"}
                  {activeTab === "forgot" && "Reset Password"}
                  {activeTab === "reset" && "New Password"}
                </h2>
                <p>
                  {activeTab === "login" && "Sign in to continue your culinary journey"}
                  {activeTab === "signup" && "Join Flavor Fleet for an unforgettable experience"}
                  {activeTab === "verify-signup" && "Enter the verification code sent to your email"}
                  {activeTab === "forgot" && "Enter your email to reset your password"}
                  {activeTab === "reset" && "Create a new password for your account"}
                </p>
              </AuthHeader>
              
              {["login", "signup"].includes(activeTab) && (
                <TabContainer activeTab={activeTab}>
                  <TabButton
                    onClick={() => setActiveTab("login")}
                    active={activeTab === "login"}
                    disabled={isLoading}
                  >
                    Sign In
                  </TabButton>
                  <TabButton
                    onClick={() => setActiveTab("signup")}
                    active={activeTab === "signup"}
                    disabled={isLoading}
                  >
                    Create Account
                  </TabButton>
                </TabContainer>
              )}
              
              {["verify-signup", "reset", "forgot"].includes(activeTab) && (
                <BackButton 
                  onClick={() => {
                    if (activeTab === "verify-signup") setActiveTab("signup");
                    else if (activeTab === "reset") setActiveTab("forgot");
                    else setActiveTab("login");
                  }} 
                  disabled={isLoading}
                >
                  <FiArrowLeft />
                  Back
                </BackButton>
              )}
              
              {notification.message && (
                <Alert $error={notification.isError}>
                  {notification.isError ? <FiAlertCircle /> : <FiCheck />}
                  <div className="message">{notification.message}</div>
                  <button 
                    className="close"
                    onClick={() => setNotification({ message: "", isError: false })}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </Alert>
              )}
              
              {activeTab === "login" && (
                <form onSubmit={handleLogin}>
                  <InputContainer delay={0}>
                    <InputWrapper>
                      <StyledInput
                        type="email"
                        placeholder=" "
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.loginEmail}
                      />
                      <FloatingLabel className="floating-label">
                        Email Address
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.loginEmail}>
                        <FiMail />
                      </InputIcon>
                    </InputWrapper>
                    {formErrors.loginEmail && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.loginEmail}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <InputContainer delay={50}>
                    <InputWrapper>
                      <StyledInput
                        type={showLoginPassword ? "text" : "password"}
                        placeholder=" "
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.loginPassword}
                      />
                      <FloatingLabel className="floating-label">
                        Password
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.loginPassword}>
                        <FiLock />
                      </InputIcon>
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        disabled={isLoading}
                      >
                        {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                    {formErrors.loginPassword && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.loginPassword}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </PrimaryButton>
                  
                  <SecondaryButton 
                    type="button" 
                    onClick={() => setActiveTab("forgot")}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </SecondaryButton>
                  
                  <Divider>or continue with</Divider>
                  
                  <GoogleButton 
                    type="button" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <FaGoogle className="google-icon" />
                    Continue with Google
                  </GoogleButton>
                </form>
              )}
              
              {activeTab === "signup" && (
                <form onSubmit={handleSignup}>
                  <InputContainer delay={0}>
                    <InputWrapper>
                      <StyledInput
                        type="text"
                        placeholder=" "
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.signupName}
                      />
                      <FloatingLabel className="floating-label">
                        Full Name
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.signupName}>
                        <FiUser />
                      </InputIcon>
                    </InputWrapper>
                    {formErrors.signupName && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.signupName}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <InputContainer delay={50}>
                    <InputWrapper>
                      <StyledInput
                        type="email"
                        placeholder=" "
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.signupEmail}
                      />
                      <FloatingLabel className="floating-label">
                        Email Address
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.signupEmail}>
                        <FiMail />
                      </InputIcon>
                    </InputWrapper>
                    {formErrors.signupEmail && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.signupEmail}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <InputContainer delay={100}>
                    <InputWrapper>
                      <StyledInput
                        type={showSignupPassword ? "text" : "password"}
                        placeholder=" "
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.signupPassword}
                      />
                      <FloatingLabel className="floating-label">
                        Password
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.signupPassword}>
                        <FiLock />
                      </InputIcon>
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        disabled={isLoading}
                      >
                        {showSignupPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                    {formErrors.signupPassword && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.signupPassword}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  {signupPassword && renderPasswordStrength(signupPassword, signupPasswordScore)}
                  
                  <InputContainer delay={150}>
                    <InputWrapper>
                      <StyledInput
                        type={showSignupConfirmPassword ? "text" : "password"}
                        placeholder=" "
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.signupConfirmPassword}
                      />
                      <FloatingLabel className="floating-label">
                        Confirm Password
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.signupConfirmPassword}>
                        <FiLock />
                      </InputIcon>
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showSignupConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                    {formErrors.signupConfirmPassword && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.signupConfirmPassword}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <PrimaryButton 
                    type="submit" 
                    disabled={isLoading || signupPasswordScore < 80}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </PrimaryButton>
                  
                  <Divider>or continue with</Divider>
                  
                  <GoogleButton 
                    type="button" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <FaGoogle className="google-icon" />
                    Continue with Google
                  </GoogleButton>
                </form>
              )}
              
              {activeTab === "verify-signup" && (
                <form onSubmit={handleVerifySignup}>
                  <OTPContainer>
                    <div className="instruction">
                      Enter the 6-digit code sent to <strong>{signupEmail}</strong>
                    </div>
                    
                    <div className="otp-inputs">
                      {otp.map((digit, index) => (
                        <OTPInput
                          key={index}
                          ref={el => otpRefs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onPaste={handleOtpPaste}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && index > 0) {
                              otpRefs.current[index - 1]?.focus();
                            }
                          }}
                          className={digit ? "filled" : ""}
                          autoFocus={index === 0}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                    
                    <ResendButton
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                    >
                      {resendCooldown > 0 
                        ? `Resend code in ${resendCooldown}s`
                        : "Resend Code"
                      }
                    </ResendButton>
                  </OTPContainer>
                  
                  <PrimaryButton 
                    type="submit" 
                    disabled={isLoading || otp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </PrimaryButton>
                </form>
              )}
              
              {activeTab === "forgot" && (
                <form onSubmit={handleForgotPassword}>
                  <InputContainer delay={0}>
                    <InputWrapper>
                      <StyledInput
                        type="email"
                        placeholder=" "
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.forgotEmail}
                      />
                      <FloatingLabel className="floating-label">
                        Email Address
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.forgotEmail}>
                        <FiMail />
                      </InputIcon>
                    </InputWrapper>
                    {formErrors.forgotEmail && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.forgotEmail}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Sending Code...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </PrimaryButton>
                </form>
              )}
              
              {activeTab === "reset" && (
                <form onSubmit={handleResetPassword}>
                  <OTPContainer>
                    <div className="instruction">
                      Enter the 6-digit code sent to <strong>{forgotEmail}</strong>
                    </div>
                    
                    <div className="otp-inputs">
                      {otp.map((digit, index) => (
                        <OTPInput
                          key={index}
                          ref={el => otpRefs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onPaste={handleOtpPaste}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && index > 0) {
                              otpRefs.current[index - 1]?.focus();
                            }
                          }}
                          className={digit ? "filled" : ""}
                          autoFocus={index === 0}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                    
                    <ResendButton
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                    >
                      {resendCooldown > 0 
                        ? `Resend code in ${resendCooldown}s`
                        : "Resend Code"
                      }
                    </ResendButton>
                  </OTPContainer>
                  
                  <InputContainer delay={0}>
                    <InputWrapper>
                      <StyledInput
                        type={showNewPassword ? "text" : "password"}
                        placeholder=" "
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.newPassword}
                      />
                      <FloatingLabel className="floating-label">
                        New Password
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.newPassword}>
                        <FiLock />
                      </InputIcon>
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isLoading}
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                    {formErrors.newPassword && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.newPassword}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  {newPassword && renderPasswordStrength(newPassword, resetPasswordScore)}
                  
                  <InputContainer delay={50}>
                    <InputWrapper>
                      <StyledInput
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder=" "
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        disabled={isLoading}
                        $hasError={!!formErrors.confirmNewPassword}
                      />
                      <FloatingLabel className="floating-label">
                        Confirm New Password
                      </FloatingLabel>
                      <InputIcon $hasError={!!formErrors.confirmNewPassword}>
                        <FiLock />
                      </InputIcon>
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                      </PasswordToggle>
                    </InputWrapper>
                    {formErrors.confirmNewPassword && (
                      <InputError>
                        <FiAlertCircle size={12} />
                        {formErrors.confirmNewPassword}
                      </InputError>
                    )}
                  </InputContainer>
                  
                  <PrimaryButton 
                    type="submit" 
                    disabled={isLoading || resetPasswordScore < 80 || otp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </PrimaryButton>
                </form>
              )}
            </>
          )}
        </AuthCard>
      </AuthRightPanel>
    </AuthContainer>
  );
};

export default AuthPage;