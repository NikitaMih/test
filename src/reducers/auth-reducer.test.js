
import authReducer, { initialState, changeCurrentManager } from './auth-reducer';

const managers = [
  'Иван Ярославцев',
  'Миксим Симченко',
  'Роман Тетерин',
  'Вадим Школьный',
  'Владимир Нерадовских'
];

describe('auth-reducer tests', () => {
  it('Initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState)
  });

  it('Set manager - not admin', () => {
    const currentManager = managers[1];

    expect(
      authReducer(initialState, changeCurrentManager(currentManager))
    ).toEqual({
      currentManager: managers[1],
      isAdmin: false
    });
  });

  it('Set manager - admin', () => {
    const currentManager = managers[0];

    expect(
      authReducer(initialState, changeCurrentManager(currentManager))
    ).toEqual({
      currentManager: managers[0],
      isAdmin: true
    });
  });

  it('Reset current manager', () => {
    expect(
      authReducer(initialState, changeCurrentManager(''))
    ).toEqual(initialState);
  });
})