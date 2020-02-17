$(function(){
  $.getScript('jq-cookie.js', function() {

    var refID = getUrlParameter('r');
    if(refID) {
      setCookie('refID', refID);
    };

    var delay = 10; // milliseconds
    var URL = '/';
    setTimeout(function(){ window.location = URL; }, delay);

  });

  function getUrlParameter(sParam) {
      var sPageURL = window.location.search.substring(1),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
          }
      }
  }
});
