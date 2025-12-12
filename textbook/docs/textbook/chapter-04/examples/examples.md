---
title: 'Chapter 4: AI-Driven Workflows and Tools - Examples'
description: 'Real-world examples and implementations of AI integration in robotics development'
tags: [ai-integration, robotics-tools, machine-learning, ai-workflows, robotics-development]
---

# Chapter 4: AI-Driven Workflows and Tools - Examples

## Example 1: Machine Learning Pipeline for Robotic Perception

Implementing machine learning for robotic perception requires a complete pipeline from data collection to deployment. This example demonstrates a complete object detection system for robotics applications.

### Complete Perception Pipeline

```python
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import cv2
import numpy as np
from typing import List, Tuple, Dict
import os
from PIL import Image

class RoboticPerceptionPipeline:
    def __init__(self, model_path: str = None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self._build_model()
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])

        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))

        self.model.to(self.device)
        self.model.eval()

        # Class labels for robotics objects
        self.class_labels = [
            'obstacle', 'person', 'robot', 'wall', 'floor', 'table',
            'chair', 'door', 'window', 'electronics'
        ]

    def _build_model(self):
        """Build a CNN model for object classification"""
        return nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((7, 7)),
            nn.Flatten(),
            nn.Linear(128 * 7 * 7, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, len(self.class_labels))
        )

    def preprocess_image(self, image: np.ndarray) -> torch.Tensor:
        """Preprocess image for model input"""
        # Convert BGR to RGB (OpenCV uses BGR)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        # Convert to PIL Image
        pil_image = Image.fromarray(image_rgb)
        # Apply transforms
        tensor_image = self.transform(pil_image)
        # Add batch dimension
        return tensor_image.unsqueeze(0)

    def detect_objects(self, image: np.ndarray) -> List[Dict]:
        """Detect objects in the image and return results"""
        # Preprocess image
        input_tensor = self.preprocess_image(image).to(self.device)

        # Run inference
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)

        # Format results
        results = []
        for i in range(len(predicted)):
            class_idx = predicted[i].item()
            conf = confidence[i].item()

            result = {
                'class': self.class_labels[class_idx],
                'confidence': conf,
                'bbox': None  # Would include bounding box if using object detection model
            }
            results.append(result)

        return results

    def process_robot_camera_feed(self, camera_image: np.ndarray) -> Dict:
        """Process camera feed from robot and return perception results"""
        # Detect objects
        detections = self.detect_objects(camera_image)

        # Filter detections by confidence threshold
        confident_detections = [d for d in detections if d['confidence'] > 0.5]

        # Group by class for robot decision making
        perception_result = {
            'timestamp': np.datetime64('now'),
            'detections': confident_detections,
            'object_counts': self._count_objects(confident_detections),
            'navigation_hazards': self._identify_hazards(confident_detections)
        }

        return perception_result

    def _count_objects(self, detections: List[Dict]) -> Dict[str, int]:
        """Count objects by class"""
        counts = {}
        for detection in detections:
            class_name = detection['class']
            counts[class_name] = counts.get(class_name, 0) + 1
        return counts

    def _identify_hazards(self, detections: List[Dict]) -> List[Dict]:
        """Identify potential navigation hazards"""
        hazards = []
        for detection in detections:
            if detection['class'] in ['person', 'obstacle', 'wall']:
                hazards.append(detection)
        return hazards

# Example usage
def example_perception_pipeline():
    """Example of using the perception pipeline with simulated robot data"""
    # Initialize the perception system
    perception_system = RoboticPerceptionPipeline()

    # Simulate a camera image (in practice, this would come from robot's camera)
    # Create a simulated image for testing
    simulated_image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)

    # Add some simulated objects (for demonstration)
    cv2.rectangle(simulated_image, (100, 100), (200, 200), (255, 0, 0), -1)  # Blue rectangle
    cv2.circle(simulated_image, (300, 300), 50, (0, 255, 0), -1)  # Green circle

    # Process the image
    result = perception_system.process_robot_camera_feed(simulated_image)

    print("Perception Results:")
    print(f"Timestamp: {result['timestamp']}")
    print(f"Detected Objects: {result['detections']}")
    print(f"Object Counts: {result['object_counts']}")
    print(f"Navigation Hazards: {result['navigation_hazards']}")

if __name__ == "__main__":
    example_perception_pipeline()
```

## Example 2: Reinforcement Learning for Robot Navigation

This example demonstrates how to implement reinforcement learning for robot navigation in dynamic environments.

### Q-Learning Navigation System

