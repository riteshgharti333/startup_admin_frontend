import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/TablePage/Dashboard";
import UserTable from "./pages/TablePage/UserTable";
import NewUser from "./pages/NewData/NewUser";
import EditUser from "./pages/EditData/EditUser";
import ApplicationTable from "./pages/TablePage/ApplicationTable";
import EditApplication from "./pages/EditData/EditApplication";
import Login from "./pages/Login/Login";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public Route - Only accessible when NOT logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Only accessible when logged in */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<UserTable />} />
            <Route path="/new-user" element={<NewUser />} />
            <Route path="/user/:id" element={<EditUser />} />
            <Route path="/application" element={<ApplicationTable />} />
            <Route path="/application/:id" element={<EditApplication />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
