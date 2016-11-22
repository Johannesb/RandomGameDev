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
                                br                                     = bh >> 16, bg                      = bh >> 8 & 0xff, bb = bh & 0xff,
                                rr                                     = ar + amount * (br - ar),
                                rg                                     = ag + amount * (bg - ag),
                                rb                                     = ab + amount * (bb - ab);

                            return '0x' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
                          }
      }
    };
  }
);