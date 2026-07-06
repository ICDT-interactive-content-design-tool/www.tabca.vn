
window.addEventListener('load', function () {
    let recoder = this.document.getElementById('recoder');
    if (recoder) {
        //$(recoder).show().animate({ opacity: 1 }, function () {

        //});

        $(recoder).handleRecorder({
            recoded: function (src) {
                $('#waveformbox').animate(
                    {
                        height: '50%'
                    },
                    function () {
                        $('#waverecordbox').show().fadeIn();
                        $('#waverecoder').empty();

                        $('#waverecordbox').handleWave({
                            container: '#waverecoder',
                            waveColor: 'blue',
                            progressColor: 'red',
                            src: src
                        });
                    });


            }
        });
    }
});

(function ($) {
    /**
     * @param {any} options
     * {
     *      audioSrc:   string
     *      recoded:    function
     * }
     */
    $.fn.handleRecorder = function (options) {
        options = options || {};

        let recordBox = this,
            recorder = false,
            player = false;

        let mediaRecorder = null,
            timming = 0,
            audioChunks = [],
            intervalRecordTime = null;

        render();

        recordBox.find('.btn_record').click(function () {
            if (player) {
                player = false;
                recordBox.find('audio').get(0).pause();
            }

            if (!recorder) {
                recorder = false;
                render();

                //
                if (navigator.mediaDevices) {
                    navigator.mediaDevices
                        .getUserMedia({ audio: true },
                            () => {
                                conosle.log(1);
                            },
                            () => {
                                conosle.log(0);
                            },
                        )
                        .then(stream => {
                            recorder = true;
                            render();

                            //
                            mediaRecorder = new MediaRecorder(stream);

                            mediaRecorder.addEventListener("dataavailable", event => {
                                audioChunks.push(event.data);
                            });

                            mediaRecorder.addEventListener("start", (e) => {
                                timming = 0;
                                audioChunks = [];

                                recordBox.find('.btn_play').parents('li').first().hide();
                                recordBox.find('.btn_pause').parents('li').first().show();
                                recordBox.find('.btn_stop').parents('li').first().show();

                                //
                                recordBox.find('.mark_record').show();

                                intervalRecordTime = setInterval(function () { renderTime(++timming, 600); }, 1000);
                            });

                            mediaRecorder.addEventListener("pause", (e) => {
                                recordBox.find('.btn_play').parents('li').first().show();
                                recordBox.find('.btn_pause').parents('li').first().hide();
                                recordBox.find('.btn_stop').parents('li').first().show();

                                //
                                recordBox.find('.mark_record').hide();

                                clearInterval(intervalRecordTime);
                            });

                            mediaRecorder.addEventListener("resume", (e) => {
                                recordBox.find('.btn_play').parents('li').first().hide();
                                recordBox.find('.btn_pause').parents('li').first().show();
                                recordBox.find('.btn_stop').parents('li').first().show();

                                //
                                recordBox.find('.mark_record').show();

                                intervalRecordTime = setInterval(function () { renderTime(++timming, 600); }, 1000);
                            });

                            mediaRecorder.addEventListener("stop", (e) => {
                                recordBox.find('.btn_play').parents('li').first().show();
                                recordBox.find('.btn_pause').parents('li').first().hide();
                                recordBox.find('.btn_stop').parents('li').first().hide();

                                clearInterval(intervalRecordTime);

                                recorder = false;
                                render();

                                //convert audioChunks to audio url
                                (function (bytes) {
                                    var audioBlob = new Blob(bytes, { type: "audio/mpeg" }),
                                        audioUrl = URL.createObjectURL(audioBlob);

                                    var reader = new FileReader();
                                    reader.onload = function () {
                                        //audio.src = reader.result;
                                        recordBox.find('audio').prop('src', audioUrl);

                                        if (typeof options.recoded === 'function') {
                                            options.recoded(audioUrl);
                                        }
                                    };
                                    reader.readAsDataURL(audioBlob);
                                })(audioChunks);

                                //
                                stream.getTracks().forEach(function (track) { track.stop(); });
                            });

                            mediaRecorder.addEventListener("error", (e) => {
                                recorder = false;
                                render();

                                //
                                stream.getTracks().forEach(function (track) { track.stop(); });
                            });

                            mediaRecorder.start();
                        })
                        .catch((err) => {
                            console.log(err);

                            alert('Không thể mở Microphone trên thiết bị!');

                            recorder = false;
                            render();
                        })
                        .finally(() => { });
                }
                else {
                    alert('Không có quyền truy cập thiết bị!');
                }
            }
            else if (recorder && mediaRecorder) {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.pause();
                }
                else if (mediaRecorder.state === 'paused') {
                    mediaRecorder.resume();
                }
            }
        });

        recordBox.find('.btn_play').click(function () {
            if (recorder) {
                if (mediaRecorder && mediaRecorder.state === 'paused') {
                    mediaRecorder.resume();
                }
            }
            else if (player) {
                recordBox.find('audio').get(0).play();
            }
        });

        recordBox.find('.btn_pause').click(function () {
            if (recorder) {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.pause();
                }
            }
            else if (player) {
                recordBox.find('audio').get(0).pause();
            }
        });

        recordBox.find('.btn_stop').click(function () {
            if (recorder) {
                recorder = false;

                if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
                    mediaRecorder.stop();
                }
            }
            else if (player) {
                recordBox.find('audio').get(0).pause();
                recordBox.find('audio').get(0).currentTime = 0;
            }
        });

        recordBox.find('.btn_download').click(function () {
            //// Download link
            //var downloadLink = document.createElement("a");

            //// File name
            //downloadLink.download = 'recorder-audio.mp3';

            //// Create data
            //downloadLink.href = recordBox.find('audio').attr('src');

            //// Hide download link
            //downloadLink.style.display = "none";

            //// Add the link to DOM
            //document.body.appendChild(downloadLink);

            //// Click download link
            //downloadLink.click();

            //// Remove download link
            //downloadLink.remove();
            
            download(new Blob(audioChunks, { type: "audio/mpeg" }), 'recorder-audio.mp3', 'audio/mpeg');
        });

        recordBox.find('.btn_delete').click(function () {
            recordBox.find('audio').removeAttr('src');
            recorder = false;
            player = false;
            render();
        });

        recordBox.find('audio')
            .on('waiting', function () {
                //
            })
            .on('canplaythrough', function () {
                //
            })
            .on('canplay', function () {
                recorder = false;
                player = true;
                render();
            })
            .on('durationchange', function () {
                //
            })
            .on('timeupdate', function () {
                renderTime(this.currentTime, this.duration || 1);
            })
            .on('play', function () {
                recordBox.find('.btn_play').parents('li').first().hide();
                recordBox.find('.btn_pause').parents('li').first().show();
                recordBox.find('.btn_stop').parents('li').first().show();
            })
            .on('pause', function () {
                recordBox.find('.btn_play').parents('li').first().show();
                recordBox.find('.btn_pause').parents('li').first().hide();
                recordBox.find('.btn_stop').parents('li').first().show();
            })
            .on('ended', function () {
                recordBox.find('.btn_play').parents('li').first().show();
                recordBox.find('.btn_pause').parents('li').first().hide();
                recordBox.find('.btn_stop').parents('li').first().hide();
            });

        function formatTimeToString(currentTime) {
            var time = Math.ceil(currentTime),
                data = [],
                hour = Math.floor(time / 3600),
                minute = Math.floor((time - hour * 3600) / 60),
                second = time % 60;

            data.push(hour >= 10 ? hour : '0' + hour);
            data.push(minute >= 10 ? minute : '0' + minute);
            data.push(second >= 10 ? second : '0' + second);

            return data.join(':');
        }

        function renderTime(currentTime, duration) {
            recordBox.find('.txt_time').text(formatTimeToString(currentTime));
        }

        function render() {
            if (player) {
                recordBox.find('.btn_play,.btn_pause,.btn_stop').css({
                    background: '#f7f9f9',
                    color: '#323232'
                });
                recordBox.find('.btn_delete,.btn_download').show();

                if (recordBox.find('audio').get(0).paused) {
                    recordBox.find('.btn_play').parents('li').first().show();
                    recordBox.find('.btn_pause').parents('li').first().hide();
                    recordBox.find('.btn_stop').parents('li').first().hide();
                }
                else {
                    recordBox.find('.btn_play').parents('li').first().hide();
                    recordBox.find('.btn_pause').parents('li').first().show();
                    recordBox.find('.btn_stop').parents('li').first().show();
                }
            }
            else {
                recordBox.find('.btn_delete,.btn_download').hide();
            }

            if (recorder) {
                recordBox.find('.btn_play,.btn_pause,.btn_stop').css({
                    background: '#ec6156',
                    color: '#fff'
                });

                recordBox.find('.box_time,.box_action').slideDown();
            }
            else {
                recordBox.find('.mark_record').hide();
            }

            if (player || recorder) {
                recordBox
                    .css({
                        background: 'rgba(0,0,0,0.1)',
                        opacity: 0.5
                    })
                    .animate({ opacity: 1 });

                renderTime(0, 1);
            }
            else {
                recordBox.css({
                    background: 'transparent'
                });

                recordBox.find('.box_time,.box_action').slideUp();
            }

            //
            recordBox.css({
                display: 'block'
            });
        }

        if (options.audioSrc) {
            recordBox.find('audio').prop('src', options.audioSrc).height(30);
        }
    };

})(jQuery);