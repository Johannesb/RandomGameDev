// vector2d.js

define(
  function ()
  {
    var Vector2D = function (p)
    {
      p    = typeof p !== 'undefined' ? p : [];
      p[0] = typeof p[0] !== 'undefined' ? p[0] : 0;
      p[1] = typeof p[1] !== 'undefined' ? p[1] : 0;

      this.x = p[0];
      this.y = p[1];
      // ...
    };

    function copy(p)
    {
      return new Vector2D([p.x, p.y]);
    }

    Vector2D.prototype.copy = function ()
    {
      return copy(this);
    };

    Vector2D.prototype.add = function (p_v)
    {
      var v = copy(this);
      v.x += p_v.x;
      v.y += p_v.y;

      return v;
    };

    Vector2D.prototype.sub = function (p_v)
    {
      var v = copy(this);
      v.x -= p_v.x;
      v.y -= p_v.y;

      return v;
    };

    Vector2D.prototype.mult = function (p_s)
    {
      var v = copy(this);

      v.x *= p_s;
      v.y *= p_s;

      return v;
    };

    Vector2D.prototype.dot = function (p_v)
    {
      return this.x * p_v.x + this.y * p_v.y;
    };

    Vector2D.prototype.mag = function ()
    {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector2D.prototype.abs = function ()
    {
      var v = copy(this);

      v.x = Math.abs(v.x);
      v.y = Math.abs(v.y);

      return v;
    };

    Vector2D.prototype.dist = function (p_v)
    {
      return p_v.sub(this).mag();
    };

    Vector2D.prototype.normalize = function ()
    {
      var v      = copy(this),
          length = v.mag();

      if (length > 0) v = v.mult(1 / length);

      return v;
    };

    Vector2D.prototype.angle = function (p_v)
    {
      return Math.acos(this.dot(p_v) / (this.mag() * p_v.mag()));
    };

    return Vector2D;
  });