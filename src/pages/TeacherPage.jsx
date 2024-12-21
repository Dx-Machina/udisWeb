//========================================================================================================================================================
// Teacher LMS Page
//========================================================================================================================================================
import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import '../styles/TeacherPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
//========================================================================================================================================================
const TeacherPage = () => {
  const [udisIdQuery, setUdisIdQuery] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [major, setMajor] = useState('');
  const [classes, setClasses] = useState([]);
  const token = localStorage.getItem('token');
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    fetchRecentStudents();
  }, [API_BASE_URL, token]);
//========================================================================================================================================================
  const fetchRecentStudents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/education/recent-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecentStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching recent students:', err);
    }
  };
//========================================================================================================================================================
  const handleFetchStudent = () => {
    setError('');
    setSuccessMessage('');
    setStudentData(null);

    const query = (udisIdQuery || '').trim();
    if (!query) {
      setError('Please enter a UDIS ID');
      return;
    }

    fetch(`${API_BASE_URL}/api/education/user/${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.education && Array.isArray(data.education.classes)) {
          setStudentData(data);
          setMajor(data.education.major || '');
          setClasses(data.education.classes || []);
          setError('');
          // After fetching student, re-fetch recent students
          fetchRecentStudents();
        } else {
          setError(data.message || 'Student not found or no education data returned.');
          setStudentData(null);
          setMajor('');
          setClasses([]);
        }
      })
      .catch(err => setError(err.message));
  };
//========================================================================================================================================================
  const handleAddClass = () => {
    setClasses([...classes, { className: '', grade: '', cid: '', assignments: [] }]);
  };
//========================================================================================================================================================
  const handleClassChange = (index, field, value) => {
    const updated = [...classes];
    updated[index][field] = value;
    setClasses(updated);
  };
//========================================================================================================================================================
  const handleRemoveClass = (index) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };
//========================================================================================================================================================
  const handleAddAssignment = (classIndex) => {
    const updated = [...classes];
    updated[classIndex].assignments.push({
      title: 'Untitled Assignment',
      dueDate: '',
      points: 100,
      submitted: false
    });
    setClasses(updated);
  };
//========================================================================================================================================================
  const handleAssignmentChange = (classIndex, assignIndex, field, value) => {
    const updated = [...classes];
    updated[classIndex].assignments[assignIndex][field] = value;
    setClasses(updated);
  };
//========================================================================================================================================================
  const handleRemoveAssignment = (classIndex, assignIndex) => {
    const updated = [...classes];
    updated[classIndex].assignments = updated[classIndex].assignments.filter((_, i) => i !== assignIndex);
    setClasses(updated);
  };
//========================================================================================================================================================
  const handleUpdateStudent = () => {
    setError('');
    setSuccessMessage('');
    const query = (udisIdQuery || '').trim();
    if (!query) {
      setError('Please enter a UDIS ID');
      return;
    }
    fetch(`${API_BASE_URL}/api/education/user/${encodeURIComponent(query)}`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ education: { major, classes } })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        setError('');
        setSuccessMessage('Student info updated successfully!');
        setStudentData(prev => prev ? {
          ...prev,
          education: {
            major: data.education.major,
            classes: data.education.classes
          }
        } : prev);
        fetchRecentStudents(); // re-fetch recent to update quick access
      } else {
        setError(data.error || 'Failed to update student');
      }
    })
    .catch(err => setError(err.message));
  };
//========================================================================================================================================================
  const removeStudentFromRecent = async (studentUdisId) => {
    if (!studentUdisId) return;
    try {
      await fetch(`${API_BASE_URL}/api/education/recent-students/${encodeURIComponent(studentUdisId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      // After removal, re-fetch to update UI
      fetchRecentStudents();
    } catch (err) {
      console.error('Error removing recent student:', err);
    }
  };
//========================================================================================================================================================
  let avatarSrc = '/images/default_avatar.png';
  if (studentData?.avatarPicture && studentData.avatarPicture.trim() !== '') {
    if (studentData.avatarPicture.startsWith('/uploads')) {
      avatarSrc = `${API_BASE_URL}${studentData.avatarPicture}`;
    } else {
      avatarSrc = studentData.avatarPicture;
    }
  }
//========================================================================================================================================================
  const renderRecentStudents = () => {
    if (!recentStudents || recentStudents.length === 0) return <p className="no-data-msg">No recent students found.</p>;
    return (
      <div className="recent-students-container">
        <h4>Quick Access</h4>
        {recentStudents.map((s,i)=>(
          <div key={i} className="recent-student-row">
            <div className="recent-student-info">
              <img src={s.avatarPicture || '/images/default_avatar.png'} alt={s.name} className="recent-student-img"/>
              <span className="recent-student-name">{s.name} {s.udisId ? `(${s.udisId})` : ''}</span>
            </div>
            <button 
              onClick={() => {
                setUdisIdQuery(s.udisId || '');
                handleFetchStudent();
              }}
              className="action-button secondary open-recent-button"
            >
              Open
            </button>
            {s.udisId && (
              <button
                onClick={() => removeStudentFromRecent(s.udisId)}
                className="remove-recent-button"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="teacher-container">
      <TopBar title="Teacher Page" user={{ role: 'Teacher' }} />

      <div className="teacher-content">
        <h2 className="page-title">Teacher Page</h2>
        <p className="page-subtitle">
          You can search for a student by UDIS ID, view their educational info (including assignments), and update it.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter Student UDIS"
            value={udisIdQuery}
            onChange={e => setUdisIdQuery(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleFetchStudent}
            className="search-button"
          >
            Fetch Student
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {renderRecentStudents()}

        {studentData && (
          <div className="student-data-card">
            <div className="student-header">
              <img
                src={avatarSrc}
                alt={studentData.name}
              />
              <div className="student-info">
                <h3 className="student-name">{studentData.name}</h3>
                <p className="student-email">{studentData.email}</p>
              </div>
            </div>

            <h4 className="section-title">Student Education Profile</h4>

            <div className="major-field">
              <label className="label">Major:</label>
              <input 
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="major-input"
              />
            </div>

            <h5 className="subsection-title">Classes:</h5>
            {classes.map((c, classIndex) => (
              <div key={classIndex} className="class-card">
                <div className="class-row">
                  <input 
                    type="text"
                    placeholder="Class Name"
                    value={c.className || ''}
                    onChange={e => handleClassChange(classIndex, 'className', e.target.value)}
                    className="class-input"
                  />
                  <input 
                    type="text"
                    placeholder="Grade"
                    value={c.grade || ''}
                    onChange={e => handleClassChange(classIndex, 'grade', e.target.value)}
                    className="class-grade"
                  />
                  <input 
                    type="text"
                    placeholder="CID"
                    value={c.cid || ''}
                    onChange={e => handleClassChange(classIndex, 'cid', e.target.value)}
                    className="class-cid"
                  />
                  <button 
                    onClick={() => handleRemoveClass(classIndex)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>

                <h6 className="assignments-title">Assignments:</h6>
                {c.assignments && c.assignments.length > 0 ? c.assignments.map((a, assignIndex) => (
                  <div key={assignIndex} className="assignment-row">
                    <input
                      type="text"
                      placeholder="Title"
                      value={a.title || 'Untitled Assignment'}
                      onChange={e => handleAssignmentChange(classIndex, assignIndex, 'title', e.target.value)}
                      className="assignment-input"
                    />
                    <input
                      type="date"
                      value={a.dueDate ? a.dueDate.slice(0,10) : ''}
                      onChange={e => handleAssignmentChange(classIndex, assignIndex, 'dueDate', e.target.value)}
                      className="assignment-date"
                    />
                    <input
                      type="number"
                      placeholder="Points"
                      value={typeof a.points === 'number' ? a.points : 100}
                      onChange={e => handleAssignmentChange(classIndex, assignIndex, 'points', e.target.value)}
                      className="assignment-points"
                    />
                    <button
                      onClick={() => handleRemoveAssignment(classIndex, assignIndex)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                )) : <p className="no-data-msg">No assignments yet.</p>}

                <button
                  onClick={() => handleAddAssignment(classIndex)}
                  className="action-button secondary"
                >
                  Add Assignment
                </button>
              </div>
            ))}

            <button 
              onClick={handleAddClass}
              className="action-button secondary add-class-button"
            >
              Add Class
            </button>

            <div className="update-button-container">
              <button 
                onClick={handleUpdateStudent}
                className="action-button primary"
              >
                Update Student Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
//========================================================================================================================================================
export default TeacherPage;