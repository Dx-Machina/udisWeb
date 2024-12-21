// // src/components/schoolAdmin/SchoolAdminDashboard.jsx
// import React from 'react';
// import { NavLink, Routes, Route } from 'react-router-dom';
// import TopBar from '../TopBar';
// import SchoolAdminHome from './SchoolAdminHome';
// import SchoolAdminCourses from './SchoolAdminCourses';
// import SchoolAdminTeachers from './SchoolAdminTeachers';
// import SchoolAdminStudents from './SchoolAdminStudents';
// import '../../styles/SchoolAdminDashboard.css'; // Create a similar CSS file

// const SchoolAdminDashboard = () => {
//   const userRole = localStorage.getItem('userRole');

//   return (
//     <div className="schooladmin-dashboard-container">
//       <TopBar title="School Admin Dashboard" user={{ role: userRole }} />
//       <aside className="schooladmin-dashboard-sidebar">
//         <nav className="vertical-nav">
//           <NavLink to="home" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
//           <NavLink to="courses" className={({isActive}) => isActive ? "active" : ""}>Courses</NavLink>
//           <NavLink to="teachers" className={({isActive}) => isActive ? "active" : ""}>Teachers</NavLink>
//           <NavLink to="students" className={({isActive}) => isActive ? "active" : ""}>Students</NavLink>
//         </nav>
//       </aside>
//       <main className="schooladmin-dashboard-content">
//         <Routes>
//           <Route path="home" element={<SchoolAdminHome />} />
//           <Route path="courses" element={<SchoolAdminCourses />} />
//           <Route path="teachers" element={<SchoolAdminTeachers />} />
//           <Route path="students" element={<SchoolAdminStudents />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default SchoolAdminDashboard;