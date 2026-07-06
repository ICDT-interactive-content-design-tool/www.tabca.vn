
(function ($) {
    //$(contentMedia).on('click', '.svg-node-resizeable', function () {
    //    console.log($(this).svgNodeTransform());
    //});

    //$(contentViewer).on('click', '.resizeable', function () {
    //    console.log($(this).svgNodeTransform());
    //});


    /*
     * return {
            angle: angle,
            centerX: centerX,
            centerY: centerY
        };
     */
    $.fn.svgNodeTransform = function () {
        var node = $(this)[0];

        var transform = node.getAttribute('transform') || '0,0,0',
            transformOrigin = node.getAttribute('transform-origin'),
            rotate = transform.replace('rotate(', '').replace(')', ''),
            angle = parseFloat(rotate.split(',')[0] || 0);

        let centerX, centerY;

        switch (node.nodeName) {
            case 'polygon': {
                //lấy danh sách tọa độ
                var points = node.getAttribute('points').split(',').map(function (point) { return point.split(' ').map(function (xy) { return parseFloat(xy); }); }),
                    point_x = [],
                    point_y = [];

                points.forEach(function (point) {
                    point_x.push(point[0]);
                    point_y.push(point[1]);
                });

                var minX = Math.min.apply(null, point_x),
                    minY = Math.min.apply(null, point_y),
                    maxX = Math.max.apply(null, point_x),
                    maxY = Math.max.apply(null, point_y);

                centerX = (minX + maxX) / 2;
                centerY = (minY + maxY) / 2;
                break;
            }
            case 'circle': {
                var cx = parseFloat(node.getAttribute('cx') || 0),
                    cy = parseFloat(node.getAttribute('cy') || 0),
                    r = parseFloat(node.getAttribute('r') || 0);

                centerX = cx;
                centerY = cy;
                break;
            }
            case 'ellipse': {
                var ex = parseFloat(node.getAttribute('cx') || 0),
                    ey = parseFloat(node.getAttribute('cy') || 0),
                    rx = parseFloat(node.getAttribute('rx') || 0),
                    ry = parseFloat(node.getAttribute('ry') || 0);

                centerX = ex;
                centerY = ey;
                break;
            }
            case 'line': {
                var x1 = parseFloat(node.getAttribute('x1') || 0),
                    y1 = parseFloat(node.getAttribute('y1') || 0),
                    x2 = parseFloat(node.getAttribute('x2') || 0),
                    y2 = parseFloat(node.getAttribute('y2') || 0);

                centerX = (x1 + x2) / 2;
                centerY = (y1 + y2) / 2;
                break;
            }
            case 'rect':
            case 'foreignObject': {
                //lấy danh sách tọa độ
                var x = parseFloat(node.getAttribute('x') || 0),
                    y = parseFloat(node.getAttribute('y') || 0),
                    w = parseFloat(node.getAttribute('width') || 0),
                    h = parseFloat(node.getAttribute('height') || 0);

                centerX = x + w / 2;
                centerY = y + h / 2;
                break;
            }
            default: {
                centerX = parseFloat(rotate.split(',')[1] || 0);
                centerY = parseFloat(rotate.split(',')[2] || 0);
                break;
            }
        }

        if (!transformOrigin) {
            node.setAttribute('transform-origin', [centerX, centerY].join(' '));
        }

        return {
            angle: angle,
            centerX: centerX,
            centerY: centerY
        };
    };

    /*
     * return {
                x: x,
                y: y,
                w: w,
                h: h
            };
     */
    $.fn.svgNodeLocation = function (options) {
        var node = $(this)[0];

        this.get = function () {
            var x = 0, y = 0, w = 0, h = 0, pos = {};

            if (node) {
                switch (node.nodeName) {
                    case 'polygon':
                        {
                            //lấy danh sách tọa độ
                            var points = node.getAttribute('points').split(',').map(function (point) { return point.split(' ').map(function (xy) { return parseFloat(xy); }); }),
                                point_x = [],
                                point_y = [];

                            points.forEach(function (point) {
                                point_x.push(point[0]);
                                point_y.push(point[1]);
                            });

                            pos = {
                                minX: Math.min.apply(null, point_x),
                                minY: Math.min.apply(null, point_y),
                                maxX: Math.max.apply(null, point_x),
                                maxY: Math.max.apply(null, point_y)
                            };

                            x = pos.minX;
                            y = pos.minY;
                            w = pos.maxX - pos.minX;
                            h = pos.maxY - pos.minY;
                            break;
                        }
                    case 'circle':
                        {
                            var cx = parseFloat(node.getAttribute('cx') || 0),
                                cy = parseFloat(node.getAttribute('cy') || 0),
                                r = parseFloat(node.getAttribute('r') || 0);

                            x = cx - r;
                            y = cy - r;
                            w = r * 2;
                            h = r * 2;
                            break;
                        }
                    case 'ellipse':
                        {
                            var ex = parseFloat(node.getAttribute('cx') || 0),
                                ey = parseFloat(node.getAttribute('cy') || 0),
                                rx = parseFloat(node.getAttribute('rx') || 0),
                                ry = parseFloat(node.getAttribute('ry') || 0);

                            x = ex - rx;
                            y = ey - ry;
                            w = rx * 2;
                            h = ry * 2;
                            break;
                        }
                    case 'line':
                        {
                            var x1 = parseFloat(node.getAttribute('x1') || 0),
                                y1 = parseFloat(node.getAttribute('y1') || 0),
                                x2 = parseFloat(node.getAttribute('x2') || 0),
                                y2 = parseFloat(node.getAttribute('y2') || 0);

                            pos = {
                                minX: Math.min(x1, x2),
                                minY: Math.min(y1, y2),
                                maxX: Math.max(x1, x2),
                                maxY: Math.max(y1, y2)
                            };

                            x = pos.minX;
                            y = pos.minY;
                            w = pos.maxX - pos.minX;
                            h = pos.maxY - pos.minY;
                            break;
                        }
                    case 'rect':
                    case 'foreignObject':
                        {
                            x = parseFloat(node.getAttribute('x') || 0);
                            y = parseFloat(node.getAttribute('y') || 0);
                            w = parseFloat(node.getAttribute('width') || 0);
                            h = parseFloat(node.getAttribute('height') || 0);
                            break;
                        }
                    default:
                        {
                            x = $(node).offset().left;
                            y = $(node).offset().top;
                            w = $(node).outerWidth();
                            h = $(node).outerHeight();
                            break;
                        }
                }
            }

            return {
                x: x,
                y: y,
                w: w,
                h: h
            };
        };

        this.set = function (options) {
            if (typeof options === 'object') {
                if (node) {
                    switch (node.nodeName) {
                        case 'polygon':
                            {
                                //lấy tỷ lệ tọa độ vẽ ra ảnh, sau đó vẽ lại ảnh theo tọa độ mới
                                var ratios = JSON.parse(node.getAttribute('ratios') || '[]'),
                                    points = [];

                                ratios.forEach(function (ratio) {
                                    points.push([
                                        options.x + options.w * ratio[0],
                                        options.y + options.h * ratio[1]
                                    ]);
                                });

                                node.setAttribute('points', points.map(function (m) { return m.join(' '); }).join(','));
                                node.setAttribute('transform-origin', [options.x + options.w / 2, options.y + options.h / 2].join(' '));
                                break;
                            }
                        case 'circle':
                            {
                                var //cx = parseFloat(node.getAttribute('cx') || 0),
                                    //cy = parseFloat(node.getAttribute('cy') || 0),
                                    r = parseFloat(node.getAttribute('r') || 0);

                                node.setAttribute('cx', options.x + r);
                                node.setAttribute('cy', options.y + r);
                                node.setAttribute('transform-origin', [options.x + r, options.y + r].join(' '));
                                break;
                            }
                        case 'ellipse':
                            {
                                var //ex = parseFloat(node.getAttribute('cx') || 0),
                                    //ey = parseFloat(node.getAttribute('cy') || 0),
                                    rx = parseFloat(node.getAttribute('rx') || 0),
                                    ry = parseFloat(node.getAttribute('ry') || 0);

                                node.setAttribute('cx', options.x + rx);
                                node.setAttribute('cy', options.y + ry);
                                node.setAttribute('transform-origin', [options.x + rx, options.y + ry].join(' '));
                                break;
                            }
                        case 'line':
                            {
                                var x1 = parseFloat(node.getAttribute('x1') || 0),
                                    y1 = parseFloat(node.getAttribute('y1') || 0),
                                    x2 = parseFloat(node.getAttribute('x2') || 0),
                                    y2 = parseFloat(node.getAttribute('y2') || 0);

                                var subX = Math.min(x1, x2) - options.x,
                                    subY = Math.min(y1, y2) - options.y;

                                node.setAttribute('x1', x1 - subX);
                                node.setAttribute('y1', y1 - subY);
                                node.setAttribute('x2', x2 - subX);
                                node.setAttribute('y2', y2 - subY);
                                node.setAttribute('transform-origin', [(x1 + x2) / 2, (y1 + y2) / 2].join(' '));
                                break;
                            }
                        case 'rect':
                        case 'foreignObject':
                            {
                                //x = parseFloat(node.getAttribute('x') || 0);
                                //y = parseFloat(node.getAttribute('y') || 0);
                                //w = parseFloat(node.getAttribute('width') || 0);
                                //h = parseFloat(node.getAttribute('height') || 0);

                                node.setAttribute('x', options.x);
                                node.setAttribute('y', options.y);
                                node.setAttribute('transform-origin', [options.x + options.w / 2, options.y + options.h / 2].join(' '));
                                break;
                            }
                        default:
                            {
                                $(node).css({
                                    left: options.x,
                                    top: options.y,
                                    right: 'auto',
                                    bottom: 'auto'
                                });
                                break;
                            }
                    }
                }
            }
        };

        if (typeof options === 'object') {
            this.set(options);
        }
        else {
            return this.get();
        }

        return this;
    };

    /*
     * return {
                x: minX,
                y: minY,
                w: maxX - minX,
                h: maxY - minY,
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
     */
    $.fn.svgNodeSize = function () {
        var nodes = $(this);
        var minX = 999999999, minY = 999999999, maxX = 0, maxY = 0;

        var nodeSize = function (node) {
            let x = 0, y = 0, w = 0, h = 0, maxX = 0, maxY = 0;

            var points = [], point_x = [], point_y = [];

            if (node) {
                switch (node.nodeName) {
                    case 'path':
                        {
                            points = JSON.parse(node.getAttribute('data-path') || '[]');

                            points.forEach(function (point) {
                                point_x.push(point[0]);
                                point_y.push(point[1]);
                            });

                            minX = Math.min.apply(null, point_x);
                            minY = Math.min.apply(null, point_y);
                            maxX = Math.max.apply(null, point_x);
                            maxY = Math.max.apply(null, point_y);

                            x = minX;
                            y = minY;
                            w = maxX - x;
                            h = maxY - y;
                            break;
                        }
                    case 'polygon':
                        {
                            //lấy danh sách tọa độ
                            points = node.getAttribute('points').split(',').map(function (point) { return point.split(' ').map(function (xy) { return parseFloat(xy); }); });

                            points.forEach(function (point) {
                                point_x.push(point[0]);
                                point_y.push(point[1]);
                            });

                            minX = Math.min.apply(null, point_x);
                            minY = Math.min.apply(null, point_y);
                            maxX = Math.max.apply(null, point_x);
                            maxY = Math.max.apply(null, point_y);

                            x = minX;
                            y = minY;
                            w = maxX - x;
                            h = maxY - y;
                            break;
                        }
                    case 'circle':
                        {
                            var cx = parseFloat(node.getAttribute('cx') || 0),
                                cy = parseFloat(node.getAttribute('cy') || 0),
                                r = parseFloat(node.getAttribute('r') || 0);

                            x = cx - r;
                            y = cy - r;
                            w = r * 2;
                            h = r * 2;
                            break;
                        }
                    case 'ellipse':
                        {
                            var ex = parseFloat(node.getAttribute('cx') || 0),
                                ey = parseFloat(node.getAttribute('cy') || 0),
                                rx = parseFloat(node.getAttribute('rx') || 0),
                                ry = parseFloat(node.getAttribute('ry') || 0);

                            x = ex - rx;
                            y = ey - ry;
                            w = rx * 2;
                            h = ry * 2;
                            break;
                        }
                    case 'line':
                        {
                            var x1 = parseFloat(node.getAttribute('x1') || 0),
                                y1 = parseFloat(node.getAttribute('y1') || 0),
                                x2 = parseFloat(node.getAttribute('x2') || 0),
                                y2 = parseFloat(node.getAttribute('y2') || 0);

                            minX = Math.min(x1, x2);
                            minY = Math.min(y1, y2);
                            maxX = Math.max(x1, x2);
                            maxY = Math.max(y1, y2);

                            x = minX;
                            y = minY;
                            w = maxX - x;
                            h = maxY - y;
                            break;
                        }
                    case 'rect':
                    case 'foreignObject':
                        {
                            x = parseFloat(node.getAttribute('x') || 0);
                            y = parseFloat(node.getAttribute('y') || 0);
                            w = parseFloat(node.getAttribute('width') || 0);
                            h = parseFloat(node.getAttribute('height') || 0);
                            break;
                        }
                    default:
                        {
                            x = $(node).offset().left;
                            x = $(node).offset().top;
                            w = $(node).width();
                            h = $(node).height();
                            break;
                        }
                }
            }

            return {
                x: x,
                y: y,
                w: w,
                h: h,
                minX: x,
                minY: y,
                maxX: x + w,
                maxY: y + h
            };
        };

        if (nodes.length === 1) {
            return nodeSize(nodes[0]);
        }
        else {
            nodes.each(function (idx, node) {
                var size = nodeSize(node);

                minX = Math.min(minX, size.minX);
                minY = Math.min(minY, size.minY);
                maxX = Math.max(maxX, size.maxX);
                maxY = Math.max(maxY, size.maxY);
            });

            return {
                x: minX,
                y: minY,
                w: maxX - minX,
                h: maxY - minY,
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
        }
    };

    /*
     * return {
            //theo mỗi nodeName mà có dữ liêu trả về khác nhau
            ;}
     */
    $.fn.svgNodeCurrentStatus = function () {
        var node = $(this)[0],
            res = {};

        if (node) {
            res = {
                id: node.getAttribute('id'),
                nodeName: node.nodeName,
                transform: node.getAttribute('transform') || '',
                transformOrigin: node.getAttribute('transform-origin') || ''
            };

            switch (node.nodeName) {
                case 'polygon':
                    {
                        res.ratios = node.getAttribute('ratios');
                        res.points = node.getAttribute('points');
                        res.lineWidth = node.getAttribute('stroke-width') || 0;
                        res.lineColor = node.getAttribute('stroke') || '';
                        res.fillColor = node.getAttribute('fill') || '';
                        break;
                    }
                case 'circle':
                    {
                        res.cx = node.getAttribute('cx');
                        res.cy = node.getAttribute('cy');
                        res.r = node.getAttribute('r');
                        res.lineWidth = node.getAttribute('stroke-width') || 0;
                        res.lineColor = node.getAttribute('stroke') || '';
                        res.fillColor = node.getAttribute('fill') || '';
                        break;
                    }
                case 'ellipse':
                    {
                        res.cx = node.getAttribute('cx');
                        res.cy = node.getAttribute('cy');
                        res.rx = node.getAttribute('rx');
                        res.ry = node.getAttribute('ry');
                        res.lineWidth = node.getAttribute('stroke-width') || 0;
                        res.lineColor = node.getAttribute('stroke') || '';
                        res.fillColor = node.getAttribute('fill') || '';
                        break;
                    }
                case 'line':
                    {
                        res.x1 = node.getAttribute('x1');
                        res.y1 = node.getAttribute('y1');
                        res.x2 = node.getAttribute('x2');
                        res.y2 = node.getAttribute('y2');
                        res.lineWidth = node.getAttribute('stroke-width') || 0;
                        res.lineColor = node.getAttribute('stroke') || '';
                        res.fillColor = node.getAttribute('fill') || '';
                        break;
                    }
                case 'rect':
                    {
                        res.x = node.getAttribute('x');
                        res.y = node.getAttribute('y');
                        res.w = node.getAttribute('width');
                        res.h = node.getAttribute('height');
                        res.lineWidth = node.getAttribute('stroke-width') || 0;
                        res.lineColor = node.getAttribute('stroke') || '';
                        res.fillColor = node.getAttribute('fill') || '';
                        break;
                    }
                case 'foreignObject':
                    {
                        res.x = node.getAttribute('x');
                        res.y = node.getAttribute('y');
                        res.w = node.getAttribute('width');
                        res.h = node.getAttribute('height');

                        if ($(node).find('.svg-container').length) {
                            res.lineWidth = parseFloat($(node).find('.svg-container').css('border-width')) || 0;
                            res.lineColor = $(node).find('.svg-container').css('border-color') || '';
                            res.fillColor = $(node).find('.svg-container').css('background-color') || '';
                        }

                        if ($(node).find('.svg-editor-content').length) {
                            res.dataStyle = $(node).find('.svg-editor-content').attr('data-style') || '';
                            res.htmlContent = $(node).find('.svg-editor-content').html();

                            //
                            if (res.htmlContent) {
                                var matchContents = res.htmlContent.match(/\{[a-zA-Z0-9_]+\}/gm);
                                if (matchContents) {
                                    res.type = 'text-variable';
                                    res.source = { keywords: matchContents };
                                }
                            }
                        }
                        break;
                    }
                default:
                    {
                        res.x = $(node).offset().left;
                        res.y = $(node).offset().top;
                        res.w = $(node).width();
                        res.h = $(node).height();
                        break;
                    }
            }
        }

        return res;
    };

})(jQuery);
