/*
 
    Function Support KendoUI

 */

//add function to jQuery
(function ($) {

    //COMBOBOX
    $.fn.kendoComboBox_ServerInit = function (options) {
        var element = $(this);

        options = options || {};
        options.value = options.value || element.data('value') || element.val() || null;
        options.placeholder = options.placeholder || element.data('placeholder') || element.attr('placeholder') || null;
        options.validate = options.validate || element.data('validate') || element.attr('validate') || null;

        element.removeClass('form-control');

        if (element.data("kendoComboBox")) {
            element.data("kendoComboBox").value(null);
            element.data("kendoComboBox").destroy();
            element.parent().find('.k-dropdown-wrap').remove();
            element.data("kendoComboBox", null);
            $(element.attr('id') + '-list').parents('.k-animation-container').remove();
            $(element.attr('id') + '-list').remove();
        }

        var ValueField = options.dataValueField ? options.dataValueField : 'Value';
        var TextField = options.dataTextField ? options.dataTextField : 'Text';

        if (options.isLevel) {
            options.template = '#if(data.Level || data.Level === 0 || data.level || data.level === 0){#<div style="'
                + 'padding-left:#=(parseInt(data.Level||data.level)-1)*20#px;'
                + '#if(parseInt(data.Level||data.level) <= 1){# font-weight:bold; #}#'

                + (options.disableValueData
                    ? '#if(("' + options.disableValueData + '").split(",").indexOf(data.' + (options.disableValueField || options.dataValueField) + ' + "") != -1){# color:rgb(181,181,181); cursor: not-allowed; #}#'
                    : "")

                + '">'
                + '<span class="fa fa-level-#=(data.Level||data.level)#"></span>&nbsp; '
                + '#=data.' + TextField + '#</div>#}else{# #=data.' + TextField + '# #}#';
        }

        var cbb = element.kendoComboBox({
            dataValueField: ValueField,
            dataTextField: TextField,
            placeholder: options.placeholder ? options.placeholder : "Chọn dữ liệu",
            noDataTemplate: "Không tìm thấy dữ liệu!",
            change: function () {
                if (!this.dataItem()) { this.value(null); this.text(null); }

                if (typeof options.change === 'function') {
                    options.change(this);
                }
            },
            template: options.template || null,
            enable: options.enable === false ? options.enable : true,
            suggest: true,
            filter: "contains",
            valuePrimitive: true,
            //value: options.value || null,
            dataSource: {
                transport: {
                    read: function (reads) {
                        if (options.dataSource) {
                            reads.success(options.dataSource);
                            return;
                        }

                        if (!options.url) {
                            reads.success([]);

                            cbb.value(null);
                            cbb.text(null);
                            return;
                        }

                        $.post(ROOT_URL + options.url, options.data)
                            .always(function (e) {
                                var dataValue = !e ? null : typeof e === 'object' ? e : JSON.parse(e);
                                if (dataValue) {
                                    if (dataValue.length > 0) {
                                        reads.success(dataValue);
                                    }
                                    else {
                                        reads.success([]);
                                    }

                                    if (options.value) {
                                        //kiểm tra nếu giá trị tồn tại trong datasource gán giá trị, không tồn tại thì gán null
                                        var flag = true;
                                        $.each(dataValue, function (idx, val) {
                                            if (val[ValueField] == options.value) {

                                                cbb.value(options.value);

                                                flag = false;
                                                return false; // rời vòng lặp
                                            }
                                        });

                                        if (flag) {
                                            cbb.value(null);
                                            cbb.text(null);
                                            cbb.trigger("change");
                                        }
                                        else if (options.trigger) {
                                            $(element).data("kendoComboBox").trigger(options.trigger.toLowerCase());
                                        }
                                    }
                                    else {
                                        if (dataValue.length === 1 && dataValue[0][ValueField] !== undefined || options.selectfirst === true && options.value === null) {
                                            cbb.value(dataValue[0][ValueField]);
                                            cbb.trigger("change");
                                        }
                                    }
                                }
                                else {
                                    reads.success([]);
                                    cbb.value(null);
                                    cbb.text(null);

                                    if (options.trigger) {
                                        $(element).data("kendoComboBox").trigger(options.trigger.toLowerCase());
                                    }
                                }
                            });
                    }
                }
            },
            select: options.select || function (e) {
                if (e.item) {
                    var dataItem = this.dataItem(e.item.index());

                    if (options.disableValueData && options.disableValueData.split(',').indexOf(dataItem[options.disableValueField] + "") !== -1) {
                        e.preventDefault();
                        this.value(null);
                        this.text(null);
                    }
                }
            }
        }).data('kendoComboBox');

        cbb.input.click(function () {
            cbb.open();
        });

        return element;
    };

    $.fn.kendoComboBox_Topic = function (options) {
        options = options || {};

        $.extend(options, {
            url: 'Topic/Search',
            dataValueField: 'topic_id',
            dataTextField: 'topic_title',
            isLevel: true
        });

        return $(this).kendoComboBox_ServerInit(options);
    };

    $.fn.kendoComboBox_Category = function (options) {
        options = options || {};

        $.extend(options, {
            url: 'Category/Search',
            dataValueField: 'category_id',
            dataTextField: 'category_title',
            isLevel: true
        });

        return $(this).kendoComboBox_ServerInit(options);
    };

    $.fn.kendoComboBox_Lookup = function (options) {
        options = options || {};

        $.extend(options, {
            url: 'Lookup/Search',
            dataValueField: options.dataValueField || 'lookup_value',
            dataTextField: options.dataTextField || 'lookup_title'
        });

        return $(this).kendoComboBox_ServerInit(options);
    };

    //TREELIST
    $.fn.kendoTreeList_ServerInit = function (options) {
        $(this).kendoTreeList(options);

        return $(this);
    };

    $.fn.kendoTreeList_Category = function (options) {
        var cloneOptions = $.extend({}, options);

        $.extend(options, {
            columns: [
                {
                    field: "category_title",
                    title: "Chuyên mục",
                    sortable: false,
                    filterable: false,
                    template: '<span class="entry-name" style="display: inline-block; margin-left:25px; #=(data.Level === 1 || data.level === 1 ? "font-weight:bold" : (data.Level === 2 || data.level === 2 ? "font-weight:600" : ""))#" title="#:data.category_title#">#:data.category_title#</span>',
                    //headerAttributes: { style: "display: none;" },
                    attributes: { style: "height: 32px;", 'class': 'fix-width' }
                },
                {
                    field: "total_media",
                    title: "Học liệu",
                    width: 50,
                    sortable: false,
                    filterable: false,
                    //headerAttributes: { style: "display: none;" },
                    attributes: { style: "padding:0;text-align:center;border-left:1px solid #eee;" }
                },
                {
                    field: "total_board",
                    title: "Bài giảng",
                    width: 50,
                    sortable: false,
                    filterable: false,
                    //headerAttributes: { style: "display: none;" },
                    attributes: { style: "padding:0;text-align:center;border-left:1px solid #eee;" }
                }
            ],
            dataSource: {
                serverFiltering: true,
                serverSorting: true,
                serverPaging: true,
                schema: {
                    //data: "models",
                    //total: "total",
                    model: {
                        expanded: true,
                        id: "id",
                        parentId: "parentId",
                        fields: {
                            id: { field: "category_id", type: "number", nullable: true },    //định mệnh bắt buộc
                            parentId: { field: "category_pid", type: "number", nullable: true }, //định mệnh bắt buộc
                            level: { type: "number", nullable: true },
                            total_media: { type: "number", nullable: true },
                            total_board: { type: "number", nullable: true }
                        }
                    }
                },
                transport: {
                    read: function (reads) {

                        $.post(ROOT_URL + 'Category/Search', options.data)
                            .done(function (e) {
                                reads.success(!e ? [] : typeof e === 'object' ? e.length > 0 ? e : [] : JSON.parse(e));
                            })
                            .fail(function () {
                                reads.success([]);
                            });
                    }
                }
            },
            //dataBinding: function (e) {
            //    console.log("dataBinding", e);
            //    console.log(e.sender.tbody.find('.fix-width'));
            //},
            dataBound: function (e) {
                e.sender.tbody.find('.fix-width').each(function (idx, node) {
                    var textBox = $(node).find('.entry-name'),
                        textContent = textBox.text().split(' ');

                    while (node.offsetHeight > 50 && textContent.length > 0) {
                        textContent.pop();
                        textBox.text(textContent.join(' ') + '...');
                    }
                });

                if (typeof cloneOptions.dataBound === 'function') {
                    cloneOptions.dataBound(e);
                }
            }
        });

        return $(this).kendoTreeList_ServerInit(options);
    };

    //GRID

    $.fn.kendoGrid_Base = function (options) {
        options = options || {};

        _gridIdx = 0;

        (options.columns || []).unshift({
            width: 50,
            title: "#",
            headerAttributes: { "class": "not-tooltip", style: "text-align:right;" },
            template: '<div class="text-right" title="#= ++_gridIdx #">#= _gridIdx #</div>',
        });

        if ($('#grid-action-template').length) {
            (options.columns || []).unshift({
                width: 50,
                field: "",
                title: "",
                sortable: false,
                filterable: false,
                attributes: { "class": "not-tooltip", style: "overflow:visible;padding:0;text-align:center;" },
                template: function (item) {
                    var temp = $($('#grid-action-template').html());

                    temp.find('[href]').each(function () {
                        return this.href = decodeURIComponent(this.href);
                    });

                    temp.find('[src]').each(function () {
                        return this.src = decodeURIComponent(this.src);
                    });

                    var tempHTML = temp.get(0).outerHTML;

                    return $.tmpl(tempHTML, { item: item }).get(0).outerHTML;
                }
            });
        }

        return $(this).kendoGrid($.extend({
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            sortable: true,
            filterable: { extra: false },
            selectable: true,
            scrollable: true,
            resizable: true,
            reorderable: true,
            navigatable: true,

            filterMenuInit: function (e) {
                var fieldModel = [];
                var arrField = [];
                var arrType = [];

                try { fieldModel = e.sender.dataSource.reader.model.fields; } catch (e) { fieldModel = []; }

                if (fieldModel) {
                    $.each(fieldModel, function (index, value) {
                        arrField.push(index);
                        arrType.push(value.type);
                    });
                }

                if (arrField.indexOf(e.field) != -1 && arrType[arrField.indexOf(e.field)] == "date") {
                    var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                    firstValueDropDown.dataSource.data([{ value: "gte", text: "Lớn hơn hoặc bằng" }]);
                    firstValueDropDown.select(0);
                    firstValueDropDown.trigger("change");
                    firstValueDropDown.wrapper.hide();

                    var logicDropDown = e.container.find("select:eq(1)").data("kendoDropDownList");
                    logicDropDown.value("and");
                    logicDropDown.trigger("change");
                    logicDropDown.wrapper.hide();

                    var secondValueDropDown = e.container.find("select:eq(2)").data("kendoDropDownList");
                    secondValueDropDown.dataSource.data([{ value: "lte", text: "Nhỏ hơn hoặc bằng" }]);
                    secondValueDropDown.select(0);
                    secondValueDropDown.trigger("change");
                    secondValueDropDown.wrapper.hide();

                    var firstValueDatePicker = e.container.find("input:eq(0)").data("kendoDatePicker");
                    firstValueDatePicker.wrapper.context.placeholder = "Từ ngày";
                    firstValueDatePicker.setOptions({
                        change: function () {
                            firstValueDropDown.select(0);
                            firstValueDropDown.trigger("change");
                        }
                    });

                    var secondValueDatePicker = e.container.find("input:eq(1)").data("kendoDatePicker");
                    secondValueDatePicker.wrapper.context.placeholder = "Đến ngày";
                    secondValueDatePicker.setOptions({
                        change: function () {
                            secondValueDropDown.select(0);
                            secondValueDropDown.trigger("change");
                        }
                    });
                }
                else if (arrField.indexOf(e.field) != -1 && arrType[arrField.indexOf(e.field)] == "number") {
                    var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                    firstValueDropDown.dataSource.data([{ value: "gte", text: "Nhỏ hơn hoặc bằng" }]);
                    firstValueDropDown.select(0);
                    firstValueDropDown.trigger("change");
                    firstValueDropDown.wrapper.hide();

                    var logicDropDown = e.container.find("select:eq(1)").data("kendoDropDownList");
                    logicDropDown.value("and");
                    logicDropDown.trigger("change");
                    logicDropDown.wrapper.hide();

                    var secondValueDropDown = e.container.find("select:eq(2)").data("kendoDropDownList");
                    secondValueDropDown.dataSource.data([{ value: "lte", text: "Lớn hơn hoặc bằng" }]);
                    secondValueDropDown.select(0);
                    secondValueDropDown.trigger("change");
                    secondValueDropDown.wrapper.hide();


                    var firstValueNumeric = e.container.find("input:eq(1)").data("kendoNumericTextBox").options;
                    firstValueNumeric.min = 0
                    firstValueNumeric.step = 1;
                    firstValueNumeric.format = "n0"

                    e.container.find("input:eq(1)").data("kendoNumericTextBox").bind('change', function () {
                        firstValueDropDown.select(0);
                        firstValueDropDown.trigger("change");
                    });

                    var secondValueNumeric = e.container.find("input:eq(3)").data("kendoNumericTextBox").options;
                    secondValueNumeric.min = 0
                    secondValueNumeric.step = 1;
                    secondValueNumeric.format = "n0"

                    e.container.find("input:eq(3)").data("kendoNumericTextBox").bind('change', function () {
                        secondValueDropDown.select(0);
                        secondValueDropDown.trigger("change");
                    });

                    $(e.container.find("input:eq(0)")[0]).attr('placeholder', "Từ");
                    $(e.container.find("input:eq(2)")[0]).attr('placeholder', "Đến");
                }
                else {
                    var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                    setTimeout(function () {
                        if (firstValueDropDown != undefined)
                            firstValueDropDown.wrapper.hide();
                    });
                }
            },

            dataBinding: function () {
                _gridIdx = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            }
        }, options || {}));

    };

})(jQuery);

