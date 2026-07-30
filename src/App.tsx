import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/TablePage/Dashboard";
import UserTable from "./pages/TablePage/UserTable";
import NewUser from "./pages/NewData/NewUser";
import EditUser from "./pages/EditData/EditUser";
import ApplicationTable from "./pages/TablePage/ApplicationTable";
import EditApplication from "./pages/EditData/EditApplication";
import Login from "./pages/Login/Login";

import { Toaster } from "react-hot-toast";
import LeadTable from "./pages/TablePage/LeadTable";
import EditLead from "./pages/EditData/EditLead";
import SubscriberTable from "./pages/TablePage/SubscriberTable";
import { useMe } from "./service/hooks/useAuth";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public Route - Only accessible when NOT logged in */}
          <Route path="/login" element={<Login />} />

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
            <Route path="/client-leads" element={<LeadTable />} />
            <Route path="/lead/:id" element={<EditLead />} />
            <Route path="/subscribers" element={<SubscriberTable />} />
          </Route>

          {/* Catch all - redirect to login or dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;