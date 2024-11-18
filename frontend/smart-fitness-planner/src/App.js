import './App.css';
import Login from './components/Login';
import WorkoutPlan from './components/WorkoutPlan';
import WorkoutPlanDetail from './components/WorkoutPlanDetail';
import Progress from './components/Progress';
import UpdateProfile from './components/UpdateProfile';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from './FitMaster_Logo.png';

function App() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const updateCompletedWorkouts = (newCount) => {
    setCompletedWorkouts(newCount);
  };

  useEffect(() => {
    const name = localStorage.getItem('name');
    const storedUserId = localStorage.getItem('user_id');
    if (name) {
      setUserName(name);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('workout_plan_id')
    setUserName('');
    setUserId(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="banner">
          <img src={logo} alt="Fit Master Pro Logo" className="logo" />
          {userName ? (
            <div className="user-info">
              <span>Welcome, {userName}!</span>
              {/* Link to the login route to handle logout */}
              <Link to="/" onClick={handleLogout} className="logout-button">Logout</Link>
              <Link to={`/update-profile`} className="update-profile-link">Update Profile</Link>
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
          <Route path="/workout-plan/:id" element={<WorkoutPlanDetail updateCompletedWorkouts={updateCompletedWorkouts} completedWorkouts={completedWorkouts} />} />
          <Route  path="/progress" element={<Progress user_id={userId} completedWorkouts={completedWorkouts} updateCompletedWorkouts={updateCompletedWorkouts} />} />
          <Route path="/update-profile" element={<UpdateProfile userId={userId} />} />
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


