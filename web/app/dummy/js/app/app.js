define(
  ['lib/pixi'],
  function (PIXI)
  {
    return function ()
    {
      // -->
      // define global variables
      var renderer, stage;

      // initialize
      this.init = function (p_size)
      {
        renderer = PIXI.autoDetectRenderer(p_size.width, p_size.height);
        stage    = new PIXI.Container();

        PIXI.loader
          .add('pixeled', 'assets/fonts/pixel.fnt')
          .load(onAssetsLoaded);

        function onAssetsLoaded()
        {
          initObjects();
          animate();
        }

        // return canvas element
        return renderer.view;
      };

      // draw stage
      function animate()
      {
        requestAnimationFrame(animate);

        // call loop
        loop();

        renderer.render(stage);
      }

      // <--

      var obj_test;

      function initObjects()
      {
        var texture = PIXI.Texture.fromImage('assets/images/test.png');

        obj_test          = new PIXI.Sprite(texture);
        obj_test.anchor.x = 0.5;
        obj_test.anchor.y = 0.5;

        obj_test.position.x = renderer.width / 2;
        obj_test.position.y = renderer.height / 2;

        stage.addChild(obj_test);

        var bitmapFontText = new PIXI.extras.BitmapText('HALLO WELT!', {font: '35px Pixeled', align: 'left'});
        bitmapFontText.tint = 0xff0000;
        bitmapFontText.position.x = renderer.width / 2 - bitmapFontText.textWidth / 2;
        bitmapFontText.position.y = 50;

        stage.addChild(bitmapFontText);
      }

      function loop()
      {
        obj_test.rotation += .01;
      }

      // ...
    }
  }
);