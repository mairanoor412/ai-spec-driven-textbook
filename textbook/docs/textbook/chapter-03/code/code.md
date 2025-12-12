---
title: 'Chapter 3: Code Examples - Practical Robotics Skills'
description: 'Working code examples for practical robotics skills including ROS2, robot control, and sensor integration'
tags: [code-examples, ros2, robot-control, sensors, python, cpp]
---

# Code Examples: Practical Robotics Skills

This section provides working code examples demonstrating the practical robotics concepts covered in this chapter. All examples are designed to be beginner-friendly while demonstrating real-world applications.

## Example 1: Basic ROS2 Publisher-Subscriber

### Overview
This example demonstrates the fundamental ROS2 communication pattern using publishers and subscribers to send and receive messages.

### Code: Publisher Node (Python)

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class MinimalPublisher(Node):
    """
    A simple ROS2 publisher node that publishes messages at regular intervals.

    This demonstrates:
    - Creating a ROS2 node
    - Setting up a publisher
    - Using timers for periodic publishing
    """

    def __init__(self):
        super().__init__('minimal_publisher')

        # Create a publisher for String messages on the 'topic' topic
        self.publisher_ = self.create_publisher(String, 'topic', 10)

        # Create a timer that calls timer_callback every 0.5 seconds
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

        self.get_logger().info('Publisher node initialized')

    def timer_callback(self):
        """Publish a message at each timer tick"""
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1


def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()

    try:
        rclpy.spin(minimal_publisher)
    except KeyboardInterrupt:
        pass

    minimal_publisher.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Code: Subscriber Node (Python)

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class MinimalSubscriber(Node):
    """
    A simple ROS2 subscriber node that receives and processes messages.

    This demonstrates:
    - Creating a ROS2 subscriber
    - Processing incoming messages
    - Logging information
    """

    def __init__(self):
        super().__init__('minimal_subscriber')

        # Create a subscription to String messages on the 'topic' topic
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10
        )
        self.subscription  # prevent unused variable warning

        self.get_logger().info('Subscriber node initialized')

    def listener_callback(self, msg):
        """Process received messages"""
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()

    try:
        rclpy.spin(minimal_subscriber)
    except KeyboardInterrupt:
        pass

    minimal_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### How to Run

```bash
# Terminal 1: Run the publisher
ros2 run my_package publisher_node

# Terminal 2: Run the subscriber
ros2 run my_package subscriber_node
```

---

## Example 2: Sensor Data Processing

### Overview
This example shows how to read sensor data (simulated distance sensor) and process it for obstacle detection.

### Code: Distance Sensor Handler (Python)

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Range
from std_msgs.msg import Bool
import math


class DistanceSensorNode(Node):
    """
    Processes distance sensor data and publishes obstacle detection alerts.

    Features:
    - Subscribe to Range sensor messages
    - Detect obstacles within threshold distance
    - Publish Boolean alerts for obstacle presence
    - Calculate running average for noise reduction
    """

    def __init__(self):
        super().__init__('distance_sensor_node')

        # Parameters
        self.obstacle_threshold = 0.5  # meters
        self.sensor_readings = []
        self.max_readings = 5

        # Subscribers
        self.range_subscription = self.create_subscription(
            Range,
            'distance_sensor',
            self.range_callback,
            10
        )

        # Publishers
        self.obstacle_publisher = self.create_publisher(
            Bool,
            'obstacle_detected',
            10
        )

        self.get_logger().info(
            f'Distance sensor node initialized. '
            f'Obstacle threshold: {self.obstacle_threshold}m'
        )

    def range_callback(self, msg):
        """Process incoming range sensor data"""
        distance = msg.range

        # Add to rolling average
        self.sensor_readings.append(distance)
        if len(self.sensor_readings) > self.max_readings:
            self.sensor_readings.pop(0)

        # Calculate average
        avg_distance = sum(self.sensor_readings) / len(self.sensor_readings)

        # Detect obstacle
        obstacle_detected = avg_distance < self.obstacle_threshold

        # Publish detection result
        detection_msg = Bool()
        detection_msg.data = obstacle_detected
        self.obstacle_publisher.publish(detection_msg)

        # Log information
        if obstacle_detected:
            self.get_logger().warn(
                f'OBSTACLE DETECTED! Distance: {avg_distance:.2f}m '
                f'(threshold: {self.obstacle_threshold}m)'
            )
        else:
            self.get_logger().info(
                f'Clear path. Distance: {avg_distance:.2f}m'
            )


