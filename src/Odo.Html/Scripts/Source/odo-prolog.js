var odo = odo || {};

(function ($) {

    odo.html = odo.html || {};

    var _resources = {};

    odo.getResource = function(name) {
        return _resources[name];
    };