import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./Components/Layout";
import DashboardPage from "./Pages/DashboardPage";
import Settings from "./Pages/Settings";
import RoomManagement from "./Pages/RoomManagement";
import Guestform from "./Pages/Guest";
import BookingForm from "./Pages/BookingForm";
import UserRoleManagement from "./Pages/UserRoleManagement";
import RoleManagement from "./Pages/RoleManagement";
import LoginPage from "./Pages/LoginPage";

// Public site pages
import HomePage from "./Pages/HomePage";
import InvoiceList from "./Pages/InvoiceList";
// import AboutPage from "./Pages/Public/AboutPage";
// import ServicesPage from "./Pages/Public/ServicesPage";
// import ContactPage from "./Pages/Public/ContactPage";

// Auth check helper
const isAuthenticated = () => !!localStorage.getItem("sessionToken");

// Guards
const PrivateRoute = () =>
  isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
const PublicAuthOnly = () =>
  !isAuthenticated() ? <Outlet /> : <Navigate to="/dashboard" replace />;

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} /> */}

        {/* Public but restricted to guests only */}
        <Route element={<PublicAuthOnly />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Private Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserRoleManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingForm />} />
            <Route path="InvoiceList" element={<InvoiceList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
