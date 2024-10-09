// import React from 'react'
// import { BrowserRouter, Routes, Route} from 'react-router-dom';
// import Home from './Home';
// //import DepartmentPost from '../DepartmentServices/DepartmentPost';
// import LoginPage from './LoginPage';
// //import Login from './Login';
// import ProtectedRoute from './ProtectedRoute';
// function Routing() {

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path='/' element={<LoginPage></LoginPage>}></Route>
//         <Route path='/home' element={<Home></Home>}></Route>  */}
//         {/* <Route path='/departmentpost' element={<DepartmentPost></DepartmentPost>}></Route>*/}

//         <Route path='/' element={<LoginPage />} />
//         {/* <ProtectedRoute path='/home' element={<Home></Home>} /> */}
//         <Route
//           path="/home"
//           element={<ProtectedRoute element={<Home />} />}
//         />
//       </Routes>
//       </BrowserRouter>

//   )
// }

// export default Routing

// src/Routing.js
// src/Routing.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute'; // Ensure this is correct
//import EmployeeLoginPage from './EmployeeLoginPage';
//import AdminLoginPage from './AdminLoginPage';


function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute> <Home /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
