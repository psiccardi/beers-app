var Utils = {};

Utils.functions = {};

/**
 * This function adds Infinite Scroll logic to an HTML Element
 *
 * @param {String|HTMLElement} el: this can be a CSS selector, or an HTMLElement instance
 *
 * @param {Function} callback: the function called when the scrolling reaches bottom
 *
 */
Utils.functions.initInfiniteScroll = function (el, callback) {
    if (!(el instanceof HTMLElement)) {
        el = document.querySelector(el);
    }
    el.addEventListener('scroll', function (e) {
        console.log(Math.ceil(el.scrollTop + el.clientHeight, el.scrollHeight))
        if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 50) {

            callback();
        }
    }, { passive: true });
}

Utils.string = {};

/**
 * This function replaces blank spaces with underscores
 * and transforms the string into lowercase
 *
 * @param {String} string
 *
 * @returns {String}
 */
Utils.string.toUnderscoreSlug = function (string) {
    string = string.replace(/\s+/, '_');
    return string.toLowerCase();
}

/**
 * This function truncates a string and, if length < string.length, adds '...'
 * to the end of the string
 *
 * @param {String} string
 *
 * @param {Number} length
 *
 * @returns {String}
 */
Utils.string.truncate = function (string, length) {
    if (string.length <= length) {
        return string;
    }

    return string.substring(0, length) + "...";
};

/**
 * This function transforms a string in an HTML-encoded string
 *
 * @param {String} rawStr
 *
 * @returns {String}
 */
Utils.string.encodeHTMLEntities = (rawStr) => {
    return rawStr.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';')
}

Utils.response = {};

/**
 * This function throws an Error if exists 'ERROR' or 'error' keys
 * inside the Object 'data'.
 * This function is used to handle the responses from the API requests
 *
 * @param {Object} data
 *
 * @param {Function} t
 */
Utils.response.handleError = function (data, t) {
    if (data.ERROR) {
        throw new Error(t(data.ERROR.MESSAGE));
    } else if (data.error) {
        throw new Error(t(data.error));
    }
};

Utils.URL = {};

/**
 * This function parses the query string of an URL and returns an object
 * Example:
 * var p='?test=value&test2[key1]=test2_value1&test2[key2]=test2_value2'
 *
 * Utils.URL.parseParams(p) returns:
 * {
 *      test: 'value',
 *      test2: {
 *          key1: 'test2_value1',
 *          key2: 'test2_value2'
 *      }
 * }
 *
 *
 * @param {String} p
 *
 * @returns {Object}
 */
Utils.URL.parseParams = function (p) {
    var p = p.replace(/^\?/, "");
    var paramsSplit = p.split("&");
    var obj = {};
    for (var i = 0; i < paramsSplit.length; i++) {
        var _obj = obj;
        var paramSplit2 = paramsSplit[i].split("=");
        var key = paramSplit2[0];
        var firstKey = key.match(/^([^\[])+/g);
        var test = key.match(/\[([^\]]+)\]/gi);
        if (test && test.length) {
            _obj[firstKey] = _obj[firstKey] || {};
            _obj = _obj[firstKey];
            for (var j = 0; j < test.length; j++) {
                var sKey = test[j];
                sKey = sKey.replace("[", "").replace("]", "");
                if (j === test.length - 1) {
                    _obj[sKey] = paramSplit2[1];
                    _obj = _obj[sKey];
                } else {
                    if (_obj[sKey] !== undefined) {
                        _obj = _obj[sKey];
                    } else {
                        _obj[sKey] = {};
                        _obj = _obj[sKey];
                    }
                }
            }
        } else {
            _obj[firstKey] = paramSplit2[1];
        }
    }
    return obj;
};

Utils.number = {};

/**
 * This function is used to reduce the decimal part of a float number
 * Example: var x = 3.4678;
 * var y=Utils.number.toDigits(x, 1);
 * console.log(y) --> prints 3.4
 *
 * @param {Number} num
 *
 * @param {Number} dnum
 * @returns
 */
Utils.number.toDigits = function (num, dnum) {
    console.log("toDigits: num = ", num);
    var num2 = "" + num;
    if (num2.indexOf(".") == -1 && dnum > 0) {
        num2 += ".";
        for (let i = 0; i < dnum; i++) {
            num2 += "0";
        }
    } else {
        var parts = num2.split(".");
        num2 = parts[0] + "." + parts[1].substring(0, dnum);
    }

    return parseFloat(num2);
};

