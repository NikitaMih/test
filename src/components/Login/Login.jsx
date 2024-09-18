import React, { useState, useEffect } from 'react';
import {changeCurrentManager} from '../../reducers/auth-reducer';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom';
import { setAuthToLS, getAuthFromLS } from '../Helpers/AuthLS'
import { CommonData } from '../../common';

let Login = () => {

    const managers = useSelector((state) => state.payment.managers);
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedManager, setSelectedManager] = useState(CommonData.adminManager);
    const authManager = (manager) => dispatch(changeCurrentManager(manager));
    const [password, setPassword] = useState('');

    const handleChange = (event) => {
        setSelectedManager(event.target.value);
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    }


    /**
     * Авторизовывает пользователя
     * Сохраняет в state + в localStorage
     * @date 2021-10-12
     * @returns {nothing}
     */
    const authUser = () => {
        if (selectedManager === CommonData.adminManager && password !== CommonData.password) {
            return false;
        }
        if (!selectedManager) {
            return false;
        }
        authManager(selectedManager);
        setAuthToLS(selectedManager);
        history.push("/");
    }

    useEffect(() => {
        let currentManager = getAuthFromLS();
        if (currentManager) authManager(currentManager);
        if (currentManager) setSelectedManager(currentManager);
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Select value={selectedManager} onChange={handleChange}data-testid="manager-select">
                        {Object.keys(managers).map((manager) => (
                            <option key={managers[manager].name} value={managers[manager].name}>{managers[manager].name}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            {
                selectedManager === CommonData.adminManager ?
                <div className="mt-3">
                    <Form.Control onChange={handleChangePassword} required value={password} id="password" type="password" placeholder="Пароль" />
                </div>
                : null
            }
            <Row>
                <Col md={12} className="mt-3 justify-content-center d-flex">
                    <Button onClick={() => authUser()}>Войти</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
