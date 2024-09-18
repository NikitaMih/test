import {
    paymentToStateObject,
    stateFormToPayment,
    paymentToStateObjectAdmin,
    stateFormToPaymentAdmin,
} from './PaymentConvert';


describe('Payment converter tests', () => {

    it('paymentToStateObject works correct', () => {
        const payment = {
            category: 'category value',
            site: 'site value',
            contragent: 1,
            from: 'from value',
            total: 'total value',
            percents: [
                {
                    name: 'Продажа',
                    manager: 'Тестовый менеджер',
                    id_payment_percent: '15',
                },
            ],
        };

        const state = {
            someField: 'value'
        };

        const expectedObj = {
            someField: 'value',
            workers: [
                {
                    seller: 'Тестовый менеджер',
                    manager: '',
                    id_payment_percent_sell: '15',
                    id_payment_percent_manager: '',
                },
            ],
            sum: 'total value',
            sum_minus: undefined,
            category: 'category value',
            site: 'site value',
            payer: 1,
            from: 'from value',
            project: '',
            comment: undefined,
            daysType: undefined,
            daysProject: undefined,
            full_sum: undefined,
            consumptions: '',
            money_to: '',
            period: '',
            projectType: '',
        };

        const obj = paymentToStateObject(payment, state);
        expect(obj).toEqual(expectedObj);
    });

    it('paymentToStateObject throws error with wrong arguments', () => {
        expect(
            () => paymentToStateObject(undefined, undefined)
        ).toThrow(TypeError);
    });

});
