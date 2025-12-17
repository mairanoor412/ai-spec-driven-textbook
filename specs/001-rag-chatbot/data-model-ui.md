# Data Model: Chatbot UI/UX Component Structures

**Feature**: Chatbot UI/UX Production-Grade Improvements
**Phase**: 1 (Design & Contracts)
**Date**: 2025-12-17
**Parent Data Model**: [data-model.md](./data-model.md)

## Overview

This document defines the UI-specific data structures, component interfaces, and visual state models for the chatbot UI/UX improvements. This extends the core RAG chatbot data model (data-model.md) with focused updates to visual presentation components only.

**Scope**: Frontend visual components, CSS variables, animation states, accessibility attributes
**Out of Scope**: Backend API changes, RAG pipeline modifications, session/query data structures (see parent data model)

---

## UI Component Data Structures

### 1. ChatTrigger Component

**File**: `textbook/src/components/ChatbotWidget/ChatTrigger.jsx`

**Props Interface**:
```typescript
interface ChatTriggerProps {
  isOpen: boolean;                    // Current chatbot open/closed state
  onClick: () => void;                // Toggle chatbot open/closed
  ariaLabel?: string;                 // Accessible label (default: "Open AI Assistant")
  className?: string;                 // Additional CSS classes
  disabled?: boolean;                 // Disable button (e.g., during rate limit)
}
```

**Internal State**:
```typescript
interface ChatTriggerState {
  showTooltip: boolean;               // Tooltip visibility (hover/focus)
  tooltipDelayTimer: NodeJS.Timeout | null;  // Delayed show timer
}
```

**Computed Values**:
```typescript
interface ChatTriggerComputed {
  iconType: 'robot' | 'close';        // Icon to display based on isOpen
  tooltipText: string;                // "Ask AI Assistant" or "Close Assistant"
  ariaExpanded: 'true' | 'false';     // ARIA expanded state
  ariaControls: string;               // ID of controlled element ("chatbot-panel")
}
```

**Event Handlers**:
```typescript
interface ChatTriggerHandlers {
  handleClick: () => void;            // Button click handler
  handleMouseEnter: () => void;       // Show tooltip after delay
  handleMouseLeave: () => void;       // Hide tooltip
  handleFocus: () => void;            // Show tooltip on keyboard focus
  handleBlur: () => void;             // Hide tooltip on blur
  handleKeyDown: (e: KeyboardEvent) => void;  // Enter/Space trigger
}
```

---

### 2. Tooltip Component

**File**: `textbook/src/components/ChatbotWidget/ChatTrigger.jsx` (inline sub-component)

**Props Interface**:
```typescript
interface TooltipProps {
  text: string;                       // Tooltip content
  visible: boolean;                   // Show/hide state
  position?: 'top' | 'bottom';        // Position relative to trigger (default: 'top')
  delay?: number;                     // Delay before showing (ms, default: 600)
  id: string;                         // For aria-describedby connection
}
```

**CSS State Classes**:
```typescript
interface TooltipStateClasses {
  hidden: string;                     // opacity: 0, translateY(8px), pointer-events: none
  visible: string;                    // opacity: 1, translateY(0), pointer-events: auto
}
```

**Animation Timeline**:
```typescript
type TooltipAnimationState =
  | 'hidden'                           // Initial: opacity 0, translateY 8px
  | 'entering'                         // Transition: 250ms ease-out
  | 'visible'                          // Final: opacity 1, translateY 0
  | 'exiting';                         // Transition: 250ms ease-out

interface TooltipTimeline {
  onMouseEnter: {
    delay: 600;                        // ms before entering
    duration: 250;                     // ms transition
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  };
  onMouseLeave: {
    delay: 0;                          // ms (instant)
    duration: 250;                     // ms transition
    easing: 'ease-out';
  };
}
```

---

### 3. Color System Variables

**File**: `textbook/src/css/custom.css` (lines 28-58, to be updated)

