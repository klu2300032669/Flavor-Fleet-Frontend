import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styled, { keyframes, createGlobalStyle, css } from "styled-components";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import {
  FiCheckCircle, FiHome, FiMenu, FiUser, FiRefreshCw, FiMapPin,
  FiPackage, FiClock, FiTruck, FiCreditCard, FiArrowRight,
  FiStar, FiChevronRight,
} from "react-icons/fi";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL FONT
═══════════════════════════════════════════════════════════════ */
const GlobalFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap');
`;

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const D = {
  /* backgrounds */
  bg0:    "#0a0705",
  bg1:    "#100c09",
  bg2:    "#1a1410",
  bg3:    "#241c16",
  bg4:    "#2e241c",
  /* gold system */
  gold:   "#d4a853",
  goldL:  "#e8c47a",
  goldD:  "#b8922e",
  goldBg: "rgba(212,168,83,0.09)",
  goldGlow:"rgba(212,168,83,0.25)",
  /* semantic */
  cream:  "#f5ede0",
  creamD: "#c9b89a",
  muted:  "#7a6e62",
  border: "rgba(212,168,83,0.14)",
  borderH:"rgba(212,168,83,0.32)",
  /* status */
  sage:   "#7dab7e",
  sageBg: "rgba(125,171,126,0.12)",
  coral:  "#e07a5f",
  sky:    "#6aa3c8",
  skyBg:  "rgba(106,163,200,0.12)",
};

/* ═══════════════════════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════════════════════ */
const float = keyframes`
  0%,100%{ transform:translateY(0)   rotate(0deg);   }
  33%     { transform:translateY(-18px) rotate(2deg);  }
  66%     { transform:translateY(-8px)  rotate(-1deg); }
`;
const orbDrift = keyframes`
  0%,100%{ transform:translate(0,0) scale(1);     }
  40%     { transform:translate(40px,-30px) scale(1.08); }
  70%     { transform:translate(-20px,20px) scale(0.94); }
`;
const fadeUp = keyframes`
  from{ opacity:0; transform:translateY(22px); }
  to  { opacity:1; transform:translateY(0);    }
`;
const ringExpand = keyframes`
  0%  { transform:scale(0.5);  opacity:0.8; }
  100%{ transform:scale(1.8);  opacity:0;   }
`;
const stampDrop = keyframes`
  0%  { transform:scale(0) rotate(-20deg); opacity:0; }
  55% { transform:scale(1.15) rotate(3deg); opacity:1; }
  75% { transform:scale(0.95) rotate(-1deg); }
  100%{ transform:scale(1) rotate(0deg); opacity:1; }
`;
const shimmer = keyframes`
  0%  { background-position:-600px 0; }
  100%{ background-position: 600px 0; }
`;
const glint = keyframes`
  0%,90%,100%{ opacity:0; transform:translateX(-100%) skewX(-20deg); }
  92%         { opacity:1; }
  96%         { transform:translateX(300%) skewX(-20deg); opacity:0.4; }
`;
const confettiFall = keyframes`
  0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
  80%  { opacity:0.8; }
  100% { transform:translateY(105vh) rotate(540deg); opacity:0; }
`;
const tickerPulse = keyframes`
  0%,100%{ box-shadow:0 0 0 0 rgba(212,168,83,0.5); }
  50%    { box-shadow:0 0 0 10px rgba(212,168,83,0); }
`;
const progressGrow = keyframes`
  from{ width:0%; }
`;
const receiptSlide = keyframes`
  0%  { transform:translateY(-10px); opacity:0; }
  100%{ transform:translateY(0);     opacity:1; }
