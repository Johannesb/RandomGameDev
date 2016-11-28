// canvas.js

define(
  function ()
  {
    return function (p_width, p_height)
    {
      this.view = this.createContainer(p_width, p_height);
      var ctx   = this.view.getContext('2d');

      this.clear = function ()
      {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      };

      this.draw = {
        Rectangle: function (obj)
                   {
                     ctx.fillStyle = obj.color;

                     ctx.beginPath();
                     ctx.rect(obj.position.x - obj.anchor.x * obj.width, obj.position.y - obj.anchor.y * obj.height, obj.width, obj.height);
                     ctx.closePath();
                     ctx.fill();
                   }
      }
    };
  }
);