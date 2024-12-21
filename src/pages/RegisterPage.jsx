//========================================================================================================================================================
// Registeration Page
//========================================================================================================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [role, setRole] = useState('Citizen'); // Default selected role
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Regex
    const dobRegex = /^\d{2} [A-Z]{3} \d{4}$/;
    if (!dobRegex.test(dob)) {
      setError('Date of Birth must be in the format: DD MON YYYY (e.g., 10 AUG 2000)');
      return;
    }

    try {
      const formData = new FormData();
      const fullName = `${name} ${lastName}`.trim();

      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('birthdate', dob);
      formData.append('phone', phone);
      formData.append('role', role); // Append the selected role

      if (pictureFile) {
        formData.append('pictureId', pictureFile);
      }

      if (avatarFile) {
        formData.append('avatarPicture', avatarFile);
      }

      const response = await axios.post('http://localhost:5001/api/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Registration successful!');
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register for UDIS</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <label htmlFor="name">First Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your first name"
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <label htmlFor="dob">Date of Birth</label>
        <input
          type="text"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          placeholder="DD MON YYYY (e.g., 10 AUG 2000)"
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Citizen">Citizen</option>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Teacher">Teacher</option>
          {/* Add more roles as needed */}
        </select>

        <label htmlFor="pictureId">Picture ID (Upload)</label>
        <input
          type="file"
          id="pictureId"
          accept="image/*"
          onChange={(e) => setPictureFile(e.target.files[0])}
        />

        <label htmlFor="avatarPicture">Avatar Picture (Upload)</label>
        <input
          type="file"
          id="avatarPicture"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />

        <button type="submit">Register</button>
        <p
          style={{
            textAlign: 'center',
            marginTop: '15px',
            cursor: 'pointer',
            color: '#007bff',
          }}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};
//========================================================================================================================================================
export default RegisterPage;