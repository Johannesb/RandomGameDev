// func.js

define(
  function ()
  {
    return {
      default: function (p_var, p_def)
               {
                 if (!p_var) p_var = p_def;
                 return p_var;
               },

      Color: {
        findColorBetween: function (a, b, amount)
                          {

                            a = a.toString(16);
                            b = b.toString(16);

                            var ah                                     = parseInt(a.replace(/0x/g, ''), 16),
                                ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
                                bh                                     = parseInt(b.replace(/0x/g, ''), 16),
                                br                                     = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
                                rr                                     = ar + amount * (br - ar),
                                rg                                     = ag + amount * (bg - ag),
                                rb                                     = ab + amount * (bb - ab);

                            return '0x' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
                          }
      },

      Highscore: {
        request: function (url, params, callback)
                 {
                   var data = new FormData();
                   for (var i in params)
                     if (params.hasOwnProperty(i))
                       data.append(i, params[i]);

                   var xhr = new XMLHttpRequest();
                   xhr.open('POST', url, true);
                   xhr.onload = function ()
                   {
                     if (callback) callback(xhr.response);
                   };
                   xhr.send(data);
                 },
        submit:  function (game, name, score, callback)
                 {
                   this.request(
                     'http://johannesberthel.de/highscore/submit.php',
                     {'game': game, 'name': name, 'score': score},
                     callback
                   );
                 },
        get:     function (game, limit, callback)
                 {
                   this.request(
                     'http://johannesberthel.de/highscore/get.php',
                     {'game': game, 'limit': limit},
                     callback
                   );
                 }
      }
    };
  }
);