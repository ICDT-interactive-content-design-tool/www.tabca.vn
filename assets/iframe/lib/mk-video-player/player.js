window.addEventListener('load', function () {
    //thêm ngôn ngữ
    videojs.addLanguage('vi', {
        "Audio Player": "Trình phát Audio",
        "Video Player": "Trình phát Video",
        "Play": "Phát",
        "Pause": "Tạm dừng",
        "Replay": "Phát lại",
        "Current Time": "Thời gian hiện tại",
        "Duration": "Độ dài",
        "Remaining Time": "Thời gian còn lại",
        "Stream Type": "Kiểu Stream",
        "LIVE": "TRỰC TIẾP",
        "Loaded": "Đã tải",
        "Progress": "Tiến trình",
        "Progress Bar": "Thanh tiến trình",
        "progress bar timing: currentTime={1} duration={2}": "{1} của {2}",
        "Fullscreen": "Toàn màn hình",
        "Non-Fullscreen": "Thoát toàn màn hình",
        "Mute": "Tắt tiếng",
        "Unmute": "Bật âm thanh",
        "Playback Rate": "Tỉ lệ phát lại",
        "Subtitles": "Phụ đề",
        "subtitles off": "tắt phụ đề",
        "Captions": "Chú thích",
        "captions off": "tắt chú thích",
        "Chapters": "Chương",
        "Descriptions": "Mô tả",
        "descriptions off": "tắt mô tả",
        "Audio Track": "Track âm thanh",
        "Volume Level": "Mức âm lượng",
        "You aborted the media playback": "Bạn đã hủy việc phát lại media.",
        "A network error caused the media download to fail part-way.": "Một lỗi mạng dẫn đến việc tải media bị lỗi.",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": "Video không tải được, mạng hay server có lỗi hoặc định dạng không được hỗ trợ.",
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "Phát media đã bị hủy do một sai lỗi hoặc media sử dụng những tính năng trình duyệt không hỗ trợ.",
        "No compatible source was found for this media.": "Không có nguồn tương thích cho media này.",
        "The media is encrypted and we do not have the keys to decrypt it.": "Media đã được mã hóa và chúng tôi không có để giải mã nó.",
        "Play Video": "Phát Video",
        "Close": "Đóng",
        "Close Modal Dialog": "Đóng cửa sổ",
        "Modal Window": "Cửa sổ",
        "This is a modal window": "Đây là một cửa sổ",
        "This modal can be closed by pressing the Escape key or activating the close button.": "Cửa sổ này có thể thoát bằng việc nhấn phím Esc hoặc kích hoạt nút đóng.",
        ", opens captions settings dialog": ", mở hộp thoại cài đặt chú thích",
        ", opens subtitles settings dialog": ", mở hộp thoại cài đặt phụ đề",
        ", opens descriptions settings dialog": ", mở hộp thoại cài đặt mô tả",
        ", selected": ", đã chọn",
        "captions settings": "cài đặt chú thích",
        "subtitles settings": "cài đặt phụ đề",
        "descriptions settings": "cài đặt mô tả",
        "Text": "Văn bản",
        "White": "Trắng",
        "Black": "Đen",
        "Red": "Đỏ",
        "Green": "Xanh lá cây",
        "Blue": "Xanh da trời",
        "Yellow": "Vàng",
        "Magenta": "Đỏ tươi",
        "Cyan": "Lam",
        "Background": "Nền",
        "Window": "Cửa sổ",
        "Transparent": "Trong suốt",
        "Semi-Transparent": "Bán trong suốt",
        "Opaque": "Mờ",
        "Font Size": "Kích cỡ phông chữ",
        "Text Edge Style": "Dạng viền văn bản",
        "None": "None",
        "Raised": "Raised",
        "Depressed": "Depressed",
        "Uniform": "Uniform",
        "Dropshadow": "Dropshadow",
        "Font Family": "Phông chữ",
        "Proportional Sans-Serif": "Proportional Sans-Serif",
        "Monospace Sans-Serif": "Monospace Sans-Serif",
        "Proportional Serif": "Proportional Serif",
        "Monospace Serif": "Monospace Serif",
        "Casual": "Casual",
        "Script": "Script",
        "Small Caps": "Small Caps",
        "Reset": "Đặt lại",
        "restore all settings to the default values": "khôi phục lại tất cả các cài đặt về giá trị mặc định",
        "Done": "Xong",
        "Caption Settings Dialog": "Hộp thoại cài đặt chú thích",
        "Beginning of dialog window. Escape will cancel and close the window.": "Bắt đầu cửa sổ hộp thoại. Esc sẽ thoát và đóng cửa sổ.",
        "End of dialog window.": "Kết thúc cửa sổ hộp thoại."
    });

    let getParamUrl = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || ["", ""])[1].replace(/\+/g, '%20')) || null;
    };

    //init
    if (getParamUrl('demo')) {
        initPlayer({
            sources: [
                { src: "data/Teamwork.mp4", label: "720P", selected: true },
            ],
            tracks: [
                { kind: "subtitles", src: "data/Teamwork-vi.vtt", srclang: "vi", label: "Tiếng Việt", default: true },
                { kind: "subtitles", src: "data/Teamwork-en.vtt", srclang: "en", label: "Tiếng Anh" }
            ],
            trackpanel: true
        });
    }
    else if (getParamUrl('url')) {
        var src = getParamUrl('url');

        initPlayer({
            sources: [
                {
                    src: src,
                    label: "720P",
                    selected: true,
                    type: (function () {
                        if (src.indexOf('.m3u8') >= 0) {
                            return 'application/x-mpegURL';
                        }
                        else if (src.match('http(s)?://(www.)?(m.)?youtube.com|youtu.be')) {
                            return 'video/youtube';
                        }
                        else {
                            return 'video/mp4';
                        }
                    })()
                },
            ]
        });
    }

});

