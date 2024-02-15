var Utils = {};

Utils.functions = {};

Utils.functions.openExternalLink = function (el) {
    BBClientSDK.closePopup("");
    var url = el.dataset.href;
    var html = `<script>
        var a = document.createElement('a');
        a.href = "${url}";
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
        </script>`;
    BBClientSDK.openHTMLPopup(html, "", "", "large");
    BBClientSDK.closePopup("");
};

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


Utils.file = {};

Utils.file.getExtension = (name) => {
    var parts = name.split(".");
    return parts[parts.length - 1];
};

Utils.file.isImage = (name) => {
    switch (Utils.file.getExtension(name)) {
        case "jpeg":
        case "jpg":
        case "bmp":
        case "png":
        case "gif":
        case "svg":
            return true;
        default:
            return false;
    }
};

Utils.file.dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

/****************
 *  LINGUA      *
 ****************/
Utils.language = {};

Utils.language.language = "it";

Utils.language.getBrowserLanguage = function () {
    let language = navigator.language || navigator.userLanguage;
    if (language) {
        language = Utils.language.language = language.split('-')[0];
    }

    return language;
}

Utils.language.init = function () {
    Utils.language.language = Utils.language.getBrowserLanguage();
    // Utils.language.language = globalData.user
    //     ? globalData.user.language
    //         ? globalData.user.language
    //         : Utils.language.language
    //     : Utils.language.language;
    if (SUPPORTED_LANGUAGES.indexOf(Utils.language.language) == -1) {
        Utils.language.language = 'en';
    }
    const languageDivs = Array.prototype.slice.call(
        document.querySelectorAll("[data-language]")
    );
    for (let i = 0; i < languageDivs.length; i++) {
        languageDivs[i].innerHTML = Utils.language.translate(
            languageDivs[i].dataset["language"]
        );
    }
};

Utils.language.getTranslatedDBValue = (object, field) => {
    console.log("------", object);
    console.log("--83--");
    switch (Utils.language.language) {
        case 'en':
        case 'it':
        case 'es':
            return object[field + '_' + Utils.language.language] ?
                object[field + '_' + Utils.language.language]
                : object[field]
                ;
    }
    return object[field + '_en'] ? object[field + '_en'] : object[field];
}

Utils.language.translate = function (text, data) {
    let translated = text;
    if (typeof Translations != 'undefined') {
        translated = Translations[Utils.language.language] ? Translations[Utils.language.language][text]
            ? Translations[Utils.language.language][text]
            : text
            : Translations['en'][text] ? Translations['en'][text] : text;
    } else {
        translated = t(text);
    }
    for (let prop in data) {
        translated = translated.replace(
            new RegExp(`{{ ${prop} }}`, "gi"),
            data[prop]
        );
    }
    return translated;
};

/************************************
 *  GRAFICO CIAMBELLA/PROGRESS      *
 ************************************/
Utils.donut = {};
Utils.donut.update = function (el, percent, donut) {
    percent = Math.round(percent);
    if (percent > 100) {
        percent = 100;
    } else if (percent < 0) {
        percent = 0;
    }
    var deg = Math.round(360 * (percent / 100));

    if (percent > 50) {
        $(el + " .pie").css("clip", "rect(auto, auto, auto, auto)");
        $(el + " .right-side").css("transform", "rotate(180deg)");
    } else {
        $(el + " .pie").css("clip", "rect(0, 1em, 1em, 0.5em)");
        $(el + " .right-side").css("transform", "rotate(0deg)");
    }
    if (donut) {
        $(el + " .right-side").css("border-width", /*"0.1em"*/ "0.125em");
        $(el + " .left-side").css("border-width", /*"0.1em"*/ "0.125em");
        $(el + " .shadow").css("border-width", /*"0.1em"*/ "0.125em");
    } else {
        $(el + " .right-side").css("border-width", "0.5em");
        $(el + " .left-side").css("border-width", "0.5em");
        $(el + " .shadow").css("border-width", "0.5em");
    }
    $(el + " .num").text(percent);
    $(el + " .left-side").css("transform", "rotate(" + deg + "deg)");
};

Utils.string = {};

Utils.string.toUnderscoreSlug = function (string) {
    string = string.replace(/\s+/, '_');
    return string.toLowerCase();
}

Utils.string.truncate = function (string, length) {
    if (string.length <= length) {
        return string;
    }

    return string.substring(0, length) + "...";
};

Utils.string.encodeHTMLEntities = (rawStr) => {
    return rawStr.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';')
}

Utils.response = {};

