import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FuturisticNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [thunderIdx, setThunderIdx] = useState(null);
  const thunderTimeout = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (thunderTimeout.current) clearTimeout(thunderTimeout.current);
    };
  }, []);

  const navItems = ['Home', 'Blog', 'Skills', 'Contact'];

  // Blue Thunder SVG for nav links
  const ThunderSVG = () => (
    <svg className="thunder-svg" viewBox="0 0 90 60">
      <polyline
        points="80,5 45,32 62,33 38,55 53,29 41,29 60,14 16,55"
        fill="none"
        stroke="url(#blueHeat)"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glowBlue)"
      />
      <defs>
        <linearGradient id="blueHeat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="65%" stopColor="#007bff" />
          <stop offset="100%" stopColor="#82eefd" />
        </linearGradient>
        <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );

  const handleThunderHover = idx => {
    setThunderIdx(idx);
    if (thunderTimeout.current) clearTimeout(thunderTimeout.current);
    thunderTimeout.current = setTimeout(() => setThunderIdx(null), 420);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (item) => {
    if (isMobile) setIsMenuOpen(false);
    navigate("/" + item.toLowerCase());
   
  };

  // 3D Left Animation: Cubes
  const Cubes3D = () => (
    <div className="left-3d-cubes" aria-hidden="true">
      {[1, 2, 3].map(i =>
        <div className="cube-3d" key={i}>
          <div className="cube-3d-face front"></div>
          <div className="cube-3d-face back"></div>
          <div className="cube-3d-face right"></div>
          <div className="cube-3d-face left"></div>
          <div className="cube-3d-face top"></div>
          <div className="cube-3d-face bottom"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="navbar-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .navbar-wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          color: white;
       
        }
        
        /* Navbar Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          width: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 2px solid #00cfff;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1rem, 5vw, 2rem);
          box-shadow: 0 4px 30px rgba(0, 207, 255, 0.15);
          transition: all 0.3s ease;
          animation: navbarSlideDown 0.8s ease-out;
        }

        @keyframes navbarSlideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .navbar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            rgba(0, 207, 255, 0.09) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(0, 207, 255, 0.08) 100%);
          pointer-events: none;
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.35; }
        }

        /* Logo Styles */
        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          z-index: 2;
          animation: logoFloat 0.8s ease-out;
          flex-shrink: 0;
        }

        @keyframes logoFloat {
          from {
            transform: translateX(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .logo-3d {
          display: none;
        }

        /* 3D Cube Animation for Futuristic Navbar */
        .left-3d-cubes {
          display: flex;
          gap: clamp(8px, 2vw, 14px);
          align-items: center;
          height: 100%;
          position: relative;
          z-index: 2;
          margin-right: clamp(8px, 3vw, 18px);
        }

        .cube-3d {
          width: clamp(20px, 4vw, 34px);
          height: clamp(20px, 4vw, 34px);
          position: relative;
          transform-style: preserve-3d;
          animation: cube-rotate 3.5s cubic-bezier(0.8,-0.2,0.2,1.2) infinite alternate;
        }

        .cube-3d:nth-child(2) {
          animation-delay: 0.7s;
          width: clamp(16px, 3.5vw, 28px);
          height: clamp(16px, 3.5vw, 28px);
          opacity: 0.8;
        }

        .cube-3d:nth-child(3) {
          animation-delay: 1.2s;
          width: clamp(12px, 3vw, 22px);
          height: clamp(12px, 3vw, 22px);
          opacity: 0.6;
        }

        .cube-3d-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0a1a2a 30%, #00d0ff 75%, #ffffff11 100%);
          border: 1.5px solid #00d0ff99;
          box-shadow: 0 2px 10px #00e7ff66;
          opacity: 0.98;
        }

        .cube-3d-face.front  { transform: rotateY(0deg) translateZ(calc(clamp(10px, 2vw, 17px))); }
        .cube-3d-face.back   { transform: rotateY(180deg) translateZ(calc(clamp(10px, 2vw, 17px))); }
        .cube-3d-face.right  { transform: rotateY(90deg) translateZ(calc(clamp(10px, 2vw, 17px))); }
        .cube-3d-face.left   { transform: rotateY(-90deg) translateZ(calc(clamp(10px, 2vw, 17px))); }
        .cube-3d-face.top    { transform: rotateX(90deg) translateZ(calc(clamp(10px, 2vw, 17px))); }
        .cube-3d-face.bottom { transform: rotateX(-90deg) translateZ(calc(clamp(10px, 2vw, 17px))); }

        @keyframes cube-rotate {
          0%   { transform: rotateX(20deg) rotateY(40deg); }
          100% { transform: rotateX(380deg) rotateY(400deg); }
        }

        /* Navigation Menu Styles */
        .nav-menu {
          display: flex;
          list-style: none;
          gap: clamp(1rem, 3vw, 2rem);
          align-items: center;
          z-index: 2;
          flex-shrink: 0;
        }

        .nav-item {
          position: relative;
          cursor: pointer;
          padding: clamp(0.5rem, 2vw, 0.8rem) clamp(0.8rem, 3vw, 1.5rem);
          color: #ffffff;
          font-weight: 700;
          font-family: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: clamp(0.7rem, 2vw, 1rem);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: navItemSlide 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
          transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          background: none !important;
          white-space: nowrap;
        }

        @keyframes navItemSlide {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-text {
          font-size: clamp(0.7rem, 2vw, 1rem);
          font-weight: 700;
          position: relative;
          z-index: 1;
          pointer-events: none;
        }

        /* Thunder/Lightning Effect on Hover */
        .nav-item .thunder-svg {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          width: clamp(40px, 8vw, 80px);
          height: clamp(20px, 4vw, 40px);
          pointer-events: none;
          opacity: 0;
          transform: translate(-50%, -70%) scale(1.2);
          transition: opacity 0.1s;
          z-index: 10;
        }

        .nav-item.thunder-hover .thunder-svg {
          opacity: 1;
          animation: thunderStrike 0.45s linear;
        }

        @keyframes thunderStrike {
          0% {
            opacity: 0.93;
            filter: blur(0.5px) brightness(2.7) drop-shadow(0 0 10px #00efff) drop-shadow(0 0 20px #00bfff);
            transform: translate(-50%, -70%) scale(1.2) rotate(-10deg);
          }
          15% {
            opacity: 1;
            filter: blur(1.5px) brightness(4.5) drop-shadow(0 0 20px #00e6ff) drop-shadow(0 0 40px #3cfbff);
            transform: translate(-50%, -70%) scale(1.35) rotate(7deg);
          }
          35% {
            opacity: 0.8;
            filter: blur(2px) brightness(2.7) drop-shadow(0 0 18px #5be6ff);
            transform: translate(-50%, -70%) scale(1.25) rotate(-7deg);
          }
          60% {
            opacity: 0.7;
            filter: blur(1px) brightness(2.2) drop-shadow(0 0 14px #00e2ff);
            transform: translate(-50%, -70%) scale(1.2) rotate(4deg);
          }
          100% {
            opacity: 0;
            filter: blur(0px) brightness(1);
            transform: translate(-50%, -70%) scale(1.1) rotate(0deg);
          }
        }

        /* Blue hover effect */
        .nav-item:hover, .nav-item.thunder-hover {
          color: #3cfbff;
          text-shadow: 0 0 14px #00f0ff, 0 0 28px #00bfff, 0 0 40px #3cfbff, 0 0 18px #fff, 0 0 50px #0ff;
          font-weight: 900;
          background: none !important;
        }

        /* Hamburger Menu Styles */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          width: 30px;
          height: 25px;
          justify-content: space-between;
          z-index: 1001;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .hamburger:hover {
          transform: scale(1.1);
        }

        .hamburger-line {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #00e0ff, #ffffff, #00e0ff);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
          box-shadow: 0 0 10px #00e0ff66;
          border-radius: 2px;
        }

        .hamburger.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
          background: linear-gradient(90deg, #3cfbff, #00e0ff);
        }

        .hamburger.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        .hamburger.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(8px, -8px);
          background: linear-gradient(90deg, #3cfbff, #00e0ff);
        }

        /* Mobile Menu Styles */
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-bottom: 2px solid #00e0ff;
          box-shadow: 0 10px 40px #00e0ff33;
          z-index: 999;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-nav-item {
          padding: clamp(1rem, 4vw, 1.5rem) clamp(1rem, 5vw, 2rem);
          color: #ffffff;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #00e0ff22;
          cursor: pointer;
          transition: all 0.3s ease;
          transform: translateX(-50px);
          opacity: 0;
          animation: slideInLeft 0.6s ease forwards;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          font-size: clamp(0.9rem, 4vw, 1.1rem);
        }

        .mobile-nav-item::before {
          content: '';
          position: absolute;
          left: -100%;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(90deg, transparent, #00e0ff33, transparent);
          transition: left 0.5s ease;
        }

        .mobile-nav-item:hover::before {
          left: 100%;
        }

        .mobile-nav-item:nth-child(1) { animation-delay: 0.1s; }
        .mobile-nav-item:nth-child(2) { animation-delay: 0.2s; }
        .mobile-nav-item:nth-child(3) { animation-delay: 0.3s; }
        .mobile-nav-item:nth-child(4) { animation-delay: 0.4s; }

        @keyframes slideInLeft {
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .mobile-nav-text {
          font-size: clamp(0.9rem, 4vw, 1.1rem);
        }

        .mobile-nav-item:hover {
          color: #3cfbff;
          background: none;
          transform: translateX(10px);
          font-weight: 700;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }
          .nav-menu {
            display: none;
          }
          .navbar {
            height: clamp(60px, 12vw, 80px);
          }
          .mobile-menu {
            top: clamp(60px, 12vw, 80px);
          }
        }

        @media (max-width: 480px) {
          .navbar {
            height: clamp(50px, 15vw, 70px);
            padding: 0 clamp(0.5rem, 4vw, 1rem);
          }
          .mobile-menu {
            top: clamp(50px, 15vw, 70px);
          }
          .logo-3d {
            width: clamp(80px, 25vw, 120px);
            height: clamp(30px, 8vw, 50px);
          }
        }



        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { 
          width: 8px; 
        }
        ::-webkit-scrollbar-track { 
          background: #1a1a1a; 
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00e0ff, #666);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00e0ff, #999);
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-glow"></div>
        <div className="logo-container">
          <Cubes3D />
        </div>

        {!isMobile && (
          <ul className="nav-menu">
            {navItems.map((item, idx) => (
              <li
                key={item}
                className={`nav-item${thunderIdx === idx ? ' thunder-hover' : ''}`}
                onMouseEnter={() => handleThunderHover(idx)}
                onClick={() => handleNavClick(item)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span className="nav-text">{item}</span>
                {thunderIdx === idx && <ThunderSVG />}
              </li>
            ))}
          </ul>
        )}

        {isMobile && (
          <div
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        )}
      </nav>

      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item, index) => (
            <div
              key={item}
              className="mobile-nav-item"
              onClick={() => handleNavClick(item)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="mobile-nav-text">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FuturisticNavbar;