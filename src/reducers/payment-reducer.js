import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stateFormToPayment, stateFormToPaymentAdmin } from '../components/Helpers/PaymentConvert';
import { AjaxProvider } from '../api/AjaxProvider';
import { formTypes } from '../common';
import { stateToDate } from '../components/Helpers/DateConvert';

/**
 * Async метод добавления платежа
 * @returns {Object} payment
 */
const addPayment = createAsyncThunk(
    'payment/addPayment',
    async (payload, thunkAPI) => {
        // Add
        // Определяем тип проекта, т.к в useEffect оказалось очень накладно
        let state = thunkAPI.getState();
        let paymentType = state.payment.checkedPaymentType;
        let incomeType = state.payment.checkedIncomeType;
        let data = await stateFormToPayment(payload);
        if (paymentType === 1) {
            //Тип проекта - месячный и т.д
            if (incomeType === formTypes.INCOME_MONTHLY) data.oldProject = 2;
            if (incomeType === formTypes.INCOME_EXISTS) data.oldProject = 1;
            if (incomeType === formTypes.INCOME_NEW) data.oldProject = 0;
            data.money_to = '';
            if (incomeType !== formTypes.INCOME_MONTHLY) data.period = 0;
            //Убираем минус
            if (data.total < 0) {
                data.total = data.total * -1;
            }
            if (data.daysType == 4) {
                data.daysProject = stateToDate(data.daysProject);
            }
        } else {
            data.oldProject = 0;
            if (!data.category === 'Разработка' && !data.category === 'Доработка' && !data.category === 'Абонемент')
            {
                data.projectType = '';
            }
            //Если расход - переносим свойство total в total_minus
            if (parseInt(data.total) > 0) {
                data.total_minus = parseInt(data.total);
                data.total = 0;
            } else {
                data.total_minus = data.total * -1;
                data.total = 0;
            }
            data = checkCostType(data);
        }
        if(!data.total && data.total_minus > 0){
            data.percents = [];
        }
        // Обнуляем полную сумму, если эти не новый платеж
        if (data.oldProject !== 0) data.full_sum = 0;
        //Ставим текущего менеджера в строку "кто отправил"
        let currentManager = state.auth.currentManager;
        data.from = currentManager;
        const newPayment = await AjaxProvider.post('api/bux/payments/add', data);
        return newPayment;
    }
);

/**
 * Async метод копирования платежа
 * @returns {Object} payment
 */
const copyPayment = createAsyncThunk(
    'payment/addPayment',
    async (payment, thunkAPI) => {
        let state = thunkAPI.getState();
        //Ставим текущего менеджера в строку "кто отправил"
        let currentManager = state.auth.currentManager;
        payment.from = currentManager;
        const newPayment = await AjaxProvider.post('api/bux/payments/add', payment);
        // Copy
        return newPayment;
    }
);

/**
 * Async метод удаления платежа
 * @returns {number} index в массиве платежей
 */
const removePayment = createAsyncThunk(
    'payment/removePayment',
    async (index, thunkAPI) => {
        let state = thunkAPI.getState();
        //На бэк отправляем только id платежа, получаем по индексу в массиве
        let paymentId = state.payment.payments[index]['id_payment_wait'];
        let data = {
            id_payment_wait: paymentId
        }
        const payment = await AjaxProvider.delete('api/bux/payments/delete', data);
        // Remove
        return {
            index: index,
            payment: payment,
        };
    }
);

/**
 * Проверяем к какому типу расхода относится данный платеж. Сравнения по категориям
 * @TODO сделать справочник категорий
 * @param newFormData
 * @returns {*}
 */
function checkCostType(newFormData) {
    newFormData.cost_type = 'direct';
    if (['Партнерки', 'Продажа лицензий', 'Софт и сервисы', 'Хостинг и домены', 'Бухглатерия', 'Мебель и техника', 'Корпоративы и подарки'].includes(newFormData.category)) {
        newFormData.cost_type = 'indirect';
    }
    return newFormData;
}

/**
 * Async метод редактирования платежа
 * @returns {Object} data в массиве платежей
 */
const editPayment = createAsyncThunk(
    'payment/editPayment',
    async (data, thunkAPI) => {
        let state = thunkAPI.getState();
        let paymentId = state.payment.payments[data.index]['id_payment_wait'];
        let paymentType = state.payment.checkedPaymentType;

        let newFormData = await stateFormToPayment(data.formData);
        newFormData.id_payment_wait = paymentId;
        if (paymentType === 2) {
            //Если расход - переносим свойство total в total_minus
            //Если ввели с минусом - переводим в положительное
            if (newFormData.total < 0) {
                newFormData.total_minus = newFormData.total * -1;
                newFormData.total = 0;
            } else {
                newFormData.total_minus = newFormData.total;
                newFormData.total = 0;
            }
        } else {
            if (newFormData.total < 0) {
                newFormData.total = newFormData.total * -1;
            }
        }
        if (newFormData.daysType == 4) {
            newFormData.daysProject = stateToDate(newFormData.daysProject);
        }
        newFormData = checkCostType(newFormData);
        const editedPayment = await AjaxProvider.put('api/bux/payments/update', newFormData);
        return {
            index: data.index,
            payment: editedPayment,
            data: newFormData
        };
    }
);

