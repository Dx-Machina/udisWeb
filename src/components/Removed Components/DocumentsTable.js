// import React from "react";
// import "../styles/DocumentsTable.css";

// const DocumentsTable = ({ data, headers }) => {
//   return (
//     <div className="documents-table">
//       <table>
//         <thead>
//           <tr>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.length > 0 ? (
//             data.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.type === "IN" ? "IN" : "OUT"}</td>
//                 <td>{item.date ? new Date(item.date).toLocaleString() : "N/A"}</td>
//                 <td>{item.amount ? `$${item.amount}` : "N/A"}</td>
//                 <td>{item.description || "No description"}</td>
//                 <td>{item.from || "N/A"}</td>
//                 <td>{item.to || "N/A"}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={headers.length}>No data available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocumentsTable;