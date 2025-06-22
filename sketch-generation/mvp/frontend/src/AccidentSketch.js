import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FabricSketch from './FabricSketch';

export default function AccidentSketch() {
  const location = useLocation();
  const navigate = useNavigate();
  const sketchRef = useRef();

  const sketchData = location.state?.sketchData;

  const handleSave = () => {
    const imageBase64 = sketchRef.current.getImage();

    const fullReport = {
      ...sketchData,
      sketch_image_base64: imageBase64,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullReport, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accident_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (
    !sketchData ||
    !sketchData.vehicle_info ||
    !Array.isArray(sketchData.vehicle_info.cars)
  ) {
    return (
      <div>
        <h2>No sketch data found.</h2>
        <button onClick={() => navigate('/describe-accident')}>
          Go back to description
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Accident Sketch</h1>
      <FabricSketch ref={sketchRef} data={sketchData} />
      <button onClick={handleSave} style={{ marginTop: 20 }}>
         Save Report as JSON
      </button>
      <pre style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(sketchData, null, 2)}
      </pre>
    </div>
  );
}
