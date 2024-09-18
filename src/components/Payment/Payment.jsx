import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Payment.module.css';
import cl from 'classnames';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaymentTypes from './PaymentTypes';
import IncomeTypes from './Income/IncomeTypes';
import ConsumptionTypes from './Consumption/ConsumptionTypes';
import PaymentList from './PaymentList';
import PaymentFormWrapper from './PaymentFormWrapper';

const Payment = () => {

    const checkedPaymentType = useSelector((state) => state.payment.checkedPaymentType);

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className={cl(styles.title)}>Добавить</h2>
                </Col>
            </Row>
            <Row>
                <Col md={3} xs={5}>
                    <PaymentTypes />
                </Col>
                <Col md={7} xs={7}>
                    {
                        checkedPaymentType === 1 
                        ? <IncomeTypes />
                        : <ConsumptionTypes />
                    }
                </Col>
            </Row>
            <PaymentFormWrapper />

            <PaymentList />

        </Container>
    );
}

export default Payment;