```python
import numpy as np
import random
from typing import Tuple, List, Optional
import matplotlib.pyplot as plt

class RobotNavigationEnvironment:
    def __init__(self, width: int = 10, height: int = 10):
        self.width = width
        self.height = height
        self.state_space = width * height
        self.action_space = 4  # Up, Down, Left, Right
        self.actions = {
            0: (-1, 0),  # Up
            1: (1, 0),   # Down
            2: (0, -1),  # Left
            3: (0, 1)    # Right
        }

        # Initialize environment
        self.reset()

    def reset(self):
        """Reset environment to initial state"""
        self.grid = np.zeros((self.width, self.height))
        self.robot_pos = (0, 0)  # Start at top-left
        self.goal_pos = (self.width-1, self.height-1)  # Goal at bottom-right
        self.obstacles = [(2, 2), (3, 3), (4, 4)]  # Add some obstacles

        # Place obstacles
        for obs in self.obstacles:
            self.grid[obs] = -1  # -1 represents obstacle

        self.grid[self.goal_pos] = 2  # 2 represents goal

    def state_to_index(self, pos: Tuple[int, int]) -> int:
        """Convert 2D position to 1D state index"""
        return pos[0] * self.height + pos[1]

    def index_to_state(self, index: int) -> Tuple[int, int]:
        """Convert 1D state index to 2D position"""
        return (index // self.height, index % self.height)

    def is_valid_position(self, pos: Tuple[int, int]) -> bool:
        """Check if position is within bounds and not an obstacle"""
        x, y = pos
        if 0 <= x < self.width and 0 <= y < self.height:
            return self.grid[x, y] != -1  # Not an obstacle
        return False

    def step(self, action: int) -> Tuple[int, float, bool]:
        """Execute action and return (new_state, reward, done)"""
        # Calculate new position
        dx, dy = self.actions[action]
        new_x = self.robot_pos[0] + dx
        new_y = self.robot_pos[1] + dy
        new_pos = (new_x, new_y)

        # Check if new position is valid
        if self.is_valid_position(new_pos):
            self.robot_pos = new_pos

        # Calculate reward
        reward = -0.1  # Small negative reward for each step (encourage efficiency)

        if self.robot_pos == self.goal_pos:
            reward = 10.0  # Large positive reward for reaching goal
            done = True
        elif self.grid[self.robot_pos[0], self.robot_pos[1]] == -1:
            reward = -5.0  # Penalty for hitting obstacle
            done = True
        else:
            done = False

        new_state = self.state_to_index(self.robot_pos)
        return new_state, reward, done

    def get_current_state(self) -> int:
        """Get current state index"""
        return self.state_to_index(self.robot_pos)

class QLearningNavigationAgent:
    def __init__(self, state_space: int, action_space: int,
                 learning_rate: float = 0.1, discount: float = 0.95,
                 epsilon: float = 1.0, epsilon_decay: float = 0.995,
                 epsilon_min: float = 0.01):
        self.state_space = state_space
        self.action_space = action_space
        self.learning_rate = learning_rate
        self.discount = discount
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min

        # Initialize Q-table
        self.q_table = np.zeros((state_space, action_space))

    def choose_action(self, state: int) -> int:
        """Choose action using epsilon-greedy policy"""
        if random.random() < self.epsilon:
            # Explore: random action
            return random.randint(0, self.action_space - 1)
        else:
            # Exploit: best known action
            return int(np.argmax(self.q_table[state]))

    def update_q_value(self, state: int, action: int, reward: float,
                      next_state: int, done: bool):
        """Update Q-value using Q-learning formula"""
        if done:
            target = reward
        else:
            target = reward + self.discount * np.max(self.q_table[next_state])

        # Q-learning update
        self.q_table[state, action] += self.learning_rate * (
            target - self.q_table[state, action]
        )

    def decay_epsilon(self):
        """Decay exploration rate"""
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

class NavigationTrainer:
    def __init__(self, env: RobotNavigationEnvironment, agent: QLearningNavigationAgent):
        self.env = env
        self.agent = agent
        self.training_history = []

    def train(self, episodes: int = 1000) -> List[float]:
        """Train the agent for specified number of episodes"""
        episode_rewards = []

        for episode in range(episodes):
            self.env.reset()
            state = self.env.get_current_state()
            total_reward = 0
            steps = 0
            max_steps = 200  # Prevent infinite episodes

            while steps < max_steps:
                # Choose and take action
                action = self.agent.choose_action(state)
                next_state, reward, done = self.env.step(action)

                # Update Q-value
                self.agent.update_q_value(state, action, reward, next_state, done)

                total_reward += reward
                state = next_state
                steps += 1

                if done:
                    break

            # Decay exploration rate
            self.agent.decay_epsilon()

            episode_rewards.append(total_reward)

            # Print progress
            if episode % 100 == 0:
                avg_reward = np.mean(episode_rewards[-100:]) if episode >= 100 else np.mean(episode_rewards)
                print(f"Episode {episode}, Average Reward: {avg_reward:.2f}, Epsilon: {self.agent.epsilon:.3f}")

        return episode_rewards

    def test_agent(self, num_tests: int = 10) -> List[int]:
        """Test the trained agent"""
        self.agent.epsilon = 0  # No exploration during testing
        test_results = []

        for _ in range(num_tests):
            self.env.reset()
            state = self.env.get_current_state()
            steps = 0
            max_steps = 200

            while steps < max_steps:
                # Always choose best action during testing
                action = int(np.argmax(self.agent.q_table[state]))
                state, _, done = self.env.step(action)
                steps += 1

                if done:
                    if self.env.robot_pos == self.env.goal_pos:
                        test_results.append(steps)  # Record successful path length
                    else:
                        test_results.append(-1)  # Failed to reach goal
                    break

            if steps >= max_steps:
                test_results.append(-1)  # Failed to reach goal within step limit

        return test_results

# Example usage
def example_navigation_training():
    """Example of training a robot to navigate using reinforcement learning"""
    # Create environment and agent
    env = RobotNavigationEnvironment(width=8, height=8)
    agent = QLearningNavigationAgent(
        state_space=env.state_space,
        action_space=env.action_space
    )

    # Train the agent
    trainer = NavigationTrainer(env, agent)
    print("Training robot navigation agent...")
    rewards = trainer.train(episodes=2000)

    # Test the trained agent
    print("\nTesting trained agent...")
    test_results = trainer.test_agent(num_tests=20)

    successful_paths = [r for r in test_results if r > 0]
    success_rate = len(successful_paths) / len(test_results)
    avg_path_length = np.mean(successful_paths) if successful_paths else float('inf')

    print(f"Success Rate: {success_rate:.2%}")
    print(f"Average Path Length (successful runs): {avg_path_length:.2f}")

    # Plot training progress
    plt.figure(figsize=(12, 4))

    plt.subplot(1, 2, 1)
    plt.plot(rewards)
    plt.title('Training Rewards Over Time')
    plt.xlabel('Episode')
    plt.ylabel('Total Reward')

    plt.subplot(1, 2, 2)
    plt.plot(np.convolve(rewards, np.ones(50)/50, mode='valid'))
    plt.title('Smoothed Training Rewards')
    plt.xlabel('Episode')
    plt.ylabel('Average Reward (50-episode window)')

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    example_navigation_training()
```

## Example 3: Computer Vision for Robotic Manipulation

This example demonstrates how computer vision can be integrated with robotic manipulation to identify and grasp objects.

### Vision-Guided Manipulation System

