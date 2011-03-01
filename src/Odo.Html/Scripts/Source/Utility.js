// left and right must be sorted before calling this method
odo.mergepass = function(left, right, compare, actions) {
    var leftIndex = 0;
    var rightIndex = 0;
    var leftItem;
    var rightItem;
    var modified = false;

    var mod = {
        removeLeft: function() {
            if (leftItem) {
                left.splice(leftIndex, 1);
                leftIndex--;
                leftItem = null;
                modified = true;
            }
        },
        removeRight: function() {
            if (rightItem) {
                right.splice(rightIndex, 1);
                rightIndex--;
                rightItem = null;
                modified = true;
            }
        },
        addLeft: function(newItem) {
            if (!leftItem) {
                left.splice(leftIndex, 0, newItem);
                leftIndex++;
                leftItem = newItem;
                modified = true;
            }
        },
        addRight: function(newItem) {
            if (!rightItem) {
                right.splice(rightIndex, 0, newItem);
                rightIndex++;
                rightItem = newItem;
                modified = true;
            }
        }
    }

    for (; leftIndex < left.length; leftIndex++) {
        var found = false;
        while (rightIndex < right.length) {
            leftItem = left[leftIndex];
            rightItem = right[rightIndex];
            var comp = compare(leftItem, rightItem);

            if (comp < 0) {
                break;
            } else if (comp == 0) {
                if (actions.match) {
                    actions.match(leftItem, rightItem, leftIndex, rightIndex, mod);
                }
                rightIndex++;
                found = true;
                break;
            } else {
                if (actions.rightOnly) {
                    leftItem = null;
                    actions.rightOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
                }
                rightIndex++;
            }
        }
        if ((!found) && actions.leftOnly) {
            leftItem = left[leftIndex];
            rightItem = null;
            actions.leftOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
        }
    }

    if (actions.rightOnly) {
        while (rightIndex < right.length) {
            leftItem = null;
            rightItem = right[rightIndex];
            actions.rightOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
            rightIndex++;
        }
    }

    return modified;
}

odo.MERGE_ACTIONS = {};

odo.MERGE_ACTIONS.UNION_TO_LEFT = {
    rightOnly: function(l,r,li,ri,mod) { mod.addLeft(r); }
};

odo.MERGE_ACTIONS.INTERSECTION_TO_LEFT = {
    leftOnly: function(l,r,li,ri,mod) { mod.removeLeft(); }
};

odo.MERGE_ACTIONS.NOT_RIGHT_TO_LEFT = {
    match: function(l,r,li,ri,mod) { mod.removeLeft(); }
};

odo.MERGE_ACTIONS.XOR_RIGHT_TO_LEFT = {
    match: function(l,r,li,ri,mod) { mod.removeLeft(); },
    rightOnly: function(l,r,li,ri,mod) { mod.addLeft(r); }
};

odo.html.createSelectorControl = function ($element, items, template) {
    // attach a selector control to the specified element
    var selectorControl = {};
    $element.data('odo.html.selectorControl', selectorControl);

    $element.css({ border: '1px solid blue', margin: '10px', padding: '10px', display: 'inline-block' });
    var $items = $.tmpl('<div class="nimble_selector_item"><div class="select_content">' + template + '</div></div>', items);
    $items.appendTo($element);

    $element.click(function (e) {
        var targetItem = $(e.target).closest('.nimble_selector_item');
        if ($(targetItem).hasClass('nimble_selector_item'))
            $(targetItem).find('.select_area').toggleClass('selected');
    })
    .focus(function (e) { $element.css('background', 'yellow'); })
    .blur(function () { $element.css('background', 'inherit'); });
}


odo.html.attachButtonToElement = function ($button, $element) {
    $element.css('margin-right', '-1px');
    $button.layOut(function () {
        var size = $element.outerHeight() + "px";
        $button.css({ width: size, height: size, 'margin-top': $element.css('margin-top') });
    });
}

odo.DefaultSort = function (l, r) {
    return 0; // TODO
};