/*************
 *  DOM      *
 *************/
Utils.DOM = {};

/**
 * This function adds a loader in the DOM
 *
 * @param {String} imgSrc
 */
Utils.DOM.addLoading = (imgSrc) => {
    let div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.bottom = "0";
    div.style.left = "0";
    div.style.right = "0";
    div.style.backgroundColor = "rgba(0,0,0,0.1)";
    div.style.zIndex = "9000";
    div.id = "document-loading";
    div.innerHTML = `<table style="width:100%;height:100%"><tr><td><img src="${imgSrc}"></td></tr></table>`;
    document.body.appendChild(div);
    div.querySelector("td").style =
        "vertical-align:middle;text-align:center;width:100%;height:100%";
};

/**
 * This function removes a loader, if exists
 */
Utils.DOM.removeLoading = () => {
    if (document.getElementById("document-loading")) {
        document.getElementById("document-loading").remove();
    }
};

Utils.DOM.toastCounters = 0;
/**
 * This function displays a toast.
 *
 * @param {Stirng} text: The text to print in the toast
 *
 * @param {Stirng} type: 'error' for red toast, 'success' for green toast
 *
 * @param {Function} t: the function used to translate the text
 */
Utils.DOM.toast = (text, type, t) => {
    let div = document.createElement("div");
    div.className = "snackbar";
    div.innerHTML = t(text);
    switch (type) {
        case 'error':
            div.style.backgroundColor = '#ba2929';
            break;
        case 'success':
            div.style.backgroundColor = '#176817';
            break;
    }
    document.body.appendChild(div);
    if (Utils.DOM.toastCounters > 0) {
        let toasts = Array.from(document.querySelectorAll(".snackbar"));
        div.style.top =
            parseInt(toasts[Utils.DOM.toastCounters - 1].offsetTop, 10) +
            64 +
            "px";
        //div.style.top = (30 + 34 * toastCounters + 10 * toastCounters - 1) + 'px';
        div.classList.add("still");
    } else div.classList.add("show");

    Utils.DOM.toastCounters++;
    setTimeout(() => {
        div.classList.remove("show");
    }, 2900);
    setTimeout(() => {
        div.remove();
        Utils.DOM.toastCounters--;
    }, 3000);
};

/**
 * Utilities to handle dates
 */
Utils.date = {};

Utils.date.getAge = function (date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    var today = new Date();
    var age = today.getFullYear() - date.getFullYear();
    var mDiff = date.getMonth() - today.getMonth();
    if (mDiff < 0) {
        age--;
    }
    return age;
};

Utils.date.formatDateObject = function (format, date = null) {
    if (!date) {
        date = new Date();
    }

    var year = date.getFullYear();
    var month = ("" + (date.getMonth() + 1)).padStart(2, "0");
    var day = ("" + date.getDate()).padStart(2, "0");
    var hours = ("" + date.getHours()).padStart(2, "0");
    var minutes = ("" + date.getMinutes()).padStart(2, "0");
    var seconds = ("" + date.getSeconds()).padStart(2, "0");

    switch (format) {
        case "Y-m-d":
            return `${year}-${month}-${day}`;
        case "Y-m-d H:i:s":
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        case "d/m/Y H:i":
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        case "Y/m/d":
            return `${year}/${month}/${day}`;
        case "d-m-Y":
            return `${day}-${month}-${year}`;
    }
};

Utils.date.getDateFromFormat = function (format, dateString) {
    if (!format && !dateString) {
        return null;
    }
    if (!dateString) {
        return new Date();
    }

    console.log(format, dateString);
    switch (format) {
        case 'Y-m-d H:i:s':
            var splitted = dateString.split(' ');
            var dateArray = splitted[0].split('-');
            var year = dateArray[0];
            var month = parseInt(dateArray[1], 10) - 1;
            var day = parseInt(dateArray[2], 10);
            var hourArray = splitted[1].split(':');
            var hours = parseInt(hourArray[0], 10);
            var minutes = parseInt(hourArray[1], 10);
            var seconds = parseInt(hourArray[2], 10);

            var date = new Date(year, month, day, hours, minutes, seconds, 0);
            return date;
        case "Y-m-d":
            var dateArray = dateString.split('-');
            var year = dateArray[0];
            var month = parseInt(dateArray[1], 10) - 1;
            var day = parseInt(dateArray[2], 10);
            var date = new Date(year, month, day);
            console.log(dateArray, year, month, day, date);
            return date;
    }
}

export default Utils;
