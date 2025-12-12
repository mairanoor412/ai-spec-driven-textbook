import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

const KinematicsExplorer = ({ className = '', ...props }) => {
  const [joint1Angle, setJoint1Angle] = useState(0);
  const [joint2Angle, setJoint2Angle] = useState(0);
  const [link1Length, setLink1Length] = useState(100);
  const [link2Length, setLink2Length] = useState(80);
  const [showWorkspace, setShowWorkspace] = useState(true);
  const [workspacePoints, setWorkspacePoints] = useState([]);

  const canvasRef = useRef(null);

  // Calculate end-effector position
  const endEffectorX = link1Length * Math.cos(joint1Angle * Math.PI / 180) +
                      link2Length * Math.cos((joint1Angle + joint2Angle) * Math.PI / 180);
  const endEffectorY = link1Length * Math.sin(joint1Angle * Math.PI / 180) +
                      link2Length * Math.sin((joint1Angle + joint2Angle) * Math.PI / 180);

  // Calculate workspace points
  useEffect(() => {
    // Calculate workspace boundary points
    const points = [];
    const steps = 36; // Number of angle steps for each joint

    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const angle1 = (-90 + (i * 180 / steps)) * Math.PI / 180;
        const angle2 = (-90 + (j * 180 / steps)) * Math.PI / 180;

        const x = link1Length * Math.cos(angle1) + link2Length * Math.cos(angle1 + angle2);
        const y = link1Length * Math.sin(angle1) + link2Length * Math.sin(angle1 + angle2);

        points.push({ x: 200 + x, y: 200 - y }); // Offset and flip Y for canvas
      }
    }

    setWorkspacePoints(points);
  }, [link1Length, link2Length]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw workspace if enabled
    if (showWorkspace) {
      ctx.fillStyle = 'rgba(46, 139, 87, 0.1)'; // Sea Green with transparency
      workspacePoints.forEach(point => {
        ctx.fillRect(point.x - 0.5, point.y - 0.5, 1, 1);
      });
    }

    // Draw coordinate system
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(400, 200); // X-axis
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 400); // Y-axis
    ctx.stroke();

    // Draw robot arm
    ctx.strokeStyle = '#2E8B57'; // Sea Green
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Base position
    const baseX = 200;
    const baseY = 200;

    // Joint 2 position
    const joint2X = baseX + link1Length * Math.cos(joint1Angle * Math.PI / 180);
    const joint2Y = baseY - link1Length * Math.sin(joint1Angle * Math.PI / 180);

    // End-effector position
    const endX = joint2X + link2Length * Math.cos((joint1Angle + joint2Angle) * Math.PI / 180);
    const endY = joint2Y - link2Length * Math.sin((joint1Angle + joint2Angle) * Math.PI / 180);

    // Draw first link
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(joint2X, joint2Y);
    ctx.stroke();

    // Draw second link
    ctx.beginPath();
    ctx.moveTo(joint2X, joint2Y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw joints
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(baseX, baseY, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(joint2X, joint2Y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw end-effector
    ctx.fillStyle = '#DC143C'; // Crimson
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Base', baseX + 5, baseY - 10);
    ctx.fillText('Joint 2', joint2X + 5, joint2Y - 10);
    ctx.fillText('End-Effector', endX + 5, endY - 10);
  }, [joint1Angle, joint2Angle, link1Length, link2Length, showWorkspace, workspacePoints]);

  return (
    <div className={clsx('kinematics-explorer', className)} {...props}>
      <h3>2-DOF Manipulator Kinematics Explorer</h3>

      <div className="explorer-content">
        <div className="diagram-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="kinematics-canvas"
            aria-label="Interactive 2-DOF manipulator diagram showing joint angles and end-effector position"
          />

          <div className="position-display">
            <p><strong>End-effector Position:</strong> ({endEffectorX.toFixed(1)}, {endEffectorY.toFixed(1)})</p>
            <p><strong>Joint Angles:</strong> θ₁ = {joint1Angle}°, θ₂ = {joint2Angle}°</p>
            <p><strong>Link Lengths:</strong> L₁ = {link1Length}px, L₂ = {link2Length}px</p>
          </div>
        </div>

        <div className="controls-container">
          <div className="control-group">
            <label htmlFor="joint1-slider">
              Joint 1 Angle: {joint1Angle}°
            </label>
            <input
              id="joint1-slider"
              type="range"
              min={-90}
              max={90}
              value={joint1Angle}
              onChange={(e) => setJoint1Angle(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label htmlFor="joint2-slider">
              Joint 2 Angle: {joint2Angle}°
            </label>
            <input
              id="joint2-slider"
              type="range"
              min={-90}
              max={90}
              value={joint2Angle}
              onChange={(e) => setJoint2Angle(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label htmlFor="link1-slider">
              Link 1 Length: {link1Length}px
            </label>
            <input
              id="link1-slider"
              type="range"
              min={50}
              max={150}
              value={link1Length}
              onChange={(e) => setLink1Length(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label htmlFor="link2-slider">
              Link 2 Length: {link2Length}px
            </label>
            <input
              id="link2-slider"
              type="range"
              min={30}
              max={120}
              value={link2Length}
              onChange={(e) => setLink2Length(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showWorkspace}
                onChange={(e) => setShowWorkspace(e.target.checked)}
              />
              Show Workspace
            </label>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kinematics-explorer {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          background-color: #fafafa;
        }

        .explorer-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .explorer-content {
            flex-direction: row;
          }
        }

        .diagram-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .kinematics-canvas {
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .position-display {
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }

        .controls-container {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .control-group {
          margin-bottom: 1rem;
        }

        .control-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .slider {
          width: 100%;
          margin: 0.25rem 0;
        }

        @media (max-width: 768px) {
          .controls-container {
            flex: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default KinematicsExplorer;