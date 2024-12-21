//=========================================================================================================
// Page Not Found Page for displaying 404 error page
//=========================================================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BurgerMenu from '../components/BurgerMenu';
import "../styles/Global.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <TopBar title="Page Not Found" />
      <BurgerMenu />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ fontSize: '48px', color: '#676663' }}>404</h1>
        <p style={{ fontSize: '20px', color: '#a1998f' }}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/home')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#676663',
            color: '#efede6',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;