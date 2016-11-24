// config requirejs
requirejs.config({
  urlArgs: "bust=" + Math.random(),
  baseUrl: 'js/app',
  paths:   {
    lib:      '../../../../js/lib',
    json:     '../../../../json',
    text:     '../../../../js/lib/require/text',
    loadjson: '../../../../js/lib/require/json'
  }
});

// main function
requirejs(['loadjson!json/config.json', 'app'],
  function (CONFIG, App)
  {
    var app    = new App();
    var canvas = app.init(CONFIG.size);
    document.body.appendChild(canvas);
  }
);