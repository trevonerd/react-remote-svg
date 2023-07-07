import { RemoteSVGMock } from './dist';

jest.mock('react-remote-svg', () => ({
  RemoteSVG: RemoteSVGMock,
}));