```python
import cv2
import numpy as np
from typing import Tuple, List, Optional
import math

class VisionGuidedManipulation:
    def __init__(self):
        # Initialize ORB detector for feature matching
        self.orb = cv2.ORB_create()
        self.bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

        # Initialize camera parameters (these would come from camera calibration)
        self.camera_matrix = np.array([[500, 0, 320], [0, 500, 240], [0, 0, 1]])
        self.dist_coeffs = np.zeros((4, 1))

        # Store known objects with their features
        self.known_objects = {}

    def register_object(self, name: str, image: np.ndarray):
        """Register an object with the system by storing its features"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        kp, des = self.orb.detectAndCompute(gray, None)

        if des is not None:
            self.known_objects[name] = {
                'keypoints': kp,
                'descriptors': des,
                'image': image
            }
            print(f"Registered object: {name}")
        else:
            print(f"Could not detect features for object: {name}")

    def detect_object_in_scene(self, scene_image: np.ndarray) -> List[Dict]:
        """Detect known objects in the scene image"""
        gray_scene = cv2.cvtColor(scene_image, cv2.COLOR_BGR2GRAY)
        kp_scene, des_scene = self.orb.detectAndCompute(gray_scene, None)

        if des_scene is None:
            return []

        detections = []

        for obj_name, obj_data in self.known_objects.items():
            if obj_data['descriptors'] is None:
                continue

            # Match features between scene and known object
            matches = self.bf.match(obj_data['descriptors'], des_scene)

            # Sort matches by distance (best matches first)
            matches = sorted(matches, key=lambda x: x.distance)

            # Filter good matches (adjust threshold as needed)
            good_matches = [m for m in matches if m.distance < 50]

            if len(good_matches) >= 10:  # Require minimum number of good matches
                # Get coordinates of matched points
                src_pts = np.float32([obj_data['keypoints'][m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
                dst_pts = np.float32([kp_scene[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

                # Find homography to get object pose
                if len(src_pts) >= 4:
                    homography, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

                    if homography is not None:
                        # Get object corners in the reference image
                        h, w = obj_data['image'].shape[:2]
                        corners = np.float32([[0, 0], [w, 0], [w, h], [0, h]]).reshape(-1, 1, 2)

                        # Transform corners to scene coordinates
                        transformed_corners = cv2.perspectiveTransform(corners, homography)

                        # Calculate center of object
                        center_x = int(np.mean(transformed_corners[:, 0, 0]))
                        center_y = int(np.mean(transformed_corners[:, 0, 1]))

                        # Calculate object size
                        width = int(np.max(transformed_corners[:, 0, 0]) - np.min(transformed_corners[:, 0, 0]))
                        height = int(np.max(transformed_corners[:, 0, 1]) - np.min(transformed_corners[:, 0, 1]))

                        detection = {
                            'object_name': obj_name,
                            'bbox': (center_x - width//2, center_y - height//2, width, height),
                            'center': (center_x, center_y),
                            'confidence': len(good_matches) / len(matches) if matches else 0,
                            'match_count': len(good_matches)
                        }
                        detections.append(detection)

        return detections

    def calculate_grasp_point(self, detection: Dict) -> Tuple[int, int]:
        """Calculate optimal grasp point for an object"""
        center_x, center_y = detection['center']

        # For now, return center point
        # In a real system, this would consider object shape, orientation, etc.
        return (center_x, center_y)

    def overlay_detections(self, image: np.ndarray, detections: List[Dict]) -> np.ndarray:
        """Overlay detection results on the image"""
        output_image = image.copy()

        for detection in detections:
            x, y, w, h = detection['bbox']

            # Draw bounding box
            cv2.rectangle(output_image, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Draw center point
            center_x, center_y = detection['center']
            cv2.circle(output_image, (center_x, center_y), 5, (0, 0, 255), -1)

            # Draw label
            label = f"{detection['object_name']}: {detection['confidence']:.2f}"
            cv2.putText(output_image, label, (x, y - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        return output_image

class RoboticArmController:
    def __init__(self):
        # Simulate robotic arm with basic kinematics
        self.arm_position = (0, 0, 0)  # x, y, z
        self.gripper_open = True

    def move_to_position(self, x: float, y: float, z: float = 0.5):
        """Move arm to specified position"""
        print(f"Moving arm to position: ({x:.2f}, {y:.2f}, {z:.2f})")
        self.arm_position = (x, y, z)

    def open_gripper(self):
        """Open the gripper"""
        print("Opening gripper")
        self.gripper_open = True

    def close_gripper(self):
        """Close the gripper"""
        print("Closing gripper")
        self.gripper_open = False

    def approach_object(self, pixel_coords: Tuple[int, int], image_shape: Tuple[int, int]):
        """Convert pixel coordinates to real-world coordinates and approach"""
        # Convert pixel coordinates to normalized coordinates
        img_h, img_w = image_shape[:2]
        norm_x = (pixel_coords[0] - img_w/2) / (img_w/2)  # -1 to 1
        norm_y = (pixel_coords[1] - img_h/2) / (img_h/2)  # -1 to 1

        # Convert to real-world coordinates (simplified mapping)
        # In a real system, you'd use camera calibration and depth information
        world_x = norm_x * 0.5  # Scale to 1m range
        world_y = -norm_y * 0.5  # Flip Y axis and scale

        # Move arm to approach object
        self.move_to_position(world_x, world_y, z=0.3)

        return (world_x, world_y)

class VisionManipulationSystem:
    def __init__(self):
        self.vision_system = VisionGuidedManipulation()
        self.arm_controller = RoboticArmController()
        self.objects_to_grasp = []

    def add_object_to_grasp(self, name: str, image: np.ndarray):
        """Add an object that the system should be able to grasp"""
        self.vision_system.register_object(name, image)

    def process_scene_and_grasp(self, scene_image: np.ndarray) -> bool:
        """Process scene image and attempt to grasp detected objects"""
        # Detect objects in scene
        detections = self.vision_system.detect_object_in_scene(scene_image)

        if not detections:
            print("No objects detected in scene")
            return False

        print(f"Detected {len(detections)} objects")

        # Show detections
        output_image = self.vision_system.overlay_detections(scene_image, detections)
        cv2.imshow('Object Detections', output_image)
        cv2.waitKey(1)  # Briefly show the image

        # Try to grasp the first detected object
        detection = detections[0]  # In practice, you might prioritize by size, confidence, etc.

        print(f"Attempting to grasp {detection['object_name']}")

        # Calculate grasp point
        grasp_point = self.vision_system.calculate_grasp_point(detection)

        # Convert pixel coordinates to world coordinates and approach
        world_coords = self.arm_controller.approach_object(grasp_point, scene_image.shape)

        # Lower arm to object
        current_z = self.arm_controller.arm_position[2]
        self.arm_controller.move_to_position(
            world_coords[0],
            world_coords[1],
            z=current_z - 0.15  # Lower by 15cm to grasp
        )

        # Close gripper to grasp
        self.arm_controller.close_gripper()

        # Lift object
        self.arm_controller.move_to_position(
            world_coords[0],
            world_coords[1],
            z=0.5  # Lift to safe height
        )

        print(f"Successfully grasped {detection['object_name']}")
        return True

# Example usage
def example_vision_guided_manipulation():
    """Example of vision-guided manipulation system"""
    # Create the vision manipulation system
    manipulation_system = VisionManipulationSystem()

    # Register some objects (in practice, these would be images of real objects)
    # For this example, we'll create simple colored rectangles as "objects"
    red_block = np.zeros((100, 100, 3), dtype=np.uint8)
    red_block[:, :] = [0, 0, 255]  # Red block

    blue_block = np.zeros((100, 100, 3), dtype=np.uint8)
    blue_block[:, :] = [255, 0, 0]  # Blue block

    manipulation_system.add_object_to_grasp("red_block", red_block)
    manipulation_system.add_object_to_grasp("blue_block", blue_block)

    # Create a simulated scene with objects
    scene = np.zeros((480, 640, 3), dtype=np.uint8)

    # Add objects to scene
    scene[100:200, 200:300] = [0, 0, 255]  # Red block in scene
    scene[250:350, 400:500] = [255, 0, 0]  # Blue block in scene

    # Process scene and attempt to grasp objects
    success = manipulation_system.process_scene_and_grasp(scene)

    if success:
        print("Grasping operation completed successfully!")
    else:
        print("No objects detected or grasping failed.")

if __name__ == "__main__":
    example_vision_guided_manipulation()
```

