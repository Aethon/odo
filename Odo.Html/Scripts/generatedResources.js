_resources['ExpertSelectorTemplate_htm'] = '<input id="%{id}_text" type="text" value="" class="ui-text-box ui-corner-left" /><button id="%{id}_drop" >Select</button>\n' +
 '<div id=\'%{id}_panel\' class="ui-widget-content ui-corner-all" style=\'position: absolute; padding: 3px; z-index: 100\' tabindex="-1">\n' +
 '<table>\n' +
 '<tr><td><span data-bind="text: numberSelected"></span> selected</td><td></td><td><span data-bind="text: numberAvailable"></span> available</td></tr>\n' +
 '<tr><td rowspan="2"><ul id="%{id}_selected" style="width: 200px; height: 250px" tabindex="0"></ul></td><td></td><td><input id="%{id}_filter" type="text" style="width: 200px;" tabindex="0" /></td></tr>\n' +
 '<tr>\n' +
 '    <td>\n' +
 '        <button id="%{id}_select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused ">Add</button>\n' +
 '        <button id="%{id}_unselect" style="display: block" data-bind="enable: canUnselect, click: unselectFocused">Remove</button>\n' +
 '    </td>\n' +
 '    <td><ul id="unselList" style="width: 200px; height: 250px" tabindex="0"></ul></td>\n' +
 '</tr>\n' +
 '</table>\n' +
 '</div>\n' +
'';

