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
            // normalize all inputs
            this.width = this.width || 0;
            this.minWidth = this.minWidth || 0;
            if (!this.maxWidth || this.maxWidth < 0) {
                this.maxWidth  = Number.MAX_INTEGER;
            }
            this.horizontalAlignment = this.horizontalAlignment || 'stretch';
            this.height = this.height || 0;
            this.minHeight = this.minHeight || 0;
            if (!this.maxHeight || this.maxHeight < 0) {
                this.maxHeight  = Number.MAX_INTEGER;
            }
            this.verticalAlignment = this.verticalAlignment || 'stretch';

            // default measurement
            this._measuredWidth = Math.min(this.maxWidth, Math.max(this.minWidth, this.width));
            this._measuredHeight = Math.min(this.maxHeight, Math.max(this.minHeight, this.height));
        };

        this._arrange = function(top, left, width, height) {
            this._top = top;
            this._left = left;
            this._arrangedWidth = width;
            this._arrangedHeight = height;
        };

        this._arrangeAxis = function(min, max, measured, align, lowMargin, highMargin, available) {
            var length = 0;
            var pos = 0;
            var totalNeeded = 0;

            if (align === 'stretch') {
                length = Math.min(available, max);
            } else {
                length = Math.min(available, measured);
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
            $div.css({ padding : '0px' });

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

            if (this.dom) {
                var $dom = $(this.dom);
                $dom.css({ position: 'absolute', left: left.toString() + 'px', top: top.toString() + 'px', width: width.toString() + 'px', height: height.toString() + 'px' });
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
