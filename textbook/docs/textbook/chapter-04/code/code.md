---
title: 'Chapter 4: Code Examples - AI-Driven Workflows and Tools'
description: 'Working code examples for AI integration in robotics including computer vision, machine learning, and VLA frameworks'
tags: [code-examples, ai, machine-learning, computer-vision, pytorch, tensorflow, vla]
---

# Code Examples: AI-Driven Workflows and Tools

This section provides practical code examples demonstrating AI integration in robotics workflows. Examples cover computer vision, machine learning for control, and modern AI frameworks for robotics.

## Example 1: Object Detection for Robotics

### Overview
This example demonstrates real-time object detection using a pre-trained model, essential for robotic perception tasks.

### Code: Object Detection Node (Python with PyTorch)

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from vision_msgs.msg import Detection2DArray, Detection2D, ObjectHypothesisWithPose
from cv_bridge import CvBridge
import cv2
import torch
import torchvision
from torchvision import transforms


class ObjectDetectionNode(Node):
    """
    ROS2 node for real-time object detection using PyTorch.

    Features:
    - Subscribe to camera images
    - Run object detection using pre-trained model
    - Publish detection results
    - Visualize detections (optional)
    """

    def __init__(self):
        super().__init__('object_detection_node')

        # Parameters
        self.confidence_threshold = 0.7
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Load pre-trained model
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn(
            pretrained=True
        )
        self.model.to(self.device)
        self.model.eval()

        # COCO class names
        self.class_names = [
            '__background__', 'person', 'bicycle', 'car', 'motorcycle',
            'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
            # ... (full COCO dataset labels)
        ]

        # CV Bridge for image conversion
        self.bridge = CvBridge()

        # Subscribers
        self.image_subscription = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            10
        )

        # Publishers
        self.detection_publisher = self.create_publisher(
            Detection2DArray,
            'detections',
            10
        )

        self.get_logger().info(
            f'Object detection node initialized. '
            f'Using device: {self.device}'
        )

    def image_callback(self, msg):
        """Process incoming camera images"""
        try:
            # Convert ROS Image to OpenCV format
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Run detection
            detections = self.detect_objects(cv_image)

            # Publish detections
            self.publish_detections(detections, msg.header)

            # Log detected objects
            detected_classes = [d['class_name'] for d in detections]
            if detected_classes:
                self.get_logger().info(
                    f'Detected: {", ".join(detected_classes)}'
                )

        except Exception as e:
            self.get_logger().error(f'Error processing image: {str(e)}')

    def detect_objects(self, image):
        """Run object detection on image"""
        # Preprocess image
        transform = transforms.Compose([
            transforms.ToTensor(),
        ])

        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        input_tensor = transform(image_rgb).unsqueeze(0).to(self.device)

        # Run inference
        with torch.no_grad():
            predictions = self.model(input_tensor)

        # Process predictions
        detections = []
        for i in range(len(predictions[0]['boxes'])):
            score = predictions[0]['scores'][i].item()

            if score >= self.confidence_threshold:
                box = predictions[0]['boxes'][i].cpu().numpy()
                label = predictions[0]['labels'][i].item()

                detections.append({
                    'bbox': box,
                    'class_id': label,
                    'class_name': self.class_names[label],
                    'confidence': score
                })

        return detections

    def publish_detections(self, detections, header):
        """Publish detection results as ROS message"""
        detection_array = Detection2DArray()
        detection_array.header = header

        for det in detections:
            detection_msg = Detection2D()

            # Set bounding box
            detection_msg.bbox.center.x = float((det['bbox'][0] + det['bbox'][2]) / 2)
            detection_msg.bbox.center.y = float((det['bbox'][1] + det['bbox'][3]) / 2)
            detection_msg.bbox.size_x = float(det['bbox'][2] - det['bbox'][0])
            detection_msg.bbox.size_y = float(det['bbox'][3] - det['bbox'][1])

            # Set hypothesis
            hypothesis = ObjectHypothesisWithPose()
            hypothesis.hypothesis.class_id = str(det['class_id'])
            hypothesis.hypothesis.score = det['confidence']

            detection_msg.results.append(hypothesis)
            detection_array.detections.append(detection_msg)

        self.detection_publisher.publish(detection_array)


def main(args=None):
    rclpy.init(args=args)
    detection_node = ObjectDetectionNode()

    try:
        rclpy.spin(detection_node)
    except KeyboardInterrupt:
        pass

    detection_node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Example 2: Simple Reinforcement Learning for Robot Control

### Overview
This example demonstrates a basic Q-learning implementation for teaching a robot to navigate to a goal.

### Code: Q-Learning Navigator (Python with NumPy)

