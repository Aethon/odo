(function () {

    // extend the odo module with the html methods
    odo.html = odo.html || {};

    var _nextStateId = 0;
    var _frameStates = [];

    function registerFrameState(changefn) {
        var id = _nextStateId++;
        var fs = ko.observable(null);
        fs.subscribe(changefn);
        fs.subscribe(_frameStateChanged);
        _frameStates[id] = fs;
        return id;
    }

    function applyFrameState() {
    }

    function _frameStateChanged() {
        var fragment = '';
        $.each(_frameStates, function (i, e) { var v = e(); if (e != null) fragment += i + ':' + e() + '|'; });
        if (fragment.length() > 0) {
            window.location = "#" + fragment;
        }
    }

    function _mergeOne(left, leftIndex, sortedRight, rightIndex, compare, fn) {
        var found = false;
        while (rightIndex < sortedRight.length) {
            var right = sortedRight[rightIndex];
            var comp = compare(left, right);
            if (comp < 0) {
                break;
            } else if (comp == 0) {
                fn(left, right, leftIndex, rightIndex);
                rightIndex++;
                found = true;
                break;
            } else {
                fn(null, right, leftIndex, rightIndex);
                rightIndex++;
            }
        }
        if (!found)
            fn(left, null, leftIndex, rightIndex);

        return rightIndex;
    }

    odo.mergepass = function (sortedLeft, sortedRight, compare, fn) {
        var rightIndex = 0;
        $.each(sortedLeft, function (i, left) { rightIndex = _mergeOne(left, i, sortedRight, rightIndex, compare, fn); });
        while (rightIndex < sortedRight.length) {
            fn(null, sortedRight[rightIndex], sortedLeft.length, rightIndex);
            rightIndex++;
        }
    }

    odo.html.createSelectorControl = function ($element, items, template) {
        // attach a selector control to the specified element
        var selectorControl = {};
        $element.data('odo.html.selectorControl', selectorControl);

        $element.css({ border: '1px solid blue', margin: '10px', padding: '10px', display: 'inline-block' });
        var $items = $($.render(items, '<div class="nimble_selector_item"><div class="select_content">' + template + '</div></div>'));
        $items.appendTo($element);

        $element.click(function (e) {
            var targetItem = $(e.target).closest('.nimble_selector_item');
            if ($(targetItem).hasClass('nimble_selector_item'))
                $(targetItem).find('.select_area').toggleClass('selected');
        })
        .focus(function (e) { $element.css('background', 'yellow'); })
        .blur(function () { $element.css('background', 'inherit'); });
    }
})();
