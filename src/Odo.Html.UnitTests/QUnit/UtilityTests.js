$(function () {

    function _testComparer(x, y) {
        return x - y;
    };

    module("mergepass tests");

    test("mergepass is installed", function () {
        ok(odo && odo.mergepass, "odo and odo.mergepass symbols should be defined");
    });

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
});  