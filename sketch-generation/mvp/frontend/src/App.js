import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your pages/components
import Home from './Home';
import About from './About';
import AccidentDescribe from './AccidentDescribe';
import AccidentSketch from './AccidentSketch';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/about">About</Link>
          <Link to="/accident-describe">Accident Describe</Link>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accident-describe" element={<AccidentDescribe />} />
          <Route path="/sketch" element={<AccidentSketch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