/**
 * Async метод загрузки списка сайтов/проектов
 * @returns {Object}
 */
 const loadSites = createAsyncThunk(
    'payment/loadSites',
    async (data, thunkAPI) => {
        const sites = await AjaxProvider.get('api/bux/projects/v2');
        return sites;
    }
);

/**
 * Async метод загрузки списка контрагентов (всех)
 * @returns {Object}
 */
 const loadContragents = createAsyncThunk(
    'payment/loadContragents',
    async (data, thunkAPI) => {
        const contragents = await AjaxProvider.get('api/bux/sites');
        return contragents;
    }
);

/**
 * Async метод загрузки списка менеджеров
 * @returns {Object}
 */
 const loadManagers = createAsyncThunk(
    'payment/loadManagers',
    async (data, thunkAPI) => {
        const managers = await AjaxProvider.get('api/bux/managers');
        return managers;
    }
);

/**
 * Async метод загрузки платежей с бэка
 * @returns {Array<Object>}
 */
const loadPayments = createAsyncThunk(
    'payment/loadPayments',
    async (index, thunkAPI) => {
        const paymentList = await AjaxProvider.get('api/bux/payments');
        return paymentList;
    }
);

/**
 * Async метод обновления списка проектов
 * @returns {Array<Object>}
 */
 const updateProjects = createAsyncThunk(
    'payment/updateProjects',
    async (site, thunkAPI) => {
        const response = await AjaxProvider.post('api/bux/projects/v2');
        return {
            result: response
        }
    }
);


/**
 * Async метод отправки платежа в планфикс
 * @returns {Array<Object>}
 */
 const sendToPlanfix = createAsyncThunk(
    'payment/sendToPlanfix',
    async (index, thunkAPI) => {
        let state = thunkAPI.getState();
        //Получаем id платежа по индексу
        //Для отправки "как есть" нам не нужны другие данные кроме id платежа
        let paymentId = state.payment.payments[index]['id_payment_wait'];
        let data = {
            id_payment_wait: paymentId
        }

        const result = await AjaxProvider.post('api/bux/planfix', data);
        return {
            result: result,
            index: index
        }
    }
);

/**
 * Async метод отправки платежа в Google Docs
 * @returns {Array<Object>}
 */
 const sendToGoogle = createAsyncThunk(
    'payment/sendToGoogle',
    async (index, thunkAPI) => {
        let state = thunkAPI.getState();
        //Получаем id платежа по индексу
        //Для отправки "как есть" нам не нужны другие данные кроме id платежа
        let paymentId = state.payment.payments[index]['id_payment_wait'];
        let data = {
            id_payment_wait: paymentId
        }

        const result = await AjaxProvider.post('api/bux/google', data);
        return {
            result: result,
            index: index
        }
    }
);

/**
 * Async метод отправки платежа в Google Docs Full для создания нового
 * @returns {Array<Object>}
 */
 const sendToGoogleFull = createAsyncThunk(
    'payment/sendToGoogleFull',
    async (data, thunkAPI) => {
        const state = thunkAPI.getState();
        //При создании полного платежа (из формы или при редактировании), нам нужны все данные формы, поэтому метод отдельный
        const newFormData = await stateFormToPaymentAdmin(data);
        let paymentType = state.payment.checkedPaymentType;
        //Переводим отрицательные значения в положительные, доход в расход
        if (paymentType === 2) {
            if (newFormData.total < 0) {
                newFormData.total_minus = newFormData.total * -1;
                newFormData.total = 0;
            } else {
                newFormData.total_minus = newFormData.total;
                newFormData.total = 0;
            }
        } else {
            if (newFormData.total < 0) {
                newFormData.total = newFormData.total * -1;
            }
        }

        const payment = await AjaxProvider.post('api/bux/google/full', newFormData);
        return {
            result: payment,
            data: newFormData
        };
    }
);

/**
 * Async метод отправки платежа в Planfix Full для создания нового
 * @returns {Array<Object>}
 */
 const sendToPlanfixFull = createAsyncThunk(
    'payment/sendToPlanfixFull',
    async (data, thunkAPI) => {
        const state = thunkAPI.getState();
        //При создании полного платежа (из формы или при редактировании), нам нужны все данные формы, поэтому метод отдельный
        const newFormData = await stateFormToPaymentAdmin(data);
        let paymentType = state.payment.checkedPaymentType;
        let incomeType = state.payment.checkedIncomeType;
        if (paymentType === 2) {
            newFormData.oldProject = 0;
            if (newFormData.total < 0) {
                newFormData.total_minus = newFormData.total * -1;
                newFormData.total = 0;
            } else {
                newFormData.total_minus = newFormData.total;
                newFormData.total = 0;
            }
        } else {
            if (incomeType === formTypes.INCOME_MONTHLY) newFormData.oldProject = 2;
            if (incomeType === formTypes.INCOME_EXISTS) newFormData.oldProject = 1;
            if (incomeType === formTypes.INCOME_NEW) newFormData.oldProject = 0;
            newFormData.money_to = '';
            if (incomeType !== formTypes.INCOME_MONTHLY) newFormData.period = 0;
            if (newFormData.total < 0) {
                newFormData.total = newFormData.total * -1;
            }
            if (newFormData.daysType == 4) {
                newFormData.daysProject = stateToDate(newFormData.daysProject);
            }
        }

        const payment = await AjaxProvider.post('api/bux/planfix/full', newFormData);
        return {
            result: payment,
            data: newFormData
        };
    }
);

