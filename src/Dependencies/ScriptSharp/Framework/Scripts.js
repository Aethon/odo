(function() {
  // The script registry of scripts that can be loaded.
  // Each script item is an object with a name, releaseUrl, debugUrl and an optional executionDependencies array
  // containing dependency script names.

  var scripts = [
    // Example:
    // { name: 'Shared', releaseUrl: '/Content/Scripts/Shared.js',
    //                   debugUrl: '/Content/Scripts/Shared.debug.js' },
    // { name: 'MyScriptLib', executionDependencies: ['Shared'],
    //                        releaseUrl: '/Content/Scripts/MyScriptLibrary.js',
    //                        debugUrl: '/Content/Scripts/MyScriptLibrary.debug.js' }
  ];
  for (var i = scripts.length - 1; i >= 0; i--) {
    ss.loader.defineScript(scripts[i]);
  }
})();
