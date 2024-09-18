import
  paymentReducer,
  {
    initialState,
    changePaymentType,
    changeIncomeType,
    changeСonsumptionType,
    changeSites,
    changeManagers,
    changePayments,
    changeEditPaymentSuccess,
    changeEditPaymentError
  }
from './payment-reducer';

const managers = [
  'Иван Ярославцев',
  'Миксим Симченко',
  'Роман Тетерин',
  'Вадим Школьный',
  'Владимир Нерадовских'
];

const sites = {
  'argo-ru.ru': [
    'Депозит 46 часов'
  ],
  'azbukatortov.ru': [
    'Программирование и натяжка'
  ],
  'bernumode.lv': [
    'seo 3',
    'Абонемент 6',
    'Депозит 3 на 40 часов (март)'
  ],
  'bomondceramica.ru': [
    'Доработки сайта постоплата'
  ],
  'bunter.ru': [
    'Добавление еще 1 вкладки на главной странице.'
  ],
  'chai-chai.ru': [
    'абонемент 2',
    'Пакет 40 ч'
  ],
  'chnservice.com': [
    'SEO 1'
  ],
}

const payments = [
  {
    "id_payment_wait": 3792,
    "total": 0,
    "total_free": 0,
    "total_minus": 389,
    "category": "Хостинг и домены",
    "contragent": "антон подгорнов",
    "site": "azbukatortov.ru",
    "project": "Этап 4 Каталог",
    "comment": "Антону П за месяц хостинга (на апрель)",
    "from": "Антон Подгорнов",
    "status": 0,
    "oldProject": 0,
    "daysProject": "0",
    "daysType": 1,
    "period": null,
    "money_to": "",
    "projectType": null,
    "sent_to_planfix": 1,
    "full_sum": null,
    "date_add": "2022-05-12 09:08:26",
    "date_upd": "2022-05-12 09:08:26",
    "percents": []
  },
  {
    "id_payment_wait": 3889,
    "total": 0,
    "total_free": 0,
    "total_minus": 971,
    "category": "Плюшки",
    "contragent": "комус",
    "site": "",
    "project": "",
    "comment": "еда в офис",
    "from": "Игнат Корюков",
    "status": 0,
    "oldProject": 0,
    "daysProject": "0",
    "daysType": 1,
    "period": null,
    "money_to": null,
    "projectType": null,
    "sent_to_planfix": 0,
    "full_sum": null,
    "date_add": "2022-05-12 05:45:29",
    "date_upd": null,
    "percents": []
  },
  {
    "id_payment_wait": 3872,
    "total": 268800,
    "total_free": 0,
    "total_minus": 0,
    "category": "Разработка",
    "contragent": "Мэд Брейнс",
    "site": "Мэд Брейнс",
    "project": "услуги программирования 04/2022",
    "comment": "100%",
    "from": "Игнат Корюков",
    "status": 0,
    "oldProject": 2,
    "daysProject": "0",
    "daysType": 1,
    "period": null,
    "money_to": null,
    "projectType": null,
    "sent_to_planfix": 0,
    "full_sum": null,
    "date_add": "2022-05-04 09:38:12",
    "date_upd": null,
    "percents": [
      {
        "id_payment_percent": 5580,
        "id_payment_wait": 3872,
        "manager": "Иван Ярославцев",
        "name": "Продажа",
        "total": 268800
      },
      {
        "id_payment_percent": 5581,
        "id_payment_wait": 3872,
        "manager": "Иван Ярославцев",
        "name": "Ведение",
        "total": 268800
      }
    ]
  },
  {
    "id_payment_wait": 3862,
    "total": 84000,
    "total_free": 0,
    "total_minus": 0,
    "category": "Разработка",
    "contragent": "turba-karting.ru",
    "site": "turba-karting.ru",
    "project": "Депозит 2",
    "comment": "100%",
    "from": "Роман Тетерин",
    "status": 0,
    "oldProject": 0,
    "daysProject": "365",
    "daysType": 1,
    "period": null,
    "money_to": null,
    "projectType": null,
    "sent_to_planfix": 0,
    "full_sum": null,
    "date_add": "2022-04-28 13:16:03",
    "date_upd": null,
    "percents": [
      {
        "id_payment_percent": 5564,
        "id_payment_wait": 3862,
        "manager": "Роман Тетерин",
        "name": "Продажа",
        "total": 84000
      },
      {
        "id_payment_percent": 5565,
        "id_payment_wait": 3862,
        "manager": "Роман Тетерин",
        "name": "Ведение",
        "total": 84000
      }
    ]
  }
]

describe('payment-reducer tests', () => {
  it('Initial state', () => {
    expect(paymentReducer(undefined, {})).toEqual(initialState);
  });

  it('Change checked payment type', () => {
    expect(
      paymentReducer(initialState, changePaymentType(5))
    ).toEqual({
      ...initialState,
      checkedPaymentType: 5
    });
  });

  it('Change income type', () => {
    expect(
      paymentReducer(initialState, changeIncomeType(5))
    ).toEqual({
      ...initialState,
      checkedIncomeType: 5
    });
  });

  it('Change consumption type', () => {
    expect(
      paymentReducer(initialState, changeСonsumptionType(5))
    ).toEqual({
      ...initialState,
      checkedСonsumptionType: 5
    });
  });

  it('Change sites', () => {
    expect(
      paymentReducer(initialState, changeSites(sites))
    ).toEqual({
      ...initialState,
      sites: sites
    });
  });

  it('Change managers', () => {
    expect(
      paymentReducer(initialState, changeManagers(managers))
    ).toEqual({
      ...initialState,
      managers: managers
    });
  });

  it('Change payments', () => {
    expect(
      paymentReducer(initialState, changePayments(payments))
    ).toEqual({
      ...initialState,
      payments: payments
    });
  });

  it('Change edit payment success', () => {
    expect(
      paymentReducer(initialState, changeEditPaymentSuccess(false))
    ).toEqual({
      ...initialState,
      editPaymentSuccess: false
    });

    expect(
      paymentReducer(initialState, changeEditPaymentSuccess(true))
    ).toEqual({
      ...initialState,
      editPaymentSuccess: true
    });
  });

  it('Change edit payment error', () => {
    expect(
      paymentReducer(initialState, changeEditPaymentError(''))
    ).toEqual({
      ...initialState,
      editPaymentError: ''
    });

    const errorText = 'Ошибка при редактировании оплаты';

    expect(
      paymentReducer(initialState, changeEditPaymentError(errorText))
    ).toEqual({
      ...initialState,
      editPaymentError: errorText
    });
  });
});