## Example 4: Multi-Sensor Fusion for Robotic Perception

This example demonstrates how to fuse data from multiple sensors to improve robotic perception and decision-making.

### Sensor Fusion System

```python
import numpy as np
from typing import Dict, List, Tuple
import math
from dataclasses import dataclass

@dataclass
class SensorReading:
    """Data class for sensor readings"""
    sensor_type: str  # 'lidar', 'camera', 'imu', 'encoder', etc.
    timestamp: float
    data: np.ndarray
    confidence: float = 1.0

class KalmanFilter:
    """Simple Kalman filter for sensor fusion"""
    def __init__(self, state_dim: int, measurement_dim: int):
        self.state_dim = state_dim
        self.measurement_dim = measurement_dim

        # State: [x, y, vx, vy] (position and velocity)
        self.x = np.zeros(state_dim)  # State vector
        self.P = np.eye(state_dim) * 1000  # Covariance matrix
        self.Q = np.eye(state_dim) * 0.1  # Process noise
        self.R = np.eye(measurement_dim) * 1.0  # Measurement noise
        self.H = np.zeros((measurement_dim, state_dim))  # Observation matrix
        self.F = np.eye(state_dim)  # State transition matrix

    def predict(self, dt: float = 1.0):
        """Predict next state"""
        # Update state transition matrix for motion model
        self.F[0, 2] = dt  # x += vx * dt
        self.F[1, 3] = dt  # y += vy * dt

        # Predict state
        self.x = self.F @ self.x
        # Predict covariance
        self.P = self.F @ self.P @ self.F.T + self.Q

    def update(self, measurement: np.ndarray):
        """Update state with measurement"""
        # Calculate Kalman gain
        S = self.H @ self.P @ self.H.T + self.R
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # Update state
        y = measurement - self.H @ self.x  # Innovation
        self.x = self.x + K @ y

        # Update covariance
        I = np.eye(len(self.x))
        self.P = (I - K @ self.H) @ self.P

class MultiSensorFusion:
    def __init__(self):
        # Initialize Kalman filter for position estimation
        self.kf = KalmanFilter(state_dim=4, measurement_dim=2)  # [x, y, vx, vy]

        # Set up observation matrix (we can directly observe x, y)
        self.kf.H = np.array([
            [1, 0, 0, 0],  # Observe x
            [0, 1, 0, 0]   # Observe y
        ])

        # Initialize sensor buffers
        self.lidar_buffer = []
        self.camera_buffer = []
        self.imu_buffer = []
        self.encoder_buffer = []

        self.fused_position = np.array([0.0, 0.0])
        self.fused_velocity = np.array([0.0, 0.0])
        self.last_update_time = 0.0

    def add_lidar_reading(self, x: float, y: float, timestamp: float):
        """Add LIDAR reading (position measurement)"""
        reading = SensorReading(
            sensor_type='lidar',
            timestamp=timestamp,
            data=np.array([x, y]),
            confidence=0.9
        )
        self.lidar_buffer.append(reading)

        # Keep only recent readings (last 10)
        if len(self.lidar_buffer) > 10:
            self.lidar_buffer = self.lidar_buffer[-10:]

    def add_camera_reading(self, x: float, y: float, timestamp: float):
        """Add camera reading (position measurement with lower confidence)"""
        reading = SensorReading(
            sensor_type='camera',
            timestamp=timestamp,
            data=np.array([x, y]),
            confidence=0.7
        )
        self.camera_buffer.append(reading)

        # Keep only recent readings
        if len(self.camera_buffer) > 10:
            self.camera_buffer = self.camera_buffer[-10:]

    def add_imu_reading(self, ax: float, ay: float, timestamp: float):
        """Add IMU reading (acceleration measurement)"""
        reading = SensorReading(
            sensor_type='imu',
            timestamp=timestamp,
            data=np.array([ax, ay]),
            confidence=0.8
        )
        self.imu_buffer.append(reading)

        # Keep only recent readings
        if len(self.imu_buffer) > 10:
            self.imu_buffer = self.imu_buffer[-10:]

    def add_encoder_reading(self, x: float, y: float, timestamp: float):
        """Add encoder reading (odometry measurement)"""
        reading = SensorReading(
            sensor_type='encoder',
            timestamp=timestamp,
            data=np.array([x, y]),
            confidence=0.85
        )
        self.encoder_buffer.append(reading)

        # Keep only recent readings
        if len(self.encoder_buffer) > 10:
            self.encoder_buffer = self.encoder_buffer[-10:]

    def fuse_sensors(self, current_time: float) -> Tuple[np.ndarray, np.ndarray]:
        """Fuse sensor data to estimate position and velocity"""
        dt = current_time - self.last_update_time if self.last_update_time > 0 else 1.0

        # Predict state based on time elapsed
        self.kf.predict(dt)

        # Process all sensor readings since last update
        all_readings = []
        all_readings.extend(self.lidar_buffer)
        all_readings.extend(self.camera_buffer)
        all_readings.extend(self.encoder_buffer)

        # Sort by timestamp
        all_readings.sort(key=lambda r: r.timestamp)

        # Process each reading
        for reading in all_readings:
            if reading.timestamp > self.last_update_time:
                # Update Kalman filter with measurement
                self.kf.update(reading.data)

        # Extract position and velocity from state
        self.fused_position = self.kf.x[:2]
        self.fused_velocity = self.kf.x[2:]

        self.last_update_time = current_time

        return self.fused_position.copy(), self.fused_velocity.copy()

    def get_robot_state(self) -> Dict:
        """Get current fused robot state"""
        return {
            'position': self.fused_position,
            'velocity': self.fused_velocity,
            'covariance': self.kf.P[:2, :2],  # Position covariance
            'timestamp': self.last_update_time
        }

class RobotLocalizationSystem:
    def __init__(self):
        self.fusion_system = MultiSensorFusion()
        self.path_history = []
        self.velocity_history = []

    def update_with_sensors(self, sensor_data: Dict[str, List], current_time: float):
        """Update robot state with multiple sensor inputs"""
        # Process LIDAR data
        if 'lidar' in sensor_data:
            for reading in sensor_data['lidar']:
                self.fusion_system.add_lidar_reading(reading[0], reading[1], reading[2])

        # Process camera data
        if 'camera' in sensor_data:
            for reading in sensor_data['camera']:
                self.fusion_system.add_camera_reading(reading[0], reading[1], reading[2])

        # Process IMU data
        if 'imu' in sensor_data:
            for reading in sensor_data['imu']:
                self.fusion_system.add_imu_reading(reading[0], reading[1], reading[2])

        # Process encoder data
        if 'encoder' in sensor_data:
            for reading in sensor_data['encoder']:
                self.fusion_system.add_encoder_reading(reading[0], reading[1], reading[2])

        # Fuse all sensor data
        position, velocity = self.fusion_system.fuse_sensors(current_time)

        # Update history
        self.path_history.append(position.copy())
        self.velocity_history.append(velocity.copy())

        return self.fusion_system.get_robot_state()

    def get_smoothed_trajectory(self, window_size: int = 5) -> List[np.ndarray]:
        """Get smoothed trajectory using moving average"""
        if len(self.path_history) < window_size:
            return self.path_history

        smoothed_path = []
        for i in range(len(self.path_history)):
            start_idx = max(0, i - window_size // 2)
            end_idx = min(len(self.path_history), i + window_size // 2 + 1)

            avg_pos = np.mean(self.path_history[start_idx:end_idx], axis=0)
            smoothed_path.append(avg_pos)

        return smoothed_path

# Example usage
def example_sensor_fusion():
    """Example of multi-sensor fusion for robot localization"""
    localization_system = RobotLocalizationSystem()

    # Simulate sensor data over time
    time_step = 0.1  # 100ms time steps
    simulation_time = 10.0  # 10 seconds of simulation

    for t in np.arange(0, simulation_time, time_step):
        # Simulate robot moving in a circular path with some noise
        true_x = 2 * math.cos(t * 0.5)  # Circular motion
        true_y = 2 * math.sin(t * 0.5)

        # Add noise to simulate sensor inaccuracies
        lidar_x = true_x + np.random.normal(0, 0.1)
        lidar_y = true_y + np.random.normal(0, 0.1)

        camera_x = true_x + np.random.normal(0, 0.2)  # More noise for camera
        camera_y = true_y + np.random.normal(0, 0.2)

        # Encoder data (integrated from velocity with drift)
        encoder_x = true_x + np.random.normal(0, 0.05)
        encoder_y = true_y + np.random.normal(0, 0.05)

        # IMU data (acceleration measurements)
        true_ax = -2 * 0.5**2 * math.cos(t * 0.5)  # Acceleration for circular motion
        true_ay = -2 * 0.5**2 * math.sin(t * 0.5)
        imu_ax = true_ax + np.random.normal(0, 0.01)
        imu_ay = true_ay + np.random.normal(0, 0.01)

        # Organize sensor data
        sensor_data = {
            'lidar': [(lidar_x, lidar_y, t)],
            'camera': [(camera_x, camera_y, t)],
            'imu': [(imu_ax, imu_ay, t)],
            'encoder': [(encoder_x, encoder_y, t)]
        }

        # Update localization system
        state = localization_system.update_with_sensors(sensor_data, t)

        # Print status every second
        if int(t) % 1 == 0:
            print(f"Time: {t:.1f}s, Fused Position: ({state['position'][0]:.2f}, {state['position'][1]:.2f})")

    # Get final state
    final_state = localization_system.get_robot_state()
    print(f"\nFinal Position: ({final_state['position'][0]:.2f}, {final_state['position'][1]:.2f})")
    print(f"Final Velocity: ({final_state['velocity'][0]:.2f}, {final_state['velocity'][1]:.2f})")

    # Get smoothed trajectory
    smoothed_path = localization_system.get_smoothed_trajectory()
    print(f"Trajectory points: {len(localization_system.path_history)}")
    print(f"Smoothed trajectory points: {len(smoothed_path)}")

if __name__ == "__main__":
    example_sensor_fusion()
```

