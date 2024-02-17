var Utils = {};

Utils.functions = {};

/**
 * This function adds Infinite Scroll logic to an HTML Element
 *
 * @param {string|HTMLElement} el: this can be a CSS selector, or an HTMLElement instance
 *
 * @param {Function} callback: the function called when the scrolling reaches bottom
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

Utils.DOM.removeLoading = () => {
    if (document.getElementById("document-loading")) {
        document.getElementById("document-loading").remove();
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

export default Utils;
