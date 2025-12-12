---
title: 'Captions and References Guide for Textbook Diagrams'
description: 'Guide for creating effective captions and reference systems for diagrams in the robotics textbook'
---

# Captions and References Guide for Textbook Diagrams

## Overview

This guide provides comprehensive instructions for creating effective captions and reference systems for diagrams in the AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. Proper captions and references enhance accessibility, support learning, and enable students to navigate and understand visual content effectively.

## Caption Standards

### 1. Caption Structure

#### Basic Caption Format
```
Figure [X.Y]: [Brief description of the diagram] showing [key elements and relationships].
```

#### Enhanced Caption Format
```
Figure [X.Y]: [Brief description of the diagram] showing [key elements and relationships].
[Additional context or explanation as needed for educational purposes].
```

### 2. Caption Content Guidelines

#### Essential Information
- **Identification**: Clear identification as Figure X.Y
- **Subject**: What the diagram depicts
- **Key Elements**: Important components shown
- **Relationships**: How elements interact or relate
- **Context**: Educational context or application

#### Content Depth by Diagram Type

**Simple Diagrams**:
- ❌ "Diagram showing a robot"
- ✅ "Figure 1.1: Physical AI system architecture showing perception, reasoning, and action modules with environmental interaction."

**Complex Diagrams**:
- ❌ "A complicated diagram with lots of parts"
- ✅ "Figure 2.3: Forward kinematics of a 6-DOF manipulator showing joint angles θ₁ through θ₆, link lengths L₁ through L₆, and end-effector position P(x,y,z) in the base coordinate frame."

**Data Visualizations**:
- ❌ "Graph of some data"
- ✅ "Figure 3.2: Efficiency vs. load curve for three different motor types showing peak efficiency at 60% load for all motors, with Servo motors achieving highest peak efficiency at 88%."

## Reference System

### 1. Figure Numbering Convention

#### Chapter-Based Numbering
- **Format**: Chapter.Section.Figure (e.g., 1.2.3 for Figure 3 in Section 2 of Chapter 1)
- **Alternative**: Chapter.Figure (e.g., 1.5 for Figure 5 in Chapter 1)

#### Sequential Numbering
- Numbers figures sequentially within each chapter
- Maintain consistency with table and equation numbering
- Use clear, unambiguous references

### 2. Cross-Reference Format

#### In-Text References
- **Preferred**: "As shown in Figure 1.2, the perception system..."
- **Alternative**: "The architecture in Figure 1.2 demonstrates..."
- **For Multiple References**: "Figures 1.2 and 1.3 illustrate..."

#### Reference Clarity
- Use the same terminology as the caption
- Provide context for the reference
- Explain why the reference is relevant

## Implementation Templates

### 1. Markdown Figure Implementation

```markdown
<figure>
  <img src="/img/chapter-01/system-architecture.png" alt="Physical AI system architecture diagram showing perception module receiving sensor inputs, reasoning module processing information, and action module controlling actuators in a feedback loop with the environment" />
  <figcaption>Figure 1.1: Physical AI system architecture showing perception, reasoning, and action modules with environmental interaction. This diagram illustrates how the perception module receives sensor inputs from the environment, processes them, and sends information to the reasoning module. The reasoning module processes this information and sends commands to the action module, which controls actuators that interact with the environment in a closed feedback loop.</figcaption>
</figure>

As shown in Figure 1.1, the Physical AI system operates in a closed-loop fashion with continuous interaction with the environment.
```

### 2. MDX Component Implementation

