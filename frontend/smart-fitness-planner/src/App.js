import './App.css';
import Login from './components/Login';
import WorkoutPlan from './components/WorkoutPlan';
import WorkoutPlanDetail from './components/WorkoutPlanDetail';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <p>Welcome to the workout planner.</p>
        <Routes>
          {/* Define your routes */}
          <Route exact path="/" element={<Login />} />
          <Route path="/workoutplan" element={<WorkoutPlan />} />
          <Route path="/workout-plan/:id" element={<WorkoutPlanDetail />} />
        </Routes>
      </header>
    </div>
  </Router>
    );
}

export default App;
