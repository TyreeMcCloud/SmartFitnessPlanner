import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorkoutPlan from './WorkoutPlan';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserName }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between Login and Register
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login button clicked');
    setErrorMessage('');
    
    try {
      const response = await axios.post('http://localhost:5001/api/login', { email, password });
      console.log('Response:', response); // Log the entire response
      console.log('Login successful:', response.data.message);
      
      // Check if the response status is OK before navigating
      if (response.status === 200) {
        const { user_id, name } = response.data; // Assuming response contains `user_id`
        setUserId(user_id); // Set user_id in state
        localStorage.setItem('user_id', user_id); // Store user_id in local storage
        localStorage.setItem('name', name);
        setUserName(name); // Update App state with the user's name

        navigate('/workoutplan', { state: { userId: user_id } });
        navigate('/workoutplan'); // Navigate to the WorkoutPlan after successful login
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register button clicked');
    try {
      const response = await axios.post('http://localhost:5001/api/register', {
        name,
        email,
        password,
        gender,
        height,
        weight,
        age
      });
      console.log('Registration successful:', response.data);
      const { user_id, name: userName } = response.data; // Assuming response contains `user_id`
      localStorage.setItem('user_id', user_id); // Store user_id in local storage
      localStorage.setItem('name', userName);
      setIsRegistering(false); // Switch back to login after successful registration
      navigate('/workoutplan'); // Navigate to the WorkoutPlan after successful registration
    } catch (error) {
      // Check if error.response exists before trying to access its data
      if (error.response) {
        console.error('Registration failed:', error.response.data);
        if (error.response.status === 409) {
          setErrorMessage('Email already in use. Please use a different email.');
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      } else {
        setErrorMessage('Registration failed: No response from server.');
      }
    }
  };

  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: 'rgba(255, 40, 50, 0.85)' }}>
            <div className="card-body">
              <h2 className="card-title text-center">{isRegistering ? 'Register' : 'Login'}</h2>
              <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                {isRegistering && (
                  <>
                    <div className="form-group">
                      <label>Name:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group mt-3">
                    <label>Gender:</label>
                   <select
                  className="form-control"
                  value={gender}
                   onChange={(e) => setGender(e.target.value)}
                   required
                   >
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
                 <option value="Other">Other</option>
                 </select>
                 </div>
                 <div className="form-group mt-3">
  <label>Height (cm):</label>
  <input
    type="number"
    className="form-control"
    value={height}
    onChange={(e) => {
      const value = e.target.value;
      // Ensure the height is positive and a number
      if (value > 0) {
        setHeight(value);
      }
    }}
    required
  />
</div>

<div className="form-group mt-3">
  <label>Weight (lbs):</label>
  <input
    type="number"
    className="form-control"
    value={weight}
    onChange={(e) => {
      const value = e.target.value;
      // Ensure the weight is positive and a number
      if (value > 0) {
        setWeight(value);
      }
    }}
    required
  />
</div>

<div className="form-group mt-3">
  <label>Age:</label>
  <input
    type="number"
    className="form-control"
    value={age}
    onChange={(e) => {
      const value = e.target.value;
      // Ensure the age is positive and a number
      if (value > 0) {
        setAge(value);
      }
    }}
    required
  />
</div>
                  </>
                )}
                <div className="form-group mt-3">
  <label>Email:</label>
  <input
    type="email"
    className="form-control"
    value={email}
    onChange={(e) => {
      const value = e.target.value;
      // Basic email validation (built-in with type="email")
      setEmail(value);
    }}
    required
  />
</div>
                <div className="form-group mt-3">
                  <label>Password:</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">{isRegistering ? 'Register' : 'Login'}</button>
              </form>
              <div className="mt-3 text-center">
                <p>
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"} 
                  <button 
                    className="btn btn-link" 
                    onClick={() => setIsRegistering(!isRegistering)} // Toggle registration
                  >
                    {isRegistering ? 'Login here' : 'Register here'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