## Example 5: AI-Driven Decision Making for Robot Task Planning

This example demonstrates how AI can be used for high-level task planning and decision making in robotics.

### AI Task Planning System

```python
from typing import List, Dict, Tuple, Optional
import heapq
from dataclasses import dataclass
import numpy as np

@dataclass
class Task:
    """Represents a robot task with requirements and constraints"""
    id: str
    name: str
    priority: int  # 1-10, higher is more important
    duration: float  # Time required in seconds
    resources: List[str]  # Required resources (gripper, camera, etc.)
    preconditions: List[str]  # Conditions that must be true before task
    effects: List[str]  # Conditions that become true after task
    location: Tuple[float, float]  # Where task needs to be performed

class RobotState:
    """Represents the current state of the robot"""
    def __init__(self):
        self.resources_available = {
            'gripper': True,
            'camera': True,
            'navigation': True,
            'manipulator': True
        }
        self.conditions = {
            'at_home_station': True,
            'battery_level': 100.0,
            'gripper_empty': True,
            'task_queue_empty': True
        }
        self.location = (0.0, 0.0)
        self.current_task = None

class AITaskPlanner:
    def __init__(self):
        self.tasks = []
        self.robot_state = RobotState()
        self.task_queue = []

    def add_task(self, task: Task):
        """Add a task to the planning system"""
        self.tasks.append(task)

    def calculate_task_cost(self, task: Task, robot_state: RobotState) -> float:
        """Calculate the cost of executing a task"""
        # Distance cost - farther tasks cost more
        distance = np.sqrt((task.location[0] - robot_state.location[0])**2 +
                          (task.location[1] - robot_state.location[1])**2)

        # Priority discount - higher priority tasks have lower effective cost
        priority_discount = (10 - task.priority) * 0.1

        # Resource availability penalty
        resource_penalty = 0
        for resource in task.resources:
            if not robot_state.resources_available.get(resource, False):
                resource_penalty += 100  # High penalty for unavailable resources

        # Battery consideration
        battery_penalty = (100 - robot_state.conditions['battery_level']) * 0.1

        # Duration cost
        duration_cost = task.duration * 0.5

        total_cost = (distance * 0.5 + duration_cost + battery_penalty +
                     resource_penalty - priority_discount)

        return max(0.1, total_cost)  # Ensure positive cost

    def check_preconditions(self, task: Task, robot_state: RobotState) -> bool:
        """Check if all preconditions for a task are met"""
        for precondition in task.preconditions:
            if precondition not in robot_state.conditions:
                return False
            if not robot_state.conditions[precondition]:
                return False
        return True

    def update_state_after_task(self, task: Task, robot_state: RobotState):
        """Update robot state after task completion"""
        # Update conditions based on task effects
        for effect in task.effects:
            if effect.startswith('not_'):
                condition = effect[4:]  # Remove 'not_' prefix
                robot_state.conditions[condition] = False
            else:
                robot_state.conditions[effect] = True

        # Update location
        robot_state.location = task.location

        # Update battery (simplified model)
        distance = np.sqrt((task.location[0] - robot_state.location[0])**2 +
                          (task.location[1] - robot_state.location[1])**2)
        robot_state.conditions['battery_level'] -= distance * 0.1 + task.duration * 0.05

    def plan_tasks(self) -> List[Task]:
        """Plan the optimal sequence of tasks using a priority-based approach"""
        # Sort tasks by priority (highest first) and calculate costs
        available_tasks = []

        for task in self.tasks:
            if self.check_preconditions(task, self.robot_state):
                cost = self.calculate_task_cost(task, self.robot_state)
                heapq.heappush(available_tasks, (cost, -task.priority, task))

        planned_tasks = []
        current_state = RobotState()  # Copy of initial state

        # Execute tasks based on calculated priorities and costs
        while available_tasks and len(planned_tasks) < len(self.tasks):
            cost, neg_priority, task = heapq.heappop(available_tasks)

            # Check if preconditions are still met with updated state
            if self.check_preconditions(task, current_state):
                planned_tasks.append(task)
                self.update_state_after_task(task, current_state)

                # Add newly enabled tasks to the queue
                for new_task in self.tasks:
                    if (new_task not in planned_tasks and
                        self.check_preconditions(new_task, current_state)):
                        new_cost = self.calculate_task_cost(new_task, current_state)
                        heapq.heappush(available_tasks, (new_cost, -new_task.priority, new_task))

        return planned_tasks

    def execute_task_sequence(self, task_sequence: List[Task]) -> Dict:
        """Simulate execution of a task sequence"""
        execution_log = {
            'tasks_executed': [],
            'total_time': 0,
            'battery_consumed': 0,
            'success_rate': 0
        }

        current_state = RobotState()

        for i, task in enumerate(task_sequence):
            print(f"Executing task {i+1}/{len(task_sequence)}: {task.name}")

            # Simulate task execution
            success = np.random.random() > 0.1  # 90% success rate

            if success:
                execution_log['tasks_executed'].append(task.id)
                execution_log['total_time'] += task.duration
                self.update_state_after_task(task, current_state)

                print(f"  ✓ Completed successfully in {task.duration:.2f}s")
            else:
                print(f"  ✗ Failed to execute {task.name}")
                break  # Stop execution on failure

        execution_log['success_rate'] = len(execution_log['tasks_executed']) / len(task_sequence)
        execution_log['battery_consumed'] = 100 - current_state.conditions['battery_level']

        return execution_log

class AdaptiveTaskPlanner(AITaskPlanner):
    """Extended planner that adapts based on execution feedback"""
    def __init__(self):
        super().__init__()
        self.execution_history = []
        self.failure_patterns = {}

    def update_from_execution(self, task: Task, success: bool, execution_time: float):
        """Update planner based on task execution results"""
        result = {
            'task_id': task.id,
            'success': success,
            'execution_time': execution_time,
            'planned_duration': task.duration,
            'timestamp': np.datetime64('now')
        }
        self.execution_history.append(result)

        if not success:
            # Record failure pattern
            if task.name not in self.failure_patterns:
                self.failure_patterns[task.name] = {
                    'failures': 0,
                    'total_attempts': 0,
                    'avg_execution_time': 0
                }

            pattern = self.failure_patterns[task.name]
            pattern['failures'] += 1
            pattern['total_attempts'] += 1
            pattern['avg_execution_time'] = (
                (pattern['avg_execution_time'] * (pattern['total_attempts'] - 1) + execution_time) /
                pattern['total_attempts']
            )

    def calculate_adaptive_cost(self, task: Task, robot_state: RobotState) -> float:
        """Calculate cost with adaptive factors based on execution history"""
        base_cost = self.calculate_task_cost(task, robot_state)

        # Adjust cost based on historical failure rate
        if task.name in self.failure_patterns:
            pattern = self.failure_patterns[task.name]
            failure_rate = pattern['failures'] / pattern['total_attempts']
            base_cost *= (1 + failure_rate * 2)  # Higher cost for frequently failing tasks

        # Adjust based on battery level
        battery_level = robot_state.conditions['battery_level']
        if battery_level < 20:
            # Prioritize charging or return to base tasks
            if 'charge' not in task.name and 'return' not in task.name:
                base_cost *= 2.0

        return base_cost

# Example usage
def example_ai_task_planning():
    """Example of AI-driven task planning for robotics"""
    # Create adaptive task planner
    planner = AdaptiveTaskPlanner()

    # Define some sample tasks
    tasks = [
        Task(
            id="T001",
            name="Pick up object A",
            priority=8,
            duration=15.0,
            resources=["gripper", "camera"],
            preconditions=["at_pickup_zone", "gripper_empty"],
            effects=["carrying_object_A", "not_at_pickup_zone", "gripper_full"],
            location=(2.0, 3.0)
        ),
        Task(
            id="T002",
            name="Transport to delivery zone",
            priority=7,
            duration=25.0,
            resources=["navigation"],
            preconditions=["carrying_object_A"],
            effects=["at_delivery_zone", "not_carrying_object_A"],
            location=(5.0, 7.0)
        ),
        Task(
            id="T003",
            name="Place object",
            priority=9,
            duration=12.0,
            resources=["gripper", "manipulator"],
            preconditions=["at_delivery_zone", "carrying_object_A"],
            effects=["gripper_empty", "task_completed"],
            location=(5.0, 7.0)
        ),
        Task(
            id="T004",
            name="Return to home",
            priority=5,
            duration=20.0,
            resources=["navigation"],
            preconditions=["task_completed"],
            effects=["at_home_station"],
            location=(0.0, 0.0)
        ),
        Task(
            id="T005",
            name="Charge battery",
            priority=10,
            duration=120.0,
            resources=[],
            preconditions=["at_home_station"],
            effects=["battery_level_100"],
            location=(0.0, 0.0)
        )
    ]

    # Add tasks to planner
    for task in tasks:
        planner.add_task(task)

    # Plan tasks
    print("Planning tasks...")
    planned_sequence = planner.plan_tasks()

    print(f"\nPlanned sequence ({len(planned_sequence)} tasks):")
    for i, task in enumerate(planned_sequence):
        print(f"  {i+1}. {task.name} (Priority: {task.priority}, Duration: {task.duration}s)")

    # Execute the plan
    print(f"\nExecuting plan...")
    execution_results = planner.execute_task_sequence(planned_sequence)

    print(f"\nExecution Results:")
    print(f"  Tasks executed: {len(execution_results['tasks_executed'])}/{len(planned_sequence)}")
    print(f"  Success rate: {execution_results['success_rate']:.1%}")
    print(f"  Total time: {execution_results['total_time']:.2f}s")
    print(f"  Battery consumed: {execution_results['battery_consumed']:.1f}%")

if __name__ == "__main__":
    example_ai_task_planning()
```

