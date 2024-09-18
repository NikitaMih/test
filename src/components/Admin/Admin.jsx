import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAuthFromLS } from '../Helpers/AuthLS'
import { CommonData } from '../../common';

const Admin = (props) => {

    const currentManager = useSelector((state) => state.auth.currentManager);
    const history = useHistory();

    //Если не админ - редирект на страницу входа
    useEffect(() => {
        if (!currentManager && !getAuthFromLS()) {
            history.push('/login')
        }
        if (getAuthFromLS() !== CommonData.adminManager && currentManager !== CommonData.adminManager) {
            history.push('/login');
        }
    }, [currentManager]);

    return(
        <div>
            Страница Админа
        </div>
    );
}

export default Admin;
