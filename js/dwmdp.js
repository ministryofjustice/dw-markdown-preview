jQuery(function($) {
  var converter = new Showdown.converter({extensions: ['table']});
  var $preview = $('.dwmd-preview');
  var $previewTitle = $('.dwmd-preview-title');
  var $previewElements = $preview.add($previewTitle);
  var $editableContent = $("#content");
  var $contentViewTabs = $('.wp-switch-editor');
  var $contentWrapper = $('#wp-content-wrap');

  var togglePreview = function() {
    if($contentWrapper.hasClass('html-active')) {
      updatePreview();
      $previewElements.show();
    }
    else {
      $previewElements.hide();
    }
  };

  var updatePreview = function() {
    var txt = $editableContent.val();
    var html = converter.makeHtml(txt);
    $preview.contents().find('body').html(html);
  }

  //init
  togglePreview();
  $editableContent.keyup(updatePreview);
  $contentViewTabs.click(togglePreview);
});