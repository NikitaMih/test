import {credentials, apiDomain} from '../common' ;
let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
};
if(typeof credentials[0] !== "undefined"){
    headers.Authorization = 'Basic ' + btoa(credentials[0] + ':' + credentials[1]) ;
}
class AjaxProvider {

    static get = async (url) => {
        try {

            let request = await fetch(apiDomain + url, {
                method: 'GET',
                headers: headers
            })

            let response = await request.json();
            return response; 
        } catch (err) {
            console.log(err);
            return {
                success: 0,
                errors: 'Произошла глобальная ошибка'
            }
        }
    }

    static post = async (url, data) => {
        try {
            let headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            };
            if(typeof credentials[0] !== "undefined"){
                headers.Authorization = 'Basic ' + btoa(credentials[0] + ':' + credentials[1]) ;
            }
            let request = await fetch(apiDomain + url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers
            });
            let response = await request.json();
            return response; 
        } catch (err) {
            console.log(err);
            return {
                success: 0,
                errors: 'Произошла глобальная ошибка'
            }
        }
    }

    static delete = async (url, data) => {
        try {
            let request = await fetch(apiDomain + url, {
                method: 'DELETE',
                body: JSON.stringify(data),
                headers: headers
            })
            let response = await request.json();
            return response; 
        } catch (err) {
            console.log(err);
            return {
                success: 0,
                errors: 'Произошла глобальная ошибка'
            }
        }
    }

    static put = async (url, data) => {
        try {
            let request = await fetch(apiDomain + url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: headers
            })
            let response = await request.json();
            return response; 
        } catch (err) {
            console.log(err);
            return {
                success: 0,
                errors: 'Произошла глобальная ошибка'
            }
        }
    }
}

export { AjaxProvider };
