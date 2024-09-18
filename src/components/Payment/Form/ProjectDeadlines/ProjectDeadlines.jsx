import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { CommonData } from '../../../../common';
import Asterisk from '../../../Asterisk';

const ProjectDeadline = (props) => {

    const handleChange = (event) => {
        props.setFormData({
            ...props.formData,
            [event.target.id]: event.target.value
        });
    }

    /**
     * Смена типа проекта
     * Пришлось вынести отдельно от handleChange
     * @date 2021-10-12
     * @returns {void}
     */
    const handleChangeTypes = (event) => {
        props.setFormData({
            ...props.formData,
            projectType: event
        });
    }

    return (
        <div className="mt-3">
            <Row>
                <Col>
                    <h5>Сроки проекта <Asterisk /> </h5>
                </Col>
            </Row>

            <Row>
                <Col md={3} xs={12}>
                    <Form.Control
                     onChange={handleChange}
                     value={props.formData.daysProject}
                     id="daysProject"
                     type={props.formData.daysType == 4 ? "date" : "text"}
                     placeholder="Цифра или дата" />
                </Col>
                <Col md={2} xs={12}>
                    <Form.Select onChange={handleChange} value={props.formData.daysType} id="daysType">
                        {Object.keys(CommonData.daysTypes).map((typeId) => (
                            <option key={typeId} value={typeId}>{CommonData.daysTypes[typeId]}</option>
                        ))}
                    </Form.Select>
                </Col>

                {props.shouldShowProjectType ?

                <Col md={2} xs={12}>
                    <ToggleButtonGroup type="radio" name="project_type" value={props.formData.projectType} onChange={handleChangeTypes}>
                        {Object.keys(CommonData.projectTypes).map((type) => (
                             <ToggleButton
                                key={type}
                                type="radio"
                                value={type}
                                id={'type-'+type}
                                checked={props.formData.projectType == type}
                            >
                             {CommonData.projectTypes[type]}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Col>
                : null}
            </Row>
        </div>
    );
}

export default ProjectDeadline;
