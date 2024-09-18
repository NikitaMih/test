//Храним авторизацию в localStorage, т.к на старой бухгалтерии хранилась в куке manager, что в целом одно и то же
export const getAuthFromLS = () => {
    return localStorage.getItem('currentManager');
}

export const setAuthToLS = (manager) => {
    localStorage.setItem('currentManager', manager);
}
