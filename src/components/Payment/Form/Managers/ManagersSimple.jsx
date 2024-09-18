import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const ManagersSimple = (props) => {

    const handleChange = (event, index) => {
        let newArr = JSON.parse(JSON.stringify(props.formData)); //Чтобы не клонировать объект. Иначе не давало менять менеджеров.
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
        newArr.workers.push({
            'manager': '',
            'seller' : ''
        });
        props.setFormData(newArr);
    }

    return (
        <div className="mt-3">
            {props.formData.workers.map((row, index) => (
                <Row key={index}>
                    <Col md={3} xs={12}>
                        <h5>Кто продал</h5>
                        <Form.Select onChange={(e) => handleChange(e, index)} value={props.formData.workers[index]['seller']} id="seller">
                            <option value=""></option>
                            {Object.keys(props.managers).map((manager) => (
                                <option key={manager} value={props.managers[manager].name}>{props.managers[manager].name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={3} xs={12}>
                        <h5>Кто ведет</h5>
                        <Form.Select onChange={(e) => handleChange(e, index)} value={props.formData.workers[index]['manager']} id="manager">
                            <option value=""></option>
                            {Object.keys(props.managers).map((manager) => (
                                <option key={manager} value={props.managers[manager].name}>{props.managers[manager].name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    {index + 1 === props.formData.workers.length ?
                        <Col md={2} xs={12}>
                            <h5>Добавить</h5>
                            <Button variant="primary" onClick={addManager}>Добавить продавца</Button>
                        </Col>
                        : null
                    }
                </Row>
            ))}
        </div>
    );
}

export default ManagersSimple;
