// gameengine | collision.js

define(
  function ()
  {
    return function (p_self, p_other)
    {
      var list = [];

      function doPolygonsIntersect(a, b)
      {
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;

        for (i = 0; i < polygons.length; i++)
        {
          // for each polygon, look at each edge of the polygon, and determine if it separates
          // the two shapes
          var polygon = polygons[i];
          for (i1 = 0; i1 < polygon.length; i1++)
          {
            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = {x: p2.y - p1.y, y: p1.x - p2.x};

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++)
            {
              projected = normal.x * a[j].x + normal.y * a[j].y;
              if (!(minA) || projected < minA)
              {
                minA = projected;
              }
              if (!(maxA) || projected > maxA)
              {
                maxA = projected;
              }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++)
            {
              projected = normal.x * b[j].x + normal.y * b[j].y;
              if (!(minB) || projected < minB)
              {
                minB = projected;
              }
              if (!(maxB) || projected > maxB)
              {
                maxB = projected;
              }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA)
            {
              return false;
            }
          }
        }
        return true;
      }

      function createBoundingBox(obj)
      {
        function rotate(point, anchor, alpha)
        {
          point.x -= anchor.x;
          point.y -= anchor.y;

          var x = point.x,
              y = point.y;

          point.x = x * Math.cos(alpha) - y * Math.sin(alpha);
          point.y = y * Math.cos(alpha) + x * Math.sin(alpha);

          point.x += anchor.x;
          point.y += anchor.y;
        }

        var p_x = obj._.position.x - obj.anchor.x * obj.width,
            p_y = obj._.position.y - obj.anchor.y * obj.height;

        var polygon = [
          { // top left corner
            x: p_x,
            y: p_y
          },
          { // top right corner
            x: p_x + obj.width,
            y: p_y
          },
          { // bottom right corner
            x: p_x + obj.width,
            y: p_y + obj.height
          },
          { // bottom left corner
            x: p_x,
            y: p_y + obj.height
          }
        ];

        var anchor = {
          x: obj._.position.x,
          y: obj._.position.y
        };
        var alpha  = obj.rotation;

        polygon.forEach(function (point)
        {
          rotate(point, anchor, alpha);
        });

        return polygon;
      }

      function check(self, other)
      {
        if (other.anchor)
        {
          self._.boundingBox  = self._.boundingBox || createBoundingBox(self);
          other._.boundingBox = other._.boundingBox || createBoundingBox(other);

          if (doPolygonsIntersect(self._.boundingBox, other._.boundingBox))
          {
            list.push(other);
          }
        }

        other.children.forEach(
          function (child)
          {
            check(self, child);
          }
        );
      }

      check(p_self, p_other);

      return list;
    };
  }
);