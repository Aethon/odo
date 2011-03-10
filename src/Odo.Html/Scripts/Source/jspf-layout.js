// dependencies:
//      jQuery

var jspf = jspf || {};

(function($) {

    if (!Number.MAX_INTEGER) {
        Number.MAX_INTEGER = Math.pow(2, 31) - 1;
    }

    var _defaultConstraints = {
        maxWidth: -1,
        maxHeight: -1
    };

    // creates a new object based on the given object
    jspf.create = function(proto) {
        var F = function() {};
        F.prototype = proto;
        return new F();
    };

    var Control = function(init) {
        // heirarchy
        this._parent = null;

        // layout
        this.width = 0;
        this.minWidth = -1;
        this.maxWidth = -1;
        this.horizontalAlignment = 'stretch';
        this.height = 0;
        this.minHeight = -1;
        this.maxHeight = -1;
        this.verticalAlignment = 'stretch';
        this.margin = { top: 0, left: 0, bottom: 0, right: 0 };
        this._measuredWidth = 0;
        this._measuredHeight = 0;
        this._arrangedWidth = 0;
        this._arrangedHeight = 0;
        this._top = 0;
        this._left = 0;

        // public methods
        this.is = function(typename) {
            return typename === "Control";
        };

        this.parent = function() {
            return this._parent;
        };

        this.setProperties = function(layout) {
            var type;
            for (var x in layout) {
                if (x.charAt(0) !== '_') {
                    type = typeof this[x];
                    if (type !== 'undefined' && type !== 'function') {
                        this[x] = layout[x];
                    }
                }
            }
        };

        // private layout methods
        this._measure = function(constraints) {
            this._measuredWidth = this._measureAxis(this.minWidth, this.maxWidth, this.width, this.horizontalAlignment === 'stretch', this.margin.left + this.margin.right, constraints.maxWidth);
            this._measuredHeight = this._measureAxis(this.minHeight, this.maxHeight, this.height, this.verticalAlignment === 'stretch', this.margin.top + this.margin.bottom, constraints.maxHeight);
        };

        this._arrange = function(top, left, width, height) {
            this._top = top;
            this._left = left;
            this._arrangedWidth = width;
            this._arrangedHeight = height;
        };

        this._measureAxis = function(min, max, target, stretch, totalMargin, available) {
            var result;

            if (!max || max < 0) {
                max = Number.MAX_INTEGER;
            }
            if (!min || min < 0) {
                min = 0;
            }

            if (stretch) {
                result = Math.min(available, max);
            } else {
                result = Math.min(available, target);
            }

            return Math.max(min, result - totalMargin);
        };

        this._arrangeAxis = function(min, max, target, align, lowMargin, highMargin, available) {
            var length = 0;
            var pos = 0;
            var totalNeeded = 0;

            if (!max || max < 0) {
                max = Number.MAX_INTEGER;
            }
            if (!min || min < 0) {
                min = 0;
            }

            if (align === 'stretch') {
                length = Math.min(available, max);
            } else {
                length = Math.min(available, target);
            }

            length = Math.max(min, length - lowMargin - highMargin);

            switch (align) {
                case 'left':
                case 'top':
                default:
                    pos = lowMargin;
                    break;
                case 'right':
                case 'bottom':
                    pos = available - highMargin - length;
                    break;
                case 'center':
                case 'stretch':
                    totalNeeded = highMargin + lowMargin + length;
                    if (totalNeeded !== available) {
                        pos = Math.floor((available - totalNeeded) / 2);
                    }
                    break;
            }

            return { pos: pos, length: length };
        };

        this.setProperties(init);
    };

    // determines if [object] is a jspf Control of [typename] type
    jspf.is = function(object, typename) {
        return (object && object instanceof Control && object.is(typename));
    };

    // creates a basic jspf Control (no real value, directly; used by derived types)
    jspf.createControl = function(init) {
        return jspf.create(new Control(init));
    };

    // creates a jspf Region
    jspf.createRegion = function(init) {
        var _super = jspf.createControl(init);
        var control = jspf.create(_super);

        control.root = null;
        control.host = null;

        // recursively lays out the region
        control.layOut = function() {
            var c, $div, pvt, root = this.root;

            if (!this.host || !this.host instanceof HTMLDivElement) {
                throw "host is not a div element";
            }
            $div = $(this.host);
            $div.css('padding', '0px');

            c = $.extend({}, _defaultConstraints);
            c.maxWidth = $div.innerWidth();
            c.maxHeight = $div.innerHeight();

            if (root && jspf.is(root, "Control")) {
                root._measure(c);
                var xaxis = this._arrangeAxis(root.minWidth, root.maxWidth, root._measuredWidth, root._horizontalAlignment, root.margin.left, root.margin.right, c.maxWidth);
                var yaxis = this._arrangeAxis(root.minHeight, root.maxHeight, root._measuredHeight, root._verticalAlignment, root.margin.top, root.margin.bottom, c.maxHeight);
                this.root._arrange(xaxis.pos, yaxis.pos, xaxis.length, yaxis.length);
            }
        };

        control._measure = function() {
            // do nothing; this control does not measure itself, instead it uses the host's dimensions

        };
        
        control._arrange = function() {
            // do nothing; this control has no physical representation.
        };

        return control;
    };

    // creates a jspf DomControl
    jspf.createDomControl = function(layout) {
        var _super = jspf.createControl(layout);
        var control = jspf.create(_super);

        control.dom = null;

        control._arrange = function(top, left, width, height) {
            _super._arrange.call(this, top, left, width, height);

            if (dom) {
                var $dom = $(dom);
                $dom.css({ position: 'absolute', left: left, top: top, width: width.toString() + 'px', height: height.toString() + 'px' });
            }
        };

        return control;
    };

    /*
    // creates a basic jspf Container (no real value, directly; used by derived types)
    jspf.createContainer = function(layout) {
        var _super = jspf.createControl(layout);
        var _control = jspf.create(_super);

        var _children = [];

        _control.is = function(typename) {
            if (typename === "Container") {
                return true;
            }
            return _super.is(typename);
        }

        _control.addChild = function(child) {
            if (!jspf.is(child, "Control"))
                throw "must be a jspf Control";
            _children.push(child);
            child._pvt(_privateKey).setParent(_control);
            return _control;
        };

        _control.children = function() {
            return $.merge([], _children);
        }

        return _control;
    };

    // creates a jspf GridLayout
    jspf.createGridLayout = function(layout) {
        var _super = jspf.createContainer(layout);
        var _control = jspf.create(_super);

        _control.is = function(typename) {
            if (typename === "GridLayout") {
                return true;
            }
            return _super.is(typename);
        }

        return _control;
    };

    // creates a jspf GridStackLayout
    jspf.createStackLayout = function(layout) {
        var _super = jspf.createContainer(layout);
        var _control = jspf.create(_super);

        _control.is = function(typename) {
            if (typename === "StackLayout") {
                return true;
            }
            return _super.is(typename);
        }

        return _control;
    };
    */
}(jQuery));