## Example 6: Deep Learning for Robotic Control

This example demonstrates how deep learning can be used for end-to-end robotic control.

### Deep Learning Control System

```python
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from typing import Tuple, List
import random

class RobotControlNet(nn.Module):
    """Deep neural network for robot control"""
    def __init__(self, input_size: int, hidden_sizes: List[int], output_size: int):
        super(RobotControlNet, self).__init__()

        layers = []
        prev_size = input_size

        for hidden_size in hidden_sizes:
            layers.append(nn.Linear(prev_size, hidden_size))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(0.2))
            prev_size = hidden_size

        layers.append(nn.Linear(prev_size, output_size))

        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)

class EndToEndController:
    def __init__(self, input_size: int = 4, hidden_sizes: List[int] = [64, 32],
                 output_size: int = 2):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        self.network = RobotControlNet(input_size, hidden_sizes, output_size)
        self.network.to(self.device)

        self.optimizer = optim.Adam(self.network.parameters(), lr=0.001)
        self.criterion = nn.MSELoss()

        self.memory = []  # Experience replay buffer
        self.max_memory_size = 10000

        self.input_size = input_size
        self.output_size = output_size

    def get_action(self, state: np.ndarray, training: bool = True) -> np.ndarray:
        """Get action from the network"""
        state_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.device)

        with torch.no_grad():
            action = self.network(state_tensor)

        action = action.cpu().numpy()[0]

        if training:
            # Add some exploration noise
            noise = np.random.normal(0, 0.1, action.shape)
            action += noise

        return action

    def remember(self, state: np.ndarray, action: np.ndarray,
                 reward: float, next_state: np.ndarray, done: bool):
        """Store experience in memory"""
        self.memory.append((state, action, reward, next_state, done))

        if len(self.memory) > self.max_memory_size:
            self.memory.pop(0)

    def replay(self, batch_size: int = 32):
        """Train on a batch of experiences"""
        if len(self.memory) < batch_size:
            return

        batch = random.sample(self.memory, batch_size)
        states = torch.FloatTensor([e[0] for e in batch]).to(self.device)
        actions = torch.FloatTensor([e[1] for e in batch]).to(self.device)
        rewards = torch.FloatTensor([e[2] for e in batch]).to(self.device)

        # Compute loss
        predicted_actions = self.network(states)
        loss = self.criterion(predicted_actions, actions)

        # Optimize
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

    def train_on_batch(self, states: np.ndarray, actions: np.ndarray):
        """Train on a specific batch of state-action pairs"""
        states_tensor = torch.FloatTensor(states).to(self.device)
        actions_tensor = torch.FloatTensor(actions).to(self.device)

        # Forward pass
        predicted_actions = self.network(states_tensor)
        loss = self.criterion(predicted_actions, actions_tensor)

        # Backward pass
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        return loss.item()

class NavigationEnvironment:
    """Simple navigation environment for training"""
    def __init__(self, width: int = 10, height: int = 10):
        self.width = width
        self.height = height
        self.reset()

    def reset(self):
        """Reset environment"""
        self.robot_pos = np.array([1.0, 1.0])
        self.goal_pos = np.array([self.width-2, self.height-2])
        self.obstacles = [
            np.array([3, 3]),
            np.array([4, 4]),
            np.array([5, 5])
        ]
        self.time_step = 0
        self.max_steps = 100
        return self.get_state()

    def get_state(self) -> np.ndarray:
        """Get current state as [robot_x, robot_y, goal_x, goal_y]"""
        return np.concatenate([self.robot_pos, self.goal_pos])

    def step(self, action: np.ndarray) -> Tuple[np.ndarray, float, bool]:
        """Execute action and return (state, reward, done)"""
        self.time_step += 1

        # Apply action (movement)
        new_pos = self.robot_pos + action * 0.1  # Scale down action

        # Keep within bounds
        new_pos[0] = np.clip(new_pos[0], 0.5, self.width - 0.5)
        new_pos[1] = np.clip(new_pos[1], 0.5, self.height - 0.5)

        self.robot_pos = new_pos

        # Calculate reward
        distance_to_goal = np.linalg.norm(self.robot_pos - self.goal_pos)

        # Positive reward for getting closer to goal
        reward = -distance_to_goal * 0.1  # Negative because we want to minimize distance

        # Bonus for getting close to goal
        if distance_to_goal < 0.5:
            reward += 10.0

        # Penalty for hitting obstacles
        for obs in self.obstacles:
            if np.linalg.norm(self.robot_pos - obs) < 0.5:
                reward -= 5.0
                break

        # Check if done
        done = (distance_to_goal < 0.3) or (self.time_step >= self.max_steps)

        return self.get_state(), reward, done

class DeepLearningTrainer:
    def __init__(self, controller: EndToEndController, environment: NavigationEnvironment):
        self.controller = controller
        self.env = environment
        self.training_history = []

    def train(self, episodes: int = 1000):
        """Train the deep learning controller"""
        for episode in range(episodes):
            state = self.env.reset()
            total_reward = 0
            steps = 0
            max_steps = 100

            while steps < max_steps:
                # Get action from controller
                action = self.controller.get_action(state)

                # Execute action in environment
                next_state, reward, done = self.env.step(action)

                # Store experience
                self.controller.remember(state, action, reward, next_state, done)

                state = next_state
                total_reward += reward
                steps += 1

                if done:
                    break

            # Train on replay memory
            if len(self.controller.memory) > 32:
                self.controller.replay(batch_size=32)

            self.training_history.append(total_reward)

            # Print progress
            if episode % 100 == 0:
                avg_reward = np.mean(self.training_history[-100:]) if len(self.training_history) >= 100 else np.mean(self.training_history)
                print(f"Episode {episode}, Average Reward: {avg_reward:.2f}")

    def test_controller(self, num_tests: int = 10):
        """Test the trained controller"""
        success_count = 0
        avg_steps = 0

        for _ in range(num_tests):
            state = self.env.reset()
            steps = 0
            max_steps = 100

            while steps < max_steps:
                # Get action (no exploration noise during testing)
                action = self.controller.get_action(state, training=False)
                state, reward, done = self.env.step(action)
                steps += 1

                if done:
                    if reward > 5:  # Assume success if reward is high (close to goal)
                        success_count += 1
                    avg_steps += steps
                    break

        avg_steps = avg_steps / num_tests if num_tests > 0 else 0
        success_rate = success_count / num_tests if num_tests > 0 else 0

        print(f"\nTest Results:")
        print(f"Success Rate: {success_rate:.2%}")
        print(f"Average Steps to Goal: {avg_steps:.2f}")

# Example usage
def example_deep_learning_control():
    """Example of deep learning for robotic control"""
    # Create controller and environment
    controller = EndToEndController(input_size=4, hidden_sizes=[64, 32, 16], output_size=2)
    env = NavigationEnvironment(width=10, height=10)

    # Create trainer
    trainer = DeepLearningTrainer(controller, env)

    print("Training deep learning controller...")
    trainer.train(episodes=1000)

    print("\nTesting trained controller...")
    trainer.test_controller(num_tests=20)

if __name__ == "__main__":
    example_deep_learning_control()
```

