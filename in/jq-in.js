//AJAX GET REQUEST
$(function(){
  $.getScript('jq-cookie.js', function() {
    if(getCookie('data_reset')) {
      deleteCookie('data_reset');
    }
    var _res = getCookie('_res');
    if (_res) {
      $.getScript('jq-base32.js', function() {
        $('.collapse').removeClass('show');
        $('#profile').addClass('show');
        var _page = base32.decode(getCookie('_pag'));
        /*
        $('#profile').append('<br /> profile : '+ base32.encode('profile'));
        $('#profile').append('<br /> account : '+ base32.encode('account'));
        $('#profile').append('<br /> guides : '+ base32.encode('guides'));
        $('#profile').append('<br /> support : '+ base32.encode('support'));
        $('#profile').append('<br /> settings : '+ base32.encode('settings'));
        $('#profile').append('<br /> log out : '+ base32.encode('log out'));
        */
        $('.text-'+_page).addClass('show');
        $('link[href="signin.css"]').prop('disabled', true);
        $('link[href="signin.css"]').remove();
        var data = jQuery.parseJSON(base32.decode(_res))[0];
        var _email = base32.decode(getCookie('_ema'));
        $("#_email").text(_email);
        $("#_company").html(data.company.toLowerCase()+'&nbsp;/&nbsp;'+_page);
        $("#_contact").html('<a href="https://www.eudpr.com/contact?c='+data.clientid+'" target="_blank">https://eudpr.com/contact?c='+data.clientid+'</a>');
        $("#_referral").html('<a href="https://www.eudpr.com/referral?r='+data.clientid+'" target="_blank">https://eudpr.com/referral?r='+data.clientid+'</a>');
        $("#_path").html('<a href="'+data.path+'" target="_blank">'+data.path+'</a>');
        $("#_clientId").text(data.clientid);
        //$('#profile').append(data.result);

        /* profile Url */
        var _com = getCookie('_com');
        if(!_com) {
          var _str = data.company.toLowerCase().replace(' ','');
          setCookie('_com', base32.encode(_str).replace(/=/g,'').toLowerCase());
          profile2API(_str);
        }

        /* CLICK functions*/
        $('#_profile').on('click', function(){ setCookie('_pag', base32.encode('profile').replace(/=/g,'').toLowerCase()); });
        $('#_account').on('click', function(){ setCookie('_pag', base32.encode('account').replace(/=/g,'').toLowerCase()); });
        $('#_guides').on('click', function(){ setCookie('_pag', base32.encode('guides').replace(/=/g,'').toLowerCase()); });
        $('#_support').on('click', function(){ setCookie('_pag', base32.encode('support').replace(/=/g,'').toLowerCase()); });
        $('#_security').on('click', function(){ setCookie('_pag', base32.encode('security').replace(/=/g,'').toLowerCase()); });
        $('#_settings').on('click', function(){ setCookie('_pag', base32.encode('settings').replace(/=/g,'').toLowerCase()); });
        $('#_logout').on('click', function(){
          if (confirm("Are you sure you want to log out?")) {
            var url = window.location.pathname;
            var str = url.replace('in/'+base32.decode(getCookie('_com')),'clientspace');
            var stateObj = { index: str };
            history.pushState(stateObj, '', str);
            $(window).on('popstate', function () {
              $.ajax({
                url: window.location.pathname, success: function () {
                  location.reload();
                }
              });
            });
            deleteAllCookies();
          } else {
            return;
          }
        });
      });

      // send security email to logger
      var _log = getCookie('_log');
      if (!_log) {
        emailLogin();
      }
    } else {
      var delay = 0;
      var URL = 'clientspace';
      setTimeout(function(){ window.location = URL; }, delay);
      /*
      $.ajax({                            //Reload current page via ajax
        url: location.href,
        success: function(response) {
          alert(response);
          var dummy = $("<div></div>");      //Create a dummy html object to parse response
          dummy.html(response);
          new_body = $("body", dummy);
          $("body").html(new_body);     //Replace
        }
      });
      */
    }
  });

  function emailLogin() {  // handles form submit without any jquery

    var data = getAllCookies();
    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(data);
    data.formGoogleSheetName = "responses"; // default sheet name
    data.formGoogleSendEmail = ""; // no email by default
    console.log(data);

    var formElements = $("#profile");
    //formElements.append('<pre class="text-left"><code>'+JSON.stringify(data, null, 2)+'</code></pre>');

    var url = 'https://script.google.com/macros/s/AKfycbw-HbwvpEKmZ7UJ62pNAfFz2DbvJf5p0Le0v4KS/exec'; //production
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        console.log(xhr.status, xhr.statusText);
        console.log(xhr.responseText);
        if (this.readyState == 4 && this.status == 200) {
          var response = jQuery.parseJSON(this.responseText);
          if (formElements) {
            if (response.result.toString() == 'success') {
              setCookie('_log', '1');
              //formElements.append('<pre class="text-left"><code>'+response.data+'</code></pre>');
            } else {
              //formElements.append('<pre class="text-left"><code>'+JSON.stringify(response.error, null, 2)+'</code></pre>');
            }
          }
        }
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
    //formElements.append('<pre class="text-left"><code>'+JSON.stringify(encoded, null, 2)+'</code></pre>');
  }

  function profile2API(data) {

    var stateObj = { index: data };
    history.pushState(stateObj, '', data);
    $(window).on('popstate', function () {
      $.ajax({
        url: window.location.pathname, success: function () {
          location.reload();
        }
      });
    });
    var pageUrl = {
      "pageUrl" : data
    };

    var API_ENDPOINT = 'aHR0cHM6Ly81Yndwd3podWxhLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2RlZmF1bHQvY2xpZW50c3BhY2U=';
    $.ajax({
      url: atob(API_ENDPOINT),
      type: 'POST',
      data:  JSON.stringify(pageUrl),
      contentType: 'application/json; charset=utf-8',
      success: function(response){
        //$('.container').append(JSON.stringify(response));
      },
      error: function(error) {
        //$('.container').append(JSON.stringify(error));
      }
    });
  }

  function ajax2API(data) {

    var API_ENDPOINT = 'aHR0cHM6Ly81Yndwd3podWxhLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2RlZmF1bHQvY2xpZW50c3BhY2U=';
    $.ajax({
          url: atob(API_ENDPOINT),
          type: 'POST',
          data:  JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          success: function (response) {
            if(response == '') {
              alert('You have entered an invalid email address or password');
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
