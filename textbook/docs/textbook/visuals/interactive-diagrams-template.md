---
title: 'Interactive Diagrams Template'
description: 'Template for creating interactive diagrams in the robotics textbook'
---

# Interactive Diagrams Template

## Overview

This template provides a framework for creating interactive diagrams that enhance student learning in robotics education. Interactive diagrams allow students to manipulate parameters, visualize changes in real-time, and gain deeper understanding of complex concepts through hands-on exploration.

## Interactive Diagram Types

### 1. Parameter Manipulation Diagrams
- **Kinematics Explorers**: Adjust joint angles and see end-effector position
- **Control System Tuners**: Modify control parameters and observe response
- **Sensor Fusion Simulators**: Change sensor inputs and see fused output
- **Path Planning Visualizers**: Adjust obstacles and see path generation

### 2. Process Visualization Diagrams
- **Algorithm Steppers**: Step through algorithms and see state changes
- **State Machine Visualizers**: Interact with different states and transitions
- **Simulation Environments**: Manipulate virtual robots and observe behavior
- **Data Flow Diagrams**: Trace information flow through systems

### 3. Concept Exploration Diagrams
- **Trade-off Explorers**: Visualize relationships between different parameters
- **Design Space Navigators**: Explore different design choices and their impacts
- **Comparison Tools**: Compare different approaches side-by-side
- **Scenario Simulators**: Test different scenarios and see outcomes

## Technical Implementation Template

### 1. React Component Structure

```jsx
// src/components/InteractiveKinematicsExplorer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Slider, Box, Typography, Paper } from '@mui/material';

const InteractiveKinematicsExplorer = () => {
  // State for joint angles
  const [joint1Angle, setJoint1Angle] = useState(0);
  const [joint2Angle, setJoint2Angle] = useState(0);
  const [link1Length, setLink1Length] = useState(100);
  const [link2Length, setLink2Length] = useState(80);

  // State for calculated values
  const [endEffectorPos, setEndEffectorPos] = useState({ x: 0, y: 0 });
  const [workspace, setWorkspace] = useState([]);

  // Canvas reference
  const canvasRef = useRef(null);

  // Calculate end-effector position
  useEffect(() => {
    const x = link1Length * Math.cos(joint1Angle * Math.PI / 180) +
              link2Length * Math.cos((joint1Angle + joint2Angle) * Math.PI / 180);
    const y = link1Length * Math.sin(joint1Angle * Math.PI / 180) +
              link2Length * Math.sin((joint1Angle + joint2Angle) * Math.PI / 180);

    setEndEffectorPos({ x, y });

    // Calculate workspace points
    const workspacePoints = [];
    for (let a1 = -90; a1 <= 90; a1 += 10) {
      for (let a2 = -90; a2 <= 90; a2 += 10) {
        const px = link1Length * Math.cos(a1 * Math.PI / 180) +
                   link2Length * Math.cos((a1 + a2) * Math.PI / 180);
        const py = link1Length * Math.sin(a1 * Math.PI / 180) +
                   link2Length * Math.sin((a1 + a2) * Math.PI / 180);
        workspacePoints.push({ x: px, y: py });
      }
    }
    setWorkspace(workspacePoints);
  }, [joint1Angle, joint2Angle, link1Length, link2Length]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw workspace
    ctx.fillStyle = 'rgba(0, 100, 0, 0.1)';
    workspace.forEach(point => {
      ctx.fillRect(200 + point.x, 200 - point.y, 1, 1);
    });

    // Draw robot arm
    ctx.strokeStyle = '#2E8B57';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // First link
    const joint1X = 200;
    const joint1Y = 200;
    const joint2X = joint1X + link1Length * Math.cos(joint1Angle * Math.PI / 180);
    const joint2Y = joint1Y - link1Length * Math.sin(joint1Angle * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(joint1X, joint1Y);
    ctx.lineTo(joint2X, joint2Y);
    ctx.stroke();

    // Second link
    const endX = joint2X + link2Length * Math.cos((joint1Angle + joint2Angle) * Math.PI / 180);
    const endY = joint2Y - link2Length * Math.sin((joint1Angle + joint2Angle) * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(joint2X, joint2Y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw joints
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(joint1X, joint1Y, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(joint2X, joint2Y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw end-effector
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, [joint1Angle, joint2Angle, link1Length, link2Length, workspace]);

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h6" gutterBottom>
        Interactive 2-DOF Manipulator Explorer
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: '1px solid #ccc', marginBottom: '20px' }}
        />

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Box mb={2}>
            <Typography gutterBottom>
              Joint 1 Angle: {joint1Angle}°
            </Typography>
            <Slider
              value={joint1Angle}
              onChange={(e, newValue) => setJoint1Angle(newValue)}
              min={-90}
              max={90}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Joint 2 Angle: {joint2Angle}°
            </Typography>
            <Slider
              value={joint2Angle}
              onChange={(e, newValue) => setJoint2Angle(newValue)}
              min={-90}
              max={90}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Link 1 Length: {link1Length}px
            </Typography>
            <Slider
              value={link1Length}
              onChange={(e, newValue) => setLink1Length(newValue)}
              min={50}
              max={150}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Link 2 Length: {link2Length}px
            </Typography>
            <Slider
              value={link2Length}
              onChange={(e, newValue) => setLink2Length(newValue)}
              min={30}
              max={120}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Typography variant="body2">
            End-effector Position: X={endEffectorPos.x.toFixed(2)}, Y={endEffectorPos.y.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Workspace area shown in light green
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default InteractiveKinematicsExplorer;
```

