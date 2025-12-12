---
title: 'MDX Integration Examples'
description: 'Examples of how to integrate visual materials with Docusaurus MDX components in the robotics textbook'
---

# MDX Integration Examples

## Overview

This document provides practical examples of how to integrate the visual materials components with Docusaurus MDX (Markdown + JSX) in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics.

## Importing Components

First, import the visual components at the top of your MDX file:

```mdx
import {
  TextbookFigure,
  FigureReference,
  OptimizedImage,
  AccessibleFigure,
  KinematicsExplorer
} from '@site/src/components/mdx/MDXVisualComponents';
```

## Using Textbook Figures

### Basic Figure

```mdx
<TextbookFigure
  id="1.1"
  src="/img/chapter-01/robotic-arm.png"
  alt="A diagram showing a robotic arm with labeled joints and links"
  title="Robotic Arm Diagram"
  caption="A typical 6-DOF robotic manipulator with joint labels and coordinate frames."
  size="large"
/>
```

### Accessible Figure

```mdx
<AccessibleFigure
  id="1.2"
  src="/img/chapter-01/sensor-fusion.png"
  alt="Diagram showing how multiple sensors feed data into a central processing unit"
  title="Sensor Fusion Architecture"
  caption="Multiple sensors providing data to a central processing system for environmental perception."
  enableZoom={true}
  elements={[
    { id: 'camera', name: 'Camera', label: 'Camera sensor', description: 'Visual sensor providing RGB data' },
    { id: 'lidar', name: 'LiDAR', label: 'LiDAR sensor', description: 'Laser sensor providing 3D point cloud data' },
    { id: 'imu', name: 'IMU', label: 'Inertial Measurement Unit', description: 'Sensor providing orientation and acceleration data' }
  ]}
/>
```

## Using Optimized Images

### Basic Optimized Image

```mdx
<OptimizedImage
  src="/img/chapter-01/control-system.png"
  alt="Block diagram of a feedback control system with controller, plant, and sensor"
  caption="Feedback control system architecture with error calculation and correction."
  size="medium"
  priority={true}
/>
```

### Image with Custom Placeholder

```mdx
<OptimizedImage
  src="/img/chapter-01/path-planning.png"
  alt="Top-down view showing a robot navigating around obstacles to reach a goal"
  caption="Path planning algorithm finding optimal route around obstacles."
  size="large"
  placeholderType="blur"
  placeholderColor="#f0f0f0"
/>
```

## Using Interactive Components

### Kinematics Explorer

```mdx
<KinematicsExplorer />
```

This creates an interactive 2-DOF manipulator kinematics explorer where students can adjust joint angles and link lengths to visualize forward kinematics.

## Creating Figure References

### Referencing Figures

```mdx
As shown in <FigureReference id="1.1" title="Robotic Arm Diagram" />, the joint configuration is critical for determining the workspace.
```

### Cross-Chapter References

```mdx
The control system described in <FigureReference id="2.3" label="Diagram" /> builds upon the sensor architecture shown in <FigureReference id="1.2" />.
```

## Complete Example

Here's a complete example of an MDX file using multiple visual components:

```mdx
---
title: 'Chapter 1: Introduction to Robotics'
description: 'Fundamental concepts in robotics including kinematics, dynamics, and control'
---

import {
  TextbookFigure,
  FigureReference,
  OptimizedImage,
  AccessibleFigure,
  KinematicsExplorer
} from '@site/src/components/mdx/MDXVisualComponents';

# Chapter 1: Introduction to Robotics

## Robot Architecture

A typical robotic system consists of several interconnected components that work together to perform tasks in the physical world. The fundamental architecture includes perception, reasoning, and action modules as shown in <FigureReference id="1.1" />.

<TextbookFigure
  id="1.1"
  src="/img/chapter-01/robot-architecture.png"
  alt="System diagram showing perception, reasoning, and action modules connected in a loop"
  title="Robot System Architecture"
  caption="The fundamental architecture of a robotic system with perception, reasoning, and action modules interacting with the environment."
  size="large"
/>

## Kinematics Fundamentals

Kinematics is the study of motion without considering the forces that cause it. In robotics, kinematics describes the relationship between joint angles and the position and orientation of the end-effector.

<OptimizedImage
  src="/img/chapter-01/kinematics-diagram.png"
  alt="Diagram showing a 2-DOF planar manipulator with joint angles theta1 and theta2"
  caption="A 2-degree-of-freedom planar manipulator illustrating forward kinematics."
  size="medium"
/>

### Interactive Exploration

Use the interactive kinematics explorer below to understand how joint angles affect the end-effector position:

<KinematicsExplorer />

## Sensor Systems

Robots rely on various sensors to perceive their environment and their own state. Common sensor types include cameras, LiDAR, IMUs, and force/torque sensors.

<AccessibleFigure
  id="1.2"
  src="/img/chapter-01/sensor-systems.png"
  alt="Diagram showing different types of sensors on a mobile robot platform"
  title="Robot Sensor Systems"
  caption="Common sensor types used in robotics including visual, range, inertial, and force sensors."
  enableZoom={true}
  elements={[
    { id: 'camera', name: 'Camera', label: 'Camera', description: 'Visual sensor for image capture and computer vision' },
    { id: 'lidar', name: 'LiDAR', label: 'LiDAR', description: 'Laser range finder for 3D mapping' },
    { id: 'imu', name: 'IMU', label: 'IMU', description: 'Inertial measurement unit for orientation' },
    { id: 'force', name: 'Force/Torque', label: 'Force Sensor', description: 'Sensor for measuring applied forces' }
  ]}
/>
```

## Advanced Features

### Responsive Images with srcSet

For better performance across different devices, use the `srcSet` and `sizes` properties:

```mdx
<OptimizedImage
  src="/img/chapter-01/example-800w.png"
  srcSet="/img/chapter-01/example-400w.png 400w,
          /img/chapter-01/example-800w.png 800w,
          /img/chapter-01/example-1200w.png 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive image example"
  caption="Example of a responsive image that adapts to different screen sizes."
  size="large"
/>
```

### WebP Support

The optimized image component automatically serves WebP images to browsers that support them:

```mdx
<OptimizedImage
  src="/img/chapter-01/example.jpg"
  webpSrcSet="/img/chapter-01/example-400w.webp 400w,
               /img/chapter-01/example-800w.webp 800w,
               /img/chapter-01/example-1200w.webp 1200w"
  srcSet="/img/chapter-01/example-400w.jpg 400w,
          /img/chapter-01/example-800w.jpg 800w,
          /img/chapter-01/example-1200w.jpg 1200w"
  alt="Image with WebP support"
  caption="Image that uses WebP format for better compression when supported."
/>
```

## Best Practices

1. **Always provide meaningful alt text** that describes the image content and function
2. **Use appropriate figure IDs** that follow a consistent numbering scheme
3. **Include descriptive captions** that explain the image's relevance to the content
4. **Use appropriate image sizes** to balance quality with loading performance
5. **Enable accessibility features** like zoom and skip links when appropriate
6. **Use lazy loading** for images below the fold to improve initial page load
7. **Consider responsive design** with appropriate srcSet and sizes attributes

## Accessibility Considerations

- All visual components include proper ARIA labels and descriptions
- Skip links are available for users navigating with keyboards
- Zoom functionality is provided for users who need larger images
- Alt text toggle allows users to view the alternative text
- High contrast mode is supported and respects user system preferences

These MDX components provide a comprehensive solution for integrating visual materials into the robotics textbook while maintaining accessibility, performance, and usability standards.