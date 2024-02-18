import { getCookie } from "./cookies";

/**
 * Performs a PUT Api request with Content-Type: application/json.
 * Automatically appends the X-XSRF-TOKEN header based on the value
 * of the XSRF-TOKEN cookie, and adds Bearer Authorization header
 * with the token retrieved from the cookie (if present)
 *
 * @param {String} url: the url of the request
 *
 * @param {Object} data: the parameters of the request
 *
 * @param {Function} success: callback called after a successful request
 *
 * @param {Function} error: callback called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
export function jsonPutAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    /**
     * Getting the XSRF-TOKEN cookie decoded
     */
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    /**
     * Adding application/json value both to Content-Type and Accept headers
     * Adding X-XSRF-TOKEN header
     */
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken,
    }
    /**
     * Getting auth_token from cookie (this is the token retrieved after a successful login)
     */
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }


    fetch(APP_URL + url, {
        method: "PUT",
        signal: signal,
        headers,
        body: JSON.stringify(data), // Send data as an object
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

/**
 * Performs a DELETE Api request with Content-Type: application/json.
 * Automatically appends the X-XSRF-TOKEN header based on the value
 * of the XSRF-TOKEN cookie, and adds Bearer Authorization header
 * with the token retrieved from the cookie (if present)
 *
 * @param {String} url: the url of the request
 *
 * @param {Object} data: the parameters of the request
 *
 * @param {Function} success: callback called after a successful request
 *
 * @param {Function} error: callback called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
export function jsonDeleteAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    /**
     * Getting the XSRF-TOKEN cookie decoded
     */
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    /**
     * Adding application/json value to Content-Type
     * Adding X-XSRF-TOKEN header
     */
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken,
    }
    /**
     * Getting auth_token from cookie (this is the token retrieved after a successful login)
     */
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    fetch(APP_URL + url, {
        method: "DELETE",
        signal: signal,
        headers,
        body: JSON.stringify(data), // Send data as an object
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

/**
 * Performs a POST Api request with Content-Type: application/json.
 * Automatically appends the X-XSRF-TOKEN header based on the value
 * of the XSRF-TOKEN cookie, and adds Bearer Authorization header
 * with the token retrieved from the cookie (if present)
 *
 * @param {String} url: the url of the request
 *
 * @param {Object} data: the parameters of the request
 *
 * @param {Function} success: callback called after a successful request
 *
 * @param {Function} error: callback called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
export function jsonPostAPI(url, data, success, error, signal) {
    data = data || {};
    data.lang = localStorage.getItem('locale')
    /**
     * Getting the XSRF-TOKEN cookie decoded
     */
    const xsrfToken = decodeURIComponent(getCookie('XSRF-TOKEN'));
    /**
     * Adding application/json value to Content-Type
     * Adding X-XSRF-TOKEN header
     */
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-XSRF-TOKEN": xsrfToken,
    }
    /**
     * Getting auth_token from cookie (this is the token retrieved after a successful login)
     */
    const auth_token = getCookie('auth_token');
    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`
    }
    fetch(APP_URL + url, {
        method: "POST",
        signal: signal,
        headers,
        body: JSON.stringify(data), // Sending data as JSON object
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

/**
 * Performs a GET Api request with Content-Type: application/json.
 * Automatically appends the X-XSRF-TOKEN header based on the value
 * of the XSRF-TOKEN cookie, and adds Bearer Authorization header
 * with the token retrieved from the cookie (if present)
 *
 * NOTE: the main difference between this function and jsonGetAPI is
 * that in this function we retrieve the response as text and in the other
 * the response is JSON-decoded
 *
 * @param {String} url: the url of the request
 *
 * @param {Object} data: the parameters of the request
 *
 * @param {Function} success: callback called after a successful request
 *
 * @param {Function} error: callback called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
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

/**
 * Performs a GET Api request with Content-Type: application/json.
 * Automatically appends the X-XSRF-TOKEN header based on the value
 * of the XSRF-TOKEN cookie, and adds Bearer Authorization header
 * with the token retrieved from the cookie (if present)
 *
 * @param {String} url: the url of the request
 *
 * @param {Object} data: the parameters of the request
 *
 * @param {Function} success: callback called after a successful request
 *
 * @param {Function} error: callback called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
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
    /**
     * Url generation. This step transforms the Object 'data' into a query string
     * then the url is generated by the concatenation of 'APP_URL' constant + 'url' variable and the generated
     * query string.
     * Example:
     * var x = getUrlAPI('/', { key1: 1, key2: 2})
     * console.log(x) --> prints 'http://localhost:8000?key1=1&key2=2'
     */
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

/**
 * Returns a concatenation of 'APP_URL' constant with the variable 'path'
 * and a query string generated from an object
 * Example:
 * const APP_URL = 'http://localhost:8000';
 * getUrlAPI('/api/beers', {page: 0, limit: 10}) returns:
 * http://localhost:8000/api/beers?page=0&limit=10
 *
 * @param {String} path
 *
 * @param {String} params
 *
 * @returns
 */
export function getUrlAPI(path, params) {
    let url = APP_URL + path;

    if (typeof params == "object") {
        url += "?" + serializeParams(params);
    }
    return url;
}

/**
 * Recursive function that generates a query string
 * from an object.
 *
 * @param {Object} obj
 *
 * @param {String} prefix
 *
 * @returns
 */
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

/**
 * Web app login
 * After a successful response the user is authenticated with two guards:
 * - sanctum
 * - default guard based on database sessions
 *
 * @param {Object} data
 *
 * @param {Function} success
 *
 * @param {Function} error
 *
 * @param {Number} signal
 */
export function loginWebAPI(data, success, error, signal) {
    jsonPostAPI('/login', data, success, error, signal)
}

/**
 * Web app logout (unused)
 *
 * @param {Object} data
 *
 * @param {Function} success
 *
 * @param {Function} error
 *
 * @param {Number} signal
 */
export function logoutWebAPI(data, success, error, signal) {
    jsonGetAPI('/logout', data, success, error, signal)
}

/**
 * Login using sanctum guard only. No cookies/sessions
 *
 * @param {Object} data
 *
 * @param {Function} success
 *
 * @param {Function} error
 *
 * @param {Number} signal
 */
export function loginAPI(data, success, error, signal) {
    jsonPostAPI('/api/login', data, success, error, signal);
}

/**
 * Gets current user
 *
 * @param {Object} data
 *
 * @param {Function} success
 *
 * @param {Function} error
 *
 * @param {Number} signal
 */
export function getUserAPI(data, success, error, signal) {
    jsonGetAPI('/api/user', data, success, error, signal);
}

/**
 * Gets beers list
 *
 * @param {Object} data: an object with 'page' and 'limit' parameters
 *
 * @param {Function} success: callback to be called after a successful request
 *
 * @param {Function} error: callback to be called after an error
 *
 * @param {Number} signal: the signal of the request (used to cancel the request)
 */
export function getBeersAPI(data, success, error, signal) {
    jsonGetAPI('/api/beers', data, success, error, signal);
}


