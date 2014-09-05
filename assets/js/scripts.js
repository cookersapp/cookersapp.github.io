function scroll_to(clicked_link, nav_height) {
  var element_class = clicked_link.attr('href').replace('#', '.');
  var scroll_to = 0;
  if(element_class != '.top-content') {
    element_class += '-container';
    scroll_to = $(element_class).offset().top - nav_height;
  }
  if($(window).scrollTop() != scroll_to) {
    $('html, body').stop().animate({scrollTop: scroll_to}, 1000);
  }
}

jQuery(document).ready(function(){
  Log.identify();
  Log.trackView();

  /*
   * Track scroll
   */
  $('body').scrollspy({'target': '.nav-links', 'offset': 60});
  $('.nav-links').on('activate.bs.scrollspy', function(e){
    var scrollTo = $(e.target).find('a').attr('href');
    Log.trackScroll(scrollTo);
  });

  /*
   * Navigation
   */
  $('a.scroll-link').on('click', function(e) {
    e.preventDefault();
    var menu = $(this).attr('href');
    Log.trackMenu(menu);
    var nav_height = $('nav').height();
    if($('nav').css('position') != 'static') { // window width > 767px
      scroll_to($(this), nav_height);
    }
    else {
      scroll_to($(this), 0);
    }
  });

  /*$('.show-menu a').on('click', function(e){
    e.preventDefault();
    var menu_links = $('.nav-links a').not('.nav-links .show-menu a');
    if(menu_links.css('display') == 'none') {
      menu_links.css('display', 'inline-block');
    }
    else {
      menu_links.css('display', 'none');
    }
  });*/

  $(window).on('resize', function(){
    var menu_links = $('.nav-links a').not('.nav-links .show-menu a');
    if($('nav').css('position') != 'static') { // window width > 767px
      menu_links.css('display', 'inline-block');
    }
    else {
      menu_links.css('display', 'none');
    }
  });

  /*
   * Fullscreen background
   */
  $('.section-container-full-bg').each(function(){
    var bg = $(this).attr('data-background');
    if(bg && bg.length > 0){
      $(this).backstretch(bg);
    }
  });

  /*
   * Wow
   */
  // new WOW().init();

  /*
   * Download
   */
  $('.call-to-action-button').on('click', 'a[data-platform]', function(e){
    e.preventDefault();
    var platform = $(this).attr('data-platform');
    Log.trackDownload(platform);
    if(platform === 'android'){
      window.open('download', '_blank');
    } else {
      var $CTA = $('.call-to-action-button');
      $CTA.find('form input[name="platform"]').val(platform);
      $CTA.find('a.download-btn').hide();
      $CTA.find('.subscribe').fadeIn();
    }
  });

  /*
   * Download
   */
  $('.social-icons a').on('click', function(e){
    var link = $(this).attr('platform');
    var url = $(this).attr('href');
    Log.trackSocial(link, url);
  });

  /*
   * Subscription form
   */
  $('.success-message').hide();
  $('.error-message').hide();

  $('.subscribe form').submit(function(e) {
    e.preventDefault();
    var params = Utils.arrayToJson($(this).serializeArray());
    Log.register(params);
    Log.trackSubscribe(params);

    $('.error-message').hide();
    $('.success-message').hide();
    $('.subscribe form').hide();
    $('.success-message').fadeIn();
  });

  /*
   * Image popup
   */
  $('.screenshot-box img').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: 'The image could not be loaded.',
      titleSrc: function(item) {
        return item.el.attr('alt');
      }
    },
    callbacks: {
      elementParse: function(item) {
        item.src = item.el.attr('src');
      }
    }
  });

  /*
   * FAQ
   */
  $('.single-faq span').on('click', function(){
    var this_p = $(this).siblings('.single-faq-text');
    var this_icon = $(this).find('i');
    if(this_p.css('display') == 'none') {
      this_p.slideDown(400);
      this_icon.removeClass('fa-plus').addClass('fa-minus');
    } 
    else {
      this_p.slideUp(400);
      this_icon.removeClass('fa-minus').addClass('fa-plus');
    }
  });

  /*
   * Testimonials
   */
  $('.testimonial-active').html('<p>' + $('.testimonial-single:first p').html() + '</p>');
  $('.testimonial-single:first .testimonial-single-image img').css('opacity', '1');

  $('.testimonial-single-image img').on('click', function() {
    $('.testimonial-single-image img').css('opacity', '0.5');
    $(this).css('opacity', '1');
    var new_testimonial_text = $(this).parent('.testimonial-single-image').siblings('p').html();
    $('.testimonial-active p').fadeOut(300, function() {
      $(this).html(new_testimonial_text);
      $(this).fadeIn(400);
    });
  });

  /*
   * Show latest tweets
   */
  /*$('.latest-tweets .tweets').tweet({
    modpath: 'assets/twitter/',
    username: 'anli_zaimi',
    page: 1,
    count: 5,
    loading_text: 'loading ...'
  });

  $('.latest-tweets .tweets .tweet_list li').append('<span class="tweet_nav"></span>');
  $('.latest-tweets .tweets .tweet_list li:first .tweet_nav').css('background', '#fff');
  $('.latest-tweets .tweets .tweet_list li .tweet_time').hide();
  $('.latest-tweets .tweets .tweet_list li .tweet_text').hide();
  $('.latest-tweets .tweet-active').html($('.latest-tweets .tweets .tweet_list li:first .tweet_text').html());

  $('.latest-tweets .tweets .tweet_list li .tweet_nav').on('click', function() {
    $('.latest-tweets .tweets .tweet_list li .tweet_nav').css('background', 'rgba(255, 255, 255, 0.6)');
    var clicked_tweet_nav = $(this);
    var new_tweet_text = clicked_tweet_nav.siblings('.tweet_text').html();
    $('.latest-tweets .tweet-active').fadeOut(300, function() {
      $(this).html(new_tweet_text);
      $(this).fadeIn(400, function() {
        // reload background
        $('.latest-tweets-container').backstretch("resize");
      });
    });
    clicked_tweet_nav.css('background', '#fff');
  });*/

  /*
   * Contact form
   */
  /*function contactSuccess(json) {
    if(json.emailMessage != '') {
      $('.contact-form form .contact-email').addClass('contact-error');
    }
    if(json.subjectMessage != '') {
      $('.contact-form form .contact-subject').addClass('contact-error');
    }
    if(json.messageMessage != '') {
      $('.contact-form form textarea').addClass('contact-error');
    }
    if(json.emailMessage == '' && json.subjectMessage == '' && json.messageMessage == '') {
      $('.contact-form form').fadeOut('fast', function() {
        $('.contact-form').append('<p>Thanks for contacting us! We will get back to you very soon.</p>');
        // reload background
        $('.contact-container').backstretch("resize");
      });
    }
  }
  $('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function() {
    $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
  });
  $('.contact-form form').submit(function(e) {
    e.preventDefault();
    $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
    var postdata = $('.contact-form form').serialize();
    console.log('contact data', postdata);
    $.ajax({
      type: 'POST',
      url: 'assets/contact.php',
      data: postdata,
      dataType: 'json',
      success: contactSuccess
    });
  });*/
});
