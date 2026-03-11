// Footer.jsx - Redesigned with About Us and Contact Us
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 60px 0 30px;
  background: #111827;
  text-align: center;
  color: #e5e7eb;
  position: relative;

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-width: 1200px;
  margin: 0 auto 40px;
  gap: 40px;
  padding: 0 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 35px;
    padding: 0 20px;
  }
`;

const FooterColumn = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterBrand = styled(FooterColumn)``;

const FooterLogo = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const FooterTagline = styled.p`
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
`;

const FooterLinks = styled(FooterColumn)`
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 12px;
  }

  a {
    color: #d1d5db;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    transition: color 0.3s ease;
    display: inline-block;

    &:hover {
      color: #ffffff;
    }
  }
`;

const SocialMedia = styled(FooterColumn)`
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  div {
    display: flex;
    gap: 16px;
    justify-content: flex-start;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  a {
    color: #d1d5db;
    font-size: 22px;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 25px;
  margin-top: 40px;
`;

const FooterCopyright = styled.p`
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #111827;
  color: white;
  border: 2px solid #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transform: ${({ $visible }) => ($visible ? "scale(1)" : "scale(0.8)")};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  z-index: 1002;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: #1f2937;
  }

  @media (max-width: 768px) {
    bottom: 80px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 16px;
  }
`;

function Footer() {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Only show footer on home page
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <FooterWrapper>
      <BackToTopButton
        $visible={showBackToTop}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </BackToTopButton>

      <FooterContent>
        <FooterBrand>
          <FooterLogo>Flavor Fleet</FooterLogo>
          <FooterTagline>Delicious food delivered to your door</FooterTagline>
        </FooterBrand>

        <FooterLinks>
          <h4>Company</h4>
          <ul>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/partner">Partner With Us</Link></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </FooterLinks>

        <FooterLinks>
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </FooterLinks>

        <SocialMedia>
          <h4>Follow Us</h4>
          <div>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
        </SocialMedia>
      </FooterContent>

      <FooterBottom>
        <FooterCopyright>
          © {new Date().getFullYear()} Flavor Fleet. All rights reserved.
        </FooterCopyright>
      </FooterBottom>
    </FooterWrapper>
  );
}

export default React.memo(Footer);
