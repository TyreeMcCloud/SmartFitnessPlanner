import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between Login and Register
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data.token);
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        gender,
        height,
        weight,
        age
      });
      console.log('Registration successful:', response.data);
      setIsRegistering(false); // Switch back to login after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
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
                      <input 
                        type="text" 
                        className="form-control" 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>Height (cm):</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>Weight (lbs):</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>Age:</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
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
                    onChange={(e) => setEmail(e.target.value)} 
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

