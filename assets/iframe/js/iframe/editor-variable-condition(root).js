var _variable = {
    key: null,
    type: null,
    value: null,
};

var __variable = {
    if: [
        {
            ..._variable
        }
    ],
    then: [
        {
            ..._variable
        }
    ],
    else: [
        {
            ..._variable
        }
    ],
};

var ___variable = [];

var _data = {
    type: 'variable',   //variable, variables, slide, node
    variable: null,
    variables: null,
    slide: null,
    node: null,
    condition: null,    // == != >= <= > <
    operator: null,     // + - * / = =!
    valuetype: null,    // value, variable, variables
    valueformula: null,      // sum, avg, min, max
    value: null,
};

var __data = {
    if: [
        {
            ..._data
        }
    ],
    then: [
        {
            ..._data
        }
    ],
    else: [
        //{
        //    ..._data
        //}
    ],
};

var ___data = [];

function saveClick() {
    parent.$('#' + ParentViewerId).parents('.editor-iframe-box').find('.btn-save').click();
}

function valueEditor(data) {
    if (data !== undefined) {

        //
        if (data.length) {
            ___data = data;
        }

        //
        for (var i = 0, len = ___data.length; i < len; i++) {
            initCondition();
        }
    }
    else {
        var resData = ___data;

        $('.condition-data .condition-box').each(function (idx, ele) {
            var thisId = $(this).attr('id');
            resData
                .filter(function (f) {
                    return f.id == thisId;
                })
                .forEach(function (item) {
                    item.idx = idx + 1;
                });
        });

        var resData = resData
            .filter(function (f) {
                return !f.removed;
            })
            .map(function (m) {

                //loại bỏ các key dữ liệu rỗng
                m.if = m.if.filter(function (f) { return !f.removed && (f.type == 'variable' && f.variable || f.type == 'variables' && f.variables) ? true : false; });
                m.then = m.then.filter(function (f) { return !f.removed && (f.type == 'variable' && f.variable || f.type == 'variables' && f.variables || f.type == 'node' && f.node || f.type == 'slide' && f.slide) ? true : false; });
                m.else = m.else.filter(function (f) { return !f.removed && (f.type == 'variable' && f.variable || f.type == 'variables' && f.variables || f.type == 'node' && f.node || f.type == 'slide' && f.slide) ? true : false; });

                //lấy key gắn ra ngoài, chỉ lấy của điều kiện if
                m.variables = [];
                m.if.forEach(function (item) {

                    //add variable type
                    if (item.type == 'variable') {
                        m.variables.push(item.variable);
                    }
                    else if (item.type == 'variables') {
                        m.variables = m.variables.concat(item.variables);
                    }

                    //add value with variable
                    if (item.valuetype == 'variable') {
                        m.variables.push(item.value);
                    }

                });

                return m;
            })
            .filter(function (f) {
                return f.variables.length ? true : false;
            });

        return resData;
    }
}

window.addEventListener('load', function () {

    $(document).on('click', '.btn-add-condition', function (e) {
        e.preventDefault();

        initCondition();
    });

    $(document).on('click', '.btn-insert-condition', function (e) {
        e.preventDefault();

        var indexInsert = $(this).parents('.condition-box').attr('idx');
        initCondition(indexInsert);
    });

    $(document).on('click', '.btn-copy-condition', function (e) {
        e.preventDefault();

        var indexInsert = $(this).parents('.condition-box').attr('idx');
        initCondition(indexInsert, true);
    });

    $(document).on('click', '.btn-delete-condition', function (e) {
        e.preventDefault();

        var indexCondition = $(this).parents('.condition-box').attr('idx');

        $(this).parents('.condition-box').slideUp();

        //
        ___data[indexCondition].removed = true;
    });

    $(document).on('click', '.btn-add-condition-sub', function (e) {
        e.preventDefault();

        var conditionBox = $(e.currentTarget).parents('.condition-box'),
            conditionSubBox = $(e.currentTarget).parents('.condition-sub-box'),
            conditionSubType = conditionSubBox.attr('type');

        var indexCondition = parseInt(conditionBox.attr('idx'));
        var indexConditionSub = conditionSubBox.find('.condition-sub-content').length;

        if (conditionSubType.indexOf('if') >= 0) {
            initConditionSub(conditionBox, indexCondition, indexConditionSub, 'if');
        }
        else if (conditionSubType.indexOf('then') >= 0) {
            initConditionSub(conditionBox, indexCondition, indexConditionSub, 'then');
        }
        else if (conditionSubType.indexOf('else') >= 0) {
            initConditionSub(conditionBox, indexCondition, indexConditionSub, 'else');
        }
    });

    $(document).on('click', '.btn-delete-condition-sub', function (e) {
        e.preventDefault();

        var conditionBox = $(e.currentTarget).parents('.condition-box'),
            conditionSubBox = $(e.currentTarget).parents('.condition-sub-box'),
            conditionSubType = conditionSubBox.attr('type'),
            conditionSubContent = $(e.currentTarget).parents('.condition-sub-content');

        conditionSubContent.slideUp();

        var indexCondition = parseInt(conditionBox.data('idx'));
        var indexConditionSub = parseInt(conditionSubContent.data('idy'));

        //
        ___data[indexCondition][conditionSubType][indexConditionSub].removed = true;
    });
});

