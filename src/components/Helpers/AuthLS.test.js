import {
  getAuthFromLS,
  setAuthToLS
} from './AuthLS';

let store = {};
const mockLocalStorage = {
  getItem: (key) => {
    return store[key];
  },
  setItem: (key, value) => {
    store[key] = `${value}`;
  },
  clear: () => {
    store = {};
  }
};

beforeAll(() => {
  jest.spyOn(global.Storage.prototype, 'getItem')
    .mockImplementation((key) => mockLocalStorage.getItem(key));
  jest.spyOn(global.Storage.prototype, 'setItem')
    .mockImplementation((key, value) => mockLocalStorage.setItem(key, value));
  jest.spyOn(global.Storage.prototype, 'clear')
    .mockImplementation(() => mockLocalStorage.clear());
});

describe('AuthLS functions tests', () => {
  beforeEach(() => {
    store = {};
  });

  it('Set manager to Local Storage', () => {
    const manager = 'Тест';

    setAuthToLS(manager);
    expect(global.Storage.prototype.setItem).toHaveBeenCalled();
    expect(global.Storage.prototype.setItem).toHaveBeenCalledWith('currentManager', manager);
  });

  it('Get manager from empty Local Storage', () => {
    const manager = getAuthFromLS();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('currentManager');
    expect(manager).toBeUndefined();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});



