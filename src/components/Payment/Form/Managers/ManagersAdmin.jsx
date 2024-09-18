import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const ManagersAdmin = (props) => {

    const handleChange = (event, index) => {
        let newArr = {...props.formData};
        newArr.workers[index][event.target.id] = event.target.value;
        props.setFormData(newArr);
    }

    /**
     * Кнопка - добавить продавца
     * Создает объект и добавляет в массив
     * @date 2021-10-12
     * @returns {any}
     */
    const addManager = () => {
        let newArr = {...props.formData};
        newArr.workers.push(        {
            'manager': 'Иван Ярославцев',
            'id_payment_percent': '',
            'name': 'Продажа',
            'total': ''
        });
        props.setFormData(newArr);
    }

    return (
        <div className="mt-3">
            {props.formData.workers.map((row, index) => (
                <Row key={index} className="mt-2">
                    <Col md={2} xs={6}>
                    <h5>Кто</h5>
                    <Form.Select onChange={(e) => handleChange(e, index)} value={props.formData.workers[index]['manager']} id="manager">
                        {Object.keys(props.managers).map((manager) => (
                            <option key={manager} value={props.managers[manager].name}>{props.managers[manager].name}</option>
                        ))}
                    </Form.Select>
                </Col>

                <Col md={2} xs={6}>
                    <h5>Сумма</h5>
                    <Form.Control onChange={(e) => handleChange(e, index)} required value={props.formData.workers[index]['total']} id="total" placeholder="Сумма" />
                </Col>
                
                <Col md={2} xs={6}>
                    <h5>Тип бонуса</h5>
                    <Form.Select onChange={(e) => handleChange(e, index)} value={props.formData.workers[index]['name']} id="name">
                        <option value="Продажа">Продажа</option>
                        <option value="Ведение">Ведение</option>
                    </Form.Select>
                </Col>
                <Col md={2} xs={6}>
                    <h5>Процент</h5>
                    <Form.Control onChange={(e) => handleChange(e, index)} required value={props.formData.workers[index]['percent']} id="percent" placeholder="Процент" />
                </Col>
                </Row>
            ))}
             <div className="mt-2">
                <Button variant="primary" onClick={addManager}>+</Button>
            </div>
        </div>
    );
}

export default ManagersAdmin;
