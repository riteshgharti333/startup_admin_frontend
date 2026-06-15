import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/TablePage/Dashboard";
import UserTable from "./pages/TablePage/UserTable";
import NewUser from "./pages/NewData/NewUser";
import EditUser from "./pages/EditData/EditUser";
import ApplicationTable from "./pages/TablePage/ApplicationTable";
import EditApplication from "./pages/EditData/EditApplication";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
     <AuthProvider>

    
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route element={<ProtectedRoute />}>
         
        <Route path="/" element={<DashboardLayout />}>


          <Route index element={<Dashboard />} />
          <Route path="/users" element={<UserTable />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/user/:id" element={<EditUser />} />
          <Route path="/application" element={<ApplicationTable />} />
          <Route path="/application/:id" element={<EditApplication />} />
        </Route>
        </Route>
      </Routes>
       </AuthProvider>
    </BrowserRouter>
  );
}

export default App;