//=========================================================================================================
// Education Page for displaying user's education data
//=========================================================================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import BurgerMenu from '../components/BurgerMenu';
import "../styles/EducationPage.css";

const EducationPage = () => {
  const [user, setUser] = useState(null);
  const [personalEducationProfile, setPersonalEducationProfile] = useState(null);
  const [error, setError] = useState('');
  const [expandedClasses, setExpandedClasses] = useState({}); 

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('No token found. Please log in first.');
        return;
      }

      try {
        // Fetch user data
        const userRes = await axios.get(`${API_BASE_URL}/api/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch personal education data
        const eduRes = await axios.get(`${API_BASE_URL}/api/education/user/${userRes.data.udisId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPersonalEducationProfile(eduRes.data); 
        console.log("Education Data: ", eduRes.data);
      } catch (err) {
        console.error('Error fetching personal education data:', err.response?.data || err.message);
        setError('Unable to fetch personal education data. Check your permissions or try again.');
      }
    };
    fetchData();
  }, [API_BASE_URL, token]);

  const toggleClassExpansion = (index) => {
    setExpandedClasses(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderEducationData = (data) => {
    if (!data) {
      return <div className="no-data-msg">No education data found.</div>;
    }

    const { education } = data;
    const { major, classes } = education;

    return (
      <div>
        <h3>Your Education</h3>
        <p><strong>Major:</strong> {major || 'N/A'}</p>
        <h4>Classes:</h4>
        {classes && classes.length > 0 ? (
          <table className="courses-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Grade</th>
                <th>Assignments</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => {
                const isExpanded = expandedClasses[i];
                return (
                  <tr key={i}>
                    <td>{c.className}</td>
                    <td>{c.grade || 'N/A'}</td>
                    <td>
                      <button onClick={() => toggleClassExpansion(i)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}>
                        {isExpanded ? '▼ Hide Assignments' : '▶ Show Assignments'}
                      </button>
                      {isExpanded && c.assignments && c.assignments.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <table className="assignments-table">
                            <thead>
                              <tr>
                                <th>Title</th>
                                <th>Due Date</th>
                                <th>Points</th>
                                <th>Submitted</th>
                              </tr>
                            </thead>
                            <tbody>
                              {c.assignments.map((a, j) => (
                                <tr key={j}>
                                  <td>{a.title}</td>
                                  <td>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</td>
                                  <td>{a.points}</td>
                                  <td>{a.submitted ? 'Yes' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {isExpanded && c.assignments && c.assignments.length === 0 && (
                        <div className="no-data-msg">No assignments found.</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data-msg">No classes found.</div>
        )}
      </div>
    );
  };

  return (
    <div className="education-page-container" style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#fafaf8' }}>
      <TopBar title="Education" user={user} />
      <BurgerMenu />
      {error && <div className="error-message">{error}</div>}

      <div className="education-content">
        {personalEducationProfile ? renderEducationData(personalEducationProfile) :
          (!error && <div className="loading">Loading...</div>)}
      </div>
    </div>
  );
};

export default EducationPage;