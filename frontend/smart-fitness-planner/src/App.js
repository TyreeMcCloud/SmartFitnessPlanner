import './App.css';
import Login from './components/Login';
import WorkoutPlan from './components/WorkoutPlan';
import WorkoutPlanDetail from './components/WorkoutPlanDetail';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    setUserName('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="banner">
          <h1>Fit Master Pro</h1>
          {userName ? (
            <div className="user-info">
              <span>Welcome, {userName}!</span>
              {/* Link to the login route to handle logout */}
              <Link to="/" onClick={handleLogout} className="logout-button">Logout</Link>
            </div>
          ) : (
            <p>Please log in to continue.</p>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<Login setUserName={setUserName} />} />
          <Route path="/workoutplan" element={<WorkoutPlan />} />
          <Route path="/workout-plan/:id" element={<WorkoutPlanDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}