## Summary

These examples demonstrate practical implementations of AI-driven workflows and tools in robotics:

1. **Machine Learning Pipeline**: Shows a complete perception system with preprocessing, inference, and result formatting.

2. **Reinforcement Learning for Navigation**: Demonstrates Q-learning for robot path planning with training and testing phases.

3. **Vision-Guided Manipulation**: Integrates computer vision with robotic control for object detection and grasping.

4. **Multi-Sensor Fusion**: Combines data from multiple sensors using Kalman filtering for improved state estimation.

5. **AI Task Planning**: Implements intelligent task scheduling with priority, resource management, and adaptive planning.

6. **Deep Learning Control**: Shows end-to-end learning for robot control with experience replay and neural network training.

These examples provide practical foundations for implementing AI techniques in various robotics applications, from perception and control to planning and decision making.

## Cross-References

The examples in this chapter connect to concepts in other chapters:

- **Chapter 1 (Physical AI Fundamentals)**: Applies AI techniques to fundamental Physical AI concepts
- **Chapter 2 (Humanoid Robotics Concepts)**: Enhances humanoid systems with AI capabilities
- **Chapter 3 (Practical Robotics Skills)**: Implements AI tools with practical programming skills
- **Chapter 5 (Advanced Robotics Applications)**: Uses AI techniques in advanced applications
- **Chapter 6 (Data Processing for Physical AI)**: Expands on AI-based data processing techniques
- **Chapter 7 (Actuator Systems)**: Applies AI to actuator control and optimization
- **Chapter 8 (Control Theory Basics)**: Enhances control systems with AI techniques
- **Chapter 9 (Motion Planning)**: Improves planning with AI-based algorithms
- **Chapter 14 (Ethics in Robotics)**: Considers ethical implications of AI-driven systems

import ChapterNavigation from '@site/src/components/ChapterNavigation';

<ChapterNavigation
  prevChapter={{path: '/docs/textbook/chapter-04/concepts', title: 'Chapter 4: Core Concepts'}}
  nextChapter={{path: '/docs/textbook/chapter-04/exercises', title: 'Chapter 4: Exercises'}}
/>