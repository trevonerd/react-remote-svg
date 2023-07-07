import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { del, get, keys, set } from 'idb-keyval';

import '../__mocks__/intersectionObserverMock';
import '../__mocks__/idexedDBMock';

import RemoteSVG, { resetGlobalCache } from './RemoteSVG';

jest.mock('idb-keyval');

describe('RemoteSVG Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalFetch: any;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  const mockSVGContent = '<svg data-testid="remote-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>';

  (window.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockSVGContent),
    }),
  );

  it('fetches svg and renders', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

    const { asFragment } = render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly when using cache', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';
    const timestamp = Date.now().toString();

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(mockSVGContent);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(timestamp);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(timestamp);
      }
    });

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        cacheDuration={10}
      />,
    );

    await waitFor(() => {
      expect(get).toBeCalledTimes(2);

      const svgElement = screen.getByTestId('remote-svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(asFragment).toMatchSnapshot();
  });

  it('renders correctly when the SVG is not loaded', async () => {
    const mockUrl = 'https://test-url.com/test.svg';

    render(<RemoteSVG url={mockUrl} />);

    await waitFor(() => {
      expect(global.fetch).not.toBeCalled();
    });

    const svgElement = screen.queryByRole('img');
    expect(svgElement).not.toBeInTheDocument();
  });

  it('renders active SVG correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isActive={true}
        activeColor={'#f40000'}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled SVG correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG with hover correctly', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        hoverColor={'#f67645'}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches SVG when not available in cache', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';
    const timestamp = Date.now().toString();

    // Simulate the scenario where SVG content is not available in the cache
    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(mockSVGContent);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(timestamp);
      }
    });

    (global.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockSVGContent),
      }),
    );

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        cacheDuration={0}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('resets the SVG cache', async () => {
    resetGlobalCache();

    const cacheKey = 'test.svg';
    const mockUrl = 'https://test-url.com/test.svg';

    const keysMock = jest
      .fn()
      .mockResolvedValue([`remote_svg_${cacheKey}`, `remote_svg_${cacheKey}_timestamp`, 'remote_svg_global_timestamp']);

    const delMock = jest.fn().mockResolvedValue(undefined);

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(parseInt(Date.now().toString() as string, 10) - 1000000);
      }
    });

    (del as jest.Mock) = delMock;
    (keys as jest.Mock) = keysMock;

    render(
      <RemoteSVG
        url={mockUrl}
        cacheDuration={10}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);

      expect(del).toBeCalledTimes(3);
      expect(del).toBeCalledWith(`remote_svg_${cacheKey}`);
      expect(del).toBeCalledWith(`remote_svg_${cacheKey}_timestamp`);
      expect(del).toBeCalledWith('remote_svg_global_timestamp');
    });

    const svgElement = await screen.findByTestId('remote-svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toMatchSnapshot();
  });

  it('sets global timestamp if it does not exist', async () => {
    resetGlobalCache();

    const cacheKey = 'test.svg';
    const mockUrl = 'https://test-url.com/test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(mockSVGContent);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(Date.now().toString());
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null); // Ensure the global timestamp does not exist
      }
    });

    const setMock = jest.fn().mockResolvedValue(undefined);
    (set as jest.Mock) = setMock;

    render(
      <RemoteSVG
        url={mockUrl}
        cacheDuration={10}
      />,
    );

    await waitFor(() => {
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith('remote_svg_global_timestamp', expect.any(String));
    });

    const svgElement = await screen.findByTestId('remote-svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toMatchSnapshot();
  });

  it('renders SVG correctly with custom width and height as strings', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders SVG correctly with custom width and height as numbers', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders active SVG correctly without active color', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isActive={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(mockUrl);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled SVG correctly without active color', async () => {
    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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

  it('no url provided', async () => {
    const mockUrl = '';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

    const { asFragment } = render(
      <RemoteSVG
        url={mockUrl}
        isDisabled={true}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).not.toBeCalled();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches svg and renders if intersectionObserver is undefined', async () => {
    const originalIntersectionObserver = window.IntersectionObserver;
    // @ts-expect-error deleting window.IntersectionObserver
    delete window.IntersectionObserver;

    const mockUrl = 'https://test-url.com/test.svg';
    const cacheKey = 'test.svg';

    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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
    const cacheKey = 'test.svg';

    (window.fetch as jest.Mock) = jest.fn().mockImplementation(() => Promise.reject('Network error'));
    (get as jest.Mock).mockImplementation(key => {
      if (key === `remote_svg_${cacheKey}`) {
        return Promise.resolve(null);
      }
      if (key === `remote_svg_${cacheKey}_timestamp`) {
        return Promise.resolve(null);
      }
      if (key === 'remote_svg_global_timestamp') {
        return Promise.resolve(null);
      }
    });

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
