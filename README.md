# RemoteSVG
RemoteSVG is a React component to efficiently load SVG icons remotely.

## Features
The component uses the Intersection Observer API to only fetch icons when they become visible on the screen, improving the performance of your application.
It provides configurable caching functionality, reducing the number of requests for the same icons.
It gives you control over the colors of the icon in different states: default, hover, active, and disabled.
It supports fully customizable width and height.

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
import RemoteSVG from './RemoteSVG';

const MyComponent = () => (
  <div>
    <RemoteSVG 
      url="http://example.com/my-icon.svg"
      color="#000000"
      hoverColor="#666666"
      activeColor="#333333"
      disabledColor="#999999"
      width={24}
      height={24}
      cacheDuration={60}
      cacheable={true}
      isActive={false}
      isDisabled={false}
    />
  </div>
);

export default MyComponent;
```

## Props
| Prop          | Type             | Description                                         |
|---------------|------------------|-----------------------------------------------------|
| url           | string           | The URL of the SVG icon.                            |
| color         | string           | The default color of the SVG icon.                  |
| hoverColor    | string           | The color of the SVG icon on hover.                 |
| activeColor   | string           | The color of the SVG icon when active.              |
| disabledColor | string           | The color of the SVG icon when disabled.            |
| width         | number \| string | The width of the SVG icon.                          |
| height        | number \| string | The height of the SVG icon.                         |
| cacheDuration | number           | The duration to cache the SVG icon, in seconds.     |
| cacheable     | boolean          | Whether the SVG icon should be cached.              |
| isActive      | boolean          | Whether the SVG icon is in an active state.         |
| isDisabled    | boolean          | Whether the SVG icon is in a disabled state.        |

## Testing

To test components that depend on `RemoteSVG`, you can use a mock component in your tests. Here's how you can do it:

1. In your test setup file (e.g., `jest.setup.js`), add the following lines to import and use the mock component:

```javascript
require('react-remote-svg/mock');
```

2. Now, you can use the RemoteSVG component in your assertions and tests to verify the behavior of components that depend on RemoteSVG.