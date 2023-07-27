interface ImageVariants {
  normal: string;
  active: string;
  disabled: string;
  hover: string;
}

export const imageVariants: { light: ImageVariants; dark: ImageVariants } = {
  light: {
    normal: '',
    active: '_a',
    disabled: '_d',
    hover: '_h',
  },
  dark: {
    normal: '_dm',
    active: '_da',
    disabled: '_dd',
    hover: '_dh',
  },
};
