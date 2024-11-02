import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const WorkoutPlan = () => {
  const location = useLocation();
  const userId = location.state?.userId; // Access userId from route state
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [formData, setFormData] = useState({
    chest: { fitnessGoals: '', workoutDays: [], hours: 0, minutes: 0 },
    back: { fitnessGoals: '', workoutDays: [], hours: 0, minutes: 0 },
    legs: { fitnessGoals: '', workoutDays: [], hours: 0, minutes: 0 },
    arms: { fitnessGoals: '', workoutDays: [], hours: 0, minutes: 0 },
    shoulders: { fitnessGoals: '', workoutDays: [], hours: 0, minutes: 0 },
  });

  const goals = {
    chest: ['Build Muscle', 'Increase Strength', 'Enhance Endurance'],
    back: ['Build Muscle', 'Improve Posture', 'Increase Strength'],
    legs: ['Build Muscle', 'Improve Speed', 'Increase Flexibility'],
    arms: ['Build Muscle', 'Increase Strength', 'Enhance Definition'],
    shoulders: ['Build Muscle', 'Improve Mobility', 'Increase Strength'],
  };

 /* useEffect(() => {
    fetchWorkoutPlans();
  }, []);*/
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      axios.get(`http://localhost:5001/api/workout-plans?user_id=${userId}`)
        .then(response => setWorkoutPlans(response.data))
        .catch(error => console.error('Error fetching workout plans:', error));
    }
  }, [userId]);

  const fetchWorkoutPlans = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return; // Exit early if userId is not set
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/workout-plans?user_id=${userId}`); // Adjust the endpoint
      setWorkoutPlans(response.data);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const handleInputChange = (muscleGroup, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [muscleGroup]: { ...prevState[muscleGroup], [field]: value },
    }));
  };

  const handleDaySelection = (muscleGroup, selectedDays) => {
    setFormData((prevState) => ({
      ...prevState,
      [muscleGroup]: { ...prevState[muscleGroup], workoutDays: selectedDays },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('button clicked');
    // Get the selected muscle group's data from formData
    const { fitnessGoals, workoutDays, hours, minutes } = formData[selectedMuscleGroup];

    // Validate input fields for the selected muscle group
    if (!fitnessGoals || !workoutDays.length || (!hours && !minutes)) {
        alert(`Please fill in all fields for ${selectedMuscleGroup}`);
        return; // Exit if validation fails
    }

    const totalTimeEstimate = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`; // Format as HH:MM:SS

     //const userId = 2;
    const userId = localStorage.getItem('user_id'); // Retrieve user_id from local storage
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    try {
        // Send the selected muscle group's data to the server
        await axios.post('http://localhost:5001/api/workout-plans', {
            user_id: userId,
            fitness_goals: fitnessGoals,
            workout_days: workoutDays.join(','), // Join array to store as comma-separated string
            time_estimate: totalTimeEstimate,
        });

        console.log('Executing SQL:', [fitnessGoals, workoutDays, totalTimeEstimate]);
        console.log('Workout plan created for', selectedMuscleGroup);
        fetchWorkoutPlans(); // Refresh the workout plans after creating a new one
    } catch (error) {
        console.error('Error creating workout plan:', error.response ? error.response.data : error.message);
    }
};

const handleDelete = async (planId) => {
  console.log('Delete button clicked');
  try {
    await axios.delete(`http://localhost:5001/api/workout-plans/${planId}`); // Corrected to use path parameter
    fetchWorkoutPlans(); // Refresh the list after deletion
  } catch (error) {
    console.error('Error deleting workout plan:', error);
  }
};


  return (
    <div className="container mt-5">
      <h2 className="text-center">Your Workout Plan</h2>
      <form onSubmit={handleSubmit} className="m">
        <div className="form-group">
          <label htmlFor="muscle-group">Select Muscle Group</label>
          <select
            className="form-control"
            id="muscle-group"
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            required
          >
            <option value="">Choose...</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="arms">Arms</option>
            <option value="shoulders">Shoulders</option>
          </select>
        </div>

        {selectedMuscleGroup && (
  <div className="row mt-4 justify-content-center">
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{selectedMuscleGroup.charAt(0).toUpperCase() + selectedMuscleGroup.slice(1)} Workout</h5>
          
          {/* Centered Form Fields */}
          <div className="d-flex flex-column align-items-center">
            <div className="form-group">
              <label htmlFor={`${selectedMuscleGroup}-goals`}>Fitness Goals</label>
              <select
                className="form-control"
                id={`${selectedMuscleGroup}-goals`}
                value={formData[selectedMuscleGroup].fitnessGoals}
                onChange={(e) => handleInputChange(selectedMuscleGroup, 'fitnessGoals', e.target.value)}
                required
              >
                <option value="">Select Goal...</option>
                {goals[selectedMuscleGroup].map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={`${selectedMuscleGroup}-days`}>Workout Days</label>
              <select
                multiple
                className="form-control"
                id={`${selectedMuscleGroup}-days`}
                value={formData[selectedMuscleGroup].workoutDays}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  handleDaySelection(selectedMuscleGroup, selectedOptions);
                }}
                required
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Everyday">Everyday</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={`${selectedMuscleGroup}-hours`}>Estimated Time (Hours)</label>
              <select
                className="form-control"
                id={`${selectedMuscleGroup}-hours`}
                value={formData[selectedMuscleGroup].hours}
                onChange={(e) => handleInputChange(selectedMuscleGroup, 'hours', e.target.value)}
                required
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={`${selectedMuscleGroup}-minutes`}>Estimated Time (Minutes)</label>
              <select
                className="form-control"
                id={`${selectedMuscleGroup}-minutes`}
                value={formData[selectedMuscleGroup].minutes}
                onChange={(e) => handleInputChange(selectedMuscleGroup, 'minutes', e.target.value)}
                required
              >
                <option value="0">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        
        <button type="submit" className="btn btn-primary mt-4">Create Workout Plan</button>
      </form>

      <h3 className="mt-5">Your Workout Plans</h3>
      <div className="row">
        {workoutPlans.map((plan) => (
          <div className="col-md-4" key={plan.workout_plan_id}>
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">Plan ID: {plan.workout_plan_id}</h5>
                <p className="card-text">Goals: {plan.fitness_goals}</p>
                <p className="card-text">Days: {plan.workout_days}</p>
                <p className="card-text">Estimated Time: {plan.time_estimate}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(plan.workout_plan_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlan;


