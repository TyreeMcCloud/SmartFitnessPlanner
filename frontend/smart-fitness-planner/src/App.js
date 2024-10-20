import './App.css';
import Login from './components/Login';
import WorkoutPlan from './components/WorkoutPlan';
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
        </Routes>
      </header>
    </div>
  </Router>
    );
}

export default App;
