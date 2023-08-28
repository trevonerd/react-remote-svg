import * as path from 'path';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useInView } from 'react-intersection-observer';

import { DARK_MODE, imageVariants, LIGHT_MODE } from './utils/imageVariants';
import propsFilter from './utils/propFilter';

const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export interface RemoteSVGProps extends React.HTMLAttributes<HTMLSpanElement> {
  activeEffect?: React.CSSProperties;
  alt?: string;
  basePath: string;
  customFolder?: string;
  dark?: boolean;
  disabledEffect?: React.CSSProperties;
  height?: number | string;
  hoverEffect?: React.CSSProperties;
  iconName: string;
  isActive?: boolean;
  isDisabled?: boolean;
  lazyLoad?: boolean;
  title?: string;
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
  basePath,
  customFolder,
  dark,
  disabledEffect,
  height = 24,
  hoverEffect,
  iconName,
  isActive = false,
  isDisabled = false,
  lazyLoad = supportsIntersectionObserver,
  title,
  alt = title,
  useImageActive,
  useImageDisabled,
  useImageHover,
  width = 24,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(path.join(basePath, LIGHT_MODE, `${iconName}.svg`));
  const [isHovered, setIsHovered] = useState(false);
  const [variant, setVariant] = useState(LIGHT_MODE);
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (customFolder) {
      setVariant(customFolder);
    } else if (dark) {
      setVariant(DARK_MODE);
    } else {
      setVariant(LIGHT_MODE);
    }
  }, [customFolder, dark]);

  useEffect(() => {
    const loadImage = () => {
      setIsLoaded(true);
    };

    if (!lazyLoad || inView) {
      loadImage();
    }
  }, [lazyLoad, inView]);

  useEffect(() => {
    let newSrc: string;

    if (isHovered && useImageHover && !isDisabled) {
      newSrc = path.join(basePath, variant, imageVariants.hover, `${iconName}.svg`);
    } else if (useImageDisabled && isDisabled) {
      newSrc = path.join(basePath, variant, imageVariants.disabled, `${iconName}.svg`);
    } else if (useImageActive && isActive) {
      newSrc = path.join(basePath, variant, imageVariants.active, `${iconName}.svg`);
    } else {
      // default variant
      newSrc = path.join(basePath, variant, `${iconName}.svg`);
    }

    setImgSrc(newSrc);
  }, [isHovered, dark, useImageHover, isDisabled, useImageDisabled, useImageActive, variant]);

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
