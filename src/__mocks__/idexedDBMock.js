const mockIndexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

global.window.indexedDB = mockIndexedDB; 