```python
import numpy as np
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Pose2D
from std_msgs.msg import Bool


class QLearningNavigator(Node):
    """
    Simple Q-learning agent for robot navigation.

    Demonstrates:
    - Reinforcement learning basics
    - State discretization
    - Q-table updates
    - Exploration vs exploitation
    """

    def __init__(self):
        super().__init__('qlearning_navigator')

        # Q-learning parameters
        self.alpha = 0.1  # Learning rate
        self.gamma = 0.9  # Discount factor
        self.epsilon = 0.2  # Exploration rate

        # State space (discretized position)
        self.grid_size = 10
        self.state_space = (self.grid_size, self.grid_size)

        # Action space: [forward, backward, turn_left, turn_right, stop]
        self.actions = ['forward', 'backward', 'left', 'right', 'stop']
        self.action_space = len(self.actions)

        # Q-table: state -> action values
        self.q_table = np.zeros((*self.state_space, self.action_space))

        # Current state
        self.current_state = (0, 0)
        self.goal_state = (9, 9)
        self.obstacle_detected = False

        # Publishers
        self.cmd_vel_publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        # Subscribers
        self.pose_subscription = self.create_subscription(
            Pose2D,
            'robot_pose',
            self.pose_callback,
            10
        )

        self.obstacle_subscription = self.create_subscription(
            Bool,
            'obstacle_detected',
            self.obstacle_callback,
            10
        )

        # Control loop timer
        self.timer = self.create_timer(0.5, self.control_loop)

        self.get_logger().info('Q-learning navigator initialized')

    def pose_callback(self, msg):
        """Update current state from robot pose"""
        # Discretize continuous position to grid cell
        x_cell = int(msg.x * self.grid_size)
        y_cell = int(msg.y * self.grid_size)

        # Clip to valid range
        x_cell = np.clip(x_cell, 0, self.grid_size - 1)
        y_cell = np.clip(y_cell, 0, self.grid_size - 1)

        old_state = self.current_state
        self.current_state = (x_cell, y_cell)

        # Update Q-table if state changed
        if old_state != self.current_state:
            self.update_q_table(old_state, self.current_state)

    def obstacle_callback(self, msg):
        """Update obstacle detection state"""
        self.obstacle_detected = msg.data

    def select_action(self, state):
        """Choose action using epsilon-greedy policy"""
        if np.random.random() < self.epsilon:
            # Explore: random action
            action_idx = np.random.randint(0, self.action_space)
        else:
            # Exploit: best known action
            action_idx = np.argmax(self.q_table[state])

        return action_idx

    def get_reward(self, state):
        """Calculate reward for current state"""
        if state == self.goal_state:
            return 100.0  # Reached goal
        elif self.obstacle_detected:
            return -10.0  # Hit obstacle
        else:
            # Negative reward proportional to distance from goal
            distance = abs(state[0] - self.goal_state[0]) + \
                      abs(state[1] - self.goal_state[1])
            return -distance * 0.1

    def update_q_table(self, old_state, new_state):
        """Update Q-value using Q-learning update rule"""
        # Get reward for transitioning to new state
        reward = self.get_reward(new_state)

        # Q-learning update
        old_q = self.q_table[old_state + (self.last_action,)]
        max_future_q = np.max(self.q_table[new_state])

        new_q = old_q + self.alpha * (
            reward + self.gamma * max_future_q - old_q
        )

        self.q_table[old_state + (self.last_action,)] = new_q

    def execute_action(self, action_idx):
        """Convert action index to velocity command"""
        cmd_vel = Twist()

        action = self.actions[action_idx]

        if action == 'forward':
            cmd_vel.linear.x = 0.2
        elif action == 'backward':
            cmd_vel.linear.x = -0.2
        elif action == 'left':
            cmd_vel.angular.z = 0.5
        elif action == 'right':
            cmd_vel.angular.z = -0.5
        elif action == 'stop':
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.0

        self.cmd_vel_publisher.publish(cmd_vel)
        self.last_action = action_idx

    def control_loop(self):
        """Main control loop"""
        # Check if goal reached
        if self.current_state == self.goal_state:
            self.get_logger().info('GOAL REACHED!')
            # Stop robot
            self.execute_action(self.actions.index('stop'))
            return

        # Select and execute action
        action_idx = self.select_action(self.current_state)
        self.execute_action(action_idx)

        self.get_logger().info(
            f'State: {self.current_state}, '
            f'Action: {self.actions[action_idx]}, '
            f'Q-value: {self.q_table[self.current_state + (action_idx,)]:.2f}'
        )


def main(args=None):
    rclpy.init(args=args)
    navigator = QLearningNavigator()

    try:
        rclpy.spin(navigator)
    except KeyboardInterrupt:
        # Stop robot
        stop_cmd = Twist()
        navigator.cmd_vel_publisher.publish(stop_cmd)

    navigator.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Example 3: Integration with Vision-Language-Action (VLA) Models

### Overview
This example shows how to integrate modern VLA models for high-level task planning.

### Code: VLA Task Planner (Conceptual Example)

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped


class VLATaskPlanner(Node):
    """
    Conceptual integration with Vision-Language-Action models.

    Note: This is a simplified example. Real VLA integration requires
    specific model APIs (e.g., RT-1, OpenVLA, etc.)

    Demonstrates:
    - Natural language task specification
    - Vision-language understanding
    - Action sequence generation
    """

    def __init__(self):
        super().__init__('vla_task_planner')

        # Task state
        self.current_task = None
        self.action_sequence = []

        # Publishers
        self.action_publisher = self.create_publisher(
            PoseStamped,
            'planned_action',
            10
        )

        # Subscribers
        self.task_subscription = self.create_subscription(
            String,
            'task_description',
            self.task_callback,
            10
        )

        self.get_logger().info('VLA task planner initialized')

    def task_callback(self, msg):
        """Process natural language task description"""
        task_description = msg.data
        self.get_logger().info(f'Received task: {task_description}')

        # Generate action sequence from task
        self.action_sequence = self.plan_from_language(task_description)

        # Execute actions
        self.execute_plan()

    def plan_from_language(self, task_description):
        """
        Simplified task planning from language.

        In production, this would call a VLA model API:
        - Input: Natural language task + visual context
        - Output: Sequence of robot actions
        """
        # Example: Simple keyword-based planning (replace with VLA model)
        actions = []

        if 'pick up' in task_description.lower():
            actions.append({'type': 'move_to', 'target': 'object'})
            actions.append({'type': 'grasp', 'target': 'object'})
        elif 'move to' in task_description.lower():
            # Extract location from task description
            actions.append({'type': 'navigate', 'target': 'location'})
        elif 'place' in task_description.lower():
            actions.append({'type': 'move_to', 'target': 'destination'})
            actions.append({'type': 'release', 'target': 'object'})

        self.get_logger().info(
            f'Generated {len(actions)} actions from task description'
        )

        return actions

    def execute_plan(self):
        """Execute planned action sequence"""
        for action in self.action_sequence:
            self.get_logger().info(f'Executing: {action["type"]}')

            # Convert action to robot command
            pose_msg = self.action_to_pose(action)

            # Publish action
            if pose_msg:
                self.action_publisher.publish(pose_msg)

    def action_to_pose(self, action):
        """Convert high-level action to robot pose command"""
        pose = PoseStamped()
        pose.header.frame_id = 'base_link'

        # Simplified action-to-pose mapping
        # In production, this would use proper motion planning

        if action['type'] == 'move_to':
            pose.pose.position.x = 1.0  # Example position
            pose.pose.position.y = 0.0
            pose.pose.position.z = 0.5
        elif action['type'] == 'grasp':
            pose.pose.position.x = 0.3
            pose.pose.position.y = 0.0
            pose.pose.position.z = 0.2
        # ... other action types

        return pose


def main(args=None):
    rclpy.init(args=args)
    planner = VLATaskPlanner()

    try:
        rclpy.spin(planner)
    except KeyboardInterrupt:
        pass

    planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Example Task Commands

```bash
# Terminal 1: Run the VLA planner
ros2 run my_package vla_planner

