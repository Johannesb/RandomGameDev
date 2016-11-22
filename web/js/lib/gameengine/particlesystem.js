// gameengine | object.js

define(['lib/pixi', 'lib/func', 'lib/vector2d', 'lib/gameengine/object', 'lib/math_expanded'],
  function (PIXI, _, Vector2D, Object, Math)
  {
    return {
      Rectangle: function (p_params)
                 {
                   p_params.position = _.default(p_params.position, [0, 0]);
                   p_params.scale    = _.default(p_params.scale, [50, 50]);

                   this.position = p_params.position;
                   this.scale    = p_params.scale;

                   var lastEmit = new Date().getTime();

                   this.emit = function (c, p, f)
                   {
                     var now = new Date().getTime(),
                         dt  = now - lastEmit;

                     var count = Math.floor(dt / (1000 / f));
                     lastEmit += count * (1000 / f);

                     for (var i = 0; i < count; i++)
                     {
                       var obj              = Object.create(p[0], p[1]);
                       obj._.position.x     = Math.randomInt(this.position[0], this.scale[0]);
                       obj._.position.y     = Math.randomInt(this.position[1], this.scale[1]);
                       obj._.speed.x        = c._.speed[0];
                       obj._.speed.y        = c._.speed[1];
                       obj._.acceleration.x = c._.acceleration[0];
                       obj._.acceleration.y = c._.acceleration[1];
                       obj._.creation       = now;
                       obj._.lifetime       = Math.randomInt(c._.lifetime.min, c._.lifetime.max);
                       c.addChild(obj);
                     }
                   }.bind(this);
                 },

      create: function (p_emitter, p_params)
              {
                p_params              = _.default(p_params, {});
                p_params.alpha        = _.default(p_params.alpha, {start: 1, end: 0});
                p_params.scale        = _.default(p_params.scale, {start: 1, end: 1});
                p_params.color        = _.default(p_params.color, {start: 0xffffff, end: 0xffffff});
                p_params.speed        = _.default(p_params.speed, [0, 0, 0]);
                p_params.acceleration = _.default(p_params.acceleration, [0, 0]);
                p_params.lifetime     = _.default(p_params.lifetime, {min: 500, max: 1000});
                p_params.frequency    = _.default(p_params.frequency, 100);
                p_params.particle     = _.default(p_params.particle, [Object.Single, {src: 'assets/images/pixel.png'}]);

                var obj = new PIXI.Container();

                obj._ = {
                  alpha:        p_params.alpha,
                  scale:        p_params.scale,
                  color:        p_params.color,
                  speed:        p_params.speed,
                  acceleration: p_params.acceleration,
                  lifetime:     p_params.lifetime,
                  frequency:    p_params.frequency,
                  particle:     p_params.particle,

                  emitter: new p_emitter(p_params),

                  update: function () // dt
                          {
                            this._.emitter.emit(this, this._.particle, this._.frequency);

                            var now = new Date().getTime();

                            this.children.forEach(function (obj)
                            {
                              if (now - obj._.creation > obj._.lifetime)
                              {
                                this.removeChild(obj);
                                return;
                              }

                              if (this._.speed.wiggle > 0)
                              {
                                var wiggleX = Math.random() * this._.speed.wiggle;
                                wiggleX -= this._.speed.wiggle / 2;

                                var wiggleY = Math.random() * this._.speed.wiggle;
                                wiggleY -= this._.speed.wiggle / 2;

                                obj._.speed.x += wiggleX;
                                obj._.speed.y += wiggleY;
                              }

                              var faktor = (now - obj._.creation) / obj._.lifetime;

                              obj.alpha = this._.alpha.start - faktor * Math.abs(this._.alpha.start - this._.alpha.end);
                              obj.tint = _.Color.findColorBetween(this._.color.start, this._.color.end, faktor);

                            }.bind(this));
                          }.bind(obj)
                };

                obj._.speed.wiggle = p_params.speed[2];

                return obj;
              }
    };
  }
);