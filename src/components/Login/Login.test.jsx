import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { store } from "../../redux/store";
import { Provider } from "react-redux";

describe('Login component', () => {
  it('Login component renders', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.queryByText(/войти/i)).toBeInTheDocument();
  });

  it('Login manager select renders', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByTestId('manager-select')).toBeInTheDocument();
  });
})