# Terminal 2: Send task commands
ros2 topic pub /task_description std_msgs/String "data: 'pick up the red cube'"
ros2 topic pub /task_description std_msgs/String "data: 'move to the charging station'"
```

---

## Key Takeaways

1. **Computer Vision**: Pre-trained models (PyTorch/TensorFlow) enable robust object detection
2. **Reinforcement Learning**: Q-learning provides a foundation for learning-based control
3. **VLA Integration**: Modern AI models can understand natural language tasks and generate action sequences
4. **ROS2 Integration**: All AI components integrate seamlessly with ROS2 architecture
5. **Real-time Performance**: Consider computational requirements when deploying AI models on robots

## Next Steps

- Experiment with different object detection models (YOLO, SSD, etc.)
- Implement deep Q-learning (DQN) for better performance
- Explore actual VLA model APIs (RT-1, OpenVLA, PaLM-E)
- Add GPU acceleration for vision tasks
- Integrate with Isaac Sim or Gazebo for testing

## Additional Resources

- [PyTorch Robotics](https://pytorch.org/tutorials/intermediate/reinforcement_q_learning.html)
- [OpenVLA Documentation](https://openvla.github.io/)
- [Nvidia Isaac Sim](https://developer.nvidia.com/isaac-sim)
- [ROS2 + AI Integration Guide](https://github.com/ros-ai)
