// object.js

define(
  ['tdge/object/rectangle'],
  function (p_Rectangle)
  {
    this.Rectangle = p_Rectangle;

    this.Rectangle.prototype =
    {
      appendChild:    function (p_obj)
                   {
                     if (!this.children) this.children = [];

                     this.children.push(p_obj);
                   },
      removeChild: function (p_obj)
                   {
                     var index = this.children.indexOf(p_obj);

                     if (index > -1) this.children.splice(index, 1);
                   },
      update:      function (p_dt)
                   {
                     this.speed    = this.speed.add(this.acceleration.mult(p_dt));
                     this.position = this.position.add(this.speed.mult(p_dt));
                   }
    };

    this.create = function (p_type, p_params)
    {
      var obj = new p_type(p_params);

      obj.position     = p_params.position;
      obj.anchor       = p_params.anchor;
      obj.speed        = p_params.speed;
      obj.acceleration = p_params.acceleration;

      return obj;
    };

    return this;
  }
);