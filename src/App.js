import React, {useEffect} from 'react';
import { compose } from '@reduxjs/toolkit';
import { connect, Provider, useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
    useHistory
} from 'react-router-dom';
import { store } from "./redux/store";
import Header from './components/Header/Header';
import Admin from './components/Admin/Admin';
import Login from './components/Login/Login';
import Payment from './components/Payment/Payment';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { changeManagers, changeSites, loadPayments, loadManagers, loadSites, changePayments, loadContragents } from './reducers/payment-reducer';
import { changeCurrentManager } from './reducers/auth-reducer';
import { getAuthFromLS } from './components/Helpers/AuthLS'

const App = () => {

    const dispatch = useDispatch();
    const fetchManagers = (managers) => dispatch(changeManagers(managers));
    const fetchSites = (sites) => dispatch(changeSites(sites));
    const setCurrentManager = (manager) => dispatch(changeCurrentManager(manager));
    const currentManager = useSelector((state) => state.auth.currentManager);
    const history = useHistory();
    
    //Если не залогинен - редирект на страницу входа
    useEffect(() => {
        if (!currentManager && !getAuthFromLS()) {
            history.push('/login')
        }
    }, [currentManager]);
    

    useEffect(() => {
        // getPaymentList();
        dispatch(loadPayments());
        dispatch(loadManagers());
        dispatch(loadSites());
        dispatch(loadContragents());
    }, []);

    let currentManagerLs = getAuthFromLS();
    if (typeof currentManagerLs != 'undefined' && !currentManager) {
        setCurrentManager(currentManagerLs);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Header />
                    <Switch>
                        {/* <Redirect exact from='/' to='/bux/react/login.html' /> */}
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/" render={() => <Payment />}/>
                        <Route path="/admin" render={() => <Admin />}/>
                        <Route path="*" render={() => <div>404 NOT FOUND</div>} />
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
}

const mapStateToProps = (state) => state

const actionCreators = {}

const AppContainer =  compose(
    withRouter, 
    connect(mapStateToProps, actionCreators),
)(App);

const MainApp = (props) => {
    return (
        <Provider store={store}>
            <Router>
                <AppContainer />
            </Router>
        </Provider>
    )
}

export default MainApp;