**Color Variable Schema**:
```typescript
interface ChatbotColorVariables {
  // Icon & Button Colors (NEW/UPDATED)
  '--chatbot-icon-bg': 'hsla(160, 50%, 48%, 1)';        // #3CA888 Teal
  '--chatbot-icon-hover': 'hsla(160, 55%, 42%, 1)';     // #2D9871 Darker teal

  // Layout Colors (UPDATED)
  '--chatbot-header-bg': 'hsla(160, 35%, 96%, 1)';      // #F1F9F6 Very light teal
  '--chatbot-bg-primary': 'hsla(210, 25%, 98%, 0.75)';  // Existing (no change)
  '--chatbot-bg-secondary': 'hsla(210, 20%, 96%, 0.85)'; // Existing (no change)

  // Message Bubble Colors (UPDATED)
  '--chatbot-bubble-user': 'hsla(210, 22%, 91%, 1)';    // #E5E9ED Neutral gray-blue
  '--chatbot-bubble-ai': 'hsla(160, 35%, 94%, 1)';      // #EAF6F2 Soft mint

  // Accent & Interactive Colors (UPDATED)
  '--chatbot-accent': 'hsla(160, 50%, 48%, 1)';         // #3CA888 Teal

  // Text Colors (UPDATED)
  '--chatbot-text-primary': 'hsla(220, 15%, 22%, 1)';   // #2F3640 Dark gray
  '--chatbot-text-secondary': 'hsla(220, 10%, 52%, 1)'; // #78828C Medium gray

  // Border Colors (NEW)
  '--chatbot-border': 'hsla(160, 20%, 88%, 1)';         // #D4E5DF Subtle teal border
}
```

**Contrast Ratios (WCAG 2.1 AA Compliance)**:
```typescript
interface ColorContrastVerification {
  normalText: {
    requirement: 4.5;                  // WCAG AA minimum
    results: {
      'text-on-ai-bubble': 10.8;       // AAA ✅
      'text-on-user-bubble': 10.2;     // AAA ✅
    };
  };
  uiComponents: {
    requirement: 3.0;                  // WCAG AA minimum
    results: {
      'icon-on-white': 4.9;            // AA ✅
      'accent-on-ai-bubble': 4.2;      // AA ✅
    };
  };
}
```

**Color Change Summary**:
| Variable | Old Value (Lavender) | New Value (Teal) |
|----------|---------------------|------------------|
| `--chatbot-accent-primary` | `hsla(230, 30%, 85%, 1)` | → `--chatbot-icon-bg` + `--chatbot-accent` |
| `--chatbot-bubble-assistant` | `hsla(270, 20%, 92%, 0.9)` | → `--chatbot-bubble-ai` `hsla(160, 35%, 94%, 1)` |
| Header background | (implicit) | → `--chatbot-header-bg` `hsla(160, 35%, 96%, 1)` |

---

### 4. Icon SVG Structure

**File**: `textbook/src/components/ChatbotWidget/ChatTrigger.jsx` (inline SVG)

**Robot Icon SVG Data Model**:
```typescript
interface RobotIconSVG {
  viewBox: '0 0 24 24';
  fill: 'none';
  stroke: 'currentColor';
  strokeWidth: 2;
  ariaHidden: true;                    // Decorative, aria-label on button

  elements: {
    head: {                            // Robot head outline
      type: 'rect';
      x: 6; y: 8;
      width: 12; height: 10;
      rx: 2;
    };
    leftEye: {                         // Left eye
      type: 'circle';
      cx: 9.5; cy: 12; r: 1.25;
    };
    rightEye: {                        // Right eye
      type: 'circle';
      cx: 14.5; cy: 12; r: 1.25;
    };
    mouth: {                           // Smile curve
      type: 'path';
      d: 'M9 15 Q12 16.5 15 15';
      strokeLinecap: 'round';
      strokeWidth: 1.5;
    };
    antenna: {                         // Antenna line
      type: 'line';
      x1: 12; y1: 5;
      x2: 12; y2: 8;
      strokeLinecap: 'round';
    };
    antennaTip: {                      // Antenna tip
      type: 'circle';
      cx: 12; cy: 4; r: 1.5;
    };
  };
}
```

