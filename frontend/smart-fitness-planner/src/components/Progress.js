import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Progress = ({ user_id, completedWorkouts, updateCompletedWorkouts  }) => {
  const navigate = useNavigate();
  const workout_plan_id = localStorage.getItem('workout_plan_id'); // Retrieve the ID from local storage

  useEffect(() => {
    const fetchProgress = async () => {
      if (user_id) {
        try {
          console.log('Fetching progress for user_id:', user_id); // Log user_id to confirm
          const response = await axios.get(`http://localhost:5001/api/workout-progress/${user_id}?timestamp=${Date.now()}`);
          updateCompletedWorkouts(response.data.completed_workouts);
          console.log('API response:', response.data);
        } catch (error) {
          console.error('Error fetching workout progress:', error);
        }
      }
    };
    
    fetchProgress();
  }, [updateCompletedWorkouts, user_id, completedWorkouts]);

  useEffect(() => {
    console.log("Completed workouts:", completedWorkouts);
  }, [completedWorkouts]);

  // Handle delete workout plan and navigate back
  const handleDeleteWorkoutPlan = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/workout-plans/${workout_plan_id}`);
      console.log('Workout plan deleted successfully.');
      localStorage.removeItem('workout_plan_id'); // Remove the workout plan ID from local storage
      navigate('/workoutplan'); // Navigate back to the workout plan page
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  };

  const handleClearCompletedWorkouts = async () => {
    try {
      await axios.post(`http://localhost:5001/api/clear-completed-workouts/${user_id}`); // API endpoint to clear workouts
      updateCompletedWorkouts(0); // Reset completed workouts in the state
      console.log('Completed workouts cleared successfully.');
    } catch (error) {
      console.error('Error clearing completed workouts:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Progress Page</h1>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Workouts Completed: {completedWorkouts}</p>

      {/* Chart Section */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '200px',
        border: '1px solid #ddd',
        padding: '10px',
        marginBottom: '20px'
      }}>
        {[...Array(completedWorkouts)].map((_, index) => (
          <div key={index} style={{
            width: '20px',
            height: `${10 + index * 10}px`, // Increases bar height for each completed workout
            backgroundColor: '#4CAF50',
            margin: '0 5px',
            borderRadius: '3px'
          }}></div>
        ))}
      </div>
        {/* Clear Workouts Button */}
      <button
        onClick={handleClearCompletedWorkouts}
        style={{
          backgroundColor: '#3498db',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '10px'
        }}
      >
        Clear Completed Workouts
      </button>
      {/* Delete and Back Button */}
      <button
        onClick={handleDeleteWorkoutPlan}
        style={{
          backgroundColor: '#e74c3c',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Finish Workout & Go Back
      </button>
    </div>
  );
};

export default Progress;

