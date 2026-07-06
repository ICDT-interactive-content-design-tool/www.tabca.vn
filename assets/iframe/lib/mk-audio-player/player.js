
window.addEventListener('load', function () {
    let audioSrc = decodeURIComponent((new RegExp('[?|&]url=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || ["", ""])[1].replace(/\+/g, '%20')) || null;
    if (!audioSrc) {
        return;
    }

    $('#waveformbox').handleWave({
        container: '#waveform',
        waveColor: '#7b92fe',
        progressColor: 'purple',
        src: audioSrc
    });
});

(function ($) {
    let flux = [];

    $.fn.handleWave = function (options) {
        let root = this.get(0);

        let btnPlay = root.querySelector('.btn-play'),
            btnPause = root.querySelector('.btn-pause'),
            txtTime = root.querySelector('.txt-time'),
            txtDuration = root.querySelector('.txt-duration'),

            show = function (e) {
                if (!e) return;
                e.style.display = 'inline';
            },
            hide = function (e) {
                if (!e) return;
                e.style.display = 'none';
            },
            text = function (e, content) {
                if (!e) return;
                e.textContent = content;
            },
            parseTime = function (n) {
                var time = Math.ceil(n),
                    data = [],
                    hour = Math.floor(time / 3600),
                    minute = Math.floor((time - hour * 3600) / 60),
                    second = time % 60;

                //data.push(hour >= 10 ? hour : '0' + hour);
                data.push(minute >= 10 ? minute : '0' + minute);
                data.push(second >= 10 ? second : '0' + second);

                return data.join(':');
            },
            action = function (e, eType, eFunction) {
                if (!e) return;
                e.addEventListener(eType, eFunction);
            };

        var wavesurfer, context, processor;
        try {
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                // Safari 11 or newer automatically suspends new AudioContext's that aren't
                // created in response to a user-gesture, like a click or tap, so create one
                // here (inc. the script processor)
                var AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();
                processor = context.createScriptProcessor(1024, 1, 1);
            }
        }
        catch (err) {
            console.log(err);
        }

        let opts = Object.assign({
            scrollParent: true,   //trải dài theo chiều dài của audio
            //splitChannels: true,  //chia âm phổ thành 2 load left right
            minPxPerSec: 1,
            audioContext: context || null,
            audioScriptProcessor: processor || null,
            plugins: [
                WaveSurfer.cursor.create({
                    showTime: true,
                    opacity: 1,
                    customShowTimeStyle: {
                        'background-color': '#555',
                        color: '#ddd',
                        padding: '2px 5px',
                        'font-size': '11px'
                    }
                })
            ]
        }, options);

        wavesurfer = WaveSurfer.create(opts);

        //
        wavesurfer.on('audioprocess', function (e) {
            text(txtTime, parseTime(e));
        });
        wavesurfer.on('destroy', function () {
            //
        });
        wavesurfer.on('error', function () {
            alert('Tập tin âm thanh lỗi');
        });
        wavesurfer.on('finish', function () {
            //
        });
        wavesurfer.on('interaction', function () {
            //
        });
        wavesurfer.on('loading', function () {
            //
        });
        wavesurfer.on('mute', function () {
            //
        });
        wavesurfer.on('pause', function () {
            hide(btnPause);
            show(btnPlay);
        });
        wavesurfer.on('play', function () {
            hide(btnPlay);
            show(btnPause);
        });
        wavesurfer.on('ready', function (e) {
            //wavesurfer.play();
            show(btnPlay);

            //set duration
            text(txtDuration, parseTime(wavesurfer.getDuration()));

            //export
            //flux.push({ signal: JSON.parse(wavesurfer.exportPCM(1024, 10000, true, 0)) });

            ////
            //if (flux.length === 2) {
            //    let difference = spectralFlux({
            //        signal: flux[0].signal,
            //        previousSignal: flux[1].signal
            //    });

            //    console.log("difference: ", difference);
            //}
        });
        wavesurfer.on('scroll', function () {
            //
        });
        wavesurfer.on('seek', function () {
            //
        });
        wavesurfer.on('volume', function () {
            //
        });
        wavesurfer.on('waveform-ready', function () {
            //
        });
        wavesurfer.on('zoom', function () {
            //
        });
        wavesurfer.load(options.src);

        //
        action(btnPlay, 'click', function () {
            wavesurfer.play();
        });
        action(btnPause, 'click', function () {
            wavesurfer.pause();
        });

        action(document.querySelector('#slider'), 'input', function () {
            wavesurfer.zoom(Number(this.value));
        });
    };

})(jQuery);