jQuery(function($) {
  var converter = new Showdown.converter();
  $("#content").keyup(function(){
    var txt = $("#content").val();
    var html = converter.makeHtml(txt);
    $(".dwmd-preview").html(html);
  });
});