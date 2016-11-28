// renderer.js

define(
  ['tdge/renderer/canvas', 'tdge/renderer/webgl'],
  function (p_Canvas, p_WebGL)
  {
    this.Canvas = p_Canvas;
    this.WebGL  = p_WebGL;

    this.Canvas.prototype =
      this.WebGL.prototpe = {
        createContainer: function (p_width, p_height)
                         {
                           var canvas = document.createElement('canvas');
                           canvas.setAttribute('width', p_width);
                           canvas.setAttribute('height', p_height);

                           return canvas;
                         }
      };

    return this;
  }
);