// gameengine | object.js

define(['lib/pixi', 'lib/func', 'lib/vector2d'],
  function (PIXI, _, Vector2D)
  {
    return {

      Single:    function (p_params)
                 {
                   var texture = PIXI.Texture.fromImage(p_params.src);
                   return new PIXI.Sprite(texture);
                 },
      Tile:      function (p_params)
                 {
                   var texture = PIXI.Texture.fromImage(p_params.src);
                   return new PIXI.extras.TilingSprite(texture, p_params.size.width, p_params.size.height);
                 },
      Clip:      function (p_params)
                 {
                   var frames = [];
                   for (var i = 0; i < p_params.frameCount; i++)
                   {
                     frames.push(PIXI.Texture.fromFrame(p_params.frameName.replace('%i', i)));
                   }
                   var clip            = new PIXI.extras.AnimatedSprite(frames);
                   clip.animationSpeed = p_params.animationSpeed;

                   return clip;
                 },
      Rectangle: function (p_params)
                 {
                   var graphics = new PIXI.Graphics();
                   graphics.beginFill(0xffffff);
                   graphics.drawRect(-p_params.size.width * p_params.anchor.x, -p_params.size.height * p_params.anchor.y, p_params.size.width - p_params.size.width * p_params.anchor.x, p_params.size.height - p_params.size.height * p_params.anchor.y);

                   return graphics;
                 },

      create: function (p_type, p_params)
              {
                // PARAMS_ position, anchor, Single: (src), Tile: (src, size), Clip (frameCount, frameName, animationSpeed)
                var params          = _.default(p_params, {});
                params.position     = _.default(p_params.position, [0, 0]);
                params.rotation     = _.default(p_params.rotation, 0);
                params.anchor       = _.default(p_params.anchor, [.5, .5]);
                params.speed        = _.default(p_params.speed, [0, 0]);
                params.acceleration = _.default(p_params.acceleration, [0, 0]);

                // create sprite
                var obj = p_type(p_params);

                if (!obj.anchor) obj.anchor = {x: 0, y: 0};

                // apply settings to sprite
                obj._ = {
                  position:     new Vector2D(params.position),
                  rotation:     params.rotation,
                  direction:    0,
                  anchor:       new Vector2D(params.anchor),
                  acceleration: new Vector2D(params.acceleration),
                  speed:        new Vector2D(params.speed),

                  boundingBox: false,

                  set:    function ()
                          {
                            this.position.x = this._.position.x;
                            this.position.y = this._.position.y;
                            this.rotation   = this._.rotation;
                            this.anchor.x   = this._.anchor.x;
                            this.anchor.y   = this._.anchor.y;
                          }

                            .bind(obj),
                  update: function (dt)
                          {
                            // do calculations
                            this._.speed    = this._.speed.add(this._.acceleration.mult(dt));
                            this._.position = this._.position.add(this._.speed.mult(dt));

                            this._.direction = new Vector2D([0, -1]).angle(obj._.speed)
                              * obj._.speed.x / Math.abs(obj._.speed.x);

                            this._.set();

                            // call custom loop
                            if (this._.update.callback) this._.update.callback(dt);

                            this._.set();

                            this._.boundingBox = false;
                          }.bind(obj)
                };

                obj._.set();

                return obj;
              }
    };
  }
);