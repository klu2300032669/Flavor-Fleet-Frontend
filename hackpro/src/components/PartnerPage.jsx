// PartnerPage.jsx - Modern Professional Design
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // NEW: Import axios for API calls

// Animations
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  padding: 100px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') bottom center/cover no-repeat;
    opacity: 0.1;
  }

  @media (max-width: 768px) {
    padding: 80px 20px 60px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  span {
    font-size: 16px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${scaleIn} 0.6s ease-out;
  animation-delay: ${props => props.$delay || '0s'};
  animation-fill-mode: both;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FormContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${slideInLeft} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const FormTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
`;

const FormSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    color: #dc2626;
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #111827;
  transition: all 0.3s ease;
  background: #f9fafb;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #111827;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #111827;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #111827;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  option {
    padding: 10px;
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #111827;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  background: #f9fafb;
  transition: all 0.3s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #111827;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: #ffffff;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(17, 24, 39, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const BenefitsContainer = styled.div`
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const BenefitsTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const BenefitsSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BenefitCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: ${slideInLeft} 0.6s ease-out;
  animation-delay: ${props => props.$delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const BenefitIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.$bg || 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

const BenefitDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 60px 40px;
  animation: ${scaleIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SuccessTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 12px;
`;

const SuccessMessage = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
`;

const BackButton = styled.button`
  margin-top: 24px;
  padding: 12px 32px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
  }
`;

// NEW: Error message styled component
const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 8px;
`;

// Component
function PartnerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    cuisineType: "",
    address: "",
    city: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null); // NEW: State for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null); // Clear previous error

    try {
      const response = await axios.post(
        'http://localhost:8885/api/partners/apply', // Replace with your actual backend URL/port
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Partner application submitted:", response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.response) {
        // Backend specific error (e.g., duplicate email)
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // No response from server
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Badge>
            <span>🚀</span> Grow Your Business
          </Badge>
          <HeroTitle>Partner With Flavor Fleet</HeroTitle>
          <HeroSubtitle>
            Join thousands of restaurants delivering success every day. 
            Expand your reach and grow your revenue with our platform.
          </HeroSubtitle>

          <StatsRow>
            <StatCard $delay="0.2s">
              <StatNumber>10,000+</StatNumber>
              <StatLabel>Active Users</StatLabel>
            </StatCard>
            <StatCard $delay="0.4s">
              <StatNumber>500+</StatNumber>
              <StatLabel>Partner Restaurants</StatLabel>
            </StatCard>
            <StatCard $delay="0.6s">
              <StatNumber>4.8★</StatNumber>
              <StatLabel>Average Rating</StatLabel>
            </StatCard>
          </StatsRow>
        </HeroContent>
      </HeroSection>

      {/* Main Content */}
      <ContentSection>
        {isSubmitted ? (
          <SuccessCard>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>Application Submitted Successfully!</SuccessTitle>
            <SuccessMessage>
              Thank you for your interest in partnering with Flavor Fleet. 
              Our team will review your application and get back to you within 24-48 hours.
            </SuccessMessage>
            <BackButton onClick={handleBackHome}>
              Back to Home
            </BackButton>
          </SuccessCard>
        ) : (
          <SectionGrid>
            {/* Form Section */}
            <FormContainer>
              <FormTitle>Get Started Today</FormTitle>
              <FormSubtitle>
                Fill out the form below and our team will contact you shortly
              </FormSubtitle>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>
                    Restaurant Name <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., The Golden Spoon"
                    disabled={isSubmitting}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Owner/Manager Name <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., John Doe"
                    disabled={isSubmitting}
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label>
                      Email Address <span>*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      Phone Number <span>*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 000-0000"
                      disabled={isSubmitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>
                    Cuisine Type <span>*</span>
                  </Label>
                  <Select
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select your cuisine type</option>
                    <option value="indian">🍛 Indian</option>
                    <option value="chinese">🥡 Chinese</option>
                    <option value="italian">🍝 Italian</option>
                    <option value="mexican">🌮 Mexican</option>
                    <option value="american">🍔 American</option>
                    <option value="japanese">🍱 Japanese</option>
                    <option value="thai">🍜 Thai</option>
                    <option value="mediterranean">🥙 Mediterranean</option>
                    <option value="other">🍴 Other</option>
                  </Select>
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label>
                      City <span>*</span>
                    </Label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g., New York"
                      disabled={isSubmitting}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      Address <span>*</span>
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Restaurant address"
                      disabled={isSubmitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>Additional Information</Label>
                  <TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your restaurant, specialties, and what makes you unique..."
                    disabled={isSubmitting}
                  />
                </FormGroup>

                {submitError && (
                  <ErrorMessage>{submitError}</ErrorMessage> // NEW: Display error message
                )}

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </SubmitButton>
              </Form>
            </FormContainer>

            {/* Benefits Section */}
            <BenefitsContainer>
              <BenefitsTitle>Why Partner With Us?</BenefitsTitle>
              <BenefitsSubtitle>
                Join our growing network of successful restaurant partners
              </BenefitsSubtitle>

              <BenefitsList>
                <BenefitCard $delay="0.2s">
                  <BenefitIcon $bg="linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)">
                    📈
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Increase Revenue</BenefitTitle>
                    <BenefitDescription>
                      Boost your sales by an average of 30% with access to thousands of hungry customers
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>

                <BenefitCard $delay="0.3s">
                  <BenefitIcon $bg="linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)">
                    🎯
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Targeted Marketing</BenefitTitle>
                    <BenefitDescription>
                      Reach the right customers with our advanced targeting and promotional tools
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>

                <BenefitCard $delay="0.4s">
                  <BenefitIcon $bg="linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)">
                    💰
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Low Commission Fees</BenefitTitle>
                    <BenefitDescription>
                      Competitive rates with transparent pricing and no hidden charges
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>

                <BenefitCard $delay="0.5s">
                  <BenefitIcon $bg="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)">
                    🛠️
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Easy Management</BenefitTitle>
                    <BenefitDescription>
                      Intuitive dashboard to manage orders, menu, and track real-time analytics
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>

                <BenefitCard $delay="0.6s">
                  <BenefitIcon $bg="linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)">
                    🚀
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Fast Onboarding</BenefitTitle>
                    <BenefitDescription>
                      Get started in just 48 hours with our simple onboarding process
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>

                <BenefitCard $delay="0.7s">
                  <BenefitIcon $bg="linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)">
                    🎧
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>24/7 Support</BenefitTitle>
                    <BenefitDescription>
                      Dedicated partner support team available round the clock to help you succeed
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitCard>
              </BenefitsList>
            </BenefitsContainer>
          </SectionGrid>
        )}
      </ContentSection>
    </PageWrapper>
  );
}

export default PartnerPage;