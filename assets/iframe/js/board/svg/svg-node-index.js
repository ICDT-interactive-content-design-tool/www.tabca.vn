
(function ($) {

    $.fn.svgNodeIndex = function (id, index) {
        var nodes = $(this);
        if (nodes.length > 0) {

            id = nodes[0].getAttribute('for-fix-index');
            index = index || nodes[0].getAttribute('data-index') || 0;
            time = nodes[0].getAttribute('data-time') || 100;

            var nodeSize = { x: 0, y: 0, w: 0, h: 0, minX: 9999, minY: 9999, maxX: 0, maxY: 0 };
            nodes.each(function (idx, node) {
                var size = node.nodeName === 'g' ? $(node).find('>*').svgNodeSize() : $(node).svgNodeSize();

                nodeSize.minX = Math.min(nodeSize.minX, size.minX);
                nodeSize.minY = Math.min(nodeSize.minY, size.minY);
                nodeSize.maxX = Math.max(nodeSize.maxX, size.maxX);
                nodeSize.maxY = Math.max(nodeSize.maxY, size.maxY);
            });

            nodeSize.x = nodeSize.minX;
            nodeSize.y = nodeSize.minY;
            nodeSize.w = nodeSize.maxX - nodeSize.minX;
            nodeSize.h = nodeSize.maxY - nodeSize.minY;

            //xóa cũ
            //$(_svg).find('g.fix-index#' + id).remove();

            //tạo mới
            var new_g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            new_g.setAttribute('id', id);
            new_g.setAttribute('class', 'fix-index');
            _svg.appendChild(new_g);

            var newForeignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            newForeignObject.setAttribute('x', nodeSize.x - 105);
            newForeignObject.setAttribute('y', nodeSize.y);
            newForeignObject.setAttribute('width', 100);
            newForeignObject.setAttribute('height', 80);
            newForeignObject.setAttribute('class', 'slide-handle');
            new_g.appendChild(newForeignObject);

            //
            var newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            newRect.setAttribute('stroke', '#999');
            newRect.setAttribute('stroke-width', 1);
            newRect.setAttribute('stroke-dasharray', 2);
            newRect.setAttribute('fill', 'none');
            newRect.setAttribute('x', nodeSize.x - 5);
            newRect.setAttribute('y', nodeSize.y - 5);
            newRect.setAttribute('width', nodeSize.w + 10);
            newRect.setAttribute('height', nodeSize.h + 10);
            newRect.setAttribute('class', 'slide-handle');
            new_g.appendChild(newRect);

            //
            var newObjectContent = $('#template .position-slide').clone().appendTo(newForeignObject);
            newObjectContent.find('input[name="index"]')
                .on('mousedown touchstart', function (e) {
                    this.focus();
                    //e.preventDefault();
                    e.stopPropagation();
                })
                .val(parseInt(index))
                .change(function () {
                    if (!this.value || parseFloat(this.value) < 0) {
                        this.value = 0;
                    }
                    else {
                        this.value = parseInt(this.value);
                    }

                    //change data value
                    this.setAttribute('value', this.value);
                    $(contentDataShow).find('.indexs[for-fix-index="' + $(this).parents('.fix-index').attr('id') + '"]').attr('data-index', this.value);

                    //change layout value
                    $(contentDataShow).find('.fix-index[id="' + $(this).parents('.fix-index').attr('id') + '"]').find('input[name="index"]').val(this.value);
                });

            newObjectContent.find('input[name="time"]')
                .on('mousedown touchstart', function (e) {
                    this.focus();
                    //e.preventDefault();
                    e.stopPropagation();
                })
                .val((parseFloat(time) || 1).toFixed(2))
                .change(function () {
                    if (!this.value || parseFloat(this.value) < 0) {
                        this.value = 0;
                    }
                    else {
                        this.value = parseFloat(this.value).toFixed(2);
                    }

                    //change data value
                    this.setAttribute('value', this.value);
                    $(contentDataShow).find('.indexs[for-fix-index="' + $(this).parents('.fix-index').attr('id') + '"]').attr('data-time', this.value);

                    //change layout value
                    $(contentDataShow).find('.fix-index[id="' + $(this).parents('.fix-index').attr('id') + '"]').find('input[name="time"]').val(this.value);
                });

            newObjectContent.find('button[name="remove"]')
                .on('mousedown touchstart', function (e) {
                    this.click();
                    e.preventDefault();
                    e.stopPropagation();
                })
                .click(function (e) {
                    $(contentDataShow).find('.indexs[for-fix-index="' + $(this).parents('.fix-index').attr('id') + '"]')
                        .attr('data-index', 0)
                        .removeAttr('for-fix-index');

                    $(this).parents('.fix-index').remove();
                });
        }

        return $(this);
    };

    $.fn.svgNodeShowIndex = function () {
        var node = $(this)[0];
        if (node) {
            //init old fix index
            var indexs = $(node).find('g.paths[for-fix-index], g.shapes[for-fix-index]').map(function () {
                var index = parseInt(this.getAttribute('for-fix-index') || 0) || 0;
                if (index > 0) {
                    return index;
                }
            }).get();

            //sắp xếp mảng tăng dần
            indexs.sort(function (a, b) { return a - b; });

            //loại bỏ phần tử trùng
            indexs = indexs.filter(function (item, pos, self) {
                return self.indexOf(item) === pos;
            });

            indexs.forEach(function (idx) {
                $(node).find('g.paths[for-fix-index="' + idx + '"]').svgNodeIndex();
                $(node).find('g.shapes[for-fix-index="' + idx + '"]').svgNodeIndex();
            });

            $(node).find('g.editors[for-fix-index], g.medias[for-fix-index], g.components[for-fix-index], g.tests[for-fix-index]').each(function () {
                $(this).svgNodeIndex();
            });
        }

        return $(this);
    };

    $.fn.svgNodeShowActive = function () {
        let svgs = this,
            svgNodes = svgs.find('[id].actived');

        let g_active = (function () {
            if (svgs.find('g.actives').length > 0) {
                return svgs.find('g.actives').empty()[0];
            }
            else {
                let new_g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                new_g.setAttribute('class', 'actives');
                return $(new_g).appendTo(svgs)[0];
            }
        })();

        let min_x = 999999999,
            min_y = 999999999,
            max_x = 0,
            max_y = 0;

        if (svgNodes.length > 0) {
            //khởi tạo các vị trí active
            svgNodes.each(function (idx, svgNode) {

                var nodeId = svgNode.getAttribute('id');

                //lấy thông tin vị trí
                let pos = $(svgNode).svgNodeLocation();

                //tạo khung active
                (function () {
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    newRect.setAttribute('stroke', '#ccc');
                    newRect.setAttribute('stroke-width', 1);
                    newRect.setAttribute('stroke-dasharray', 2);
                    newRect.setAttribute('fill', 'none');
                    newRect.setAttribute('x', pos.x - 1);
                    newRect.setAttribute('y', pos.y - 1);
                    newRect.setAttribute('width', pos.w + 2);
                    newRect.setAttribute('height', pos.h + 2);
                    g_active.appendChild(newRect);
                })();

                /*
                (function () {
                    //nền text
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    //newRect.setAttribute('fill', '#f00');
                    //newRect.setAttribute('fill', 'rgba(255,255,255,0)');
                    newRect.setAttribute('fill', 'rgba(255,255,255,0.75)');
                    newRect.setAttribute('x', pos.x + 1);
                    newRect.setAttribute('y', pos.y + 1);
                    newRect.setAttribute('width', 72);
                    newRect.setAttribute('height', 18);
                    g_active.appendChild(newRect);

                    //thêm text nodeId
                    let newText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    //newText.setAttribute('fill', '#777');
                    newText.setAttribute('fill', '#7b92fe');
                    newText.setAttribute('x', pos.x + 3);
                    newText.setAttribute('y', pos.y + 14);
                    newText.style.fontSize = '12px';
                    newText.style.cursor = 'pointer';
                    newText.textContent = `#${nodeId}`;
                    newText.addEventListener('click', function (e) { e.preventDefault(); copyToClipboard(nodeId); });
                    g_active.appendChild(newText);
                })();
                */

                var icons = [];

                (function () {
                    if (contentDataHide.animates(nodeId).length > 0) {
                        icons.push('iconmoon iconmoon-animation');
                    }
                    if (contentDataHide.actions(nodeId).length > 0) {
                        icons.push('iconmoon iconmoon-action');
                    }
                    if ((contentDataHide.variable(nodeId) || {}).variable) {
                        icons.push('iconmoon iconmoon-FillTemplate');
                    }
                    else if (svgNode.getAttribute('data-variable')) {
                        icons.push('iconmoon iconmoon-FillTemplate');
                    }
                    if ($(svgNode).parents('.indexs').hasClass('tests')) {
                        icons.push('iconmoon iconmoon-TaoBaiKiemTra1');
                    }
                })();

                icons.forEach(function (icon, idx) {
                    //nền text
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    newRect.setAttribute('fill', 'rgba(255,255,255,0.5)');
                    newRect.setAttribute('x', pos.x - 20);
                    newRect.setAttribute('y', pos.y + idx * 17);
                    newRect.setAttribute('width', 16);
                    newRect.setAttribute('height', 16);
                    g_active.appendChild(newRect);

                    //thêm active action
                    let newText = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                    newText.setAttribute('xmlns:html', 'http://www.w3.org/1999/xhtml');
                    newText.setAttribute('x', pos.x - 20);
                    newText.setAttribute('y', pos.y + idx * 17);
                    newText.setAttribute('width', 16);
                    newText.setAttribute('height', 16);
                    g_active.appendChild(newText);

                    $(`<div class="display-table"><div class="display-table-cell" style="line-height:0;text-align:center;"><i class="${icon}" style="font-size:14px;color:#888;"></i></div></div>`).appendTo(newText);
                });
                
                //lấy dữ liệu tạo khung nhóm active
                min_x = Math.min(min_x, pos.x);
                min_y = Math.min(min_y, pos.y);
                max_x = Math.max(max_x, pos.x + pos.w);
                max_y = Math.max(max_y, pos.y + pos.h);
            });

            //khởi tạo khung nhóm active
            if (svgNodes.length > 1) {
                let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                newRect.setAttribute('stroke', '#00f');
                newRect.setAttribute('stroke-width', 1);
                newRect.setAttribute('stroke-dasharray', 2);
                newRect.setAttribute('fill', 'none');
                newRect.setAttribute('x', min_x - 10);
                newRect.setAttribute('y', min_y - 10);
                newRect.setAttribute('width', max_x - min_x + 20);
                newRect.setAttribute('height', max_y - min_y + 20);
                //
                g_active.appendChild(newRect);
            }
        }
    };

    $.fn.svgNodeShowActive2 = function () {
        let svgs = this,
            svgNodes = svgs.find('[id].actived');

        let g_active = (function () {
            if (svgs.find('g.actives').length > 0) {
                return svgs.find('g.actives').empty()[0];
            }
            else {
                let new_g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                new_g.setAttribute('class', 'actives');
                return $(new_g).appendTo(svgs)[0];
            }
        })();

        let min_x = 999999999,
            min_y = 999999999,
            max_x = 0,
            max_y = 0;

        if (svgNodes.length > 0) {
            //khởi tạo các vị trí active
            svgNodes.each(function (idx, svgNode) {

                var nodeId = svgNode.getAttribute('id');

                //lấy thông tin vị trí
                let pos = $(svgNode).svgNodeLocation();

                //tạo khung active
                (function () {
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    newRect.setAttribute('stroke', '#f00');
                    newRect.setAttribute('stroke-width', 2);
                    newRect.setAttribute('stroke-dasharray', 8);
                    newRect.setAttribute('fill', 'none');
                    newRect.setAttribute('x', pos.x - 1);
                    newRect.setAttribute('y', pos.y - 1);
                    newRect.setAttribute('width', pos.w + 2);
                    newRect.setAttribute('height', pos.h + 2);
                    g_active.appendChild(newRect);
                })();

                (function () {
                    //nền text
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    //newRect.setAttribute('fill', '#f00');
                    //newRect.setAttribute('fill', 'rgba(255,255,255,0)');
                    newRect.setAttribute('fill', 'rgba(255,255,255,0.75)');
                    newRect.setAttribute('x', pos.x - 1);
                    newRect.setAttribute('y', pos.y - 20);
                    newRect.setAttribute('width', 100);
                    newRect.setAttribute('height', 18);
                    g_active.appendChild(newRect);

                    //thêm text nodeId
                    let newText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    //newText.setAttribute('fill', '#777');
                    newText.setAttribute('fill', '#7b92fe');
                    newText.setAttribute('x', pos.x);
                    newText.setAttribute('y', pos.y - 6);
                    newText.style.fontSize = '14px';
                    newText.style.cursor = 'pointer';
                    newText.textContent = `#${nodeId}`;
                    newText.addEventListener('click', function (e) { e.preventDefault(); copyToClipboard(nodeId); });
                    g_active.appendChild(newText);
                })();

                //lấy dữ liệu tạo khung nhóm active
                min_x = Math.min(min_x, pos.x);
                min_y = Math.min(min_y, pos.y);
                max_x = Math.max(max_x, pos.x + pos.w);
                max_y = Math.max(max_y, pos.y + pos.h);
            });

            //khởi tạo khung nhóm active
            if (svgNodes.length > 1) {
                let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                newRect.setAttribute('stroke', '#00f');
                newRect.setAttribute('stroke-width', 2);
                newRect.setAttribute('stroke-dasharray', 8);
                newRect.setAttribute('fill', 'none');
                newRect.setAttribute('x', min_x - 10);
                newRect.setAttribute('y', min_y - 10);
                newRect.setAttribute('width', max_x - min_x + 20);
                newRect.setAttribute('height', max_y - min_y + 20);
                //
                g_active.appendChild(newRect);
            }
        }
    };

    $.fn.svgNodeShowSelected= function () {
        let svgs = this,
            svgNodes = svgs.find('[id].selected');

        let g_active = (function () {
            if (svgs.find('g.selects').length > 0) {
                return svgs.find('g.selects').empty()[0];
            }
            else {
                let new_g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                new_g.setAttribute('class', 'selects');
                return $(new_g).appendTo(svgs)[0];
            }
        })();

        let min_x = 999999999,
            min_y = 999999999,
            max_x = 0,
            max_y = 0;

        if (svgNodes.length > 0) {
            //khởi tạo các vị trí active
            svgNodes.each(function (idx, svgNode) {

                var nodeId = svgNode.getAttribute('id');

                //lấy thông tin vị trí
                let pos = $(svgNode).svgNodeLocation();

                //tạo khung active
                (function () {
                    let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    newRect.setAttribute('stroke', '#f00');
                    newRect.setAttribute('stroke-width', 2);
                    newRect.setAttribute('stroke-dasharray', 20);
                    newRect.setAttribute('fill', 'none');
                    newRect.setAttribute('x', pos.x - 1);
                    newRect.setAttribute('y', pos.y - 1);
                    newRect.setAttribute('width', pos.w + 2);
                    newRect.setAttribute('height', pos.h + 2);
                    g_active.appendChild(newRect);
                })();

                //lấy dữ liệu tạo khung nhóm active
                min_x = Math.min(min_x, pos.x);
                min_y = Math.min(min_y, pos.y);
                max_x = Math.max(max_x, pos.x + pos.w);
                max_y = Math.max(max_y, pos.y + pos.h);
            });

            //khởi tạo khung nhóm select
            if (svgNodes.length > 1) {
                let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                newRect.setAttribute('stroke', '#00f');
                newRect.setAttribute('stroke-width', 2);
                newRect.setAttribute('stroke-dasharray', 20);
                newRect.setAttribute('fill', 'none');
                newRect.setAttribute('x', min_x - 10);
                newRect.setAttribute('y', min_y - 10);
                newRect.setAttribute('width', max_x - min_x + 20);
                newRect.setAttribute('height', max_y - min_y + 20);
                //
                g_active.appendChild(newRect);
            }
        }
    };

})(jQuery);