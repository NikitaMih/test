import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Typeahead } from 'react-bootstrap-typeahead';
import ProjectDeadline from '../ProjectDeadlines/ProjectDeadlines';
import ManagersSimple from '../Managers/ManagersSimple';
import { CommonData, formTypes } from '../../../../common';
import Button from 'react-bootstrap/Button'
import { addPayment, copyPayment, editPayment, loadPayments } from '../../../../reducers/payment-reducer';
import { AjaxProvider } from '../../../../api/AjaxProvider';
import ManagersAdmin from '../Managers/ManagersAdmin';
import AdminFormControls from '../AdminFormControls';
import Alert from 'react-bootstrap/Alert'
// styles
import "../../../../assets/style.css";
// asterisk mark
import Asterisk from '../../../Asterisk';

const IncomeForm = (props) => {
    const dispatch = useDispatch();
    const checkedIncomeType = useSelector((state) => state.payment.checkedIncomeType);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const [loading, setLoading] = useState(false);
    const addPaymentError = useSelector((state) => state.payment.addPaymentError);
    const siteCategories = useSelector((state) => state.payment.siteCategories);
    const paymentList = useSelector((state) => state.payment.payments);
    // TODO
    // сейчас здесь закреплено наличие/отсутствие данных daysProject. Если нет - значит платеж создавался в категории "Есть в планфиксе"
    const [isPaymentSentToPlanfix, setPaymentToPlanfix] = useState(false);

    // Проверяем отправлен ли платеж из списка в ПФ    
    useEffect(() => {
        if(paymentList.length && props.currentIndex !== undefined && paymentList[props.currentIndex]?.daysProject === null) setPaymentToPlanfix(true);
        else setPaymentToPlanfix(false);
    }, [paymentList, props.currentIndex])

    const handleChange = (event) => {
        let value = event.target.value;
        if (event.target.id == 'sum' && value.indexOf('-') !== -1) value = value.replace(/\-/, '');

        if (event.target.id === 'payer' && !!siteCategories) {
            const siteName = Object.keys(siteCategories).filter(item => item.toLowerCase() == value.toLowerCase())[0];
            const categoryValue = typeof siteName != 'undefined' ? siteCategories[siteName][0].toString() : '';
            if (typeof categoryValue == 'undefined' || categoryValue === '') {
                props.setFormData({
                    ...props.formData,
                    [event.target.id]: value
                });
                return;
            }

            let category = categoryValue[0].toUpperCase() + categoryValue.slice(1).toString().toLowerCase();

            Object.keys(CommonData.categories).forEach(function(categoryType) {
                CommonData.categories[categoryType].forEach(function(categoryItem) {
                    if (categoryItem.toLowerCase() == categoryValue.toLowerCase()) {
                        category = categoryItem;
                        
                    }
                })
            })
            props.setFormData(prev => ({
                ...prev,
                category: category
            }));
        }

        if(event.target.id === "site") {
            props.setFormData(prev => ({
                ...prev,
                "project": "",
            }))
        }
        
        props.setFormData(prev => ({
            ...prev,
            [event.target.id]: value,
        }));
    }
    /**
     * Хук
     * При смене категории, если выбран тип месячный, то подставляем название проекта
     */
    useEffect(() => {
        if (checkedIncomeType === formTypes.INCOME_MONTHLY && props.formData.category !== '0') {
            switch (props.formData.category) {
                case 'Разработка':
                    props.setFormData({
                        ...props.formData,
                        project: 'Абонемент '+props.formData.period
                    });
                    break;
                case 'Абонемент':
                    props.setFormData({
                        ...props.formData,
                        project: 'Абонемент '+props.formData.period
                    });
                    break;
                case 'Продвижение':
                    props.setFormData({
                        ...props.formData,
                        project: 'seo '+props.formData.period
                    });
                    break;
                case 'Контекст':
                    props.setFormData({
                        ...props.formData,
                        project: 'cpc '+props.formData.period
                    });
                    break;
                default:
                    break;
            }
        }
    }, [props.formData.category, props.formData.period]);


    /**
     * Нужно ли показывать переключатель типа проекта
     * @date 2021-10-12
     * @returns {boolean}
     */
     const shouldShowProjectType = () => {
        let shouldShowProjectType = false;
        Object.keys(CommonData.categories).forEach((categoryType) => {
          const isCategoryIncludes  = CommonData.categories[categoryType].includes(props.formData.category);
          if (isCategoryIncludes && categoryType === 'Разработка') {
            shouldShowProjectType = true;
          }
        });

        return shouldShowProjectType;
    }

    /**
    * TODO как-то лучше организовать валидацию
    * @date 2021-10-12
    * @returns {boolean}
    */
    const isFormValid = () => {
        if (checkedIncomeType === formTypes.INCOME_NEW) {
            if (props.formData.category == 0) return false;
            if (!props.formData.sum || props.formData.sum < 0) return false;
            if (!props.formData.payer) return false;
            if (!props.formData.site) return false;
            if (!props.formData.project) return false;

            if(!isPaymentSentToPlanfix) {
                if (!props.formData.daysProject) return false;
                if (!props.formData.full_sum || props.formData.full_sum < 0) return false;
            }
        }

        if (checkedIncomeType === formTypes.INCOME_EXISTS) {
            if (props.formData.category == 0) return false;
            if (!props.formData.sum || props.formData.sum < 0) return false;
            if (!props.formData.payer) return false;
            if (!props.formData.site) return false;
            if (!props.formData.project) return false;
        }

        if (checkedIncomeType === formTypes.INCOME_MONTHLY) {
            if (props.formData.category == 0) return false;
            if (!props.formData.sum || props.formData.sum < 0) return false;
            // if (!props.formData.full_sum || props.formData.full_sum < 0) return false;
            if (!props.formData.payer) return false;
            if (!props.formData.site) return false;
            if (!props.formData.project) return false;
            // if (!props.formData.daysProject) return false;
            if (!props.formData.period) return false;

            if(!isPaymentSentToPlanfix) {
                if (!props.formData.daysProject) return false;
                if (!props.formData.full_sum || props.formData.full_sum < 0) return false;
            }
        }

        return true;
    }

    /**
     * Добавление платежа
     */
    const addNewPayment = async () => {
        setLoading(true);
        await dispatch(addPayment(props.formData));
        setLoading(false);
    };

    /**
     * Получение данных из амо срм
     */
    const getAmoData = async () => {
        const data = {
            link: props.formData.amo
        };
        const response = await AjaxProvider.post('http://admin.leadget.ru/bux/apiv2/AmoProject.php', data);

        if (response.success) {
            props.setFormData({
                ...props.formData,
                payer: response.result.payer,
                total: response.result.total,
                site: response.result.payer,
                project: response.result.name
            });
        } else {
            alert(response.errors);
        }
    }

    const editSelectedPayment = () => {
        if (!props.modal) return false;
        if (typeof(props.currentIndex) == 'undefined') return false;
        const data = {
            formData: props.formData,
            index: props.currentIndex
        }
        dispatch(editPayment(data));
    }

    /**
     * Получение верхней строки формы
     * Месячный - период, новый - amoCRM
     * @date 2021-10-12
     * @returns {any}
     */
    const getHeadField = () => {
        switch (checkedIncomeType) {
            case formTypes.INCOME_NEW:
                return (
                        <Col md={4} xs={12}>
                            {/*<InputGroup>
                                <Form.Control onChange={handleChange} id="amo" value={props.formData.amo} type="text" placeholder="Ссылка на AmoCRM" />
                                <Button onClick={getAmoData} variant="outline-primary">
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17 8.5C17 8.5 13.8125 2.65625 8.5 2.65625C3.1875 2.65625 0 8.5 0 8.5C0 8.5 3.1875 14.3438 8.5 14.3438C13.8125 14.3438 17 8.5 17 8.5ZM1.24631 8.5C1.76005 9.2808 2.35094 10.008 3.01006 10.6707C4.3775 12.0402 6.2475 13.2812 8.5 13.2812C10.7525 13.2812 12.6214 12.0402 13.991 10.6707C14.6501 10.008 15.241 9.2808 15.7548 8.5C15.241 7.71919 14.6501 6.99198 13.991 6.32931C12.6214 4.95975 10.7514 3.71875 8.5 3.71875C6.2475 3.71875 4.37856 4.95975 3.009 6.32931C2.34987 6.99198 1.75898 7.71919 1.24525 8.5H1.24631Z" fill="black"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.5 5.84375C7.79552 5.84375 7.11989 6.1236 6.62175 6.62175C6.1236 7.11989 5.84375 7.79552 5.84375 8.5C5.84375 9.20448 6.1236 9.88011 6.62175 10.3783C7.11989 10.8764 7.79552 11.1562 8.5 11.1562C9.20448 11.1562 9.88011 10.8764 10.3783 10.3783C10.8764 9.88011 11.1562 9.20448 11.1562 8.5C11.1562 7.79552 10.8764 7.11989 10.3783 6.62175C9.88011 6.1236 9.20448 5.84375 8.5 5.84375ZM4.78125 8.5C4.78125 7.51373 5.17305 6.56785 5.87045 5.87045C6.56785 5.17305 7.51373 4.78125 8.5 4.78125C9.48627 4.78125 10.4322 5.17305 11.1296 5.87045C11.827 6.56785 12.2188 7.51373 12.2188 8.5C12.2188 9.48627 11.827 10.4322 11.1296 11.1296C10.4322 11.827 9.48627 12.2188 8.5 12.2188C7.51373 12.2188 6.56785 11.827 5.87045 11.1296C5.17305 10.4322 4.78125 9.48627 4.78125 8.5Z" fill="black"/>
                                    </svg>
                                </Button>
                            </InputGroup>
                            */}
                        </Col>
                    );
            case formTypes.INCOME_MONTHLY:
                return (
                    <Col md={4} xs={12}>
                        <Form.Control onChange={handleChange} id="period" value={props.formData.period} type="text" placeholder="Номер периода (цифра)" />
                    </Col>
                );
            default:
                return null;
        }
    }

    /**
     * Получение строки "кто платит"
     * @date 2021-10-12
     * @returns {any}
     */
    const getPayerField = () => {
        return (
            <Typeahead
                onChange={(selected) => {
                    if (!selected[0]) return false;
                    const event = {
                        target: {
                            id: 'payer',
                            value: selected[0]
                        }
                    }
                    handleChange(event);
                }}
                onInputChange={(text, event) => {
                    event.target.id = 'payer';
                    event.target.value = text;
                    return handleChange(event);
                }}
                id="payer"
                selected={props.formData.payer ? [props.formData.payer] : []}
                options={props.contragents}
            />
        );
    }

    /**
     * Получение строки "Сайт"
     * @date 2021-10-12
     * @returns {any}
     */
    const getSiteField = () => {
        if (checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) {
                return (
                    <Typeahead
                        onChange={(selected) => {
                            if (!selected[0]) return false;
                            const event = {
                                target: {
                                    id: 'site',
                                    value: selected[0]
                                }
                            }
                            handleChange(event);
                        }}
                        onInputChange={(text, event) => {
                            event.target.id = 'site';
                            event.target.value = text;
                            handleChange(event);
                        }}
                        id="site"
                        selected={props.formData.site ? [props.formData.site] : []}
                        options={!!props.sites ? Object.keys(props.sites) : []}
                    />
                );
        }
        return (
            <Form.Select value={props.formData.site} onChange={handleChange} id="site">
                <option value="">Не выбрано</option>
                {Object.keys(props.sites).map((site) => (
                    <option key={site} value={site}>{site}</option>
                ))}
            </Form.Select>
        );
    }

    /**
     * Получение строки "Проект"
     * @date 2021-10-12
     * @returns {any}
     */
    const getProjectField = () => {
        if (checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) {
                return (
                    <Typeahead
                        onChange={(selected) => {
                            if (!selected[0]) return false;
                            const event = {
                                target: {
                                    id: 'project',
                                    value: Object.keys(props.sites[props.formData.site]).find((id) => props.sites[props.formData.site][id] === selected[0]),
                                }
                            }
                            handleChange(event);
                        }}
                        onInputChange={(text, event) => {
                            event.target.id = 'project';
                            event.target.value = text;
                            handleChange(event);
                        }}
                        id="project"
                        // selected={props.formData.project ? [props.formData.project] : []}
                        // options={props.sites[props.formData.site] ? props.sites[props.formData.site] : []}
                        // options={props?.sites[props.formData.site] ? Object.values(props?.sites[props.formData.site]) : []}
                        selected={getSelectedProjectValue()}
                        options={props.sites[props.formData.site] ? Object.values(props.sites[props.formData.site]) : []}
                    />
                );
        }
        return (
            <InputGroup>
                <Form.Select value={props.formData.project} onChange={handleChange} id="project">
                    <option value="">Не выбрано</option>
                    {props?.sites[props.formData.site] ?
                    // Object.values(props?.sites[props.formData.site]).map(site => (
                    //     <option key={site} value={site}>{site}</option>
                    // )) : null
                    Object.keys(props.sites[props.formData.site]).map((projectId) => (
                        <option key={projectId} value={projectId}>{props.sites[props.formData.site][projectId]}</option>
                    ))
                    : null}
                </Form.Select>
                {/* <ProjectUpdateButton site={props.formData.site} /> */}
            </InputGroup>
        );
    }

    const getSelectedProjectValue = () => {
        if (!props.sites[props.formData.site]) {
            return []
        }

        if (typeof props.sites[props.formData.site][props.formData.project] !== 'undefined') {
            return [props.sites[props.formData.site][props.formData.project]]
        }

        const id = Object.keys(props.sites[props.formData.site]).find((id) => props.sites[props.formData.site][id] === props.formData.project)

        if (id) {
            return [props.sites[props.formData.site][id]]
        }

        return [];
    }

    return (
        <Form>
            <Row className="mt-4">
                {getHeadField()}
            </Row>
            <Row className="mt-3">
                <Col md={4} xs={12}>
                    <InputGroup>
                        <Form.Control onChange={handleChange} required value={props.formData.sum} id="sum" placeholder="Ожидаем сумму" />
                        <InputGroup.Text>₽ </InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col md={4} xs={12}>
                    <InputGroup>
                        <Form.Control onChange={handleChange} value={props.formData.consumptions} id="consumptions" placeholder="Дополнительные затраты" />
                        <InputGroup.Text>₽</InputGroup.Text>
                    </InputGroup>
                    <Form.Label>Затраты на шаблон, подрядчиков, лицензии </Form.Label>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4} xs={12}>
                    <Form.Group>
                        <Form.Label>Кто платит <Asterisk /> </Form.Label>
                        {getPayerField()}
                    </Form.Group>
                </Col>
                <Col md={4} xs={12}>
                    <Form.Label>Сайт <Asterisk /> </Form.Label>
                    {getSiteField()}
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4} xs={12}>
                    <Form.Label>Категория <Asterisk /> </Form.Label>
                    <Form.Select value={props.formData.category} onChange={handleChange} id="category">
                        <option value="0">Не выбрано</option>
                        {Object.keys(CommonData.categories).map((category) => (
                            <optgroup label={category} key={category}>
                                {CommonData.categories[category].map((subcat) => (
                                    <option key={subcat} value={subcat}>{subcat}</option>
                                ))}
                            </optgroup>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4} xs={12}>
                    <Form.Label>Проект <Asterisk /> </Form.Label>
                    { getProjectField() }
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={8} xs={12}>
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control value={props.formData.comment} onChange={handleChange} id="comment" placeholder="Детали платежа или проекта" />
                </Col>
            </Row>
            <Row className="mt-3">
            <Col md={4} xs={12}>
                    <Form.Label>Юр. лицо получателя</Form.Label>
                    <Form.Select value={props.formData.entity} onChange={handleChange} id="entity">
                        <option value="0">ИП Ярославцев И.С.</option>
                        <option value='1'>ООО Альто</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h4>Информация по проекту</h4>
                </Col>

                {/* {(checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) ?
                    <ProjectDeadline shouldShowProjectType={shouldShowProjectType() ? true : false} formData={props.formData} setFormData={props.setFormData} />
                : null} */}

                {!isPaymentSentToPlanfix && (checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) ?
                    <ProjectDeadline shouldShowProjectType={shouldShowProjectType() ? true : false} formData={props.formData} setFormData={props.setFormData} />
                : null}

                {isAdmin ?
                    <ManagersAdmin  managers={props.managers} formData={props.formData} setFormData={props.setFormData}/>
                :
                    <ManagersSimple managers={props.managers} formData={props.formData} setFormData={props.setFormData} />
                }

                {/* {(checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) ?
                    <Col md={3} xs={12} className="mt-3">
                        <InputGroup>
                            <Form.Control onChange={handleChange} value={props.formData.full_sum} id="full_sum" placeholder="Полная сумма проекта" />
                            <InputGroup.Text>₽ <Asterisk /> </InputGroup.Text>
                        </InputGroup>
                    </Col>
                : null} */}

                {!isPaymentSentToPlanfix && (checkedIncomeType === formTypes.INCOME_NEW || checkedIncomeType === formTypes.INCOME_MONTHLY) ?
                    <Col md={3} xs={12} className="mt-3">
                        <InputGroup>
                            <Form.Control onChange={handleChange} value={props.formData.full_sum} id="full_sum" placeholder="Полная сумма проекта" />
                            <InputGroup.Text>₽ <Asterisk /> </InputGroup.Text>
                        </InputGroup>
                    </Col>
                : null}

            </Row>
            <Row className="mt-3">
                <Col>
                    <Button disabled={!isFormValid() || loading} variant="primary" size="lg" onClick={() => props.modal ? editSelectedPayment() : addNewPayment()} >{props.modal ? 'Изменить' : '+ Добавить'}</Button>
                </Col>
            </Row>

            { isAdmin ?
             <Row className="mt-3">
                <AdminFormControls formData={props.formData} />
            </Row>
            : null }

            {addPaymentError && !props.modal ?
                <Alert className="mt-2" variant={'danger'}>
                    {addPaymentError}
                </Alert>
            : null}
        </Form>
    );
}

export default IncomeForm;