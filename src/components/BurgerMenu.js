//=========================================================================================================
// BurgerMenu component
//=========================================================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BurgerMenu.css';

const BurgerMenu = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="burger-menu">
      <button className="burger-button" onClick={toggleMenu}>
        ☰
      </button>
      {menuVisible && (
        <div className="burger-menu-popup">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/education')}>Education</button>
          <button onClick={() => navigate('/healthcare')}>Healthcare</button>
          <button onClick={() => navigate('/finance')}>Finance</button>
          <button onClick={() => navigate('/wallet')}>Wallet</button>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;