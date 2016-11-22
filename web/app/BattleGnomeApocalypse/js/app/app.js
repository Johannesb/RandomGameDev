define(
  ['lib/pixi', 'lib/math_expanded', 'lib/vector2d', 'lib/gameengine/gameengine', 'lib/gameengine/key', 'lib/gameengine/object', 'lib/gameengine/particlesystem', 'lib/gameengine/collision'],
  function (PIXI, Math, Vector2D, GameEngine, Key, Object, ParticleSystem, Collision)
  {
    return function ()
    {
      var gameengine,
          size,
          key;

      // initialize
      this.init = function (p_size)
      {
        size       = p_size;
        gameengine = new GameEngine(size, 0x2e0102);

        key = new Key();

        var loader = new PIXI.loaders.Loader();
        loader.add('assets/images/fireball01.json');
        loader.add('assets/images/daemon.json');
        loader.add('assets/images/gnome01.json');
        loader.add('pixeled', 'assets/fonts/pixeled.fnt');

        loader.load(function ()
        {
          initGame();
          gameengine.create(loop);
        });

        // return canvas element
        return gameengine.view;
      };


      var score         = 0,
          obj_score,
          obj_player,
          obj_ground,
          obj_particles,
          obj_lifes     = new PIXI.Container(),
          obj_daemons   = new PIXI.Container(),
          obj_fireballs = new PIXI.Container();

      function initGame()
      {
        createParticles();

        gameengine.addChild(obj_fireballs);

        // create ground
        obj_ground = new Object.create(Object.Tile, {
          position: [0, size.height],
          anchor:   [0, 1],
          src:      'assets/images/ground_tile.png',
          size:     {width: size.width, height: 96}
        });
        gameengine.addChild(obj_ground);

        gameengine.addChild(obj_daemons);

        createPlayer();

        // create lifes
        for (var i = 0; i < 3; i++)
        {
          var obj = new Object.create(Object.Single, {
            position: [10 + i * 65, 10],
            anchor:   [0, 0],
            src:      'assets/images/life.png'
          });
          obj_lifes.addChild(obj);
        }
        gameengine.addChild(obj_lifes);

        // create score
        obj_score            = new PIXI.extras.BitmapText(score.toString(), {font: '72px Pixeled', align: 'right'});
        obj_score.position.x = size.width - obj_score.textWidth - 10;
        obj_score.position.y = -5;
        obj_score.tint = 0x8f2424;
        gameengine.addChild(obj_score);
      }

      function createParticles()
      {
        obj_particles = ParticleSystem.create(ParticleSystem.Rectangle, {
          scale:        [size.width, size.height],
          alpha:        {start: .75, end: 0},
          color:        {start: 0xe03f16, end: 0xe01616},
          speed:        [-10, 0, 2],
          acceleration: [0, .25],
          lifetime:     {min: 500, max: 2000},
          frequency:    200,
          particle:     [Object.Single, {src: 'assets/images/pixel.png'}]
        });
        gameengine.addChild(obj_particles);
      }

      function createPlayer()
      {
        obj_player = new Object.create(Object.Clip, {
          position:       [size.width / 2, size.height / 2],
          anchor:         [.5, 1],
          acceleration:   [0, 11],
          frameCount:     4,
          frameName:      'gnome01 %i.ase',
          animationSpeed: .2
        });

        var jump = 0;

        // custom player loop
        obj_player._.update.callback = function (dt)
        {
          var walkSpeed = 100;

          if (key.check('ArrowLeft'))
          {
            obj_player.scale.x   = -1;
            obj_player._.speed.x = -walkSpeed * dt;
            obj_player.play();
          }
          if (key.check('ArrowRight'))
          {
            obj_player.scale.x   = 1;
            obj_player._.speed.x = walkSpeed * dt;
            obj_player.play();
          }
          if (!key.check('ArrowLeft') && !key.check('ArrowRight'))
          {
            obj_player._.speed.x = 0;
            obj_player.gotoAndStop(0);
          }

          // collision with ground
          if (obj_player._.position.y > obj_ground.position.y - obj_ground.height)
          {
            obj_player._.position.y = obj_ground.position.y - obj_ground.height;
            jump                    = 0;
            obj_player._.speed.y    = 0;
          }
          // collision with walls
          if (obj_player._.position.x < obj_player.width / 2) obj_player._.position.x = obj_player.width / 2;
          if (obj_player._.position.x > size.width - obj_player.width / 2) obj_player._.position.x = size.width - obj_player.width / 2;
        };

        key.addEventListener('keydown', ' ',
          function ()
          {
            if (jump < 2)
            {
              obj_player._.speed.y = -65;
              jump++;
            }
          }
        );

        gameengine.addChild(obj_player);
      }

      function spawnFireball()
      {
        var pos = new Vector2D([Math.randomInt(0, size.width), -50]);

        var speed = pos
          .copy()
          .sub(obj_player._.position)
          .normalize()
          .mult(-15);

        var obj = new Object.create(Object.Clip, {
          position:       [pos.x, pos.y],
          anchor:         [.5, .5],
          speed:          [speed.x, speed.y],
          acceleration:   [0, .25],
          frameCount:     3,
          frameName:      'fireball01 %i.ase',
          animationSpeed: .2
        });

        obj._.update.callback = function ()
        {
          obj._.rotation = obj._.direction + Math.PI;

          if (obj._.position.y > size.height) obj_fireballs.removeChild(obj);
        };

        obj.play();

        obj_fireballs.addChild(obj);
      }

      function spawnDaemon()
      {
        var pos = new Vector2D([Math.randomInt(54, size.width - 54), size.height - obj_ground.height + 6]);

        var obj = new Object.create(Object.Clip, {
          position:       [pos.x, pos.y],
          anchor:         [.5, 1],
          frameCount:     9,
          frameName:      'daemon %i.ase',
          animationSpeed: .2
        });

        obj.loop = false;
        obj.play();

        obj_daemons.addChild(obj);
      }

      function loop(dt)
      {
        if (Math.random() * dt < .005)
          spawnFireball();

        if (Math.random() * dt < .002)
          spawnDaemon();

        // collision player with fireballs
        var list = Collision(obj_player, obj_fireballs);
        list.forEach(function (fireball)
        {
          obj_fireballs.removeChild(fireball);
          obj_lifes.children.pop();

          if (obj_lifes.children.length == 0) gameOver();
        });

        // collision player with daemons
        var list = Collision(obj_player, obj_daemons);
        list.forEach(function (daemon)
        {
          if (daemon.hit) return;

          if (obj_player._.speed.y <= 0) return;

          score++;

          obj_score.text       = score.toString();
          obj_score.position.x = size.width - obj_score.width - 10;

          daemon.hit = true;
          daemon.animationSpeed *= -1;
          daemon.play();

          setTimeout(
            function ()
            {
              obj_daemons.removeChild(daemon);
            },
            750
          );
        });
      }

      function gameOver()
      {
        gameengine.stop();
      }
    }
  }
);