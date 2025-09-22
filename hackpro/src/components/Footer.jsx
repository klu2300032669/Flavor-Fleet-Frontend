// Footer.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 60px 0 25px;
  background: linear-gradient(180deg, #1a1a1a, #0d0d0d);
  text-align: center;
  color: #ddd;
  position: relative;

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 30px;
  gap: 25px;
  padding: 0 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterColumn = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterBrand = styled(FooterColumn)`
`;

const FooterLogo = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: #ff6b6b;
  margin-bottom: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #ffd93d;
  }

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

const FooterLinks = styled(FooterColumn)`
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: color 0.3s ease, padding-left 0.3s ease;

    &:hover, &:focus {
      color: #ff6b6b;
      padding-left: 5px;
      outline: none;
    }
  }
`;

const SocialMedia = styled(FooterColumn)`
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 15px;
  }

  div {
    display: flex;
    gap: 15px;
    justify-content: flex-start;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  a {
    color: #ddd;
    font-size: 24px;
    transition: all 0.3s ease;
    padding: 5px;

    &:hover, &:focus {
      color: #ff6b6b;
      transform: scale(1.15) rotate(5deg);
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
  margin-top: 20px;
  letter-spacing: 0.5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 15px;
  }
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: linear-gradient(90deg, #ff6b6b, #ffd93d);
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
    transform: translateY(-5px) rotate(90deg);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
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
          <h4>Company</h4>
          <ul>
            <li><a href="/aboutus" className="footer-link" aria-label="About Us">About Us</a></li>
            <li><a href="/contact-us" className="footer-link" aria-label="Contact Us">Contact Us</a></li>
            <li><a href="#" className="footer-link" aria-label="Careers">Careers</a></li>
            <li><a href="#" className="footer-link" aria-label="Blog">Blog</a></li>
          </ul>
        </FooterLinks>
        <FooterLinks>
          <h4>Legal</h4>
          <ul>
            <li><a href="#" className="footer-link" aria-label="Privacy Policy">Privacy</a></li>
            <li><a href="#" className="footer-link" aria-label="Terms of Service">Terms</a></li>
            <li><a href="#" className="footer-link" aria-label="Cookie Policy">Cookies</a></li>
          </ul>
        </FooterLinks>
        <SocialMedia>
          <h4>Follow Us</h4>
          <div aria-label="Social media links">
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
          </div>
        </SocialMedia>
      </FooterContent>
      <FooterCopyright>© 2025 Flavor Fleet. Crafted with Love.</FooterCopyright>
    </FooterWrapper>
  ) : null;
}

export default Footer;