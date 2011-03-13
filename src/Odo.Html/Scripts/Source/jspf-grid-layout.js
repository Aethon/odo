// dependencies:
//      jQuery

(function ($) {

    // creates a jspf GridLayout
    jspf.createGridLayout = function (init) {
        var control = jspf.create(jspf.createControl());

        control._children = [];

        control.columnDefs = [];
        control.rowDefs = [];

        control.addChild = function (child) {
            // todo notify of layout need
        };

        control.removeChild = function (child) {
            // todo notify of layout need
        };

        control._measure = function (constraints) {
            var child;

            this.uber()._measure.call(constraints);

            // if the width and height were both specified or alignment is set to stretch in both axes, then we do not need to measure children yet.
            var needToMeasureCols = this.width < 0 && this.horizontalAlignment !== 'stretch';
            var needToMeasureRows = this.height < 0 && this.verticalAlignment !== 'stretch';

            if (needToMeasureCols) {

            }

            if (needToMeasureCols || needToMeasureRows) {
                
                var rows = [];
                for (var i = this._rowDefs.length - 1; i > 0; i--) {
                    var def = this._rowDefs[i];
                    var rowInfo = { def: def };
                    if (
                    rows.unshift(rowInfo);
                }

                var cols = [];

                for (var i = _children.length - 1; i > 0; i--) {
                    child = _children[i];
                    child._measure(constraints);
                }
            }
        };

        control._arrange = function (top, left, width, height) {
        };

        // recursively lays out the grid
        control.layOut = function () {
            var c, $div, pvt, root = this.root;

            if (!this.host || !this.host instanceof HTMLDivElement) {
                throw "host is not a div element";
            }
            $div = $(this.host);
            $div.css({ padding: '0px' });

            c = $.extend({}, _defaultConstraints);
            c.maxWidth = $div.innerWidth();
            c.maxHeight = $div.innerHeight();

            if (root && jspf.is(root, "Control")) {
                root._measure(c);
                var xaxis = this._arrangeAxis(root.minWidth, root.maxWidth, root._measuredWidth, root.horizontalAlignment, root.margin.left, root.margin.right, c.maxWidth);
                var yaxis = this._arrangeAxis(root.minHeight, root.maxHeight, root._measuredHeight, root.verticalAlignment, root.margin.top, root.margin.bottom, c.maxHeight);
                this.root._arrange(yaxis.pos, xaxis.pos, xaxis.length, yaxis.length);
            }
        };

        control._measure = function () {
            // do nothing; this control does not measure itself, instead it uses the host's dimensions

        };

        control._arrange = function () {
            // do nothing; this control has no physical representation.
        };

        return control.setProperties(init);
    };
} (jQuery));
