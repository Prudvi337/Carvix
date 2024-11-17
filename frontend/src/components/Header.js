// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Header = () => (
  <header className="header">
      <Link to="/" className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 50 400 100" className="logo-svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="20%" style={{ stopColor: "#C0362C" }} />
              <stop offset="80%" style={{ stopColor: "#4169E1" }} />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#C0362C" }} />
              <stop offset="100%" style={{ stopColor: "#4169E1" }} />
            </linearGradient>
          </defs>
          <text
            x="200"
            y="115"
            fontFamily="Arial, sans-serif"
            fontSize="82"
            fontWeight="bold"
            fill="url(#textGradient)"
            textAnchor="middle"
            style={{ letterSpacing: "2px" }}
          >
            CARVIX
          </text>
          <path
            d="M120 130 Q200 150 280 130"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </Link>
    <nav className="nav">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/customize" className="nav-link">Customize</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
    </nav>
    
  </header>
);

export default Header;