`;

/* ═══════════════════════════════════════════════════════════════
   CONFETTI DATA (stable — generated once outside render)
═══════════════════════════════════════════════════════════════ */
const CONFETTI_COLORS = [
  D.gold, D.goldL, "#e8a87c", D.sage, D.sky, "#c9a0dc", "#f5c6c6",
];
const CONFETTI_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x:   Math.sin(i * 1.3) * 50 + 50,
  w:   (i % 3 === 0) ? 6 : (i % 3 === 1) ? 9 : 5,
  h:   (i % 4 === 0) ? 14 : (i % 4 === 1) ? 7 : 10,
  r:   (i % 3 === 0) ? "50%" : (i % 3 === 1) ? "2px" : "0%",
  c:   CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  dur: 3.2 + (i % 7) * 0.4,
  del: (i % 10) * 0.15,
}));

const STEPS = [
  { label:"Confirmed",  icon:<FiCheckCircle /> },
  { label:"Preparing",  icon:<FiPackage />     },
  { label:"En Route",   icon:<FiTruck />       },
  { label:"Delivered",  icon:<FiStar />        },
];

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS — LAYOUT
═══════════════════════════════════════════════════════════════ */
const Page = styled.div`
  min-height: 100vh;
  background: ${D.bg0};
  font-family: 'Cabinet Grotesk', sans-serif;
  padding: 100px 20px 80px;
  position: relative;
  overflow: hidden;

  /* ambient glow orbs */
  &::before {
    content:"";
    position:fixed; inset:0;
    background:
      radial-gradient(ellipse 55% 40% at 15% 25%, rgba(212,168,83,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 45% at 85% 75%, rgba(125,171,126,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(106,163,200,0.03) 0%, transparent 80%);
    pointer-events:none;
    z-index:0;
  }

  /* noise texture overlay */
  &::after {
    content:"";
    position:fixed; inset:0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events:none; z-index:0; opacity:0.6;
  }
`;

const Confetti = styled.div`
  position:fixed;
  top:-20px;
  left:${({$x})=>$x}%;
  width:${({$w})=>$w}px;
  height:${({$h})=>$h}px;
  background:${({$c})=>$c};
  border-radius:${({$r})=>$r};
  animation:${confettiFall} ${({$dur})=>$dur}s ease-in ${({$del})=>$del}s both;
  z-index:1; pointer-events:none;
`;

const Wrap = styled.div`
  max-width: 560px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

/* ═══════════════════════════════════════════════════════════════
   CARD — the centrepiece
═══════════════════════════════════════════════════════════════ */
const Card = styled(motion.div)`
  background: linear-gradient(160deg, ${D.bg2} 0%, ${D.bg1} 60%, ${D.bg2} 100%);
  border: 1px solid ${D.border};
  border-radius: 28px;
  padding: 52px 44px 44px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.025) inset,
    0 2px 1px rgba(255,255,255,0.06) inset,
    0 50px 100px rgba(0,0,0,0.7),
    0 20px 40px rgba(0,0,0,0.4);

  /* gold top edge */
  &::before {
    content:"";
    position:absolute; top:0; left:10%; right:10%; height:1px;
    background:linear-gradient(90deg, transparent, ${D.gold}, transparent);
    opacity:0.6;
  }

  @media(max-width:560px){
    padding:40px 24px 36px;
    border-radius:22px;
  }
`;

const CardSheen = styled.div`
  position:absolute; inset:0; border-radius:28px; pointer-events:none;
  overflow:hidden;
  &::after {
    content:"";
    position:absolute; top:0; left:-100%; width:60%; height:100%;
    background:linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
    animation:${glint} 5s ease-in-out 1.5s infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   CHECK STAMP
═══════════════════════════════════════════════════════════════ */
const StampArea = styled.div`
  display:flex; justify-content:center; margin-bottom:28px;
`;

const StampOuter = styled.div`
  position:relative; width:100px; height:100px;
`;

const StampRing = styled.div`
  position:absolute; inset:0; border-radius:50%;
  border:1.5px solid ${D.gold};
  animation:${ringExpand} 1.6s ease-out 0.5s both;
`;

const StampRing2 = styled.div`
  position:absolute; inset:-8px; border-radius:50%;
  border:1px solid rgba(212,168,83,0.3);
  animation:${ringExpand} 1.6s ease-out 0.7s both;
`;

const StampCircle = styled.div`
  width:100px; height:100px; border-radius:50%;
  background:linear-gradient(135deg, ${D.gold} 0%, ${D.goldL} 40%, ${D.goldD} 100%);
  display:flex; align-items:center; justify-content:center;
  box-shadow:
    0 8px 32px rgba(212,168,83,0.4),
    0 0 0 6px rgba(212,168,83,0.1),
    0 0 60px rgba(212,168,83,0.15);
  animation:${stampDrop} 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;

  svg{
    width:44px; height:44px; color:${D.bg0};
    stroke-width:2.5;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   TYPOGRAPHY
═══════════════════════════════════════════════════════════════ */
const Eyebrow = styled.p`
  text-align:center; margin:0 0 8px;
  font-size:0.68rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase;
  color:${D.gold};
  opacity:0; animation:${fadeUp} 0.5s ease 0.5s both;
`;

const Title = styled.h1`
  font-family:'Cormorant Garamond', serif;
  font-size:clamp(2.2rem, 5vw, 3rem);
  font-weight:600; letter-spacing:-0.01em; line-height:1.1;
  text-align:center; margin:0 0 14px;
  color:${D.cream};
  opacity:0; animation:${fadeUp} 0.55s ease 0.6s both;

  em{
    font-style:italic; font-weight:400;
    background:linear-gradient(90deg, ${D.gold}, ${D.goldL}, ${D.gold});
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
`;

const Sub = styled.p`
  text-align:center; font-size:0.9rem; line-height:1.7;
  color:${D.creamD}; max-width:340px; margin:0 auto 30px;
  font-weight:400;
  opacity:0; animation:${fadeUp} 0.55s ease 0.7s both;
`;

/* ═══════════════════════════════════════════════════════════════
   STATUS TICKER
═══════════════════════════════════════════════════════════════ */
const Ticker = styled.div`
  display:flex; align-items:center; justify-content:center;
  gap:10px; margin-bottom:34px;
  opacity:0; animation:${fadeUp} 0.5s ease 0.8s both;
`;

const TickerPill = styled.div`
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; border-radius:999px;
  background:${D.goldBg}; border:1px solid ${D.border};
  font-size:0.82rem; font-weight:700; color:${D.gold};
  animation:${tickerPulse} 2.2s ease-in-out infinite;
  letter-spacing:0.04em;

  .dot{
    width:7px; height:7px; border-radius:50%;
    background:${D.gold};
    box-shadow:0 0 8px ${D.goldGlow};
  }
`;

const EtaBadge = styled.div`
  display:inline-flex; align-items:center; gap:5px;
  padding:8px 14px; border-radius:999px;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
  font-size:0.78rem; color:${D.creamD}; font-weight:500;
  svg{ color:${D.gold}; font-size:0.75rem; }
`;

/* ═══════════════════════════════════════════════════════════════
   PROGRESS STEPPER
═══════════════════════════════════════════════════════════════ */
const StepperWrap = styled.div`
  margin-bottom:32px;
  opacity:0; animation:${fadeUp} 0.5s ease 0.9s both;
`;

const StepperTrack = styled.div`
  display:flex; align-items:flex-start; justify-content:space-between;
  position:relative; margin-bottom:10px;

  &::before{
    content:""; position:absolute;
    top:14px; left:18px; right:18px; height:1.5px;
    background:rgba(255,255,255,0.06); z-index:0;
  }
`;

const Step = styled.div`
  display:flex; flex-direction:column; align-items:center; gap:7px;
  position:relative; z-index:1; flex:1;
`;

const StepBead = styled.div`
  width:28px; height:28px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:0.7rem; transition:all 0.4s ease;
  ${({$done,$active})=>
    $done ? css`
      background:linear-gradient(135deg,${D.gold},${D.goldD});
      color:${D.bg0}; box-shadow:0 0 16px ${D.goldGlow};
      border:none;
    ` : $active ? css`
      background:rgba(212,168,83,0.15);
      border:1.5px solid rgba(212,168,83,0.5);
      color:${D.gold};
    ` : css`
      background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.1);
      color:${D.muted};
    `}

  svg{ width:12px; height:12px; stroke-width:2.5; }
`;

const StepLabel = styled.div`
  font-size:0.62rem; font-weight:700; letter-spacing:0.05em;
  text-align:center; white-space:nowrap;
  color:${({$done,$active})=>$done?D.gold:$active?D.creamD:D.muted};
  transition:color 0.4s;
`;

const ProgressBar = styled.div`
  height:2px; border-radius:999px; background:rgba(255,255,255,0.06); overflow:hidden;
`;

const ProgressFill = styled.div`
  height:100%; border-radius:999px;
  background:linear-gradient(90deg,${D.goldD},${D.gold},${D.goldL});
  width:${({$pct})=>$pct}%;
  transition:width 1.2s cubic-bezier(0.4,0,0.2,1);
  box-shadow:0 0 8px ${D.goldGlow};
`;

/* ═══════════════════════════════════════════════════════════════
   RECEIPT BLOCK (the dashed tear-off look)
═══════════════════════════════════════════════════════════════ */
const ReceiptOuter = styled.div`
  position:relative; margin-bottom:14px;
  opacity:0;
  animation:${receiptSlide} 0.5s ease ${({$del})=>$del||"1s"} both;
`;

const ReceiptCard = styled.div`
  background:${D.bg3};
  border:1px solid ${D.border};
  border-radius:18px;
  overflow:hidden;
`;

const ReceiptHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 20px;
  border-bottom:1px solid ${D.border};
  background:linear-gradient(135deg,${D.bg4},${D.bg3});
  flex-wrap:wrap; gap:8px;
`;

const ReceiptLabel = styled.div`
  font-size:0.64rem; font-weight:800; letter-spacing:0.14em; text-transform:uppercase;
  color:${D.gold};
  display:flex; align-items:center; gap:6px;
  svg{ font-size:0.78rem; }
`;

const ReceiptBody = styled.div`
  padding:16px 20px;
`;

const OrderNum = styled.span`
  font-family:'Cormorant Garamond',serif;
  font-size:1.15rem; font-weight:600; color:${D.cream};
  letter-spacing:0.02em;
`;

const ConfirmedBadge = styled.div`
  display:inline-flex; align-items:center; gap:5px;
  padding:5px 12px; border-radius:999px; font-size:0.7rem; font-weight:700;
  background:${D.sageBg}; border:1px solid rgba(125,171,126,0.3);
  color:${D.sage}; letter-spacing:0.04em;
  svg{ font-size:0.7rem; }
`;

const DateLine = styled.div`
  font-size:0.76rem; color:${D.muted}; margin:8px 0 16px; font-weight:400;
`;

/* items list */
const ItemsList = styled.div`
  display:flex; flex-direction:column; gap:6px;
`;

const ItemRow = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px; border-radius:11px;
  background:rgba(255,255,255,0.028); border:1px solid rgba(255,255,255,0.05);
  transition:all 0.18s;
  cursor:default;

  &:hover{
    background:rgba(212,168,83,0.05);
    border-color:rgba(212,168,83,0.15);
    transform:translateX(3px);
  }
`;

const ItemLeft = styled.div`display:flex;align-items:center;gap:10px;`;

const ItemBullet = styled.div`
  width:6px; height:6px; border-radius:50%;
  background:linear-gradient(135deg,${D.gold},${D.goldD});
  flex-shrink:0;
`;

const ItemName = styled.span`
  font-size:0.855rem; color:${D.cream}; font-weight:500;
`;

const ItemQtyBadge = styled.span`
  font-size:0.72rem; color:${D.muted}; margin-left:5px; font-weight:400;
`;

const ItemPrice = styled.span`
  font-family:'Cormorant Garamond',serif;
  font-size:0.95rem; font-weight:600; color:${D.gold};
`;

/* divider — tear strip */
const TearLine = styled.div`
  margin:14px 0; height:1px;
  background:repeating-linear-gradient(
    90deg,
    ${D.border} 0px,
    ${D.border} 8px,
    transparent 8px,
    transparent 14px
  );
`;

/* total */
const TotalRow = styled.div`
  display:flex; align-items:baseline; justify-content:space-between;
`;

const TotalLabel = styled.span`
  font-size:0.7rem; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:${D.muted};
`;

const TotalVal = styled.span`
  font-family:'Cormorant Garamond',serif;
  font-size:1.8rem; font-weight:700; letter-spacing:-0.01em;
  background:linear-gradient(90deg,${D.gold},${D.goldL});
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
`;

/* ═══════════════════════════════════════════════════════════════
   INFO PILLS (delivery / payment / time)
═══════════════════════════════════════════════════════════════ */
const InfoPillGrid = styled.div`
  display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;
  opacity:0;
  animation:${receiptSlide} 0.5s ease ${({$del})=>$del||"1.1s"} both;

  @media(max-width:400px){ grid-template-columns:1fr; }
`;

const InfoPill = styled.div`
  display:flex; align-items:center; gap:10px;
  padding:12px 14px; border-radius:13px;
  background:${D.bg3}; border:1px solid ${D.border};
  transition:border-color 0.18s;
  &:hover{ border-color:${D.borderH}; }
`;

const PillIco = styled.div`
  width:32px; height:32px; border-radius:9px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:0.85rem;
  background:${({$bg})=>$bg||D.goldBg};
  color:${({$c})=>$c||D.gold};
`;

const PillText = styled.div``;

const PillLbl = styled.div`
  font-size:0.61rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  color:${D.muted}; margin-bottom:2px;
`;

const PillVal = styled.div`
  font-size:0.82rem; font-weight:600; color:${D.cream}; line-height:1.3;
`;

/* full-width variant */
const InfoPillFull = styled(InfoPill)`
  grid-column:1/-1;
`;

/* ═══════════════════════════════════════════════════════════════
   ACTION BUTTONS
═══════════════════════════════════════════════════════════════ */
const ActionsGrid = styled.div`
  display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:6px;
  opacity:0; animation:${fadeUp} 0.5s ease 1.2s both;

  @media(max-width:400px){ grid-template-columns:1fr; }
`;

const Btn = styled(motion.button)`
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  padding:${({$lg})=>$lg?"15px 18px":"13px 14px"};
  border-radius:13px; border:none; cursor:pointer;
  font-family:'Cabinet Grotesk',sans-serif;
  font-size:${({$lg})=>$lg?"0.875rem":"0.815rem"}; font-weight:700;
  letter-spacing:0.02em;
  grid-column:${({$full})=>$full?"1/-1":"auto"};
  position:relative; overflow:hidden;
  transition:box-shadow 0.2s, border-color 0.2s;

  /* sheen on hover */
  &::after{
    content:""; position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
    transform:translateX(-100%); transition:transform 0.4s ease;
  }
  &:hover::after{ transform:translateX(200%); }

  svg{ font-size:0.9em; flex-shrink:0; }

  ${({$v})=>{
    switch($v){
      case"gold": return css`
        background:linear-gradient(135deg,${D.gold} 0%,${D.goldL} 50%,${D.goldD} 100%);
        color:${D.bg0};
        box-shadow:0 4px 20px rgba(212,168,83,0.35);
        &:hover{ box-shadow:0 6px 28px rgba(212,168,83,0.5); }
      `;
      case"sage": return css`
        background:${D.sageBg}; border:1px solid rgba(125,171,126,0.3); color:${D.sage};
        &:hover{ background:rgba(125,171,126,0.2); border-color:rgba(125,171,126,0.5); }
      `;
      case"sky": return css`
        background:${D.skyBg}; border:1px solid rgba(106,163,200,0.3); color:${D.sky};
        &:hover{ background:rgba(106,163,200,0.2); border-color:rgba(106,163,200,0.5); }
      `;
      case"ghost": return css`
        background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:${D.creamD};
        &:hover{ background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.16); }
      `;
      case"subtle": return css`
        background:transparent; border:1px solid rgba(255,255,255,0.06); color:${D.muted};
        &:hover{ color:${D.creamD}; border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.03); }
      `;
      default: return css`
        background:linear-gradient(135deg,${D.gold},${D.goldD});
        color:${D.bg0}; box-shadow:0 4px 20px rgba(212,168,83,0.35);
      `;
    }
  }}
`;

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
const FootNote = styled.p`
  text-align:center; font-size:0.72rem; color:${D.muted};
  margin-top:26px; line-height:1.65;
  opacity:0; animation:${fadeUp} 0.5s ease 1.35s both;

  a{ color:${D.gold}; text-decoration:none; font-weight:600;
    &:hover{ text-decoration:underline; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════════════════ */
const SkeletonPage = styled.div`
  min-height:100vh;
  background:${D.bg0};
  display:flex; align-items:center; justify-content:center; padding:20px;