function initCondition(indexInsert, isCopy) {
    var randomId = Math.floor(Math.random() * 999999999).toString();

    var conditionBox = null;

    if (indexInsert) {
        conditionBox = $('.condition-template .condition-box').clone().insertAfter(`.condition-data .condition-container .condition-box[idx="${indexInsert}"]`);
    }
    else {
        conditionBox = $('.condition-template .condition-box').clone().appendTo('.condition-data .condition-container');
    }

    var indexCondition = $('.condition-data .condition-container .condition-box').length - 1;

    var isNew = false;

    //
    if (!___data[indexCondition]) {
        if (isCopy) {
            ___data.push(JSON.parse(JSON.stringify(___data[indexInsert])));
        }
        else {
            ___data.push(JSON.parse(JSON.stringify(__data)));
        }

        isNew = true;
    }
    if (!___variable[indexCondition]) {
        if (isCopy) {
            ___variable.push(JSON.parse(JSON.stringify(___variable[indexInsert])));
        }
        else {
            ___variable.push(JSON.parse(JSON.stringify(__variable)));
        }
    }

    //
    ___data[indexCondition]['id'] = randomId;

    //
    conditionBox.attr({ id: randomId, idx: indexCondition });
    conditionBox.data('id', randomId);
    conditionBox.data('idx', indexCondition);
    conditionBox.find('.stt').text(indexCondition + 1);
    conditionBox.find('.name').html(
        (___data[indexCondition]['if'] || [])
            .map(function (m) {
                if (m.type == 'variable' && m.variable) {
                    return `<span>${m.variable || ''} ${m.condition || ''} ${[null, undefined, NaN, Infinity].indexOf(m.value) < 0 ? m.value : ''}</span>`;
                }
                else if (m.type == 'variables' && m.variables) {
                    return m.variables
                        .map(function (variable) {
                            return `<span>${variable || ''} ${m.condition || ''} ${[null, undefined, NaN, Infinity].indexOf(m.value) < 0 ? m.value : ''}</span>`;
                        })
                        .join('');
                }
            })
            .join('')
    );

    conditionBox.find('.condition-sub-content').remove();

    conditionBox.find('[data-toggle="collapse"]').attr('href', `#collapse-${randomId}`);
    conditionBox.find('.collapse').attr('id', `collapse-${randomId}`);

    //if (!isNew && ___data.length > 2) {
    //    conditionBox.find('[data-toggle="collapse"]').addClass('collapsed');
    //    conditionBox.find('.collapse').removeClass('in');
    //}

    ////
    ////initComboBoxVariable(indexCondition, indexConditionSub, "if");
    ////initComboBoxVariable(indexCondition, indexConditionSub, "then");
    ////initComboBoxVariable(indexCondition, indexConditionSub, "else");

    //
    //Object.keys(__data).forEach(function (prefix) {
    //    for (var i = 0, len = ___data[indexCondition][prefix].length; i < len; i++) {
    //        initConditionSub(conditionBox, indexCondition, prefix);
    //    }
    //});

    conditionBox.find('.collapse')
        .on('show.bs.collapse', function () {

            if (!conditionBox.find('.condition-sub-content').length) {

                Object.keys(__data).forEach(function (prefix) {
                    for (var i = 0, len = ___data[indexCondition][prefix].length; i < len; i++) {
                        initConditionSub(conditionBox, indexCondition, i, prefix);
                    }
                });

            }

        });

    if (isNew) {
        conditionBox.addClass('condition-new');
    }

    if (isNew || ___data.length <= 2) {
        conditionBox.find('.collapse').collapse('show');
    }

    conditionBox.find('.condition-info').dblclick(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //
        conditionBox.find('.collapse').collapse('toggle');
    });
}

function initConditionSub(conditionBox, indexCondition, indexConditionSub, prefix) {
    var options = {
        idx: indexCondition,
        idy: indexConditionSub,
        prefix: prefix
    };

    var conditionSubBox = conditionBox.find(`.condition-sub-box[type="${options.prefix}"]`);

    //bảng mới
    var conditionSubContent = $(`.condition-template .condition-sub-box[type^="${prefix}"] .condition-sub-content`).clone().appendTo(conditionSubBox);
    conditionSubContent.attr({ idy: options.idy });
    conditionSubContent.data('idy', options.idy);

    //
    if (!___data[options.idx]) {
        ___data.push(JSON.parse(JSON.stringify(__data)));
    }
    if (!___variable[options.idx]) {
        ___variable.push(JSON.parse(JSON.stringify(__variable)));
    }

    //
    if (!___data[options.idx][prefix][options.idy]) {
        ___data[options.idx][prefix].push(JSON.parse(JSON.stringify(_data)));
    }
    if (!___variable[options.idx][prefix][options.idy]) {
        ___variable[options.idx][prefix].push(JSON.parse(JSON.stringify(_variable)));
    }

    //fix data new version, fix variable -> variables
    for (var item of ___data[options.idx][prefix]) {
        if (item.type == 'variable') {
            //item.type = "variables";

            if (!item.variables && item.variable) {
                item.variables = [item.variable + ""];
                //item.variable = null;
            }
        }
    }

    options.ebox = conditionSubContent;

    //
    if (prefix == 'if') {
        //initComboBoxVariable(options.ebox, options.idx, options.idy, prefix);
        initComboBoxType(options.ebox, options.idx, options.idy, prefix);
    }
    else {
        initComboBoxType(options.ebox, options.idx, options.idy, prefix);
    }
}


