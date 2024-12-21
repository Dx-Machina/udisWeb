//=========================================================================================================
// Health Care Portal
//=========================================================================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import BurgerMenu from '../components/BurgerMenu';
import '../styles/HealthcarePage.css';

const HealthcarePage = () => {
  const [user, setUser] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDescription, setAppointmentDescription] = useState('');
  const [appointmentMessage, setAppointmentMessage] = useState('');

  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [selectedDoctorForNewAppointment, setSelectedDoctorForNewAppointment] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('No token found. Please log in first.');
        return;
      }

      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const hcRes = await axios.get(`${API_BASE_URL}/api/healthcare/user/${userRes.data.udisId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthData(hcRes.data);
      } catch (err) {
        console.error('Error fetching health data:', err.response?.data || err.message);
        setError('Unable to fetch healthcare data.');
      }
    };
    fetchData();
  }, [API_BASE_URL, token]);

  if (error) {
    return (
      <div className="healthcare-container">
        <TopBar title="Healthcare Portal" user={user} />
        <BurgerMenu />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="healthcare-container">
        <TopBar title="Healthcare Portal" user={user} />
        <BurgerMenu />
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  const { healthcare } = healthData;
  const { labResults, medications, allergies, immunizations, doctorsNotes, procedures, appointments, careTeam } = healthcare || {};

//========================================================================================================================================================
  const requestAppointment = async (doctorUdisId, description) => {
    if (!doctorUdisId || !description.trim()) return;
    setAppointmentMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/healthcare/request-appointment`, {
        doctorUdisId,
        description
      },{
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.message === 'Appointment requested successfully') {
        setAppointmentMessage('Appointment requested successfully!');
      } else {
        setAppointmentMessage('Failed to request appointment.');
      }
    } catch (err) {
      console.error(err);
      setAppointmentMessage('Failed to request appointment.');
    }
  };
//========================================================================================================================================================
  const handleRequestNewAppointment = () => {
    if (!careTeam || careTeam.length === 0) {
      setAppointmentMessage('No care team members available to request an appointment from.');
      return;
    }
    setShowNewAppointmentForm(true);
    setAppointmentMessage('');
    setSelectedDoctorForNewAppointment(careTeam[0].udisId || '');
    setAppointmentDescription('');
  };
