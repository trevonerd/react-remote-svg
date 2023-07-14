import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useInView } from 'react-intersection-observer';

import propsFilter from './utils/propFilter';

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export interface RemoteSVGProps extends React.HTMLAttributes<HTMLSpanElement> {
  $activeEffect?: React.CSSProperties;
  $disabledEffect?: React.CSSProperties;
  $hoverEffect?: React.CSSProperties;
  alt?: string;
  height?: number | string;
  isActive?: boolean;
  isDisabled?: boolean;
  lazyLoad?: boolean;
  title?: string;
  url: string;
  width?: number | string;
}

const StyledSVGContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSVG = styled('img', propsFilter)<{
  $activeEffect?: React.CSSProperties;
  $disabledEffect?: React.CSSProperties;
  $hoverEffect?: React.CSSProperties;
  height: number | string;
  isActive?: boolean;
  isDisabled?: boolean;
  width: number | string;
}>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  cursor: ${({ $hoverEffect, isDisabled }) => ($hoverEffect && !isDisabled ? 'pointer' : 'inherit')};

  ${({ isActive, isDisabled, $activeEffect, $disabledEffect }) => {
    if (isActive) {
      return { ...$activeEffect };
    }

    if (isDisabled) {
      return { ...$disabledEffect };
    }
  }};

  ${({ $hoverEffect, isDisabled }) =>
    $hoverEffect &&
    !isDisabled &&
    css`
      &:hover {
        ${{ ...$hoverEffect }}
      }
    `}
`;

const RemoteSVG: React.FC<RemoteSVGProps> = ({
  $activeEffect,
  $disabledEffect,
  height = 24,
  $hoverEffect,
  isActive = false,
  isDisabled = false,
  lazyLoad = supportsIntersectionObserver,
  title,
  alt = title,
  url,
  width = 24,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '150px',
  });

  useEffect(() => {
    const loadImage = () => {
      setIsLoaded(true);
    };

    if (!lazyLoad || inView) {
      loadImage();
    }
  }, [lazyLoad, inView]);

  return (
    <StyledSVGContainer ref={ref}>
      {isLoaded ? (
        <StyledSVG
          src={url}
          alt={alt}
          title={title}
          width={width}
          height={height}
          isActive={isActive}
          isDisabled={isDisabled}
          $hoverEffect={$hoverEffect}
          $activeEffect={$activeEffect}
          $disabledEffect={$disabledEffect}
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
