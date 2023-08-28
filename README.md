RemoteSVG
=======

RemoteSVG is a React component for efficiently loading SVG icons from remote sources.

Features
--------

-   Lazy loading: Icons are fetched only when they become visible on the screen, improving performance.
-   Customizable colors and effects: Supports customization of the icon appearance in different states - default, hover, active, and disabled.
-   Dark mode support: Ability to specify different icon variants for light and dark themes.
-   Flexible dimensions: Allows customization of the width and height of the icon.
-   Accessibility: Supports setting the alt text and title attributes for better accessibility.
-   **State-based SVG loading**: You can load a separate SVG for each state (default, hover, active, and disabled) by organizing them in appropriate folders and enabling the corresponding prop.

Installation
------------

```bash
# Using npm
npm install react-remote-svg

# Using yarn
yarn add react-remote-svg
```

Usage
-----

```javascript
import React from 'react';
import RemoteSVG from 'react-remote-svg';

const MyComponent = () => (
  <div>
    <RemoteSVG  
      basePath="https://example.com/icons"
      iconName="icon"
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

Props
-----

| Prop              | Type          | Description                                            |
|-------------------|---------------|--------------------------------------------------------|
| activeEffect      | CSSProperties | Styles for active state.                               |
| alt               | string        | Alternative text for accessibility.                    |
| basePath          | string        | The base path of the SVG icon.                         |
| dark              | boolean       | Whether to use dark theme variant.                     |
| disabledEffect    | CSSProperties | Styles for disabled state.                             |
| height            | number|string | Height of the icon.                                    |
| hoverEffect       | CSSProperties | Styles for hover state.                                |
| iconName          | string        | The name of the icon (without .svg)                    |
| lazyLoad          | boolean       | Enable lazy loading when visible.                      |
| title             | string        | Title text for accessibility.                          |
| useActiveImage    | boolean       | Whether to use active image variant.                   |
| useDisabledImage  | boolean       | Whether to use disabled image variant.                 |
| useHoverImage     | boolean       | Whether to use hover image variant.                    |
| width             | number|string | Width of the icon.                                     |

Image variants
--------------

By default, the image variants are:

- Normal variant
    - light mode: `basePath/light/iconName.svg`
    - dark mode: `basePath/dark/iconName.svg`
- Hover variant
    - light mode: `basePath/light/hover/iconName.svg`
    - dark mode: `basePath/dark/hover/iconName.svg`
- Disabled variant
    - light mode: `basePath/light/disabled/iconName.svg`
    - dark mode: `basePath/dark/disabled/iconName.svg`
- Active variant
    - light mode: `basePath/light/active/iconName.svg`
    - dark mode: `basePath/dark/active/iconName.svg`

This means that:

- In light mode, the `light` folder is used
- In dark mode, the `dark` folder is used

Custom folder
-------------

When using a `customFolder`, it overrides this behavior. So if you specify:

```javascript
customFolder="flags"
```

The image variants will be:

- Normal variant
    - light mode: `basePath/flags/iconName.svg`
    - dark mode: `basePath/flags/iconName.svg`
- Hover variant
    - light mode: `basePath/flags/hover/iconName.svg`
    - dark mode: `basePath/flags/hover/iconName.svg`
- Disabled variant
    - light mode: `basePath/flags/disabled/iconName.svg`
    - dark mode: `basePath/flags/disabled/iconName.svg`
- Active variant
    - light mode: `basePath/flags/active/iconName.svg`
    - dark mode: `basePath/flags/active/iconName.svg`

This means that when specifying a `customFolder`, it will be used instead of the default `light`/`dark` folder names. But `hover`/`active`/`disabled` parts remain the same, they are just nested inside the `customFolder` path.

Testing
-------

To test components that depend on RemoteSVG, you can use a mock component in your tests. Here's how you can do it:

1. In your test setup file (e.g., `jest.setup.js`), add the following line to import and use the mock component:

```javascript
require('react-remote-svg/mock');
```

2. Now, you can use the RemoteSVG component in your tests to verify the behavior of components that depend on RemoteSVG.