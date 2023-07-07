import { RemoteSVGMock } from './';

jest.mock('react-remote-svg', () => ({
  RemoteSVG: RemoteSVGMock,
}));
