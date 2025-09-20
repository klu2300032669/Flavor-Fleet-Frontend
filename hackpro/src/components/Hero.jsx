// Hero.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: #fafafa;

  @media (max-width: 768px) {
    height: 100vh;
    padding: 0 20px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const LeftImage = styled.div`
  flex: 1;
  background: url('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260') no-repeat center/cover;
  filter: brightness(0.95) contrast(1.05);
  transition: filter 0.3s ease;
`;

const RightImage = styled.div`
  flex: 1;
  background: url('https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1600') no-repeat center/cover;
  filter: brightness(0.95) contrast(1.05);
  transition: filter 0.3s ease;
`;

const CenterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 64, 129, 0.92), rgba(255, 215, 64, 0.92));
  clip-path: polygon(15% 0, 85% 0, 100% 100%, 0% 100%);
  opacity: 0.88;
  z-index: 1;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    width: 100%;
    clip-path: none;
    background: linear-gradient(180deg, rgba(255, 64, 129, 0.88), rgba(255, 215, 64, 0.88));
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 30px;
  animation: fadeIn 1.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HeroTitle = styled.h1`
  font-size: 65px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1.2px;
  margin-bottom: 25px;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    font-size: 45px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 45px;
  opacity: 0.92;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 60px;
  padding: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
  max-width: 650px;
  margin: 0 auto;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 15px;
    border-radius: 40px;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 14px 25px;
  font-size: 17px;
  color: #333;
  background: transparent;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #ff4081, #ffd740);
  color: #fff;
  border: none;
  padding: 14px 35px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 15px rgba(255, 64, 129, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 0;
  }
`;

const CtaButton = styled(Link)`
  display: inline-block;
  margin-top: 35px;
  padding: 15px 45px;
  background: linear-gradient(90deg, #ffd740, #ff4081);
  color: #fff;
  font-size: 19px;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(255, 64, 129, 0.3);
  }
`;

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

  return (
    <HeroSection>
      <HeroBackground>
        <LeftImage />
        <RightImage />
      </HeroBackground>
      <CenterOverlay />
      <HeroContent>
        <HeroTitle>Discover Delicious Delights</HeroTitle>
        <HeroSubtitle>Explore a world of flavors delivered right to your door.</HeroSubtitle>
        <SearchBar>
          <Input
            type="text"
            placeholder="Search for dishes, restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSearch}>
            Search
          </Button>
        </SearchBar>
        <CtaButton to="/menu">Browse Menu</CtaButton>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
