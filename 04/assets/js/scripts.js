Log.identify();
Log.trackView();

$('form').submit(function(e) {
  e.preventDefault();
  var params = Utils.arrayToJson($(this).serializeArray());
  Log.register(params);
  Log.trackSubscribe(params);

  $('form').hide();
  $('.success-message').fadeIn();
});
