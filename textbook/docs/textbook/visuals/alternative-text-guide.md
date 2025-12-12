---
title: 'Alternative Text Guide for Visual Materials'
description: 'Comprehensive guide for creating effective alternative text for all visual materials in the robotics textbook'
---

# Alternative Text Guide for Visual Materials

## Overview

This guide provides comprehensive instructions for creating effective alternative text (alt text) for all visual materials in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Alt text ensures accessibility for users with visual impairments and provides context for all users when images cannot be loaded.

## Alt Text Principles

### 1. Purpose of Alt Text
- **Accessibility**: Enable screen readers to convey visual information
- **Context**: Provide meaning and relevance of visual content
- **Fallback**: Serve as substitute when images fail to load
- **SEO**: Improve search engine understanding of content

### 2. Quality Standards
- **Concise**: Keep under 125 characters for most images
- **Descriptive**: Accurately describe the content and function
- **Contextual**: Tailor to the surrounding content
- **Functional**: Explain what the image does, not just what it shows

## Alt Text Categories

### 1. Informative Images
**Purpose**: Convey information that supports the text

**Guidelines**:
- Describe the key information being presented
- Include important labels, values, or data points
- Focus on what's relevant to the learning objective

**Examples**:
- ❌ `"A chart"`
- ✅ `"Bar chart showing the relationship between motor torque and rotational speed for three different motor types"`

### 2. Decorative Images
**Purpose**: Enhance visual appeal but not convey information

**Guidelines**:
- Use empty alt attribute (`alt=""`) or minimal description
- Don't describe decorative elements that don't add information

**Examples**:
- ❌ `"Pretty blue background with gears"`
- ✅ `alt=""` or `"Decorative gear pattern"`

### 3. Functional Images
**Purpose**: Serve as links, buttons, or interactive elements

**Guidelines**:
- Describe the function or action, not the appearance
- Use the same text as the link or button

**Examples**:
- ❌ `"Red arrow pointing right"`
- ✅ `"Next chapter"` or `"Continue to exercises"`

### 4. Complex Diagrams
**Purpose**: Convey detailed information through visual representation

**Guidelines**:
- Provide a summary of the main concept being illustrated
- Include a longer description in the figure caption or surrounding text
- Focus on the key relationships or processes shown

## Alt Text by Visual Type

### 1. Technical Diagrams

#### System Architecture Diagrams
```
Alt: "System architecture diagram showing the Physical AI system with perception, reasoning, and action modules. Sensors feed into the perception module, which connects to the reasoning module. The reasoning module connects to the action module, which controls actuators. All modules are connected to a central environment interface."
```

#### Kinematic Diagrams
```
Alt: "2-DOF planar manipulator kinematic diagram showing two rotating joints with links of length L1 and L2. Joint angles θ1 and θ2 are labeled, with the end-effector position P(x,y) indicated. Coordinate frame shows X and Y axes."
```

#### Control System Diagrams
```
Alt: "Feedback control system diagram with plant, controller, sensor, and summing junction. Reference input r(t) enters the summing junction, which outputs error signal e(t) to the controller. Controller output u(t) goes to the plant, which produces output y(t). Plant output feeds back through the sensor to the summing junction."
```

### 2. Data Visualizations

#### Charts and Graphs
```
Alt: "Line graph showing motor efficiency versus load percentage. The curve peaks at 85% efficiency at 60% load, then decreases to 75% efficiency at 100% load. The X-axis ranges from 0 to 100 percent load, Y-axis from 0 to 100 percent efficiency."
```

#### Tables (when converted to images)
```
Alt: "Table comparing sensor types with columns for sensor type, accuracy, range, and cost. Shows LiDAR as high accuracy, long range, high cost; camera as medium accuracy, long range, low cost; ultrasonic as low accuracy, medium range, low cost."
```

### 3. Process Flows

#### Algorithm Flowcharts
```
Alt: "Flowchart showing the SLAM algorithm process. Starts with sensor data input, proceeds through data association, state estimation, and map update. Includes feedback loop from map update back to data association. Ends with pose and map output."
```

#### Decision Trees
```
Alt: "Decision tree for robot navigation strategy selection. Root splits on environment type: structured vs unstructured. Structured leads to path planning, unstructured leads to exploration. Both converge to obstacle avoidance."
```

### 4. Physical Objects

#### Robot Photographs
```
Alt: "Photo of the TurtleBot3 Burger robot showing differential drive wheels, 360-degree LiDAR sensor on top, RGB-D camera, and compact rectangular chassis with orange and black color scheme."
```

#### Component Diagrams
```
Alt: "Exploded diagram of servo motor assembly showing housing, gears, motor, potentiometer, and control circuit board. Components are arranged vertically with connecting arrows indicating assembly."
```

## Alt Text Structure Templates

### 1. Simple Image Template
```
"[Subject] [description of what is shown] [relevant context or function]"
```

### 2. Diagram Template
```
"[Diagram type] showing [main concept] with [key elements and their relationships]"
```

### 3. Chart Template
```
"[Chart type] showing [relationship between variables] with [key findings or trends]"
```

### 4. Process Template
```
"[Process name] diagram showing [steps] and [flow or relationships] from [start] to [end]"
```

## Implementation Examples

### 1. In Markdown (Standard)
```markdown
![Forward kinematics equation showing end-effector position calculation](/img/chapter-02/forward-kinematics-equation.png)
```