Utils.response.handleError = function (data, t) {
    if (data.ERROR) {
        throw new Error(t(data.ERROR.MESSAGE));
    } else if (data.error) {
        throw new Error(t(data.error));
    }
};

Utils.URL = {};

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
            _obj[firstKey] = {};
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

Utils.number.toDigits = function (num, dnum) {
    console.log("toDigits: num = ", num);
    // var num2 = ("" + num).replace(
    //     new RegExp(`([0-9]*)(\.)([0-9]{${dnum}})([0-9]+)`, "g"),
    //     "$1$2$3"
    // );
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
// Utils.request = {};

// Utils.request.serializeParams = function (obj, prefix) {
//     var str = [],
//         p;

//     for (p in obj) {
//         if (obj.hasOwnProperty(p)) {
//             var k = prefix ? prefix + "[" + p + "]" : p,
//                 v = obj[p];

//             if (k != "user_token") {
//                 v = encodeURIComponent(v);
//             }
//             str.push(
//                 v !== null && typeof v === "object"
//                     ? Utils.request.serializeParams(v, k)
//                     : encodeURIComponent(k) + "=" + v
//             );
//             if (v === null || v === undefined) {
//                 str.pop();
//             }
//         }
//     }
//     return str.join("&");
// };

// Utils.request.getUrlAPI = function (path, params) {
//     let url = ADECCO_BASE_URL + path;

//     if (typeof params == "object") {
//         url += "?" + Utils.request.serializeParams(params);
//     }

//     return url;
// };

// Utils.request.jsonGetAPI = function (url, data, success, error) {
//     data = data || {};
//     url = Utils.request.getUrlAPI(url, data);
//     fetch(url, {
//         method: "GET",
//         signal: signal,
//         headers: { "Content-Type": "application/json; charset=utf-8" },
//     })
//         .then((response) => Promise.all([response, response.json()]))
//         .then(([response, json]) => {
//             if (!response.ok) {
//                 throw new Error(json.error);
//             }
//             return json;
//         })
//         .then(success)
//         .catch(error);
// };

/***********************
 *  LOCAL STORAGE      *
 ***********************/
Utils.localStorage = {};

Utils.localStorage.prefix = "";

Utils.localStorage.deleteItems = function (usePrefix = true) {
    var keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        if (usePrefix) {
            if (keys[i].indexOf(Utils.localStorage.prefix) === 0) {
                window.localStorage.removeItem(keys[i]);
            }
        } else {
            window.localStorage.removeItem(keys[i]);
        }
    }
};

Utils.localStorage.getItem = function (key) {
    if (!Utils.localStorage.prefix) {
        return window.localStorage.getItem(key);
    } else {
        return window.localStorage.getItem(
            Utils.localStorage.prefix + "_" + key
        );
    }
};

Utils.localStorage.setItem = function (key, value) {
    if (Utils.localStorage.prefix) {
        key = Utils.localStorage.prefix + "_" + key;
    }

    window.localStorage.setItem(key, value);
};

Utils.localStorage.updateLocalStorageFromData = function (data, prefix = "") {
    Utils.localStorage.setItem("hasStorage", 1);
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            var k = prefix ? prefix + "_" + prop : prop;
            v = data[prop];
            if (typeof v == "object" && !(v instanceof Array)) {
                Utils.localStorage.updateLocalStorageFromData(v, k);
            } else {
                Utils.localStorage.setTypedValue(k, v);
            }
        }
    }
};

Utils.localStorage.setTypedValue = function (k, v) {
    switch (true) {
        case typeof v === "boolean" || v instanceof Boolean:
            Utils.localStorage.setItem("___TYPE___" + k, "boolean");
            Utils.localStorage.setItem(
                k,
                v === false || v === "false" ? "false" : "true"
            );
            break;
        case typeof v === "string" || v instanceof String:
            Utils.localStorage.setItem("___TYPE___" + k, "string");
            Utils.localStorage.setItem(k, v);
            break;
        case typeof v === "number" || v instanceof Number:
            Utils.localStorage.setItem("___TYPE___" + k, "number");
            Utils.localStorage.setItem(k, v);
            break;
        case v === null:
            Utils.localStorage.setItem("___TYPE___" + k, "null");
            Utils.localStorage.setItem(k, "null");
            break;
        case typeof v === "object" && v instanceof Array:
            Utils.localStorage.setItem("___TYPE___" + k, "array");
            Utils.localStorage.setItem(k, JSON.stringify(v));
            break;
    }
};

