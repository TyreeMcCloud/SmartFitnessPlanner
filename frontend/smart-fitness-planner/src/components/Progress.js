import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Progress = ({ user_id }) => {
  const [completedWorkouts, setCompletedWorkouts] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/workout-progress/${user_id}`);
        setCompletedWorkouts(response.data.completed_workouts);
        console.log('API response:', response.data);
      } catch (error) {
        console.error('Error fetching workout progress:', error);
      }
    };
    fetchProgress();
  }, [user_id]);

  return (
    <div>
      <h1>Progress Page</h1>
      <p>Total Workouts Completed: {completedWorkouts}</p>
    </div>
  );
};

export default Progress;
