// // src/components/teacher/TeacherAssignments.jsx
// import React, { useEffect, useState } from 'react';

// const TeacherAssignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     // Fetch assignments for teacher’s sections
//     fetch('http://localhost:5001/api/assignments', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setAssignments(data);
//         } else {
//           setError(data.message || 'Failed to fetch assignments');
//         }
//       })
//       .catch(err => setError(err.message));
//   }, []);

//   return (
//     <div>
//       <h3>Assignments</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       {assignments.length === 0 ? (
//         <p>No assignments found. Try creating one for your sections.</p>
//       ) : (
//         <table style={{borderCollapse:'collapse', width:'100%'}}>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Section</th>
//               <th>Due Date</th>
//               <th>Max Points</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assignments.map(a => (
//               <tr key={a._id}>
//                 <td>{a.title}</td>
//                 <td>{a.section?.course?.courseTitle} - {a.section?.term}</td>
//                 <td>{a.dueDate ? new Date(a.dueDate).toLocaleString() : 'N/A'}</td>
//                 <td>{a.maxPoints}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TeacherAssignments;