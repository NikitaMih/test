import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ConsumptionForm from './Form/Consumption/ConsumptionForm';
import IncomeForm from './Form/Income/IncomeForm';

import { StatePayment } from '../../Models/Payment';

const PaymentFormWrapper = () => {
    const checkedPaymentType = useSelector((state) => state.payment.checkedPaymentType);

    const sites       = useSelector((state) => state.payment.sites);
    const contragents = useSelector((state) => state.payment.contragents);
    const managers    = useSelector((state) => state.payment.managers);
    const currentManager = useSelector((state) => state.auth.currentManager);
    
    //Форма
    let stateModel = StatePayment;
    stateModel.workers[0].manager = currentManager;
    stateModel.workers[0].seller  = currentManager;
    const [formData, setFormData] = useState(stateModel);
    
    return (
        <div>
            {
                checkedPaymentType === 1 ?
                    <IncomeForm  formData={formData} setFormData={setFormData} sites={sites} managers={managers} contragents={contragents} />
                : 
                    <ConsumptionForm formData={formData} setFormData={setFormData} sites={sites} managers={managers} contragents={contragents} />
            } 
        </div>
    );
}

export default PaymentFormWrapper;
