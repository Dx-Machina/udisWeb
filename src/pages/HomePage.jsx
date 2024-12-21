//========================================================================================================================================================
// Home Page for displaying user data
//========================================================================================================================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import BurgerMenu from '../components/BurgerMenu';
import Card from '../components/Card';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch QR code after user data is available if needed
        const qrRes = await axios.get(`${API_BASE_URL}/api/user/qrcode`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQrCode(qrRes.data.qrCode); // don't forget*****

      } catch (err) {
        console.error('Error fetching user data:', err.response?.data || err.message);
        setError('Unable to fetch user data. Redirecting to login...');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate, API_BASE_URL]);

  // Constructing the RichMedia URL for pictureId
  let cardImageSrc = '/images/Default_Digital_ID.svg';
  if (user?.pictureId && user.pictureId.trim() !== '') {
    if (user.pictureId.startsWith('/uploads')) {
      cardImageSrc = `${API_BASE_URL}${user.pictureId}`;
    } else {
      cardImageSrc = user.pictureId;
    }
  }

  return (
    <div className="homepage-container">
      <TopBar title="HOME" user={user} />
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : user ? (
        <>
          <h1 className="welcome-title">Hello, {user.name}!</h1>
          <Card
            RichMedia={cardImageSrc}
            tag={user.role}
            title={user.issuingAuthority || "CA DMV"}
            subtitle={
              <>
                <p>Name: {user.name}</p>
                <p>ID #: {user.udisId}</p>
              </>
            }
            details={
              <>
                <p>DOB: {user.birthdate}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone || "N/A"}</p>
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="User's QR Code"
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                ) : (
                  <p>Loading QR Code...</p>
                )}
              </>
            }
            buttonLabel="Expand"
            showScanButton={true}
          />
          <BurgerMenu/>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
//========================================================================================================================================================
export default HomePage;