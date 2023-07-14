const propsFilter = {
  shouldForwardProp: (prop: string) => !prop.startsWith('$'),
};

export default propsFilter;
