import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  FaUsers, FaShoppingBag, FaUtensils, FaEdit, FaTrash, FaPlus,
  FaSearch, FaDownload, FaChartLine, FaSyncAlt, FaExclamationTriangle,
  FaEye, FaClock, FaMapMarkerAlt, FaLayerGroup, FaArrowLeft,
  FaSort, FaSortUp, FaSortDown, FaTimes, FaCheck, FaUserShield,
  FaUser, FaCalendarAlt, FaMoneyBillWave, FaBell, FaEnvelope,
  FaPaperPlane, FaBars, FaUserPlus, FaHistory, FaEyeSlash,
  FaCheckCircle, FaTimesCircle, FaHandshake, FaThumbsUp, FaThumbsDown,
  FaPhoneAlt, FaExclamationCircle, FaStore, FaChevronLeft, FaChevronRight,
  FaEllipsisH, FaBellSlash, FaArrowUp, FaArrowDown, FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";

/* ─── FONTS ─── */
const GlobalFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
`;

/* ─── KEYFRAMES ─── */
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
`;
const fadeIn  = keyframes`from{opacity:0;}to{opacity:1;}`;
const popIn   = keyframes`
  from { opacity:0; transform:scale(0.93) translateY(-6px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
`;
const spin    = keyframes`to{transform:rotate(360deg);}`;
const shimmer = keyframes`
  0%  {background-position:-300% center;}
  100%{background-position: 300% center;}
`;
const pulsation = keyframes`
  0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.45);}
  50%     {box-shadow:0 0 0 8px rgba(249,115,22,0);}
`;
const barGrow = keyframes`from{width:0%;}`;

/* ─── DESIGN TOKENS ─── */
const C = {
  orange:"#f97316", orangeD:"#ea6c0a",
  orangeBg:"rgba(249,115,22,0.1)", orangeGlow:"rgba(249,115,22,0.22)",
  green:"#22c55e",  greenBg:"rgba(34,197,94,0.1)",
  red:"#ef4444",    redBg:"rgba(239,68,68,0.1)",
  blue:"#3b82f6",   blueBg:"rgba(59,130,246,0.1)",
  amber:"#f59e0b",  amberBg:"rgba(245,158,11,0.1)",
  purple:"#a855f7", purpleBg:"rgba(168,85,247,0.1)",
  indigo:"#6366f1", indigoBg:"rgba(99,102,241,0.1)",
  cyan:"#0ea5e9",   cyanBg:"rgba(14,165,233,0.1)",
  lBg:"#f1f5f9",    lSurf:"#ffffff",  lSurf2:"#f8fafc",
  lBorder:"rgba(0,0,0,0.07)", lBorder2:"rgba(0,0,0,0.13)",
  lText:"#0f172a",  lMuted:"#64748b", lSubtle:"#94a3b8",
  lShadow:"0 1px 2px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.04)",
  lShadowMd:"0 4px 16px rgba(0,0,0,0.09)",
  lShadowLg:"0 12px 40px rgba(0,0,0,0.14)",
  dBg:"#070d1a",    dSurf:"#0f1829",  dSurf2:"#0b1220",
  dBorder:"rgba(255,255,255,0.06)", dBorder2:"rgba(255,255,255,0.12)",
  dText:"#f1f5f9",  dMuted:"#94a3b8", dSubtle:"#64748b",
  dShadow:"0 1px 2px rgba(0,0,0,0.25),0 4px 12px rgba(0,0,0,0.2)",
  dShadowMd:"0 4px 16px rgba(0,0,0,0.4)",
  dShadowLg:"0 12px 40px rgba(0,0,0,0.55)",
};

const th = (d, light, dark) => d ? dark : light;

/* ─── LAYOUT ─── */
const Root = styled.div`
  display:flex; flex-direction:column; min-height:100vh;
  font-family:'Plus Jakarta Sans',sans-serif;
  background:${({$d})=>th($d,C.lBg,C.dBg)};
  color:${({$d})=>th($d,C.lText,C.dText)};
`;

const TopBar = styled.header`
  position:sticky; top:0; z-index:300;
  height:60px; display:flex; align-items:center; gap:1rem; padding:0 1.5rem;
  background:${({$d})=>th($d,"rgba(255,255,255,0.88)","rgba(7,13,26,0.92)")};
  backdrop-filter:blur(14px);
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  box-shadow:${({$d})=>th($d,"0 1px 6px rgba(0,0,0,0.06)","0 1px 6px rgba(0,0,0,0.4)")};
`;

const BarTitle = styled.h1`
  font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:700;
  letter-spacing:-0.02em; margin:0;
  color:${({$d})=>th($d,C.lText,C.dText)};
  em {
    font-style:normal;
    background:linear-gradient(90deg,${C.orange},${C.amber},${C.orange});
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:${shimmer} 4s linear infinite;
  }
`;

const BarSpacer = styled.div`flex:1;`;

const BackBtn = styled.button`
  display:inline-flex; align-items:center; gap:0.4rem;
  padding:0.4rem 0.85rem; border-radius:8px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:transparent; color:${({$d})=>th($d,C.lMuted,C.dMuted)};
  font-family:inherit; font-size:0.82rem; font-weight:500; cursor:pointer;
  transition:all 0.15s;
  &:hover{background:${C.orangeBg};color:${C.orange};border-color:${C.orange}44;}
`;
/* ─── SPINNER ICON ─── */          // ← ADD THIS ENTIRE BLOCK
const SpinnerIcon = styled(FaSyncAlt)`
  animation: ${spin} 0.75s linear infinite;
`;
const HamBtn = styled.button`
  width:36px; height:36px; border-radius:8px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:transparent; color:${({$d})=>th($d,C.lMuted,C.dMuted)};
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  font-size:0.9rem; transition:all 0.15s;
  &:hover{background:${C.orangeBg};color:${C.orange};border-color:${C.orange}44;}
`;

const PageBody = styled.div`display:flex;flex:1;overflow:hidden;`;

const SidePane = styled.aside`
  width:240px; flex-shrink:0;
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  border-right:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  display:flex; flex-direction:column;
  height:calc(100vh - 60px); position:sticky; top:60px;
  overflow-y:auto; overflow-x:hidden; padding:1.25rem 0.75rem;
  scrollbar-width:none; transition:transform 0.28s cubic-bezier(0.4,0,0.2,1);
  &::-webkit-scrollbar{display:none;}
  @media(max-width:1024px){
    position:fixed; top:60px; left:0; height:calc(100vh - 60px); z-index:200;
    box-shadow:${({$d})=>th($d,"4px 0 20px rgba(0,0,0,0.1)","4px 0 20px rgba(0,0,0,0.6)")};
    transform:translateX(${({$open})=>$open?"0":"-100%"});
  }
`;

const SideOverlay = styled.div`
  display:none;
  @media(max-width:1024px){
    display:${({$open})=>$open?"block":"none"};
    position:fixed; inset:60px 0 0 0;
    background:rgba(0,0,0,0.48); backdrop-filter:blur(3px); z-index:190;
  }
`;

const NavGroupLabel = styled.div`
  font-size:0.67rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  color:${({$d})=>th($d,C.lSubtle,C.dSubtle)}; padding:0.5rem 0.75rem 0.4rem;
`;

const NavBtn = styled.button`
  width:100%; display:flex; align-items:center; gap:0.65rem;
  padding:0.6rem 0.75rem; border-radius:9px; border:none;
  background:${({$active,$d})=>$active?th($d,C.orangeBg,"rgba(249,115,22,0.14)"):"transparent"};
  color:${({$active,$d})=>$active?C.orange:th($d,C.lMuted,C.dMuted)};
  font-family:inherit; font-size:0.84rem; font-weight:${({$active})=>$active?"600":"400"};
  cursor:pointer; text-align:left; transition:all 0.15s; position:relative; margin-bottom:2px;
  &::before{
    content:""; position:absolute; left:-0.75rem; top:20%; height:60%; width:3px;
    border-radius:0 3px 3px 0; background:${C.orange};
    opacity:${({$active})=>$active?"1":"0"}; transition:opacity 0.15s;
  }
  svg{font-size:0.9rem;opacity:${({$active})=>$active?"1":"0.6"};flex-shrink:0;}
  &:hover{background:${C.orangeBg};color:${C.orange};}
  &:hover svg{opacity:1;}
`;

const NavSpan = styled.span`flex:1;`;

const NavBadge = styled.span`
  font-size:0.68rem; font-weight:700; padding:0.1rem 0.42rem; border-radius:999px;
  background:${({$c})=>$c||C.orange}; color:#fff; min-width:18px; text-align:center;
  ${({$pulse})=>$pulse&&css`animation:${pulsation} 1.8s infinite;`}
`;

const SideStats = styled.div`
  margin-top:auto; padding-top:1rem;
  border-top:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
`;

const SideStatsTitle = styled.div`
  font-size:0.67rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  color:${C.orange}; padding:0 0.75rem 0.6rem;
`;

const SideStatRow = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  padding:0.2rem 0.75rem; font-size:0.78rem;
  color:${({$d})=>th($d,C.lMuted,C.dMuted)};
  strong{font-weight:600;color:${({$d})=>th($d,C.lText,C.dText)};}
`;

const ContentPane = styled.main`
  flex:1; min-width:0; overflow-y:auto; padding:1.75rem 2rem;
  @media(max-width:768px){padding:1.25rem;}
`;

/* ─── SHARED PRIMITIVES ─── */
const Sec = styled.div`animation:${fadeUp} 0.3s ease both;`;

const SecHead = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;
`;

const SecTitle = styled.h2`
  display:flex; align-items:center; gap:0.45rem;
  font-family:'Outfit',sans-serif; font-size:1.2rem; font-weight:700;
  letter-spacing:-0.02em; margin:0;
  color:${({$d})=>th($d,C.lText,C.dText)};
  svg{color:${C.orange};font-size:1rem;}
`;

const TitleCount = styled.span`
  font-family:'Plus Jakarta Sans',sans-serif; font-size:0.75rem; font-weight:500;
  padding:0.12rem 0.55rem; border-radius:999px;
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  color:${({$d})=>th($d,C.lMuted,C.dMuted)}; margin-left:0.35rem;
`;

const BtnRow = styled.div`display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;`;

/* ─── BUTTON ─── */
const Btn = styled.button`
  display:inline-flex; align-items:center; gap:0.38rem;
  padding:${({$sm})=>$sm?"0.35rem 0.65rem":"0.5rem 1rem"};
  border-radius:9px; font-family:inherit;
  font-size:${({$sm})=>$sm?"0.78rem":"0.84rem"}; font-weight:600;
  cursor:pointer; transition:all 0.15s; white-space:nowrap;
  border:1px solid transparent;
  ${({$variant,$d})=>{
    switch($variant){
      case"orange": return css`
        background:linear-gradient(135deg,${C.orange},${C.orangeD});
        color:#fff; box-shadow:0 2px 8px ${C.orangeGlow};
        &:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 14px ${C.orangeGlow};}`;
      case"green": return css`
        background:linear-gradient(135deg,${C.green},#16a34a);
        color:#fff; box-shadow:0 2px 8px rgba(34,197,94,0.28);
        &:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 14px rgba(34,197,94,0.38);}`;
      case"red": return css`
        background:${th($d,C.redBg,"rgba(239,68,68,0.12)")}; color:${C.red};
        border-color:${C.red}44;
        &:hover:not(:disabled){background:${C.red};color:#fff;border-color:transparent;box-shadow:0 2px 10px rgba(239,68,68,0.3);}`;
      default: return css`
        background:${th($d,C.lSurf,C.dSurf)}; color:${th($d,C.lMuted,C.dMuted)};
        border-color:${th($d,C.lBorder,C.dBorder)};
        &:hover:not(:disabled){background:${C.orangeBg};color:${C.orange};border-color:${C.orange}44;}`;
    }
  }}
  &:disabled{opacity:0.42;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
  svg{font-size:0.82em;}
`;

/* ─── FILTERS ─── */
const Filters = styled.div`
  display:flex; gap:0.65rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center;
`;

const SearchWrap = styled.div`
  position:relative; flex:1; min-width:200px;
  svg.s-icon{
    position:absolute; left:0.85rem; top:50%; transform:translateY(-50%);
    font-size:0.78rem; color:${({$d})=>th($d,C.lSubtle,C.dSubtle)}; pointer-events:none;
  }
`;

const SearchIn = styled.input`
  width:100%; height:38px; padding:0 0.85rem 0 2.2rem; border-radius:9px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit; font-size:0.84rem; outline:none;
  transition:border-color 0.15s,box-shadow 0.15s;
  &::placeholder{color:${({$d})=>th($d,C.lSubtle,C.dSubtle)};}
  &:focus{border-color:${C.orange};box-shadow:0 0 0 3px ${C.orangeGlow};}
`;

const Sel = styled.select`
  height:38px; padding:0 2rem 0 0.8rem; border-radius:9px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background-color:${({$d})=>th($d,C.lSurf,C.dSurf)};
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:calc(100% - 0.65rem) center;
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit; font-size:0.84rem; outline:none; cursor:pointer; appearance:none;
  transition:border-color 0.15s,box-shadow 0.15s;
  &:focus{border-color:${C.orange};box-shadow:0 0 0 3px ${C.orangeGlow};}
`;

/* ─── TABLE ─── */
const TableWrap = styled.div`
  width:100%; overflow-x:auto; border-radius:12px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  box-shadow:${({$d})=>th($d,C.lShadow,C.dShadow)};
`;

const T    = styled.table`width:100%;border-collapse:collapse;`;
const THead= styled.thead`
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
`;

const Th = styled.th`
  padding:0.72rem 1rem; text-align:left; font-size:0.68rem; font-weight:700;
  letter-spacing:0.07em; text-transform:uppercase;
  color:${({$d})=>th($d,C.lMuted,C.dMuted)}; white-space:nowrap;
`;

const Tr = styled.tr`
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)}; transition:background 0.12s;
  &:last-child{border-bottom:none;}
  &:hover{background:${({$d})=>th($d,"rgba(249,115,22,0.02)","rgba(249,115,22,0.04)")};}
