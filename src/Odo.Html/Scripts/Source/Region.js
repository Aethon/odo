// apply a template to re/populate a region
odo.html.applyRegionTemplate = function ($region, template, vm) {

    $region.css({ visibility: 'visible' }).empty();
    // TODO: is there a good way to cleanup the tree we just removed

    $region.append(template(vm));

    setTimeout(function () {
        odo.html.applyLayout($region);
        $region.css({ visibility: 'visible' });
    }, 1);
};