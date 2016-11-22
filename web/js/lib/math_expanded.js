// math_expanded.js

define(
  function ()
  {
    Math.randomInt = function (min, max)
    {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    Math.randomFloat = function (min, max)
    {
      return Math.random() * (max - min + 1) + min;
    };

    return Math;
  });