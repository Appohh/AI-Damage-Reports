import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccidentDescribe() {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/accidentDescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_description: description }),
      });

      const data = await res.json();

      // Navigate to /sketch with JSON data as state
      navigate('/sketch', { state: { sketchData: data.reply } });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <h1>Accident Description</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the accident..."
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AccidentDescribe;
