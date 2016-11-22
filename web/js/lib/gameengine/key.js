// gameengine | key.js

define(
  function ()
  {
    return function ()
    {
      var key       = {},
          keyDownCB = {},
          keyUpCB   = {};

      // key events
      document.addEventListener('keydown', function (e)
      {
        key[e.key] = true;
        if (keyDownCB[e.key]) keyDownCB[e.key](e);
      });
      document.addEventListener('keyup', function (e)
      {
        key[e.key] = false;
        if (keyUpCB[e.key]) keyUpCB[e.key](e);
      });

      this.check = function (p_key)
      {
        if (key[p_key]) return key[p_key];
        else return false;
      };

      this.addEventListener = function (p_action, p_key, p_cb)
      {
        if (p_action == 'keydown') keyDownCB[p_key] = p_cb;
        else if (p_action == 'keyup') keyUpCB[p_key] = p_cb;
      };
      this.removeEventListener = function (p_action, p_key)
      {
        if (p_action == 'keydown') keyDownCB[p_key] = false;
        else if (p_action == 'keyup') keyUpCB[p_key] = false;
      };

    };
  }
);