`;

const Td = styled.td`
  padding:0.8rem 1rem; font-size:0.84rem;
  color:${({$d})=>th($d,C.lText,C.dText)}; vertical-align:middle;
`;

const ThBtn = styled.button`
  display:inline-flex; align-items:center; gap:0.3rem; background:none; border:none;
  color:inherit; font:inherit; font-size:0.68rem; font-weight:700; letter-spacing:0.07em;
  text-transform:uppercase; cursor:pointer; padding:0; white-space:nowrap;
  svg{font-size:0.75rem;opacity:0.5;}
  &:hover svg{opacity:1;color:${C.orange};}
`;

/* ─── PAGINATION ─── */
const PageRow = styled.div`
  display:flex; align-items:center; gap:0.28rem; margin-top:1.1rem; flex-wrap:wrap;
`;

const PBtn = styled.button`
  min-width:32px; height:32px; padding:0 0.45rem; border-radius:8px;
  border:1px solid ${({$d,$active})=>$active?C.orange:th($d,C.lBorder,C.dBorder)};
  background:${({$d,$active})=>$active?C.orange:th($d,C.lSurf,C.dSurf)};
  color:${({$d,$active})=>$active?"#fff":th($d,C.lMuted,C.dMuted)};
  font-family:inherit; font-size:0.79rem; font-weight:${({$active})=>$active?"700":"400"};
  cursor:pointer; transition:all 0.13s; display:flex; align-items:center; justify-content:center;
  &:hover:not(:disabled){border-color:${C.orange};color:${({$active})=>$active?"#fff":C.orange};background:${({$active})=>$active?C.orange:C.orangeBg};}
  &:disabled{opacity:0.32;cursor:not-allowed;}
`;

const PageInfo = styled.span`font-size:0.78rem;color:${({$d})=>th($d,C.lMuted,C.dMuted)};margin-left:0.4rem;`;

/* ─── STAT CARDS ─── */
const StatsGrid = styled.div`
  display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
  gap:1rem; margin-bottom:1.5rem;
`;

const StatCard = styled.div`
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  border:1px solid ${({$d,$color})=>$color?`${$color}1e`:th($d,C.lBorder,C.dBorder)};
  border-radius:12px; padding:1.1rem 1.2rem; position:relative; overflow:hidden;
  box-shadow:${({$d})=>th($d,C.lShadow,C.dShadow)};
  animation:${fadeUp} 0.3s ease both; animation-delay:${({$delay})=>$delay||"0s"};
  &::after{
    content:""; position:absolute; top:-16px; right:-16px; width:72px; height:72px;
    border-radius:50%; background:${({$color})=>$color?`${$color}12`:"transparent"};
  }
`;

const StatIco = styled.div`
  width:38px; height:38px; border-radius:9px;
  display:flex; align-items:center; justify-content:center; font-size:1rem;
  background:${({$color})=>`${$color}18`}; color:${({$color})=>$color}; margin-bottom:0.7rem;
`;

const StatVal = styled.div`
  font-family:'Outfit',sans-serif; font-size:1.55rem; font-weight:800;
  letter-spacing:-0.03em; line-height:1; margin-bottom:0.2rem;
  color:${({$d})=>th($d,C.lText,C.dText)};
`;

const StatLbl = styled.div`
  font-size:0.76rem; font-weight:500; color:${({$d})=>th($d,C.lMuted,C.dMuted)};
`;

const StatTrend = styled.div`
  display:inline-flex; align-items:center; gap:0.18rem;
  font-size:0.72rem; font-weight:600; padding:0.12rem 0.45rem; border-radius:999px; margin-top:0.35rem;
  color:${({$up})=>$up?C.green:C.red};
  background:${({$up})=>$up?C.greenBg:C.redBg};
`;

/* ─── PILL BADGE ─── */
const Pill = styled.span`
  display:inline-flex; align-items:center; gap:0.28rem;
  padding:0.22rem 0.6rem; border-radius:999px; font-size:0.72rem;
  font-weight:700; letter-spacing:0.02em; white-space:nowrap;
  ${({$variant})=>{
    const m={
      green:`color:${C.green};background:${C.greenBg};border:1px solid ${C.green}2e;`,
      red:`color:${C.red};background:${C.redBg};border:1px solid ${C.red}2e;`,
      amber:`color:${C.amber};background:${C.amberBg};border:1px solid ${C.amber}2e;`,
      blue:`color:${C.blue};background:${C.blueBg};border:1px solid ${C.blue}2e;`,
      purple:`color:${C.purple};background:${C.purpleBg};border:1px solid ${C.purple}2e;`,
      cyan:`color:${C.cyan};background:${C.cyanBg};border:1px solid ${C.cyan}2e;`,
      indigo:`color:${C.indigo};background:${C.indigoBg};border:1px solid ${C.indigo}2e;`,
      orange:`color:${C.orange};background:${C.orangeBg};border:1px solid ${C.orange}2e;`,
    };
    return m[$variant]||m.orange;
  }}
  ${({$pulse})=>$pulse&&css`animation:${pulsation} 1.8s infinite;`}
`;

/* ─── CARD SURFACE ─── */
const Card = styled.div`
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  border-radius:12px; padding:${({$p})=>$p||"1.4rem"};
  box-shadow:${({$d})=>th($d,C.lShadow,C.dShadow)};
`;

/* ─── AVATAR ─── */
const Av = styled.div`
  width:${({$size})=>$size||"34px"}; height:${({$size})=>$size||"34px"};
  border-radius:50%; background:linear-gradient(135deg,${C.orange},${C.amber});
  color:#fff; display:flex; align-items:center; justify-content:center;
  font-family:'Outfit',sans-serif;
  font-size:${({$size})=>$size?`calc(${$size} * 0.38)`:"0.82rem"};
  font-weight:700; flex-shrink:0;
`;

/* ─── STATES ─── */
const Empty = styled.div`
  text-align:center; padding:3.5rem 2rem;
  border:1px dashed ${({$d})=>th($d,C.lBorder2,C.dBorder2)};
  border-radius:12px; background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  svg{font-size:2.8rem;opacity:0.12;display:block;margin:0 auto 0.85rem;}
  p{font-size:0.86rem;color:${({$d})=>th($d,C.lMuted,C.dMuted)};margin:0;}
`;

const LoadBox = styled.div`
  display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:0.9rem;
`;

const Spinner = styled.div`
  width:36px;height:36px;border-radius:50%;
  border:3px solid ${({$d})=>th($d,C.lBorder2,C.dBorder2)};
  border-top-color:${C.orange}; animation:${spin} 0.75s linear infinite;
`;

const LoadTxt = styled.div`font-size:0.86rem;color:${({$d})=>th($d,C.lMuted,C.dMuted)};`;

const ErrBox = styled.div`
  display:flex;align-items:center;gap:0.7rem;padding:0.9rem 1.1rem;border-radius:10px;
  background:${C.redBg};border:1px solid ${C.red}33;color:${C.red};font-size:0.86rem;font-weight:500;
`;

/* ─── BULK BAR ─── */
const BulkBar = styled.div`
  display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;
  padding:0.65rem 0.9rem;border-radius:10px;
  background:${C.orangeBg};border:1px solid ${C.orange}2e;
  margin-bottom:1rem;animation:${fadeUp} 0.2s ease;
`;

const BulkCnt = styled.span`font-size:0.82rem;font-weight:700;color:${C.orange};white-space:nowrap;`;

/* ─── DELETE CONFIRMATION MODAL ─── */
const DeleteOverlay = styled.div`
  position:fixed;inset:0;z-index:1000;
  display:flex;align-items:center;justify-content:center;padding:1rem;
  background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);
  animation:${fadeIn} 0.18s ease;
`;

const DeleteBox = styled.div`
  background:${({$d})=>th($d,"#fff",C.dSurf)};
  border-radius:18px; width:100%; max-width:400px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  box-shadow:${({$d})=>th($d,C.lShadowLg,C.dShadowLg)};
  overflow:hidden; animation:${popIn} 0.25s cubic-bezier(0.34,1.56,0.64,1);
`;

const DeleteHead = styled.div`
  display:flex;align-items:center;gap:0.8rem;padding:1.1rem 1.4rem;
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  .ico{width:36px;height:36px;border-radius:9px;background:${C.redBg};color:${C.red};
    display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}
  h3{margin:0;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;
    color:${({$d})=>th($d,C.lText,C.dText)};}
`;

const DeleteBody = styled.div`padding:1.35rem 1.4rem;`;

const DeleteText = styled.p`
  font-size:0.9rem; line-height:1.6; margin:0 0 0.5rem 0;
  color:${({$d})=>th($d,C.lText,C.dText)};
  strong{color:${C.red};font-weight:700;}
`;

const DeleteFoot = styled.div`
  display:flex;justify-content:flex-end;gap:0.6rem;padding:1rem 1.4rem;
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border-top:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
`;

/* ─── PARTNER SPECIFIC STYLES ─── */
const HeroBanner = styled.div`
  background:${({$d})=>th($d,
    "linear-gradient(135deg,#fff7ed,#fffbeb 50%,#eff6ff)",
    "linear-gradient(135deg,#1c0f03,#1e1505 50%,#0a1020)"
  )};
  border:1px solid ${({$d})=>th($d,`${C.orange}22`,`${C.orange}18`)};
  border-radius:16px; padding:1.8rem 2rem 1.6rem; margin-bottom:1.75rem;
  position:relative; overflow:hidden; animation:${fadeUp} 0.35s ease;
  &::before{
    content:""; position:absolute; top:-36px; right:-36px; width:160px; height:160px;
    border-radius:50%; background:radial-gradient(circle,${C.orange}1a,transparent 70%); pointer-events:none;
  }
`;

const HeroTitle = styled.h2`
  font-family:'Outfit',sans-serif; font-size:clamp(1.2rem,2.5vw,1.65rem); font-weight:800;
  letter-spacing:-0.03em; margin:0 0 0.35rem;
  background:linear-gradient(90deg,${C.orange},${C.amber},${C.orange});
  background-size:250% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text; animation:${shimmer} 4s linear infinite;
  display:flex; align-items:center; gap:0.45rem;
`;

const HeroSub = styled.p`
  font-size:0.86rem; color:${({$d})=>th($d,C.lMuted,C.dMuted)};
  margin:0; line-height:1.6; max-width:560px;
`;

const HeroPills = styled.div`display:flex;gap:0.6rem;margin-top:1.1rem;flex-wrap:wrap;`;

const HeroPill = styled.div`
  display:inline-flex; align-items:center; gap:0.35rem; padding:0.35rem 0.8rem;
  border-radius:999px; font-size:0.78rem; font-weight:600;
  background:${({$bg})=>$bg}; color:${({$color})=>$color}; border:1px solid ${({$color})=>`${$color}2e`};
  animation:${fadeUp} 0.35s ease both; animation-delay:${({$delay})=>$delay||"0s"};
  svg{font-size:0.72rem;}
`;

const PCardGrid = styled.div`
  display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:1.1rem;
`;

const PCard = styled.div`
  background:${({$d})=>th($d,C.lSurf,C.dSurf)};
  border-radius:14px; padding:1.35rem;
  border:1px solid ${({$d,$status})=>{
    if($status==="PENDING")  return th($d,`${C.orange}33`,`${C.orange}3a`);
    if($status==="APPROVED") return th($d,`${C.green}33`,`${C.green}3a`);
    if($status==="REJECTED") return th($d,`${C.red}33`,`${C.red}3a`);
    return th($d,C.lBorder,C.dBorder);
  }};
  position:relative; overflow:hidden; transition:transform 0.2s,box-shadow 0.2s;
  box-shadow:${({$d})=>th($d,C.lShadow,C.dShadow)};
  animation:${fadeUp} 0.3s ease both; animation-delay:${({$delay})=>$delay||"0s"};
  &::before{
    content:""; position:absolute; left:0; top:0; bottom:0; width:4px;
    background:${({$status})=>{
      if($status==="PENDING")  return `linear-gradient(180deg,${C.orange},${C.amber})`;
      if($status==="APPROVED") return `linear-gradient(180deg,${C.green},#16a34a)`;
      if($status==="REJECTED") return `linear-gradient(180deg,${C.red},#dc2626)`;
      return "#6b7280";
    }};
  }
  &:hover{transform:translateY(-2px);box-shadow:${({$d})=>th($d,C.lShadowMd,C.dShadowMd)};}