export const initialState = {
    // ----- Типы платежей
    paymentTypes: [
        {
            title: 'Доход',
            value: 1
        },
        {
            title: 'Расход',
            value: 2
        },
    ],
    checkedPaymentType: 1,

    // ----- Подтипы платежей для дохода
    incomeTypes: [
        {
            title: 'Новый',
            value: 1
        },
        {
            title: 'Есть в планфиксе',
            value: 2
        },
        {
            title: 'Месячный',
            value: 3
        },
    ],
    checkedIncomeType: 1,

    // ----- Подтипы платежей для расхода
    consumptionTypes: [
        {
            title: 'Без проекта',
            value: 1
        },
        {
            title: 'С проектом',
            value: 2
        },
    ],
    checkedСonsumptionType: 1,

    // ----- Проекты/Сайты
    sites: {},
    // ----- Категории контрагентов/сайтов
    siteCategories: [],
    // ----- Сайты/Контрагенты
    contragents: [],
    // ----- Лист менеджеров
    managers: [],
    // ----- Платежи
    payments: [],

    // ----- Ошибка платежа
    paymentsError: '',
    // ----- Ошибка добавления платежа
    addPaymentError: '',
    // ----- Ошибка редактирования платежа
    editPaymentError: '',
    // ----- Статус редактирования платежа - успех или нет
    editPaymentSuccess: false,
    // ----- Ошибка удаления платежа
    deletePaymentError: '',
    // ----- Ошибка загрузки платежей
    loadPaymentError: '',
}

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        changePaymentType: (state, action) => {
            state.checkedPaymentType = action.payload
        },
        changeIncomeType: (state, action) => {
            state.checkedIncomeType = action.payload
        },
        changeСonsumptionType: (state, action) => {
            state.checkedСonsumptionType = action.payload
        },
        changeSites: (state, action) => {
            state.sites = action.payload
        },
        changeManagers: (state, action) => {
            state.managers = action.payload
        },
        changePayments: (state, action) => {
            state.payments = action.payload
        },
        changeEditPaymentError: (state, action) => {
            state.editPaymentError = action.payload
        },
        changeEditPaymentSuccess: (state, action) => {
            state.editPaymentSuccess = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addPayment.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.payments.unshift(action.payload.result);
                state.addPaymentError = '';
            } else {
                state.addPaymentError = action.payload.errors;
            }
        })
        builder.addCase(removePayment.fulfilled, (state, action) => {
            if (action.payload.payment.success) {
                delete state.payments[action.payload.index];
                state.deletePaymentError = '';
            } else {
                state.deletePaymentError = action.payload.payment.errors;
            }
        })
        builder.addCase(loadPayments.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.payments = action.payload.result;
                state.loadPaymentError = '';
            } else {
                state.loadPaymentError = action.payload.errors;
            }
        })
        builder.addCase(editPayment.fulfilled, (state, action) => {
            if (action.payload.payment.success) {
                state.payments[action.payload.index] = action.payload.data;
                state.editPaymentError = '';
                state.editPaymentSuccess = true;
            } else {
                state.editPaymentError = action.payload.payment.errors;
                state.editPaymentSuccess = false;
            }
        })
        builder.addCase(loadSites.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.sites = action.payload.result;
            }
        })
        builder.addCase(loadContragents.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.contragents = action.payload.result.clients;
                state.siteCategories = action.payload.result.categories;
            }
        })
        builder.addCase(loadManagers.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.managers = action.payload.result;
            }
        })
        builder.addCase(sendToPlanfix.fulfilled, (state, action) => {
            if (action.payload.result.success) {
                state.payments[action.payload.index]['sent_to_planfix'] = 1;
            }
        })
        builder.addCase(sendToGoogle.fulfilled, (state, action) => {
            if (action.payload.result.success) {
                state.payments[action.payload.index]['status'] = 1;
            }
        })
        builder.addCase(updateProjects.fulfilled, (state, action) => {
            if (action.payload.result.success) {
                state.sites = action.payload.result.result;
            }
        })
    },
})

export const {
    changePaymentType,
    changeIncomeType,
    changeСonsumptionType,
    changeSites,
    changeManagers,
    changePayments,
    changeEditPaymentSuccess,
    changeEditPaymentError
} = paymentSlice.actions

export {
    addPayment,
    removePayment,
    loadPayments,
    copyPayment,
    editPayment,
    loadSites,
    loadManagers,
    sendToPlanfix,
    sendToGoogle,
    sendToPlanfixFull,
    sendToGoogleFull,
    updateProjects,
    loadContragents
};

export default paymentSlice.reducer
