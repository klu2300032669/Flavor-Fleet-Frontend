import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiEyeOff, FiCheck, FiLock, FiMail, FiUser, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../components/AuthContext";
import styled, { keyframes, css } from "styled-components";

// ========== REFINED ANIMATIONS ==========
const fadeInScale = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.95) translateY(15px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
`;

const slideUpSmooth = keyframes`
  from { 
    transform: translateY(25px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
`;

const pulseSubtle = keyframes`
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.3); 
  }
  50% { 
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0); 
  }
`;

const confettiSoft = keyframes`
  0% { 
    transform: translateY(0) rotate(0deg) scale(0.7); 
    opacity: 1; 
  }
  100% { 
    transform: translateY(-80px) rotate(360deg) scale(0); 
    opacity: 0; 
  }
`;

const shakeMild = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
`;

const floatGentle = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(6px) scale(0.99); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmerSoft = keyframes`
  0% { background-position: -150% 0; }
  100% { background-position: 150% 0; }
`;

// ========== POLISHED STYLED COMPONENTS ==========
const ModalDialog = styled.div`
  &.modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
    @media (max-width: 576px) {
      max-width: 95%;
      margin: 1.5rem auto;
    }
  }
`;

const ModalContent = styled.div`
  &.modal-content {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 24px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    overflow: hidden;
    animation: ${fadeInScale} 0.5s ease-out;
    position: relative;
    color: #1f2937;
    pointer-events: auto;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff6b6b, #ffd93d);
      border-radius: 24px 24px 0 0;
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    &:hover::after {
      opacity: 1;
    }

    > * {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      pointer-events: auto;
    }
  }
`;

const ModalHeader = styled.div`
  &.modal-header {
    background: transparent;
    border-bottom: none;
    padding: 1.8rem 1.8rem 1.2rem;
    position: relative;
    z-index: 2;

    h5.modal-title {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #ff6b6b, #ffd93d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    button.btn-close {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
      border: 1px solid rgba(229, 231, 235, 0.5);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      opacity: 0.8;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background: linear-gradient(135deg, #ff6b6b, #ffd93d);
        border-color: transparent;
      }

      &::before {
        content: '×';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #a0aec0;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        transition: background 0.3s ease;
      }

      &:hover::before {
        background: #fff;
        color: #ff6b6b;
      }
    }
  }
`;

const ModalBody = styled.div`
  &.modal-body {
    padding: 0 1.8rem 2.5rem;
    max-height: 70vh;
    overflow-y: auto;
    background: transparent;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 107, 107, 0.3) transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 107, 107, 0.3);
      border-radius: 3px;
      &:hover {
        background: rgba(255, 107, 107, 0.5);
      }
    }

    @media (max-width: 576px) {
      padding: 0 1.4rem 2rem;
    }
  }
`;

const SuccessAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.8rem;
  text-align: center;
  animation: ${floatGentle} 0.6s ease-out;
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.12);
  margin: 1rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  backdrop-filter: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
    animation: ${pulseSubtle} 3s ease-in-out infinite;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4.5rem;
  color: #10b981;
  margin-bottom: 1.2rem;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseSubtle} 2s infinite;

  svg {
    filter: drop-shadow(0 3px 6px rgba(16, 185, 129, 0.2));
  }
`;

const SuccessTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.4px;
`;

const SuccessMessage = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 0;
  font-weight: 500;
  line-height: 1.6;
  max-width: 300px;
`;

const ConfettiParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '8px'};
  height: ${props => props.size || '8px'};
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}bb);
  border-radius: ${props => props.shape === 'circle' ? '50%' : '20%'};
  animation: ${confettiSoft} 3s ease-out forwards;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation-delay: ${props => props.delay}s;
  opacity: 0.85;
  z-index: 1;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const OtpInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 1.8rem;
  padding: 0 5px;
`;

const OtpInput = styled.input`
  width: 48px;
  height: 52px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 14px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  color: #1f2937;
  
  &:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.12), 0 5px 15px rgba(0, 0, 0, 0.1);
    outline: none;
    transform: scale(1.03);
  }
  
  &.filled {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, #ffffff 100%);
    border-color: #ff6b6b;
    color: #ff6b6b;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.08);
  }
  
  @media (max-width: 576px) {
    width: 44px;
    height: 48px;
    font-size: 1.4rem;
  }
`;

