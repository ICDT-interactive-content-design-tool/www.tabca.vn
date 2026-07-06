
var copyToClipboard = function (text) {
    if (text) {
        var el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        alert('Đã sao chép vào bộ nhớ đệm', 'success');
    }
}

/*
 * EXPORT DATA TO FILE
 * 
 */
var exportDataToFile = function (options) {
    options = options || {};
    var ExportTime = new Date(),
        times = [ExportTime.getFullYear(), ExportTime.getMonth() + 1, ExportTime.getDate(), ExportTime.getHours(), ExportTime.getMinutes(), ExportTime.getSeconds()];

    // Download link
    var downloadLink = document.createElement("a");

    // File name
    downloadLink.download = options.filename || 'ExportData.' + times.join('-') + '.txt';

    // Create data
    downloadLink.href = 'data:' + (options.filetype || "text/html") + ';charset=utf-8,' + encodeURIComponent(options.data);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    // Remove download link
    downloadLink.remove();

};

/*
* Check is mobile device
*/
var isMobileDevice = (function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
})();

/*
 * COOKIE.get
 * COOKIE.set
 */

var COOKIE = {
    get: function (name) {
        name = name + "=";
        var cookies = (document.cookie + "").split(';');
        for (var i = 0, len = cookies.length; i < len; i++) {
            var ck = cookies[i];
            while (ck.charAt(0) === ' ') {
                ck = ck.substring(1);
            }
            if (ck.indexOf(name) === 0) {
                return ck.substring(name.length, ck.length);
            }
        }
        return "";
    },
    set: function (name, value, exday) {
        var d = new Date();
        d.setTime(d.getTime() + parseInt((exday || 7) * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
};

var parseBool = function (value, defaultvalue) {
    if (value === true || value === 1) {
        return true;
    }
    else if (value === false || value === 0) {
        return false;
    }
    else if (value === null || value === undefined || typeof value === 'number' && isNaN(value)) {
        if (defaultvalue !== undefined) return defaultvalue;
        else return false;
    }
    else {
        value = (value + "").toLowerCase().trim();
        switch (value) {
            case 'true': case 'yes': case '1': {
                return true;
            }
            case 'false': case 'no': case '0': {
                return false;
            }
            case '': case 'null': case 'undefined': case 'NaN': {
                if (defaultvalue !== undefined) return defaultvalue;
                else return false;
            }
            default: {
                if (defaultvalue !== undefined) return defaultvalue;
                else return Boolean(value);
            }
        }
    }
};

var TiengVietKhongDau = function (alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
};

var randomBetween = function (min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var getParamUrl = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || ["", ""])[1].replace(/\+/g, '%20')) || null;
};

var setParamUrl = function (options, isNew) {
    /*
        1. nếu options dạng string "?abc=123,xyz=456" thì mặc định là gán mới param, dang object json thì mặc định là map với param cũ
        2. isNew: gán options là các param mới, không giữ param cũ

        setParamUrl({
            param1: value1,
            param2: value2
        })
        
    */

    if (typeof options === 'string') {
        replaceState(location.origin + location.pathname + '?' + options.replace(/\?/gm, ''));
    }
    else if (typeof options === 'object') {
        var queries = {},
            queries_array = [];

        if (!isNew) {
            var dataSearch = location.search.replace('?', '').split('&');
            if (dataSearch.length > 0) {
                for (var i = 0; i < dataSearch.length; i++) {
                    if (dataSearch[i]) {
                        var data = dataSearch[i].split('=');
                        queries[data[0]] = decodeURIComponent(data[1]);
                    }
                }
            }
            //ghi đè param có sẵn trên url bằng param mới
            Object.assign(queries, options);
        }
        else {
            queries = options;
        }

        //cập nhật lại url
        Object.keys(queries).forEach(function (key) {
            if (queries[key] || queries[key] === false || queries[key] === 0) {
                queries_array.push(key + '=' + queries[key]);
            }
        });

        if (queries_array.length > 0) {
            replaceState(location.origin + location.pathname + '?' + queries_array.join('&'));
        }
        else {
            replaceState(location.origin + location.pathname);

        }
    }
    else {
        //cập nhật lại url
        pushState(location.origin + location.pathname);
    }
};

var replaceState = function (url) {
    window.history.replaceState({}, null, url);
};
var pushState = function (url) {
    window.history.pushState(
        {
            change: 'loadState()'
        }, null, url
    );
};

var loadState = function () {
    window.location.reload(true);
};

var initState = function () {
    window.history.replaceState(
        {
            change: 'loadState()'
        }, null, null
    );

    //khởi tạo sự kiện khi back page
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.change) {
            eval(e.state.change);
        }
    });
};

