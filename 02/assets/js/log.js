var Utils = {
  createUuid: function(){
    function S4(){ return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  },
  arrayToJson: function(arr){
    var obj = {};
    for(var i in arr){
      obj[arr[i].name] = arr[i].value;
    }
    return obj;
  },
  addIfNotExists: function(arr, elt){
    var index = arr.indexOf(elt);
    if(index === -1 && elt !== null && elt !== undefined){
      arr.push(elt);
    }
  },
  getUrlParameter: function(param){
    var querySrting = window.location.search.substring(1);
    var params = querySrting.split('&');
    for(var i=0; i < params.length; i++){
      var sParameterName = params[i].split('=');
      if (sParameterName[0] == param){
        return sParameterName[1] ? sParameterName[1] : '';
      }
    }
  },
  urlHasParameter: function(param){
    return Utils.getUrlParameter(param) !== undefined;
  }
};

var Log = (function(){
  var Storage = {
    get: function(key, defaultValue){
      if(localStorage){
        var value = JSON.parse(localStorage.getItem(key));
        if(!value){
          value = defaultValue;
          localStorage.setItem(key, JSON.stringify(value));
        }
        return value;
      } else {
        return defaultValue;
      }
    },
    set: function(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  var User = {
    build: function(){
      var source = Utils.getUrlParameter('utm_source');
      var user = Storage.get('user', {
        id: Utils.createUuid(),
        $created: new Date(),
        utm_sources: [],
        landings: []
      });
      Utils.addIfNotExists(user.utm_sources, source);
      Utils.addIfNotExists(user.landings, LANDING_ID);
      user.lastLanding = LANDING_ID;
      User.save(user);
      return user;
    },
    save: function(user){
      Storage.set('user', user);
    },
    setMail: function(mail){
      User.current.$email = mail;
      User.save(User.current);
    },
    setPlatform: function(platform){
      User.current.platform = platform;
      User.save(User.current);
    }
  };
  User.current = User.build();


  return {
    shouldTrack: function(){
      return window.location.protocol !== 'file:' && !Utils.urlHasParameter('dnt');
    },
    shouldTrackDeep: function(){
      return Log.shouldTrack() && Utils.urlHasParameter('utm_source');
    },
    identify: function(){
      if(Log.trackingEnabled){
        mixpanel.identify(User.current.id);
        mixpanel.people.set(User.current);
      } else {
        console.log('identify', User.current.id);
      }
    },
    register: function(params){
      if(params.email){User.setMail(params.email);}
      if(params.platform){User.setPlatform(params.platform);}
      if(Log.trackingEnabled){
        mixpanel.people.set(User.current);
      } else {
        console.log('register', User.current);
      }
    },
    track: function(event, params){
      if(Log.trackingEnabled){
        if(Log.trackingDeep || (event === 'view' || event === 'download-click' || event === 'subscribe')){
          mixpanel.track(event, $.extend({}, User.current, params));
        } else {
          console.log('track '+event, params);
        }
      } else {
        console.log('track '+event, params);
      }
    },
    trackView: function(){Log.track('view');},
    trackScroll: function(section){Log.track('scroll-to', {main: section});},
    trackMenu: function(menu){Log.track('menu-click', {main: menu});},
    trackDownload: function(platform){Log.track('download-click', {main: platform});},
    trackSubscribe: function(params){
      params.main = params.email;
      Log.track('subscribe', params);
    }
  };
})();

Log.trackingEnabled = Log.shouldTrack();
Log.trackingDeep = Log.shouldTrackDeep();
