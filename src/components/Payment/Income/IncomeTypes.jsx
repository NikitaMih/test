import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeIncomeType } from '../../../reducers/payment-reducer';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const IncomeTypes = () => {

    const checkedIncomeType = useSelector((state) => state.payment.checkedIncomeType);
    const incomeTypes       = useSelector((state) => state.payment.incomeTypes);
    const dispatch          = useDispatch();

    const onChangeIncomeType = (incomeType) => dispatch(changeIncomeType(incomeType));

    return (
        <ToggleButtonGroup type="radio" name="income-type" value={checkedIncomeType} onChange={onChangeIncomeType}>
            {incomeTypes.map((incomeType, id) => (
                <ToggleButton
                    key={id}
                    id={`income-type-${id}`}
                    type="radio"
                    variant={checkedIncomeType === incomeType.value ? 'primary' : 'outline-primary'}
                    value={incomeType.value}
                    checked={checkedIncomeType === incomeType.value}
                >
                    {incomeType.title}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default IncomeTypes;
