$(function () {

    function _testComparer(x, y) {
        return x - y;
    };

    module("selector tests");

    test("createSelector is installed", function () {
        ok(odo && odo.createSelector, "odo and odo.createSelector symbols should be defined");
    });

    test("createSelector returns an object", function () {
        var selector = odo.createSelector([], [], _testComparer);
        ok($.type(selector) == 'object', "result should be an object");
    });

    test("createSelector does not affect items parameter", function () {
        var items = [3, 2, 1];
        var selector = odo.createSelector(items, [], _testComparer);
        deepEqual(items, [3, 2, 1], "items parameter should not be affected");
    });

    test("createSelector does not affect selectedItems parameter", function () {
        var selected = [3, 2, 1];
        var selector = odo.createSelector([], selected, _testComparer);
        deepEqual(selected, [3, 2, 1], "selectedItems parameter should not be affected");
    });

    test("createSelector ignores invalid selectedItems", function () {
        var selector = odo.createSelector([1, 2, 3], [1, 2, 4], _testComparer);
        var items = selector.items();
        var selectedItems = selector.selectedItems();
        deepEqual(items, [1, 2, 3], "items not contain items that are were passed in as items");
        deepEqual(selectedItems, [1, 2], "selectedItems not contain items that are not in items");
    });

    test("selector sorts items", function () {
        var selector = odo.createSelector([3, 1, 2], [], _testComparer);
        var items = selector.items();
        deepEqual(items, [1, 2, 3], "items should be sorted during construction");
    });

    test("selector sorts selectedItems", function () {
        var selector = odo.createSelector([3, 1, 2], [2, 1, 3], _testComparer);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1, 2, 3], "selectedItems should be sorted during construction");
    });

    test("selector.select succeeds with empty array", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.select([]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1], "selectedItems should be unchanged");
    });

    test("selector.select succeeds with a single valid item", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.select([2]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1, 2], "selectedItems should include the new value");
    });

    test("selector.select succeeds with a single invalid item", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.select([4]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1], "selectedItems should be unchanged");
    });

    test("selector.select succeeds with multiple valid items", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.select([1, 3]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1, 3], "selectedItems should include the new values");
    });

    test("selector.unselect succeeds with empty array", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.unselect([]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1], "selectedItems should be unchanged");
    });

    test("selector.unselect succeeds with a single valid item", function () {
        var selector = odo.createSelector([1, 2, 3], [1, 2], _testComparer);
        selector.unselect([2]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1], "selectedItems should not include the unselected value");
    });

    test("selector.unselect succeeds with a single invalid item", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        selector.unselect([4]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [1], "selectedItems should be unchanged");
    });

    test("selector.unselect succeeds with multiple valid items", function () {
        var selector = odo.createSelector([1, 2, 3], [1, 2, 3], _testComparer);
        selector.unselect([1, 3]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [2], "selectedItems should not include the unselected values");
    });

    test("selector.unselect succeeds with multiple mixed-validity items", function () {
        var selector = odo.createSelector([1, 2, 3], [1, 2, 3], _testComparer);
        selector.unselect([1, 5, 9, 3]);
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [2], "selectedItems should not include the unselected values");
    });
            
    test("selector.clear removes all selectedItems", function () {
        var selector = odo.createSelector([3, 1, 2], [2, 1, 3], _testComparer);
        selector.clear();
        var selectedItems = selector.selectedItems();
        deepEqual(selectedItems, [], "selectedItems should be empty after clear");
    });

    test("selector.clear does not affect items", function () {
        var selector = odo.createSelector([1, 2, 3], [1, 2, 3], _testComparer);
        selector.clear();
        var items = selector.items();
        deepEqual(items, [1, 2, 3], "selectedItems should be empty after clear");
    });

    test("selector.isSelected returns true for selected item", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        var isSelected = selector.isSelected(1);
        ok(isSelected, "isSelected should be truthy");
    });

    test("selector.isSelected returns false for selected item", function () {
        var selector = odo.createSelector([1, 2, 3], [1], _testComparer);
        var isSelected = selector.isSelected(2);
        ok(!isSelected, "isSelected should be falsy");
    });
});  