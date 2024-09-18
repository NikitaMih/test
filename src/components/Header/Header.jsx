import React from "react";
import Nav from "react-bootstrap/Nav";
import { useSelector, useDispatch } from 'react-redux';

let Header = (props) => {
    const manager = useSelector((state) => state.auth.currentManager);

    return (
        <header>
            <Nav activeKey="/">
                <Nav.Item>
                    <Nav.Link href="/">Добавление платежа</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/login">{manager ? 'Вы: ' + manager : 'Войти'}</Nav.Link>
                </Nav.Item>
            </Nav>
        </header>
    );
};

export default Header;
