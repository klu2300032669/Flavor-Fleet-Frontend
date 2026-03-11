// Hero.jsx - Modern Swiggy-Inspired Design
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 100px 20px 60px;
  
  @media (max-width: 768px) {
    min-height: 90vh;
    padding: 120px 20px 40px;
  }
`;

const HeroContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  animation: ${slideInLeft} 0.8s ease-out;
  
  @media (max-width: 968px) {
    order: 2;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  color: #dc2626;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(220, 38, 38, 0.1);
  
  span {
    font-size: 16px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -1.5px;
  
  span {
    background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 968px) {
    font-size: 42px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 540px;
  
  @media (max-width: 968px) {
    margin: 0 auto 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 560px;
  
  @media (max-width: 968px) {
    margin: 0 auto;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
    border-color: #111827;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 16px 20px;
  font-size: 16px;
  color: #1f2937;
  background: transparent;
  font-weight: 500;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: #ffffff;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(17, 24, 39, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px;
  }
`;

const PopularSearches = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const PopularLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const PopularTag = styled.button`
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e5e7eb;
    color: #111827;
    transform: translateY(-2px);
  }
`;

const Features = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 50px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  text-align: left;
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }
  
  p {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }
  
  @media (max-width: 968px) {
    text-align: center;
  }
  
  @media (max-width: 480px) {
    text-align: left;
  }
`;

const HeroImage = styled.div`
  position: relative;
  animation: ${slideInRight} 0.8s ease-out;
  
  @media (max-width: 968px) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const ImageDecoration = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  z-index: -1;
  
  &.decoration-1 {
    top: -20px;
    right: -20px;
    opacity: 0.6;
  }
  
  &.decoration-2 {
    bottom: -30px;
    left: -30px;
    opacity: 0.4;
    width: 180px;
    height: 180px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    
    &.decoration-2 {
      width: 120px;
      height: 120px;
    }
  }
`;

const StatsCard = styled.div`
  position: absolute;
  background: white;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 1s ease-out 0.5s both;
  
  &.stats-1 {
    top: 20px;
    left: -20px;
  }
  
  &.stats-2 {
    bottom: 40px;
    right: -20px;
  }
  
  @media (max-width: 968px) {
    &.stats-1 {
      left: 10px;
    }
    
    &.stats-2 {
      right: 10px;
    }
  }
`;

const StatsNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const StatsLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

// Component
const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/menu");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePopularSearch = (term) => {
    setSearchTerm(term);
    navigate(`/menu?search=${encodeURIComponent(term)}`);
  };

  return (
    <HeroSection>
      <HeroContainer>
        {/* Left Content */}
        <HeroContent>
          <Badge>
            <span>🔥</span> #1 Food Delivery Service
          </Badge>
          
          <HeroTitle>
            Your Favorite Food
            <br />
            Delivered <span>Hot & Fresh</span>
          </HeroTitle>
          
          <HeroSubtitle>
            Order from the best local restaurants with easy, on-demand delivery. 
            Fresh ingredients, amazing flavors, right to your doorstep.
          </HeroSubtitle>
          
          <SearchContainer>
            <SearchWrapper>
              <SearchInput
                type="text"
                placeholder="Search for restaurants or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SearchButton onClick={handleSearch}>
                Search Food
              </SearchButton>
            </SearchWrapper>
            
            <PopularSearches>
              <PopularLabel>Popular:</PopularLabel>
              <PopularTag onClick={() => handlePopularSearch("Pizza")}>
                🍕 Pizza
              </PopularTag>
              <PopularTag onClick={() => handlePopularSearch("Burger")}>
                🍔 Burger
              </PopularTag>
              <PopularTag onClick={() => handlePopularSearch("Sushi")}>
                🍱 Sushi
              </PopularTag>
            </PopularSearches>
          </SearchContainer>
          
          <Features>
            <Feature>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureText>
                <h4>Fast Delivery</h4>
                <p>Within 30 minutes</p>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureText>
                <h4>Live Tracking</h4>
                <p>Track your order</p>
              </FeatureText>
            </Feature>
          </Features>
        </HeroContent>
        
        {/* Right Image */}
        <HeroImage>
          <ImageDecoration className="decoration-1" />
          <ImageDecoration className="decoration-2" />
          
          <ImageWrapper>
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
              alt="Delicious Food"
              loading="eager"
            />
            
            <StatsCard className="stats-1">
              <StatsNumber>5000+</StatsNumber>
              <StatsLabel>Happy Customers</StatsLabel>
            </StatsCard>
            
            <StatsCard className="stats-2">
              <StatsNumber>4.8 ⭐</StatsNumber>
              <StatsLabel>Average Rating</StatsLabel>
            </StatsCard>
          </ImageWrapper>
        </HeroImage>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
