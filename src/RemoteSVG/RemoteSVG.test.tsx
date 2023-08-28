import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import RemoteSVG from './RemoteSVG';

const mockBasePath = 'https://test-url.com';
const mockIconName = 'test';

describe('RemoteSVG Component', () => {
  beforeEach(() => {
    (global.IntersectionObserver as jest.Mock) = jest
      .fn()
      .mockImplementation((callback: IntersectionObserverCallback) => {
        const entries = [
          {
            isIntersecting: true,
          },
        ];
        // @ts-expect-error IntersectionObserver is a mock
        setTimeout(() => callback(entries, null), 0);

        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render SVG', async () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        alt="test image"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render SVG with active or disabled effect if isActive and isDisabled props are false', async () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        disabledEffect={{ opacity: '0.5' }}
        activeEffect={{
          backgroundColor: '#f40000',
        }}
        lazyLoad={true}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should renders SVG with correct alt and title attributes', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        title="test image title"
        alt="test image alt"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should renders SVG with custom width and height as numbers', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        height={100}
        width={100}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should renders SVG with custom width and height as strings', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        height={'100px'}
        width={'100px'}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - should load the correct image variant when hovered', () => {
    const { getByRole } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
      />,
    );

    const img = getByRole('img');
    const defaultSrc = img.getAttribute('src');

    // Simulate mouseEnter event
    fireEvent.mouseEnter(img);

    const hoverSrc = img.getAttribute('src');
    expect(hoverSrc).toBe('https:/test-url.com/light/hover/test.svg');

    // Simulate mouseLeave event
    fireEvent.mouseLeave(img);

    const newDefaultSrc = img.getAttribute('src');
    expect(newDefaultSrc).toBe(defaultSrc);
  });

  it('light mode - should load the correct image variant with hoverEffect when hovered', () => {
    const { asFragment, getByRole } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
        hoverEffect={{ filter: 'brightness(0.9)' }}
      />,
    );

    const img = getByRole('img');
    const defaultSrc = img.getAttribute('src');

    // Simulate mouseEnter event
    fireEvent.mouseEnter(img);

    const hoverSrc = img.getAttribute('src');
    expect(hoverSrc).toBe('https:/test-url.com/light/hover/test.svg');

    // Simulate mouseLeave event
    fireEvent.mouseLeave(img);

    const newDefaultSrc = img.getAttribute('src');
    expect(newDefaultSrc).toBe(defaultSrc);

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - should load the correct image variant if isActive', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - should load the correct image variant if isActive with activeEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
        activeEffect={{ filter: 'brightness(0.8)' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - should load the correct image variant if isDisabled', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - should load the correct image variant if isDisabled with disabledEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
        disabledEffect={{ filter: 'contrast(0.8)' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant when hovered', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant with hoverEffect when hovered', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
        hoverEffect={{ filter: 'brightness(0.9)' }}
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant if isActive', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant if isActive with activeEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
        activeEffect={{ filter: 'brightness(0.8)' }}
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant if isDisabled', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - should load the correct image variant if isDisabled with disabledEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
        disabledEffect={{ filter: 'contrast(0.8)' }}
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant when hovered', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
        dark
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant with hoverEffect when hovered', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        useImageHover
        hoverEffect={{ filter: 'brightness(0.9)' }}
        dark
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant if isActive', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant if isActive with activeEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isActive
        useImageActive
        activeEffect={{ filter: 'brightness(0.8)' }}
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant if isDisabled', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('customFolder - should load the correct image variant if isDisabled with disabledEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        basePath={mockBasePath}
        iconName={mockIconName}
        isDisabled
        useImageDisabled
        disabledEffect={{ filter: 'contrast(0.8)' }}
        customFolder="flags"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
