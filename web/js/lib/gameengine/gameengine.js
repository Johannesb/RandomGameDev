// gameengine | gameengine.js

define(['lib/pixi'],
  function (PIXI)
  {
    return function (p_size, p_bg)
    {
      var DEBUG = false;

      var renderer = PIXI.autoDetectRenderer(p_size.width, p_size.height),
          stage    = new PIXI.Container(),
          loop,
          lastRender;

      renderer.backgroundColor = p_bg;

      this.view = renderer.view;

      var looping = true, myLoop;

      // start game loop
      this.start = function (p_loop)
      {
        loop = p_loop;
        looping = true;
        myLoop = requestAnimationFrame(animate);
      };

      this.stop = function ()
      {
        looping = false;
        cancelAnimationFrame(myLoop);
      };

      // add something to stage
      this.addChild = function (p_obj)
      {
        stage.addChild(p_obj);
      };

      this.removeChild = function (p_obj)
      {
        stage.removeChild(p_obj);
      };

      // rendering & calling loop
      function animate(now)
      {
        if (looping) myLoop = requestAnimationFrame(animate);
        else return;

        if (!lastRender) lastRender = now;
        var dt     = (now - lastRender) / 60;
        lastRender = now;

        // call each update function
        function updateChildren(parent, dt)
        {
          parent.children.forEach(function (obj)
          {
            if (obj._ && obj._.update) obj._.update(dt);
            updateChildren(obj, dt);
          });
        }
        updateChildren(stage, dt);

        // call main loop
        loop(dt);

        renderer.render(stage);

        if (DEBUG)
        {
          var canvas = document.getElementById('debug');
          var ctx = canvas.getContext('2d');

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          function drawBoundingBox(parent)
          {
            parent.children.forEach(function (obj)
            {
              if (obj._ && obj._.boundingBox)
              {
                ctx.strokeStyle = '#00ff00';
                ctx.beginPath();
                ctx.moveTo(obj._.boundingBox[0].x, obj._.boundingBox[0].y);
                for (var i=1; i<obj._.boundingBox.length; i++) ctx.lineTo(obj._.boundingBox[i].x, obj._.boundingBox[i].y);
                ctx.closePath();
                ctx.stroke();

                ctx.fillStyle = '#00ff00';
                ctx.beginPath();
                ctx.arc(obj._.position.x, obj._.position.y, 3, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
              }

              drawBoundingBox(obj);
            });
          }
          drawBoundingBox(stage);
        }
      }
    }
  }
);