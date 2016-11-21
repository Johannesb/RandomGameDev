// config requirejs
requirejs.config({
  urlArgs: "bust=" + Math.random(),
  baseUrl: 'js',
  paths:   {
    // paths to app + json + lib folders
    app:  '../app',
    json: '../json',

    // dependency to load json files with requirejs
    text:     'lib/require/text',
    loadjson: 'lib/require/json'
  }
});

// main function
requirejs(['loadjson!json/app.json'],
  function (App)
  {
    App.paths.forEach(function (path)
    {
      var a       = document.createElement('a');
      a.innerHTML = path;
      a.href      = 'app/' + path;
      document.body.appendChild(a);
    });
  }
);