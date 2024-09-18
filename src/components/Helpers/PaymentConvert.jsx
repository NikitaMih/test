/**
 * Переводит строку платежа в данные для формы
 * @date 2021-10-12
 * @param {Object} payment
 * @param {Object} state
 * @returns {Object}
 */
import {cutUrl} from "./CutUrl";

export const paymentToStateObject = (payment, state) => {
    const sum = payment.total_minus > 0 ? payment.total_minus : payment.total;
    const workers = [];
    let obj = {
        seller: '',
        manager: '',
        id_payment_percent_sell: '',
        id_payment_percent_manager: ''
    };


    //@TODO Сейчас выводит только двух менеджеров, хотя сохраняются несколько, из-за этого сбои бывают

    payment.percents.forEach((element) => {
        if (element.name === 'Продажа') {
            obj.seller = element.manager;
            obj.id_payment_percent_sell = element.id_payment_percent;
        }
        if (element.name === 'Ведение') {
            obj.manager = element.manager;
            obj.id_payment_percent_manager = element.id_payment_percent;
        }
    });

    workers.push(obj);

    const object = { ...state };
    object.workers = workers;
    object.sum = sum;
    object.oldProject = payment.oldProject;
    object.sum_minus = payment.total_minus;
    object.category = payment.category;
    object.site = payment.site;
    object.payer = payment.contragent;
    object.from = payment.from;
    object.project = payment.project ? payment.project : '';
    object.comment = payment.comment;
    object.daysType = payment.daysType;
    object.daysProject = payment.daysProject;
    object.full_sum = payment.full_sum;
    object.consumptions = payment.total_free ? payment.total_free : '';
    object.money_to = payment.money_to ? payment.money_to : '';
    object.period = payment.period ? payment.period : '';
    object.projectType = payment.projectType ? payment.projectType : '';

    return object;
}

/**
 * Переводит форму в данные платежа
 * @date 2021-10-12
 * @param {Object} payment
 * @param {Object} state
 * @returns {Object}
 */
export const stateFormToPayment = (state) => {
    let payment = {
        "total": 0,
        "total_free": 0,
        "total_minus": 0,
        "category": "",
        "contragent": "",
        "site": "",
        "project": "",
        "comment": "",
        "from": "",
        "status": 0,
        "oldProject": 0,
        "daysProject": 0,
        "daysType": 1,
        "percents": [],
        "id_payment_wait": 0,
        "money_to": '',
        "period": '',
        "projectType": '',
        "full_sum": '',
        "entity" : 0,
    };
    payment.total = state.sum;

    payment.total_free = state.consumptions;

    payment.category = state.category;
    payment.contragent = cutUrl(state.payer);
    payment.site = cutUrl(state.site);
    payment.project = state.project ? state.project : "";
    payment.comment = state.comment;
    payment.from = state.from;
    payment.oldProject = state.oldProject;
    payment.daysProject = state.daysProject;
    payment.daysType = state.daysType;
    payment.money_to = state.money_to ? state.money_to : '';
    payment.period = state.period ? state.period : '';
    payment.projectType = state.projectType ? state.projectType : '';
    payment.entity = state.entity;
    payment.full_sum = state.full_sum;

    state.workers.forEach((element) => {
        if (element.manager) {
            let obj = {
                name: '',
                manager: '',
                id_payment_percent: ''
            };
            obj.name = 'Ведение';
            obj.manager = element.manager;
            //Проверка нужна, потому что пр иредактировании менеджером и админом разные поля пересылаются
            obj.id_payment_percent = (!!element.id_payment_percent_manager ? element.id_payment_percent_manager :  element.id_payment_percent);
            payment.percents.push(obj);
        }
        if (element.seller) {
            let obj = {
                name: '',
                manager: '',
                id_payment_percent: ''
            };
            obj.name = 'Продажа';
            obj.manager = element.seller;
            //Проверка нужна, потому что пр иредактировании менеджером и админом разные поля пересылаются
            obj.id_payment_percent = (!!element.id_payment_percent_sell ? element.id_payment_percent_sell :  element.id_payment_percent);
            payment.percents.push(obj);
        }
    });

    return payment;
}

/**
 * Переводит строку платежа в данные для формы Админ
 * @date 2021-10-12
 * @param {Object} payment
 * @param {Object} state
 * @returns {Object}
 */
export const paymentToStateObjectAdmin = (payment, state) => {
    const sum = payment.total_minus > 0 ? payment.total_minus : payment.total;
    const workers = [];

    payment.percents.forEach((element) => {
        let obj = {
            manager: '',
            id_payment_percent: '',
            name: '',
            total: '',
            percent: ''
        };
        obj.name = element.name;
        obj.manager = element.manager;
        obj.total = sum;
        obj.id_payment_percent = element.id_payment_percent;
        workers.push(obj);
    });

    const object = { ...state };
    object.workers = workers;
    object.sum = sum;
    object.category = payment.category;
    object.site = payment.site;
    object.oldProject = payment.oldProject;
    object.payer = payment.contragent;
    object.sum_minus = payment.total_minus;
    object.project = payment.project ? payment.project : "";
    object.comment = payment.comment;
    object.daysType = payment.daysType;
    object.daysProject = payment.daysProject;
    object.full_sum = payment.full_sum;
    object.from = payment.from;
    object.consumptions = payment.total_free ? payment.total_free : '';
    object.money_to = payment.money_to ? payment.money_to : '';
    object.period = payment.period ? payment.period : '';
    object.projectType = payment.projectType ? payment.projectType : '';
    object.id_payment_wait = payment.id_payment_wait;

    return object;
}

/**
 * Переводит форму в данные платежа Админ
 * @date 2021-10-12
 * @param {Object} payment
 * @param {Object} state
 * @returns {Object}
 */
export const stateFormToPaymentAdmin = (state) => {
    let payment = {
        "total": 0,
        "total_free": 0,
        "total_minus": 0,
        "category": "",
        "contragent": "",
        "site": "",
        "project": "",
        "comment": "",
        "from": "",
        "status": 0,
        "oldProject": 0,
        "daysProject": 0,
        "daysType": 1,
        "percents": [],
        "id_payment_wait": 0,
        "money_to": '',
        "period": '',
        "projectType": '',
        'comission': '',
        "full_sum": '',
    };
    payment.total = state.sum;

    payment.total_free = state.consumptions;

    payment.category = state.category;
    payment.contragent = state.payer;
    payment.site = state.site;
    payment.project = state.project ? state.project : "";
    payment.comment = state.comment;
    payment.from = state.from;
    payment.oldProject = state.oldProject;
    payment.daysProject = state.daysProject;
    payment.daysType = state.daysType;
    payment.money_to = state.money_to ? state.money_to : '';
    payment.period = state.period ? state.period : '';
    payment.projectType = state.projectType ? state.projectType : '';
    payment.id_payment_wait = state.id_payment_wait ? state.id_payment_wait : 0;
    payment.comission = state.comission ? state.comission : 0;
    payment.full_sum = state.full_sum;

    state.workers.forEach((element) => {
        payment.percents.push(element);
    });

    return payment;
}
