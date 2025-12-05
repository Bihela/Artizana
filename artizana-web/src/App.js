// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login'; // <-- added this line for login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Added login route ONLY */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
