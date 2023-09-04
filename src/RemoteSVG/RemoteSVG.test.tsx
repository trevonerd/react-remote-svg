import React from 'react';
import { render } from '@testing-library/react';

import RemoteSVG from './RemoteSVG';

const mockUrl = 'https://test-url.com/test.svg';

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

  it('renders SVG', async () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        alt="test image"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders active SVG correctly', async () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isActive
        activeEffect={{
          backgroundColor: '#f40000',
        }}
        lazyLoad
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled SVG correctly', async () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isDisabled
        disabledEffect={{ opacity: '0.5' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG with hover correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        hoverEffect={{ filter: 'brightness(0.8)' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not renders SVG with active, disabled effect if isActive or isDisabled props are false', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        disabledEffect={{ opacity: '0.5' }}
        activeEffect={{
          backgroundColor: '#f40000',
        }}
        lazyLoad={true}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG with correct alt and title attributes', () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        title="test image title"
        alt="test image alt"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - loads the correct image variant if isActive', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isActive
        useImageActive
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - loads the correct image variant if isActive with activeEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isActive
        useImageActive
        activeEffect={{ filter: 'brightness(0.8)' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - loads the correct image variant if isDisabled', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isDisabled
        useImageDisabled
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('light mode - loads the correct image variant if isDisabled with disabledEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isDisabled
        useImageDisabled
        disabledEffect={{ filter: 'contrast(0.8)' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - loads the correct image variant if isActive', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isActive
        useImageActive
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - loads the correct image variant if isActive with activeEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isActive
        useImageActive
        activeEffect={{ filter: 'brightness(0.8)' }}
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - loads the correct image variant if isDisabled', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isDisabled
        useImageDisabled
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dark mode - loads the correct image variant if isDisabled with disabledEffect', () => {
    const { asFragment } = render(
      <RemoteSVG
        url="image.png"
        isDisabled
        useImageDisabled
        disabledEffect={{ filter: 'contrast(0.8)' }}
        dark
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
