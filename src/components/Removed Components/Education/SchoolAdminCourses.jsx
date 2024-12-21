// // src/components/schoolAdmin/SchoolAdminCourses.jsx
// import React, { useEffect, useState } from 'react';

// const SchoolAdminCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [error, setError] = useState('');
//   const [courseTitle, setCourseTitle] = useState('');
//   const [descriptor, setDescriptor] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/courses', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setCourses(data);
//         } else {
//           setError(data.message || 'Failed to fetch courses');
//         }
//       })
//       .catch(err => setError(err.message));
//   }, []);

//   const handleAddCourse = (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:5001/api/schooladmin/courses', {
//       method: 'POST',
//       headers: { 
//         'Content-Type':'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ courseTitle, descriptor })
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (data._id) {
//         setCourses([...courses, data]);
//         setCourseTitle('');
//         setDescriptor('');
//       } else {
//         setError(data.message || 'Failed to create course');
//       }
//     })
//     .catch(err => setError(err.message));
//   };

//   return (
//     <div>
//       <h3>Courses</h3>
//       {error && <p style={{color:'red'}}>{error}</p>}
//       <form onSubmit={handleAddCourse}>
//         <input 
//           type="text" 
//           placeholder="Course Title" 
//           value={courseTitle} 
//           onChange={e => setCourseTitle(e.target.value)} 
//           required
//         />
//         <input 
//           type="text" 
//           placeholder="Descriptor" 
//           value={descriptor} 
//           onChange={e => setDescriptor(e.target.value)} 
//         />
//         <button type="submit">Add Course</button>
//       </form>
//       <ul>
//         {courses.map(c => (
//           <li key={c._id}>{c.courseTitle} - {c.descriptor}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SchoolAdminCourses;