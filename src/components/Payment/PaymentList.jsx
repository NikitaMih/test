import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Payment.module.css';
import cl from 'classnames';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { paymentToStateObject, paymentToStateObjectAdmin } from '../Helpers/PaymentConvert';
import { dateToState } from '../Helpers/DateConvert';
import { changePaymentType, changeIncomeType, changeСonsumptionType, removePayment, copyPayment, changeEditPaymentSuccess, changeEditPaymentError } from '../../reducers/payment-reducer';
import Modal from 'react-bootstrap/Modal'
import IncomeForm from './Form/Income/IncomeForm';
import ConsumptionForm from './Form/Consumption/ConsumptionForm';
import Button from 'react-bootstrap/Button'
import List from './PaymentList/List';
import { StatePayment } from '../../Models/Payment';
import Alert from 'react-bootstrap/Alert'
// styles
import "../../assets/style.css";

const PaymentList = (props) => {
    const sites = useSelector((state) => state.payment.sites);
    const managers = useSelector((state) => state.payment.managers);
    const editPaymentError = useSelector((state) => state.payment.editPaymentError);
    const editPaymentSuccess = useSelector((state) => state.payment.editPaymentSuccess);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const contragents = useSelector((state) => state.payment.contragents);

    const dispatch = useDispatch();
    const switchPaymentType = (paymentType) => dispatch(changePaymentType(paymentType));
    const switchIncomeType = (paymentType) => dispatch(changeIncomeType(paymentType));
    const switchСonsumptionType = (paymentType) => dispatch(changeСonsumptionType(paymentType));

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalFormType, setModalFormType] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [editFormData, setEditFormData] = useState(StatePayment);

    const [selectedEditIndexPayment, setSelectedEditIndexPayment] = useState(null);


    /**
     * Копирование строки платежа
     * @date 2021-10-12
     * @param {Object} payment
     * @returns {void}
     */
    const copyPaymentToForm = (payment) => {
        let paymentCopy = JSON.parse(JSON.stringify(payment));
        paymentCopy.status = 0;
        paymentCopy.sent_to_planfix = 0;

        dispatch(copyPayment(paymentCopy));
    };

    /**
     * Удаление строки
     * @date 2021-10-12
     * @param {number} index
     * @returns {void}
     */
    const deleteFromPayments = () => {
        let index = selectedPayment;
        dispatch(removePayment(index));
        setShowDeleteModal(false);
        setSelectedPayment(null);
    };

    /**
     * Открытие модалки подтверждения удаления платежа
     * @date 2021-10-12
     * @param {number} index
     */
    const showDeletePaymentConfirmation = (index) => {
        setSelectedPayment(index);
        setShowDeleteModal(true);
    }

    /**
     * Закрытие модалки, отдельно чтобы убирать платеж из стейта
     * @date 2021-10-12
     * 
     */
    const closeModal = () => {
        setSelectedPayment(null);
        setShowDeleteModal(false);
    }

    /**
     * Редактирование платежа
     * @date 2021-10-12
     * @param {Object} payment
     * @returns {void}
     */
    const editPayment = (payment, index) => {
        let data = paymentToStateObject(payment, editFormData);
        // console.log("data:", data, "checkedConsumptionType: ", checkedConsumptionType, "formTypes: ", formTypes)
        if (isAdmin) data = paymentToStateObjectAdmin(payment, editFormData);
        if (data.daysType == 4) {
            data.daysProject = dateToState(data.daysProject);
        }
        // checkDate(payment.project) ? switchСonsumptionType(1) : switchСonsumptionType(2);

        setEditFormData(data);
        setSelectedEditIndexPayment(index)
        //Переключаем типы формы, т.к у нас завязка отображения и формирования данных на значениях
        if (data.sum_minus > 0) {
            setModalFormType(2);
            switchСonsumptionType(1);
            switchPaymentType(2);
        } else {
            setModalFormType(1);
            switchIncomeType(1);
            switchPaymentType(1);
        }
        if (payment.oldProject == 2) {
            switchIncomeType(3);
        }
        setShowEditModal(true);
    };

    /**
     * Метод срабататывает при закрытии модалки
     */
    const hideEditModal = () => {
        setShowEditModal(false);
        //Очищаем ошибку, чтобы не выводилась в след. форме
        dispatch(changeEditPaymentSuccess(false));
        dispatch(changeEditPaymentError(''));
    }

    /**
     * Получение контента модального окна
     * @date 2021-10-12
     * @returns {ConsumptionForm, IncomeForm}
     */
    const getModalForm = () => {
        if (modalFormType === 2) {
            return <ConsumptionForm currentIndex={selectedEditIndexPayment} sites={sites} formData={editFormData} setFormData={setEditFormData} managers={managers} modal={true} contragents={contragents} />
        }

        return <IncomeForm currentIndex={selectedEditIndexPayment} formData={editFormData} setFormData={setEditFormData} modal={true} managers={managers} sites={sites} contragents={contragents} />
    };
      
    return (
        <div>
            <Row className="mt-4">
                <Col>
                    <h1>Текущие платежи</h1>
                </Col>
            </Row>
            <Row className={cl(styles.payment_list__row) + ' payment_header'}>
                <Col md={1}>
                    <span className={cl(styles.payment_list__title)}>Сумма</span>
                </Col>
                <Col md={2}>
                    <span className={cl(styles.payment_list__title)}>Кто?</span>
                </Col>
                <Col md={2}>
                    <span className={cl(styles.payment_list__title)}>Проект</span>
                </Col>
                <Col md={2}>
                    <span className={cl(styles.payment_list__title)}>Комментарий</span>
                </Col>
                <Col md={4}>
                    <span className={cl(styles.payment_list__title)}>Менеджеры</span>
                </Col>
                <Col md={1}>
                    
                </Col>
            </Row>

            <List copyPaymentToForm={copyPaymentToForm} showDeletePaymentConfirmation={showDeletePaymentConfirmation} editPayment={editPayment} />

            {/* Модалка редактирования платежа */}
            <Modal
                show={showEditModal}
                onHide={() => {hideEditModal(false); setSelectedEditIndexPayment(false)}}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                fullscreen={true}
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {getModalForm()}

                    {editPaymentError ?
                    <Alert variant={'danger'}>
                        {editPaymentError}
                    </Alert>
                    :null}

                    {editPaymentSuccess ?
                    <Alert variant={'success'}>
                        Платеж успешно изменен
                    </Alert>
                    :null}
                </Modal.Body>
            </Modal>
            
            {/* Модалка подтверждения удаления */}
            <Modal
                show={showDeleteModal}
                onHide={() => closeModal()}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    Точно удаляем платеж?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => deleteFromPayments()}>Да</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PaymentList;