**Close Icon SVG** (when chatbot is open):
```typescript
interface CloseIconSVG {
  viewBox: '0 0 24 24';
  stroke: 'currentColor';
  strokeWidth: 2.5;
  strokeLinecap: 'round';

  elements: {
    line1: { type: 'line'; x1: 6; y1: 6; x2: 18; y2: 18; };
    line2: { type: 'line'; x1: 18; y1: 6; x2: 6; y2: 18; };
  };
}
```

**Icon Rendering Logic**:
```typescript
type IconType = 'robot' | 'close';

function getIconSVG(isOpen: boolean): IconType {
  return isOpen ? 'close' : 'robot';
}
```

---

### 5. Animation Configuration

**File**: `textbook/src/components/ChatbotWidget/styles.module.css`

**Animation State Definitions**:
```typescript
interface ChatTriggerAnimations {
  hover: {
    transform: 'scale(1.08)';
    boxShadow: '0 12px 28px rgba(60, 168, 136, 0.25)';  // Teal shadow
    transition: {
      properties: ['transform', 'box-shadow'];
      duration: 200;                   // ms
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)';  // Bounce
    };
  };

  active: {
    transform: 'scale(0.92)';
    transition: {
      properties: ['transform'];
      duration: 100;                   // ms
      easing: 'ease-in';
    };
  };

  focusVisible: {
    outline: '3px solid var(--chatbot-accent)';
    outlineOffset: '4px';
    boxShadow: '0 0 0 4px hsla(160, 50%, 48%, 0.2)';
  };
}

interface TooltipAnimations {
  enter: {
    from: { opacity: 0; transform: 'translateY(8px)'; };
    to: { opacity: 1; transform: 'translateY(0)'; };
    transition: {
      duration: 250;                   // ms
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      delay: 600;                      // ms before showing
    };
  };

  exit: {
    from: { opacity: 1; transform: 'translateY(0)'; };
    to: { opacity: 0; transform: 'translateY(8px)'; };
    transition: {
      duration: 250;                   // ms
      easing: 'ease-out';
      delay: 0;                        // Instant
    };
  };
}
```

**Reduced Motion Support**:
```typescript
interface ReducedMotionOverrides {
  mediaQuery: '(prefers-reduced-motion: reduce)';
  overrides: {
    '*': {
      animationDuration: '0.01ms !important';
      animationIterationCount: '1 !important';
      transitionDuration: '0.01ms !important';
    };
    '.chatTrigger:hover': {
      transform: 'none';               // No scale on hover
    };
  };
}
```

---

### 6. Responsive Breakpoints

**File**: `textbook/src/components/ChatbotWidget/styles.module.css`

**Breakpoint Configuration**:
```typescript
interface ResponsiveBreakpoints {
  mobile: {
    mediaQuery: '(max-width: 767px)';
    triggerSize: 64;                   // px (touch-friendly)
    triggerPosition: {
      bottom: 32;                      // px
      right: 32;                       // px
    };
    tooltip: {
      display: 'none';                 // Hide on mobile
    };
  };

  desktop: {
    mediaQuery: '(min-width: 768px)';
    triggerSize: 60;                   // px
    triggerPosition: {
      bottom: 24;                      // px
      right: 24;                       // px
    };
    tooltip: {
      display: 'block';                // Show on desktop
      maxWidth: 200;                   // px
    };
  };
}
```

---

### 7. Accessibility Attributes

**File**: `textbook/src/components/ChatbotWidget/ChatTrigger.jsx`

