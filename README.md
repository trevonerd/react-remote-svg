# RemoteSVG
RemoteSVG is a React component for efficiently loading SVG icons from remote sources.

## Features
- Lazy loading: Icons are fetched only when they become visible on the screen, improving performance.
- Customizable colors and effects: Supports customization of the icon appearance in different states: default, hover, active, and disabled.
- Flexible dimensions: Allows customization of the width and height of the icon.
- Accessibility: Supports setting the alt text and title attributes for better accessibility.

## Installation

```bash
# Using npm
npm install react-remote-svg

# Using yarn
yarn add react-remote-svg
```

## Usage

```jsx
import React from 'react';
import RemoteSVG from 'react-remote-svg';

const MyComponent = () => (
  <div>
    <RemoteSVG 
      url="http://example.com/my-icon.svg"
      alt="My Icon"
      title="My Icon Title"
      width={24}
      height={24}
      hoverEffect={{ filter: 'brightness(1.2)' }}
      activeEffect={{ border: '2px solid red', borderRadius: '50%' }}
      disabledEffect={{ filter: 'grayscale(100%)' }}
    />
  </div>
);

export default MyComponent;
```

## Props
| Prop              | Type               | Description                                         |
|-------------------|--------------------|-----------------------------------------------------|
| url               | string             | The URL of the SVG icon.                            |
| alt               | string             | The alternative text for the icon (for accessibility).|
| title             | string             | The title attribute for the icon (for accessibility).|
| width             | number \| string   | The width of the SVG icon.                          |
| height            | number \| string   | The height of the SVG icon.                         |
| activeEffect     | React.CSSProperties | CSS properties for customizing the active state of the icon. |
| disabledEffect   | React.CSSProperties | CSS properties for customizing the disabled state of the icon. |
| hoverEffect      | React.CSSProperties | CSS properties for customizing the hover state of the icon. |
| isActive          | boolean            | Whether the SVG icon is in an active state.          |
| isDisabled        | boolean            | Whether the SVG icon is in a disabled state.        |
| lazyLoad          | boolean            | Whether to lazy load the SVG icon when it appears in the viewport.        |

## Testing

To test components that depend on `RemoteSVG`, you can use a mock component in your tests. Here's how you can do it:

1. In your test setup file (e.g., `jest.setup.js`), add the following line to import and use the mock component:

```javascript
require('react-remote-svg/mock');
```

2. Now, you can use the RemoteSVG component in your tests to verify the behavior of components that depend on RemoteSVG.