Utils.localStorage.getType = function (key) {
    return Utils.localStorage.getItem("___TYPE___" + key);
};

Utils.localStorage.getTypedValue = function (key) {
    val = Utils.localStorage.getItem(key);
    switch (Utils.localStorage.getType(key)) {
        case "boolean":
            val = val.toLowerCase() === "true" ? true : false;
            break;
        case "number":
            val = +val;
            break;
        case "null":
            val = null;
            break;
        case "array":
            val = JSON.parse(val);
            break;
    }
    return val;
};

/*************
 *  DOM      *
 *************/
Utils.DOM = {};

Utils.DOM.modals = {};

Utils.DOM.modals.switchModals = function (fromModal, toModal, callback) {
    $(fromModal).on("hidden.bs.modal", function (e) {
        $(toModal).modal("show");
        //clear this function so it doesn't show up if they exit the window again
        $(fromModal).off("hidden.bs.modal");
        if (typeof callback == "function") {
            callback();
        }
    });
    $(fromModal).modal("hide");
};

Utils.DOM.addLoading = () => {
    let div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.bottom = "0";
    div.style.left = "0";
    div.style.right = "0";
    div.style.backgroundColor = "rgba(0,0,0,0.1)";
    div.style.zIndex = "9000";
    div.id = "badgebox-loading";
    div.innerHTML = `<table style="width:100%;height:100%"><tr><td><img src="https://www.badgebox.com/app/images/preload@2x.gif"></td></tr></table>`;
    document.body.appendChild(div);
    div.querySelector("td").style =
        "vertical-align:middle;text-align:center;width:100%;height:100%";
};

Utils.DOM.removeLoading = () => {
    if (document.getElementById("badgebox-loading")) {
        document.getElementById("badgebox-loading").remove();
    }
};

Utils.DOM.addEmptyState = (
    selector,
    text,
    src,
    append = false,
    cssStyles = {}
) => {
    let mainDiv = document.querySelector(selector);
    let img = "";

    var imgCssStyles = "";
    var textCssStyles = "";
    var containerCssStyles = "";

    if (cssStyles.image) {
        imgCssStyles = 'style="';
        for (var prop in cssStyles.image) {
            imgCssStyles += prop + ":" + cssStyles.image[prop] + ";";
        }
        imgCssStyles += '"';
    }

    if (cssStyles.text) {
        textCssStyles = 'style="';
        for (var prop in cssStyles.text) {
            textCssStyles += prop + ":" + cssStyles.text[prop] + ";";
        }
        textCssStyles += '"';
    }

    if (cssStyles.container) {
        containerCssStyles = 'style="';
        for (var prop in cssStyles.container) {
            containerCssStyles += prop + ":" + cssStyles.container[prop] + ";";
        }
        containerCssStyles += '"';
    }

    console.log(textCssStyles);

    if (src) {
        img = `<img ${imgCssStyles} class="empty-state-img" src="${src}">`;
    }
    if (append) {
        mainDiv.innerHTML += `<table ${containerCssStyles} class="empty-state">
        <tr><td>${img}
        <div class="empty-state-message" ${textCssStyles}>${text}</div></td></tr>
    </table>`;
    } else {
        mainDiv.innerHTML = `<table ${containerCssStyles} class="empty-state">
            <tr><td>${img}
            <div class="empty-state-message" ${textCssStyles}>${text}</div></td></tr>
        </table>`;
    }
};

Utils.DOM.removeEmptyState = (selector) => {
    $(selector + " .empty-state").remove();
};

Utils.DOM.toastCounters = 0;

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

