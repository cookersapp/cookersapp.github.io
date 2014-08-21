jQuery(document).ready(function(){
  Log.identify();
  Log.trackDownloadView();

  $('.download-button').on('click', function(e){
    Log.trackDownloadApp();
  });
});