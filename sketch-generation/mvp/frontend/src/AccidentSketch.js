import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FabricSketch from './FabricSketch'; 

export default function AccidentSketch() {
  const location = useLocation();
  const navigate = useNavigate();

  // The sketch data passed from /describe page
  const sketchData = location.state?.sketchData;

  if (!sketchData) {
    return (
      <div>
        <h2>No sketch data found.</h2>
        <button onClick={() => navigate('/describe')}>Go back to description</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Accident Sketch</h1>
      <FabricSketch data={sketchData} />
    <pre>{JSON.stringify(sketchData, null, 2)}</pre>
    </div>
  );
}
