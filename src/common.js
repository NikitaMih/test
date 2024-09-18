const CommonData = {
    categories: {
        'Разработка': [
            'Фикс',
            'T&M',
            'Внешний проект',
            'Конструктор',
            'Тестирование',
            'Верстка'
        ],
        'Общая': [
            'Продвижение',
            'Рекламный бюджет',
            'Дизайн',
            'Обучение',
            'Аудит'
        ],
        'Доходы': [
            'Партнерки',
            'Продажа лицензий',
        ],
        'Зарплата': [
            'Зарплата',
            'Налоги на ЗП',
            'Отпускные',
            'Отпускные деньгами'
        ],
        'Расходы': [
            'Корпоративы и подарки',
            'Софт и сервисы',
            'Конференции / PR',
            'HR',

            'Офис и его обеспечение',
            'Хостинг и домены',
            'Копирайтинг и наполнение',
            'Налоги',
            'Банк',
            'Связь',
            'Мебель и техника',
            'Юрист',
            'Бухгалтерия',
            'Все остальное'
        ]
    },
    projectTypes: {
        prestashop: 'Престашоп',
        bitrix: 'Битрикс',
        laravel: 'Ларавель',
        other: 'Другое',
    },
    daysTypes: {
        2: 'Раб.дней',
        1: 'Календ. дней',
        //4 чтобы не ломать совместимость, т.к 3 в старой бухгалтерии юзается
        4: 'Дата зав.'
    },

    adminManager: 'Иван Ярославцев',
    password: 'admin'
}

/** 
 * Тип формы - ID из consumption или income
 *  
 **/
const formTypes = {
    CONSUMPTION_NO_PROJECT: 1,
    CONSUMPTION_WITH_PROJECT: 2,
    INCOME_EXISTS: 2,
    INCOME_NEW: 1,
    INCOME_MONTHLY: 3,
};
const credentials = [
    'admin',
    'altopromo'
];
const apiDomain =  'https://pay-api.leadget.ru/'; // Слэш в конце

export {apiDomain};
export {
    formTypes
};
export {
    CommonData
};
export {
    credentials
};
