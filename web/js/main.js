// config requirejs
requirejs.config({
  urlArgs: "bust=" + Math.random(),
  baseUrl: 'js',

  paths: {
    // paths to app + json + lib folders
    app:  '../app',
    json: '../json',

    tdge: 'lib/tdge',

    // dependency to load json files with requirejs
    text:     'lib/require/text',
    loadjson: 'lib/require/json'
  }
});

// main function
requirejs(['loadjson!json/app.json', 'tdge/tdge', 'lib/vector2d'],
  function (App, TDGE, Vector2D)
  {
    /*App.paths.forEach(function (path)
    {
      var a       = document.createElement('a');
      a.innerHTML = path;
      a.href      = 'app/' + path;
      document.body.appendChild(a);
    });*/

    var game = new TDGE.Game(800, 600, TDGE.Renderer.Canvas, {backgroundColor: '#dfdfdf'});

    var obj = TDGE.Object.create(TDGE.Object.Rectangle, {
      position:     new Vector2D([100, 75]),
      anchor:       {x: .5, y: .5},
      speed:        new Vector2D([150, 0]),
      acceleration: new Vector2D([0, 100]),
      width:  60,
      height: 35,
      color:  '#ff0000'
    });
    game.appendChild(obj);

    document.body.appendChild(game.renderer.view);

    game.start();
  }
);