//
function initComboBoxType(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxType');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "type",
        dataTextField: "text",
        dataValueField: "value",
    };

    options.dataSource = (function () {
        return prefix == 'if' ?
            [
                { value: 'variable', text: 'Thay đổi giá trị Biến' },
                { value: 'variables', text: 'Thay đổi giá trị N Biến' },
            ]
            : prefix == 'then' ?
                [
                    { value: 'variable', text: 'Thay đổi giá trị Biến' },
                    { value: 'variables', text: 'Thay đổi giá trị N Biến' },
                    { value: 'slide', text: 'Mở trang' },
                    { value: 'node', text: 'Kích hoạt đối tượng' },
                ]
                : prefix == 'else' ?
                    [
                        { value: 'variable', text: 'Thay đổi giá trị Biến' },
                        { value: 'variables', text: 'Thay đổi giá trị N Biến' },
                        { value: 'slide', text: 'Mở trang' },
                        { value: 'node', text: 'Kích hoạt đối tượng' },
                    ]
                    : [
                        { value: 'variable', text: 'Thay đổi giá trị Biến' },
                        { value: 'variables', text: 'Thay đổi giá trị N Biến' },
                        { value: 'slide', text: 'Mở trang' },
                        { value: 'node', text: 'Kích hoạt đối tượng' },
                    ];
    })();

    options.change = function (dataItem) {
        //
        options.ebox.find(`tr[for]`).hide();

        //
        if (dataItem) {
            //options.ebox.find(`tr[for="${dataItem.value}"]`).fadeIn();
            options.ebox.find(`tr[for]`).each(function () {
                if (this.getAttribute('for').split(',').indexOf(dataItem.value) >= 0) {
                    $(this).fadeIn();
                }
            });

            switch (dataItem.value) {
                case 'variable': {
                    initComboBoxVariable(ebox, idx, idy, prefix);
                    break;
                }
                case 'variables': {
                    initMultiSelectVariable(ebox, idx, idy, prefix);
                    break;
                }
                case 'slide': {
                    initComboBoxSlide(ebox, idx, idy, prefix);
                    break;
                }
                case 'node': {
                    initComboBoxSlide(ebox, idx, idy, prefix);
                    //initComboBoxNode(ebox, idx, idy, prefix);
                    break;
                }
            }
        }

    };

    //init
    initComboBox(options);
}

function initComboBoxVariable(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxVariable');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "variable",
        dataTextField: "key",
        dataValueField: "key",
        footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # biến</small></div>',
        //template: '<span class="k-state-default"><h5 style="margin: 5px 0 0;">#: data.key #</h5><p style="margin: 0 0 5px;"><span class="text-muted">#: data.type||"" #</span> <small class="text-muted">#: data.note||"" #</small></p></span>',
        template: function (data) {
            return '<div class="k-state-default">'
                + `<h5 style="margin: 5px 0 0;">${data.key || ''}</h5>`
                + '<p style="margin: 0 0 5px;">'
                + (data.type ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.type}</small>` : '')
                + (data.note ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.note.substr(0, 32)}</small>` : '')
                + '</p>'
                + '</div>';
        },
    };

    switch (prefix) {
        case 'if': {
            options.dataSource = parent._variable.getVariableAll();
            break;
        }
        case 'then': {
            options.dataSource = parent._variable.getVariableAll().filter(function (f) { return !f.readonly; });
            break;
        }
        case 'else': {
            options.dataSource = parent._variable.getVariableAll().filter(function (f) { return !f.readonly; });
            break;
        }
    }

    options.change = function (dataItem) {
        if (dataItem) {
            Object.assign(___variable[idx][prefix][idy], dataItem);
        }
        if (prefix.indexOf('if') >= 0) {
            initComboBoxCondition(ebox, idx, idy, prefix);
        }
        else {
            initComboBoxOperator(ebox, idx, idy, prefix);
        }
        initComboBoxValueType(ebox, idx, idy, prefix);
        initComboBoxValueFormula(ebox, idx, idy, prefix);
        initComboBoxValue(ebox, idx, idy, prefix);
    };

    //init
    initComboBox(options);
}

