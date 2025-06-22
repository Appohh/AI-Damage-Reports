import React, { useState } from 'react';

function About() {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: inputValue }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Input Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
        <button type="submit">Submit</button>
      </form>
      <p>Response from backend: {response}</p>
    </div>
  );
}

export default About;
