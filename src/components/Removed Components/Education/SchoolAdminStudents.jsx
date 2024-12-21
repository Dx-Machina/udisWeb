// // src/components/schoolAdmin/SchoolAdminStudents.jsx
// import React, { useState, useEffect } from 'react';

// const SchoolAdminStudents = () => {
//   const [students, setStudents] = useState([]);
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/students', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (Array.isArray(data)) {
//         setStudents(data);
//       } else {
//         setError(data.message || 'Failed to fetch students');
//       }
//     })
//     .catch(err => setError(err.message));
//   }, []);

//   const handleAddStudent = (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type':'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ name, email, role:'Citizen', password:'defaultPass123', birthdate:'01 JAN 2000' })
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (data._id) {
//         setStudents([...students, data]);
//         setName('');
//         setEmail('');
//       } else {
//         setError(data.message || 'Failed to create student');
//       }
//     })
//     .catch(err => setError(err.message));
//   };

//   return (
//     <div>
//       <h3>Students</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       <form onSubmit={handleAddStudent}>
//         <input 
//           type="text" 
//           placeholder="Name" 
//           value={name}
//           onChange={e => setName(e.target.value)}
//           required
//         />
//         <input 
//           type="email" 
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)} 
//           required
//         />
//         <button type="submit">Add Student</button>
//       </form>
//       <ul>
//         {students.map(s => (
//           <li key={s._id}>{s.name} - {s.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SchoolAdminStudents;