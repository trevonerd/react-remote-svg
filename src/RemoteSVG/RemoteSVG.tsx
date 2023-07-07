import React, { useEffect, useState, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const OBSERVER_OPTIONS = { threshold: 0.1, rootMargin: '200px' };

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export interface RemoteSVGProps extends React.HTMLAttributes<HTMLSpanElement> {
  url: string;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  disabledColor?: string;
  width?: number | string;
  height?: number | string;
  isActive?: boolean;
  isDisabled?: boolean;
  lazyLoad?: boolean;
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

const RemoteSVG: React.FC<RemoteSVGProps> = ({
  url,
  color,
  hoverColor,
  activeColor,
  disabledColor,
  width = 24,
  height = 24,
  isActive = false,
  isDisabled = false,
  lazyLoad = supportsIntersectionObserver,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const fetchSvg = useCallback((): Promise<string> => {
    return fetch(url)
      .then(response => response.text())
      .then(svgText => {
        return svgText;
      })
      .catch(error => {
        console.error('Error fetching SVG:', url, error);
        return '<svg data-id="image-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#333" stroke-width="2" d="M2.998 1H17.5L21 4.5V23H3L2.998 1ZM16 1v5h5M9 12l6 6m0-6-6 6"/></svg>';
      });
  }, [url]);

  useEffect(() => {
    if (!lazyLoad) {
      fetchSvg().then(svgText => {
        setSvgContent(svgText);
        setIsLoaded(true);
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchSvg().then(svgText => {
          setSvgContent(svgText);
          setIsLoaded(true);
        });

        if (wrapperRef.current) {
          observer.unobserve(wrapperRef.current);
        }
      }
    }, OBSERVER_OPTIONS);

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [url, fetchSvg, lazyLoad]);

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
          ref={wrapperRef}
          {...rest}
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
