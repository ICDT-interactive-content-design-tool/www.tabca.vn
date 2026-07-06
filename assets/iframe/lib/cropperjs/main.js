window.addEventListener('load', function () {

    var imageCropper = document.getElementById('img-cropper');
    var options = {
        dragMode: 'none',   //'crop': tạo một hộp cắt mới, 'move': di chuyển canvas, 'none': không làm gì cả
        aspectRatio: NaN,
        initialAspectRatio: NaN,
        viewMode: 0,    //0: không có hạn chế. 1: hạn chế hộp cắt không vượt quá kích thước của canvas. 2: hạn chế kích thước canvas tối thiểu để vừa với container. Nếu tỷ lệ của canvas và vùng chứa khác nhau, canvas tối thiểu sẽ được bao quanh bởi không gian thừa theo một trong các kích thước. 3: hạn chế kích thước canvas tối thiểu để lấp đầy vừa với vùng chứa. Nếu tỷ lệ của canvas và container khác nhau, container sẽ không thể vừa với toàn bộ canvas theo một trong các kích thước.
        autoCrop: false,
        autoCropArea: 1,  //Nó phải là một số từ 0 đến 1. Xác định kích thước vùng cắt tự động (tỷ lệ phần trăm).
        movable: true,
        rotatable: true,
        scalable: true,
        zoomOnTouch: true,
        zoomOnWheel: true,
        wheelZoomRatio: 0.1,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        minContainerWidth: 50,
        minContainerHeight: 50,
        minCanvasWidth: 50,
        minCanvasHeight: 50,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
        ready: function (e) {
            //console.log(e.type);
        },
        cropstart: function (e) {
            //console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
            //console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
            //console.log(e.type, e.detail.action);
        },
        crop: function (e) {
            dataCropper = e.detail;
            //console.log(dataCropper);
        },
        zoom: function (e) {
            //console.log(e.type, e.detail.ratio);
        }
    };
    var thisCropper = null;

    //
    var cropperReInit = function () {
        if (thisCropper) {
            thisCropper.destroy();
        }
        thisCropper = new Cropper(imageCropper, options);
        window.thisCropper = thisCropper;
    };
    window.cropperReInit = cropperReInit;

    //
    var cropperApply = function (srcBase64) {
        srcBase64 = srcBase64 || (thisCropper ? thisCropper.getCroppedCanvas().toDataURL('image/png') : null) || '';
        if (srcBase64) {
            imageCropper.src = srcBase64;
            imageCropper.setAttribute('path', '');
        }
    };
    window.cropperApply = cropperApply;

    //
    window.cropperIsCropped = function () { return imageCropper.parentNode.querySelectorAll('.cropper-container').length ? true : false; };

    document.getElementById('actionBox').querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var method = btn.getAttribute('data-method'),
                option = btn.getAttribute('data-option');

            if (btn.toggle) {
                btn.toggle = false;
            }
            else {
                btn.toggle = true;
            }

            var toggle = btn.toggle;

            if (!method) {
                return;
            }

            //
            switch (method) {
                case 'aspectRatio': {
                    thisCropper.setAspectRatio(parseFloat(option));
                    break;
                }
                case 'setDragMode': {
                    thisCropper.setDragMode(option);
                    break;
                }
                case 'rotate': {
                    //
                    imageCropper.setAttribute('oncrop', true);

                    //
                    thisCropper.rotate(parseInt(option));
                    break;
                }
                case 'scaleX': {
                    //
                    imageCropper.setAttribute('oncrop', true);

                    //
                    if (toggle) {
                        option = -1;
                    }
                    else {
                        option = 1;
                    }
                    thisCropper.scaleX(option);
                    break;
                }
                case 'scaleY': {
                    //
                    imageCropper.setAttribute('oncrop', true);

                    //
                    if (toggle) {
                        option = -1;
                    }
                    else {
                        option = 1;
                    }
                    thisCropper.scaleY(option);
                    break;
                }
                case 'reset': {
                    //
                    imageCropper.setAttribute('oncrop', false);

                    //
                    thisCropper.reset();
                    thisCropper.clear();
                    break;
                }
                case 'crop': {
                    imageCropper.setAttribute('oncrop', true);

                    //
                    cropperApply();
                    cropperReInit();
                    break;
                }
            }
        })
    });

    (document.getElementById('inputImage') || {}).onchange = function () {
        var inputImage = this;

        var files = inputImage.files;
        var file;

        if (files && files.length) {
            file = files[0];

            if (/^image\/\w+/.test(file.type)) {

                var fr = new FileReader();
                fr.onload = function () {
                    //
                    cropperApply(fr.result);
                    cropperReInit();

                    inputImage.value = null;
                };
                fr.readAsDataURL(file);
            }
            else {
                window.alert('Please choose an image file.');
            }
        }
    };
});
