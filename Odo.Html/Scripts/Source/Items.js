
// odo itemsSources are ko observable arrays extended with sorting information
odo.itemsSource = function (initialItems, compare) {
    var result = ko.observableArray(initialItems);
    if (compare) {
        result.odoCompare = compare;
    }
    return result;
};

// odo liveTransforms are item sources that actively present a transformed (sorted and filtered) view of
//  a source observable
odo.itemsView = function (sourceObservables, compare, transform) {
    var result = odo.itemsSource([], compare);
    var update = function () {
        var newItems = [];
        $.each(sourceObservables, function () {
            if (compare) {
                var ni = $.merge([], this());
                ni.sort(compare);
                newItems.push(ni);
            } else {
                newItems.push(this());
            }
        });
        if (transform) {
            newItems = transform(newItems);
        }
        result(newItems);
    };
    $.each(sourceObservables, function () { this.subscribe(update); });
    update();
    return result;
};

// This is a somewhat esoteric transform that exists to support a delivery vs being
// necessarily the best of ideas.
odo.categorizedItemsView = function (itemsObservable, categoriesObservable, categoryObservable, getCategoryId, getItemCategories, compareCategories, compareItems) {
    var result = {};
    result.categories = odo.itemsSource([], compareCategories);
    result.items = odo.itemsSource([], compareItems);

    var _all = { items: [] };

    var updateCategories = function () {
        var categories = categoriesObservable();
        var counts = {};
        _all = { category: { Name: 'All', Code: '' }, items: [] };

        $.each(categories, function (i,e) {
            counts[getCategoryId(e)] = { category: this, items: [] };
        });

        // stoopid NxN pass to perform the filter/group
        $.each(itemsObservable(), function () {
            var item = this;
            var found = false;
            $.each(getItemCategories(this)(), function (i,e) {
                var itemCategoryId = getCategoryId(e);
                $.each(categories, function (i,e) {
                    if (itemCategoryId === getCategoryId(e)) {
                        counts[itemCategoryId].items.push(item);
                        found = true;
                    }
                });
            });
            if (found) {
            _all.items.push(item);
            }
        });

        var newCategories = [];
        $.each(counts, function () {
            if (this.items.length > 0 && this.category.Name !== "All") {
                this.Name = this.category.Name + ' (' + this.items.length + ')';
                this.Code = this.category.Code;
                this.items.sort(compareItems);
                newCategories.push(this);
            }
        });
        _all.items.sort(compareItems);
        _all.Name = _all.category.Name + ' (' + _all.items.length + ')';
        _all.Code = _all.category.Code;

        newCategories.sort(compareCategories);
        newCategories.unshift(_all);
        result.categories(newCategories);
    };

    var updateItems = function () {
        var newCategory = categoryObservable();
        if (!newCategory || !newCategory.length)
            newCategory = _all;
        else
            newCategory = newCategory[0];
        result.items(newCategory.items);
    };

    $.each([itemsObservable, categoriesObservable], function () { this.subscribe(updateCategories); });
    $.each([result.categories, categoryObservable], function () { this.subscribe(updateItems); });

    updateCategories();

    return result;
};