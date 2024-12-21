// // src/components/schoolAdmin/SchoolAdminTeachers.jsx
// import React, { useState, useEffect } from 'react';

// const SchoolAdminTeachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/teachers', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (Array.isArray(data)) {
//         setTeachers(data);
//       } else {
//         setError(data.message || 'Failed to fetch teachers');
//       }
//     })
//     .catch(err => setError(err.message));
//   }, []);

//   const handleAddTeacher = (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type':'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ name, email, role:'Teacher', password:'defaultPass123', birthdate:'01 JAN 2000' })
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (data._id) {
//         setTeachers([...teachers, data]);
//         setName('');
//         setEmail('');
//       } else {
//         setError(data.message || 'Failed to create teacher');
//       }
//     })
//     .catch(err => setError(err.message));
//   };

//   return (
//     <div>
//       <h3>Teachers</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       <form onSubmit={handleAddTeacher}>
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
//         <button type="submit">Add Teacher</button>
//       </form>
//       <ul>
//         {teachers.map(t => (
//           <li key={t._id}>{t.name} - {t.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SchoolAdminTeachers;