### 2. In Markdown with Figure
```markdown
<figure>
  <img src="/img/chapter-01/physical-ai-system.png" alt="Physical AI system diagram showing perception module receiving sensor inputs, reasoning module processing information, and action module controlling actuators in a feedback loop with the environment" />
  <figcaption>Figure 1.1: The Physical AI system architecture with its three core components interacting in a closed loop with the environment.</figcaption>
</figure>
```

### 3. In MDX Component
```jsx
import ResponsiveImage from '@site/src/components/ResponsiveImage';

<ResponsiveImage
  src="/img/chapter-02/humanoid-kinematics.png"
  alt="Humanoid robot kinematic chain diagram showing the 6-DOF arm with shoulder, elbow, and wrist joints. Joint angles θ1 through θ6 are labeled, with the end-effector coordinate frame shown at the hand position."
  caption="Figure 2.1: Kinematic structure of a humanoid robot arm showing joint configurations and degrees of freedom."
  size="full"
/>
```

## Accessibility Best Practices

### 1. Screen Reader Considerations
- **Be Specific**: Avoid vague terms like "the graph" or "this image"
- **Provide Context**: Explain how the image relates to the text
- **Use Proper Punctuation**: Help screen readers interpret the text correctly
- **Avoid Redundancy**: Don't repeat information already in the surrounding text

### 2. Contextual Adaptation
- **Content Level**: Adjust detail level based on student background
- **Section Relevance**: Focus on information relevant to the current topic
- **Learning Objective**: Align with what students should learn from the image

### 3. Technical Accuracy
- **Use Correct Terminology**: Employ appropriate technical vocabulary
- **Be Precise**: Accurately describe measurements, values, and relationships
- **Maintain Integrity**: Don't oversimplify complex concepts

## Alt Text for Different Difficulty Levels

### Beginner Level
```
Alt: "Simple robot with wheels and sensors. It has two big wheels in the back and a small wheel in the front for balance."
```

### Intermediate Level
```
Alt: "Differential drive robot platform with two independently controlled drive wheels and a caster wheel. The robot has front-facing ultrasonic sensor, side-mounted IR sensors, and top-mounted camera for environment perception."
```

### Advanced Level
```
Alt: "Omnidirectional mobile robot platform with three mecanum wheels arranged in triangular configuration, enabling holonomic motion. The integrated IMU provides orientation data, while the stereo camera pair enables depth perception for navigation and manipulation tasks."
```

## Common Mistakes to Avoid

### 1. Too Vague
- ❌ `"A robot diagram"`
- ✅ `"Diagram showing a humanoid robot with labeled joints including 6 DOF arms, 2 DOF legs, and 3 DOF torso"`

### 2. Too Detailed
- ❌ `"There is a blue robot with two eyes that are cameras and it has silver arms and black wheels and it is sitting on a gray floor..."`
- ✅ `"Humanoid service robot with stereoscopic cameras, manipulator arms, and mobile base for navigation"`

### 3. Irrelevant Information
- ❌ `"A colorful diagram with red arrows and blue boxes showing robot parts"`
- ✅ `"Robot system architecture diagram showing sensor fusion, planning, and control modules with data flow between components"`

### 4. Missing Function
- ❌ `"Arrow pointing to the next page"`
- ✅ `"Next section navigation arrow linking to Chapter 3: Control Systems"`

## Quality Assurance Checklist

### Before Publishing
- [ ] Alt text accurately describes the image content
- [ ] Alt text is concise (under 125 characters for simple images)
- [ ] Alt text provides context relevant to surrounding content
- [ ] Technical terms are accurate and appropriate for audience
- [ ] Alt text is not redundant with surrounding text
- [ ] Complex images have additional description in captions
- [ ] Decorative images have empty alt attributes
- [ ] Functional images describe their purpose

### Testing
- [ ] Test with screen reader software
- [ ] Verify alt text appears when images are disabled
- [ ] Check character count for conciseness
- [ ] Review for technical accuracy
- [ ] Ensure accessibility compliance with WCAG guidelines

## Tools and Resources

### Alt Text Generators
- Use AI tools for initial drafts but always review and refine
- Consider the specific educational context
- Verify technical accuracy of generated text

### Testing Tools
- Screen readers (NVDA, JAWS, VoiceOver)
- Accessibility checkers (WAVE, axe)
- Browser developer tools for alt text inspection

### Reference Materials
- WebAIM alt text guide
- WCAG 2.1 guidelines
- Academic accessibility standards

## Special Considerations for Robotics Content

### 1. Mathematical Notation
For images containing equations:
```
Alt: "Forward kinematics equation: T equals A1 of theta1 times A2 of theta2 up to An of thetan, where T is the transformation matrix, Ai represents the transformation matrix for joint i, and thetan is the angle of joint n."
```

### 2. Coordinate Systems
```
Alt: "3D coordinate system showing X axis in red pointing right, Y axis in green pointing up, Z axis in blue pointing toward viewer. Robot origin frame is positioned at the base with axes aligned as described."
```

### 3. Time-Varying Processes
```
Alt: "Gait cycle diagram showing four phases: double support, single support right leg, double support, single support left leg. Center of pressure moves from both feet to right foot to both feet to left foot over the 100% cycle."
```

This guide ensures that all visual materials in the textbook are fully accessible and provide equivalent information to users who cannot see images, while maintaining the educational value for all learners.