var localCache = {
    data: {},
    remove: function (url) {
        delete localCache.data[url];
    },
    exist: function (url) {
        return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
    },
    get: function (url) {
        console.log('Getting in cache for url' + url);
        return localCache.data[url];
    },
    set: function (url, cachedData, callback) {
        localCache.remove(url);
        localCache.data[url] = cachedData;
        if ($.isFunction(callback)) callback(cachedData);
    }
};

var newFile = function (options) {
    /*
        {
            content: null,
            name: 'name.txt',
            type: 'text/plain'
        }
     */
    return new File([options.content || ''], options.name || 'name.txt', { type: options.type || 'text/plain', lastModified: new Date() });
};

var fileToBase64 = function (file, callback) {
    let reader = new FileReader();
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function () {
        callback();
        //alert("Không đọc được nội dung tập tin");
    };
    reader.readAsDataURL(file);
};

var base64ToFile = function (base64, fname, callback) {
    let mimeType = (base64.match(/^data:([^;]+);/) || '')[1];
    fetch(base64)
        .then(function (res) {
            return res.arrayBuffer();
        })
        .then(function (buf) {
            return new File([buf], fname, { type: mimeType });
        })
        .then(function (file) {
            callback(file);
        });
};

var canvasToFile = function (canvas) {
    // Get Image Base64
    var ImageURL = canvas.toDataURL('image/png');
    // Split the base64 string in data and contentType
    var block = ImageURL.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var blob = base64ToBlob(realData, contentType);

    return new File([blob], `canvas-2-image-${Math.floor(Math.random() * 999999999)}.${contentType.split('/').pop()}`, { type: contentType });
};

function base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

var blobToFile = function (blob, fname, mimeType, callback) {
    fetch(blob)
        .then(function (res) {
            return res.arrayBuffer();
        })
        .then(function (buf) {
            console.log(buf);
            return new File([buf], fname, { type: mimeType });
        })
        .then(function (file) {
            callback(file);
        });
};

var urlToBase64 = function (url, callback) {
    let urls = sourceToUrls({ url: url });
    if (urls.length > 0) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            fileToBase64(xhr.response, function (e) {
                callback(e);
            });
        };
        xhr.onerror = function () {
            if (urls.length > 0) {
                xhr.open('GET', urls.shift());
                xhr.send();
            }
            else {
                callback();
            }
        };
        xhr.open('GET', urls.shift());
        xhr.responseType = 'blob';
        xhr.send();
    }
};

var urlSvgToXml = function (url, callback) {
    let urls = sourceToUrls({ url: url });
    if (urls.length > 0) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            callback(xhr.response);
        };
        xhr.onerror = function () {
            if (urls.length > 0) {
                xhr.open('GET', urls.shift());
                xhr.send();
            }
            else {
                callback();
            }
        };
        xhr.overrideMimeType("image/svg+xml");
        xhr.open('GET', urls.shift());
        xhr.send();
    }
};

var checkImageSrc = function (src, callback) {
    var image = new Image();
    image.onload = function () {
        callback(src);
    };
    image.onerror = function () {
        callback();
        //alert("Không đọc được tập tin ảnh");
    };
    image.src = src;
};

/*
 * source : {
 *      url: null,
 *      path: null
 * }
 * 
 * return []    //array url maping ai upload and content data file
 */