### 2. Usage in MDX Files

```mdx
---
title: 'Interactive Kinematics Exploration'
description: 'Interactive tool for exploring forward kinematics in robotic manipulators'
---

import InteractiveKinematicsExplorer from '@site/src/components/InteractiveKinematicsExplorer';

# Forward Kinematics Exploration

Use the interactive diagram below to explore how joint angles affect the position of a robot's end-effector.

<InteractiveKinematicsExplorer />

## Learning Objectives

After experimenting with this interactive tool, you should understand:

1. How joint angles determine end-effector position
2. The relationship between link lengths and workspace
3. The concept of workspace in robotic manipulators
4. How to visualize forward kinematics

## Exploration Tasks

1. **Workspace Boundaries**: Adjust link lengths and observe how the workspace changes
2. **Singularity Points**: Find positions where small angle changes cause large position changes
3. **Reachable Positions**: Identify which positions are reachable with current link lengths
4. **Joint Limits**: Explore the effect of joint angle constraints on workspace

## Real-World Connection

This concept applies to:
- Industrial robot arms in manufacturing
- Surgical robots requiring precise positioning
- Service robots manipulating objects in human environments
- Research robots exploring complex terrains

## Mathematical Background

The forward kinematics for a 2-DOF planar manipulator is given by:

$$
\\begin{align}
x &= L_1 \\cos(\\theta_1) + L_2 \\cos(\\theta_1 + \\theta_2) \\\\
y &= L_1 \\sin(\\theta_1) + L_2 \\sin(\\theta_1 + \\theta_2)
\\end{align}
$$

Where:
- $L_1, L_2$ are link lengths
- $\\theta_1, \\theta_2$ are joint angles
- $(x, y)$ is the end-effector position
```

## Interactive Diagram Categories

### 1. Kinematics Explorers

#### Forward Kinematics Explorer
**Purpose**: Visualize how joint angles determine end-effector position
**Controls**: Joint angle sliders, link length adjustments
**Visualization**: Robot arm with workspace overlay

#### Inverse Kinematics Solver
**Purpose**: Find joint angles for desired end-effector positions
**Controls**: Target position selectors, solution parameter adjustments
**Visualization**: Robot configuration with solution path

#### Workspace Visualizer
**Purpose**: Show reachable and dexterous workspace regions
**Controls**: Robot parameter adjustments, workspace type selection
**Visualization**: 2D/3D workspace boundaries with color coding

### 2. Control System Simulators

#### PID Controller Tuner
**Purpose**: Understand how P, I, D parameters affect system response
**Controls**: Gain sliders, system parameter adjustments
**Visualization**: Step response curves, stability indicators

