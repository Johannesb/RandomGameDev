// game.js

define(
  function ()
  {
    return function (p_width, p_height, p_renderer, p_style)
    {
      this.renderer = new p_renderer(p_width, p_height);

      for (var key in p_style)
        if (p_style.hasOwnProperty(key))
        {
          this.renderer.view.style[key] = p_style[key];
        }

      // -->

      var objects = [];

      this.appendChild = function (p_obj)
      {
        objects.push(p_obj);
      };

      this.removeChild = function (p_obj)
      {
        var index = objects.indexOf(p_obj);

        if (index > -1) objects.splice(index, 1);
      };

      var loop = {
        game:   function ()
                {
                  var now = new Date().getTime(),
                      dt  = (now - loop.gameLast) / 1000;

                  loop.gameLast = now;

                  function update(parent)
                  {
                    parent.forEach(
                      function (obj)
                      {
                        obj.update(dt);

                        if (obj.children) update(obj.children);
                      }
                    );
                  }

                  update(objects);

                  if (loop.callback) loop.callback();
                },
        render: function ()
                {
                  loop.renderID = requestAnimationFrame(loop.render);

                  this.renderer.clear();

                  function update(parent, renderer)
                  {
                    parent.forEach(
                      function (obj)
                      {
                        renderer.draw[obj.type](obj);

                        if (obj.children) update(obj.children, renderer);
                      }.bind(this)
                    );
                  }

                  update(objects, this.renderer);
                }.bind(this)
      };

      this.start = function (p_callback)
      {
        loop.callback = p_callback;

        loop.gameLast = new Date().getTime();
        loop.gameID   = setInterval(loop.game, 0);
        loop.renderID = requestAnimationFrame(loop.render);
      };

      this.stop = function ()
      {
        clearInterval(loop.gameID);
        cancelAnimationFrame(loop.renderID);
      };

      // <--
    };
  }
);