`;

const SkeletonCard = styled.div`
  width:100%; max-width:560px;
  background:${D.bg2}; border:1px solid ${D.border}; border-radius:28px; padding:52px 44px;
  @media(max-width:560px){ padding:36px 24px; }
`;

const Skel = styled.div`
  border-radius:${({$r})=>$r||"9px"};
  height:${({$h})=>$h||"18px"};
  width:${({$w})=>$w||"100%"};
  margin:${({$m})=>$m||"0 0 12px"};
  background:linear-gradient(90deg,${D.bg3} 25%,${D.bg4} 50%,${D.bg3} 75%);
  background-size:600px 100%;
  animation:${shimmer} 1.7s linear infinite;
`;

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const OrderSuccess = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { lastOrder, fetchOrders, user } = useAuth();

  const [orderDetails, setOrderDetails] = useState(null);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(true);
  const [stepIdx,      setStepIdx]      = useState(0);
  const [progressPct,  setProgressPct]  = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const passedState = location.state;

  /* ── INITIALISE ── */
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let details = null;

        if (passedState) {
          details = {
            orderId:           passedState.orderId,
            orderNumber:       passedState.orderNumber || `ORD${Date.now().toString().slice(-6)}`,
            createdAt:         new Date().toISOString(),
            items:             passedState.items || [],
            total:             passedState.totalAmount || 0,
            name:              passedState.name || user?.name || "Valued Guest",
            addressLine1:      passedState.addressLine1 || "",
            addressLine2:      passedState.addressLine2 || "",
            city:              passedState.city || "",
            pincode:           passedState.pincode || "",
            paymentMethod:     passedState.paymentMethod || "Cash",
            estimatedDelivery: passedState.estimatedDelivery || "30–40 min",
            status:            "confirmed",
          };
        } else if (lastOrder) {
          await fetchOrders();
          details = {
            orderId:           lastOrder._id || `ORD-${Date.now()}`,
            orderNumber:       lastOrder.orderNumber || `ORD${Date.now().toString().slice(-6)}`,
            createdAt:         lastOrder.createdAt || new Date().toISOString(),
            items:             lastOrder.items || [],
            total:             lastOrder.total || lastOrder.totalPrice || 0,
            name:              lastOrder.name || user?.name || "Valued Guest",
            addressLine1:      lastOrder.addressLine1 || "",
            addressLine2:      lastOrder.addressLine2 || "",
            city:              lastOrder.city || "",
            pincode:           lastOrder.pincode || "",
            paymentMethod:     lastOrder.paymentMethod || "Cash",
            estimatedDelivery: lastOrder.estimatedDelivery || "30–40 min",
            status:            lastOrder.status || "confirmed",
          };
        } else {
          setError("No order details found. Please place an order first.");
          return;
        }

        setOrderDetails(details);
        setShowConfetti(true);

        /* animated step progression */
        setTimeout(() => setProgressPct(22),  500);
        setTimeout(() => { setStepIdx(1); setProgressPct(22); }, 3000);
        setTimeout(() => { setStepIdx(2); setProgressPct(66); }, 9000);
        setTimeout(() => setShowConfetti(false), 5500);

      } catch {
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [passedState, lastOrder, fetchOrders, user]);

  /* ── LOADING SKELETON ── */
  if (loading) {
    return (
      <>
        <GlobalFont />
        <SkeletonPage>
          <SkeletonCard>
            <Skel $w="96px" $h="96px" $r="50%" $m="0 auto 28px" />
            <Skel $w="50%" $h="12px" $r="6px" $m="0 auto 12px" />
            <Skel $w="68%" $h="38px" $r="8px" $m="0 auto 12px" />
            <Skel $w="44%" $h="16px" $r="6px" $m="0 auto 28px" />
            <Skel $h="46px" $r="999px" $m="0 auto 32px" style={{width:"60%"}} />
            <Skel $h="28px" $r="8px" $m="0 0 24px" />
            <Skel $h="18px" $r="6px" $m="0 0 8px" />
            {[1,2,3].map(i=><Skel key={i} $h="42px" $r="11px" $m="0 0 6px" />)}
            <Skel $h="1px" $m="14px 0" />
            <Skel $w="38%" $h="28px" $r="7px" $m="0 0 0 auto" />
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:20}}>
              <Skel $h="58px" $r="13px" />
              <Skel $h="58px" $r="13px" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:8}}>
              <Skel $h="46px" $r="13px" />
              <Skel $h="46px" $r="13px" />
              <Skel $h="46px" $r="13px" style={{gridColumn:"1/-1"}} />
            </div>
          </SkeletonCard>
        </SkeletonPage>
      </>
    );
  }

  /* ── ERROR STATE ── */
  if (error || !orderDetails) {
    return (
      <>
        <GlobalFont />
        <Page>
          <Wrap>
            <Card
              initial={{ opacity:0, y:30 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, type:"spring", bounce:0.22 }}
            >
              <CardSheen />
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{
                  width:80, height:80, borderRadius:"50%", margin:"0 auto 20px",
                  background:"rgba(212,168,83,0.08)", border:"1px solid rgba(212,168,83,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <FiRefreshCw size={30} color={D.gold} />
                </div>
                <Eyebrow style={{ animationDelay:"0s" }}>Something went wrong</Eyebrow>
                <Title style={{ fontSize:"2rem", animationDelay:"0.1s" }}>Oops!</Title>
                <Sub style={{ animationDelay:"0.2s" }}>{error || "No order details found."}</Sub>
              </div>
              <ActionsGrid style={{ animationDelay:"0.3s" }}>
                <Btn $v="gold" $full onClick={() => window.location.reload()}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                  <FiRefreshCw /> Try Again
                </Btn>
                <Btn $v="ghost" $full onClick={() => navigate("/menu")}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                  <FiMenu /> Back to Menu
                </Btn>
              </ActionsGrid>
            </Card>
          </Wrap>
        </Page>
      </>
    );
  }

  /* ── SUCCESS VIEW ── */
  const payLabel = orderDetails.paymentMethod === "Cash"
    ? "Cash on Delivery"
    : orderDetails.paymentMethod;

  const addrParts = [
    orderDetails.addressLine1,
    orderDetails.addressLine2,
    orderDetails.city,
    orderDetails.pincode,
  ].filter(Boolean).join(", ");

  const dateStr = new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
    weekday:"short", month:"long", day:"numeric", year:"numeric",
    hour:"2-digit", minute:"2-digit",
  });

  return (
    <>
      <GlobalFont />
      <Page>
        {/* CONFETTI BURST */}
        {showConfetti && CONFETTI_DATA.map(p => (
          <Confetti key={p.id} $x={p.x} $w={p.w} $h={p.h} $c={p.c} $r={p.r} $dur={p.dur} $del={p.del} />
        ))}

        <Wrap>
          <Card
            initial={{ opacity:0, scale:0.93, y:36 }}
            animate={{ opacity:1, scale:1, y:0 }}
            transition={{ duration:0.75, type:"spring", bounce:0.2 }}
          >
            <CardSheen />

            {/* STAMP */}
            <StampArea>
              <StampOuter>
                <StampRing />
                <StampRing2 />
                <StampCircle>
                  <FiCheckCircle />
                </StampCircle>
              </StampOuter>
            </StampArea>

            {/* HEADING */}
            <Eyebrow>Order Confirmed</Eyebrow>
            <Title>Your feast is <em>on its way</em></Title>
            <Sub>
              Sit back — our kitchen is crafting your order with care.
              We'll have it at your door before you know it.
            </Sub>

            {/* STATUS TICKER */}
            <Ticker>
              <TickerPill>
                <span className="dot" />
                {STEPS[stepIdx].label}
              </TickerPill>
              <EtaBadge>
                <FiClock />
                {orderDetails.estimatedDelivery}
              </EtaBadge>
            </Ticker>

            {/* PROGRESS STEPPER */}
            <StepperWrap>
              <StepperTrack>
                {STEPS.map((s, i) => (
                  <Step key={s.label}>
                    <StepBead $done={i < stepIdx} $active={i === stepIdx}>
                      {i < stepIdx ? <FiCheckCircle /> : s.icon}
                    </StepBead>
                    <StepLabel $done={i < stepIdx} $active={i === stepIdx}>
                      {s.label}
                    </StepLabel>
                  </Step>
                ))}
              </StepperTrack>
              <ProgressBar>
                <ProgressFill $pct={progressPct} />
              </ProgressBar>
            </StepperWrap>

            {/* RECEIPT — ORDER SUMMARY */}
            <ReceiptOuter $del="1s">
              <ReceiptCard>
                <ReceiptHeader>
                  <ReceiptLabel><FiPackage /> Order Summary</ReceiptLabel>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <OrderNum>#{orderDetails.orderNumber}</OrderNum>
                    <ConfirmedBadge><FiCheckCircle /> Confirmed</ConfirmedBadge>
                  </div>
                </ReceiptHeader>

                <ReceiptBody>
                  <DateLine>{dateStr}</DateLine>

                  <ItemsList>
                    {orderDetails.items.length > 0 ? orderDetails.items.map((item, idx) => (
                      <ItemRow key={item.id || idx}>
                        <ItemLeft>
                          <ItemBullet />
                          <span>
                            <ItemName>{item.name}</ItemName>
                            <ItemQtyBadge>× {item.quantity}</ItemQtyBadge>
                          </span>
                        </ItemLeft>
                        <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                      </ItemRow>
                    )) : (
                      <div style={{ textAlign:"center", padding:"12px 0", fontSize:"0.84rem", color:D.muted }}>
                        No items found.
                      </div>
                    )}
                  </ItemsList>

                  <TearLine />

                  <TotalRow>
                    <TotalLabel>Total Paid</TotalLabel>
                    <TotalVal>₹{orderDetails.total.toFixed(2)}</TotalVal>
                  </TotalRow>
                </ReceiptBody>
              </ReceiptCard>
            </ReceiptOuter>

            {/* DELIVERY / PAYMENT INFO PILLS */}
            <InfoPillGrid $del="1.08s">
              {addrParts && (
                <InfoPillFull>
                  <PillIco $bg="rgba(212,168,83,0.1)" $c={D.gold}><FiMapPin /></PillIco>
                  <PillText>
                    <PillLbl>Delivering to</PillLbl>
                    <PillVal>
                      {orderDetails.name}
                      {addrParts && (
                        <span style={{ fontWeight:400, color:D.muted, display:"block", fontSize:"0.76rem", marginTop:1 }}>
                          {addrParts}
                        </span>
                      )}
                    </PillVal>
                  </PillText>
                </InfoPillFull>
              )}

              <InfoPill>
                <PillIco $bg={D.sageBg} $c={D.sage}><FiClock /></PillIco>
                <PillText>
                  <PillLbl>Arrival</PillLbl>
                  <PillVal>{orderDetails.estimatedDelivery}</PillVal>
                </PillText>
              </InfoPill>

              <InfoPill>
                <PillIco $bg={D.skyBg} $c={D.sky}><FiCreditCard /></PillIco>
                <PillText>
                  <PillLbl>Payment</PillLbl>
                  <PillVal>{payLabel}</PillVal>
                </PillText>
              </InfoPill>
            </InfoPillGrid>

            {/* CTA BUTTONS */}
            <ActionsGrid>
              <Btn $v="sky"
                onClick={() => navigate("/orders")}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}>
                <FiTruck /> Track Order
              </Btn>
              <Btn $v="gold"
                onClick={() => navigate("/")}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}>
                <FiHome /> Home
              </Btn>
              <Btn $v="ghost" $full
                onClick={() => navigate("/menu")}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <FiMenu /> Order More
              </Btn>
              <Btn $v="subtle"
                onClick={() => navigate("/profile")}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <FiUser /> Profile
              </Btn>
              <Btn $v="subtle"
                onClick={() => navigate("/orders")}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                <FiPackage /> My Orders
              </Btn>
            </ActionsGrid>

            <FootNote>
              Need help? Reach us at{" "}
              <a href="mailto:support@flavorfleet.com">support@flavorfleet.com</a>
              {" "}— we're always here for you.
            </FootNote>
          </Card>
        </Wrap>
      </Page>
    </>
  );
};

export default OrderSuccess;
