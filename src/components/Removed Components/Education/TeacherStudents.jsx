// // src/components/teacher/TeacherStudents.jsx
// import React, { useEffect, useState } from 'react';

// const TeacherStudents = () => {
//   const [students, setStudents] = useState([]);
//   const [error, setError] = useState('');

//   // Example logic:
//   // You might have an endpoint that returns all students grouped by section for this teacher.
//   // For now, this is a placeholder. Once you have an endpoint, you can fetch it similarly.
  
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     // Example fetch: GET /api/student-data?teacherId=... 
//     // This endpoint does not currently exist, so just a placeholder:
//     fetch('http://localhost:5001/api/teacher/students', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setStudents(data);
//         } else {
//           setError(data.message || 'Failed to fetch students');
//         }
//       })
//       .catch(err => setError(err.message));
//   }, []);

//   return (
//     <div>
//       <h3>Students</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       {students.length === 0 ? (
//         <p>No students found or endpoint not implemented yet.</p>
//       ) : (
//         <table style={{borderCollapse:'collapse', width:'100%'}}>
//           <thead>
//             <tr>
//               <th>Avatar</th>
//               <th>Name</th>
//               <th>UDIS ID</th>
//               <th>Current Grade</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map(s => (
//               <tr key={s.udisId}>
//                 <td><img src={s.avatarPicture || '/images/default_avatar.png'} alt="avatar" style={{width:'30px', borderRadius:'50%'}} /></td>
//                 <td>{s.name}</td>
//                 <td>{s.udisId}</td>
//                 <td>{s.currentGrade || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TeacherStudents;