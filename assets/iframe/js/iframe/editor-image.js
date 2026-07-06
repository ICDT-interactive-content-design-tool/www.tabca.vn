
var ParentViewerId = null,
    EditorContent = null;

var _data = { path: null, url: null, API_UPLOAD_URL: null, ROOT_URL: null, modal: null },
    _fns = { UploadFile: null };

function setParentViewerId(id) {
    ParentViewerId = id;
}

function saveClick() {

}

function closeEditor() {
    _data.modal.dismiss(null, 'confirm');
}

function valueEditor(data, fns) {
    _data = data;
    _fns = fns;

    if (data) {
        var sourceToUrls = function (source) {
            let urls = [];

            if (source.base64) {
                urls.push(source.base64);
            }
            if (source.path) {
                urls.push(_data.API_UPLOAD_URL + source.path.replace(/^\//, ''));
                urls.push(_data.ROOT_URL + source.path.replace(/^\//, ''));
            }
            if (source.url) {
                if (source.url.match(/http(s)?\:\/\//) || source.url.match(/data:[^;]+;base64,/)) {
                    urls.push(source.url);
                }
                else {
                    urls.push(_data.API_UPLOAD_URL + source.url.replace(/^\//, ''));
                    urls.push(_data.ROOT_URL + source.url.replace(/^\//, ''));
                }
            }
            return urls;
        };

        let urls = sourceToUrls(data);
        if (urls.length > 0) {
            let img = new Image();
            img.onload = function () {
                $('#imageBox img').attr({
                    src: img.src || null,
                    path: data.path || null
                });
                if (typeof window.cropperReInit == "function") {
                    window.cropperReInit();
                }
            };
            img.onerror = function () {
                if (urls.length > 0) {
                    img.src = urls.shift();
                }
            };
            img.src = urls.shift();
        }
    }
    else if ($('#imageBox img').attr('ondrop') || $('#imageBox img').attr('oncrop') == 'true') {

        var data = {
            url: $('#imageBox img').attr('src'),
            path: $('#imageBox img').attr('path')
        };

        if (typeof window.cropperIsCropped == "function" && window.cropperIsCropped() && typeof window.cropperApply == "function") {
            window.cropperApply();

            data = {
                url: $('#imageBox img').attr('src'),
                path: $('#imageBox img').attr('path')
            };
        }

        if (data.url.match(/data:[^;]+;base64,/)) {
            data.base64 = data.url;
        }

        return data;
    }
}

document.getElementById('img-cropper').addEventListener('load', function () {
    if (typeof window.cropperReInit == "function") {
        window.cropperReInit();
    }
});

window.addEventListener('load', function () {
    $('#imageBox img').css({
        'max-width': window.innerWidth,
        'max-height': window.innerHeight - 90
    });
});

window.addEventListener('resize', function () {
    $('#imageBox img').css({
        'max-width': window.innerWidth,
        'max-height': window.innerHeight - 90
    });
    if (typeof window.cropperReInit == "function") {
        window.cropperReInit();
    }
});