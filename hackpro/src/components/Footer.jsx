import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 50px 0 20px;
  background: #1a1a1a;
  text-align: center;
  color: #ddd;
  position: relative;

  @media (max-width: 768px) {
    padding: 30px 0 15px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 25px;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
`;

const FooterBrand = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterLogo = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: #ff4081;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const FooterTagline = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #aaa;
  letter-spacing: 0.5px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: color 0.3s ease;
    padding: 5px;

    &:hover, &:focus {
      color: #ff4081;
      outline: none;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;
    font-size: 14px;
  }
`;

const SocialMedia = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: #ddd;
    font-size: 24px;
    transition: all 0.3s ease;
    padding: 5px;

    &:hover, &:focus {
      color: #ff4081;
      transform: scale(1.1);
      outline: none;
    }
  }

  @media (max-width: 768px) {
    gap: 10px;
    font-size: 20px;
  }
`;

const FooterCopyright = styled.p`
  font-size: 12px;
  color: #aaa;
  margin-top: 15px;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 10px;
  }
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #ff4081;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  z-index: 1002;
  cursor: pointer;

  &:hover {
    background: #ffd740;
    transform: translateY(-5px);
  }

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
`;

function Footer() {
  const location = useLocation();
  const excludedPaths = ["/menu", "/contact-us", "/aboutus"];
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return !excludedPaths.includes(location.pathname) ? (
    <FooterWrapper aria-label="Site footer">
      <BackToTopButton 
        visible={showBackToTop} 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <i className="fas fa-arrow-up" aria-hidden="true"></i>
      </BackToTopButton>
      <FooterContent>
        <FooterBrand>
          <FooterLogo>Flavor Fleet</FooterLogo>
          <FooterTagline>A Culinary Voyage</FooterTagline>
        </FooterBrand>
        <FooterLinks>
          <a href="#" className="footer-link" aria-label="Privacy Policy">Privacy</a>
          <a href="#" className="footer-link" aria-label="Terms of Service">Terms</a>
          <a href="#" className="footer-link" aria-label="Support">Support</a>
        </FooterLinks>
        <SocialMedia aria-label="Social media links">
          <a href="#" className="social-icon" aria-label="Facebook">
            <i className="fab fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Instagram">
            <i className="fab fa-instagram" aria-hidden="true"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Twitter">
            <i className="fab fa-twitter" aria-hidden="true"></i>
          </a>
          <a href="#" className="social-icon" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in" aria-hidden="true"></i>
          </a>
        </SocialMedia>
      </FooterContent>
      <FooterCopyright>© 2025 Flavor Fleet. Crafted with Love.</FooterCopyright>
    </FooterWrapper>
  ) : null;
}

export default Footer;
