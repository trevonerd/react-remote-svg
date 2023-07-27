# RemoteSVG
RemoteSVG is a React component for efficiently loading SVG icons from remote sources.

## Features
- Lazy loading: Icons are fetched only when they become visible on the screen, improving performance.

- Customizable colors and effects: Supports customization of the icon appearance in different states - default, hover, active, and disabled.

- Dark mode support: Ability to specify different icon variants for light and dark themes.

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
      url="icon.svg"
      dark
      isDisabled
      useDisabledImage
      alt="My Icon" 
      width={24}
      height={24}
      disabledEffect={{ filter: 'grayscale(100%)' }} 
    />
  </div> 
);

export default MyComponent;
```

## Props
| Prop             | Type           | Description                            |
| ---------------- | -------------- | -------------------------------------- |
| url              | string         | The URL of the SVG icon.               |
| alt              | string         | Alternative text for accessibility.    |
| title            | string         | Title text for accessibility.          |
| width            | number\|string | Width of the icon.                     |
| height           | number\|string | Height of the icon.                    |
| activeEffect     | CSSProperties  | Styles for active state.               |
| disabledEffect   | CSSProperties  | Styles for disabled state.             |
| hoverEffect      | CSSProperties  | Styles for hover state.                |
| dark             | boolean        | Whether to use dark theme variant.     |
| useDisabledImage | boolean        | Whether to use disabled image variant. |
| useActiveImage   | boolean        | Whether to use active image variant.   |
| useHoverImage    | boolean        | Whether to use hover image variant.    |
| lazyLoad         | boolean        | Enable lazy loading when visible.      |

## Testing

To test components that depend on `RemoteSVG`, you can use a mock component in your tests. Here's how you can do it:

1. In your test setup file (e.g., `jest.setup.js`), add the following line to import and use the mock component:

```javascript
require('react-remote-svg/mock');
```

2. Now, you can use the RemoteSVG component in your tests to verify the behavior of components that depend on RemoteSVG.
