import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import RemoteSVG from './RemoteSVG';


const mockSVGContent = '<svg data-testid="remote-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>';
const mockUrl = 'https://test-url.com/test.svg';

describe('RemoteSVG Component', () => {
  beforeEach(() => {
    (window.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockSVGContent),
      }),
    );

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

  it('fetches svg and renders', async () => {
    const { asFragment } = render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders active SVG correctly', async () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isActive={true}
        activeColor={'#f40000'}
        lazyLoad={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled SVG correctly', async () => {
    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isDisabled={true}
        disabledColor={'#333333'}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG with hover correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        hoverColor={'#f67645'}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches SVG when not available in cache', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    (global.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockSVGContent),
      }),
    );

    const { asFragment } = render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG correctly with custom width and height as strings', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        width={'100px'}
        height={'100px'}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG correctly with custom width and height as numbers', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        width={100}
        height={100}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders active SVG correctly without active color', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isActive={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled SVG correctly without active color', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isDisabled={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('no url provided', async () => {
    const mockUrl = '';

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isDisabled={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches svg and renders if intersectionObserver is undefined', async () => {
    const originalIntersectionObserver = window.IntersectionObserver;
    // @ts-expect-error deleting window.IntersectionObserver
    delete window.IntersectionObserver;

    const mockUrl = 'https://test-url.com/test.svg';

    const { asFragment } = render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();

    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('handles fetch error correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    (window.fetch as jest.Mock) = jest.fn().mockImplementation(() => Promise.reject('Network error'));

    global.console = { error: jest.fn() } as unknown as Console;

    const { asFragment } = render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
      expect(console.error).toBeCalledWith('Error fetching SVG:', mockUrl, 'Network error');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