var sourceToUrls = function (source) {
    let urls = [];

    if (!source) {
        return urls;
    }
    if (source.base64) {
        urls.push(source.base64);
    }
    if (source.path) {
        urls.push(API_UPLOAD_URL + source.path.replace(/^\//, ''));
        urls.push(ROOT_URL + source.path.replace(/^\//, ''));
    }
    if (source.url) {
        if (source.url.match(/http(s)?\:\/\//) || source.url.match(/data:[^;]+;base64,/)) {
            urls.push(source.url);
        }
        else {
            urls.push(API_UPLOAD_URL + source.url.replace(/^\//, ''));
            urls.push(ROOT_URL + source.url.replace(/^\//, ''));
        }
    }
    return urls;
};

var simulateMouseEvents = function (targetNode, eventType) {
    var mouseEvents = document.createEvent('MouseEvents');
    mouseEvents.initEvent(eventType, true, true);
    targetNode.dispatchEvent(mouseEvents);
};

//var key = [];
//window.addEventListener('keydown', function (e) {
//    console.log('window', e.key, e.keyCode, e.charCode, e);
//});

//document.addEventListener('keydown', function (e) {
//    console.log('document', e.key, e.keyCode, e.charCode, e);
//});

//window.addEventListener('keydown', function (e) {
//    $('body').keypress(function (e) {
//        console.log('body', e.key, e.keyCode, e.charCode, e);
//    });

//    //e.preventDefault();
//    //e.stopPropagation();
//});

/*
 * simulateKeyboardEvents(null, null, { key: 'f11' });
 */

//var key = null;
//window.addEventListener('load', function () {
//    $('#simularKey').click(function () {
//        $('body').simulateKeyPress(key);
//    });
//});

//jQuery.fn.simulateKeyPress = function (character) {
//    var options = {};
//    var keys = [{ "key": "q", "keyCode": 81, "charCode": 0 }, { "key": "w", "keyCode": 87, "charCode": 0 }, { "key": "e", "keyCode": 69, "charCode": 0 }, { "key": "r", "keyCode": 82, "charCode": 0 }, { "key": "t", "keyCode": 84, "charCode": 0 }, { "key": "y", "keyCode": 89, "charCode": 0 }, { "key": "u", "keyCode": 85, "charCode": 0 }, { "key": "i", "keyCode": 73, "charCode": 0 }, { "key": "o", "keyCode": 79, "charCode": 0 }, { "key": "p", "keyCode": 80, "charCode": 0 }, { "key": "a", "keyCode": 65, "charCode": 0 }, { "key": "s", "keyCode": 83, "charCode": 0 }, { "key": "d", "keyCode": 68, "charCode": 0 }, { "key": "f", "keyCode": 70, "charCode": 0 }, { "key": "g", "keyCode": 71, "charCode": 0 }, { "key": "h", "keyCode": 72, "charCode": 0 }, { "key": "j", "keyCode": 74, "charCode": 0 }, { "key": "k", "keyCode": 75, "charCode": 0 }, { "key": "l", "keyCode": 76, "charCode": 0 }, { "key": "z", "keyCode": 90, "charCode": 0 }, { "key": "x", "keyCode": 88, "charCode": 0 }, { "key": "c", "keyCode": 67, "charCode": 0 }, { "key": "v", "keyCode": 86, "charCode": 0 }, { "key": "b", "keyCode": 66, "charCode": 0 }, { "key": "n", "keyCode": 78, "charCode": 0 }, { "key": "m", "keyCode": 77, "charCode": 0 }, { "key": "0", "keyCode": 48, "charCode": 0 }, { "key": "1", "keyCode": 49, "charCode": 0 }, { "key": "2", "keyCode": 50, "charCode": 0 }, { "key": "3", "keyCode": 51, "charCode": 0 }, { "key": "4", "keyCode": 52, "charCode": 0 }, { "key": "5", "keyCode": 53, "charCode": 0 }, { "key": "6", "keyCode": 54, "charCode": 0 }, { "key": "7", "keyCode": 55, "charCode": 0 }, { "key": "8", "keyCode": 56, "charCode": 0 }, { "key": "9", "keyCode": 57, "charCode": 0 }, { "key": "0", "keyCode": 96, "charCode": 0 }, { "key": "1", "keyCode": 97, "charCode": 0 }, { "key": "2", "keyCode": 98, "charCode": 0 }, { "key": "3", "keyCode": 99, "charCode": 0 }, { "key": "4", "keyCode": 100, "charCode": 0 }, { "key": "5", "keyCode": 101, "charCode": 0 }, { "key": "6", "keyCode": 102, "charCode": 0 }, { "key": "7", "keyCode": 103, "charCode": 0 }, { "key": "8", "keyCode": 104, "charCode": 0 }, { "key": "9", "keyCode": 105, "charCode": 0 }, { "key": "Control", "keyCode": 17, "charCode": 0 }, { "key": "Shift", "keyCode": 16, "charCode": 0 }, { "key": "CapsLock", "keyCode": 20, "charCode": 0 }, { "key": "Tab", "keyCode": 9, "charCode": 0 }, { "key": "Alt", "keyCode": 18, "charCode": 0 }, { "key": " ", "keyCode": 32, "charCode": 0 }, { "key": "ArrowLeft", "keyCode": 37, "charCode": 0 }, { "key": "ArrowUp", "keyCode": 38, "charCode": 0 }, { "key": "ArrowRight", "keyCode": 39, "charCode": 0 }, { "key": "ArrowDown", "keyCode": 40, "charCode": 0 }, { "key": "Enter", "keyCode": 13, "charCode": 0 }, { "key": "Escape", "keyCode": 27, "charCode": 0 }, { "key": "F1", "keyCode": 112, "charCode": 0 }, { "key": "F2", "keyCode": 113, "charCode": 0 }, { "key": "F3", "keyCode": 114, "charCode": 0 }, { "key": "F4", "keyCode": 115, "charCode": 0 }, { "key": "F5", "keyCode": 116, "charCode": 0 }, { "key": "F6", "keyCode": 117, "charCode": 0 }, { "key": "F7", "keyCode": 118, "charCode": 0 }, { "key": "F8", "keyCode": 119, "charCode": 0 }, { "key": "F9", "keyCode": 120, "charCode": 0 }, { "key": "F10", "keyCode": 121, "charCode": 0 }, { "key": "F11", "keyCode": 122, "charCode": 0 }, { "key": "F12", "keyCode": 123, "charCode": 0 }, { "key": "Backspace", "keyCode": 8, "charCode": 0 }];

//    if (options.key) {
//        var keyInfo = keys.filter(function (f) {
//            return f.key.toLowerCase() === options.key.toLowerCase();
//        })[0];

//        if (keyInfo) {
//            options.keyCode = keyInfo.keyCode;
//            options.charCode = keyInfo.charCode;
//        }
//    }

//    jQuery(this).trigger({
//        type: 'keypress',
//        which: options.charCode || character.charCodeAt(0)
//    });
//};

var simulateKeyboardEvents = function (targetNode, eventType, options) {
    options = options || {};

    var keys = [{ "key": "q", "keyCode": 81, "charCode": 0 }, { "key": "w", "keyCode": 87, "charCode": 0 }, { "key": "e", "keyCode": 69, "charCode": 0 }, { "key": "r", "keyCode": 82, "charCode": 0 }, { "key": "t", "keyCode": 84, "charCode": 0 }, { "key": "y", "keyCode": 89, "charCode": 0 }, { "key": "u", "keyCode": 85, "charCode": 0 }, { "key": "i", "keyCode": 73, "charCode": 0 }, { "key": "o", "keyCode": 79, "charCode": 0 }, { "key": "p", "keyCode": 80, "charCode": 0 }, { "key": "a", "keyCode": 65, "charCode": 0 }, { "key": "s", "keyCode": 83, "charCode": 0 }, { "key": "d", "keyCode": 68, "charCode": 0 }, { "key": "f", "keyCode": 70, "charCode": 0 }, { "key": "g", "keyCode": 71, "charCode": 0 }, { "key": "h", "keyCode": 72, "charCode": 0 }, { "key": "j", "keyCode": 74, "charCode": 0 }, { "key": "k", "keyCode": 75, "charCode": 0 }, { "key": "l", "keyCode": 76, "charCode": 0 }, { "key": "z", "keyCode": 90, "charCode": 0 }, { "key": "x", "keyCode": 88, "charCode": 0 }, { "key": "c", "keyCode": 67, "charCode": 0 }, { "key": "v", "keyCode": 86, "charCode": 0 }, { "key": "b", "keyCode": 66, "charCode": 0 }, { "key": "n", "keyCode": 78, "charCode": 0 }, { "key": "m", "keyCode": 77, "charCode": 0 }, { "key": "0", "keyCode": 48, "charCode": 0 }, { "key": "1", "keyCode": 49, "charCode": 0 }, { "key": "2", "keyCode": 50, "charCode": 0 }, { "key": "3", "keyCode": 51, "charCode": 0 }, { "key": "4", "keyCode": 52, "charCode": 0 }, { "key": "5", "keyCode": 53, "charCode": 0 }, { "key": "6", "keyCode": 54, "charCode": 0 }, { "key": "7", "keyCode": 55, "charCode": 0 }, { "key": "8", "keyCode": 56, "charCode": 0 }, { "key": "9", "keyCode": 57, "charCode": 0 }, { "key": "0", "keyCode": 96, "charCode": 0 }, { "key": "1", "keyCode": 97, "charCode": 0 }, { "key": "2", "keyCode": 98, "charCode": 0 }, { "key": "3", "keyCode": 99, "charCode": 0 }, { "key": "4", "keyCode": 100, "charCode": 0 }, { "key": "5", "keyCode": 101, "charCode": 0 }, { "key": "6", "keyCode": 102, "charCode": 0 }, { "key": "7", "keyCode": 103, "charCode": 0 }, { "key": "8", "keyCode": 104, "charCode": 0 }, { "key": "9", "keyCode": 105, "charCode": 0 }, { "key": "Control", "keyCode": 17, "charCode": 0 }, { "key": "Shift", "keyCode": 16, "charCode": 0 }, { "key": "CapsLock", "keyCode": 20, "charCode": 0 }, { "key": "Tab", "keyCode": 9, "charCode": 0 }, { "key": "Alt", "keyCode": 18, "charCode": 0 }, { "key": " ", "keyCode": 32, "charCode": 0 }, { "key": "ArrowLeft", "keyCode": 37, "charCode": 0 }, { "key": "ArrowUp", "keyCode": 38, "charCode": 0 }, { "key": "ArrowRight", "keyCode": 39, "charCode": 0 }, { "key": "ArrowDown", "keyCode": 40, "charCode": 0 }, { "key": "Enter", "keyCode": 13, "charCode": 0 }, { "key": "Escape", "keyCode": 27, "charCode": 0 }, { "key": "F1", "keyCode": 112, "charCode": 0 }, { "key": "F2", "keyCode": 113, "charCode": 0 }, { "key": "F3", "keyCode": 114, "charCode": 0 }, { "key": "F4", "keyCode": 115, "charCode": 0 }, { "key": "F5", "keyCode": 116, "charCode": 0 }, { "key": "F6", "keyCode": 117, "charCode": 0 }, { "key": "F7", "keyCode": 118, "charCode": 0 }, { "key": "F8", "keyCode": 119, "charCode": 0 }, { "key": "F9", "keyCode": 120, "charCode": 0 }, { "key": "F10", "keyCode": 121, "charCode": 0 }, { "key": "F11", "keyCode": 122, "charCode": 0 }, { "key": "F12", "keyCode": 123, "charCode": 0 }, { "key": "Backspace", "keyCode": 8, "charCode": 0 }];
    if (options.key) {
        var keyInfo = keys.filter(function (f) {
            return f.key.toLowerCase() === options.key.toLowerCase();
        })[0];

        if (keyInfo) {
            options.keyCode = keyInfo.keyCode;
            options.charCode = keyInfo.charCode;
        }
    }

    var keyboardEvents = document.createEvent('KeyboardEvent');
    keyboardEvents.initKeyboardEvent(
        eventType || "keydown", // event type : keydown, keyup, keypress
        true, // bubbles
        true, // cancelable
        window, // viewArg: should be window
        options.ctrlKey || false, // ctrlKeyArg
        options.altKey || false, // altKeyArg
        options.shiftKey || false, // shiftKeyArg
        options.metaKey || false, // metaKeyArg
        options.keyCode || 0, // keyCodeArg : unsigned long the virtual key code, else 0
        options.charCode || 0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
    );
    (targetNode || window).dispatchEvent(keyboardEvents);
};

var downsampleBuffer = function (buffer, rate, sampleRate) {
    if (rate == sampleRate) {
        return buffer;
    }
    if (rate > sampleRate) {
        throw "downsampling rate show be smaller than original sample rate";
    }
    var sampleRateRatio = sampleRate / rate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
        var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        // Use average value of skipped samples
        var accum = 0, count = 0;
        for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = accum / count;
        // Or you can simply get rid of the skipped samples:
        // result[offsetResult] = buffer[nextOffsetBuffer];
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
}