//========================================================================================================================================================
  const submitNewAppointmentRequest = () => {
    if (!selectedDoctorForNewAppointment.trim()) {
      setAppointmentMessage('Please select a care team member (doctor) first.');
      return;
    }
    requestAppointment(selectedDoctorForNewAppointment, appointmentDescription);
  };

  return (
    <div className="healthcare-container">
      <TopBar title="Healthcare Portal" user={user} />
      <BurgerMenu />
      <div className="healthcare-content">
        <h2>Welcome {user?.name}, here is your health information:</h2>

        <section className="section">
          <h3>Care Team</h3>
          {careTeam && careTeam.length > 0 ? (
            <div className="care-team-list">
              {careTeam.map((member,i)=>{
                let memberAvatar = member.avatarPicture || '/images/default_avatar.png';
                if (memberAvatar.startsWith('/uploads')) {
                  memberAvatar = `${API_BASE_URL}${memberAvatar}`;
                }

                return (
                  <div key={i} className="care-team-member">
                    <img src={memberAvatar} alt={member.name}/>
                    <div>
                      <p><strong>{member.name}</strong></p>
                      <p>UDIS: {member.udisId}</p>
                      <button className="button" onClick={()=>{
                        setSelectedDoctor(member); 
                        setAppointmentDescription('');
                        setAppointmentMessage('');
                      }}>Request Appointment</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p>No care team members assigned.</p>}
        </section>

        {selectedDoctor && (
          <section className="section">
            <h3>Request Appointment with {selectedDoctor.name}</h3>
            {appointmentMessage && <p className="success-message">{appointmentMessage}</p>}
            <textarea 
              className="appointment-textarea" 
              placeholder="Describe why you need this appointment..."
              value={appointmentDescription}
              onChange={e=>setAppointmentDescription(e.target.value)}
            ></textarea>
            <button className="button" onClick={()=>requestAppointment(selectedDoctor.udisId, appointmentDescription)}>Submit Request</button>
          </section>
        )}

        <section className="section">
          <h3>Lab Results</h3>
          {labResults && labResults.length > 0 ? (
            <table>
              <thead>
                <tr><th>Date</th><th>Test Name</th><th>Result</th></tr>
              </thead>
              <tbody>
                {labResults.map((lr,i)=><tr key={i}>
                  <td>{new Date(lr.date).toLocaleDateString()}</td>
                  <td>{lr.testName}</td>
                  <td>{lr.result}</td>
                </tr>)}
              </tbody>
            </table>
          ) : <p>No lab results found.</p>}
        </section>

        <section className="section">
          <h3>Medications</h3>
          {medications && medications.length > 0 ? (
            <ul>
              {medications.map((m,i)=><li key={i}>{m.name} - {m.dosage}, {m.frequency}</li>)}
            </ul>
          ) : <p>No medications found.</p>}
        </section>

        <section className="section">
          <h3>Allergies</h3>
          {allergies && allergies.length > 0 ? (
            <ul>
              {allergies.map((a,i)=><li key={i}>{a}</li>)}
            </ul>
          ) : <p>No allergies recorded.</p>}
        </section>

        <section className="section">
          <h3>Immunizations</h3>
          {immunizations && immunizations.length > 0 ? (
            <table>
              <thead>
                <tr><th>Name</th><th>Date</th></tr>
              </thead>
              <tbody>
                {immunizations.map((im,i)=><tr key={i}>
                  <td>{im.name}</td>
                  <td>{new Date(im.date).toLocaleDateString()}</td>
                </tr>)}
              </tbody>
            </table>
          ) : <p>No immunizations found.</p>}
        </section>

        <section className="section">
          <h3>Doctor's Notes</h3>
          {doctorsNotes && doctorsNotes.length > 0 ? (
            <ul>
              {doctorsNotes.map((dn,i)=><li key={i}><strong>{new Date(dn.date).toLocaleDateString()}:</strong> {dn.note}</li>)}
            </ul>
          ) : <p>No notes available.</p>}
        </section>

        <section className="section">
          <h3>Procedures</h3>
          {procedures && procedures.length > 0 ? (
            <ul>
              {procedures.map((p,i)=><li key={i}><strong>{p.name}</strong> on {new Date(p.date).toLocaleDateString()}: {p.notes}</li>)}
            </ul>
          ) : <p>No procedures recorded.</p>}
        </section>

        <section className="section">
          <h3>Appointments</h3>
          {appointments && appointments.length > 0 ? (
            <ul>
              {appointments.map((ap,i)=><li key={i}>{ap.type} on {new Date(ap.date).toLocaleString()} - Status: {ap.status}</li>)}
            </ul>
          ) : <p>No upcoming appointments.</p>}
          <div className="buttons-row">
            <button className="button" onClick={handleRequestNewAppointment}>Request New Appointment</button>
            <button className="button">Request eVisit</button>
          </div>
        </section>

        {showNewAppointmentForm && careTeam && careTeam.length > 0 && (
          <section className="section">
            <h3>Request New Appointment</h3>
            {appointmentMessage && <p className="success-message">{appointmentMessage}</p>}
            <select value={selectedDoctorForNewAppointment} onChange={e=>setSelectedDoctorForNewAppointment(e.target.value)}>
              {careTeam.map((doc,i)=>(
                <option key={i} value={doc.udisId}>{doc.name} ({doc.udisId})</option>
              ))}
            </select>
            <textarea 
              className="appointment-textarea" 
              placeholder="Describe why you need this appointment..."
              value={appointmentDescription}
              onChange={e=>setAppointmentDescription(e.target.value)}
            ></textarea>
            <button className="button" onClick={submitNewAppointmentRequest}>Submit Request</button>
          </section>
        )}

        {appointmentMessage && !showNewAppointmentForm && !selectedDoctor && <p className="success-message">{appointmentMessage}</p>}
      </div>
    </div>
  );
};
//========================================================================================================================================================
export default HealthcarePage;