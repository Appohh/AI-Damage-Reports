import React, { useEffect, useRef } from 'react';
import {
  Canvas,
  Rect,
  Triangle,
  Group,
  Circle,
  Line,
  Text
} from 'fabric';

const statusColors = {
  parked: '#3A87D4',
  standing: '#999999',
  driving: '#D9534F',
  reversing: '#F0AD4E',
  sliding: '#800080',
  unknown: '#969696'
};

const vehicleStyles = {
  Car: {
    width: 80,
    height: 40,
    fill: '#3A87D4',
  },
  Truck: {
    width: 120,
    height: 50,
    fill: '#A52A2A',
  }
};

function createArrow(x, y, color = 'black') {
  const line = new Rect({
    width: 60,
    height: 8,
    fill: color,
    originX: 'left',
    originY: 'center'
  });

  const triangle = new Triangle({
    width: 16,
    height: 16,
    fill: color,
    originX: 'center',
    originY: 'center',
    left: 60,
    top: 0,
    angle: 90
  });

  return new Group([line, triangle], {
    left: x,
    top: y,
    hasControls: true,
    hasBorders: true,
    selectable: true
  });
}

function createCollisionMarker(x, y) {
  const line1 = new Line([-10, -10, 10, 10], {
    stroke: 'red',
    strokeWidth: 3
  });
  const line2 = new Line([-10, 10, 10, -10], {
    stroke: 'red',
    strokeWidth: 3
  });
  return new Group([line1, line2], {
    left: x,
    top: y,
    hasControls: true,
    selectable: true
  });
}

export default function AccidentSketch({ data }) {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  useEffect(() => {
    fabricCanvas.current = new Canvas(canvasRef.current, {
      selection: true
    });

    // Set canvas size to full window
    fabricCanvas.current.setWidth(1000);
    fabricCanvas.current.setHeight(600);

    return () => {
      fabricCanvas.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (!data || !fabricCanvas.current) return;

    const canvas = fabricCanvas.current;
    canvas.clear();

    const startX = 100;
    const spacing = 150;

    // Draw cars
    data.cars.forEach((car, index) => {
      const style = vehicleStyles[car.vehicle] || vehicleStyles['Car'];
      const fillColor = statusColors[car.status] || style.fill;

      const rect = new Rect({
        width: style.width,
        height: style.height,
        fill: fillColor,
        originX: 'center',
        originY: 'center',
        rx: 6,
        ry: 6,
      });

      const label = new Text(car.id, {
        fontSize: 16,
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontWeight: 'bold'
      });

      const groupObjects = [rect, label];

      if (car.status === 'reversing') {
        const light1 = new Circle({
          radius: 5,
          fill: '#FFD700',
          left: -style.width / 2,
          top: -style.height / 2 + 10,
          originX: 'left',
          originY: 'top'
        });
        const light2 = new Circle({
          radius: 5,
          fill: '#FFD700',
          left: -style.width / 2,
          top: style.height / 2 - 20,
          originX: 'left',
          originY: 'top'
        });
        groupObjects.push(light1, light2);
      }

      const group = new Group(groupObjects, {
        left: startX + index * spacing,
        top: 100,
        hasControls: true,
        hasBorders: true,
        selectable: true,
        angle: 0
      });

      canvas.add(group);
    });

    // Draw collisions — simple positioning (you can improve this!)
    data.collisions.forEach(([from, to], i) => {
      const arrow = createArrow(150 + i * 150, 300);
      const marker = createCollisionMarker(160 + i * 150, 350);
      canvas.add(arrow);
      canvas.add(marker);
    });

    canvas.renderAll();

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '1px solid #ccc',
        width: '1000px',
        height: '600px',
        touchAction: 'none',
      }}
    />
  );
}