function initMultiSelectVariable(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initMultiSelectVariable');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "variables",
        dataTextField: "key",
        dataValueField: "key",
        footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # biến</small></div>',
        //template: '<span class="k-state-default"><h5 style="margin: 5px 0 0;">#: data.key #</h5><p style="margin: 0 0 5px;"><span class="text-muted">#: data.type||"" #</span> <small class="text-muted">#: data.note||"" #</small></p></span>',
        template: function (data) {
            return '<div class="k-state-default">'
                + `<h5 style="margin: 5px 0 0;">${data.key || ''}</h5>`
                + '<p style="margin: 0 0 5px;">'
                + (data.type ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.type}</small>` : '')
                + (data.note ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.note.substr(0, 32)}</small>` : '')
                + '</p>'
                + '</div>';
        },
    };

    //
    var assignData = ___data[idx][prefix][idy];
    var variables = [];

    switch (prefix) {
        case 'if': {
            variables = parent._variable.getVariableAll();
            break;
        }
        case 'then': {
            variables = parent._variable.getVariableAll().filter(function (f) { return !f.readonly; });
            break;
        }
        case 'else': {
            variables = parent._variable.getVariableAll().filter(function (f) { return !f.readonly; });
            break;
        }
    }

    options.dataSource = {
        transport: {
            read: function (reads) {

                //chạy không đồng bộ
                setTimeout(function () {

                    var res = null;

                    //xử lý, giới hạn dữ liệu loại biến tương ứng với mục chọn
                    if (assignData.variables) {
                        //có ít nhất 1 dữ liệu thì kiểm tra limit dữ liệu loại biến
                        if (assignData.variables.length) {
                            var variable = variables.filter(function (f) { return f.key == assignData.variables[0]; })[0];
                            if (variable) {
                                res = variables.filter(function (f) { return f.type == variable.type; });
                            }
                        }
                    }

                    //
                    reads.success(res || variables);

                    if (typeof options.dataSource.dataBinding == "function") {
                        options.dataSource.dataBinding();
                    }

                });

            }
        }
    };

    options.change = function (dataItem) {
        if (dataItem) {
            Object.assign(___variable[idx][prefix][idy], dataItem);
        }
        if (prefix.indexOf('if') >= 0) {
            initComboBoxCondition(ebox, idx, idy, prefix);
        }
        else {
            initComboBoxOperator(ebox, idx, idy, prefix);
        }
        initComboBoxValueType(ebox, idx, idy, prefix);
        initComboBoxValueFormula(ebox, idx, idy, prefix);
        initComboBoxValue(ebox, idx, idy, prefix);

        //xử lý, giới hạn dữ liệu loại biến tương ứng với mục chọn
        if (assignData.variables) {
            var res = null;

            //có ít nhất 1 dữ liệu thì kiểm tra limit dữ liệu loại biến
            if (assignData.variables.length == 1) {
                var variable = variables.filter(function (f) { return f.key == assignData.variables[0]; })[0];
                if (variable) {
                    res = variables.filter(function (f) { return f.type == variable.type; });
                }
                thisMultiSelect.setDataSource(res || variables);
            }
            //Không có mục nào được chọn thì xổ hết ra
            else if (!assignData.variables.length) {
                thisMultiSelect.setDataSource(variables);
            }
        }
    };

    //init
    var thisMultiSelect = initMultiSelect(options);
}

function initComboBoxCondition(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxCondition');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "condition",
        dataTextField: "text",
        dataValueField: "value",
    };

    options.dataSource = (function () {
        var data = [
            { value: '==', text: 'Bằng' },
            { value: '!=', text: 'Không bằng' },
            { value: '<', text: 'Nhỏ hơn' },
            { value: '<=', text: 'Nhỏ hơn hoặc bằng' },
            { value: '>', text: 'Lớn hơn' },
            { value: '>=', text: 'Lớn hơn hoặc bằng' },
            { value: '∈', text: 'Có chứa nội dung' },
            { value: '∉', text: 'Không chứa nội dung' },
        ];

        switch (___variable[idx][prefix][idy].type) {
            case 'number': {
                return data.filter(function (f) { return ['==', '!=', '>=', '<=', '>', '<'].indexOf(f.value) >= 0; });
            }
            case 'string': {
                return data.filter(function (f) { return ['==', '!=', '∈', '∉'].indexOf(f.value) >= 0; });
            }
            case 'boolean': {
                return data.filter(function (f) { return ['==', '!='].indexOf(f.value) >= 0; });
            }
            default: {
                return [];
            }
        }
    })();

    //init
    initComboBox(options);
}

function initComboBoxOperator(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxOperator');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "operator",
        dataTextField: "text",
        dataValueField: "value",
    };

    options.dataSource = (function () {
        var data = [
            { value: '+', text: 'Cộng' },
            { value: '-', text: 'Trừ' },
            { value: '*', text: 'Nhân' },
            { value: '/', text: 'Chia' },
            { value: '=', text: 'Bằng' },
            { value: '=!', text: 'Bằng nghịch đảo' }
        ];

        switch (___variable[idx][prefix][idy].type) {
            case 'number': {
                return data.filter(function (f) { return ['+', '-', '*', '/', '='].indexOf(f.value) >= 0; });
            }
            case 'string': {
                return data.filter(function (f) { return ['='].indexOf(f.value) >= 0; });
            }
            case 'boolean': {
                return data.filter(function (f) { return ['=', '=!'].indexOf(f.value) >= 0; });
            }
            default: {
                return [];
            }
        }
    })();

    //init
    initComboBox(options);
}

