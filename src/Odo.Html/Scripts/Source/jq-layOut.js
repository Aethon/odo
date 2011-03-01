
$.fn.layOut = function (arg) {
    if (arg) {
        this.data("layOut", arg);
        return this;
    }

    return this.data("layOut");
};

odo.html.applyLayout = function ($element) {
    var layOut = $element.layOut();
    if (layOut)
        layOut.apply($element);
    $element.children().each(function () { odo.html.applyLayout($(this)); });
};