def main(args=None):
    rclpy.init(args=args)
    sensor_node = DistanceSensorNode()

    try:
        rclpy.spin(sensor_node)
    except KeyboardInterrupt:
        pass

    sensor_node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Example 3: Simple Robot Controller

### Overview
This example demonstrates basic robot control by sending velocity commands based on sensor input.

### Code: Velocity Controller (Python)

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Bool


class SimpleController(Node):
    """
    A basic robot controller that stops when obstacles are detected.

    Demonstrates:
    - Subscribing to obstacle detection messages
    - Publishing velocity commands
    - Implementing safety logic
    - Using timers for periodic control updates
    """

    def __init__(self):
        super().__init__('simple_controller')

        # State
        self.obstacle_detected = False
        self.default_linear_speed = 0.2  # m/s
        self.default_angular_speed = 0.0  # rad/s

        # Subscribers
        self.obstacle_subscription = self.create_subscription(
            Bool,
            'obstacle_detected',
            self.obstacle_callback,
            10
        )

        # Publishers
        self.velocity_publisher = self.create_publisher(
            Twist,
            'cmd_vel',
            10
        )

        # Timer for control loop
        self.timer = self.create_timer(0.1, self.control_loop)  # 10 Hz

        self.get_logger().info('Simple controller initialized')

    def obstacle_callback(self, msg):
        """Update obstacle detection state"""
        self.obstacle_detected = msg.data

    def control_loop(self):
        """Main control loop - runs at 10 Hz"""
        cmd_vel = Twist()

        if self.obstacle_detected:
            # STOP when obstacle detected
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.0
            self.get_logger().warn('STOPPING - Obstacle detected!')
        else:
            # Move forward when path is clear
            cmd_vel.linear.x = self.default_linear_speed
            cmd_vel.angular.z = self.default_angular_speed
            self.get_logger().info('Moving forward - Path clear')

        # Publish velocity command
        self.velocity_publisher.publish(cmd_vel)


def main(args=None):
    rclpy.init(args=args)
    controller = SimpleController()

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        # Stop robot on exit
        stop_cmd = Twist()
        controller.velocity_publisher.publish(stop_cmd)

    controller.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Running the Complete System

To run all three examples together:

```bash
# Terminal 1: Launch the distance sensor simulator (if available)
ros2 run sensor_simulator distance_sensor

# Terminal 2: Run the sensor processing node
ros2 run my_package distance_sensor_node

# Terminal 3: Run the controller
ros2 run my_package simple_controller

# Terminal 4: (Optional) Monitor topics
ros2 topic echo /obstacle_detected
ros2 topic echo /cmd_vel
```

## Key Takeaways

1. **ROS2 Communication**: Publishers and subscribers enable modular, decoupled system design
2. **Sensor Processing**: Raw sensor data often needs filtering (e.g., rolling average) to reduce noise
3. **Safety First**: Always implement safety checks (e.g., stopping when obstacles detected)
4. **Periodic Updates**: Use timers for control loops to maintain consistent behavior
5. **Logging**: Proper logging helps debug and monitor system behavior

## Next Steps

- Modify the obstacle threshold and observe behavior changes
- Add turning behavior when obstacles are detected
- Implement multiple sensor fusion
- Add PID control for smoother motion
- Integrate with simulation environments (Gazebo, Isaac Sim)

## Additional Resources

- [ROS2 Python Tutorial](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.html)
- [ROS2 Concepts](https://docs.ros.org/en/humble/Concepts.html)
- [sensor_msgs Documentation](https://docs.ros2.org/latest/api/sensor_msgs/)
- [geometry_msgs Documentation](https://docs.ros2.org/latest/api/geometry_msgs/)
