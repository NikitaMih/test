import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button'
import { sendToPlanfix, sendToGoogle } from '../../../reducers/payment-reducer';
import styles from '../Payment.module.css';
import cl from 'classnames';

const AdminListControls = (props) => {
    const [isSendingToPlanfix, setIsSendingToPlanfix] = useState(false);
    const [isSendingToGoogle, setIsSendingToGoogle] = useState(false);
    const [planfixError, setPlanfixError] = useState('');
    const [googleError, setGoogleError] = useState('');
    const [planfixLink, setPlanfixLink] = useState(null);

    const [planfixSuccess, setPlanfixSuccess] = useState(false);
    const [googleSuccess, setGoogleSuccess] = useState(false);

    const dispatch = useDispatch();

    /**
     * Добавление платежа в планфикс
     * Обработка не в store, т.к нужна обработка данных для конкретной строки
     * Объект с индексами строк не вариант, т.к строки могут удаляться и добавляться
     */
    const sendToPlanfixHandle = async () => {
        setIsSendingToPlanfix(true);
        const res = await dispatch(sendToPlanfix(props.index));
        setIsSendingToPlanfix(false);
        if (!res.payload.result.success) {
            setPlanfixError(res.payload.result.errors);
            setPlanfixSuccess(false);
            setPlanfixLink(null);
        } else {
            setGoogleError('');
            setPlanfixSuccess('Проект добавлен в planfix');
            setPlanfixLink(res.payload.result.result.url);
        }
    }

    /**
     * Добавление платежа в google docs
     * Обработка не в store, т.к нужна обработка данных для конкретной строки
     * Объект с индексами строк не вариант, т.к строки могут удаляться и добавляться
     */
    const sendToGoogleHandle = async () => {
        setIsSendingToGoogle(true);
        const res = await dispatch(sendToGoogle(props.index));
        setIsSendingToGoogle(false);
        if (!res.payload.result.success) {
            setGoogleError(res.payload.result.errors);
            setGoogleSuccess(false);
        } else {
            setGoogleError('');
            setGoogleSuccess(true);
        }
    }

    return (
        <div className="mt-2">
            <div className="d-flex">
                <div>
                    <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={isSendingToGoogle || props.payment.status}
                            onClick={!isSendingToGoogle ? sendToGoogleHandle : null}
                            >
                            {isSendingToGoogle ? 'Загрузка...' : props.payment.status ? '✓ Уже в Docs' : 'Отправить в GoogleDocs'}
                        </Button>
                </div>
                <div className="ms-2 planfix_button">
                    <Button
                        variant="outline-success"
                        size="sm"
                        disabled={isSendingToPlanfix || props.payment.sent_to_planfix}
                        onClick={!isSendingToPlanfix ? sendToPlanfixHandle : null}
                        >
                        {isSendingToPlanfix ? 'Загрузка...' : props.payment.sent_to_planfix ? '✓ Уже в planfix' : 'Отправить в планфикс'}
                    </Button>
                </div>
            </div>
            {planfixError ? <div className={cl(styles.payment_smaller_text) + ' ' + cl(styles.red_text)}>{planfixError} planfix</div> : null}
            {googleError ? <div className={cl(styles.payment_smaller_text) + ' ' + cl(styles.red_text)}>{googleError} docs</div> : null}
            {planfixSuccess ? 
                <div className={cl(styles.payment_smaller_text) + ' ' + cl(styles.green_text)}>
                    {planfixSuccess} 
                    <br/> 
                    <b>
                        <a href={planfixLink} target="_blank">Ссылка</a>
                    </b>
                </div> 
                : null
            }
            {googleSuccess ? 
                <div className={cl(styles.payment_smaller_text) + ' ' + cl(styles.green_text)}>
                    <a href="https://docs.google.com/spreadsheets/d/1TLKjVVuLdVTGGWURda-jP1ms-70-nCsqlZn_LLrS95U/edit#gid=897668629" target="_blank">Проект добавлен в Gdocs</a>
                </div> 
            : null}
       </div>
    );
}


export default AdminListControls;