function initPlayer(options) {
    let player = videojs('videoid', {
        crossOrigin: "Anonymous",
        cors: 'anonymous',
        controls: true,
        autoplay: false,
        preload: 'auto',
        //breakpoints: {
        //    tiny: 300,
        //    xsmall: 400,
        //    small: 500,
        //    medium: 600,
        //    large: 700,
        //    xlarge: 800,
        //    huge: 900
        //},
        //responsive: true,
        //aspectRatio: "16:9",
        language: 'vi',
        liveui: true,
        playbackRates: [0.25, 0.5, 1, 1.5, 2],
        //plugins: {
        //    foo: { bar: true },
        //    boo: { baz: true }
        //},
        //controlBar: {
        //    fullscreenToggle: true,
        //    children: [
        //        'playToggle',
        //        'progressControl',
        //        'volumePanel',
        //        //
        //        'qualitySelector',
        //        'fullscreenToggle'
        //    ]
        //},
        sources: options.sources || [],
        tracks: options.tracks || [],
        nativeTextTracks: true
    }, function () {
        this.addClass('video-js');
        document.getElementById('player').style.visibility = 'visible';
    });

    if (options.trackpanel) {
        player.ready(function () {
            let trackElement = document.getElementById('trackid');

            let tracks = player.textTracks();

            tracks.addEventListener('change', function () {
                let showTrack = false;

                for (var i = 0, lenI = tracks.length; i < lenI; i++) {
                    let track = tracks[i];

                    if (track.mode === 'showing') {
                        //active
                        showTrack = true;

                        //remove all
                        trackElement.querySelectorAll('*').forEach(function (e) {
                            e.remove();
                        });

                        //create title
                        let rowtitle = document.createElement('div');
                        rowtitle.textContent = track.label;
                        rowtitle.style.padding = '10px 15px';
                        rowtitle.style.marginBottom = '10px';
                        rowtitle.style.lineHeight = '25px';
                        rowtitle.style.fontSize = '18px';
                        rowtitle.style.backgroundColor = '#eee';
                        rowtitle.style.color = '#7b92fe';
                        trackElement.appendChild(rowtitle);

                        //create list content
                        let cues = track.cues;
                        if (cues) {
                            for (var j = 0, lenJ = cues.length; j < lenJ; j++) {
                                let cue = cues[j];

                                //set id work active track realtime
                                cue.id = j;

                                //content
                                let rowcontent = document.createElement('div');
                                rowcontent.style.padding = '5px 15px';
                                rowcontent.style.cursor = 'pointer';
                                rowcontent.setAttribute('class', 'rowcontent');
                                rowcontent.setAttribute('data-idx', j);
                                trackElement.appendChild(rowcontent);

                                let etime = document.createElement('div');
                                etime.textContent = (function (time) {
                                    let total = parseInt(time),
                                        minute = parseInt(total / 60),
                                        seconds = total % 60;
                                    return (minute >= 10 ? minute : '0' + minute) + ':' + (seconds >= 10 ? seconds : '0' + seconds);
                                })(cue.startTime);
                                etime.style.color = '#7b92fe';
                                etime.style.marginRight = '15px';
                                etime.style.cssFloat = 'left';
                                rowcontent.appendChild(etime);

                                let econtent = document.createElement('div');
                                econtent.textContent = cue.text;
                                econtent.style.wordBreak = 'break-word';
                                econtent.style.overflow = 'hidden';
                                rowcontent.appendChild(econtent);

                                //event
                                rowcontent.addEventListener('click', function () {
                                    player.currentTime(cue.startTime);
                                });
                            }
                        }
                        track.addEventListener('cuechange', function () {
                            let activeCues = this.activeCues[0];

                            //remove all active
                            trackElement.querySelectorAll('.rowcontent.active').forEach(function (e) {
                                e.classList.remove('active')
                            });

                            //active
                            if (activeCues) {
                                trackElement.querySelectorAll('.rowcontent[data-idx="' + activeCues.id + '"]').forEach(function (e) {
                                    e.classList.add('active')
                                });
                            }
                        });
                    }
                }

                //
                let intervalWidth = null,
                    sizeWidth = 0,
                    subWidth = 0,
                    sub = 5;

                if (showTrack) {
                    sizeWidth = 100;
                    subWidth = 0;

                    if (document.getElementById('trackbox').style.display === 'none') {
                        document.getElementById('trackbox').style.display = 'block';

                        intervalWidth = setInterval(function () {
                            document.getElementById('videobox').style.width = (sizeWidth -= sub) + '%';
                            document.getElementById('trackbox').style.width = (subWidth += sub) + '%';

                            if (sizeWidth <= 70) {
                                clearInterval(intervalWidth);
                            }
                        }, 50);
                    }
                }
                else {
                    sizeWidth = 70;
                    subWidth = 30;

                    if (document.getElementById('trackbox').style.display === 'block') {
                        intervalWidth = setInterval(function () {
                            document.getElementById('videobox').style.width = (sizeWidth += sub) + '%';
                            document.getElementById('trackbox').style.width = (subWidth -= sub) + '%';

                            if (sizeWidth >= 100) {
                                document.getElementById('trackbox').style.display = 'none';
                                clearInterval(intervalWidth);
                            }
                        }, 50);
                    }
                }
            });
        });
    }

    return player;
}