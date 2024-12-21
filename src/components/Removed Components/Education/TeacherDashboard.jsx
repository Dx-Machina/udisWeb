// // src/components/teacher/TeacherDashboard.jsx
// import React from 'react';
// import { NavLink, Routes, Route } from 'react-router-dom';
// import TeacherHome from './TeacherHome.jsx';
// import TopBar from '../TopBar.js';
// import TeacherCourses from './TeacherCourses.jsx';
// import TeacherAssignments from './TeacherAssignments.jsx';
// import TeacherStudents from './TeacherStudents.jsx';
// import '../../styles/TeacherDashboard.css';


// const TeacherDashboard = () => {
//   const userRole = localStorage.getItem('userRole');
//   return (
//     <div className="teacher-dashboard-container">
//       <TopBar title="Teacher Dashboard" user={{ role: userRole }} />
//       <aside className="teacher-dashboard-sidebar">
//         <nav className="vertical-nav">
//           <NavLink to="home" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
//           <NavLink to="courses" className={({isActive}) => isActive ? "active" : ""}>Courses & Sections</NavLink>
//           <NavLink to="assignments" className={({isActive}) => isActive ? "active" : ""}>Assignments</NavLink>
//           <NavLink to="students" className={({isActive}) => isActive ? "active" : ""}>Students</NavLink>
//         </nav>
//       </aside>
//       <main className="teacher-dashboard-content">
//         <Routes>
//           <Route path="home" element={<TeacherHome />} />
//           <Route path="courses" element={<TeacherCourses />} />
//           <Route path="assignments" element={<TeacherAssignments />} />
//           <Route path="students" element={<TeacherStudents />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default TeacherDashboard;