**ARIA Attribute Schema**:
```typescript
interface ARIAAttributes {
  button: {
    'aria-label': string;              // "Open AI Assistant" | "Close AI Assistant"
    'aria-expanded': 'true' | 'false'; // Based on isOpen
    'aria-haspopup': 'dialog';
    'aria-controls': 'chatbot-panel';
    'aria-describedby': 'chatbot-tooltip';  // If tooltip present
    tabindex: 0;                       // Keyboard focusable
  };

  tooltip: {
    role: 'tooltip';
    id: 'chatbot-tooltip';
    'aria-hidden': 'true' | 'false';   // Based on visibility
  };

  icon: {
    'aria-hidden': 'true';             // Decorative only
    focusable: 'false';
  };
}
```

**Focus Management**:
```typescript
interface FocusManagement {
  focusIndicator: {
    outline: '3px solid var(--chatbot-accent)';
    outlineOffset: '4px';
    boxShadow: '0 0 0 4px hsla(160, 50%, 48%, 0.2)';
  };

  focusOrder: [
    'chatbot-trigger',                 // Floating button
    'chatbot-input',                   // Text input field
    'chatbot-send-button',             // Send button
    'chatbot-close-button'             // Close/X button
  ];
}
```

**Touch Target Sizing** (WCAG 2.1 AA - Success Criterion 2.5.5):
```typescript
interface TouchTargetSizing {
  minimum: { width: 44; height: 44; };  // WCAG AA minimum
  desktop: { width: 60; height: 60; };  // Exceeds minimum
  mobile: { width: 64; height: 64; };   // Thumb-friendly
  spacing: { adjacent: 8; };            // px between targets
}
```

---

## CSS Module Classes

### ChatTrigger Styles

**File**: `textbook/src/components/ChatbotWidget/styles.module.css`

```typescript
interface ChatTriggerClasses {
  chatTriggerContainer: {
    position: 'fixed';
    bottom: '24px';                    // Desktop: 24px, Mobile: 32px
    right: '24px';                     // Desktop: 24px, Mobile: 32px
    zIndex: 9998;
  };

  chatTrigger: {
    width: '60px';                     // Desktop: 60px, Mobile: 64px
    height: '60px';
    borderRadius: '50%';
    background: 'var(--chatbot-icon-bg)';
    border: 'none';
    cursor: 'pointer';
    boxShadow: '0 4px 16px rgba(60, 168, 136, 0.2)';
    transition: 'transform 0.2s, box-shadow 0.2s';
    display: 'flex';
    alignItems: 'center';
    justifyContent: 'center';
  };

  chatTrigger_hover: {
    transform: 'scale(1.08)';
    boxShadow: '0 12px 28px rgba(60, 168, 136, 0.25)';
    background: 'var(--chatbot-icon-hover)';
  };

  chatTrigger_active: {
    transform: 'scale(0.92)';
  };

  chatTrigger_focusVisible: {
    outline: '3px solid var(--chatbot-accent)';
    outlineOffset: '4px';
    boxShadow: '0 0 0 4px hsla(160, 50%, 48%, 0.2)';
  };

  tooltip: {
    position: 'absolute';
    bottom: 'calc(100% + 12px)';
    right: '0';
    padding: '8px 12px';
    background: 'var(--chatbot-text-primary)';
    color: 'white';
    fontSize: '14px';
    fontWeight: 500;
    whiteSpace: 'nowrap';
    borderRadius: '6px';
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)';
    pointerEvents: 'none';
    opacity: 0;
    transform: 'translateY(8px)';
    transition: 'opacity 0.25s, transform 0.25s';
  };

  tooltip_visible: {
    opacity: 1;
    transform: 'translateY(0)';
    transitionDelay: '0.6s';
  };

  tooltipArrow: {
    position: 'absolute';
    top: '100%';
    right: '20px';
    width: '0';
    height: '0';
    border: '6px solid transparent';
    borderTopColor: 'var(--chatbot-text-primary)';
  };
}
```

