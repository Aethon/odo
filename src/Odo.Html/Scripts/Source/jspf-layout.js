// dependencies:
//      jQuery

var jspf = jspf || {};

(function($) {

    var defaultLayout = {
        width: -1,
        height: -1 //,
        //margin: [ 0, 0, 0, 0 ],
        //padding: [ 0, 0, 0, 0],
        //halign: 'left' | 'right' | 'center' | 'stretch',
        //valign: 'top' | 'bottom' | 'middle' | 'stretch'
    };

    var defaultMeasurement = {
        width: 0,
        height: 0
    };

    var defaultArrangement = {
        width: 0,
        height: 0,
        top: 0,
        left: 0
    };
    
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

    var Control = function() {};
    var PrivateControlInterface = function() {};

    // this must be passed to Control._pvt to get the private interface
    var _privateKey = new Object();

    // recursively lays out a top level control within...
    jspf.layOutControl = function(control, div) {
        var c, $div, pvt;

        if (!jspf.is(control, "Control")) {
            throw "control is not valid for layout";
        }
        if (!div || !div instanceof HtmlDivElement) {
            throw "div is not a div element";
        }
        $div = $(div);
        $div.css('padding', '0px');

        c = $.extend({}, _defaultConstraints);
        c.maxWidth = $div.innerWidth(); // Potential bug in jQuery here on FF
        c.maxHeight = $div.innerHeight(); // ditto

        pvt = control._pvt(_privateKey);
        pvt.measure(c);
        pvt.arrange({ width: control.measuredWidth(), height: control.measuredHeight(), top: 0, left: 0 });
    };

    // determines if [object] is a jspf Control of [typename] type
    jspf.is = function(object, typename) {
        return (object && object instanceof Control && object.is(typename));
    };

    // creates a basic jspf Control (no real value, directly; used by derived types)
    jspf.createControl = function(layout) {
        var _control = jspf.create(new Control());
    
        var _layout = $.extend($.extend({}, defaultLayout), layout || {});
        var _measurement = $.extend({}, defaultMeasurement);
        var _arrangement = $.extend({}, defaultArrangement);

        var _parent = null;
        var _pvt = jspf.create(new PrivateControlInterface());

        _pvt.setParent = function(parent) {
            _parent = parent;
        }

        _pvt.measure = function(constraints) {
            _measurement.width = _layout.width;
            _measurement.height = _layout.height;
        };

        _pvt.arrange = function(arrangement) {
            _arrangement = arrangement;
        };

        _control.is = function(typename) {
            return typename === "Control";
        }

        _control.width = function(width) {
            if (arguments.length == 0) {
                return _layout.width;
            }
            _layout.width = width;
            return _control;
        };

        _control.height = function(height) {
            if (arguments.length == 0) {
                return _layout.height;
            }
            _layout.height = height;
            return _control;
        };

        _control.measuredWidth = function() {
            return _measurement.width;
        };

        _control.measuredHeight = function() {
            return _measurement.height;
        };

        _control.arrangedWidth = function() {
            return _arrangement.width;
        };

        _control.arrangedHeight = function() {
            return _arrangement.height;
        };

        _control.parent = function() {
            return _parent;
        };

        _control._pvt = function(pk) {
            if (!pk || pk !== _privateKey) {
                throw "must include the private key to acquire the private interface"; 
            }
            return _pvt;    
        };

        return _control;
    };

    // creates a jspf DomControl
    jspf.createDomControl = function(layout) {
        var _super = jspf.createControl(layout);
        var _control = jspf.create(_super);

        var pvt = _super._pvt(_privateKey);

        return _control;
    };

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

}(jQuery));

