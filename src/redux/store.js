import { configureStore } from '@reduxjs/toolkit';
import paymentReduser from '../reducers/payment-reducer';
import authReducer from '../reducers/auth-reducer';

export const store = configureStore({
  reducer: {
    payment: paymentReduser,
    auth: authReducer,
  },
});
