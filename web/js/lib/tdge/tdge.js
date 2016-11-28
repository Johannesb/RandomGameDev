// tdge.js
// TwoDGameEngine

define(
  ['tdge/game', 'tdge/renderer', 'tdge/object'],
  function (Game, Renderer, Object)
  {
    var TDGE = {};

    TDGE.Game     = Game;
    TDGE.Renderer = Renderer;
    TDGE.Object   = Object;

    return TDGE;
  }
);