import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import URLResult from "./pages/URLResult";
import URLResult2 from "./pages/URLResult2";
import AddPhish from "./pages/AddPhish";
import SearchPhish from "./pages/SearchPhish";
import EmailDetection from "./pages/EmailDetection";
import AdminLogin from "./admin/AdminLogin";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminPhishURL from "./admin/AdminPhishURL";
import AdminProfile from "./admin/AdminProfile";
import { AuthContext } from './helpers/AuthContext';
import { useState } from 'react';

function App() {
  const [authState, setAuthState] = useState({
    email: "",
    user_id: 0,
    status: false
  });

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/result/:id" element={<URLResult />} />
            <Route path="/resultURL/:id" element={<URLResult2 />} />
            <Route path="/addphish" element={<AddPhish />} />
            <Route path="/searchphish" element={<SearchPhish />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/emaildetection" element={<EmailDetection />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/user" element={<AdminUsers />} />
            <Route path="/admin/phishurl" element={<AdminPhishURL />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Routes>
        </Router>
      </AuthContext.Provider >
    </div>
  );
}

export default App;