function initComboBoxValueType(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxValueType');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "valuetype",
        dataTextField: "text",
        dataValueField: "value",
    };

    switch (prefix) {
        case 'if': {
            options.dataSource = [
                { value: 'value', text: 'Giá trị' },
                { value: 'variable', text: 'Biến' },
            ];
            break;
        }
        case 'then': {
            if (___variable[idx][prefix][idy].type == 'number') {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                    { value: 'variables', text: 'N Biến' },
                ];
            }
            else if (___variable[idx][prefix][idy].type == 'boolean') {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                    { value: 'variables', text: 'N Biến' },
                ];
            }
            else {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                ];
            }
            break;
        }
        case 'else': {
            if (___variable[idx][prefix][idy].type == 'number') {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                    { value: 'variables', text: 'N Biến' },
                ];
            }
            else if (___variable[idx][prefix][idy].type == 'boolean') {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                    { value: 'variables', text: 'N Biến' },
                ];
            }
            else {
                options.dataSource = [
                    { value: 'value', text: 'Giá trị' },
                    { value: 'variable', text: 'Biến' },
                ];
            }
            break;
        }
    }

    options.change = function () {
        initComboBoxValueFormula(ebox, idx, idy, prefix);
        initComboBoxValue(ebox, idx, idy, prefix);
    };

    //init
    initComboBox(options);
}

function initComboBoxValueFormula(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxValueFormula');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "valueformula",
        dataTextField: "text",
        dataValueField: "value",
    };

    var assignData = ___data[idx][prefix][idy];

    if (assignData.valuetype == 'variables') {
        options.dataSource = (function () {
            var data = [
                { value: 'sum', text: 'Tính cộng' },
                { value: 'sub', text: 'Tính trừ' },
                { value: 'pro', text: 'Tính nhân' },
                { value: 'div', text: 'Tính chia' },
                { value: 'avg', text: 'Tính giá trị trung bình' },
                { value: 'min', text: 'Trả về giá trị nhỏ nhất' },
                { value: 'max', text: 'Trả về giá trị lớn nhất' },
                { value: 'and', text: 'Trả về TRUE nếu tất cả các đối số là TRUE' },
                { value: 'or', text: 'Trả về TRUE nếu 1 trong các đối số là TRUE' },
            ];

            switch (___variable[idx][prefix][idy].type) {
                case 'number': {
                    return data.filter(function (f) { return ['sum', 'sub', 'pro', 'div', 'avg', 'min', 'max'].indexOf(f.value) >= 0; });
                }
                case 'boolean': {
                    return data.filter(function (f) { return ['and', 'or'].indexOf(f.value) >= 0; });
                }
                default: {
                    return [];
                }
            }
        })();

        //init
        initComboBox(options);
    }

    //clear
    if (!options.dataSource || options.dataSource.length == 0) {
        ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
    }
}