`;

const PCardIcon = styled.div`
  width:42px; height:42px; border-radius:11px;
  display:flex; align-items:center; justify-content:center;
  font-family:'Outfit',sans-serif; font-size:1.05rem; font-weight:700; color:#fff; flex-shrink:0;
  background:${({$status})=>{
    if($status==="PENDING")  return `linear-gradient(135deg,${C.orange},${C.amber})`;
    if($status==="APPROVED") return `linear-gradient(135deg,${C.green},#16a34a)`;
    if($status==="REJECTED") return `linear-gradient(135deg,${C.red},#dc2626)`;
    return "linear-gradient(135deg,#6b7280,#4b5563)";
  }};
`;

const PRow = styled.div`
  display:flex; align-items:center; gap:0.42rem; font-size:0.82rem; margin-bottom:0.32rem;
  color:${({$d})=>th($d,C.lMuted,C.dMuted)};
  svg{font-size:0.72rem;flex-shrink:0;color:${({$iconColor})=>$iconColor||"inherit"};}
`;

const PMsg = styled.blockquote`
  font-size:0.8rem; font-style:italic; line-height:1.55;
  margin:0.7rem 0; padding:0.55rem 0.8rem;
  border-left:3px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  border-radius:0 7px 7px 0;
  background:${({$d})=>th($d,"rgba(0,0,0,0.025)","rgba(255,255,255,0.03)")};
  color:${({$d})=>th($d,C.lMuted,C.dMuted)};
`;

const ViewToggle = styled.div`
  display:flex; overflow:hidden; border-radius:9px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
`;

const VBtn = styled.button`
  padding:0.42rem 0.8rem; border:none;
  background:${({$active,$d})=>$active?C.orange:th($d,C.lSurf,C.dSurf)};
  color:${({$active,$d})=>$active?"#fff":th($d,C.lMuted,C.dMuted)};
  font-family:inherit; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.15s;
  &:hover:not(:disabled){background:${({$active})=>$active?C.orange:C.orangeBg};color:${({$active})=>$active?"#fff":C.orange};}
`;

/* ─── REJECT / ACTION MODAL ─── */
const Overlay = styled.div`
  position:fixed;inset:0;z-index:1000;
  display:flex;align-items:center;justify-content:center;padding:1rem;
  background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);
  animation:${fadeIn} 0.18s ease;
`;

const MBox = styled.div`
  background:${({$d})=>th($d,"#fff",C.dSurf)};
  border-radius:18px; width:100%; max-width:480px;
  border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  box-shadow:${({$d})=>th($d,C.lShadowLg,C.dShadowLg)};
  overflow:hidden; animation:${popIn} 0.25s cubic-bezier(0.34,1.56,0.64,1);
`;

const MHead = styled.div`
  display:flex;align-items:center;gap:0.8rem;padding:1.1rem 1.4rem;
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  .ico{width:36px;height:36px;border-radius:9px;background:${C.redBg};color:${C.red};
    display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}
  h3{margin:0;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;
    color:${({$d})=>th($d,C.lText,C.dText)};}
`;

const MBody = styled.div`padding:1.35rem 1.4rem;`;

const MFoot = styled.div`
  display:flex;justify-content:flex-end;gap:0.6rem;padding:1rem 1.4rem;
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  border-top:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
`;

const Preview = styled.div`
  background:${({$d})=>th($d,C.orangeBg,"rgba(249,115,22,0.08)")};
  border:1px solid ${C.orange}22; border-radius:10px; padding:0.85rem 1rem; margin-bottom:1.1rem;
  h4{margin:0 0 0.45rem;font-size:0.9rem;font-weight:700;color:${C.orange};font-family:'Outfit',sans-serif;}
`;

const PreviewRow = styled.div`
  display:flex;align-items:center;gap:0.45rem;font-size:0.8rem;
  color:${({$d})=>th($d,C.lMuted,C.dMuted)};margin-bottom:0.28rem;
  svg{font-size:0.72rem;color:${C.orange};flex-shrink:0;}
  &:last-child{margin-bottom:0;}
`;

const MTextarea = styled.textarea`
  width:100%; min-height:105px; padding:0.8rem 0.9rem; border-radius:10px;
  border:1.5px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit; font-size:0.84rem; resize:vertical; outline:none;
  line-height:1.55; transition:border-color 0.15s,box-shadow 0.15s; box-sizing:border-box;
  &::placeholder{color:${({$d})=>th($d,C.lSubtle,C.dSubtle)};}
  &:focus{border-color:${C.red};box-shadow:0 0 0 3px rgba(239,68,68,0.14);}
`;

const CharHelp = styled.div`
  display:flex;justify-content:space-between;margin-top:0.38rem;font-size:0.74rem;
  color:${({$d})=>th($d,C.lSubtle,C.dSubtle)};
`;

/* ─── NOTIFICATION MODAL ─── */
const NOverlay = styled.div`
  position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;
  padding:1rem;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);animation:${fadeIn} 0.18s ease;
`;

const NBox = styled.div`
  background:${({$d})=>th($d,"#fff",C.dSurf)};border-radius:18px;width:100%;max-width:580px;
  max-height:90vh;overflow-y:auto;border:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  box-shadow:${({$d})=>th($d,C.lShadowLg,C.dShadowLg)};
  animation:${popIn} 0.22s cubic-bezier(0.34,1.56,0.64,1);scrollbar-width:thin;
`;

const NHead = styled.div`
  display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.4rem;
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  position:sticky;top:0;background:${({$d})=>th($d,"#fff",C.dSurf)};z-index:1;
  h3{margin:0;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;
    color:${({$d})=>th($d,C.lText,C.dText)};display:flex;align-items:center;gap:0.4rem;
    svg{color:${C.orange};}
  }
`;

const NBody = styled.div`padding:1.35rem 1.4rem;`;

const NFoot = styled.div`
  display:flex;justify-content:flex-end;gap:0.6rem;padding:1rem 1.4rem;
  border-top:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  position:sticky;bottom:0;background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
`;

const FField = styled.div`margin-bottom:0.9rem;`;

const FLabel = styled.label`
  display:block;font-size:0.75rem;font-weight:600;
  color:${({$d})=>th($d,C.lMuted,C.dMuted)};margin-bottom:0.38rem;letter-spacing:0.02em;
`;

const FInput = styled.input`
  width:100%;height:38px;padding:0 0.85rem;border-radius:9px;
  border:1.5px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit;font-size:0.84rem;outline:none;transition:border-color 0.15s,box-shadow 0.15s;box-sizing:border-box;
  &::placeholder{color:${({$d})=>th($d,C.lSubtle,C.dSubtle)};}
  &:focus{border-color:${C.orange};box-shadow:0 0 0 3px ${C.orangeGlow};}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;

const FTextarea = styled.textarea`
  width:100%;padding:0.65rem 0.85rem;border-radius:9px;
  border:1.5px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit;font-size:0.84rem;outline:none;resize:vertical;line-height:1.55;
  transition:border-color 0.15s,box-shadow 0.15s;box-sizing:border-box;
  &::placeholder{color:${({$d})=>th($d,C.lSubtle,C.dSubtle)};}
  &:focus{border-color:${C.orange};box-shadow:0 0 0 3px ${C.orangeGlow};}
`;

const FSel = styled.select`
  width:100%;height:38px;padding:0 2rem 0 0.85rem;border-radius:9px;
  border:1.5px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  background-color:${({$d})=>th($d,C.lSurf2,C.dSurf2)};
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:calc(100% - 0.65rem) center;
  color:${({$d})=>th($d,C.lText,C.dText)};
  font-family:inherit;font-size:0.84rem;outline:none;cursor:pointer;appearance:none;
  transition:border-color 0.15s,box-shadow 0.15s;box-sizing:border-box;
  &:focus{border-color:${C.orange};box-shadow:0 0 0 3px ${C.orangeGlow};}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;

const UserPicker = styled.div`
  max-height:190px;overflow-y:auto;
  border:1.5px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};
  border-radius:9px;background:${({$d})=>th($d,C.lSurf2,C.dSurf2)};scrollbar-width:thin;
`;

const UPickItem = styled.div`
  display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.85rem;cursor:pointer;
  border-bottom:1px solid ${({$d})=>th($d,C.lBorder,C.dBorder)};transition:background 0.12s;
  background:${({$selected})=>$selected?C.orangeBg:"transparent"};
  &:last-child{border-bottom:none;}
  &:hover{background:${C.orangeBg};}
`;

/* ─── ANALYTICS SPECIFIC ─── */
const BarTrack = styled.div`
  height:5px;border-radius:999px;
  background:${({$d})=>th($d,C.lBorder,C.dBorder)};overflow:hidden;margin-top:0.28rem;
`;

const BarFill = styled.div`
  height:100%;border-radius:999px;background:${({$color})=>$color};
  width:${({$pct})=>`${$pct}%`};
  animation:${barGrow} 0.7s ease both;animation-delay:${({$delay})=>$delay||"0s"};
