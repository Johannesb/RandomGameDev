define(
  ['lib/pixi', 'lib/func', 'lib/gameengine/gameengine', 'room_game'],
  function (PIXI, _, GameEngine, room_game, Collision)
  {
    return function ()
    {
      var gameengine,
          size,
          key;

      var room;

      // initialize
      this.init = function (p_size)
      {
        size       = p_size;
        gameengine = new GameEngine(size, 0x2e0102);

        var loader = new PIXI.loaders.Loader();
        loader.add('assets/images/fireball01.json');
        loader.add('assets/images/daemon.json');
        loader.add('assets/images/gnome01.json');
        loader.add('pixeled', 'assets/fonts/pixeled.fnt');

        loader.load(startRoomGame);

        // return canvas element
        return gameengine.view;
      };

      function startRoomGame()
      {
        room     = null;
        room     = new room_game(size);
        room.end = gameOver;

        gameengine.addChild(room.stage);
        gameengine.start(room.loop);
      }

      function gameOver(score)
      {
        gameengine.stop();
        gameengine.removeChild(room.stage);

        _.Highscore.submit('BattleGnomeApocalypse', 'Johannes', score,
          function (a)
          {
            console.log(a);
            _.Highscore.get('BattleGnomeApocalypse', 10, console.log);
          }
        );

        startRoomGame();
      }
    }
  }
);