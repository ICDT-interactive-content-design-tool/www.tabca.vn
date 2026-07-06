window.addEventListener('load', function () {

    var getParamURL = function (param) {
        return decodeURIComponent((new RegExp(`[?|&]${param}=([^&;]+?)(&|#|;|$)`).exec(location.search) || ["", ""])[1].replace(/\+/g, '%20')) || null;
    }

    var audioSrc = getParamURL('url');
    if (!audioSrc) {
        return;
    }

    var audio = this.document.querySelector('audio');

    if (['1', 'true'].includes(getParamURL('autoplay'))) {
        audio.setAttribute('autoplay', 'autoplay');
    }

    var source = this.document.createElement('source');
    source.src = audioSrc;
    audio.appendChild(source);

    $(function () {
        $('audio').audioPlayer();
    });
});