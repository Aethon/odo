odo.html.createGroup = function (svm, options) {
    options = options || {};

    $group = $("<div></div>");
    if (options.style) {
        $group.addClass(options.style(svm));
    }
    $.each(options.memberTemplates || [], function () { $group.append(this(svm)); });
    return $group;
};