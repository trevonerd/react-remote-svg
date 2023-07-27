import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useInView } from 'react-intersection-observer';

import { imageVariants } from './utils/imageVariants';
import propsFilter from './utils/propFilter';

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export interface RemoteSVGProps extends React.HTMLAttributes<HTMLSpanElement> {
  activeEffect?: React.CSSProperties;
  alt?: string;
  dark?: boolean;
  disabledEffect?: React.CSSProperties;
  height?: number | string;
  hoverEffect?: React.CSSProperties;
  isActive?: boolean;
  isDisabled?: boolean;
  lazyLoad?: boolean;
  title?: string;
  url: string;
  useImageActive?: boolean;
  useImageDisabled?: boolean;
  useImageHover?: boolean;
  width?: number | string;
}

type StyledSVGProps = {
  $activeEffect?: React.CSSProperties;
  $disabledEffect?: React.CSSProperties;
  $hoverEffect?: React.CSSProperties;
  $isActive?: boolean;
  $isDisabled?: boolean;
  height: number | string;
  width: number | string;
};

const StyledSVG = React.memo(styled('img', propsFilter)<StyledSVGProps>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  cursor: ${({ $hoverEffect, $isDisabled: isDisabled }) => ($hoverEffect && !isDisabled ? 'pointer' : 'inherit')};

  ${({ $isActive, $isDisabled, $activeEffect, $disabledEffect }) => {
    if ($isActive) {
      return { ...$activeEffect };
    }

    if ($isDisabled) {
      return { ...$disabledEffect };
    }
  }};

  ${({ $hoverEffect, $isDisabled: isDisabled }) =>
    $hoverEffect &&
    !isDisabled &&
    css`
      &:hover {
        ${{ ...$hoverEffect }}
      }
    `}
`);

const StyledSVGContainer = styled.span`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const RemoteSVG: React.FC<RemoteSVGProps> = ({
  activeEffect,
  dark,
  disabledEffect,
  height = 24,
  hoverEffect,
  isActive = false,
  isDisabled = false,
  lazyLoad = supportsIntersectionObserver,
  title,
  alt = title,
  url,
  useImageActive,
  useImageDisabled,
  useImageHover,
  width = 24,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(url);
  const [isHovered, setIsHovered] = useState(false);
  const [variants, setVariants] = useState(imageVariants.light);
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (dark) {
      setVariants(imageVariants.dark);
    } else {
      setVariants(imageVariants.light);
    }
  }, [dark]);

  useEffect(() => {
    const loadImage = () => {
      setIsLoaded(true);
    };

    if (!lazyLoad || inView) {
      loadImage();
    }
  }, [lazyLoad, inView]);

  useEffect(() => {
    let newSrc = url;

    if (isHovered && useImageHover && !isDisabled) {
      newSrc = url.replace(/\.[^.]*$/, `${variants.hover}$&`);
    } else if (useImageDisabled) {
      newSrc = url.replace(/\.[^.]*$/, `${variants.disabled}$&`);
    } else if (useImageActive) {
      newSrc = url.replace(/\.[^.]*$/, `${variants.active}$&`);
    } else {
      // default variant
      newSrc = url.replace(/\.[^.]*$/, `${variants.normal}$&`);
    }

    setImgSrc(newSrc);
  }, [isHovered, url, dark, useImageHover, isDisabled, useImageDisabled, useImageActive, variants]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <StyledSVGContainer ref={ref}>
      {isLoaded ? (
        <StyledSVG
          $activeEffect={activeEffect}
          $disabledEffect={disabledEffect}
          $hoverEffect={hoverEffect}
          $isActive={isActive}
          $isDisabled={isDisabled}
          alt={alt}
          height={height}
          src={imgSrc}
          title={title}
          width={width}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
