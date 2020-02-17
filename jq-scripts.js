$(function(){
  $.getScript('jq-cookie.js', function() {

    var clientspace = getCookie('clientspace');
    if (clientspace) {
      $('#ClientPage1').removeClass('show');
      $('#ClientPage2').addClass('show');
      $('link[href="signin.css"]').prop('disabled', true);
      $('link[href="signin.css"]').remove();
      ajax2API(clientspace);
    }
    if(getCookie('data_reset')) {
      $('.password_reset').html('\
        <div class="alert alert-info alert-dismissible fade show" role="alert">\
          <span style="font-size:95%">New password set successfully.</span>\
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
          </button>\
        </div>');
    }
    getInfo();

    $("input[type=submit]").on('click', function(){
      submitToAPI(event);
    });
  });

  function submitToAPI(e) {

      e.preventDefault();
      $.getScript('jq-sha256.js', function() {

      if (!$("#inputEmail").val()) {
        alert ("Please enter an email address");
        return;
      }
      var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
      if (!pattern.test($("#inputEmail").val())) {
        alert ("Please enter a valid email address");
        return;
      }
      if (!$("#inputPassword").val()) {
        alert ("Please enter a password");
        return;
      }
      var pattern = /.{8,}/;
      if (!pattern.test($("#inputPassword").val())) {
        alert ("Please enter a password with eight or more characters");
        return;
      }

      var email = $('#inputEmail').val();
      var password = $('#inputPassword').val();
      var hostname = $(location).attr('hostname');
      var data = {
        "hostname": hostname,
        "email": email,
        "password": password
      };
      $("input[type=submit]").removeClass('show');
      $('button[type=button]').addClass('show');
      ajax2API(data);
    });
  };

  function ajax2API(data) {

    var API_ENDPOINT = 'aHR0cHM6Ly8wNWN3bzM3bTc1LmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL3Byb2QvY2xpZW50c3BhY2U=';
    $.ajax({
          url: atob(API_ENDPOINT),
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          success: function (response) {
            if(response == '') {
              alert('You have entered an invalid email address or password');
              $("input[type=submit]").addClass('show');
              $('button[type=button]').removeClass('show');
            } else {
                if(response[0].result == true) {
                  $.getScript('jq-base32.js', function() {
                    setCookie('_res', base32.encode(JSON.stringify(response)).replace(/=/g,'').toLowerCase());
                    setCookie('_ema', base32.encode(data.email).replace(/=/g,'').toLowerCase());
                    setCookie('_pag', base32.encode('profile').replace(/=/g,'').toLowerCase());
                  });
                  window.location = "in/";
                }
            }
          },
          error: function () {
              alert("error");
          }
      });
  }

  function fclick() {
    if (confirm("Are you sure you want to log out?")) {
      deleteCookie("clientspace");
      location.reload();
    } else {
      return;
    }
  }

  function getBrowser() {
    $.getScript('jq-base32.js', function() {

      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName  = navigator.appName;
      var fullVersion  = ''+parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion,10);
      var nameOffset,verOffset,ix;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
       browserName = "Opera";
       fullVersion = nAgt.substring(verOffset+6);
       if ((verOffset=nAgt.indexOf("Version"))!=-1)
         fullVersion = nAgt.substring(verOffset+8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
       browserName = "Microsoft Internet Explorer";
       fullVersion = nAgt.substring(verOffset+5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
       browserName = "Chrome";
       fullVersion = nAgt.substring(verOffset+7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
       browserName = "Safari";
       fullVersion = nAgt.substring(verOffset+7);
       if ((verOffset=nAgt.indexOf("Version"))!=-1)
         fullVersion = nAgt.substring(verOffset+8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
       browserName = "Firefox";
       fullVersion = nAgt.substring(verOffset+8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                (verOffset=nAgt.lastIndexOf('/')) )
      {
       browserName = nAgt.substring(nameOffset,verOffset);
       fullVersion = nAgt.substring(verOffset+1);
       if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
       }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix=fullVersion.indexOf(";"))!=-1)
         fullVersion=fullVersion.substring(0,ix);
      if ((ix=fullVersion.indexOf(" "))!=-1)
         fullVersion=fullVersion.substring(0,ix);

      majorVersion = parseInt(''+fullVersion,10);
      if (isNaN(majorVersion)) {
       fullVersion  = ''+parseFloat(navigator.appVersion);
       majorVersion = parseInt(navigator.appVersion,10);
      }

      var result = {
        'browserName': browserName,
        'fullVersion': fullVersion,
        'majorVersion': majorVersion,
        'navigator': navigator.appVersion
      };
      setCookie('_nav', base32.encode(JSON.stringify(result)).replace(/=/g,'').toLowerCase());
    });
    //return getCookie('_nav');
  }

  function getIp() {
    $.getJSON('https://ipapi.co/json/', function(data) {
      $.getScript('jq-base32.js', function() {
        setCookie('_cip', base32.encode(JSON.stringify(data)).replace(/=/g,'').toLowerCase());
      });
    });
  }

  function getInfo() {
    getBrowser();
    getIp();
  }
});