var LocalStorage = function (storage_key, storage_value) {
    this.CheckStorage = (function () {
        try {
            var ls = window.localStorage,
                t1 = "check_storage",
                t2 = null;
            ls.setItem(t1, t1);
            t2 = ls.getItem(t1);
            ls.removeItem(t1);
            return (t1 === t2);
        }
        catch (exception) {
            return false;
        }
    }());

    if (this.CheckStorage) {
        if (!storage_value) {
            //get
            return localStorage.getItem(storage_key);
        }
        else {
            //set
            localStorage.setItem(storage_key, storage_value);
            return;
        }
    }
    else {
        // Sorry! No Web Storage support..
    }
    return null;
}

function GridGetParamFilter(data) {
    var grid = $(_GridID).data('kendoGrid');

    var fieldModel = [];

    try {
        fieldModel = grid.dataSource.reader.model.fields;
    }
    catch (e) {
        fieldModel = [];
    }

    var ArrFieldModel = [];
    var ArrTypeModel = [];

    if (fieldModel) {
        $.each(fieldModel, function (index, value) {
            ArrFieldModel.push(index);
            ArrTypeModel.push(value.type);
        });
    }

    var strField = null;
    var strValue = null;
    var JsTemp = {};
    _FilterName = [];

    var objFilter = data.filter;

    if (objFilter) {
        var valueFilter = objFilter.filters;
        for (var i = 0; i < valueFilter.length; i++) {
            //push _FilterName
            if (grid) {
                var column = grid.columns;
                for (var j = 0; j < column.length; j++) {
                    if (column[j].field == valueFilter[i].field && (valueFilter[i].value || valueFilter[i].value === false))
                        if (column[j].title)
                            _FilterName.push(column[j].title);
                }
            }
            //end push _FilterName

            var valueFilter_1 = valueFilter[i].filters;

            if (valueFilter_1 == undefined) {
                var field = valueFilter[i].field;
                var value = valueFilter[i].value;
                var operator = valueFilter[i].operator;

                if (ArrFieldModel.indexOf(field) != -1 && ArrTypeModel[ArrFieldModel.indexOf(field)] == "date") {
                    if (operator == "gte") {
                        strField = field + "From";
                    }
                    else //if (operator == "lte")
                    {
                        strField = field + "To";
                    }

                    strValue = kendo.toString(kendo.parseDate(value), "dd/MM/yyyy");
                }
                else if (ArrFieldModel.indexOf(field) != -1 && ArrTypeModel[ArrFieldModel.indexOf(field)] == "number") {
                    if (operator == "gte") {
                        strField = field + "From";
                    }
                    else //if (operator == "lte")
                    {
                        strField = field + "To";
                    }

                    strValue = value;
                }
                else {
                    strField = field;
                    strValue = value;
                }
            }
            else {
                for (var x = 0; x < valueFilter_1.length; x++) {
                    //push _FilterName
                    for (var y = 0; y < column.length; y++) {
                        if (column[y].field == valueFilter_1[x].field && (valueFilter_1[x].value || valueFilter_1[x].value === false)) {
                            if (column[y].title)
                                _FilterName.push(column[y].title);
                        }
                    }

                    var field = valueFilter_1[x].field;
                    var value = valueFilter_1[x].value;
                    var operator = valueFilter_1[x].operator;

                    if (ArrFieldModel.indexOf(field) != -1 && ArrTypeModel[ArrFieldModel.indexOf(field)] == "date") {
                        if (operator == "gte") {
                            strField = field + "From";
                        }
                        else //if (operator == "lte") 
                        {
                            strField = field + "To";
                        }

                        strValue = kendo.toString(kendo.parseDate(value), "dd/MM/yyyy");
                    }
                    else if (ArrFieldModel.indexOf(field) != -1 && ArrTypeModel[ArrFieldModel.indexOf(field)] == "number") {
                        if (operator == "gte") {
                            strField = field + "From";
                        }
                        else //if (operator == "lte")
                        {
                            strField = field + "To";
                        }

                        strValue = value;
                    }
                    else {
                        strField = field;
                        strValue = value;
                    }
                }
            }

            JsTemp[strField] = strValue + "";
        }
    }

    return JsTemp;
}