Utils.DOM.displayContextMenu = (e, data, data2 = {}, closeCallback) => {
    /*
        name: 'edit',
        callback: () => {
            // FACCIO COSE
        },
        text: 'Modifica
    */

    var div = document.createElement("div");
    div.id = "context-menu-" + new Date().getTime();
    div.style.position = "absolute";
    div.style.backgroundColor = "white";
    if (data2.border) {
        div.style.border = data2.border;
    } else {
        div.style.border = "1px solid grey";
    }

    if (data2.boxShadow) {
        div.style.boxShadow = data2.boxShadow;
    }

    if (data2.borderRadius) {
        div.style.borderRadius = data2.borderRadius;
    } else {
        div.style.borderRadius = "10px";
    }
    div.style.width = "150px";
    // div.style.height = '100px';
    div.style.zIndex = "1";
    if (!data2.position || data2.position == "left") {
        div.style.left = e.clientX + window.pageXOffset - 150 + "px";
    } else {
        div.style.left = e.clientX + window.pageXOffset + "px";
    }
    div.style.top = event.clientY + window.pageYOffset + "px";
    div.innerHTML = `
            <ul class="bb-context-menu-list">
            </ul>
        `;

    var _fnDestroyDiv = function (e) {
        if (typeof closeCallback == 'function') {
            closeCallback();
        }
        if (!document.getElementById(div.id)) {
            document.removeEventListener("click", _fnDestroyDiv);
            return;
        }

        if (e.target !== div) {
            div.remove();
            document.removeEventListener("click", _fnDestroyDiv);
        }

        console.log("_fnDestroyDiv");
    };

    for (let i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = data[i].text;
        if (!data[i].disabled) {
            li.style.cursor = 'pointer';
            li.onclick = function () {
                if (data[i].callback) {
                    console.log("__CALLBACK__");
                    data[i].callback();
                }
                _fnDestroyDiv({ target: div });
            };
        } else {
            li.style.opacity = 0.5;
            li.style.cursor = 'auto';
        }
        div.querySelector("ul").appendChild(li);
    }

    document.body.appendChild(div);

    setTimeout(() => document.addEventListener("click", _fnDestroyDiv), 1);
};

Utils.DOM.components = {};

Utils.DOM.components.getTableBody = (values = []) => {
    let html = '<tbody>'
    if (typeof values == "string") {
        html += values;
    } else {
        values.forEach((val) => {
            html += Utils.DOM.components.getTableRow(val);
        })
    }
    html += '</tbody>';
    return html;
}

Utils.DOM.components.getTableRow = (vals, className = '') => {
    let valuesArray = vals;
    console.log(vals);
    let classNameToAdd = className;
    if (typeof vals.vals !== "undefined") {
        valuesArray = vals.vals;
    }
    if (vals.class_name) {
        classNameToAdd = vals.class_name;
    }
    console.log(valuesArray);
    let html = `<tr class="${classNameToAdd}">`;
    valuesArray.forEach((value) => {
        if (typeof value == "string") {
            html += `<td>${value}</td>`
        } else {
            const valueText = value.encoded ? Utils.string.encodeHTMLEntities(value.text) : value.text
            html += `<td
                class='${value.class_name ? value.class_name : ''}'
                onclick='${value.onclick ? value.onclick : ''}
                id='${value.id ? value.id : ''}'
            >${valueText}</td>
            `
        }
    })
    html += '</tr>';
    return html;
}

Utils.DOM.components.getDropdownElement = function (text, clickHandler, href = "", target = "") {
    return `<a class="dropdown-item" ${href ? 'href="' + href + '"' : ''} onclick="${clickHandler}" ${target ? 'target="' + target + '"' : ''}>${text}</a>`;
}

Utils.DOM.components.getDropdown = function (elements = []) {
    let html = `
    <div class="dropdown mv-auto">
        <span class="mv-auto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img src="${APP_URL}/img/icon-actions-ic-option.svg">
        </span>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    `.trim().replace(/\s{2,}|\n/g, '');
    elements.forEach(el => {
        const text = el.text || '';
        const clickHandler = el.clickHandler || '';
        const href = el.href || '';
        const target = el.target || '';
        html += Utils.DOM.components.getDropdownElement(text, clickHandler, href, target);
    })
    html += `
        </div>
    </div>
    `.trim().replace(/\s{2,}|\n/g, '');
    return html;
}

Utils.DOM.components.getTableHeader = function (values, className = "firstTr", thead = true) {
    let header = '';
    if (thead) {
        header += '<thead>';
    }
    header += `<tr class="${className}">`;
    values.forEach((val) => {
        if (typeof val == 'string') {
            header += `<th>${val}</th>`
        } else {
            header += `<th
                class="${val.className ? val.className : ''}"
                onclick="${val.onclick ? val.onclick : ''}"
                id="${val.id ? val.id : ''}"
            >
                ${val.text}
            </th>
            `
        }
    })
    header += `</tr>`;
    if (thead) {
        header += '</thead>';
    }

    return header;
}

Utils.DOM.components.getHTMLElementAttributes = (attributes, quotes = '"', exclude = []) => {
    let attributesText = '';
    for (var prop in attributes) {
        if (exclude.indexOf(prop) == -1) {
            attributesText += prop + '=' + quotes + attributes[prop] + quotes + ' ';
        }
    }
    return attributesText.trimEnd();
}

