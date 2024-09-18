import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeСonsumptionType } from '../../../reducers/payment-reducer';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const ConsumptionTypes = () => {

    const checkedСonsumptionType = useSelector((state) => state.payment.checkedСonsumptionType);
    const consumptionTypes       = useSelector((state) => state.payment.consumptionTypes);
    const dispatch               = useDispatch();

    const onChangeConsumptionType = (consumptionType) => dispatch(changeСonsumptionType(consumptionType));

    return (
        <ToggleButtonGroup type="radio" name="income-type" value={checkedСonsumptionType} onChange={onChangeConsumptionType}>
            {consumptionTypes.map((consumptionType, id) => (
                <ToggleButton
                    key={id}
                    id={`income-type-${id}`}
                    type="radio"
                    variant={checkedСonsumptionType === consumptionType.value ? 'primary' : 'outline-primary'}
                    value={consumptionType.value}
                    checked={checkedСonsumptionType === consumptionType.value}
                >
                    {consumptionType.title}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default ConsumptionTypes;