#### Balance Control Simulator
**Purpose**: Explore ZMP-based balance control in humanoid robots
**Controls**: Robot parameters, disturbance inputs, control gains
**Visualization**: ZMP trajectory, COG movement, stability regions

#### Trajectory Generator
**Purpose**: Create and visualize motion trajectories
**Controls**: Waypoint placement, velocity profiles, smoothing parameters
**Visualization**: Path planning, velocity profiles, acceleration curves

### 3. Sensor and Perception Tools

#### Sensor Fusion Visualizer
**Purpose**: Show how multiple sensors contribute to environmental understanding
**Controls**: Sensor weights, noise levels, input values
**Visualization**: Individual sensor outputs and fused result

#### SLAM Explorer
**Purpose**: Visualize the SLAM process in real-time
**Controls**: Robot trajectory, sensor parameters, algorithm settings
**Visualization**: Map building, pose estimation, uncertainty visualization

#### Vision Processing Lab
**Purpose**: Experiment with computer vision algorithms
**Controls**: Filter parameters, threshold values, algorithm selection
**Visualization**: Original image, processed output, feature extraction results

## Implementation Guidelines

### 1. Performance Considerations
- **Efficient Rendering**: Use requestAnimationFrame for smooth animations
- **State Management**: Optimize state updates to avoid unnecessary re-renders
- **Memory Management**: Clean up event listeners and canvas contexts
- **Responsive Design**: Ensure diagrams work well on all device sizes

### 2. Accessibility Features
- **Keyboard Navigation**: Ensure all controls are accessible via keyboard
- **Screen Reader Support**: Provide ARIA labels and descriptions
- **Color Blindness Support**: Use patterns and textures in addition to color
- **Text Alternatives**: Provide textual descriptions of visual content

### 3. Educational Design
- **Immediate Feedback**: Show results of parameter changes instantly
- **Guided Exploration**: Provide hints and guided tasks
- **Progressive Disclosure**: Start simple, reveal complexity gradually
- **Real-World Context**: Connect to practical applications

### 4. Technical Architecture
- **Component Reusability**: Design components that can be adapted for different concepts
- **Data Serialization**: Save and restore interaction states
- **Export Capabilities**: Allow students to save results
- **Collaboration Features**: Enable sharing of exploration results

## Quality Standards

### Educational Value
- **Conceptual Clarity**: Diagrams should illuminate key concepts
- **Engagement**: Interactive elements should promote active learning
- **Discovery Learning**: Students should be able to discover principles through interaction
- **Transferability**: Concepts learned should apply to real-world scenarios

### Technical Quality
- **Responsiveness**: Diagrams should update smoothly to parameter changes
- **Accuracy**: Visualizations should accurately represent the underlying concepts
- **Reliability**: Components should work consistently across different environments
- **Performance**: Diagrams should not slow down page performance

### Usability
- **Intuitive Controls**: Parameters should be easy to adjust
- **Clear Feedback**: Results of interactions should be immediately visible
- **Appropriate Complexity**: Diagrams should match student preparation level
- **Help System**: Provide guidance for effective use

## Integration with Textbook

### 1. Content Integration
- **Contextual Placement**: Place diagrams where concepts are introduced
- **Progressive Complexity**: Build on previous interactive elements
- **Cross-References**: Link to related diagrams and concepts
- **Assessment Integration**: Include questions that require diagram interaction

### 2. Assessment Integration
- **Interactive Quizzes**: Use diagram parameters to generate questions
- **Exploration Tasks**: Assign specific exploration missions
- **Result Analysis**: Have students analyze and explain diagram outputs
- **Extension Projects**: Use diagrams as starting points for larger projects

### 3. Progress Tracking
- **Interaction Logging**: Track how students use interactive elements
- **Mastery Indicators**: Assess understanding through interaction patterns
- **Personalized Feedback**: Adapt content based on interaction results
- **Portfolio Building**: Allow students to save and share exploration results

## Example Implementation: Control System Simulator

