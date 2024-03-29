import http from 'k6/http';
import { check, group, fail } from 'k6';
import { options1, options2 } from './config.js';

// const BASE_URL = 'https://test-api.k6.io'; //Задание №1. Смена хоста у endpoint`a для всех запросов. Можно задать как const, можно передать как Enviroment Variable
// для запуска запустить команду HTTPS_PROXY=http://localhost:8888 k6 run  -e BASE_URL=https://test-api.k6.io load_script.js

// Задание 5. options лежат в config.js
export const options = options2



// Create a random string of given length
function randomString(length, charset = '') {
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}

// Задание 4. Читаем файл с пулом данных в переменную
const loginData = JSON.parse(open("./users.json"));
// Задание 4. Записываем значение параметров в переменные
const USERNAME = loginData.username + `${randomString(10)}@example.com`
const PASSWORD = loginData.password





export function setup() {
    // Задание 4. Передаем динамические данные в body POST запроса
    const res = http.post(`${__ENV.BASE_URL}/user/register/`, {
        first_name: 'Crocodile',
        last_name: 'Owner',
        username: USERNAME,
        password: PASSWORD,
    });

    check(res, { 'created user': (r) => r.status === 201 });

    const loginRes = http.post(`${__ENV.BASE_URL}/auth/token/login/`, {
        username: USERNAME,
        password: PASSWORD,
    });

    // Задание 2. Получаем токен для аутентификации, записываем в переменную authToken
    const authToken = loginRes.json('access');
    // console.log(loginRes.json())
    check(authToken, { 'logged in successfully': () => authToken !== '' });
    // console.log('token - ',authToken)
    return authToken;
}

export default function (authToken) {


    // Задание 2.Передаем в хедеры значение токена
    // Задание 3.Для разных типов запросов присваеваем разные типы хедеров, в нашем случае для GET 'Content-Type': 'text/html', для POST 'Content-Type': 'application/x-www-form-urlencoded'

    const get_params = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'text/html',
        },

    };


// для POST запроса передаем теги при необходимости
    const post_params = (tag) => ({
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',

        },
        tags: Object.assign(
            {},
            {
                name: 'PrivateCrocs',
            },
            tag
        ),
    });




    const res = http.get(`${__ENV.BASE_URL}/public/crocodiles/`, get_params);

    // проверка на код ответа (200) 
    check(res, { 'get croc': (r) => r.status === 200 });

    // Задание 6. переменная arr - json`ы в формате массива
    const arr = res.json();

    // Задание 6. перебираем массив с json`ами и парсим к примеру ключ id
    arr.forEach(function (item, i, arr) {
        console.log(item.id)
    });





    let URL = `${__ENV.BASE_URL}/my/crocodiles/`;

    group('01. Create a new crocodile', () => {
        const payload = {
            name: `Name ${randomString(10)}`,
            sex: 'F',
            date_of_birth: '2023-05-11',
        };

        
        const res = http.post(URL, payload, post_params({ name: 'Create' }))

        if (check(res, { 'Croc created correctly': (r) => r.status === 201 })) {
            URL = `${URL}${res.json('id')}/`;
        } else {
            console.log(`Unable to create a Croc ${res.status} ${res.body}`);
            return;
        }
    });


};
