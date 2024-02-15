import { getCookie } from "./cookies";

export function jsonPutAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken,
    }
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    //data.user_token = BBAppSDK.USER_TOKEN;
    fetch(APP_URL + url, {
        method: "PUT",
        signal: signal,
        headers,
        body: JSON.stringify(data),
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                throw new Error(json.error);
            }
            return json;
        })
        .then(success)
        .catch(error);
}

export function jsonDeleteAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken,
    }
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    //data.user_token = BBAppSDK.USER_TOKEN;
    fetch(APP_URL + url, {
        method: "DELETE",
        signal: signal,
        headers,
        body: JSON.stringify(data),
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                throw new Error(json.error);
            }
            return json;
        })
        .then(success)
        .catch(error);
}

export function jsonPostAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken,
    }
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    //data.user_token = BBAppSDK.USER_TOKEN;
    fetch(APP_URL + url, {
        method: "POST",
        signal: signal,
        headers,
        body: JSON.stringify(data),
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                throw new Error(json.error);
            }
            return json;
        })
        .then(success)
        .catch(error);
}

export function getAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken
    }
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    //data.user_token = BBAppSDK.USER_TOKEN;
    url = getUrlAPI(url, data);
    fetch(url, {
        method: "GET",
        signal: signal,
        headers,
    })
        .then((response) => Promise.all([response, response.text()]))
        .then(([response, body]) => {
            if (!response.ok) {
                throw new Error(json.error);
            }
            return body;
        })
        .then(success)
        .catch(error);
}

export function jsonGetAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    //data.user_token = BBAppSDK.USER_TOKEN;
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken,
    }
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    url = getUrlAPI(url, data);
    fetch(url, {
        method: "GET",
        signal: signal,
        headers,
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                throw new Error(json.error);
            }
            return json;
        })
        .then(success)
        .catch(error);
}

export function getUrlAPI(path, params) {
    let url = APP_URL + path;

    if (typeof params == "object") {
        url += "?" + serializeParams(params);
    }
    return url;
}

export function serializeParams(obj, prefix) {
    var str = [],
        p;

    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];

            str.push(
                v !== null && typeof v === "object"
                    ? serializeParams(v, k)
                    : encodeURIComponent(k) +
                          "=" +
                          //   (k != "user_token" ? encodeURIComponent(v) : v)
                          encodeURIComponent(v)
            );
            if (v === null || v === undefined) {
                str.pop();
            }
        }
    }
    return str.join("&");
}

export function loginWebAPI(data, success, error, signal) {
    jsonPostAPI('/login', data, success, error, signal)
}

export function logoutWebAPI(data, success, error, signal) {
    jsonGetAPI('/logout', data, success, error, signal)
}

export function loginAPI(data, success, error, signal) {
    jsonPostAPI('/api/login', data, success, error, signal);
}

export function getUserAPI(data, success, error, signal) {
    jsonGetAPI('/api/user', data, success, error, signal);
}

export function getBeersAPI(data, success, error, signal) {
    jsonGetAPI('/api/beers', data, success, error, signal);
}


