//=========================================================================================================
// DoctorPage is the Doctor Portal
//=========================================================================================================
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import '../styles/DoctorPage.css';

const DoctorPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [udisIdQuery, setUdisIdQuery] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [recentPatients, setRecentPatients] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [careTeam, setCareTeam] = useState([]);
  const [newCareTeamUdisId, setNewCareTeamUdisId] = useState('');
  const [requestActions, setRequestActions] = useState({}); 
  const healthcareRoles = ['Doctor', 'Nurse', 'Health Worker'];
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const token = localStorage.getItem('token');

//=========================================================================================================
  const fetchRecentPatients = useCallback(async () => {
    if (!token) return;
    try {
      const recentRes = await axios.get(`${API_BASE_URL}/api/healthcare/recent-patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentPatients(Array.isArray(recentRes.data) ? recentRes.data : []);
    } catch (err) {
      console.error('Error fetching recent patients:', err);
    }
  }, [API_BASE_URL, token]);
//=========================================================================================================
  const fetchAppointmentRequests = useCallback(async () => {
    if (!token) return;
    try {
      const reqRes = await axios.get(`${API_BASE_URL}/api/healthcare/appointment-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointmentRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!token) {
        setError('No token found. Please log in first.');
        return;
      }
      try {
        const docRes = await axios.get(`${API_BASE_URL}/api/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(docRes.data);

        await fetchRecentPatients();
        await fetchAppointmentRequests();
      } catch (err) {
        console.error('Error fetching doctor data:', err.response?.data || err.message);
        setError('Unable to fetch doctor data.');
      }
    };
    fetchDoctorData();
  }, [API_BASE_URL, token, fetchRecentPatients, fetchAppointmentRequests]);
//=========================================================================================================
  const handleFetchPatient = async () => {
    setError('');
    setSuccessMessage('');
    setPatientData(null);

    const query = (udisIdQuery || '').trim();
    if (!query) {
      setError('Please enter a UDIS ID');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/healthcare/patient/${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientData(res.data);
      setCareTeam(res.data.healthcare.careTeam || []);
      await fetchRecentPatients();
    } catch (err) {
      console.error('Error fetching patient:', err.response?.data || err.message);
      setError('Unable to find patient or insufficient permissions.');
    }
  };
//=========================================================================================================
  const handleUpdatePatient = async () => {
    if (!patientData) return;
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.put(`${API_BASE_URL}/api/healthcare/patient/${encodeURIComponent(patientData.udisId)}`, {
        healthcare: patientData.healthcare
      },{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.message === 'Patient healthcare updated successfully') {
        setSuccessMessage('Patient info updated successfully!');
      } else {
        setError('Failed to update patient healthcare data.');
      }
    } catch (err) {
      console.error('Error updating patient:', err.response?.data || err.message);
      setError('Failed to update patient healthcare data.');
    }
  };
//=========================================================================================================
  const handleAddItem = (field) => {
    if (!patientData) return;
    const newPatientData = { ...patientData };
    if (!newPatientData.healthcare[field]) {
      newPatientData.healthcare[field] = [];
    }
    let newEntry = {};
    switch (field) {
      case 'labResults': newEntry = { date: new Date(), testName: '', result: '' }; break;
      case 'medications': newEntry = { name: '', dosage: '', frequency: '' }; break;
      case 'allergies': newEntry = ''; break;
      case 'immunizations': newEntry = { name: '', date: new Date() }; break;
      case 'doctorsNotes': newEntry = { date: new Date(), note: '', doctorId: doctor?.udisId || '' }; break;
      case 'procedures': newEntry = { name: '', date: new Date(), notes: '' }; break;
      default: return;
    }

    if (field === 'allergies') {
      newPatientData.healthcare.allergies.push('');
    } else {
      newPatientData.healthcare[field].push(newEntry);
    }

    setPatientData(newPatientData);
  };
//=========================================================================================================
  const handleChangeField = (field, index, subfield, value) => {
    const newData = { ...patientData };
    if (field === 'allergies') {
      newData.healthcare.allergies[index] = value;
    } else {
      newData.healthcare[field][index][subfield] = value;
    }
    setPatientData(newData);
  };

  const removePatientFromRecent = async (patientUdisId) => {
    if (!patientUdisId) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/healthcare/recent-patients/${encodeURIComponent(patientUdisId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRecentPatients();
    } catch (err) {
      console.error('Error removing recent patient:', err);
    }
  };
//=========================================================================================================
  const renderRecentPatients = () => {
    if (!recentPatients || recentPatients.length === 0) return <p className="no-data-msg">No recent patients found.</p>;
    return (
      <div className="recent-patients-container">
        <h4>Recent Patients</h4>
        {recentPatients.map((p,i) => (
          <div key={i} className="recent-patient-row">
            <div className="recent-patient-info">
              <img 
                src={p.avatarPicture || '/images/default_avatar.png'} 
                alt={p.name} 
                className="recent-patient-img"
              />
              <span className="recent-patient-name">{p.name}{p.udisId ? ` (${p.udisId})` : ''}</span>
            </div>
            <button 
              onClick={() => {
                setUdisIdQuery(p.udisId || '');
                handleFetchPatient();
              }}
              className="action-button secondary open-recent-button"
            >
              Open
            </button>
            {p.udisId && (
              <button
                onClick={() => removePatientFromRecent(p.udisId)}
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
//=========================================================================================================
  const fetchUserByUdisId = async (udisId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/verify/${encodeURIComponent(udisId)}`);
      return res.data; // {name, udisId, avatarPicture, role}
    } catch (err) {
      console.error('Error fetching user by UDIS ID:', err);
      return null;
    }
  };

  const addCareTeamMember = async () => {
    if (!newCareTeamUdisId.trim()) {
      setError('Please enter a UDIS ID for the team member.');
      return;
    }

    const memberData = await fetchUserByUdisId(newCareTeamUdisId.trim());
    if (!memberData) {
      setError('User not found.');
      return;
    }

    if (!healthcareRoles.includes(memberData.role)) {
      setError('The user is not a healthcare worker. Cannot add to care team.');
      return;
    }

    const updatedTeam = [...careTeam, { udisId: memberData.udisId, name: memberData.name, avatarPicture: memberData.avatarPicture || '' }];
    setCareTeam(updatedTeam);
    setNewCareTeamUdisId('');
    setError('');
    setSuccessMessage('Team member added locally. Don\'t forget to Update Care Team to save.');
  };
//=========================================================================================================
  const updateCareTeam = async () => {
    if (!patientData) return;
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.put(`${API_BASE_URL}/api/healthcare/patient/${encodeURIComponent(patientData.udisId)}/care-team`, {
        careTeam
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.data && res.data.message === 'Care team updated') {
        setSuccessMessage('Care team updated successfully!');
        const updated = { ...patientData };
        updated.healthcare.careTeam = res.data.careTeam;
        setPatientData(updated);
      } else {
        setError('Failed to update care team.');
      }
    } catch (err) {
      console.error('Error updating care team:', err);
      setError('Failed to update care team.');
    }
  };
//=========================================================================================================
  const handleRequestActionChange = (patientUdisId, field, value) => {
    setRequestActions({
      ...requestActions,
      [patientUdisId]: {
        ...requestActions[patientUdisId],
        [field]: value
      }
    });
  };
//=========================================================================================================
  const submitAppointmentRequestAction = async (patientUdisId) => {
    const action = requestActions[patientUdisId] || {};
    if (!action.status) return;
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.put(`${API_BASE_URL}/api/healthcare/appointment-requests`, {
        patientUdisId,
        status: action.status,
        date: action.date || ''
      },{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.message) {
        setSuccessMessage(res.data.message);
        await fetchAppointmentRequests();
      } else {
        setError('Failed to update appointment request.');
      }
    } catch (err) {
      console.error('Error updating appointment request:', err);
      setError('Failed to update appointment request.');
    }
  };

  let avatarSrc = '/images/default_avatar.png';
  if (patientData?.avatarPicture && patientData.avatarPicture.trim() !== '') {
    if (patientData.avatarPicture.startsWith('/uploads')) {
      avatarSrc = `${API_BASE_URL}${patientData.avatarPicture}`;
    } else {
      avatarSrc = patientData.avatarPicture;
    }
  }
//=========================================================================================================
  const hc = patientData?.healthcare || {};

  return (
    <div className="doctor-container">
      <TopBar title="Doctor Portal" user={doctor} />
      <div className="doctor-content">
        <h2 className="page-title">Doctor Page</h2>
        <p className="page-subtitle">
          You can search for a patient by UDIS ID, view their healthcare info, manage their care team, and respond to appointment requests.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter Patient UDIS"
            value={udisIdQuery}
            onChange={e=>setUdisIdQuery(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleFetchPatient}
            className="search-button"
          >
            Fetch Patient
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {renderRecentPatients()}

        {patientData && (
          <div className="patient-data-card">
            <div className="patient-header">
              <div className="patient-info-with-avatar">
                <img src={avatarSrc} alt={patientData.name} className="patient-avatar"/>
                <div className="patient-info-text">
                  <h3 className="patient-name">{patientData.name}</h3>
                  <p className="patient-email">{patientData.email}</p>
                  <p><strong>UDIS:</strong> {patientData.udisId}</p>
                </div>
              </div>
            </div>

            <h4 className="section-title">Healthcare Data</h4>

            {/* Lab Results */}
            <div className="section-card">
              <h5 className="section-subtitle">Lab Results</h5>
              {hc.labResults && hc.labResults.length > 0 ? hc.labResults.map((lr,i)=>(
                <div key={i} className="multi-field-row">
                  <input 
                    type="date"
                    value={lr.date ? new Date(lr.date).toISOString().slice(0,10) : ''}
                    onChange={e=>handleChangeField('labResults',i,'date',e.target.value)}
                    className="lab-result-input"
                  />
                  <input 
                    type="text"
                    placeholder="Test Name"
                    value={lr.testName}
                    onChange={e=>handleChangeField('labResults',i,'testName',e.target.value)}
                    className="lab-result-input"
                  />
                  <input 
                    type="text"
                    placeholder="Result"
                    value={lr.result}
                    onChange={e=>handleChangeField('labResults',i,'result',e.target.value)}
                    className="lab-result-input"
                  />
                </div>
              )) : <p className="no-data-msg">No lab results yet.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('labResults')}>Add Lab Result</button>
            </div>

            {/* Medications */}
            <div className="section-card">
              <h5 className="section-subtitle">Medications</h5>
              {hc.medications && hc.medications.length > 0 ? hc.medications.map((m,i)=>(
                <div key={i} className="multi-field-row">
                  <input type="text" placeholder="Name" value={m.name} onChange={e=>handleChangeField('medications',i,'name',e.target.value)} className="lab-result-input"/>
                  <input type="text" placeholder="Dosage" value={m.dosage} onChange={e=>handleChangeField('medications',i,'dosage',e.target.value)} className="lab-result-input"/>
                  <input type="text" placeholder="Frequency" value={m.frequency} onChange={e=>handleChangeField('medications',i,'frequency',e.target.value)} className="lab-result-input"/>
                </div>
              )) : <p className="no-data-msg">No medications yet.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('medications')}>Add Medication</button>
            </div>

            {/* Allergies */}
            <div className="section-card">
              <h5 className="section-subtitle">Allergies</h5>
              {hc.allergies && hc.allergies.length > 0 ? hc.allergies.map((a,i)=>(
                <div key={i} className="multi-field-row">
                  <input type="text" placeholder="Allergy" value={a} onChange={e=>handleChangeField('allergies',i,null,e.target.value)} className="lab-result-input"/>
                </div>
              )) : <p className="no-data-msg">No allergies recorded.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('allergies')}>Add Allergy</button>
            </div>

            {/* Immunizations */}
            <div className="section-card">
              <h5 className="section-subtitle">Immunizations</h5>
              {hc.immunizations && hc.immunizations.length > 0 ? hc.immunizations.map((im,i)=>(
                <div key={i} className="multi-field-row">
                  <input type="text" placeholder="Name" value={im.name} onChange={e=>handleChangeField('immunizations',i,'name',e.target.value)} className="lab-result-input"/>
                  <input type="date" value={im.date ? new Date(im.date).toISOString().slice(0,10) : ''} onChange={e=>handleChangeField('immunizations',i,'date',e.target.value)} className="lab-result-input"/>
                </div>
              )) : <p className="no-data-msg">No immunizations found.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('immunizations')}>Add Immunization</button>
            </div>

            {/* Doctor's Notes */}
            <div className="section-card">
              <h5 className="section-subtitle">Doctor's Notes</h5>
              {hc.doctorsNotes && hc.doctorsNotes.length > 0 ? hc.doctorsNotes.map((dn,i)=>(
                <div key={i} className="multi-field-row">
                  <input type="date" value={dn.date ? new Date(dn.date).toISOString().slice(0,10) : ''} onChange={e=>handleChangeField('doctorsNotes',i,'date',e.target.value)} className="lab-result-input"/>
                  <input type="text" placeholder="Note" value={dn.note} onChange={e=>handleChangeField('doctorsNotes',i,'note',e.target.value)} className="lab-result-input"/>
                </div>
              )) : <p className="no-data-msg">No notes available.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('doctorsNotes')}>Add Note</button>
            </div>

            {/* Procedures */}
            <div className="section-card">
              <h5 className="section-subtitle">Procedures</h5>
              {hc.procedures && hc.procedures.length > 0 ? hc.procedures.map((p,i)=>(
                <div key={i} className="multi-field-row">
                  <input type="text" placeholder="Name" value={p.name} onChange={e=>handleChangeField('procedures',i,'name',e.target.value)} className="lab-result-input"/>
                  <input type="date" value={p.date ? new Date(p.date).toISOString().slice(0,10) : ''} onChange={e=>handleChangeField('procedures',i,'date',e.target.value)} className="lab-result-input"/>
                  <input type="text" placeholder="Notes" value={p.notes} onChange={e=>handleChangeField('procedures',i,'notes',e.target.value)} className="lab-result-input"/>
                </div>
              )) : <p className="no-data-msg">No procedures recorded.</p>}
              <button className="action-button secondary" onClick={()=>handleAddItem('procedures')}>Add Procedure</button>
            </div>

            {/* CARE TEAM EDITING SECTION */}
            <div className="section-card">
              <h5 className="section-subtitle">Care Team</h5>
              {careTeam && careTeam.length > 0 ? careTeam.map((member,i)=>(
                <div key={i} className="multi-field-row">
                  <input
                    type="text"
                    placeholder="UDIS ID"
                    value={member.udisId}
                    onChange={e=>{
                      const updated = [...careTeam];
                      updated[i].udisId = e.target.value;
                      setCareTeam(updated);
                    }}
                    className="lab-result-input"
                  />
                  <p style={{margin:0, color:'#676663', fontSize:'14px'}}>Name: {member.name}</p>
                </div>
              )) : <p className="no-data-msg">No care team members assigned.</p>}

              <h6>Add New Team Member by UDIS ID:</h6>
              <div className="multi-field-row">
                <input
                  type="text"
                  placeholder="UDIS ID"
                  value={newCareTeamUdisId}
                  onChange={e=>setNewCareTeamUdisId(e.target.value)}
                  className="lab-result-input"
                />
                <button className="action-button secondary" onClick={addCareTeamMember}>Add Member</button>
              </div>

              <button className="action-button primary" onClick={updateCareTeam}>Update Care Team</button>
            </div>

            <div className="update-button-container">
              <button 
                onClick={handleUpdatePatient}
                className="action-button primary"
              >
                Update Patient Info
              </button>
            </div>
          </div>
        )}

        {/* APPOINTMENT REQUESTS SECTION */}
        {doctor && (
          <div className="appointment-requests-card">
            <h4 className="section-title">Appointment Requests</h4>
            {appointmentRequests && appointmentRequests.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Description</th>
                    <th>Date Requested</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentRequests.map((req,i) => {
                    const action = requestActions[req.patientUdisId] || {};
                    return (
                      <tr key={i}>
                        <td>{req.patientName} ({req.patientUdisId})</td>
                        <td>{req.description}</td>
                        <td>{new Date(req.date).toLocaleString()}</td>
                        <td>{req.status}</td>
                        <td>
                          {req.status === 'Pending' ? (
                            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                              <div style={{display:'flex', gap:'5px'}}>
                                <select value={action.status || ''} onChange={e=>handleRequestActionChange(req.patientUdisId,'status',e.target.value)}>
                                  <option value="">Select Action</option>
                                  <option value="Approved">Approve</option>
                                  <option value="Denied">Deny</option>
                                </select>
                                {action.status === 'Approved' && (
                                  <input
                                    type="date"
                                    value={action.date || ''}
                                    onChange={e=>handleRequestActionChange(req.patientUdisId,'date',e.target.value)}
                                  />
                                )}
                              </div>
                              <button className="action-button primary" onClick={()=>submitAppointmentRequestAction(req.patientUdisId)}>Submit</button>
                            </div>
                          ) : (
                            <span>No further action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : <p className="no-data-msg">No appointment requests.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPage;