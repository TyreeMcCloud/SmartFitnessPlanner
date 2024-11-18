import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // State for userId

  // Retrieve userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId); // Set userId from localStorage
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // Fetch user data to prefill the form
  useEffect(() => {
    if (!userId) {
      // If userId is null or undefined, handle the error
      console.error("User ID is missing");
      return;
    }

    // Fetch user data using the correct API URL
    fetch(`http://localhost:5001/api/getUser/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching user data');
        }
        console.log("nvm i got it");
        return response.json();
      })
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setGender(data.gender);
        setHeight(data.height);
        setWeight(data.weight);
        setAge(data.age);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { userId, name, email, gender, height, weight, age };

    // Send PUT request to update profile
    fetch('http://localhost:5001/api/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          alert('Profile updated successfully');
        } else {
          alert('Error updating profile');
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
      setTimeout(() => navigate('/workoutplan'), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
  <label htmlFor="name" className="form-label">Name:</label>
  <input
    type="text"
    className="form-control"
    id="name"
    value={name}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setName(value);
      }
    }}
  />
</div>

<div className="mb-3">
  <label htmlFor="email" className="form-label">Email:</label>
  <input
    type="email"
    className="form-control"
    id="email"
    value={email}
    onChange={(e) => {
      const value = e.target.value;
      // Simple email validation for valid characters
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(value)) {
        setEmail(value);
      }
    }}
  />
</div>

        <div className="mb-3">
  <label htmlFor="gender" className="form-label">Gender:</label>
  <select
    className="form-select"
    id="gender"
    value={gender}
    onChange={(e) => setGender(e.target.value)}
  >
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="mb-3">
  <label htmlFor="height" className="form-label">Height (cm):</label>
  <input
    type="number"
    className="form-control"
    id="height"
    value={height}
    min="0"
    onChange={(e) => {
      if (e.target.value >= 0) {
        setHeight(e.target.value);
      }
    }}
  />
</div>
<div className="mb-3">
  <label htmlFor="weight" className="form-label">Weight (kg):</label>
  <input
    type="number"
    className="form-control"
    id="weight"
    value={weight}
    min="0"
    onChange={(e) => {
      if (e.target.value >= 0) {
        setWeight(e.target.value);
      }
    }}
  />
</div>
<div className="mb-3">
  <label htmlFor="age" className="form-label">Age:</label>
  <input
    type="number"
    className="form-control"
    id="age"
    value={age}
    min="0"
    onChange={(e) => {
      if (e.target.value >= 0) {
        setAge(e.target.value);
      }
    }}
  />
</div>

        <button type="submit" className="btn btn-primary w-100">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;