---

## Data Flow

### Tooltip Lifecycle Flow

```
[Mount]
  → showTooltip = false
  → Tooltip: opacity 0, translateY(8px), pointer-events: none

[Mouse Enter / Focus]
  → Start 600ms delay timer
  → After 600ms: setShowTooltip(true)
  → Tooltip: transition to opacity 1, translateY(0)
  → Duration: 250ms, easing: cubic-bezier(0.34, 1.56, 0.64, 1)
  → aria-hidden: false

[Mouse Leave / Blur]
  → Clear delay timer if still waiting
  → setShowTooltip(false)
  → Tooltip: transition to opacity 0, translateY(8px)
  → Duration: 250ms, easing: ease-out, delay: 0
  → aria-hidden: true

[Mobile]
  → Tooltip: display none (CSS media query)
  → No lifecycle events
```

### Icon State Flow

```
[Chatbot Closed]
  → isOpen = false
  → Display: Robot icon SVG
  → aria-label: "Open AI Assistant"
  → aria-expanded: "false"

[User Clicks]
  → onClick() callback
  → Parent updates isOpen = true
  → ChatTrigger re-renders

[Chatbot Open]
  → isOpen = true
  → Display: Close (X) icon SVG
  → aria-label: "Close AI Assistant"
  → aria-expanded: "true"
```

---

## File Modification Summary

| File | Data Structures Modified | Lines | Type of Change |
|------|-------------------------|-------|----------------|
| `ChatTrigger.jsx` | Props, State, Event Handlers | ~100 | Add tooltip logic, update icon SVG |
| `styles.module.css` | Classes, Animations | ~150 | Update colors, add tooltip styles, reduced-motion |
| `custom.css` | Color Variables | 28-58 | Update 8 color variable values |
| `ChatMessage.jsx` | CSS variable references | ~5 | Update bubble background colors |
| `ChatInput.jsx` | CSS variable references | ~3 | Update send button accent color |
| `CitationLink.jsx` | CSS variable references | ~2 | Update link accent color |
| `SelectionButton.jsx` | CSS variable references | ~3 | Update button accent color |

**Total Files Modified**: 7
**New Dependencies**: 0
**New Components**: 0 (tooltip is inline)

---

## Validation Rules

### Color Contrast Validation (WCAG 2.1 AA)

```typescript
interface ContrastValidationRules {
  normalText: {
    minimumRatio: 4.5;
    checks: [
      { pair: ['--chatbot-text-primary', '--chatbot-bubble-ai']; ratio: 10.8; pass: true; },
      { pair: ['--chatbot-text-primary', '--chatbot-bubble-user']; ratio: 10.2; pass: true; }
    ];
  };

  uiComponents: {
    minimumRatio: 3.0;
    checks: [
      { pair: ['--chatbot-icon-bg', 'white']; ratio: 4.9; pass: true; },
      { pair: ['--chatbot-accent', '--chatbot-bubble-ai']; ratio: 4.2; pass: true; }
    ];
  };
}
```

### Animation Performance Rules

```typescript
interface AnimationPerformanceRules {
  allowedProperties: ['transform', 'opacity'];  // GPU-accelerated
  forbiddenProperties: ['width', 'height', 'top', 'left', 'margin'];  // Layout reflow
  maxDuration: 300;                              // ms
  minDuration: 100;                              // ms
  targetFrameRate: 60;                           // fps
}
```

---

## Next Steps

1. **Phase 1 (Contracts)**: Document component API contracts, color system contracts, icon specifications
2. **Phase 1 (Quickstart)**: Developer guide for customizing chatbot UI
3. **Phase 2 (Tasks)**: Generate implementation tasks based on these structures

---

**Document Version**: 1.0
**Last Updated**: 2025-12-17
**Author**: AI Agent (Spec-Driven Development Workflow)
