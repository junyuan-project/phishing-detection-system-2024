import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f4f4f4', padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/phisherman_2.png"
          alt="Logo"
          style={{ width: '100px', height: '10%', marginBottom: '20px', marginTop: '10px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ margin: '5px', textDecoration: 'none', color: 'black' }}>Home</Link>
          <Link to="/" style={{ margin: '5px', textDecoration: 'none', color: 'black' }}>Verify A Phish</Link>
          <Link to="/addphish" style={{ margin: '5px', textDecoration: 'none', color: 'black' }}>Add A Phish</Link>
          <Link to="/searchphish" style={{ margin: '5px', textDecoration: 'none', color: 'black' }}>Phish Search</Link>
          <Link to="/emaildetection" style={{ margin: '5px', textDecoration: 'none', color: 'black' }}>Email Detection</Link>
        </div>
      </div>
      <div style={{ marginTop: '20px', color: 'grey' }}>
        <p>&copy; 2024 Phishing Detection System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
