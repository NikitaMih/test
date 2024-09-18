import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changePaymentType } from '../../reducers/payment-reducer';
import styles from './Payment.module.css';
import cl from 'classnames';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const PaymentTypes = () => {

    const checkedPaymentType = useSelector((state) => state.payment.checkedPaymentType);
    const paymentTypes       = useSelector((state) => state.payment.paymentTypes);
    const dispatch           = useDispatch();

    const onChangePaymentType = (paymentType) => dispatch(changePaymentType(paymentType));

    return (
        <ToggleButtonGroup type="radio" name="payment-type" value={checkedPaymentType} onChange={onChangePaymentType}>
            {paymentTypes.map((paymentType, id) => (
                <ToggleButton
                    key={id}
                    id={`payment-type-${id}`}
                    type="radio"
                    variant={checkedPaymentType === paymentType.value ? 'primary' : 'outline-primary'}
                    value={paymentType.value}
                    checked={checkedPaymentType === paymentType.value}
                >
                    {
                        paymentType.value === 1
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={cl('bi', 'bi-arrow-up', styles.arrow)} viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={cl('bi', 'bi-arrow-down', styles.arrow)} viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                            </svg>
                    }
                    {paymentType.title}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default PaymentTypes;
