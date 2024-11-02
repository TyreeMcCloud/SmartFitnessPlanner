// WorkoutPlanDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WorkoutPlanDetail = () => {
  const { id } = useParams(); // Get workout_plan_id from URL
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/workout-plans/${id}`);
        setPlan(response.data);
      } catch (error) {
        console.error('Error fetching workout plan details:', error);
      }
    };
    fetchPlanDetails();
  }, [id]);

  if (!plan) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Workout Plan Details</h2>
      <h3>Plan ID: {plan.workout_plan_id}</h3>
      <p>Goals: {plan.fitness_goals}</p>
      <p>Days: {plan.workout_days}</p>
      <p>Estimated Time: {plan.time_estimate}</p>
      {/* Display more detailed workout info as needed */}
    </div>
  );
};

export default WorkoutPlanDetail;
