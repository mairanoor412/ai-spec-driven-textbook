import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Slider, Box, Button } from '@mui/material';

const InteractiveDiagram = ({
  title = "Interactive Diagram",
  description = "An interactive visualization for learning",
  initialParams = {},
  onParamChange = () => {},
  children,
  ...props
}) => {
  const [params, setParams] = useState(initialParams);
  const [isInteractive, setIsInteractive] = useState(true);

  const handleParamChange = (paramName, value) => {
    const newParams = { ...params, [paramName]: value };
    setParams(newParams);
    onParamChange(newParams);
  };

  const resetParams = () => {
    setParams(initialParams);
  };

  return (
    <Card variant="outlined" style={{ margin: '1rem 0', borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          {description}
        </Typography>

        <div style={{ margin: '1rem 0' }}>
          {children({ params, isInteractive, setInteractive: setIsInteractive })}
        </div>

        {Object.keys(initialParams).length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <Box mb={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Typography variant="subtitle2">Interactive Controls</Typography>
                <Button size="small" onClick={resetParams}>Reset</Button>
              </div>
            </Box>

            {Object.entries(initialParams).map(([key, config]) => (
              <Box key={key} mb={2}>
                <Typography gutterBottom>
                  {config.label || key}: {params[key]?.toFixed?.(2) || params[key]}
                </Typography>
                <Slider
                  value={params[key]}
                  onChange={(e, newValue) => handleParamChange(key, newValue)}
                  min={config.min || 0}
                  max={config.max || 100}
                  step={config.step || 1}
                  valueLabelDisplay="auto"
                  disabled={!isInteractive}
                />
              </Box>
            ))}

            <Box mt={2}>
              <Button
                size="small"
                variant={isInteractive ? "contained" : "outlined"}
                onClick={() => setIsInteractive(!isInteractive)}
              >
                {isInteractive ? "Disable Interaction" : "Enable Interaction"}
              </Button>
            </Box>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specific example: Kinematics Explorer
const KinematicsExplorer = () => {
  const [jointAngles, setJointAngles] = useState({
    joint1: 0,
    joint2: 0,
    link1: 100,
    link2: 80
  });

  const canvasRef = useRef(null);

  // Calculate end-effector position
  const endEffectorX = jointAngles.link1 * Math.cos(jointAngles.joint1 * Math.PI / 180) +
                      jointAngles.link2 * Math.cos((jointAngles.joint1 + jointAngles.joint2) * Math.PI / 180);

  const endEffectorY = jointAngles.link1 * Math.sin(jointAngles.joint1 * Math.PI / 180) +
                      jointAngles.link2 * Math.sin((jointAngles.joint1 + jointAngles.joint2) * Math.PI / 180);

  // Draw the robot arm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw coordinate system
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(300, 150);
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 300);
    ctx.stroke();

    // Draw robot arm
    ctx.strokeStyle = '#2E8B57';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Base position
    const baseX = 150;
    const baseY = 150;

    // Joint 2 position
    const joint2X = baseX + jointAngles.link1 * Math.cos(jointAngles.joint1 * Math.PI / 180);
    const joint2Y = baseY - jointAngles.link1 * Math.sin(jointAngles.joint1 * Math.PI / 180);

    // End-effector position
    const endX = joint2X + jointAngles.link2 * Math.cos((jointAngles.joint1 + jointAngles.joint2) * Math.PI / 180);
    const endY = joint2Y - jointAngles.link2 * Math.sin((jointAngles.joint1 + jointAngles.joint2) * Math.PI / 180);

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
    ctx.arc(baseX, baseY, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(joint2X, joint2Y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw end-effector
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, [jointAngles]);

  return (
    <InteractiveDiagram
      title="2-DOF Robot Arm Kinematics Explorer"
      description="Explore how joint angles affect the position of a robot arm's end-effector"
      initialParams={{
        joint1: { min: -90, max: 90, step: 1, label: "Joint 1 Angle (degrees)" },
        joint2: { min: -90, max: 90, step: 1, label: "Joint 2 Angle (degrees)" },
        link1: { min: 50, max: 150, step: 5, label: "Link 1 Length (pixels)" },
        link2: { min: 30, max: 120, step: 5, label: "Link 2 Length (pixels)" }
      }}
      onParamChange={setJointAngles}
    >
      {({ params }) => (
        <div style={{ textAlign: 'center' }}>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            style={{ border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="body2">
              End-effector Position: ({endEffectorX.toFixed(1)}, {endEffectorY.toFixed(1)})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Joint Angles: θ₁={params.joint1}°, θ₂={params.joint2}°
            </Typography>
          </div>
        </div>
      )}
    </InteractiveDiagram>
  );
};

export { InteractiveDiagram, KinematicsExplorer };