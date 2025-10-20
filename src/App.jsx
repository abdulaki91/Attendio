import Home from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/StudentPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/SettingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import SignupPage from "./pages/SignUpPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import SessionAttendance from "./pages/SessionAttendance";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student" element={<Student />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/session-attendance" element={<SessionAttendance />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
