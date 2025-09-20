// Services.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ServicesSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(180deg, #f8f8f8, #fff);

  @media (max-width: 768px) {
    padding: 50px 0;
  }
`;

const ServicesTitle = styled.h2`
  font-size: 45px;
  font-weight: 700;
  margin-bottom: 50px;
  color: #333;
  text-align: center;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 35px;
    margin-bottom: 35px;
  }
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 60px;
  opacity: 0;
  transform: translateX(100px);
  transition: opacity 0.8s ease, transform 0.8s ease;

  &.visible {
    opacity: 1;
    transform: translateX(0);
  }

  &.reverse {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 40px;

    &.reverse {
      flex-direction: column;
    }
  }
`;

const ServiceImage = styled.div`
  flex: 1;
  height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    height: 250px;
    width: 100%;
    margin-bottom: 20px;
  }
`;

const ServiceContent = styled.div`
  flex: 1;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
    text-align: center;
  }
`;

const ServiceIcon = styled.i`
  font-size: 50px;
  color: #ff4081;
  margin-bottom: 20px;
  display: block;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const ServiceTitle = styled.h5`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ServiceDescription = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #666;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Services = () => {
  const serviceRefs = useRef([]);
  const [visible, setVisible] = useState([false, false, false]);

  useEffect(() => {
    const observers = serviceRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            observer.unobserve(ref);
          }
        },
        { threshold: 0.1 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  return (
    <ServicesSection>
      <ServicesTitle>Our Signature Services</ServicesTitle>
      <ServiceItem 
        ref={el => serviceRefs.current[0] = el}
        className={visible[0] ? 'visible' : ''}
      >
        <ServiceImage style={{ backgroundImage: "url('https://images.pexels.com/photos/4392879/pexels-photo-4392879.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />
        <ServiceContent>
          <ServiceIcon className="fas fa-truck" />
          <ServiceTitle>Swift Delivery</ServiceTitle>
          <ServiceDescription>Delectable meals arrive hot and fresh, right on time, ensuring every bite is as perfect as intended.</ServiceDescription>
        </ServiceContent>
      </ServiceItem>
      <ServiceItem 
        ref={el => serviceRefs.current[1] = el}
        className={`${visible[1] ? 'visible' : ''} reverse`}
      >
        <ServiceImage style={{ backgroundImage: "url('https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />
        <ServiceContent>
          <ServiceIcon className="fas fa-leaf" />
          <ServiceTitle>Green Commitment</ServiceTitle>
          <ServiceDescription>Sustainable packaging for a tastier, cleaner world, minimizing our environmental footprint with every order.</ServiceDescription>
        </ServiceContent>
      </ServiceItem>
      <ServiceItem 
        ref={el => serviceRefs.current[2] = el}
        className={visible[2] ? 'visible' : ''}
      >
        <ServiceImage style={{ backgroundImage: "url('https://images.pexels.com/photos/5916101/pexels-photo-5916101.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />
        <ServiceContent>
          <ServiceIcon className="fas fa-gift" />
          <ServiceTitle>Elite Offers</ServiceTitle>
          <ServiceDescription>Unwrap exclusive deals for a delightful experience, making every meal even more rewarding.</ServiceDescription>
        </ServiceContent>
      </ServiceItem>
    </ServicesSection>
  );
};

export default Services;
