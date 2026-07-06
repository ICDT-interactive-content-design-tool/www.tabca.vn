(function () {

    function BoardUrl2BoardId(href) {
        return decodeURIComponent((new RegExp("[?|&]b=([^&;]+?)(&|#|;|$)").exec(href) || ["", ""])[1].replace(/\+/g, "%20")) || null;
    }

    function joinBoardContent(ids, callback) {

        ids = ids || [];
        callback = callback || function (param1, param2, param3) { console.log(param1, param2, param3) };


        if (!ids.length) {
            return;
        }

        var arr = [];

        (function () {
            var idx = 0,
                recursive = function () {

                    var BoardID = ids[idx++];
                    if (!BoardID) {
                        //
                        callback('processing');

                        //
                        doneGet();
                        return;
                    }

                    //
                    callback('loading', BoardID);

                    //
                    new BoardApi({ BoardID: BoardID }, function (e) {
                        if (e && e.board_filecontent) {

                            e.board_filecontent = typeof e.board_filecontent == "object" ? e.board_filecontent : JSON.parse(e.board_filecontent);

                            //
                            arr.push(e);

                            //
                            callback('success', BoardID);

                            //tiếp tục nếu có dữ liệu ngon
                            recursive();
                        }
                        else {
                            callback('error', BoardID);

                            //tiếp tục nếu ko có gì
                            //recursive();
                        }
                    }).Get();
                }

            recursive();
        })();

        var e = {};

        var _board_filecontent = {
            data: [],
            info: {},
            resources: [],
            screen: { w: 0, h: 0 },
            variable: {
                conditions: [],
                variables: []
            }
        };

        function doneGet() {

            e = arr[0];
            _board_filecontent = arr[0].board_filecontent;

            _board_filecontent.data = _board_filecontent.data || [];

            _board_filecontent.variable = _board_filecontent.variable || {};
            _board_filecontent.variable.conditions = _board_filecontent.variable.conditions || [];
            _board_filecontent.variable.variables = _board_filecontent.variable.variables || [];

            var idx = 1,
                recursive = function () {

                    var item = arr[idx++];
                    if (!item) {
                        //
                        callback('init');

                        //
                        doneCompare();
                        return;
                    }

                    //
                    var board_filecontent = item.board_filecontent || {};
                    var board_filecontent_data = board_filecontent.data || [];
                    var board_filecontent_variable = board_filecontent.variable || {};
                    var board_filecontent_variable_conditions = board_filecontent_variable.conditions || [];
                    var board_filecontent_variable_variables = board_filecontent_variable.variables || [];

                    board_filecontent_data.forEach(function (slide) {

                        //thay đổi mã slide nếu đã bị trùng
                        if (_board_filecontent.data.find(function (f) { return f.id == slide.id })) {

                            var old_id = slide.id.toString(),
                                new_id = `${old_id}x${Math.floor(Math.random() * 999999999)}`;

                            slide.id = new_id;

                            //thay đổi mã slide
                            board_filecontent_data.forEach(function (slide_loop) {
                                slide_loop.actions = JSON.parse(JSON.stringify(slide_loop.actions).replace(new RegExp(old_id, 'g'), new_id));
                            });

                            //thay đổi mã slide
                            board_filecontent_variable_conditions = JSON.parse(JSON.stringify(board_filecontent_variable_conditions).replace(new RegExp(old_id, 'g'), new_id));
                        }

                    });

                    //lấy danh sách biến hiện tại đang có, để loại bỏ biến trùng
                    var keys = _board_filecontent.variable.variables.map(function (m) { return m.key; });

                    //danh sách biến chưa có
                    board_filecontent_variable_variables = board_filecontent_variable_variables.filter(function (f) {
                        return keys.indexOf(f.key) < 0;
                    });

                    //tăng stt công thức để phân đinh cũ mới
                    var condition_len = _board_filecontent.variable.conditions.length;

                    //xử lý thứ tự sau khi gộp
                    board_filecontent_variable_conditions
                        //sắp xếp lại danh sách công thức biến
                        .sort(function (a, b) {
                            return a.idx - b.idx;
                        })
                        //đánh lại idx bắt đầu từ 1
                        .map(function (condition, idx) {
                            condition.idx = idx + 1;
                            return condition;
                        })
                        //đánh lại idx tính theo chỉ số bài gộp
                        .forEach(function (condition) {
                            console.log(`${idx}(b=${item.board_id}) -> ${condition.idx} + ${condition_len} = ${condition.idx + condition_len}`);

                            condition.idx = condition.idx + condition_len;
                        });

                    //gộp nội dung
                    _board_filecontent.data = _board_filecontent.data.concat(board_filecontent_data);
                    _board_filecontent.variable.conditions = _board_filecontent.variable.conditions.concat(board_filecontent_variable_conditions);
                    _board_filecontent.variable.variables = _board_filecontent.variable.variables.concat(board_filecontent_variable_variables);

                    //
                    recursive();
                }

            recursive();
        }

        function doneCompare() {

            //_ChangeDriveOption = true;

            //
            //_BoardID = e.board_id;
            //_BoardName = e.board_title;
            //_TopicID = e.topic_id || null;
            //_CategoryID = e.category_id || null;

            //change title
            //document.title = e.board_title;

            //import data
            $(contentDataShow).css({
                visibility: 'hidden'
            });

            contentDataHide.screen({
                w: e.size_width,
                h: e.size_height
            });
            contentDataHide.dataString(_board_filecontent);
            //contentDataHide.info({
            //    BoardID: e.board_id,
            //    BoardName: e.board_title,
            //    TopicID: e.topic_id || null,
            //    CategoryID: e.category_id || null
            //});
            contentDataHide.open(0);

            //
            $(contentDataShow)
                .css({
                    visibility: 'visible',
                    opacity: 0
                })
                .animate({
                    opacity: 1
                });

            //
            callback('finished');
        }

    }

    window.joinBoardContent = joinBoardContent;

    //window.addEventListener('load', function () {
    //    this.setTimeout(function () {

    //        joinBoardContent([1008, 1009]);

    //        joinBoardContent([
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1492&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1493&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1494&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1495&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1510&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1514&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1515&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1516&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1517&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1524&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1552&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1547&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1548&n=1',
    //            'https://board-lang4v.surelrn.vn/filereader/Editor/Index/?b=1590&n=1'
    //        ].map((url) => { return BoardUrl2BoardId(url) }))

    //    }, 3000)
    //});

})();