`;

/* ═══════════════════════════════════════════════════════════════
   CUSTOM HOOKS
═══════════════════════════════════════════════════════════════ */
const useLocalPagination = (items, perPage = 10) => {
  const [page, setPage] = useState(1);
  // Reset to page 1 whenever the items array length changes
  useEffect(() => { setPage(1); }, [items.length]);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const current    = useMemo(
    () => items.slice((safePage - 1) * perPage, safePage * perPage),
    [items, safePage, perPage]
  );
  const go = useCallback((p) => {
    setPage(prev => {
      const n = typeof p === "function" ? p(prev) : p;
      return Math.max(1, Math.min(n, totalPages));
    });
  }, [totalPages]);
  return { page: safePage, totalPages, current, go };
};

const useSort = (items, defKey = "id", defDir = "asc") => {
  const [cfg, setCfg] = useState({ key: defKey, dir: defDir });
  const toggle = useCallback(key => {
    setCfg(p => ({ key, dir: p.key === key && p.dir === "asc" ? "desc" : "asc" }));
  }, []);
  const SortIco = useCallback(({ k }) => {
    if (cfg.key !== k) return <FaSort style={{ opacity:0.4 }} />;
    return cfg.dir === "asc"
      ? <FaSortUp   style={{ color:C.orange }} />
      : <FaSortDown style={{ color:C.orange }} />;
  }, [cfg]);
  const sorted = useMemo(() => {
    if (!cfg.key) return items;
    return [...items].sort((a, b) => {
      let av = a[cfg.key], bv = b[cfg.key];
      // Date detection
      if (typeof av === "string" && av.includes("-") && !isNaN(Date.parse(av))) {
        av = new Date(av).getTime(); bv = new Date(bv || 0).getTime();
      }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return cfg.dir === "asc" ? -1 : 1;
      if (av > bv) return cfg.dir === "asc" ?  1 : -1;
      return 0;
    });
  }, [items, cfg]);
  return { sorted, toggle, SortIco };
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE RENDER HELPERS
═══════════════════════════════════════════════════════════════ */
function Pager({ page, totalPages, go, dark }) {
  if (totalPages <= 1) return null;
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }
  return (
    <PageRow>
      <PBtn $d={dark} onClick={() => go(p => p - 1)} disabled={page === 1}>
        <FaChevronLeft style={{ fontSize:"0.65rem" }} />
      </PBtn>
      {pages.map((p, i) =>
        p === "…"
          ? <PBtn key={`e${i}`} $d={dark} disabled style={{ opacity:0.35 }}>
              <FaEllipsisH style={{ fontSize:"0.58rem" }} />
            </PBtn>
          : <PBtn key={p} $d={dark} $active={p === page} onClick={() => go(p)}>{p}</PBtn>
      )}
      <PBtn $d={dark} onClick={() => go(p => p + 1)} disabled={page === totalPages}>
        <FaChevronRight style={{ fontSize:"0.65rem" }} />
      </PBtn>
      <PageInfo $d={dark}>{page} / {totalPages}</PageInfo>
    </PageRow>
  );
}

function StatItem({ icon, label, value, color, trend, dark, delay }) {
  return (
    <StatCard $d={dark} $color={color} $delay={delay}>
      <StatIco $color={color}>{icon}</StatIco>
      <StatVal $d={dark}>{value}</StatVal>
      <StatLbl $d={dark}>{label}</StatLbl>
      {trend != null && (
        <StatTrend $up={trend >= 0}>
          {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}%
        </StatTrend>
      )}
    </StatCard>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTNER APPLICATIONS MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const PartnerApplicationsManagement = React.memo(({
  partnerApplications = [], handleApproveApplication, handleRejectApplication,
  theme, loading, error, handleRefreshApplications, token, getApiUrl,
}) => {
  const d = theme?.mode === "dark";
  const [search,    setSearch]    = useState("");
  const [statusF,   setStatusF]   = useState("ALL");
  const [view,      setView]      = useState("cards");
  const [rejectId,  setRejectId]  = useState(null);
  const [reason,    setReason]    = useState("");
  const [actLoad,   setActLoad]   = useState(null);
  const [localApps, setLocalApps] = useState([]);

  useEffect(() => { setLocalApps(partnerApplications); }, [partnerApplications]);

  const filtered = useMemo(() => {
    if (!Array.isArray(localApps)) return [];
    const q = search.toLowerCase();
    return localApps.filter(a =>
      (!search ||
        a.restaurantName?.toLowerCase().includes(q) ||
        a.ownerName?.toLowerCase().includes(q)      ||
        a.email?.toLowerCase().includes(q)          ||
        a.city?.toLowerCase().includes(q)           ||
        a.cuisineType?.toLowerCase().includes(q)
      ) && (statusF === "ALL" || a.status === statusF)
    );
  }, [localApps, search, statusF]);

  const { sorted, toggle, SortIco } = useSort(filtered, "createdAt", "desc");
  const { page, totalPages, current, go } = useLocalPagination(sorted, 12);

  const pending  = localApps.filter(a => a.status === "PENDING").length;
  const approved = localApps.filter(a => a.status === "APPROVED").length;
  const rejected = localApps.filter(a => a.status === "REJECTED").length;
  const selApp   = rejectId ? localApps.find(a => a.id === rejectId) : null;

  const onApprove = useCallback(async id => {
    if (!window.confirm("Approve this application?\n\n✅ Restaurant owner account will be created\n✅ Login credentials sent to their email")) return;
    setActLoad(id);
    try {
      let success = false;
      if (typeof handleApproveApplication === "function") {
        const result = await handleApproveApplication(id);
        success = result?.success !== false;
      } else if (token && getApiUrl) {
        await axios.put(getApiUrl(`/api/admin/partners/${id}/approve`), {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success = true;
      }
      if (success) {
        toast.success("Application approved — credentials sent!");
        setLocalApps(prev => prev.map(a => a.id === id ? { ...a, status:"APPROVED" } : a));
        handleRefreshApplications?.();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to approve.");
    } finally { setActLoad(null); }
  }, [handleApproveApplication, handleRefreshApplications, token, getApiUrl]);

  const openReject = useCallback(id => { setRejectId(id); setReason(""); }, []);

  const onReject = useCallback(async () => {
    if (!rejectId || !reason.trim()) { toast.error("Please provide a rejection reason."); return; }
    setActLoad(rejectId);
    try {
      let success = false;
      if (typeof handleRejectApplication === "function") {
        const result = await handleRejectApplication(rejectId, reason.trim());
        success = result?.success !== false;
      } else if (token && getApiUrl) {
        await axios.put(
          getApiUrl(`/api/admin/partners/${rejectId}/reject`),
          { reason: reason.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        success = true;
      }
      if (success) {
        toast.success("Application rejected — applicant notified.");
        setLocalApps(prev => prev.map(a => a.id === rejectId ? { ...a, status:"REJECTED" } : a));
        handleRefreshApplications?.();
        setRejectId(null); setReason("");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to reject.");
    } finally { setActLoad(null); }
  }, [rejectId, reason, handleRejectApplication, handleRefreshApplications, token, getApiUrl]);

  const pillFor = s => {
    if (s === "PENDING")  return { $variant:"orange" };
    if (s === "APPROVED") return { $variant:"green"  };
    if (s === "REJECTED") return { $variant:"red"    };
    return { $variant:"blue" };
  };

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading partner applications…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <HeroBanner $d={d}>
        <HeroTitle><FaHandshake /> Partner Applications</HeroTitle>
        <HeroSub $d={d}>
          Review, approve or reject restaurant partnership requests.
          Approved partners automatically receive login credentials by email.
        </HeroSub>
        <HeroPills>
          <HeroPill $bg={C.amberBg} $color={C.amber} $delay="0.05s"><FaClock />      {pending}  Pending</HeroPill>
          <HeroPill $bg={C.greenBg} $color={C.green} $delay="0.1s"> <FaThumbsUp />  {approved} Approved</HeroPill>
          <HeroPill $bg={C.redBg}   $color={C.red}   $delay="0.15s"><FaThumbsDown /> {rejected} Rejected</HeroPill>
          <HeroPill $bg={C.cyanBg}  $color={C.cyan}  $delay="0.2s"> <FaStore />      {localApps.length} Total</HeroPill>
        </HeroPills>
      </HeroBanner>

      <SecHead>
        <SecTitle $d={d}>
          <FaHandshake /> Applications
          {filtered.length !== localApps.length && (
            <TitleCount $d={d}>{filtered.length} of {localApps.length}</TitleCount>
          )}
        </SecTitle>
        <BtnRow>
          <ViewToggle $d={d}>
            <VBtn $active={view==="cards"} $d={d} onClick={() => setView("cards")}>⊞ Cards</VBtn>
            <VBtn $active={view==="table"} $d={d} onClick={() => setView("table")}>≡ Table</VBtn>
          </ViewToggle>
          <Btn $variant="default" $d={d} onClick={handleRefreshApplications}><FaSyncAlt /> Refresh</Btn>
        </BtnRow>
      </SecHead>

      <Filters>
        <SearchWrap $d={d}>
          <FaSearch className="s-icon"/>
          <SearchIn $d={d} type="text" placeholder="Search restaurant, owner, email, city…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </SearchWrap>
        <Sel $d={d} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Sel>
      </Filters>

      {sorted.length === 0 ? (
        <Empty $d={d}><FaHandshake /><p>No applications found. Try adjusting your filters.</p></Empty>
      ) : view === "cards" ? (
        <PCardGrid>
          {current.map((app, i) => (
            <PCard key={app.id} $d={d} $status={app.status} $delay={`${i * 0.04}s`}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"0.9rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", minWidth:0 }}>
                  <PCardIcon $status={app.status}>{app.restaurantName?.charAt(0).toUpperCase() || "R"}</PCardIcon>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:"0.9rem",
                      color:th(d,C.lText,C.dText), overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {app.restaurantName}
                    </div>
                    <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted), marginTop:2 }}>{app.cuisineType}</div>
                  </div>
                </div>
                <Pill {...pillFor(app.status)} $pulse={app.status==="PENDING"} style={{ flexShrink:0 }}>
                  {app.status==="PENDING"  && <FaClock       style={{ fontSize:"0.62rem" }} />}
                  {app.status==="APPROVED" && <FaCheckCircle style={{ fontSize:"0.62rem" }} />}
                  {app.status==="REJECTED" && <FaTimesCircle style={{ fontSize:"0.62rem" }} />}
                  {app.status}
                </Pill>
              </div>

              <PRow $d={d} $iconColor={C.indigo}><FaUser />         <span>{app.ownerName}</span></PRow>
              <PRow $d={d} $iconColor={C.cyan}>  <FaEnvelope />     <span>{app.email}</span></PRow>
              <PRow $d={d} $iconColor={C.green}> <FaPhoneAlt />     <span>{app.phone}</span></PRow>
              <PRow $d={d} $iconColor={C.orange}><FaMapMarkerAlt /> <span>{app.city}{app.address ? `, ${app.address}` : ""}</span></PRow>
              <PRow $d={d}>                       <FaCalendarAlt />  <span>Applied {new Date(app.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span></PRow>

              {app.message && (
                <PMsg $d={d}>"{app.message.length > 100 ? app.message.slice(0,100) + "…" : app.message}"</PMsg>
              )}

              {app.status === "PENDING" && (
                <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.9rem" }}>
                  <Btn $variant="green" onClick={() => onApprove(app.id)} disabled={actLoad === app.id} style={{ flex:1, justifyContent:"center" }}>
                    {actLoad===app.id
  ? <SpinnerIcon />
  : <FaThumbsUp />}
                    {actLoad===app.id ? "Processing…" : "Approve"}
                  </Btn>
                  <Btn $variant="red" $d={d} onClick={() => openReject(app.id)} disabled={actLoad===app.id} style={{ flex:1, justifyContent:"center" }}>
                    <FaThumbsDown /> Reject
                  </Btn>
                </div>
              )}
              {app.status === "APPROVED" && (
                <div style={{ marginTop:"0.8rem", fontSize:"0.79rem", color:C.green, fontWeight:500, display:"flex", alignItems:"center", gap:"0.35rem" }}>
                  <FaCheckCircle /> Owner account created
                </div>
              )}
              {app.status === "REJECTED" && (
                <div style={{ marginTop:"0.8rem", fontSize:"0.79rem", color:C.red, fontWeight:500, display:"flex", alignItems:"center", gap:"0.35rem" }}>
                  <FaTimesCircle /> Applicant notified by email
                </div>
              )}
            </PCard>
          ))}
        </PCardGrid>
      ) : (
        <TableWrap $d={d}>
          <T>
            <THead $d={d}>
              <tr>
                <Th $d={d}>ID</Th>
                <Th $d={d}><ThBtn onClick={() => toggle("restaurantName")}>Restaurant <SortIco k="restaurantName"/></ThBtn></Th>
                <Th $d={d}>Owner</Th>
                <Th $d={d}>Contact</Th>
                <Th $d={d}>Cuisine / City</Th>
                <Th $d={d}>Status</Th>
                <Th $d={d}><ThBtn onClick={() => toggle("createdAt")}>Applied <SortIco k="createdAt"/></ThBtn></Th>
                <Th $d={d}>Actions</Th>
              </tr>
            </THead>
            <tbody>
              {current.map(app => (
                <Tr key={app.id} $d={d}>
                  <Td $d={d} style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>#{app.id}</Td>
                  <Td $d={d}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.55rem" }}>
                      <PCardIcon $status={app.status} style={{ width:32, height:32, fontSize:"0.85rem", borderRadius:8 }}>
                        {app.restaurantName?.charAt(0).toUpperCase()}
                      </PCardIcon>
                      <div style={{ fontWeight:600, fontSize:"0.84rem" }}>{app.restaurantName}</div>
                    </div>
                  </Td>
                  <Td $d={d} style={{ fontWeight:500 }}>{app.ownerName}</Td>
                  <Td $d={d}>
                    <div style={{ fontSize:"0.82rem" }}>{app.email}</div>
                    <div style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>{app.phone}</div>
                  </Td>
                  <Td $d={d}>
                    <div style={{ fontWeight:500 }}>{app.cuisineType}</div>
                    <div style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>{app.city}</div>
                  </Td>
                  <Td $d={d}><Pill {...pillFor(app.status)}>{app.status}</Pill></Td>
                  <Td $d={d} style={{ fontSize:"0.8rem" }}>{new Date(app.createdAt).toLocaleDateString()}</Td>
                  <Td $d={d}>
                    {app.status === "PENDING" && (
                      <div style={{ display:"flex", gap:"0.38rem" }}>
                        <Btn $sm $variant="green" onClick={() => onApprove(app.id)} disabled={actLoad===app.id}>
                          {actLoad===rejectId
  ? <SpinnerIcon />
  : <FaThumbsDown />}
                        </Btn>
                        <Btn $sm $variant="red" $d={d} onClick={() => openReject(app.id)} disabled={actLoad===app.id}>
                          <FaThumbsDown />
                        </Btn>
                      </div>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </T>
        </TableWrap>
      )}

      <Pager page={page} totalPages={totalPages} go={go} dark={d} />

      {rejectId !== null && selApp && (
        <Overlay onClick={e => e.target===e.currentTarget && setRejectId(null)}>
          <MBox $d={d}>
            <MHead $d={d}>
              <div className="ico"><FaExclamationCircle /></div>
              <h3>Reject Application</h3>
            </MHead>
            <MBody>
              <Preview $d={d}>
                <h4>{selApp.restaurantName}</h4>
                <PreviewRow $d={d}><FaUser />         {selApp.ownerName}</PreviewRow>
                <PreviewRow $d={d}><FaEnvelope />     {selApp.email}</PreviewRow>
                <PreviewRow $d={d}><FaPhoneAlt />     {selApp.phone}</PreviewRow>
                <PreviewRow $d={d}><FaMapMarkerAlt /> {selApp.city}</PreviewRow>
              </Preview>
              <p style={{ fontSize:"0.83rem", color:th(d,C.lMuted,C.dMuted), marginBottom:"0.7rem", lineHeight:1.6 }}>
                Provide a rejection reason — this will be sent to the applicant by email.
              </p>
              <MTextarea $d={d} value={reason} onChange={e => setReason(e.target.value)}
                placeholder="e.g. Missing FSSAI license and GST certificate. Please resubmit with required documents."
                rows={5} autoFocus maxLength={600} />
              <CharHelp $d={d}>
                <span>Required</span>
                <span style={{ color:reason.length > 500 ? C.amber : "inherit" }}>{reason.length}/600</span>
              </CharHelp>
            </MBody>
            <MFoot $d={d}>
              <Btn $variant="default" $d={d} onClick={() => { setRejectId(null); setReason(""); }}>Cancel</Btn>
              <Btn
                $variant="red" $d={d} onClick={onReject}
                disabled={!reason.trim() || actLoad !== null}
                style={{ background:`linear-gradient(135deg,${C.red},#dc2626)`, color:"#fff", border:"none" }}
              >
                {actLoad===rejectId
                  ? <FaSyncAlt style={{ animation:`${spin} 0.75s linear infinite` }} />
                  : <FaThumbsDown />}
                {actLoad===rejectId ? "Processing…" : "Confirm Reject"}
              </Btn>
            </MFoot>
          </MBox>
        </Overlay>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   USER MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const UserManagement = React.memo(({
  allUsers = [], searchQuery, handleSearchChange, selectedItems, setSelectedItems,
  handleBulkAction, exportToCSV, normalizeRole, handleUpdateUserRole,
  handleDeleteUser, theme, loading, error, handleRefreshUsers, setDeleteTarget,
}) => {
  const d = theme?.mode === "dark";
  const [roleF,   setRoleF]   = useState("ALL");
  const [statusF, setStatusF] = useState("ALL");

  const isActive = useCallback(u =>
    u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  , []);

  const getRoleStr = useCallback(u =>
    normalizeRole ? normalizeRole(u.role) : (u.role || "USER").replace("ROLE_","")
  , [normalizeRole]);

  const filtered = useMemo(() => allUsers.filter(u => {
    const q    = searchQuery?.toLowerCase() || "";
    const ok   = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(searchQuery);
    const role = getRoleStr(u);
    const act  = isActive(u);
    return ok
      && (roleF   === "ALL" || role === roleF)
      && (statusF === "ALL" || (statusF==="ACTIVE" && act) || (statusF==="INACTIVE" && !act));
  }), [allUsers, searchQuery, roleF, statusF, getRoleStr, isActive]);

  const { sorted, toggle, SortIco } = useSort(filtered, "id", "asc");
  const { page, totalPages, current, go } = useLocalPagination(sorted, 10);

  const selectAll  = useCallback(e => setSelectedItems(e.target.checked ? current.map(u=>u.id) : []), [current, setSelectedItems]);
  const toggleSel  = useCallback(id => setSelectedItems(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]), [setSelectedItems]);
  const roleColor  = r => r==="ADMIN" ? "red" : r==="RESTAURANT_OWNER" ? "purple" : "blue";
  const allPageSel = current.length > 0 && current.every(u => selectedItems.includes(u.id));

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading users…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaUsers /> User Management<TitleCount $d={d}>{filtered.length}</TitleCount></SecTitle>
        <BtnRow>
          <Btn $variant="default" $d={d} onClick={handleRefreshUsers}><FaSyncAlt /> Refresh</Btn>
          <Btn $variant="default" $d={d} onClick={() => exportToCSV(filtered,"users")}><FaDownload /> Export</Btn>
        </BtnRow>
      </SecHead>

      <Filters>
        <SearchWrap $d={d}>
          <FaSearch className="s-icon"/>
          <SearchIn $d={d} type="text" placeholder="Search by name, email or phone…"
            value={searchQuery} onChange={handleSearchChange} />
        </SearchWrap>
        <Sel $d={d} value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="ALL">All Roles</option>
          <option value="USER">Users</option>
          <option value="ADMIN">Admins</option>
          <option value="RESTAURANT_OWNER">Restaurant Owners</option>
        </Sel>
        <Sel $d={d} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active (30d)</option>
          <option value="INACTIVE">Inactive</option>
        </Sel>
      </Filters>

      {selectedItems.length > 0 && (
        <BulkBar>
          <BulkCnt>{selectedItems.length} selected</BulkCnt>
          <Btn $sm $variant="default" $d={d} onClick={() => handleBulkAction("role","USER")}><FaUser /> User</Btn>
          <Btn $sm $variant="default" $d={d} onClick={() => handleBulkAction("role","ADMIN")}><FaUserShield /> Admin</Btn>
          <Btn $sm $variant="default" $d={d} onClick={() => handleBulkAction("role","RESTAURANT_OWNER")}><FaStore /> Owner</Btn>
          <Btn $sm $variant="red"     $d={d} onClick={() => { if(window.confirm(`Delete ${selectedItems.length} user(s)?`)) handleBulkAction("delete"); }}>
            <FaTrash /> Delete
          </Btn>
          <Btn $sm $variant="default" $d={d} onClick={() => setSelectedItems([])}><FaTimes /></Btn>
        </BulkBar>
      )}

      {filtered.length === 0 ? (
        <Empty $d={d}><FaUsers /><p>No users found.</p></Empty>
      ) : (
        <>
          <TableWrap $d={d}>
            <T>
              <THead $d={d}>
                <tr>
                  <Th $d={d} style={{ width:42, textAlign:"center" }}>
                    <input type="checkbox" style={{ accentColor:C.orange }}
                      onChange={selectAll} checked={allPageSel}
                      ref={el => { if (el) el.indeterminate = selectedItems.length > 0 && !allPageSel; }} />
                  </Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("id")}>ID <SortIco k="id"/></ThBtn></Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("name")}>Name <SortIco k="name"/></ThBtn></Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("email")}>Email <SortIco k="email"/></ThBtn></Th>
                  <Th $d={d}>Role</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("lastLogin")}>Last Login <SortIco k="lastLogin"/></ThBtn></Th>
                  <Th $d={d}>Status</Th>
                  <Th $d={d}>Actions</Th>
                </tr>
              </THead>
              <tbody>
                {current.map(user => {
                  const active = isActive(user);
                  const role   = getRoleStr(user);
                  return (
                    <Tr key={user.id} $d={d}>
                      <Td $d={d} style={{ textAlign:"center" }}>
                        <input type="checkbox" style={{ accentColor:C.orange }}
                          checked={selectedItems.includes(user.id)}
                          onChange={() => toggleSel(user.id)} />
                      </Td>
                      <Td $d={d} style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>#{user.id}</Td>
                      <Td $d={d}>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                          <Av>{user.name?.charAt(0).toUpperCase() || "U"}</Av>
                          <div>
                            <div style={{ fontWeight:600, fontSize:"0.84rem" }}>{user.name || "User"}</div>
                            {user.phone && <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>{user.phone}</div>}
                          </div>
                        </div>
                      </Td>
                      <Td $d={d} style={{ fontSize:"0.82rem" }}>{user.email || "—"}</Td>
                      <Td $d={d}>
                        <Pill $variant={roleColor(role)}>
                          {role==="ADMIN" ? "Admin" : role==="RESTAURANT_OWNER" ? "Owner" : "User"}
                        </Pill>
                      </Td>
                      <Td $d={d} style={{ fontSize:"0.8rem", color:th(d,C.lMuted,C.dMuted) }}>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
                          : "Never"}
                      </Td>
                      <Td $d={d}>
                        <Pill $variant={active?"green":"blue"}>
                          {active ? <><FaCheck style={{ fontSize:"0.6rem" }} /> Active</> : "Inactive"}
                        </Pill>
                      </Td>
                      <Td $d={d}>
                        <div style={{ display:"flex", gap:"0.38rem", alignItems:"center" }}>
                          <Sel $d={d} value={role}
                            onChange={e => handleUpdateUserRole(user.id, e.target.value)}
                            style={{ height:32, fontSize:"0.78rem", padding:"0 1.7rem 0 0.6rem", borderRadius:7, minWidth:100 }}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="RESTAURANT_OWNER">Owner</option>
                          </Sel>
                          <Btn $sm $variant="red" $d={d} onClick={() => setDeleteTarget({ type:"user", id:user.id, name:user.name })}>
                            <FaTrash />
                          </Btn>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </T>
          </TableWrap>
          <Pager page={page} totalPages={totalPages} go={go} dark={d} />
        </>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ORDER MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const OrderManagement = React.memo(({
  allOrders = [], handleUpdateOrderStatus, handleViewOrder,
  theme, loading, error, handleRefreshOrders, exportToCSV,
}) => {
  const d = theme?.mode === "dark";
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("ALL");
  const [dateF,   setDateF]   = useState("ALL");

  const ago = useCallback(days => new Date(Date.now() - days * 24 * 60 * 60 * 1000), []);
  const isToday    = useCallback(dt => { const n=new Date(); return dt.getDate()===n.getDate()&&dt.getMonth()===n.getMonth()&&dt.getFullYear()===n.getFullYear(); }, []);
  const isThisWeek = useCallback(dt => { const s=new Date(); s.setDate(s.getDate()-s.getDay()); s.setHours(0,0,0,0); return dt>=s; }, []);
  const isThisMon  = useCallback(dt => { const n=new Date(); return dt.getMonth()===n.getMonth()&&dt.getFullYear()===n.getFullYear(); }, []);

  const filtered = useMemo(() => allOrders.filter(o => {
    const q   = search.toLowerCase();
    const ok  = !search || o.userName?.toLowerCase().includes(q) || o.userEmail?.toLowerCase().includes(q) || o.id?.toString().includes(search);
    const sOk = statusF==="ALL" || o.status===statusF;
    const dt  = new Date(o.createdAt);
    const dOk = dateF==="ALL"
      || (dateF==="TODAY" && isToday(dt))
      || (dateF==="WEEK"  && isThisWeek(dt))
      || (dateF==="MONTH" && isThisMon(dt));
    return ok && sOk && dOk;
  }), [allOrders, search, statusF, dateF, isToday, isThisWeek, isThisMon]);

  const { sorted, toggle, SortIco } = useSort(filtered, "createdAt", "desc");
  const { page, totalPages, current, go } = useLocalPagination(sorted, 10);

  const revenue   = useMemo(() => filtered.reduce((s,o) => s+(o.totalPrice||0), 0), [filtered]);
  const pending   = filtered.filter(o => o.status==="Pending").length;
  const delivered = filtered.filter(o => o.status==="Delivered").length;

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading orders…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaShoppingBag /> Order Management<TitleCount $d={d}>{filtered.length}</TitleCount></SecTitle>
        <BtnRow>
          <Btn $variant="default" $d={d} onClick={handleRefreshOrders}><FaSyncAlt /> Refresh</Btn>
          <Btn $variant="default" $d={d} onClick={() => exportToCSV(filtered,"orders")}><FaDownload /> Export</Btn>
        </BtnRow>
      </SecHead>

      <StatsGrid>
        <StatItem icon={<FaMoneyBillWave />} label="Revenue" value={`₹${revenue}`} color={C.orange} dark={d} delay="0s" trend={12} />
        <StatItem icon={<FaShoppingBag />}   label="Total Orders" value={filtered.length} color={C.green} dark={d} delay="0.05s" />
        <StatItem icon={<FaClock />}         label="Pending"      value={pending} color={C.amber} dark={d} delay="0.1s" />
        <StatItem icon={<FaCheckCircle />}   label="Delivered"    value={delivered} color={C.cyan} dark={d} delay="0.15s" />
      </StatsGrid>

      <Filters>
        <SearchWrap $d={d}>
          <FaSearch className="s-icon"/>
          <SearchIn $d={d} type="text" placeholder="Search by customer, email or order ID…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </SearchWrap>
        <Sel $d={d} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="ALL">All Status</option>
          {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
        </Sel>
        <Sel $d={d} value={dateF} onChange={e => setDateF(e.target.value)}>
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">This Week</option>
          <option value="MONTH">This Month</option>
        </Sel>
      </Filters>

      {sorted.length === 0 ? (
        <Empty $d={d}><FaShoppingBag /><p>No orders match your current filters.</p></Empty>
      ) : (
        <>
          <TableWrap $d={d}>
            <T>
              <THead $d={d}>
                <tr>
                  <Th $d={d}><ThBtn onClick={() => toggle("id")}>Order ID <SortIco k="id"/></ThBtn></Th>
                  <Th $d={d}>Customer</Th>
                  <Th $d={d}>Address</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("totalPrice")}>Total <SortIco k="totalPrice"/></ThBtn></Th>
                  <Th $d={d}>Status</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("createdAt")}>Date <SortIco k="createdAt"/></ThBtn></Th>
                  <Th $d={d}>Actions</Th>
                </tr>
              </THead>
              <tbody>
                {current.map(order => (
                  <Tr key={order.id} $d={d}>
                    <Td $d={d}>
                      <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, color:C.indigo }}>#{order.id}</span>
                    </Td>
                    <Td $d={d}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <Av>{order.userName?.charAt(0).toUpperCase() || "C"}</Av>
                        <div>
                          <div style={{ fontWeight:600, fontSize:"0.84rem" }}>{order.userName || "Customer"}</div>
                          <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>{order.userEmail || "—"}</div>
                        </div>
                      </div>
                    </Td>
                    <Td $d={d}>
                      {order.addressLine1 ? (
                        <div style={{ fontSize:"0.82rem" }}>
                          {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}
                          <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>{order.city} — {order.pincode}</div>
                        </div>
                      ) : (
                        <span style={{ color:th(d,C.lSubtle,C.dSubtle), fontSize:"0.8rem" }}>No address</span>
                      )}
                    </Td>
                    <Td $d={d}>
                      <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, color:C.indigo }}>
                        ₹{order.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                    </Td>
                    <Td $d={d}>
                      <Sel $d={d} value={order.status||"Pending"}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                        style={{ height:32, fontSize:"0.78rem", padding:"0 1.7rem 0 0.6rem", borderRadius:7 }}>
                        {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </Sel>
                    </Td>
                    <Td $d={d} style={{ fontSize:"0.8rem", color:th(d,C.lMuted,C.dMuted) }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"}
                    </Td>
                    <Td $d={d}>
                      <div style={{ display:"flex", gap:"0.38rem" }}>
                        <Btn $sm $variant="default" $d={d} onClick={() => handleViewOrder(order)}><FaEye /> Details</Btn>
                        <Btn $sm $variant="red" $d={d} onClick={() => {
                          if(window.confirm("Cancel this order?")) handleUpdateOrderStatus(order.id,"Cancelled");
                        }}><FaTimes /></Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </T>
          </TableWrap>
          <Pager page={page} totalPages={totalPages} go={go} dark={d} />
        </>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   MENU MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const MenuManagement = React.memo(({
  menuItems = [], searchQuery, handleSearchChange, openMenuItemModal,
  handleEditMenuItem, handleDeleteMenuItem, theme, loading, error, handleRefreshMenu,
  setDeleteTarget,
}) => {
  const d = theme?.mode === "dark";
  const [catF,  setCatF]  = useState("ALL");
  const [typeF, setTypeF] = useState("ALL");

  const cats = useMemo(() => {
    const s = new Set();
    menuItems.forEach(i => { const c = i.categoryName || i.category?.name; if (c) s.add(c); });
    return Array.from(s).sort();
  }, [menuItems]);

  const filtered = useMemo(() => {
    const q = searchQuery?.toLowerCase() || "";
    return menuItems.filter(item => {
      const ok  = !q || item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      const cat = item.categoryName || item.category?.name;
      return ok && (catF==="ALL" || cat===catF) && (typeF==="ALL" || item.type===typeF);
    });
  }, [menuItems, searchQuery, catF, typeF]);

  const { sorted, toggle, SortIco } = useSort(filtered, "name", "asc");
  const { page, totalPages, current, go } = useLocalPagination(sorted, 12);

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading menu…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaUtensils /> Menu Management<TitleCount $d={d}>{filtered.length}</TitleCount></SecTitle>
        <BtnRow>
          <Btn $variant="default" $d={d} onClick={handleRefreshMenu}><FaSyncAlt /> Refresh</Btn>
          {/* This calls openMenuItemModal from Profile.jsx — opens MenuItemModal */}
          <Btn $variant="orange" onClick={openMenuItemModal}><FaPlus /> Add Item</Btn>
        </BtnRow>
      </SecHead>

      <Filters>
        <SearchWrap $d={d}>
          <FaSearch className="s-icon"/>
          <SearchIn $d={d} type="text" placeholder="Search menu items…" value={searchQuery} onChange={handleSearchChange} />
        </SearchWrap>
        <Sel $d={d} value={catF} onChange={e => setCatF(e.target.value)}>
          <option value="ALL">All Categories</option>
          {cats.map(c => <option key={c}>{c}</option>)}
        </Sel>
        <Sel $d={d} value={typeF} onChange={e => setTypeF(e.target.value)}>
          <option value="ALL">All Types</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </Sel>
      </Filters>

      {sorted.length === 0 ? (
        <Empty $d={d}><FaUtensils /><p>No menu items found.</p></Empty>
      ) : (
        <>
          <TableWrap $d={d}>
            <T>
              <THead $d={d}>
                <tr>
                  <Th $d={d}>ID</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("name")}>Name <SortIco k="name"/></ThBtn></Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("price")}>Price <SortIco k="price"/></ThBtn></Th>
                  <Th $d={d}>Category</Th>
                  <Th $d={d}>Type</Th>
                  <Th $d={d}>Actions</Th>
                </tr>
              </THead>
              <tbody>
                {current.map(item => (
                  <Tr key={item.id} $d={d}>
                    <Td $d={d} style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>#{item.id}</Td>
                    <Td $d={d}>
                      <div style={{ fontWeight:600 }}>{item.name}</div>
                      <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>
                        {item.description?.slice(0,52)}{item.description?.length>52?"…":""}
                      </div>
                    </Td>
                    <Td $d={d}>
                      <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, color:C.indigo }}>
                        ₹{item.price?.toFixed(2) || "0.00"}
                      </span>
                    </Td>
                    <Td $d={d} style={{ fontSize:"0.82rem" }}>{item.categoryName || item.category?.name || "Uncategorized"}</Td>
                    <Td $d={d}>
                      <Pill $variant={item.type==="Non-Veg"?"red":"green"}>
                        {item.type==="Non-Veg" ? "🥩 Non-Veg" : "🥬 Veg"}
                      </Pill>
                    </Td>
                    <Td $d={d}>
                      <div style={{ display:"flex", gap:"0.38rem" }}>
                        {/* Edit opens Profile's MenuItemModal */}
                        <Btn $sm $variant="default" $d={d} onClick={() => handleEditMenuItem(item)}><FaEdit /></Btn>
                        {/* Delete uses AdminSection's own confirm modal */}
                        <Btn $sm $variant="red" $d={d} onClick={() => setDeleteTarget({ type:"menuItem", id:item.id, name:item.name })}>
                          <FaTrash />
                        </Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </T>
          </TableWrap>
          <Pager page={page} totalPages={totalPages} go={go} dark={d} />
        </>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   CATEGORY MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const CategoryManagement = React.memo(({
  categories = [], setIsCategoryModalOpen, setEditCategory, setCategoryForm,
  handleEditCategory, handleDeleteCategory, theme, loading, error,
  handleRefreshCategories, setDeleteTarget,
}) => {
  const d = theme?.mode === "dark";
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? categories.filter(c => c.name?.toLowerCase().includes(q)) : categories;
  }, [categories, search]);

  const { sorted, toggle, SortIco } = useSort(filtered, "name", "asc");
  const { page, totalPages, current, go } = useLocalPagination(sorted, 12);

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading categories…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaLayerGroup /> Category Management<TitleCount $d={d}>{filtered.length}</TitleCount></SecTitle>
        <BtnRow>
          <Btn $variant="default" $d={d} onClick={handleRefreshCategories}><FaSyncAlt /> Refresh</Btn>
          {/* Opens Profile's CategoryModal */}
          <Btn $variant="orange" onClick={() => {
            setEditCategory(null);
            setCategoryForm({ name:"" });
            setIsCategoryModalOpen(true);
          }}>
            <FaPlus /> Add Category
          </Btn>
        </BtnRow>
      </SecHead>

      <Filters>
        <SearchWrap $d={d}>
          <FaSearch className="s-icon"/>
          <SearchIn $d={d} type="text" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)} />
        </SearchWrap>
      </Filters>

      {sorted.length === 0 ? (
        <Empty $d={d}><FaLayerGroup /><p>No categories found.</p></Empty>
      ) : (
        <>
          <TableWrap $d={d}>
            <T>
              <THead $d={d}>
                <tr>
                  <Th $d={d}>ID</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("name")}>Name <SortIco k="name"/></ThBtn></Th>
                  <Th $d={d}>Description</Th>
                  <Th $d={d}><ThBtn onClick={() => toggle("itemCount")}>Items <SortIco k="itemCount"/></ThBtn></Th>
                  <Th $d={d}>Status</Th>
                  <Th $d={d}>Actions</Th>
                </tr>
              </THead>
              <tbody>
                {current.map(cat => (
                  <Tr key={cat.id} $d={d}>
                    <Td $d={d} style={{ fontSize:"0.76rem", color:th(d,C.lMuted,C.dMuted) }}>#{cat.id}</Td>
                    <Td $d={d} style={{ fontWeight:600 }}>{cat.name || "Untitled"}</Td>
                    <Td $d={d} style={{ fontSize:"0.82rem", color:th(d,C.lMuted,C.dMuted) }}>{cat.description || "—"}</Td>
                    <Td $d={d}>
                      <Pill $variant={(cat.itemCount||0)>0?"green":"blue"}>{cat.itemCount||0} items</Pill>
                    </Td>
                    <Td $d={d}>
                      <Pill $variant={cat.isActive!==false?"green":"red"}>
                        {cat.isActive!==false ? <><FaCheck style={{ fontSize:"0.6rem" }} /> Active</> : "Inactive"}
                      </Pill>
                    </Td>
                    <Td $d={d}>
                      <div style={{ display:"flex", gap:"0.38rem" }}>
                        {/* Edit opens Profile's CategoryModal */}
                        <Btn $sm $variant="default" $d={d} onClick={() => handleEditCategory(cat)}><FaEdit /></Btn>
                        {/* Delete uses AdminSection's own confirm modal */}
                        <Btn $sm $variant="red" $d={d} onClick={() => setDeleteTarget({ type:"category", id:cat.id, name:cat.name })}>
                          <FaTrash />
                        </Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </T>
          </TableWrap>
          <Pager page={page} totalPages={totalPages} go={go} dark={d} />
        </>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATION MANAGEMENT
═══════════════════════════════════════════════════════════════ */
const NotificationManagement = React.memo(({
  allUsers = [], theme, loading, error, handleRefreshNotifications, token, getApiUrl,
  normalizeRole = role => role ? role.replace("ROLE_","") : "USER",
}) => {
  const d = theme?.mode === "dark";
  const [notifs,   setNotifs]   = useState([]);
  const [history,  setHistory]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [histLoad, setHistLoad] = useState(false);
  const [sending,  setSending]  = useState(false);
  const [selUsers, setSelUsers] = useState([]);
  const [form, setForm] = useState({
    title:"", content:"", type:"promotion",
    targetType:"ALL", selectedRole:"USER", imageUrl:"",
  });

  const upd = useCallback((k, v) => setForm(p => ({ ...p, [k]:v })), []);

  const fetchNotifs = useCallback(async () => {
    if (!token || !getApiUrl) return;
    try {
      const r = await axios.get(getApiUrl("/api/notifications"), { headers:{ Authorization:`Bearer ${token}` } });
      setNotifs(Array.isArray(r.data) ? r.data : (r.data?.content ?? []));
    } catch { setNotifs([]); }
  }, [token, getApiUrl]);

  const fetchHist = useCallback(async () => {
    if (!token || !getApiUrl) return;
    setHistLoad(true);
    try {
      const r = await axios.get(getApiUrl("/api/admin/notifications-history"), { headers:{ Authorization:`Bearer ${token}` } });
      setHistory(Array.isArray(r.data) ? r.data : []);
    } catch { setHistory([]); }
    finally { setHistLoad(false); }
  }, [token, getApiUrl]);

  useEffect(() => {
    if (token && getApiUrl) { fetchNotifs(); fetchHist(); }
  }, [token, getApiUrl, fetchNotifs, fetchHist]);

  const handleSend = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error("Title and content are required."); return; }
    setSending(true);
    try {
      const payload = {
        title: form.title, content: form.content, type: form.type,
        targetType: form.targetType,
        userIds: form.targetType==="SELECTED" ? selUsers : [],
        role: form.targetType==="ROLE_BASED" ? form.selectedRole : null,
        imageUrl: form.imageUrl || "",
      };
      if (token && getApiUrl) {
        await axios.post(getApiUrl("/api/admin/notifications"), payload, { headers:{ Authorization:`Bearer ${token}` } });
      }
      const now = new Date().toISOString();
      setHistory(p => [{ id:Date.now(), ...payload, status:"sent", sentAt:now }, ...p]);
      setNotifs(p  => [{ id:Date.now(), ...payload, createdAt:now, read:false }, ...p]);
      toast.success("Notification sent!");
      setForm({ title:"", content:"", type:"promotion", targetType:"ALL", selectedRole:"USER", imageUrl:"" });
      setSelUsers([]); setShowForm(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send.");
    } finally { setSending(false); }
  };

  const unread    = notifs.filter(n => !n.read).length;
  const scheduled = history.filter(n => n.status==="scheduled").length;
  const sent      = history.filter(n => n.status==="sent").length;

  if (loading) return <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading notifications…</LoadTxt></LoadBox>;
  if (error)   return <ErrBox><FaExclamationTriangle /> {error}</ErrBox>;

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaBell /> Notifications</SecTitle>
        <BtnRow>
          <Btn $variant="default" $d={d} onClick={() => { fetchNotifs(); handleRefreshNotifications?.(); }}><FaSyncAlt /> Refresh</Btn>
          <Btn $variant="default" $d={d} onClick={() => { setShowHist(p => !p); if(!showHist) fetchHist(); }}>
            <FaHistory /> {showHist ? "Hide History" : "History"}
          </Btn>
          <Btn $variant="orange" onClick={() => setShowForm(true)} disabled={sending}><FaPaperPlane /> Send</Btn>
        </BtnRow>
      </SecHead>

      <StatsGrid>
        <StatItem icon={<FaBell />}       label="Total"     value={notifs.length} color={C.orange} dark={d} delay="0s"    />
        <StatItem icon={<FaEnvelope />}   label="Unread"    value={unread}        color={C.amber}  dark={d} delay="0.05s" />
        <StatItem icon={<FaClock />}      label="Scheduled" value={scheduled}     color={C.cyan}   dark={d} delay="0.1s"  />
        <StatItem icon={<FaPaperPlane />} label="Sent"      value={sent}          color={C.green}  dark={d} delay="0.15s" />
      </StatsGrid>

      <BtnRow style={{ marginBottom:"1.25rem" }}>
        <Btn $variant="default" $d={d} disabled={unread===0} onClick={async () => {
          if (token && getApiUrl) await axios.post(getApiUrl("/api/notifications/mark-all-read"), {}, { headers:{ Authorization:`Bearer ${token}` } });
          setNotifs(p => p.map(n => ({ ...n, read:true })));
          toast.success("All marked read");
        }}><FaCheckCircle /> Mark All Read</Btn>
        <Btn $variant="red" $d={d} disabled={notifs.length===0} onClick={async () => {
          if (!window.confirm("Clear all notifications?")) return;
          if (token && getApiUrl) await axios.delete(getApiUrl("/api/notifications/clear-all"), { headers:{ Authorization:`Bearer ${token}` } });
          setNotifs([]);
          toast.success("Cleared");
        }}><FaTrash /> Clear All</Btn>
      </BtnRow>

      <SecTitle $d={d} style={{ fontSize:"1rem", marginBottom:"0.9rem" }}>
        <FaBell /> Recent Notifications<TitleCount $d={d}>{notifs.length}</TitleCount>
      </SecTitle>

      {notifs.length === 0 ? (
        <Empty $d={d}><FaBellSlash /><p>No notifications yet.</p></Empty>
      ) : (
        <TableWrap $d={d}>
          <T>
            <THead $d={d}>
              <tr>
                <Th $d={d}>Title</Th>
                <Th $d={d}>Type</Th>
                <Th $d={d}>Target</Th>
                <Th $d={d}>Date</Th>
                <Th $d={d}>Status</Th>
                <Th $d={d}>Actions</Th>
              </tr>
            </THead>
            <tbody>
              {notifs.slice(0,10).map(n => (
                <Tr key={n.id} $d={d}>
                  <Td $d={d}>
                    <div style={{ fontWeight:600, fontSize:"0.84rem" }}>{n.title}</div>
                    <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>
                      {n.content?.slice(0,48)}{n.content?.length>48?"…":""}
                    </div>
                  </Td>
                  <Td $d={d}><Pill $variant="blue">{n.type}</Pill></Td>
                  <Td $d={d} style={{ fontSize:"0.82rem" }}>
                    {n.targetType==="ALL" ? "All Users" : n.targetType==="ROLE_BASED" ? `Role: ${n.role}` : "Selected"}
                  </Td>
                  <Td $d={d} style={{ fontSize:"0.8rem", color:th(d,C.lMuted,C.dMuted) }}>
                    {new Date(n.createdAt||n.sentAt).toLocaleDateString()}
                  </Td>
                  <Td $d={d}>
                    <Pill $variant={n.read?"green":"amber"}>
                      {n.read
                        ? <><FaCheckCircle style={{ fontSize:"0.6rem" }} /> Read</>
                        : <><FaEyeSlash   style={{ fontSize:"0.6rem" }} /> Unread</>}
                    </Pill>
                  </Td>
                  <Td $d={d}>
                    <div style={{ display:"flex", gap:"0.38rem" }}>
                      {!n.read && (
                        <Btn $sm $variant="default" $d={d} title="Mark as read" onClick={async () => {
                          if (token && getApiUrl) await axios.put(getApiUrl(`/api/notifications/${n.id}/read`), {}, { headers:{ Authorization:`Bearer ${token}` } });
                          setNotifs(p => p.map(x => x.id===n.id ? { ...x, read:true } : x));
                        }}><FaCheck /></Btn>
                      )}
                      <Btn $sm $variant="red" $d={d} onClick={async () => {
                        if (!window.confirm("Delete?")) return;
                        if (token && getApiUrl) await axios.delete(getApiUrl(`/api/notifications/${n.id}`), { headers:{ Authorization:`Bearer ${token}` } });
                        setNotifs(p => p.filter(x => x.id!==n.id));
                        toast.success("Deleted");
                      }}><FaTrash /></Btn>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </T>
        </TableWrap>
      )}

      {showHist && (
        <>
          <SecTitle $d={d} style={{ fontSize:"1rem", marginTop:"2rem", marginBottom:"0.9rem" }}>
            <FaHistory /> Notification History
            {!histLoad && <TitleCount $d={d}>{history.length}</TitleCount>}
          </SecTitle>
          {histLoad ? (
            <LoadBox><Spinner $d={d}/><LoadTxt $d={d}>Loading history…</LoadTxt></LoadBox>
          ) : history.length === 0 ? (
            <Empty $d={d}><FaHistory /><p>No notification history.</p></Empty>
          ) : (
            <TableWrap $d={d}>
              <T>
                <THead $d={d}>
                  <tr>
                    <Th $d={d}>Title</Th>
                    <Th $d={d}>Type</Th>
                    <Th $d={d}>Target</Th>
                    <Th $d={d}>Sent / Scheduled</Th>
                    <Th $d={d}>Status</Th>
                    <Th $d={d}>Actions</Th>
                  </tr>
                </THead>
                <tbody>
                  {history.map(n => (
                    <Tr key={n.id} $d={d}>
                      <Td $d={d} style={{ fontWeight:600 }}>{n.title}</Td>
                      <Td $d={d}><Pill $variant="blue">{n.type}</Pill></Td>
                      <Td $d={d} style={{ fontSize:"0.82rem" }}>
                        {n.targetType==="ALL" ? "All Users" : n.targetType==="ROLE_BASED" ? `Role: ${n.role}` : `Selected (${n.userIds?.length||0})`}
                      </Td>
                      <Td $d={d} style={{ fontSize:"0.8rem" }}>
                        {n.sentAt ? new Date(n.sentAt).toLocaleString() : n.scheduleDate ? `Sched: ${new Date(n.scheduleDate).toLocaleString()}` : "—"}
                      </Td>
                      <Td $d={d}>
                        <Pill $variant={n.status==="sent"?"green":n.status==="scheduled"?"amber":"red"}>
                          {n.status==="sent"      && <><FaCheckCircle style={{fontSize:"0.6rem"}}/> Sent</>}
                          {n.status==="scheduled" && <><FaClock        style={{fontSize:"0.6rem"}}/> Scheduled</>}
                          {n.status==="failed"    && <><FaTimesCircle  style={{fontSize:"0.6rem"}}/> Failed</>}
                        </Pill>
                      </Td>
                      <Td $d={d}>
                        {n.status==="scheduled" && (
                          <Btn $sm $variant="red" $d={d} onClick={async () => {
                            if (!window.confirm("Cancel?")) return;
                            if (token && getApiUrl) await axios.delete(getApiUrl(`/api/admin/notifications/${n.id}/cancel`), { headers:{ Authorization:`Bearer ${token}` } });
                            setHistory(p => p.filter(x => x.id!==n.id));
                            toast.success("Cancelled");
                          }}><FaTimes /></Btn>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </T>
            </TableWrap>
          )}
        </>
      )}

      {showForm && (
        <NOverlay onClick={e => e.target===e.currentTarget && setShowForm(false)}>
          <NBox $d={d}>
            <NHead $d={d}>
              <h3><FaPaperPlane /> Send Notification</h3>
              <Btn $sm $variant="default" $d={d} onClick={() => setShowForm(false)} disabled={sending}><FaTimes /></Btn>
            </NHead>
            <form onSubmit={handleSend}>
              <NBody>
                <FField>
                  <FLabel $d={d}>Title *</FLabel>
                  <FInput $d={d} type="text" value={form.title} onChange={e => upd("title",e.target.value)}
                    placeholder="Notification title" required disabled={sending} />
                </FField>
                <FField>
                  <FLabel $d={d}>Content *</FLabel>
                  <FTextarea $d={d} value={form.content} onChange={e => upd("content",e.target.value)}
                    placeholder="Message content…" rows={4} required disabled={sending} />
                </FField>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                  <FField>
                    <FLabel $d={d}>Type</FLabel>
                    <FSel $d={d} value={form.type} onChange={e => upd("type",e.target.value)} disabled={sending}>
                      <option value="promotion">Promotion</option>
                      <option value="order">Order Update</option>
                      <option value="system">System</option>
                      <option value="alert">Alert</option>
                    </FSel>
                  </FField>
                  <FField>
                    <FLabel $d={d}>Send To</FLabel>
                    <FSel $d={d} value={form.targetType} onChange={e => upd("targetType",e.target.value)} disabled={sending}>
                      <option value="ALL">All Users</option>
                      <option value="SELECTED">Selected Users</option>
                      <option value="ROLE_BASED">By Role</option>
                    </FSel>
                  </FField>
                </div>

                {form.targetType === "SELECTED" && (
                  <FField>
                    <FLabel $d={d}>Select Users ({selUsers.length} chosen)</FLabel>
                    <UserPicker $d={d}>
                      {allUsers.map(u => (
                        <UPickItem key={u.id} $d={d} $selected={selUsers.includes(u.id)}
                          onClick={() => setSelUsers(p => p.includes(u.id) ? p.filter(x=>x!==u.id) : [...p,u.id])}>
                          <input type="checkbox" checked={selUsers.includes(u.id)} onChange={() => {}} style={{ accentColor:C.orange }} />
                          <Av $size="26px">{u.name?.charAt(0).toUpperCase() || "U"}</Av>
                          <div>
                            <div style={{ fontSize:"0.84rem", fontWeight:500, color:th(d,C.lText,C.dText) }}>{u.name}</div>
                            <div style={{ fontSize:"0.74rem", color:th(d,C.lMuted,C.dMuted) }}>{u.email}</div>
                          </div>
                        </UPickItem>
                      ))}
                    </UserPicker>
                  </FField>
                )}

                {form.targetType === "ROLE_BASED" && (
                  <FField>
                    <FLabel $d={d}>Role</FLabel>
                    <FSel $d={d} value={form.selectedRole} onChange={e => upd("selectedRole",e.target.value)} disabled={sending}>
                      <option value="USER">All Users</option>
                      <option value="ADMIN">Admins Only</option>
                      <option value="RESTAURANT_OWNER">Restaurant Owners Only</option>
                    </FSel>
                  </FField>
                )}

                <FField>
                  <FLabel $d={d}>Image URL (optional)</FLabel>
                  <FInput $d={d} type="text" value={form.imageUrl} onChange={e => upd("imageUrl",e.target.value)}
                    placeholder="https://example.com/image.jpg" disabled={sending} />
                </FField>
              </NBody>
              <NFoot $d={d}>
                <Btn $variant="default" $d={d} type="button" onClick={() => setShowForm(false)} disabled={sending}>Cancel</Btn>
                <Btn $variant="orange" type="submit" disabled={!form.title.trim()||!form.content.trim()||sending}>
                  <FaPaperPlane /> {sending ? "Sending…" : "Send Notification"}
                </Btn>
              </NFoot>
            </form>
          </NBox>
        </NOverlay>
      )}
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS DASHBOARD
═══════════════════════════════════════════════════════════════ */
const AnalyticsDashboard = React.memo(({
  allUsers = [], allOrders = [], menuItems = [], categories = [],
  theme, handleRefreshAnalytics,
}) => {
  const d = theme?.mode === "dark";
  const [timeRange, setTimeRange] = useState("30d");

  const analytics = useMemo(() => {
    const now  = new Date();
    const ago  = days => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    let orders = allOrders;
    let users  = allUsers;
    if (timeRange === "7d")  { orders = allOrders.filter(o => o.createdAt && new Date(o.createdAt) >= ago(7));  users = allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= ago(7)); }
    if (timeRange === "30d") { orders = allOrders.filter(o => o.createdAt && new Date(o.createdAt) >= ago(30)); users = allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= ago(30)); }
    const revenue = orders.reduce((s,o) => s+(o.totalPrice||0), 0);
    const avgVal  = orders.length > 0 ? revenue/orders.length : 0;
    const active  = allUsers.filter(u => u.lastLogin && new Date(u.lastLogin) > ago(30)).length;
    const statusDist = orders.reduce((acc,o) => {
      const s = o.status || "Unknown"; acc[s] = (acc[s]||0) + 1; return acc;
    }, {});
    return {
      revenue: revenue.toFixed(0), avgVal: avgVal.toFixed(0),
      active, newUsers: users.length, totalOrders: orders.length,
      totalMenu: menuItems.length, totalCats: categories.length,
      statusDist, statusTotal: orders.length || 1,
    };
  }, [allUsers, allOrders, menuItems, categories, timeRange]);

  const statusColors = { Delivered:C.green, Pending:C.amber, Processing:C.cyan, Shipped:C.purple, Cancelled:C.red };
  const statusPills  = { Delivered:"green", Pending:"amber", Processing:"cyan", Shipped:"purple", Cancelled:"red" };

  return (
    <Sec>
      <SecHead>
        <SecTitle $d={d}><FaChartLine /> Analytics Dashboard</SecTitle>
        <BtnRow>
          <Sel $d={d} value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ minWidth:130 }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </Sel>
          <Btn $variant="default" $d={d} onClick={handleRefreshAnalytics}><FaSyncAlt /> Refresh</Btn>
        </BtnRow>
      </SecHead>

      <StatsGrid>
        <StatItem icon={<FaMoneyBillWave />} label="Revenue"           value={`₹${analytics.revenue}`}   color={C.orange} dark={d} delay="0s"     trend={12} />
        <StatItem icon={<FaShoppingBag />}   label="Total Orders"      value={analytics.totalOrders}      color={C.green}  dark={d} delay="0.05s"  trend={8} />
        <StatItem icon={<FaUsers />}         label="Active Users"      value={analytics.active}           color={C.amber}  dark={d} delay="0.1s"   trend={5} />
        <StatItem icon={<FaUserPlus />}      label={`New (${timeRange})`} value={analytics.newUsers}      color={C.cyan}   dark={d} delay="0.15s"  />
        <StatItem icon={<FaUtensils />}      label="Menu Items"        value={analytics.totalMenu}        color={C.purple} dark={d} delay="0.2s"   />
        <StatItem icon={<FaLayerGroup />}    label="Categories"        value={analytics.totalCats}        color={C.indigo} dark={d} delay="0.25s"  />
        <StatItem icon={<FaMoneyBillWave />} label="Avg Order Value"   value={`₹${analytics.avgVal}`}    color={C.orange} dark={d} delay="0.3s"   trend={3} />
        <StatItem icon={<FaCalendarAlt />}   label="Period"            value={timeRange}                  color={C.cyan}   dark={d} delay="0.35s"  />
      </StatsGrid>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.1rem", marginTop:"0.5rem" }}>
        {/* Order Status Distribution */}
        <Card $d={d}>
          <SecTitle $d={d} style={{ fontSize:"1rem", marginBottom:"1.1rem" }}>
            <FaClipboardList /> Order Status
          </SecTitle>
          {Object.keys(analytics.statusDist).length === 0 ? (
            <div style={{ fontSize:"0.84rem", color:th(d,C.lMuted,C.dMuted) }}>No order data available.</div>
          ) : (
            Object.entries(analytics.statusDist).map(([status, count], i) => {
              const pct = Math.round((count / analytics.statusTotal) * 100);
              return (
                <div key={status} style={{ marginBottom:"0.65rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.25rem" }}>
                    <Pill $variant={statusPills[status]||"blue"} style={{ fontSize:"0.68rem" }}>{status}</Pill>
                    <span style={{ fontSize:"0.78rem", fontWeight:600, color:th(d,C.lText,C.dText) }}>{count} ({pct}%)</span>
                  </div>
                  <BarTrack $d={d}><BarFill $color={statusColors[status]||"#6b7280"} $pct={pct} $delay={`${i*0.1}s`} /></BarTrack>
                </div>
              );
            })
          )}
        </Card>

        {/* User Insights */}
        <Card $d={d}>
          <SecTitle $d={d} style={{ fontSize:"1rem", marginBottom:"1.1rem" }}>
            <FaUsers /> User Insights
          </SecTitle>
          {[
            ["Total Users",         allUsers.length],
            ["Active (30d)",        analytics.active],
            [`New (${timeRange})`,  analytics.newUsers],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"0.48rem 0", borderBottom:`1px solid ${th(d,C.lBorder,C.dBorder)}`, fontSize:"0.875rem" }}>
              <span style={{ color:th(d,C.lMuted,C.dMuted) }}>{label}</span>
              <strong style={{ fontFamily:"'Outfit',sans-serif", color:th(d,C.lText,C.dText) }}>{val}</strong>
            </div>
          ))}
        </Card>

        {/* Revenue Insights */}
        <Card $d={d}>
          <SecTitle $d={d} style={{ fontSize:"1rem", marginBottom:"1.1rem" }}>
            <FaMoneyBillWave /> Revenue Insights
          </SecTitle>
          {[
            ["Total Revenue",  `₹${analytics.revenue}`],
            ["Average Order",  `₹${analytics.avgVal}`],
            ["Total Orders",   analytics.totalOrders],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"0.48rem 0", borderBottom:`1px solid ${th(d,C.lBorder,C.dBorder)}`, fontSize:"0.875rem" }}>
              <span style={{ color:th(d,C.lMuted,C.dMuted) }}>{label}</span>
              <strong style={{ fontFamily:"'Outfit',sans-serif", color:th(d,C.lText,C.dText) }}>{val}</strong>
            </div>
          ))}
        </Card>
      </div>
    </Sec>
  );
});

/* ═══════════════════════════════════════════════════════════════
   MAIN AdminSection COMPONENT
═══════════════════════════════════════════════════════════════ */
const AdminSection = ({
  allUsers = [],
  searchQuery,
  handleSearchChange,
  selectedItems,
  setSelectedItems,
  handleBulkAction,
  exportToCSV,
  allOrders = [],
  handleUpdateOrderStatus,
  handleViewOrder,
  menuItems = [],
  categories = [],
  openMenuItemModal,       // → opens Profile's MenuItemModal
  handleEditMenuItem,      // → opens Profile's MenuItemModal (edit mode)
  handleDeleteMenuItem,    // → direct delete (no modal) from Profile
  handleEditCategory,      // → opens Profile's CategoryModal (edit mode)
  handleDeleteCategory,    // → direct delete from Profile
  setIsCategoryModalOpen,  // → opens Profile's CategoryModal (add mode)
  setEditCategory,
  setCategoryForm,
  normalizeRole,
  handleUpdateUserRole,
  handleDeleteUser,        // → direct delete from Profile
  theme,
  usersLoading = false,
  usersError = null,
  ordersLoading = false,
  ordersError = null,
  menuLoading = false,
  menuError = null,
  categoriesLoading = false,
  categoriesError = null,
  onBack,
  refreshData,
  token,
  getApiUrl,
  partnerApplications = [],
  handleApproveApplication,
  handleRejectApplication,
  applicationsLoading = false,
  applicationsError = null,
}) => {
  const d = theme?.mode === "dark";
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  // Internal delete confirm state — used for all deletions inside AdminSection
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  // Stable refresh callbacks
  const refresh = {
    users:         useCallback(() => refreshData?.users?.(),          [refreshData]),
    orders:        useCallback(() => refreshData?.orders?.(),         [refreshData]),
    menu:          useCallback(() => refreshData?.menu?.(),           [refreshData]),
    categories:    useCallback(() => refreshData?.categories?.(),     [refreshData]),
    analytics:     useCallback(() => refreshData?.all?.(),            [refreshData]),
    notifications: useCallback(() => refreshData?.notifications?.(),  [refreshData]),
    applications:  useCallback(() => refreshData?.applications?.(),   [refreshData]),
  };

  const handleBack = useCallback(() => onBack ? onBack() : window.history.back(), [onBack]);

  // Executes the confirmed delete by calling the appropriate prop from Profile.jsx
  const handleConfirmedDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleting(true);
    try {
      if (type === "user")     await handleDeleteUser(id);
      if (type === "menuItem") await handleDeleteMenuItem(id);
      if (type === "category") await handleDeleteCategory(id);
      // Success toast is shown by the Profile handler
      setDeleteTarget(null);
    } catch (err) {
      toast.error(`Failed to delete: ${err?.message || "Unknown error"}`);
    } finally { setDeleting(false); }
  }, [deleteTarget, handleDeleteUser, handleDeleteMenuItem, handleDeleteCategory]);

  const pendingApps = useMemo(
    () => (partnerApplications || []).filter(a => a.status === "PENDING").length,
    [partnerApplications]
  );

  const navItems = [
    { key:"dashboard",     label:"Dashboard",    icon:<FaChartLine />,   badge:null,              badgeColor:C.indigo  },
    { key:"users",         label:"Users",         icon:<FaUsers />,       badge:allUsers.length,   badgeColor:C.red     },
    { key:"orders",        label:"Orders",        icon:<FaShoppingBag />, badge:allOrders.length,  badgeColor:C.green   },
    { key:"menu",          label:"Menu",          icon:<FaUtensils />,    badge:menuItems.length,  badgeColor:C.purple  },
    { key:"categories",    label:"Categories",    icon:<FaLayerGroup />,  badge:categories.length, badgeColor:C.amber   },
    { key:"notifications", label:"Notifications", icon:<FaBell />,        badge:null,               badgeColor:C.cyan    },
    { key:"partners",      label:"Partners",      icon:<FaHandshake />,   badge:pendingApps||null, badgeColor:C.orange  },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AnalyticsDashboard allUsers={allUsers} allOrders={allOrders} menuItems={menuItems} categories={categories}
                  theme={theme} handleRefreshAnalytics={refresh.analytics} />;
      case "users":
        return <UserManagement allUsers={allUsers} searchQuery={searchQuery} handleSearchChange={handleSearchChange}
                  selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                  handleBulkAction={handleBulkAction} exportToCSV={exportToCSV}
                  normalizeRole={normalizeRole} handleUpdateUserRole={handleUpdateUserRole}
                  handleDeleteUser={handleDeleteUser} theme={theme}
                  loading={usersLoading} error={usersError} handleRefreshUsers={refresh.users}
                  setDeleteTarget={setDeleteTarget} />;
      case "orders":
        return <OrderManagement allOrders={allOrders} handleUpdateOrderStatus={handleUpdateOrderStatus}
                  handleViewOrder={handleViewOrder} theme={theme}
                  loading={ordersLoading} error={ordersError} handleRefreshOrders={refresh.orders}
                  exportToCSV={exportToCSV} />;
      case "menu":
        return <MenuManagement menuItems={menuItems} searchQuery={searchQuery} handleSearchChange={handleSearchChange}
                  openMenuItemModal={openMenuItemModal} handleEditMenuItem={handleEditMenuItem}
                  handleDeleteMenuItem={handleDeleteMenuItem} theme={theme}
                  loading={menuLoading} error={menuError} handleRefreshMenu={refresh.menu}
                  setDeleteTarget={setDeleteTarget} />;
      case "categories":
        return <CategoryManagement categories={categories} setIsCategoryModalOpen={setIsCategoryModalOpen}
                  setEditCategory={setEditCategory} setCategoryForm={setCategoryForm}
                  handleEditCategory={handleEditCategory} handleDeleteCategory={handleDeleteCategory}
                  theme={theme} loading={categoriesLoading} error={categoriesError}
                  handleRefreshCategories={refresh.categories}
                  setDeleteTarget={setDeleteTarget} />;
      case "notifications":
        return <NotificationManagement allUsers={allUsers} theme={theme}
                  loading={false} error={null}
                  handleRefreshNotifications={refresh.notifications}
                  normalizeRole={normalizeRole} token={token} getApiUrl={getApiUrl} />;
      case "partners":
        return <PartnerApplicationsManagement partnerApplications={partnerApplications}
                  handleApproveApplication={handleApproveApplication}
                  handleRejectApplication={handleRejectApplication}
                  theme={theme} loading={applicationsLoading} error={applicationsError}
                  handleRefreshApplications={refresh.applications}
                  token={token} getApiUrl={getApiUrl} />;
      default:
        return <AnalyticsDashboard allUsers={allUsers} allOrders={allOrders} menuItems={menuItems} categories={categories}
                  theme={theme} handleRefreshAnalytics={refresh.analytics} />;
    }
  };

  return (
    <>
      <GlobalFont />
      <Root $d={d}>
        {/* ── Top Bar ── */}
        <TopBar $d={d}>
          <BackBtn $d={d} onClick={handleBack}><FaArrowLeft /> Back</BackBtn>
          <BarTitle $d={d}>Admin <em>Dashboard</em></BarTitle>
          <BarSpacer />
          <HamBtn $d={d} onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle menu">
            <FaBars />
          </HamBtn>
        </TopBar>

        <PageBody>
          {/* Mobile overlay */}
          <SideOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

          {/* ── Sidebar ── */}
          <SidePane $d={d} $open={sidebarOpen}>
            <NavGroupLabel $d={d}>Navigation</NavGroupLabel>
            {navItems.map(item => (
              <NavBtn
                key={item.key}
                $d={d}
                $active={activeSection === item.key}
                onClick={() => { setActiveSection(item.key); setSidebarOpen(false); }}
              >
                {item.icon}
                <NavSpan>{item.label}</NavSpan>
                {item.badge != null && (
                  <NavBadge $c={item.badgeColor} $pulse={item.key==="partners" && pendingApps > 0}>
                    {item.badge}
                  </NavBadge>
                )}
              </NavBtn>
            ))}
            <SideStats $d={d}>
              <SideStatsTitle>Quick Stats</SideStatsTitle>
              {[
                ["Users",   allUsers.length],
                ["Orders",  allOrders.length],
                ["Menu",    menuItems.length],
                ["Pending", pendingApps],
              ].map(([label, val]) => (
                <SideStatRow key={label} $d={d}>
                  <span>{label}</span>
                  <strong>{val}</strong>
                </SideStatRow>
              ))}
            </SideStats>
          </SidePane>

          {/* ── Content ── */}
          <ContentPane>{renderSection()}</ContentPane>
        </PageBody>
      </Root>

      {/* ── Delete Confirmation Modal (AdminSection-owned) ── */}
      {deleteTarget && (
        <DeleteOverlay onClick={e => e.target===e.currentTarget && !deleting && setDeleteTarget(null)}>
          <DeleteBox $d={d}>
            <DeleteHead $d={d}>
              <div className="ico"><FaExclamationCircle /></div>
              <h3>Confirm Deletion</h3>
            </DeleteHead>
            <DeleteBody>
              <DeleteText $d={d}>
                Are you sure you want to delete this <strong>{deleteTarget.type}</strong>?
                {deleteTarget.name && (
                  <><br /><span style={{ fontSize:"0.85rem", opacity:0.8 }}>"{deleteTarget.name}"</span></>
                )}
              </DeleteText>
              <DeleteText $d={d} style={{ fontSize:"0.8rem", opacity:0.6, marginBottom:0 }}>
                This action cannot be undone.
              </DeleteText>
            </DeleteBody>
            <DeleteFoot $d={d}>
              <Btn $variant="default" $d={d} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Btn>
              <Btn
                $variant="red" $d={d} onClick={handleConfirmedDelete} disabled={deleting}
                style={{ background:`linear-gradient(135deg,${C.red},#dc2626)`, color:"#fff", border:"none" }}
              >
                {deleting
  ? <SpinnerIcon />
  : <FaTrash />}
                {deleting ? "Deleting…" : "Delete"}
              </Btn>
            </DeleteFoot>
          </DeleteBox>
        </DeleteOverlay>
      )}
    </>
  );
};

export default AdminSection;