// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RemoteSVGMock } = require('./dist');

jest.mock('react-remote-svg', () => ({
  RemoteSVG: RemoteSVGMock,
}));
