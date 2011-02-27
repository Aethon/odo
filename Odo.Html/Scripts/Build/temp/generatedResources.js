_resources['DivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberSelected"></span> selected</td><td></td><td><span data-bind="text: numberAvailable"></span> available</td></tr>\n' +
 '<tr><td rowspan="2"><ul local-id="selected" style="width: 200px; height: 250px" tabindex="0"></ul></td><td></td><td><input local-id="filterText" type="text" tabindex="0" /></td></tr>\n' +
 '<tr>\n' +
 '    <td>\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '    <td><ul local-id="available" style="width: 200px; height: 250px" tabindex="0"></ul></td>\n' +
 '</tr>\n' +
 '</table>\n' +
 '<select local-id="parallel-select" style="display:none" />\n' +
'';

_resources['ExpertSelectorTemplate_htm'] = '<div style="-khtml-user-select: none; -moz-user-select: none;">\n' +
 '<input local-id="expertText" type="text" value="" class="ui-text-box ui-corner-left" /><button local-id="dropButton" type="button">Select</button>\n' +
 '<div local-id=\'tradePanel\' class="ui-widget-content ui-corner-all" style=\'position: absolute; padding: 3px; z-index: 100\' tabindex="-1">\n' +
 '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberSelected"></span> selected</td><td></td><td><span data-bind="text: numberAvailable"></span> available</td></tr>\n' +
 '<tr><td rowspan="2"><ul local-id="selected" class="initial-focus" style="width: 200px; height: 250px" tabindex="0"></ul></td><td></td><td><div local-id="filterPlace"></div></td></tr>\n' +
 '<tr>\n' +
 '    <td>\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '    <td><ul local-id="available" style="width: 200px; height: 250px" tabindex="0"></ul></td>\n' +
 '</tr>\n' +
 '</table>\n' +
 '</div>\n' +
 '</div>\n' +
'';

_resources['FilteredReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"><select local-id="filterdrop" data-bind="options: _divaFilter.categories, optionsText: \'Name\', optionsValue: \'Code\'"></select></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block; width: 35px" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block; width: 35px" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '        <button style="display: block; visibility: hidden; width: 35px"></button>\n' +
 '        <button local-id="selectAll" type="button" style="display: block; width: 35px" data-bind="enable: canSelectAll, click: selectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\', secondary: \'ui-icon-triangle-1-e\' }, text: false }">Add all</button>\n' +
 '        <button local-id="unselectAll" type="button" style="display: block; width: 35px" data-bind="enable: canUnselectAll, click: unselectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\', secondary: \'ui-icon-triangle-1-w\' }, text: false }">Remove all</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['FilteredUniqueReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"><select local-id="filterdrop" data-bind="options: _divaFilter.categories, optionsText: \'Name\', optionsValue: \'Code\'"></select></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td><td rowspan="2" style="vertical-align: top">\n' +
 '    <button local-id="moveup" type="button" style="display: block" data-bind="enable: canArrangeUp, click: arrangeUp" data-button="{ icons: { primary: \'ui-icon-triangle-1-n\' }, text: false }">Move up</button>\n' +
 '    <button local-id="movedown" type="button" style="display: block" data-bind="enable: canArrangeDown, click: arrangeDown" data-button="{ icons: { primary: \'ui-icon-triangle-1-s\' }, text: false }">Move down</button>\n' +
 '    <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-close\' }, text: false }">Remove</button>\n' +
 '</td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['ReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><select local-id="parallel-select" multiple="multiple" style="display:none" /><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block; width: 35px" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block; width: 35px" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '        <button style="display: block; visibility: hidden; width: 35px"></button>\n' +
 '        <button local-id="selectAll" type="button" style="display: block; width: 35px" data-bind="enable: canSelectAll, click: selectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\', secondary: \'ui-icon-triangle-1-e\' }, text: false }">Add all</button>\n' +
 '        <button local-id="unselectAll" type="button" style="display: block; width: 35px" data-bind="enable: canUnselectAll, click: unselectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\', secondary: \'ui-icon-triangle-1-w\' }, text: false }">Remove all</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['ReverseDivaSelectorTemplate_htm_orig'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

