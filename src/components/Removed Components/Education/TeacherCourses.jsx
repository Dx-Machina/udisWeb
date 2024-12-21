// // src/components/teacher/TeacherCourses.jsx
// import React, { useEffect, useState } from 'react';

// const TeacherCourses = () => {
//   const [sections, setSections] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     // Example: Fetch sections this teacher teaches
//     fetch('http://localhost:5001/api/course-sections', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setSections(data);
//         } else {
//           setError(data.message || 'Failed to fetch sections');
//         }
//       })
//       .catch(err => setError(err.message));
//   }, []);

//   return (
//     <div>
//       <h3>Courses & Sections</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       {sections.length === 0 ? (
//         <p>No sections found. You might not be assigned any courses yet.</p>
//       ) : (
//         <div>
//           <p>Here are your sections:</p>
//           <ul>
//             {sections.map(section => (
//               <li key={section._id}>
//                 {section.course.courseTitle} - {section.term} (Section {section.sectionNumber}) - {section.modality}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherCourses;