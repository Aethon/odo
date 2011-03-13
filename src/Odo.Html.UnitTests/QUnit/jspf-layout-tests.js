$(function () {

    function checkControlProperties(control, expected) {
        var expectedPropValue;
        for (prop in expected) {
            if (expected.hasOwnProperty(prop)) {
                expectedPropValue = expected[prop];
                equals(control[prop], expectedPropValue, "should have " + prop + " set to " + expectedPropValue);
            }
        }
    }

    //------------------------------------------------------------------------
    module("Jspf-layout tests");
    //------------------------------------------------------------------------

    test("Jspf is installed", function () {
        ok(Jspf, "Jspf should be defined");
    });


    //------------------------------------------------------------------------
    module("Jspf-layout control tests");
    //------------------------------------------------------------------------

    test("Jspf.createControl succeeds", function () {
        var c = new Jspf.Control();
        ok(c, "should return an object");
        checkControlProperties(c, {});
    });

    test("Control.parent() succeeds and is null", function () {
        var c = new Jspf.Control();

        ok(c.parent() === null, "should be null");
    });


    //------------------------------------------------------------------------
    module("Jspf-layout Region.layOutControl tests");
    //------------------------------------------------------------------------

    test("Region.layOut succeeds with no root", function () {
        $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);

        var r = new Jspf.Region();
        r.host = $host[0];

        r.layOut();
    });

    test("Region.layOut succeeds with exact space available", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);

        var r = new Jspf.Region();
        r.host = $host[0];

        var layout = { width: 20, height: 20, horizontalAlignment: 'left', verticalAlignment: 'top' };
        var c = new Jspf.Control();
        c.get_horizontal().length = 20;
        c.get_vertical().length = 20;
        c.get_horizontal().alignment = Jspf.AxisAlignment.near;
        c.get_vertical().alignment = Jspf.AxisAlignment.near;

        r.root = c;

        r.layOut();

        equals(c.MeasuredSize.Width, 20);
        equals(c.MeasuredSize.Height, 20);
        equals(c.VerticalArrangement.Length, 20);
        equals(c.HorizontalArrangement.Length, 20);
        equals(c.VerticalArrangement.Position, 0);
        equals(c.HorizontalArrangement.Position, 0);
    });

    test("Region.layOut clips width", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 30, height: 10, horizontalAlignment: 'left', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredWidth: 30, _arrangedWidth: 20 });
    });

    test("Region.layOut does not clip minWidth", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 30, minWidth: 25, height: 10, horizontalAlignment: 'left', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredWidth: 30, _arrangedWidth: 25 });
    });

    test("Region.layOut stretches width", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, height: 10, horizontalAlignment: 'stretch', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredWidth: 10, _arrangedWidth: 20 });
    });

    test("Region.layOut stretches width, respects maxWidth", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, maxWidth: 15, height: 10, horizontalAlignment: 'stretch', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredWidth: 10, _arrangedWidth: 15 });
    });

    test("Region.layOut clips height", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, height: 30, horizontalAlignment: 'left', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredHeight: 30, _arrangedHeight: 20 });
    });

    test("Region.layOut does not clip minHeight", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, minHeight: 25, height: 30, horizontalAlignment: 'left', verticalAlignment: 'top' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredHeight: 30, _arrangedHeight: 25 });
    });

    test("Region.layOut stretches height", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, height: 10, horizontalAlignment: 'stretch', verticalAlignment: 'stretch' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredHeight: 10, _arrangedHeight: 20 });
    });

    test("Region.layOut stretches width, respects maxHeight", function () {
        var $host = $("<div style='width: 20px; height: 20px'>");
        $("#qunit-fixture").append($host);
        var r = Jspf.createRegion();
        r.host = $host[0];
        var layout = { width: 10, maxHeight: 15, height: 10, horizontalAlignment: 'stretch', verticalAlignment: 'stretch' };
        var c = Jspf.createControl(layout);
        r.root = c;

        r.layOut();

        checkControlProperties(c, { _measuredHeight: 10, _arrangedHeight: 15 });
    });

    /*
    //------------------------------------------------------------------------
    module("Jspf-layout container tests");
    //------------------------------------------------------------------------

    test("Jspf.createContainer with no parameters succeeds", function () {
    var c = Jspf.createContainer();
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createContainer with empty layout succeeds", function () {
    var c = Jspf.createContainer({});
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createContainer with layout succeeds", function () {
    var layout = { width: 10, height: 20 };
    var c = Jspf.createContainer(layout);

    ok(c, "should return an object");
    checkControlLayout(c, layout);
    });

    test("Container.children succeeds and is empty", function () {
    var c = Jspf.createContainer({}).children();
    equals(c.length, 0);
    });

    test("Container.addChild with non Jspf object fails", function () {
    var c = Jspf.createContainer({});
    raises(function () { c.addChild({}); }, "should throw an exception");
    });

    test("Container.addChild with Jspf control succeeds", function () {
    var c = Jspf.createContainer({});
    var ch = Jspf.createControl();
    c.addChild(ch);
    equals(c.children().length, 1, "should have one child");
    equals(c.children()[0], ch, "should contain the original child");
    equals(ch.parent(), c, "should have parent set to the container");
    });


    //------------------------------------------------------------------------
    module("Jspf-layout GridLayout tests");
    //------------------------------------------------------------------------

    test("Jspf.createGridLayout with no parameters succeeds", function () {
    var c = Jspf.createGridLayout();
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createGridLayout with empty layout succeeds", function () {
    var c = Jspf.createGridLayout({});
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createGridLayout with layout succeeds", function () {
    var layout = { width: 10, height: 20 };
    var c = Jspf.createGridLayout(layout);

    ok(c, "should return an object");
    checkControlLayout(c, layout);
    });


    //------------------------------------------------------------------------
    module("Jspf-layout StackLayout tests");
    //------------------------------------------------------------------------

    test("Jspf.createStackLayout with no parameters succeeds", function () {
    var c = Jspf.createStackLayout();
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createStackLayout with empty layout succeeds", function () {
    var c = Jspf.createStackLayout({});
    ok(c, "should return an object");
    checkControlLayout(c, {});
    });

    test("Jspf.createStackLayout with layout succeeds", function () {
    var layout = { width: 10, height: 20 };
    var c = Jspf.createStackLayout(layout);

    ok(c, "should return an object");
    checkControlLayout(c, layout);
    });
    */
    /*
    test("mergepass handles empty arrays", function () {
    var calls = 0;
    var fn = function () { calls++; };
    odo.mergepass([], [], _testComparer, { match: fn, leftOnly: fn, rightOnly: fn });
    equal(0, calls, "fn should never be called for empty arrays");
    });

    var goodCall = function () { ok(true); };
    var badCall = function () { ok(false, "should not have made this call"); };

    test("mergepass calls fn for left only", function () {
    expect(1);
    odo.mergepass([1], [], _testComparer, { match: badCall, rightOnly: badCall, leftOnly: goodCall });
    });

    test("mergepass calls fn for right only", function () {
    expect(1);
    odo.mergepass([], [1], _testComparer, { match: badCall, rightOnly: goodCall, leftOnly: badCall });
    });

    test("mergepass calls fn for left/right match", function () {
    expect(1);
    odo.mergepass([1], [1], _testComparer, { match: goodCall, rightOnly: badCall, leftOnly: badCall });
    });

    test("mergepass calls fn for both unmatched", function () {
    expect(2);
    odo.mergepass([1], [2], _testComparer, { match: badCall, rightOnly: goodCall, leftOnly: goodCall });
    });

    test("mergepass adds left before", function () {
    var left = [1];
    odo.mergepass(left, [0], _testComparer, { match: badCall, rightOnly: function (l, r, li, ri, mod) { mod.addLeft(r); }, leftOnly: goodCall });
    ok(left.length == 2 && left[0] == 0 && left[1] == 1);
    });

    test("mergepass adds left after", function () {
    var left = [1];
    odo.mergepass(left, [2], _testComparer, { match: badCall, rightOnly: function (l, r, li, ri, mod) { mod.addLeft(r); } });
    ok(left.length == 2 && left[0] == 1 && left[1] == 2);
    });

    test("mergepass removes first left", function () {
    var left = [1, 2, 3];
    odo.mergepass(left, [1], _testComparer, { match: function (l, r, li, ri, mod) { mod.removeLeft(); }, rightOnly: badCall });
    ok(left.length == 2 && left[0] == 2 && left[1] == 3);
    });

    test("mergepass removes mid left", function () {
    var left = [1, 2, 3];
    odo.mergepass(left, [2], _testComparer, { match: function (l, r, li, ri, mod) { mod.removeLeft(); }, rightOnly: badCall });
    ok(left.length == 2 && left[0] == 1 && left[1] == 3);
    });

    test("mergepass removes last left", function () {
    var left = [1, 2, 3];
    odo.mergepass(left, [3], _testComparer, { match: function (l, r, li, ri, mod) { mod.removeLeft(); }, rightOnly: badCall });
    ok(left.length == 2 && left[0] == 1 && left[1] == 2);
    });

    test("mergepass adds right before", function () {
    var right = [1];
    odo.mergepass([0], right, _testComparer, { match: badCall, leftOnly: function (l, r, li, ri, mod) { mod.addRight(l); }, rightOnly: goodCall });
    ok(right.length == 2 && right[0] == 0 && right[1] == 1);
    });

    test("mergepass adds right after", function () {
    var right = [1];
    odo.mergepass([2], right, _testComparer, { match: badCall, leftOnly: function (l, r, li, ri, mod) { mod.addRight(l); } });
    ok(right.length == 2 && right[0] == 1 && right[1] == 2);
    });

    test("mergepass removes first right", function () {
    var right = [1, 2, 3];
    odo.mergepass([1], right, _testComparer, { match: function (l, r, li, ri, mod) { mod.removeRight(); }, leftOnly: badCall });
    ok(right.length == 2 && right[0] == 2 && right[1] == 3);
    });

    test("mergepass removes mid right", function () {
    var right = [1, 2, 3];
    odo.mergepass([2], right, _testComparer, { match: function (l, r, li, ri, mod) { mod.removeRight(); }, leftOnly: badCall });
    ok(right.length == 2 && right[0] == 1 && right[1] == 3);
    });

    test("mergepass removes last right", function () {
    var right = [1, 2, 3];
    odo.mergepass([3], right, _testComparer, { match: function (l, r, li, ri, mod) { mod.removeRight(); }, leftOnly: badCall });
    ok(right.length == 2 && right[0] == 1 && right[1] == 2);
    });
    */
});