function GridGetParamSort(data) {
    var grid = $(_GridID).data('kendoGrid');

    var SortField = "";
    var SortType = "";
    _SortName = [];

    if (data.sort && data.sort.length > 0) {
        SortField = data.sort[0].field;
        SortType = data.sort[0].dir;

        if (SortType) {
            SortType = SortType.toUpperCase();
        }

        //push _SortName
        var column = grid.columns;
        for (var i = 0; i < column.length; i++) {
            if (column[i].field == SortField && (SortType == "ASC" || SortType == "DESC") && column[i].title)
                _SortName.push(column[i].title);
        }
        //end push _SortName
    }

    return { sortfield: SortField, sorttype: SortType };
}

function GridGetOptionsOld() {
    var StorageData = JSON.parse(LocalStorage(_GridKey) || "{}");

    if (StorageData.data) {
        if (!StorageData.data.filter || !StorageData.data.filter.filters) {
            StorageData.data.filter = {};
            StorageData.data.filter.filters = [];
        }

        if (!StorageData.data.sort) {
            StorageData.data.sort = [];
        }

        if (!StorageData.data.page) {
            StorageData.data.page = 1;
        }

        if (!StorageData.data.pageSize) {
            StorageData.data.pageSize = 10;
        }
    }
    else {
        StorageData.data = {
            filter: {
                filters: []
            },
            sort: [],
            page: 1,
            pageSize: 10
        }
    }
    return StorageData;
}

function GridRefresh() {
    $(_GridID).find('.k-grid-pager .k-pager-refresh').click();
}

function GridSetFilter(filters) {

    //var filters = [];

    //Object.keys(objFilter).forEach(function (key) {
    //    if (objFilter[key]) {
    //        filters.push({ field: key, value: objFilter[key] });
    //    }
    //});

    $(_GridID).data('kendoGrid').dataSource.filter(filters || []);
}

function GridChangeFilter(field, value) {
    var options = GridGetOptionsOld(),
        filters = options.data.filter.filters;

    var newFilters = filters.filter(function (f) { return f.field != field; });
    newFilters.push({ field: field, value: value });

    GridSetFilter(newFilters);
}