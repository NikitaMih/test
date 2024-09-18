import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Typeahead } from 'react-bootstrap-typeahead';
import { CommonData, formTypes } from '../../../../common';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { useDispatch, useSelector } from 'react-redux';
import { addPayment, editPayment } from '../../../../reducers/payment-reducer';
import AdminFormControls from '../AdminFormControls';
import ProjectUpdateButton from '../ProjectUpdateButton';
// styles
import "../../../../assets/style.css";
// asterisk mark
import Asterisk from '../../../Asterisk';
// bootstrap date pciker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ConsumptionForm = (props) => {
    const dispatch = useDispatch();
    const checkedConsumptionType = useSelector((state) => state.payment.checkedСonsumptionType);
    const addPaymentError = useSelector((state) => state.payment.addPaymentError);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const [loading, setLoading] = useState(false);
    const siteCategories = useSelector((state) => state.payment.siteCategories);
    const currentCategory = props.formData.category;

    const [salaryCategoryIsActive, setSalaryCategoryActive] = useState(false);

    // проверяем поле категории и задаем дефолтное значение
    useEffect(() => {
        if((currentCategory === "Зарплата" || currentCategory === "Отпускные") && checkedConsumptionType !== formTypes.CONSUMPTION_WITH_PROJECT) {
            setSalaryCategoryActive(true);
        } else {
            if(!props.modal) {
                setSalaryCategoryActive(false);
                props.setFormData(prev => ({
                    ...prev,
                    project: "",
                }));
            } else {

            }
        }
    }, [currentCategory, checkedConsumptionType]);

    useEffect(() => {
        if((currentCategory === "Зарплата" || currentCategory === "Отпускные") && checkedConsumptionType !== formTypes.CONSUMPTION_WITH_PROJECT) {
            props.setFormData(prev => ({
                ...prev,
                project: prev.project || convertDate(new Date()),
            }));
        }
    }, [props.formData.payer])

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

            if(props.formData.project.length) {
                props.setFormData(prev => ({
                    ...prev,
                    project: ""
                }));
            }
        }

        props.setFormData(prev => ({
            ...prev,
            [event.target.id]: value
        }));

        if((value === "Зарплата" || value === "Отпускные") && checkedConsumptionType !== formTypes.CONSUMPTION_WITH_PROJECT) {
            if(!props.formData.project.length) {
                props.setFormData(prev => ({
                    ...prev,
                    "project": convertDate(new Date()),
                }));
            }
        }
    }


    // очищаем поле проекта при анмаунте страницы
    useEffect(() => {
        return () => {
            props.setFormData(prev => ({
                ...prev,
                project: "",
            }));
        }
    }, [])

    /**
     * Хук
     * При смене типа расхода очищаем поле проекта
     */
    // useEffect(() => {
    //     console.log("checkedConsumptionType");
    //     props.setFormData(prev => ({
    //         ...prev,
    //         // project: "",
    //     }));
    // }, [checkedConsumptionType])

     /**
     * Хук
     * При вводе кто платит, подставлять значение в соседнее поле
     */
    useEffect(() => {
        if (props.formData.payer && !props.formData.site) {
            props.setFormData({
                ...props.formData,
                site: props.formData.payer
            });
        }
    }, [props.formData.payer]);

    /**
     * Хук
     * При вводе сайта, подставлять значение в соседнее поле
     */
    useEffect(() => {
        if (checkedConsumptionType === 2 && props.formData.site && !props.formData.payer) {
            props.setFormData({
                ...props.formData,
                payer: props.formData.site
            });
        }
    }, [props.formData.site]);

    //Метод добавления платежа
    const addNewPayment = async () => {
        setLoading(true);
        await dispatch(addPayment(props.formData));
        setLoading(false);
    };

    //Метод редактирования платежа
    const editSelectedPayment = () => {
        setLoading(true);
        if (!props.modal) return false;
        if (typeof(props.currentIndex) == 'undefined') return false;
        const data = {
            formData: props.formData,
            index: props.currentIndex
        }
        dispatch(editPayment(data));
        setLoading(false);
    }

    /**
     * Валидация формы
     * @date 2021-10-12
     * @returns {boolean}
     */
    const isFormValid = () => {
        if (props.formData.category == 0) return false;
        if (!props.formData.sum || props.formData.sum < 0) return false;
        if (!props.formData.payer) return false;
        if (!props.formData.site) return false;
        if (checkedConsumptionType === formTypes.CONSUMPTION_WITH_PROJECT) {
            if (!props.formData.project && !props.formData.salaryDate) return false;
        }
        return true;
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
                <Col md={4} xs={12}>
                    <InputGroup>
                        <Form.Control onChange={handleChange} required value={props.formData.sum} id="sum" placeholder="Платим сумму" />
                        <InputGroup.Text>₽ </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4} xs={12}>
                    <Form.Group>
                        <Form.Label>Кому платим <Asterisk /> </Form.Label>
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
                                handleChange(event);
                            }}
                            id="payer"
                            selected={props.formData.payer ? [props.formData.payer] : []}
                            options={props.contragents}
                        />
                    </Form.Group>
                </Col>
                <Col md={4} xs={12}>
                    <Form.Label>Сайт <Asterisk /> </Form.Label>
                        {checkedConsumptionType === formTypes.CONSUMPTION_NO_PROJECT ?
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
                    :  
                    <Form.Select value={props.formData.site} onChange={handleChange} id="site">
                        <option value="">Не выбрано</option>
                        {Object.keys(props.sites).map((site) => (
                            <option key={site} value={site}>{site}</option>
                        ))}
                    </Form.Select>
                    }
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4} xs={12}>
                    <Form.Label>Категория  <Asterisk /> </Form.Label>
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
                {salaryCategoryIsActive && checkedConsumptionType !== formTypes.CONSUMPTION_WITH_PROJECT ? 
                    <div className="date-picker-container">
                        <Form.Label>Дата <Asterisk /> </Form.Label>
                        <DatePicker 
                            selected={String(props.formData.project).length && checkDate(props.formData.project) ? convertDateForPicker(props.formData.project) : new Date()}
                            onChange={(val) => {
                                const event = {
                                    target: {
                                        id: 'project',
                                        value: convertDate(String(val)),
                                    }
                                }
                                handleChange(event);
                            }}
                            showMonthYearPicker
                            dateFormat="MM/yyyy"
                            // Блокируем возможность мануального ввода даты
                            onKeyDown={e => e.preventDefault()}
                        />
                    </div>
                    : 
                    <>
                    <Form.Label>Проект {checkedConsumptionType === 2 ? <Asterisk /> : ""}</Form.Label>
                    {checkedConsumptionType !== formTypes.CONSUMPTION_NO_PROJECT ?
                        // <Typeahead
                        //     onChange={(selected) => {
                        //         if (!selected[0]) return false;
                        //         const event = {
                        //             target: {
                        //                 id: 'project',
                        //                 value: selected[0],
                        //             }
                        //         }
                        //         handleChange(event);
                        //     }}
                        //     onInputChange={(text, event) => {
                        //         event.target.id = 'project';
                        //         event.target.value = text;
                        //         handleChange(event);
                        //     }}
                        //     id="project"
                        //     selected={props.formData.project ? [props.formData.project] : []}
                        //     options={props?.sites[props.formData.site] ? Object.values(props?.sites[props.formData.site]) : []}
                        // />
                        <Form.Select value={props.formData.project} onChange={handleChange} id="project">
                            <option value="">Не выбрано</option>
                            { props.sites[props.formData.site] ?
                                Object.keys(props.sites[props.formData.site]).map((projectId) => (
                                    <option key={projectId} value={projectId}>{props.sites[props.formData.site][projectId]}</option>
                                ))
                            : null}
                        </Form.Select>
                        : 
                        <InputGroup>
                            <Form.Control
                                placeholder="Проект"
                                aria-label="Project"
                                value={props.formData.project ? props.formData.project : ""}
                                onChange={(e) => {
                                    const event = {
                                        target: {
                                            id: 'project',
                                            value: e.target.value,
                                        }
                                    }
                                    handleChange(event);
                                }}
                            />
                            {/* <Form.Select value={props.formData.project} onChange={handleChange} id="project">
                                <option value="">Не выбрано</option>
                                {props?.sites[props.formData.site] ? Object.values(props?.sites[props.formData.site]).map(site => (
                                     <option key={site} value={site}>{site}</option>
                                 )) : null}
                            </Form.Select> */}

                            {/* <ProjectUpdateButton site={props.formData.site} /> */}
                        </InputGroup>
                        }
                    </>}
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={8} xs={12}>
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control value={props.formData.comment} onChange={handleChange} id="comment" placeholder="Детали платежа или проекта" />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h4>Кому отдать деньги</h4>
                </Col>
            </Row>
            <Row>
                <Col md={3} xs={12} className="mt-3">
                    <Form.Select onChange={(e) => handleChange(e)} value={props.formData.money_to} id="money_to">
                        <option value="">Никому</option>
                        {Object.keys(props.managers).map((manager) => (
                            <option key={manager} value={props.managers[manager].name}>{props.managers[manager].name}</option>
                        ))}
                    </Form.Select>
                </Col>
                {/* <Col md={3} xs={12} className="mt-3">
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>*/}
            </Row>
            {isAdmin ? 
                <Row className="mt-3">
                     <Col md={4} xs={12}>
                        <Form.Label>Комиссия за перевод</Form.Label>
                        <Form.Control value={props.formData.comission} onChange={handleChange} id="comission" placeholder="Комиссия" />
                    </Col>
                </Row>
            : null}
            <Row>
                {props.modal ? null : 
                    <Col md={8} xs={12} className="mt-3">
                        <Alert variant="warning">
                            Платеж будет отправлен контрагенту через 1 рабочий день после создания
                        </Alert>
                    </Col>
                }
            </Row>

            <Row className="mt-3">
                <Col>
                    <Button disabled={!isFormValid() || loading} 
                    onClick={() => props.modal ? editSelectedPayment() : addNewPayment()} 
                    variant="primary" 
                    size="lg"
                    >
                        {props.modal ? 'Изменить' : '+ Добавить'}
                    </Button>
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

export default ConsumptionForm;

// Проверяем, что строка соответствует виду MM/YYYY
function checkDate(dateString) {
    const pattern = /^\d{2}\/\d{4}$/;
    const result = pattern.test(dateString);
    return result;
}

// Для datePicker необходимо, чтобы дата была в формате new Date()
function convertDateForPicker(dateString) {
    const [month, year] = dateString.split("/");
    const date = new Date(year, month - 1, 1);
    return date;
}

// Конвертер даты для приведения к виду MM/YYYY
function convertDate(date) {
    const year = new Date(date).getFullYear();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const withSlashes = [month, year].join('/');
    return withSlashes;
}