```jsx
// src/components/ControlSystemSimulator.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Slider, Box, Typography, Paper, Button } from '@mui/material';

const ControlSystemSimulator = () => {
  const [kp, setKp] = useState(1.0);
  const [ki, setKi] = useState(0.1);
  const [kd, setKd] = useState(0.05);
  const [setpoint, setSetpoint] = useState(1.0);
  const [noiseLevel, setNoiseLevel] = useState(0.0);
  const [systemOrder, setSystemOrder] = useState(2);

  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);
  const [responses, setResponses] = useState([]);

  // Simulate system response
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      // Vertical grid lines
      ctx.beginPath();
      ctx.moveTo(i * 40, 0);
      ctx.lineTo(i * 40, 300);
      ctx.stroke();

      // Horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(0, i * 30);
      ctx.lineTo(400, i * 30);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X-axis (time)
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(400, 250);
    ctx.stroke();

    // Y-axis (response)
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, 300);
    ctx.stroke();

    // Draw response curve if we have data
    if (responses.length > 1) {
      ctx.strokeStyle = '#2E8B57';
      ctx.lineWidth = 2;
      ctx.beginPath();

      responses.forEach((response, index) => {
        const x = 50 + (index * 350 / responses.length);
        const y = 250 - (response * 100); // Scale response

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw setpoint line
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const setpointY = 250 - (setpoint * 100);
    ctx.beginPath();
    ctx.moveTo(50, setpointY);
    ctx.lineTo(400, setpointY);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [responses, setpoint]);

  // Simulate system periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.1);

      // Simplified PID simulation
      const error = setpoint - (responses.length > 0 ? responses[responses.length - 1] : 0);
      const integral = responses.reduce((sum, val) => sum + (setpoint - val), 0) * 0.1;
      const derivative = responses.length > 1 ?
        (responses[responses.length - 1] - responses[responses.length - 2]) / 0.1 : 0;

      const controlSignal = kp * error + ki * integral + kd * derivative;

      // Simple first-order system response (simplified)
      const newResponse = responses.length > 0 ?
        responses[responses.length - 1] + 0.1 * (controlSignal - responses[responses.length - 1]) :
        0;

      // Add noise
      const noise = (Math.random() - 0.5) * noiseLevel;
      const finalResponse = Math.max(0, Math.min(3, newResponse + noise));

      setResponses(prev => [...prev.slice(-40), finalResponse]); // Keep last 40 points
    }, 100);

    return () => clearInterval(interval);
  }, [kp, ki, kd, setpoint, noiseLevel, responses]);

  const resetSimulation = () => {
    setTime(0);
    setResponses([]);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h6" gutterBottom>
        PID Control System Simulator
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          style={{ border: '1px solid #ccc', marginBottom: '20px' }}
        />

        <div style={{ width: '100%', maxWidth: '500px' }}>
          <Box mb={2}>
            <Typography gutterBottom>
              Proportional Gain (Kp): {kp.toFixed(2)}
            </Typography>
            <Slider
              value={kp}
              onChange={(e, newValue) => setKp(newValue)}
              min={0}
              max={5}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Integral Gain (Ki): {ki.toFixed(2)}
            </Typography>
            <Slider
              value={ki}
              onChange={(e, newValue) => setKi(newValue)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Derivative Gain (Kd): {kd.toFixed(2)}
            </Typography>
            <Slider
              value={kd}
              onChange={(e, newValue) => setKd(newValue)}
              min={0}
              max={0.5}
              step={0.005}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Setpoint: {setpoint.toFixed(2)}
            </Typography>
            <Slider
              value={setpoint}
              onChange={(e, newValue) => setSetpoint(newValue)}
              min={0}
              max={3}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mb={2}>
            <Typography gutterBottom>
              Noise Level: {noiseLevel.toFixed(2)}
            </Typography>
            <Slider
              value={noiseLevel}
              onChange={(e, newValue) => setNoiseLevel(newValue)}
              min={0}
              max={0.5}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button variant="contained" onClick={resetSimulation}>
            Reset Simulation
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Typography variant="body2" color="textSecondary">
            Blue line: System response | Red dashed line: Setpoint
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default ControlSystemSimulator;
```

This template provides a comprehensive framework for creating interactive diagrams that enhance learning in robotics education by allowing students to manipulate parameters and observe real-time results.