Utils.DOM.components.getModalField = ({ title, id, type = 'text', attributes = {}, value = '', options = []}) => {
    const attributesText = Utils.DOM.components.getHTMLElementAttributes(attributes, '"', ['value', 'id', 'name', 'type']);
    const className = attributes.class ? '' : 'class="form-control mv-auto"';
    switch (type) {
        case 'number':
        case 'email':
        case 'text':
            return `
                <div class="form-group">
                    <label for=${id}>${title}</label>
                    <input id="${id}" ${attributesText}  name="${id}" ${className} value="${value}" type="${type}">
                </div>
            `.trim().replace(/\s{2,}|\n/g, '');
            // <div class="form-group">
            //             <label for="class_name">{{ __("data.models.sso_types.column_aliases.class_name") }}</label>
            //             <input id="class_name" class="form-control mv-auto" name="class_name" type="text" />
            //         </div>
            break;
    }
}


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

Utils.fiscalCode = {};

Utils.fiscalCode.MONTHS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "H",
    "L",
    "M",
    "P",
    "R",
    "S",
    "T",
];

Utils.fiscalCode.CHECK_CODE_ODD = {
    0: 1,
    1: 0,
    2: 5,
    3: 7,
    4: 9,
    5: 13,
    6: 15,
    7: 17,
    8: 19,
    9: 21,
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
};

Utils.fiscalCode.CHECK_CODE_EVEN = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
};

Utils.fiscalCode.CHECK_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

Utils.fiscalCode.getCheckCode = function (fiscalCode) {
    if (fiscalCode.length < 15) {
        return false;
    }

    fiscalCode = fiscalCode.slice(0, 15).toUpperCase();
    let val = 0;
    for (let i = 0; i < 15; i = i + 1) {
        const c = fiscalCode.charAt(i);
        val +=
            i % 2 !== 0
                ? Utils.fiscalCode.CHECK_CODE_EVEN[c]
                : Utils.fiscalCode.CHECK_CODE_ODD[c];
    }
    val = val % 26;
    return Utils.fiscalCode.CHECK_CODE_CHARS.charAt(val);
};

Utils.fiscalCode.check = function (fiscalCode) {
    if (fiscalCode.length != 16) {
        return false;
    }

    fiscalCode = fiscalCode.toUpperCase();
    if (
        !/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/.test(
            fiscalCode
        )
    ) {
        return false;
    }

    var checkCode = fiscalCode.charAt(15);
    var cf = fiscalCode.slice(0, 15);

    return Utils.fiscalCode.getCheckCode(cf) === checkCode;
};

Utils.fiscalCode.getMonth = function (fiscalCode, format = true) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }

    var month = Utils.fiscalCode.MONTHS.indexOf(fiscalCode.charAt(8));
    if (month == -1) {
        return false;
    }
    console.log(
        fiscalCode.charAt(8),
        month,
        Utils.fiscalCode.MONTHS[fiscalCode.charAt(8)]
    );
    if (format === true) {
        month = ("" + (month + 1)).padStart(2, "0");
    }

    return month;
};

Utils.fiscalCode.getYear = function (fiscalCode) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }

    var today = new Date();
    var year = +fiscalCode.substring(6, 8);
    var curYear = today.getFullYear();
    var lastTwoOfCurYear = curYear % 100;
    var yearTry = curYear - lastTwoOfCurYear + year;

    if (today.getFullYear() - yearTry < 0) {
        yearTry -= 100;
    }
    return yearTry;
};

Utils.fiscalCode.getDay = function (fiscalCode, format = true) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }
    //SCCPRM89B05B354N
    var day = parseInt(fiscalCode.substring(9, 11), 10);
    if (day > 40) {
        day -= 40;
    }
    if (format === true) {
        day = ("" + day).padStart(2, "0");
    }

    return day;
};

Utils.fiscalCode.getBirthDate = function (fiscalCode) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }
    var year = Utils.fiscalCode.getYear(fiscalCode);
    var month = Utils.fiscalCode.getMonth(fiscalCode);
    var day = Utils.fiscalCode.getDay(fiscalCode);

    return year + "-" + month + "-" + day;
};

Utils.fiscalCode.getSex = function (fiscalCode) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }
    //SCCPRM89B05B354N
    var day = parseInt(fiscalCode.substring(9, 11), 10);

    if (day > 40) {
        return "Donna";
    } else {
        return "Uomo";
    }
};

Utils.fiscalCode.getPlace = function (fiscalCode) {
    var check = Utils.fiscalCode.check(fiscalCode);
    if (!check) {
        return false;
    }
    var place = fiscalCode.substring(11, 15);
    return place;
};

export default Utils;
