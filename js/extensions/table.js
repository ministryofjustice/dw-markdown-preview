/*global module:true*/
/*
 * Basic table support with re-entrant parsing, where cell content
 * can also specify markdown.
 *
 * Tables
 * ======
 *
 * | Col 1   | Col 2                                              |
 * |======== |====================================================|
 * |**bold** | ![Valid XHTML] (http://w3.org/Icons/valid-xhtml10) |
 * | Plain   | Value                                              |
 *
 */

(function(){
  var table = function(converter) {
    var tables = {}, style = ' align="left"', filter, attr = {}; 
    tables.th = function(header,col){
      if (header.trim() === "") { return "";}
      var id = header.trim().replace(/ /g, '_').toLowerCase();
      return '<th id="' + id + '"'+attr[col]+'>' + header + '</th>';
    };
    tables.td = function(cell,col) {
      return '<td'+attr[col]+'>' + converter.makeHtml(cell) + '</td>';
    };
    tables.ths = function(){
      var out = "", i = 0, hs = [].slice.apply(arguments);
      for (i;i<hs.length;i+=1) {
        out += tables.th(hs[i],i) + '\n';
      }
      return out;
    };
    tables.tds = function(){
      var out = "", i = 0, ds = [].slice.apply(arguments);
      for (i;i<ds.length;i+=1) {
        out += tables.td(ds[i],i) + '\n';
      }
      return out;
    };
    tables.thead = function() {
      var out, i = 0, hs = [].slice.apply(arguments);
      out = "<thead>\n";
      out += "<tr>\n";
      out += tables.ths.apply(this, hs);
      out += "</tr>\n";
      out += "</thead>\n";
      return out;
    };
    tables.tr = function() {
      var out, i = 0, cs = [].slice.apply(arguments);
      out = "<tr>\n";
      out += tables.tds.apply(this, cs);
      out += "</tr>\n";
      return out;
    };
    filter = function(text) { 
      var i=0, lines = text.split('\n'), line, hs, rows, out = [], align={}, j=0;
      for (i; i<lines.length;i+=1) {
        line = lines[i];
        // looks like a table heading
        if (line.trim().match(/^[ ]*[|]?(.+)/m)) {
          line = line.trim() ;
          var tbl = [];
          tbl.push('<table>');
          if (line.trim().match(/^[ ]*[|]/)) {
            hs = line.substring(1, line.length -1).split('|');
          } else {
            hs = line.split('|');
          }
          line = lines[++i];
          if (!line.trim().match(/^[|]?([ ]*[-:]+[-| :]*)/)) {
            // not a table rolling back
            line = lines[--i];
          }
          else {
            if (line.trim().match(/^[ ]*[|]/)) {
              align = line.trim().substring(1, line.length-1).split('|');
            } else {
              align = line.trim().split('|');
            }
            for(j=0;j<align.length;j+=1) {
              // add regex to determine alignments and set in array
              if (align[j].trim().match(/^ *-+: *$/)) {
                attr[j]=' class="right"';
              } else if (align[j].trim().match(/^ *:-+: *$/)) {
                attr[j]=' class="center"';
              } else {
                attr[j]=' class="left"';
              }
            }
            // console.log(align,attr);
            tbl.push(tables.thead.apply(this, hs));
            line = lines[++i];
            tbl.push('<tbody>');
            while (line.trim().match(/^[|]?.*[|].*[|]?/)) {
              line = line.trim();
              if (line.trim().match(/^[ ]*[|]/)) {
                tbl.push(tables.tr.apply(this, line.substring(1, line.length -1).split('|')));
              } else {
                tbl.push(tables.tr.apply(this, line.split('|')));
              }
              line = lines[++i];
            }
            tbl.push('</tbody>');
            tbl.push('</table>');
            // attr = {};
            // align = {};
            // we are done with this table and we move along
            out.push(tbl.join('\n'));
            continue;
          }
        }
        out.push(line);
      }             
      return out.join('\n');
    };
    return [
    { 
      type: 'lang', 
      filter: filter
    }
    ];
  };

  // Client-side export
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.table = table; }
  // Server-side export
  if (typeof module !== 'undefined') {
    module.exports = table;
  }
}());
