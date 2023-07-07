import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { get, set, del, keys } from 'idb-keyval';

const RESET_INTERVAL_MINUTES = 10;
const OBSERVER_OPTIONS = { threshold: 0.1, rootMargin: '200px' };
const DEFAULT_CACHE_DURATION = 60;

const supportsIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;
const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

const cacheableByDefault = supportsIndexedDB && supportsIntersectionObserver;

export interface RemoteSVGProps extends React.HTMLAttributes<HTMLSpanElement> {
  url: string;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  disabledColor?: string;
  width?: number | string;
  height?: number | string;
  cacheDuration?: number;
  cacheable?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
}

const StyledSVGContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSVG = styled.i<{
  width: number | string;
  height: number | string;
  hoverColor?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  color?: string;
  activeColor?: string;
  disabledColor?: string;
}>`
  display: flex;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  cursor: ${({ hoverColor, isDisabled }) => (hoverColor && !isDisabled ? 'pointer' : 'inherit')};

  ${({ hoverColor, isDisabled }) =>
    (hoverColor || !isDisabled) &&
    css`
      &:hover {
        svg {
          & * {
            fill: ${hoverColor};
          }
        }
      }
    `}

  & svg {
    width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
    height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};

    & * {
      fill: ${({ isActive, isDisabled, color, activeColor, disabledColor }) => {
        if (isActive) {
          return activeColor || color;
        }
        if (isDisabled) {
          return disabledColor || color;
        }
        return color;
      }};
    }
  }
`;

const fetchPromises: { [url: string]: Promise<string> } = {};
let cacheResetDone = false;

export const resetGlobalCache = () => {
  cacheResetDone = false;
};

const RemoteSVG: React.FC<RemoteSVGProps> = ({
  url,
  color,
  hoverColor,
  activeColor,
  disabledColor,
  width = 24,
  height = 24,
  cacheDuration = DEFAULT_CACHE_DURATION,
  cacheable = cacheableByDefault,
  isActive = false,
  isDisabled = false,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const cacheKey = useMemo(() => url.split('/').pop() || null, [url]);

  const fetchSvg = useCallback((): Promise<string> => {
    if (!fetchPromises[url]) {
      fetchPromises[url] = fetch(url)
        .then(response => response.text())
        .then(svgText => {
          if (cacheable) {
            set(`remote_svg_${cacheKey}`, svgText);
            set(`remote_svg_${cacheKey}_timestamp`, Date.now().toString());
          }
          return svgText;
        })
        .catch(error => {
          console.error('Error fetching SVG:', url, error);
          return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#333" stroke-width="2" d="M2.998 1H17.5L21 4.5V23H3L2.998 1ZM16 1v5h5M9 12l6 6m0-6-6 6"/></svg>';
        })
        .finally(() => {
          delete fetchPromises[url];
        });
    }
    return fetchPromises[url] as Promise<string>;
  }, [url, cacheable, cacheKey]);

  useEffect(() => {
    if (!cacheKey) return;

    if (!supportsIntersectionObserver || typeof IntersectionObserver === 'undefined') {
      fetchSvg().then(svgText => {
        setSvgContent(svgText);
        setIsLoaded(true);
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        get(`remote_svg_${cacheKey}`).then((cachedSVG: string) => {
          get(`remote_svg_${cacheKey}_timestamp`).then((cachedTimestamp: string) => {
            if (cachedSVG && cachedTimestamp && cacheable) {
              const cacheDurationMilliseconds = cacheDuration * 1000;
              const cacheExpirationTime = parseInt(cachedTimestamp as string, 10) + cacheDurationMilliseconds;

              if (Date.now() < cacheExpirationTime) {
                setSvgContent(cachedSVG as string);
                setIsLoaded(true);
              } else {
                fetchSvg().then(svgText => {
                  setSvgContent(svgText);
                  setIsLoaded(true);
                });
              }
            } else {
              fetchSvg().then(svgText => {
                setSvgContent(svgText);
                setIsLoaded(true);
              });
            }

            if (wrapperRef.current) {
              observer.unobserve(wrapperRef.current);
            }
          });
        });
      }
    }, OBSERVER_OPTIONS);

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [url, cacheKey, cacheDuration, fetchSvg, cacheable]);

  useEffect(() => {
    if (!cacheResetDone) {
      if (typeof window !== 'undefined') {
        get('remote_svg_global_timestamp').then((retrievedTimestamp: string) => {
          let globalTimestamp = retrievedTimestamp;

          if (!globalTimestamp) {
            globalTimestamp = Date.now().toString();
            set('remote_svg_global_timestamp', globalTimestamp);
          }

          if (globalTimestamp) {
            const resetIntervalMilliseconds = RESET_INTERVAL_MINUTES * 60 * 1000;
            const resetTime = parseInt(globalTimestamp as string, 10) + resetIntervalMilliseconds;

            if (Date.now() >= resetTime) {
              keys().then((keyList: IDBValidKey[]) => {
                keyList.forEach((key: IDBValidKey) => {
                  if (typeof key === 'string' && (key.endsWith('_timestamp') || key.endsWith('.svg'))) {
                    del(key);
                  }
                });
                console.info('SVG cache reset');

                set('remote_svg_global_timestamp', Date.now().toString());
              });
            }
          }
        });

        cacheResetDone = true;
      }
    }
  }, []);

  return (
    <StyledSVGContainer
      ref={wrapperRef}
      {...rest}
    >
      {isLoaded && svgContent ? (
        <StyledSVG
          width={width}
          height={height}
          hoverColor={hoverColor}
          isActive={isActive}
          isDisabled={isDisabled}
          color={color}
          activeColor={activeColor}
          disabledColor={disabledColor}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgContent) }}
        />
      ) : (
        <span
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            display: 'inline-block',
          }}
        />
      )}
    </StyledSVGContainer>
  );
};

export default RemoteSVG;
