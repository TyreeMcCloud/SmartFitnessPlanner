import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WorkoutPlan = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Your Workout Plan</h2>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Welcome to Your Personalized Workout Plan!</h5>
          <p className="card-text">
            Here, you can view, edit, and customize your workout plan based on your fitness goals.
          </p>
          <button className="btn btn-primary">Create New Plan</button>
          {/* add more functionality here */}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;