function initComboBoxValue(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxValue');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "value"
    };

    var assignData = ___data[idx][prefix][idy];

    if (assignData.valuetype == 'variable') {

        Object.assign(options, {
            dataTextField: "key",
            dataValueField: "key",
            footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # biến</small></div>',
            //template: '<span class="k-state-default"><h5 style="margin: 5px 0 0;">#: data.key #</h5><p style="margin: 0 0 5px;"><span class="text-muted">#: data.type||"" #</span> <small class="text-muted">#: data.note||"" #</small></p></span>',
            template: function (data) {
                return '<div class="k-state-default">'
                    + `<h5 style="margin: 5px 0 0;">${data.key || ''}</h5>`
                    + '<p style="margin: 0 0 5px;">'
                    + (data.type ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.type}</small>` : '')
                    + (data.note ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.note.substr(0, 32)}</small>` : '')
                    + '</p>'
                    + '</div>';
            },
        });

        options.dataSource = parent._variable.getVariableAll().filter(function (f) { return f.type == ___variable[idx][prefix][idy].type });

        //init
        initComboBox(options);
    }
    else if (assignData.valuetype == 'variables') {

        Object.assign(options, {
            dataTextField: "key",
            dataValueField: "key",
            footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # biến</small></div>',
            //template: '<span class="k-state-default"><h5 style="margin: 5px 0 0;">#: data.key #</h5><p style="margin: 0 0 5px;"><span class="text-muted">#: data.type||"" #</span> <small class="text-muted">#: data.note||"" #</small></p></span>',
            template: function (data) {
                return '<div class="k-state-default">'
                    + `<h5 style="margin: 5px 0 0;">${data.key || ''}</h5>`
                    + '<p style="margin: 0 0 5px;">'
                    + (data.type ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.type}</small>` : '')
                    + (data.note ? `<small style="display:inline-block;padding:0 5px;background:rgba(0,0,0,0.1);border-radius:4px;margin-right:5px;">${data.note.substr(0, 32)}</small>` : '')
                    + '</p>'
                    + '</div>';
            },
        });

        options.dataSource = parent._variable.getVariableAll().filter(function (f) { return f.type == ___variable[idx][prefix][idy].type });

        //init
        initMultiSelect(options);
    }
    else {
        switch (___variable[idx][prefix][idy].type) {
            case 'number': {
                if (typeof assignData[options.valueField] != "number") {
                    assignData[options.valueField] = 1;
                }

                //var thisInputBox =
                //    $(
                //        $(
                //            //$('.condition-data .condition-box').get(options.idx)
                //            options.ebox
                //        ).find(`.condition-sub-box[type="${options.prefix}"] .condition-sub-content`).get(options.idy)
                //    ).find(`.v-${options.prefix}-${options.valueField}`).empty();

                var thisInputBox = options.ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
                if (!thisInputBox.length) {
                    return;
                }

                var thisInput = $('<input/>', { style: 'width:100%', class: 'form-control' }).appendTo(thisInputBox);

                thisInput.prop('type', 'number');
                thisInput.val(assignData[options.valueField]);
                thisInput.change(function () {
                    assignData[options.valueField] = parseInt($(this).val() || '0');
                });
                break;
            }
            case 'string': {
                if (typeof assignData[options.valueField] != "string") {
                    assignData[options.valueField] = '';
                }

                //var thisInputBox =
                //    $(
                //        $(
                //            //$('.condition-data .condition-box').get(options.idx)
                //            options.ebox
                //        ).find(`.condition-sub-box[type="${options.prefix}"] .condition-sub-content`).get(options.idy)
                //    ).find(`.v-${options.prefix}-${options.valueField}`).empty();

                var thisInputBox = options.ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
                if (!thisInputBox.length) {
                    return;
                }

                var thisInput = $('<input/>', { style: 'width:100%', class: 'form-control' }).appendTo(thisInputBox);

                thisInput.prop('type', 'text');
                thisInput.val(assignData[options.valueField]);
                thisInput.change(function () {
                    assignData[options.valueField] = $(this).val();
                });
                break;
            }
            case 'boolean': {
                if (typeof assignData[options.valueField] == "string") {
                    assignData[options.valueField] = assignData[options.valueField].toLowerCase();
                }
                if (typeof assignData[options.valueField] != "boolean") {
                    assignData[options.valueField] = ["1", "true", "yes"].indexOf(assignData[options.valueField]) >= 0 ? true : false;
                }

                Object.assign(options, {
                    dataTextField: "text",
                    dataValueField: "value",
                });

                options.dataSource = [
                    { value: true, text: "Đúng" },
                    { value: false, text: "Sai" },
                ];

                options.change = function () {
                    assignData[options.valueField] = [true, "1", "true", "yes"].indexOf(assignData[options.valueField]) >= 0 ? true : false;
                }

                //init
                initComboBox(options);
                break;
            }
        }
    }
}

function initComboBoxSlide(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxSlide');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "slide",
        dataTextField: "id",
        dataValueField: "id",
        footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # trang</small></div>',
        template: '<div class="media">'
            + '<div class="media-left">'
            + `<img class="media-object" width="80" src="#:data.coverSrc||\'${ROOT_URL}images/HinhBaiHoc1.png\'#" style="background-color:rgb(255,255,255)">`
            + '</div>'
            + '<div class="media-body">'
            + '<h5 class="media-heading">Trang #:data.idx||""#</h5>'
            + '<span>#:data.id||""#</span>'
            + '</div>'
            + '</div>',
    };

    //options.dataSource = (function () {
    //    var slides = parent.contentDataHide.data();

    //    slides.forEach(function (slide, idx) {
    //        slide.idx = idx + 1;
    //        slide.coverSrc = slide.coverSrc || slide.cover ? slide.cover.toDataURL() : null;
    //    });

    //    return slides;
    //})();

    options.dataSource = {
        transport: {
            read: function (reads) {

                //chạy không đồng bộ
                setTimeout(function () {

                    var slides = parent.contentDataHide.data();

                    slides.forEach(function (slide, idx) {
                        slide.idx = idx + 1;
                        slide.coverSrc = slide.coverSrc || slide.cover ? slide.cover.toDataURL() : null;
                    });

                    reads.success(slides);

                    if (typeof options.dataSource.dataBinding == "function") {
                        options.dataSource.dataBinding();
                    }

                });

            }
        }
    };

    options.change = function () {
        //nếu type node, sẽ render node, ko phải type node, sẽ ko có chỗ render
        //initComboBoxNode(ebox, idx, idy, prefix);
        initChoiceNode(ebox, idx, idy, prefix);
    };

    //init
    initComboBox(options);
}

function initComboBoxNode(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxNode');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "node",
        dataTextField: "nodeId",
        dataValueField: "nodeId",
        footerTemplate: '<div class="text-right"><small class="text-muted" style="padding:5px;">Tổng #: instance.dataSource.total() # đối tượng</small></div>',
        template: '<div class="media">'
            //+ '<div class="media-left">'
            //+ '<img class="media-object" width="200" src="#:data.coverSrc||\'${ROOT_URL}images/HinhBaiHoc1.png\'#" style="background-color:rgb(255,255,255)">'
            //+ '</div>'
            + '<div class="media-body">'
            + '<h5 class="media-heading">#:data.nodeId||""#</h5>'
            + '<div>'
            + '<small>#:data.text||data.nodeName||""#</small>'
            + '</div>'
            + '</div>'
            + '</div>',
    };

    var assignData = ___data[idx][prefix][idy];

    //options.dataSource = (function () {
    //    var slides = parent.contentDataHide.data();

    //    slides.forEach(function (slide, idx) {
    //        slide.idx = idx + 1;
    //        slide.coverSrc = slide.coverSrc || slide.cover ? slide.cover.toDataURL() : null;
    //    });

    //    return slides;
    //})();

    options.dataSource = {
        transport: {
            read: function (reads) {

                //chạy không đồng bộ
                var intervalNodeDatas = setInterval(function () {

                    if (!dataNodes) { return; }

                    clearInterval(intervalNodeDatas);

                    reads.success(dataNodes.filter(function (f) { return f.slideId == assignData.slide; }));

                    if (typeof options.dataSource.dataBinding == "function") {
                        options.dataSource.dataBinding();
                    }

                }, 100);

            }
        }
    };

    //init
    initComboBox(options);
}

function initChoiceNode(ebox, idx, idy, prefix) {
    if (window.location.hostname == 'localhost') {
        console.log('initComboBoxNode');
    }

    var options = {
        ebox: ebox,
        idx: idx,
        idy: idy,
        prefix: prefix,
        valueField: "node",
    };

    var assignData = ___data[idx][prefix][idy];

    var thisInputBox = options.ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
    if (!thisInputBox.length) {
        return;
    }

    //var thisInput = $('<input/>', { style: 'width:100%', class: 'form-control' }).appendTo(thisInputBox);

    var newItem = $(
        `<div class="input-group">
                    <input type="text" class="form-control" style="height:32px;"/>
                    <div class="input-group-btn dropdown">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width:32px;height:32px;width:calc(1.4285714286em + 12px);height:calc(1.4285714286em + 12px);padding:6px;line-height:0;"><span class="k-icon k-i-arrow-s k-button-icon"></span></button>
                    <ul class="dropdown-menu dropdown-menu-right" style="padding:0;">
                        <li><div class="slide" style="width:768px;max-width:100%;"></div></li>
                    </ul>
                    </div>
                </div>`.replace(/\s+/g, ' ')
    ).appendTo(thisInputBox);

    var renderDataDropdown = function () {
        var dataSlide = parent.contentDataHide.dataSlideId(assignData.slide);
        var screen = parent.contentDataHide.screen();

        var newItemSvg = $(dataSlide.svg)
            .clone()
            .attr('viewBox', `0 0 ${screen.w} ${screen.h}`)
            .css({
                width: '100%'
            })
            .appendTo(newItem.find('.slide').empty());

        newItemSvg
            .find('img[path],iframe[path],.media-item[src][path]').each(function (idx, ele) {
                let url = ele.getAttribute('src'),
                    path = ele.getAttribute('path');

                let urls = sourceToUrls({ url: url, path: path });
                if (urls.length > 0) {
                    ele.addEventListener('error', function () {
                        if (urls.length > 0) {
                            ele.setAttribute('src', urls.shift());
                        }
                    });
                }

                if (path && typeof window.LvmDecode != 'undefined') {
                    window.LvmDecode(API_UPLOAD_URL + path.replace(/^\//, ''), function (resUrl) {
                        ele.setAttribute('src', resUrl);
                    });
                }
                else {
                    ele.setAttribute('src', urls.shift());
                }
            });

        newItemSvg
            .on('click', '.svg-node', function () {
                var nodeId = $(this).attr('id');
                if (nodeId) {
                    newItem.find('input').val(nodeId).change();
                }
            })
            .on('mouseenter', '.svg-node', function () {
                $(this).addClass('actived');

                //
                newItemSvg.svgNodeShowActive2();
            })
            .on('mouseleave', '.svg-node', function () {
                $(this).removeClass('actived');

                //
                newItemSvg.svgNodeShowActive2();
            });

        if (assignData.node) {
            newItemSvg.find(`#${assignData.node}`).addClass('selected');

            //
            newItemSvg.svgNodeShowSelected();
        }
    };

    var thisInput = newItem.find('input');
    //thisInput.val(assignData[options.valueField]);
    thisInput.change(function () {

        //assignData[options.valueField] = parseInt($(this).val() || '0');

        var inputVal = parseInt($(this).val() || '0');
        if (dataNodes.filter(function (f) { return f.slideId == assignData.slide && f.nodeId == inputVal; }).length) {
            assignData[options.valueField] = inputVal;
        }
        else {
            assignData[options.valueField] = null;
            thisInput.val(null);
        }
    });

    (function () {
        //chạy không đồng bộ, sét value input
        var intervalNodeDatas = setInterval(function () {

            if (!dataNodes) { return; }

            clearInterval(intervalNodeDatas);

            //
            var inputVal = assignData[options.valueField];
            if (dataNodes.filter(function (f) { return f.slideId == assignData.slide && f.nodeId == inputVal; }).length) {
                thisInput.val(inputVal);
            }

        }, 100);
    })();

    var thisButton = newItem.find('button');
    thisButton.click(function (event) {
        event.preventDefault();

        //
        renderDataDropdown();
    });
}

//
function initComboBox(options) {
    if (window.location.hostname == 'localhost') {
        console.log(options);
    }

    var assignData = ___data[options.idx][options.prefix][options.idy];

    //var thisInputBox =
    //    $(
    //        $(
    //            //$('.condition-data .condition-box').get(options.idx)
    //            options.ebox
    //        ).find(`.condition-sub-box[type="${options.prefix}"] .condition-sub-content`).get(options.idy)
    //    ).find(`.v-${options.prefix}-${options.valueField}`).empty();
    var thisInputBox = options.ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
    if (!thisInputBox.length) {
        return;
    }

    var thisInput = $('<input/>', { style: 'width:100%' }).appendTo(thisInputBox);

    var thisComboBox =
        thisInput
            .kendoComboBox({
                height: 480,
                clearButton: false,
                filter: "contains",
                suggest: true,
                dataSource: options.dataSource,
                dataTextField: options.dataTextField,
                dataValueField: options.dataValueField,
                footerTemplate: options.footerTemplate || null,
                template: options.template || null,
                change: function () {
                    var dataItem = this.dataItem();
                    if (!dataItem) {
                        assignData[options.valueField] = null;
                        this.value(null);
                        this.text(null);
                    }
                    else {
                        assignData[options.valueField] = this.value();
                    }

                    //
                    if (typeof options.change == 'function') {
                        options.change(dataItem);
                    }
                },
                dataBound: function () {
                    this.input.on('focus', function () {
                        thisComboBox.open();
                    });
                },
                open: function () {
                    //$(document.body).css('overflow', 'hidden')
                },
                close: function () {
                    //$(document.body).css('overflow', 'auto')
                }
            })
            .data('kendoComboBox');

    var dataBinding = function () {

        var dataSource = thisComboBox.dataSource._data;

        // có giá trị và giá trị có trong data source
        if ([null, undefined, NaN, Infinity].indexOf(assignData[options.valueField]) < 0 && dataSource.filter(function (f) { return f[options.dataValueField] == assignData[options.valueField]; }).length) {
            thisComboBox.value(assignData[options.valueField]);
            thisComboBox.trigger('change');
        }
        // ko có giá trị và data source chỉ có 1
        else if (!assignData[options.valueField] && dataSource.length == 1) {
            thisComboBox.value(dataSource[0][options.dataValueField]);
            thisComboBox.trigger('change');
        }

        if (dataSource.length == 1) {
            //thisComboBox.enable(false);
        }
    };

    if (Array.isArray(options.dataSource)) {
        dataBinding();
    }
    else if (typeof options.dataSource == "object") {
        options.dataSource.dataBinding = dataBinding;
    }

    return thisComboBox;
}

function initMultiSelect(options) {
    if (window.location.hostname == 'localhost') {
        console.log(options);
    }

    var assignData = ___data[options.idx][options.prefix][options.idy];

    //var thisInputBox =
    //    $(
    //        $(
    //            //$('.condition-data .condition-box').get(options.idx)
    //            options.ebox
    //        ).find(`.condition-sub-box[type="${options.prefix}"] .condition-sub-content`).get(options.idy)
    //    ).find(`.v-${options.prefix}-${options.valueField}`).empty();
    var thisInputBox = options.ebox.find(`.v-${options.prefix}-${options.valueField}`).empty();
    if (!thisInputBox.length) {
        return;
    }

    var thisInput = $('<input/>', { style: 'width:100%' }).appendTo(thisInputBox);

    var thisMultiSelect =
        thisInput
            .kendoMultiSelect({
                height: 480,
                clearButton: false,
                autoClose: false,
                downArrow: true,
                dataSource: options.dataSource,
                dataTextField: options.dataTextField,
                dataValueField: options.dataValueField,
                footerTemplate: options.footerTemplate || null,
                template: options.template || null,
                change: function () {
                    var value = this.value();
                    if (value && value.length) {
                        assignData[options.valueField] = value;
                    }
                    else {
                        assignData[options.valueField] = null
                    }

                    //
                    if (typeof options.change == 'function') {
                        options.change(this.dataItem());
                    }
                },
                dataBound: function () {
                    this.input.on('focus', function () {
                        thisMultiSelect.open();
                    });
                },
                open: function () {
                    //$(document.body).css('overflow', 'hidden')
                },
                close: function () {
                    //$(document.body).css('overflow', 'auto')
                },
            })
            .data('kendoMultiSelect');

    var dataBinding = function () {

        var dataSource = thisMultiSelect.dataSource._data;

        // có giá trị và giá trị có trong data source
        if ([null, undefined, NaN, Infinity].indexOf(assignData[options.valueField]) < 0) {// && dataSource.filter(function (f) { return f[options.dataValueField] == assignData[options.valueField]; }).length) {
            thisMultiSelect.value(assignData[options.valueField]);
            thisMultiSelect.trigger('change');
        }
        // ko có giá trị và data source chỉ có 1
        else if (!assignData[options.valueField] && dataSource.length == 1) {
            thisMultiSelect.value(dataSource[0][options.dataValueField]);
            thisMultiSelect.trigger('change');
        }

        if (dataSource.length == 1) {
            //thisMultiSelect.enable(false);
        }
    };

    if (Array.isArray(options.dataSource)) {
        dataBinding();
    }
    else if (typeof options.dataSource == "object") {
        options.dataSource.dataBinding = dataBinding;
    }

    return thisMultiSelect;
}