```jsx
// src/components/FigureWithReferences.jsx
import React from 'react';
import Link from '@docusaurus/Link';

const FigureWithReferences = ({
  id,
  src,
  alt,
  caption,
  size = 'medium',
  className = ''
}) => {
  return (
    <figure className={`textbook-figure ${size} ${className}`}>
      <img src={src} alt={alt} />
      <figcaption>
        <strong>Figure {id}:</strong> {caption}
      </figcaption>

      <style jsx>{`
        .textbook-figure {
          margin: 1.5rem 0;
          text-align: center;
          page-break-inside: avoid;
        }

        .textbook-figure.medium {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .textbook-figure.full {
          max-width: 100%;
        }

        .textbook-figure img {
          max-width: 100%;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        figcaption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #555;
          text-align: center;
          font-style: italic;
        }

        @media print {
          .textbook-figure {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </figure>
  );
};

// Usage:
<FigureWithReferences
  id="1.1"
  src="/img/chapter-01/system-architecture.png"
  alt="Physical AI system architecture diagram showing perception module receiving sensor inputs, reasoning module processing information, and action module controlling actuators in a feedback loop with the environment"
  caption="Physical AI system architecture showing perception, reasoning, and action modules with environmental interaction. This diagram illustrates how the perception module receives sensor inputs from the environment, processes them, and sends information to the reasoning module. The reasoning module processes this information and sends commands to the action module, which controls actuators that interact with the environment in a closed feedback loop."
  size="medium"
/>
```

### 3. Advanced Figure Component with References

```jsx
// src/components/AdvancedFigure.jsx
import React, { useState } from 'react';
import Link from '@docusaurus/Link';

const AdvancedFigure = ({
  id,
  src,
  alt,
  caption,
  references = [],
  className = "",
  showReferences = true
}) => {
  const [showAllDetails, setShowAllDetails] = useState(false);

  return (
    <figure className={`enhanced-figure ${className}`}>
      <img src={src} alt={alt} />

      <figcaption>
        <div className="figure-header">
          <strong>Figure {id}:</strong>
          <span className="figure-title">{caption}</span>
        </div>

        {references.length > 0 && showReferences && (
          <div className="figure-references">
            <details open={!showAllDetails}>
              <summary onClick={(e) => setShowAllDetails(!showAllDetails)}>
                {showAllDetails ? 'Show Less' : 'References & Resources'}
              </summary>

              <ul>
                {references.map((ref, index) => (
                  <li key={index}>
                    {ref.url ? (
                      <Link to={ref.url}>{ref.title}</Link>
                    ) : (
                      ref.title
                    )}
                    {ref.description && <p>{ref.description}</p>}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </figcaption>

      <style jsx>{`
        .enhanced-figure {
          margin: 2rem 0;
          text-align: center;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1rem;
          background-color: #fafafa;
        }

        .figure-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .figure-title {
          margin-left: 0.5rem;
          margin-top: 0.25rem;
        }

        .figure-references {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed #ccc;
          font-size: 0.85rem;
        }

        .figure-references ul {
          list-style: none;
          padding-left: 0;
          margin-top: 0.5rem;
        }

        .figure-references li {
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
        }

        .figure-references a {
          color: #2E8B57;
          text-decoration: none;
        }

        .figure-references a:hover {
          text-decoration: underline;
        }

        details summary {
          cursor: pointer;
          color: #4682B4;
          font-weight: 500;
        }
      `}</style>
    </figure>
  );
};

export default AdvancedFigure;
```

## Reference Integration

### 1. In-Text Citation System

#### Direct References
```
As shown in Figure 1.2, the system architecture demonstrates the integration of multiple subsystems.

Figure 1.3 illustrates the kinematic chain with six degrees of freedom, where each joint contributes to the overall mobility of the end-effector.

The relationship between torque and speed, depicted in Figure 2.1, shows the trade-offs inherent in motor selection for robotic applications.
```

#### Comparative References
```
Comparing Figure 1.4 with Figure 1.5 reveals the differences in control architecture between centralized and distributed approaches.

The workspace shown in Figure 2.3 is significantly larger than that in Figure 2.1 due to the additional degrees of freedom in the 7-DOF manipulator.
```

### 2. Reference Indexing

#### Automatic Reference Generation
```jsx
// Component to generate a list of figures referenced in a chapter
import React from 'react';

const FigureIndex = ({ figures }) => {
  return (
    <div className="figure-index">
      <h3>List of Figures</h3>
      <ul>
        {figures.map(fig => (
          <li key={fig.id}>
            <Link to={`#${fig.anchor}`}>
              Figure {fig.id}: {fig.title}
            </Link>
            <p className="figure-description">{fig.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### 3. Accessibility Integration

#### ARIA Labels for References
```jsx
<figure
  id={`figure-${id}`}
  role="group"
  aria-labelledby={`fig-${id}-caption`}
  tabIndex="0">
  <img src={src} alt={alt} />
  <figcaption id={`fig-${id}-caption`}>
    Figure {id}: {caption}
  </figcaption>
</figure>

// In-text reference with ARIA
<p>As shown in <a href={`#figure-${id}`} aria-describedby={`fig-${id}-caption`}>Figure {id}</a>, the system...</p>
```

## Quality Standards

### 1. Caption Quality

#### Clarity Requirements
- [ ] Caption clearly describes the diagram content
- [ ] Key elements and relationships are explained
- [ ] Technical terminology is accurate and appropriate
- [ ] Caption is concise but comprehensive
- [ ] Caption stands alone without requiring the diagram

#### Educational Value
- [ ] Caption reinforces learning objectives
- [ ] Caption provides context for the concept
- [ ] Caption connects to broader textbook content
- [ ] Caption includes educational insights
- [ ] Caption suggests applications or implications

### 2. Reference Quality

#### Accuracy Requirements
- [ ] Figure references match actual figures
- [ ] Cross-references are accurate and functional
- [ ] Numbering is consistent throughout
- [ ] References are properly formatted
- [ ] Citations are complete and accurate

#### Navigation Support
- [ ] References enable easy navigation
- [ ] Cross-references are meaningful
- [ ] Links work correctly in all contexts
- [ ] Print versions maintain reference integrity
- [ ] Mobile versions preserve reference functionality

## Implementation Checklist

### For Each Figure
- [ ] Figure has appropriate ID in the format Chapter.Figure
- [ ] Alt text is descriptive and comprehensive
- [ ] Caption follows the standard format
- [ ] Caption includes educational context
- [ ] Figure is properly positioned in text
- [ ] Cross-references in text are accurate
- [ ] ARIA labels are properly implemented
- [ ] Responsive behavior is tested
- [ ] Print behavior is appropriate
- [ ] Accessibility is verified

### For Reference System
- [ ] Numbering is consistent throughout chapter
- [ ] Cross-references are linked correctly
- [ ] Figure index is generated automatically
- [ ] References work in both HTML and print versions
- [ ] Mobile navigation is preserved
- [ ] Screen reader compatibility is verified
- [ ] Keyboard navigation is supported
- [ ] Alternative navigation methods exist

## Advanced Features

### 1. Dynamic Reference Updates
```js
// Example of JavaScript to dynamically update figure references
document.addEventListener('DOMContentLoaded', function() {
  // Update figure references to include page numbers in print view
  if (window.matchMedia('print').matches) {
    document.querySelectorAll('figure').forEach((fig, index) => {
      const figCaption = fig.querySelector('figcaption');
      if (figCaption) {
        figCaption.innerHTML = `Figure ${index + 1} (Page ${currentPage}): ${figCaption.textContent}`;
      }
    });
  }
});
```

### 2. Search Integration
```jsx
// Component that makes figures searchable
const SearchableFigure = ({ id, src, alt, caption, tags = [] }) => {
  return (
    <figure
      className="searchable-figure"
      data-search-terms={`${caption} ${tags.join(' ')}`}
      data-figure-id={id}
    >
      <img src={src} alt={alt} />
      <figcaption>Figure {id}: {caption}</figcaption>
    </figure>
  );
};
```

### 3. Export Compatibility
For PDF and other export formats:
- Ensure figure numbering remains consistent
- Maintain caption positioning
- Preserve cross-reference links where possible
- Include alternative navigation methods

## Examples by Chapter Section

### Chapter 1: Physical AI Fundamentals
```markdown
<figure>
  <img src="/img/chapter-01/physical-ai-system.png" alt="Physical AI system diagram with perception, reasoning, and action modules connected in a feedback loop with the environment" />
  <figcaption>Figure 1.1: Physical AI system architecture showing perception, reasoning, and action modules connected in a feedback loop with the physical environment. This diagram illustrates how the perception module gathers information from sensors, the reasoning module processes this information to make decisions, and the action module executes these decisions through actuators that affect the environment.</figcaption>
</figure>

The Physical AI system shown in Figure 1.1 operates differently from traditional AI systems because it must account for the real-world consequences of its actions.
```

### Chapter 2: Kinematics in Robotics
```jsx
<AdvancedFigure
  id="2.1"
  src="/img/chapter-02/kinematic-chain.png"
  alt="2-DOF planar manipulator showing two rotating joints with links of length L1 and L2, and joint angles θ1 and θ2"
  caption="2-DOF planar manipulator kinematic chain showing two rotating joints with links of length L1 and L2, and joint angles θ1 and θ2. The end-effector position P(x,y) is determined by the forward kinematics equations."
  references={[
    {
      title: "Forward Kinematics Equation",
      description: "Detailed mathematical derivation of forward kinematics for planar manipulators",
      url: "/docs/mathematics/kinematics"
    },
    {
      title: "Joint Space vs. Cartesian Space",
      description: "Explanation of different coordinate systems in robotics",
      url: "/docs/foundations/coordinate-systems"
    }
  ]}
/>
```

### Chapter 3: Control Systems
```markdown
<figure>
  <img src="/img/chapter-03/control-loop.png" alt="Feedback control system diagram showing controller, plant, sensor, and summing junction with reference input r(t), error e(t), control signal u(t), and output y(t)" />
  <figcaption>Figure 3.1: Basic feedback control system architecture showing controller, plant (the system being controlled), sensor, and summing junction. The reference input r(t) is compared with the measured output to generate an error signal e(t), which is processed by the controller to generate the control signal u(t) that drives the plant to produce output y(t).</figcaption>
</figure>

The control system architecture in Figure 3.1 demonstrates the fundamental feedback principle that is essential for Physical AI systems to respond appropriately to environmental changes.
```

This comprehensive system ensures that all diagrams in the textbook are properly captioned and referenced, supporting both accessibility and educational effectiveness. The standardized approach helps students navigate the visual content effectively while maintaining the technical accuracy and educational value of the material.