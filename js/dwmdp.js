jQuery(function($) {
  var converter = new Showdown.converter();
  updatePreview();
  $("#content").keyup(function(){
    updatePreview();
  });

  function updatePreview() {
    var txt = $("#content").val();
    var html = converter.makeHtml(txt);
    $(".dwmd-preview").contents().find('body').html(html);
  }
});