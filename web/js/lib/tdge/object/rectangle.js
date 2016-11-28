// object/rectangle.js

define(
  function ()
  {
    return function (p_params)
    {
      this.type = 'Rectangle';

      this.width  = p_params.width;
      this.height = p_params.height;

      this.color = p_params.color;
    };
  }
);