const ResendButton = styled.button`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid rgba(156, 163, 175, 0.5);
  border-radius: 25px;
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.7rem 1.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  margin-left: auto;
  display: block;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
  }
  
  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    background: #f9fafb;
    &::before { display: none; }
  }
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  animation: ${slideUpSmooth} 0.4s ease-out;
  padding: 1.1rem;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%);
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  backdrop-filter: none;
`;

const StrengthBarContainer = styled.div`
  display: flex;
  height: 7px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const StrengthBarSegment = styled.div`
  height: 100%;
  flex: 1;
  transition: all 0.3s ease;
  background: ${props => props.active ? 
    (props.strength === 'strong' ? 'linear-gradient(90deg, #10b981, #34d399)' : 
     props.strength === 'medium' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
     'linear-gradient(90deg, #ef4444, #f87171)') : 'linear-gradient(90deg, #f3f4f6, #e5e7eb)'};
  position: relative;
  overflow: hidden;
  
  &:not(:last-child) {
    margin-right: 2px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmerSoft} 1.5s infinite;
    opacity: ${props => props.active ? 1 : 0};
  }
`;

const StrengthText = styled.p`
  font-size: 0.95rem;
  color: ${props => props.strength === 'strong' ? '#10b981' : 
                   props.strength === 'medium' ? '#f59e0b' : 
                   props.strength === 'weak' ? '#ef4444' : '#6b7280'};
  font-weight: 600;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.2px;
`;

const StrengthChecklist = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
`;

const CheckItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: ${props => props.fulfilled ? '#10b981' : '#9ca3af'};
  transition: all 0.3s ease;
  
  svg {
    color: ${props => props.fulfilled ? '#10b981' : '#d1d5db'};
    font-size: 1rem;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
  }

  &:hover {
    transform: translateX(3px);
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.6rem;
  animation: ${floatGentle} 0.5s ease-out;
  
  label {
    position: absolute;
    top: 1rem;
    left: 3.5rem;
    font-weight: 600;
    color: #9ca3af;
    font-size: 1rem;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 2;
    background: transparent;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    top: -0.6rem;
    left: 2.8rem;
    font-size: 0.8rem;
    color: #ff6b6b;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
    padding: 0 0.6rem;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }
  
  input {
    padding: 1.2rem 1.2rem 1.2rem 3.5rem;
    height: 60px;
    transition: all 0.3s ease;
    font-size: 1rem;
    border-radius: 20px;
    border: 2px solid rgba(229, 231, 235, 0.8);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
    color: #1f2937;
    width: 100%;
    
    &::placeholder {
      color: transparent;
    }

    &:focus {
      border-color: #ff6b6b;
      box-shadow: 
        0 0 0 4px rgba(255, 107, 107, 0.15), 
        0 10px 25px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
      background: linear-gradient(135deg, #fff, #fff);
    }

    &:valid {
      border-color: #10b981;
      box-shadow: 
        0 0 0 4px rgba(16, 185, 129, 0.15),
        0 0 20px rgba(16, 185, 129, 0.08);
      position: relative;
      
      &::after {
        content: '✓';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8rem;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        animation: ${pulseSubtle} 2s infinite;
      }
    }
  }
  
  .input-icon {
    position: absolute;
    left: 1.4rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 1.3rem;
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  input:focus ~ .input-icon {
    color: #ff6b6b;
    transform: translateY(-50%) scale(1.05);
  }
  
  .password-toggle {
    position: absolute;
    right: 1.4rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.3rem;
    background: none;
    border: none;
    z-index: 1;
    border-radius: 50%;
    padding: 0.4rem;
    
    &:hover {
      color: #ff6b6b;
      transform: translateY(-50%) scale(1.15);
      background: rgba(255, 107, 107, 0.08);
      box-shadow: 0 2px 6px rgba(255, 107, 107, 0.15);
    }
  }
`;

const ErrorShake = css`
  animation: ${shakeMild} 0.6s ease-in-out;
`;

const AlertBox = styled.div`
  padding: 1.2rem;
  border-radius: 18px;
  margin-bottom: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: ${props => props.error ? 
    'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.06) 100%)' : 
    'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.06) 100%)'};
  color: ${props => props.error ? '#ef4444' : '#10b981'};
  font-weight: 500;
  font-size: 1rem;
  ${props => props.error ? ErrorShake : ''}
  border: 1px solid ${props => props.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  box-shadow: 
    0 6px 16px ${props => props.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.error ? '#ef4444' : '#10b981'}, ${props => props.error ? '#f87171' : '#34d399'});
  }
  
  svg {
    font-size: 1.3rem;
    flex-shrink: 0;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
  }
  
  button.close-alert {
    margin-left: auto;
    background: none;
    border: none;
    color: inherit;
    font-size: 1.3rem;
    padding: 0.4rem;
    opacity: 0.7;
    transition: all 0.3s ease;
    cursor: pointer;
    border-radius: 50%;
    
    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 576px) {
    padding: 1rem;
    font-size: 0.95rem;
    gap: 0.8rem;
  }
`;

const LoginTabsContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 45px;
  padding: 5px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(229, 231, 235, 0.6);
  display: flex;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: none !important;
  
  &::before {
    content: '';
    position: absolute;
    height: calc(100% - 10px);
    width: calc(50% - 5px);
    background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    border-radius: 40px;
    left: 5px;
    top: 5px;
    transition: left 0.5s ease;
    z-index: 1;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  ${props => props.activeTab === "login" && `
    &::before {
      left: 5px;
    }
  `}
  
  ${props => props.activeTab === "signup" && `
    &::before {
      left: calc(50% + 5px);
    }
  `}
  
  button {
    flex: 1;
    background: transparent;
    border: none;
    padding: 1rem 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    position: relative;
    z-index: 2;
    transition: all 0.4s ease;
    color: #6b7280;
    letter-spacing: 0.4px;
    border-radius: 40px;
    cursor: pointer;
    pointer-events: auto;
    
    &:first-of-type {
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
    }
    
    &:last-of-type {
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
    }
    
    &.active,
    &:hover:not(:disabled) {
      color: #fff;
      transform: translateY(-1px);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
    
    ${props => props.activeTab === "login" && `
      &:first-of-type { 
        color: #fff; 
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      }
      &:last-of-type { color: #6b7280; }
    `}
    
    ${props => props.activeTab === "signup" && `
      &:first-of-type { color: #6b7280; }
      &:last-of-type { 
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      }
    `}
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
  border: none;
  border-radius: 45px;
  padding: 1.1rem 3rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  width: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
  animation: ${gradientFlow} 2s ease infinite;
  cursor: pointer;
  pointer-events: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
    animation-duration: 0.8s;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    color: #9ca3af;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
    animation: none;
    &::before { display: none; }
  }
  
  .spinner {
    margin-right: 1rem;
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const GoogleButton = styled.button`
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 45px;
  padding: 1.1rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-top: 1.4rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  
  i {
    font-size: 1.3rem;
    color: #4285f4;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(66, 133, 244, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 45px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    border-color: rgba(66, 133, 244, 0.4);
    
    &::after {
      opacity: 1;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.9rem 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  margin-top: 1.2rem;
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  width: 100%;
  pointer-events: auto;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 100%;
    bottom: 0;
    left: 50%;
    background: linear-gradient(90deg, #ff6b6b, #ffd93d);
    transition: width 0.3s ease, left 0.3s ease;
    border-radius: 25px;
    transform: translateX(-50%);
  }
  
  &:hover:not(:disabled)::after {
    width: 100%;
    left: 0;
  }
  
  &:hover:not(:disabled) {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
  }
  
  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    border-color: rgba(156, 163, 175, 0.3);
    background: transparent;
    &::after { display: none; }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;
  margin: 2rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }
  
  &::before {
    margin-right: 1.4rem;
  }
  
  &::after {
    margin-left: 1.4rem;
  }
  
  span {
    padding: 0 1.4rem;
    white-space: nowrap;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
    border-radius: 18px;
    font-style: italic;
    font-size: 0.95rem;
  }
`;

// ========== COMPONENT FUNCTION ==========
const LoginModal = ({ onLoginSuccess }) => {
  const { login, signup, verifySignupOtp, forgotPassword, resetPassword, googleLogin } = useAuth();
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ message: "", isError: false });
  const [activeTab, setActiveTab] = useState("login");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [signupPasswordStrength, setSignupPasswordStrength] = useState(null);
  const [resetPasswordStrength, setResetPasswordStrength] = useState(null);
  const otpRefs = useRef([]);

  // Password requirement checks
  const hasMinLength = password => password.length >= 8;
  const hasUppercase = password => /[A-Z]/.test(password);
  const hasLowercase = password => /[a-z]/.test(password);
  const hasNumber = password => /\d/.test(password);
  const hasSpecialChar = password => /[^A-Za-z0-9]/.test(password);

  const getPasswordScore = (password) => {
    if (!password) return 0;
    let score = 0;
    if (hasMinLength(password)) score += 1;
    if (hasUppercase(password)) score += 1;
    if (hasLowercase(password)) score += 1;
    if (hasNumber(password)) score += 1;
    if (hasSpecialChar(password)) score += 1;
    return score;
  };

  const getPasswordStrength = (score) => {
    if (score >= 4) return 'strong';
    if (score >= 3) return 'medium';
    if (score >= 1) return 'weak';
    return null;
  };

  const handleFocus = (e) => {
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.placeholder = e.target.getAttribute("data-placeholder");
    }
  };

  const resetForm = () => {
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
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setNotification({ message: "", isError: false });
    setActiveTab("login");
    setResendCooldown(0);
    setSignupPasswordStrength(null);
    setResetPasswordStrength(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    if (!loginEmail || !loginPassword) {
      setNotification({ message: "Please enter both email and password", isError: true });
      return;
    }
    
    setIsLoading(true);
    const { success, error: loginError } = await login(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => window.location.reload(), 100);
        }
      }, 2500);
    } else {
      if (loginError === "User not found") {
        setNotification({ message: "User not found. Please check your email.", isError: true });
      } else if (loginError === "Invalid credentials") {
        setNotification({ message: "Invalid password. Please try again.", isError: true });
      } else {
        setNotification({ message: loginError || "Login failed. Please try again.", isError: true });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setNotification({ message: "", isError: false });
    setIsLoading(true);
    const { success, error: googleError } = await googleLogin();
    setIsLoading(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => window.location.reload(), 100);
        }
      }, 2500);
    } else {
      setNotification({ message: googleError || "Google login failed. Please try again.", isError: true });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setNotification({ message: "Please fill all fields", isError: true });
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setNotification({ message: "Passwords don't match", isError: true });
      return;
    }
    
    const score = getPasswordScore(signupPassword);
    if (getPasswordStrength(score) !== 'strong') {
      setNotification({ message: "Please create a stronger password", isError: true });
      return;
    }
    
    setIsLoading(true);
    const { success, error: signupError } = await signup(signupName, signupEmail, signupPassword);
    setIsLoading(false);
    
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setActiveTab("verify-signup");
      setResendCooldown(30);
      setNotification({ message: "OTP sent to your email", isError: false });
    } else {
      setNotification({ message: signupError || "Signup failed. Please try again.", isError: true });
    }
  };

  const handleVerifySignupSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    const otpValue = otp.join("");
    if (!otpValue) {
      setNotification({ message: "Please enter the OTP", isError: true });
      return;
    }
    
    setIsLoading(true);
    const { success, error: verifyError } = await verifySignupOtp(signupEmail, otpValue);
    setIsLoading(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          setTimeout(() => window.location.reload(), 100);
        }
      }, 2500);
    } else {
      setNotification({ message: verifyError || "Invalid OTP. Please try again.", isError: true });
    }
  };

  const handleResendSignupOtp = async () => {
    setNotification({ message: "", isError: false });
    setIsLoading(true);
    const { success, error: signupError } = await signup(signupName, signupEmail, signupPassword);
    setIsLoading(false);
    if (success) {
      setResendCooldown(30);
      setNotification({ message: "OTP resent successfully!", isError: false });
    } else {
      setNotification({ message: signupError || "Failed to resend OTP. Please try again.", isError: true });
    }
  };

  const handleForgotPasswordClick = () => {
    setActiveTab("forgot");
    setNotification({ message: "", isError: false });
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    if (!forgotEmail) {
      setNotification({ message: "Please enter your email", isError: true });
      return;
    }
    
    setIsLoading(true);
    const { success, error: forgotError } = await forgotPassword(forgotEmail);
    setIsLoading(false);
    
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setActiveTab("reset");
      setResendCooldown(30);
      setNotification({ message: "OTP sent to your email", isError: false });
    } else {
      setNotification({ message: forgotError || "Failed to send OTP. Please try again.", isError: true });
    }
  };

  const handleResendOtp = async () => {
    setNotification({ message: "", isError: false });
    setIsLoading(true);
    const { success, error: forgotError } = await forgotPassword(forgotEmail);
    setIsLoading(false);
    if (success) {
      setResendCooldown(30);
      setNotification({ message: "OTP resent successfully!", isError: false });
    } else {
      setNotification({ message: forgotError || "Failed to resend OTP. Please try again.", isError: true });
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!isNaN(paste)) {
      const newOtp = paste.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      if (otpRefs.current[5]) otpRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });
    
    const otpValue = otp.join("");
    if (!otpValue || !newPassword || !confirmNewPassword) {
      setNotification({ message: "Please fill all fields", isError: true });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setNotification({ message: "Passwords don't match", isError: true });
      return;
    }
    
    const score = getPasswordScore(newPassword);
    if (getPasswordStrength(score) !== 'strong') {
      setNotification({ message: "Please create a stronger password", isError: true });
      return;
    }
    
    setIsLoading(true);
    const { success, error: resetError } = await resetPassword(
      forgotEmail, 
      otpValue, 
      newPassword, 
      confirmNewPassword
    );
    setIsLoading(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        const modal = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 2500);
    } else {
      setNotification({ message: resetError || "Password reset failed. Please try again.", isError: true });
    }
  };

  useEffect(() => {
    const modal = document.getElementById("loginModal");
    const handleModalHide = () => {
      resetForm();
      setShowSuccess(false);
      setIsLoading(false);
    };
    if (modal) {
      modal.addEventListener("hidden.bs.modal", handleModalHide);
      return () => modal.removeEventListener("hidden.bs.modal", handleModalHide);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    const score = getPasswordScore(signupPassword);
    setSignupPasswordStrength(getPasswordStrength(score));
  }, [signupPassword]);

  useEffect(() => {
    const score = getPasswordScore(newPassword);
    setResetPasswordStrength(getPasswordStrength(score));
  }, [newPassword]);

  // Confetti particles
  const confettiParticles = Array.from({ length: 40 }).map((_, i) => (
    <ConfettiParticle
      key={i}
      color={["#ff6b6b", "#10b981", "#ffd93d", "#3b82f6", "#8b5cf6"][Math.floor(Math.random() * 5)]}
      top={Math.random() * 100}
      left={Math.random() * 100}
      delay={Math.random() * 1.2}
      size={`${Math.floor(Math.random() * 6) + 4}px`}
      shape={Math.random() > 0.5 ? 'circle' : 'square'}
    />
  ));

  const renderPasswordStrength = (password, strength, isSignup = true) => {
    if (!password) return null;
    const score = getPasswordScore(password);
    const currentStrength = getPasswordStrength(score);
    return (
      <PasswordStrengthContainer>
        <StrengthText strength={currentStrength || 'weak'}>
          Password Strength: {currentStrength ? currentStrength.toUpperCase() : 'NONE'}
        </StrengthText>
        <StrengthBarContainer>
          {Array.from({length: 5}).map((_, i) => (
            <StrengthBarSegment 
              key={i} 
              active={i < score}
              strength={currentStrength || 'weak'}
            />
          ))}
        </StrengthBarContainer>
        <StrengthChecklist>
          <CheckItem fulfilled={hasMinLength(password)}>
            <FiCheck /> At least 8 characters
          </CheckItem>
          <CheckItem fulfilled={hasUppercase(password)}>
            <FiCheck /> One uppercase letter
          </CheckItem>
          <CheckItem fulfilled={hasLowercase(password)}>
            <FiCheck /> One lowercase letter
          </CheckItem>
          <CheckItem fulfilled={hasNumber(password)}>
            <FiCheck /> One number
          </CheckItem>
          <CheckItem fulfilled={hasSpecialChar(password)}>
            <FiCheck /> One special character
          </CheckItem>
        </StrengthChecklist>
      </PasswordStrengthContainer>
    );
  };

  const renderPasswordToggle = (showPassword, setShowPassword) => (
    <button 
      type="button" 
      className="password-toggle" 
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>
  );

  return (
    <>
      <style>{`
        .modal-backdrop { 
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%) !important;
          backdrop-filter: blur(12px) !important;
          transition: all 0.3s ease;
        }
        .modal { 
          backdrop-filter: none !important; 
        }
        .modal-content {
          backdrop-filter: none !important; 
          -webkit-backdrop-filter: none !important;
          pointer-events: auto !important;
        }
        .modal-dialog {
          pointer-events: auto !important;
        }
        .btn-close-custom {
          filter: invert(0.5);
        }
        .modal-content * {
          text-shadow: none;
          pointer-events: auto;
        }
        .form-control, button, input {
          pointer-events: auto !important;
        }
        input:valid::after {
          content: '✓';
        }
      `}</style>
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <ModalDialog className="modal-dialog modal-dialog-centered">
          <ModalContent className="modal-content">
            <ModalHeader className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Flavor Fleet
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={isLoading}
              />
            </ModalHeader>
            <ModalBody className="modal-body">
              {showSuccess ? (
                <SuccessAnimation>
                  {confettiParticles}
                  <SuccessIcon>
                    <FiCheck />
                  </SuccessIcon>
                  <SuccessTitle>Welcome Aboard!</SuccessTitle>
                  <SuccessMessage>You're now part of the Flavor Fleet family. Bon appétit!</SuccessMessage>
                </SuccessAnimation>
              ) : (
                <>
                  {["login", "signup"].includes(activeTab) && (
                    <LoginTabsContainer activeTab={activeTab}>
                      <button 
                        onClick={() => !isLoading && setActiveTab("login")}
                        disabled={isLoading}
                        className={activeTab === "login" ? "active" : ""}
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => !isLoading && setActiveTab("signup")}
                        disabled={isLoading}
                        className={activeTab === "signup" ? "active" : ""}
                      >
                        Join Us
                      </button>
                    </LoginTabsContainer>
                  )}
                  
                  {notification.message && (
                    <AlertBox error={notification.isError}>
                      {notification.isError ? <FiAlertCircle /> : <FiCheck />}
                      <span>{notification.message}</span>
                      <button 
                        className="close-alert"
                        onClick={() => setNotification({ message: "", isError: false })}
                        aria-label="Dismiss notification"
                      >
                        &times;
                      </button>
                    </AlertBox>
                  )}

                  {activeTab === "login" && (
                    <form onSubmit={handleLoginSubmit}>
                      <InputGroup>
                        <input 
                          type="email" 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Email Address</label>
                        <FiMail className="input-icon" />
                      </InputGroup>
                      <InputGroup>
                        <input 
                          type={showLoginPassword ? "text" : "password"} 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Password</label>
                        <FiLock className="input-icon" />
                        {renderPasswordToggle(showLoginPassword, setShowLoginPassword)}
                      </InputGroup>
                      <PrimaryButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </PrimaryButton>
                      <LinkButton type="button" onClick={handleForgotPasswordClick} disabled={isLoading}>
                        Forgot Password?
                      </LinkButton>
                      <Divider>
                        <span>or continue with</span>
                      </Divider>
                      <GoogleButton type="button" onClick={handleGoogleLogin} disabled={isLoading}>
                        <i className="fab fa-google"></i>
                        Google
                      </GoogleButton>
                    </form>
                  )}

                  {activeTab === "signup" && (
                    <form onSubmit={handleSignupSubmit}>
                      <InputGroup>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your full name"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Full Name</label>
                        <FiUser className="input-icon" />
                      </InputGroup>
                      <InputGroup>
                        <input 
                          type="email" 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Email Address</label>
                        <FiMail className="input-icon" />
                      </InputGroup>
                      <InputGroup>
                        <input 
                          type={showSignupPassword ? "text" : "password"} 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Password</label>
                        <FiLock className="input-icon" />
                        {renderPasswordToggle(showSignupPassword, setShowSignupPassword)}
                      </InputGroup>
                      <InputGroup>
                        <input 
                          type={showSignupConfirmPassword ? "text" : "password"} 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Confirm your password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Confirm Password</label>
                        <FiLock className="input-icon" />
                        {renderPasswordToggle(showSignupConfirmPassword, setShowSignupConfirmPassword)}
                      </InputGroup>
                      {renderPasswordStrength(signupPassword, signupPasswordStrength)}
                      <PrimaryButton type="submit" disabled={isLoading || signupPasswordStrength !== 'strong'}>
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Creating Account...
                          </>
                        ) : (
                          "Join Flavor Fleet"
                        )}
                      </PrimaryButton>
                      <Divider>
                        <span>or continue with</span>
                      </Divider>
                      <GoogleButton type="button" onClick={handleGoogleLogin} disabled={isLoading}>
                        <i className="fab fa-google"></i>
                        Google
                      </GoogleButton>
                    </form>
                  )}

                  {activeTab === "verify-signup" && (
                    <form onSubmit={handleVerifySignupSubmit}>
                      <p style={{ textAlign: 'center', marginBottom: '1.6rem', fontSize: '1.1rem', color: '#374151', fontWeight: 500, lineHeight: 1.4 }}>
                        Verify your email by entering the 6-digit code sent to <strong>{signupEmail}</strong>
                      </p>
                      <OtpInputContainer>
                        {otp.map((digit, index) => (
                          <OtpInput
                            key={index}
                            ref={el => otpRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(index, e.target.value)}
                            onPaste={handleOtpPaste}
                            className={digit ? 'filled' : ''}
                            autoFocus={index === 0}
                            autoComplete="one-time-code"
                          />
                        ))}
                      </OtpInputContainer>
                      <ResendButton 
                        type="button" 
                        onClick={handleResendSignupOtp}
                        disabled={resendCooldown > 0 || isLoading}
                      >
                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                      </ResendButton>
                      <PrimaryButton type="submit" disabled={isLoading || otp.join("") === ""}>
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Verifying...
                          </>
                        ) : (
                          "Verify Email"
                        )}
                      </PrimaryButton>
                      <LinkButton type="button" onClick={() => setActiveTab("signup")} disabled={isLoading}>
                        Back to Signup
                      </LinkButton>
                    </form>
                  )}

                  {activeTab === "forgot" && (
                    <form onSubmit={handleForgotPasswordSubmit}>
                      <InputGroup>
                        <input 
                          type="email" 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter your email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Email Address</label>
                        <FiMail className="input-icon" />
                      </InputGroup>
                      <PrimaryButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Sending Code...
                          </>
                        ) : (
                          "Send Reset Code"
                        )}
                      </PrimaryButton>
                      <LinkButton type="button" onClick={() => setActiveTab("login")} disabled={isLoading}>
                        Back to Sign In
                      </LinkButton>
                    </form>
                  )}

                  {activeTab === "reset" && (
                    <form onSubmit={handleResetPasswordSubmit}>
                      <p style={{ textAlign: 'center', marginBottom: '1.6rem', fontSize: '1.1rem', color: '#374151', fontWeight: 500, lineHeight: 1.4 }}>
                        Reset your password. Enter the code sent to <strong>{forgotEmail}</strong>
                      </p>
                      <OtpInputContainer>
                        {otp.map((digit, index) => (
                          <OtpInput
                            key={index}
                            ref={el => otpRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(index, e.target.value)}
                            onPaste={handleOtpPaste}
                            className={digit ? 'filled' : ''}
                            autoFocus={index === 0}
                            autoComplete="one-time-code"
                          />
                        ))}
                      </OtpInputContainer>
                      <ResendButton 
                        type="button" 
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || isLoading}
                      >
                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                      </ResendButton>
                      <InputGroup>
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>New Password</label>
                        <FiLock className="input-icon" />
                        {renderPasswordToggle(showNewPassword, setShowNewPassword)}
                      </InputGroup>
                      <InputGroup>
                        <input 
                          type={showConfirmNewPassword ? "text" : "password"} 
                          className="form-control"
                          placeholder=" "
                          data-placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          required
                        />
                        <label>Confirm New Password</label>
                        <FiLock className="input-icon" />
                        {renderPasswordToggle(showConfirmNewPassword, setShowConfirmNewPassword)}
                      </InputGroup>
                      {renderPasswordStrength(newPassword, resetPasswordStrength, false)}
                      <PrimaryButton type="submit" disabled={isLoading || resetPasswordStrength !== 'strong' || otp.join("") === ""}>
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </PrimaryButton>
                      <LinkButton type="button" onClick={() => setActiveTab("forgot")} disabled={isLoading}>
                        Back
                      </LinkButton>
                    </form>
                  )}
                </>
              )}
            </ModalBody>
          </ModalContent>
        </ModalDialog>
      </div>
    </> 
  );
};

export default LoginModal;