import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define exercises for each muscle group
const exercises = {
  chest: {
    exercises: [
      { name: 'Push-Ups', duration: 3 },
      { name: 'Bench Press', duration: 3 },
      { name: 'Chest Fly', duration: 5 },
      { name: 'Incline Dumbbell Press', duration: 4 },
      { name: 'Cable Chest Press', duration: 6 },
    ],
    videos: [
      'https://www.youtube.com/watch?v=IODxDxX7oi4',
      'https://www.youtube.com/watch?v=QENKPHhQVi4',
    ],
  },
  back: {
    exercises: [
      { name: 'Pull-Ups', duration: 3 },
      { name: 'Deadlifts', duration: 10 },
      { name: 'Bent Over Rows', duration: 10 },
      { name: 'Lat Pulldowns', duration: 5 },
      { name: 'Seated Cable Rows', duration: 6 },
    ],
    videos: [
      'https://www.youtube.com/watch?v=p40iUjf02j0',
      'https://www.youtube.com/watch?v=XxWcirHIwVo',
    ],
  },
  legs: {
    exercises: [
      { name: 'Squats', duration: 4 },
      { name: 'Lunges', duration: 3 },
      { name: 'Leg Press', duration: 5 },
      { name: 'Calf Raises', duration: 2 },
      { name: 'Leg Curls', duration: 3 },
    ],
    videos: [
      'https://www.youtube.com/watch?v=gcNh17Ckjgg',
      'https://www.youtube.com/watch?v=1LuRcKJMn8w',
    ],
  },
  arms: {
    exercises: [
      { name: 'Bicep Curls', duration: 3 },
      { name: 'Tricep Extensions', duration: 4 },
      { name: 'Hammer Curls', duration: 3 },
      { name: 'Skull Crushers', duration: 5 },
      { name: 'Concentration Curls', duration: 3 },
    ],
    videos: [
      'https://www.youtube.com/watch?v=jjnJHhzZUUM',
      'https://www.youtube.com/watch?v=l3rHYPtMUo8',
    ],
  },
  shoulders: {
    exercises: [
      { name: 'Shoulder Press', duration: 4 },
      { name: 'Lateral Raises', duration: 3 },
      { name: 'Front Raises', duration: 3 },
      { name: 'Reverse Fly', duration: 4 },
      { name: 'Arnold Press', duration: 5 },
    ],
    videos: [
      'https://www.youtube.com/watch?v=QAQ64hK4Xxs',
      'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    ],
  },
};

// Define goals with recommendations for each muscle group
const goals = {
  chest: {
    'Build Muscle': 'Try using more weight to stimulate growth.',
    'Increase Strength': 'Focus on fewer reps with heavier weights.',
    'Enhance Endurance': 'Incorporate higher reps with moderate weights.',
  },
  back: {
    'Build Muscle': 'Include compound movements in your routine.',
    'Improve Posture': 'Incorporate exercises like rows and pull-ups.',
    'Increase Strength': 'Use progressive overload in your workouts.',
  },
  legs: {
    'Build Muscle': 'Focus on compound exercises like squats and lunges.',
    'Improve Speed': 'Incorporate plyometric exercises and sprint intervals.',
    'Increase Flexibility': 'Include stretching and mobility exercises regularly.',
  },
  arms: {
    'Build Muscle': 'Use progressive overload with exercises like curls and extensions.',
    'Increase Strength': 'Perform heavier lifts with compound movements like chin-ups.',
    'Enhance Definition': 'Use lighter weights with high reps to increase muscle tone.',
  },
  shoulders: {
    'Build Muscle': 'Focus on overhead presses with added weight over time.',
    'Improve Mobility': 'Incorporate dynamic stretches and resistance band work.',
    'Increase Strength': 'Use heavy weights with low reps for exercises like shoulder press.',
  },
};

// Define reps based on goal
const repsByGoal = {
  'Build Muscle': 10,
  'Increase Strength': 6,
  'Enhance Endurance': 20,
  'Improve Posture': 12,
  'Improve Speed': 15,
  'Increase Flexibility': 12,
  'Enhance Definition': 15,
  'Improve Mobility': 15,
};

const WorkoutPlanDetail = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/workout-plans/${id}`);
        setPlan(response.data);

        // Parse the fitness_goals field to get muscle group and goal
        const [muscleGroup, goal] = response.data.fitness_goals.split(' - ').map((str) => str.trim());
        const lowerMuscleGroup = muscleGroup.toLowerCase();

        setWorkouts(exercises[lowerMuscleGroup]?.exercises || []);
      } catch (error) {
        console.error('Error fetching workout plan details:', error);
      }
    };
    fetchPlanDetails();
  }, [id]);

  if (!plan || !workouts) return <p>Loading...</p>;

  const handleComplete = async () => {
    console.log('button clicked');
    try {
      // Retrieve user_id from localStorage
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        console.error('User ID not found in localStorage');
        return;
      }

      // Make an API call to mark the workout as complete
      await axios.post(`http://localhost:5001/api/complete-workout`, {
        user_id: user_id,  // Send user ID from localStorage
        workout_data: `Workout Plan ID: ${id}`,  // Replace with relevant workout data
      });
      console.log('Workout marked as complete');

      // Redirect to the progress page after marking completion
      navigate('/progress');
    } catch (error) {
      console.error('Error marking workout as complete:', error);
    }
  };

  const estimatedTimeInHours = parseInt(plan.time_estimate.split(' ')[0], 10); // Assuming format is like "30 minutes"
  console.log("time",estimatedTimeInHours);
  // Determine number of workouts based on time
  const numberOfWorkouts = estimatedTimeInHours <= 0 ? 3 : 5;

  // Define the number of sets
  const sets = 6; // Fixed number of sets

  // Extract goal
  const [muscleGroup, goal] = plan.fitness_goals.split(' - ').map((str) => str.trim());
  const lowerMuscleGroup = muscleGroup.toLowerCase();

  // Get reps per set based on goal
  const repsPerSet = repsByGoal[goal] || 10;

  // Slice the workouts based on the numberOfWorkouts
  const selectedWorkouts = workouts.slice(0, numberOfWorkouts);

  //keep from  multiplying reps by 0
  const estimatedTimeInHour = estimatedTimeInHours < 1 ? 1 : estimatedTimeInHours;

  // Create a list with sets and reps
  const workoutList = selectedWorkouts.map((workout) => {
    const totalReps = (repsPerSet*estimatedTimeInHour) * sets;
    return { ...workout, repsPerSet, sets, totalReps };
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Workout Plan Details</h2>
      
      {/* Plan Information Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Plan ID: {plan.workout_plan_id}</h3>
          <p className="card-text"><strong>Muscle Group:</strong> {muscleGroup}</p>
          <p className="card-text"><strong>Goal:</strong> {goal}</p>
          <p className="card-text"><strong>Days:</strong> {plan.workout_days}</p>
          <p className="card-text"><strong>Estimated Time:</strong> {plan.time_estimate}</p>
          {/* Complete Button */}
          <button onClick={handleComplete} className="btn btn-success mt-3">Complete</button>
        </div>
      </div>

      <div className="row">
        {/* Recommended Workouts */}
        <div className="col-md-6">
          <h4>Your Recommended Workouts:</h4>
          <ul className="list-group mb-4">
            {workoutList.map((workout) => (
              <li key={workout.name} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{workout.name}</strong>
                  <br />
                  {workout.sets} sets of {workout.repsPerSet} reps
                </div>
                <span>Total Reps: {workout.totalReps}</span>
              </li>
            ))}
          </ul>

          {/* Goal Recommendation */}
          <h4>How to Achieve Your Goal:</h4>
          <p>{goals[lowerMuscleGroup]?.[goal] || 'Goal recommendation not available.'}</p>
        </div>

        {/* Workout Videos */}
        <div className="col-md-6">
          <h4>Workout Videos:</h4>
          <ul className="list-group">
            {exercises[lowerMuscleGroup]?.videos.map((video, index) => (
              <li key={index} className="list-group-item">
                <a href={video} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetail;




