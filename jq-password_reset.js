$(function() {
  $.getScript('jq-cookie.js', function() {

    $.getJSON('https://ipapi.co/json/', function(data) {
      var _cip = btoa(data.ip).replace(/=/g,'');
      setCookie('_cip', _cip);
    });

    var e = getUrlParameter('email');
    if (e) {
      $.getScript('jq-base32.js', function() {
        var t = new Date();
        var str = getCookie('password_reset');
        var pageUrl = $(location).attr('pathname');
        var stateObj = { index: pageUrl };
        history.pushState(stateObj, '', pageUrl);
        $(window).on('popstate', function () {
          $.ajax({
            url: window.location.pathname, success: function () {
              location.reload();
            }
          });
        });
        deleteCookie('password_reset');
        var email_submit = e;
        $('input[name="email"]').val(email_submit);
        $('input[value="Send password reset email"]').on('click', function() {
          if (getCookie('email_form')) deleteCookie('email_form');
          if (getCookie('email_sent')) deleteCookie('email_sent');
          var forms = document.querySelectorAll("form.eform");
          for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", handleEmailFormSubmit, false);
          }
        });
        $('input[value="Send password reset email"]').trigger( "click" );
      });
    }

    var n = getUrlParameter('n'); //password_reset from url
    if (n) {
      setCookie('password_reset', n);
      deleteCookie('email_sent');
      var pageUrl = $(location).attr('pathname');
      var stateObj = { index: pageUrl };
      history.pushState(stateObj, '', pageUrl);
      $(window).on('popstate', function () {
        $.ajax({
          url: window.location.pathname, success: function () {
            location.reload();
          }
        });
      });
      location.reload();
    } else {
      var password_reset = getCookie('password_reset'); //password_reset from cookie
      if (password_reset && getCookie('password_reset') != '') {
        $.getScript('jq-base32.js', function() {
          var t = new Date();
          var str = password_reset;
          var d = base32.decode(str.slice(64,64+21)).replace(/o/gi,'0');
          if (t.getTime() > (parseInt(d)+10800000)) { //check password_reset age // 10800000 milliseconds = 3 hours
            $('.collapse').removeClass('show');
            $('.emailform').addClass('show');
            var _eid = base32.decode(str.slice(64+21,str.length));
            $('.warning').html('\
              <div class="alert alert-danger alert-dismissible fade show" role="alert">\
                <span>It looks like you clicked on an invalid password reset link. Please try again.</span>\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                  <span aria-hidden="true">&times;</span>\
                </button>\
              </div>');
            //deleteCookie('password_reset');
            //location.reload();
            //$('#main').append(t.getTime()+'<br />'+ (parseInt(d)+10800000)); //3 hours = 10800000 milliseconds
          } else {
            $('.collapse').removeClass('show');
            $('.passwordform').addClass('show');
            var str = password_reset;
            var _eid = base32.decode(str.slice(64+21,str.length));
            $('#_eid').text(_eid);
            $("input[type=submit]").addClass('show');
            $('input[value="Change password"]').on('click', function() {
              var forms = document.querySelectorAll("form.pform");
              for (var i = 0; i < forms.length; i++) {
                forms[i].addEventListener("submit", handlePasswordFormSubmit, false);
              }
            });
          }
        });
      } else {
        var email_sent = getCookie('email_sent');
        if(!email_sent) {
          $('.collapse').removeClass('show');
          $('.emailform').addClass('show');
          $("input[type=submit]").addClass('show');
          $('input[value="Send password reset email"]').on('click', function() {
            var forms = document.querySelectorAll("form.eform");
            for (var i = 0; i < forms.length; i++) {
              forms[i].addEventListener("submit", handleEmailFormSubmit, false);
            }
          });
        } else {
          if (email_sent == 1) {
            $('.collapse').removeClass('show');
            $('.email_sent').addClass('show');
          } else {
            $('.collapse').removeClass('show');
            $('.emailform').addClass('show');
            $.getScript('jq-base32.js', function() {
              var _eid = base32.decode(getCookie('email_form'));
              $('input[name="email"]').val(_eid);
              $('.warning').html('\
                <div class="alert alert-warning alert-dismissible fade show" role="alert">\
                  <span>We couldn\'t find an EUDPR account associated with '+ _eid +'</span>\
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                  </button>\
                </div>');
            });
            $("input[type=submit]").addClass('show');
            $('input[value="Send password reset email"]').on('click', function() {
              if (getCookie('email_form')) deleteCookie('email_form');
              if (getCookie('email_sent')) deleteCookie('email_sent');
              var forms = document.querySelectorAll("form.eform");
              for (var i = 0; i < forms.length; i++) {
                forms[i].addEventListener("submit", handleEmailFormSubmit, false);
              }
            });
          }
        }
      }
    }
  });

  function validEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email); // return true or false
  }

  function validPassword(password1, password2) {
    if (password1 == password2) return true
    else return false
  }

  function validateHuman(honeypot) {
    if (honeypot) {  //if hidden form filled up
      console.log("Robot Detected!");
      return true;
    } else {
      console.log("Welcome Human!");
    }
  }

  // get all data in form and return object
  function getFormData(form) {
    var elements = form.elements;
    var fields = Object.keys(elements).filter(function(k) {
          return (elements[k].name !== "honeypot");
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });

    var formData = {};
    fields.forEach(function(name){
      var element = elements[name];

      // singular form elements just have one value
      formData[name] = element.value;

      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });

    // add hostname value into the data
    formData["hostname"] =  $(location).attr('hostname');
    fields.push(formData["hostname"]);

    // add client ip address into the data
    formData["ip"] =  atob(getCookie('_cip'));
    fields.push(formData["ip"]);

    // add password_reset encrypted data into the data
    var password_reset = getCookie('password_reset');
    if (password_reset) {
      formData["password_reset"] =  password_reset;
      fields.push(formData["password_reset"]);
    }

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default
    console.log(formData);

    return formData;
  }

  function handleEmailFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target;
    var data = getFormData(form);         // get the values submitted in the form
    //$(".collapse").append('<pre class="text-left"><code>'+JSON.stringify(data, null, 2)+'</code></pre>');

    /* OPTION: Remove this comment to enable SPAM prevention, see README.md
    if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
      return false;
    }
    */

    /*
    alert(JSON.stringify(data));
    alert(data.email);
    */
    if(data.email) {   // if email is not valid show error
      var invalidEmail = validEmail(data.email);
      if (invalidEmail == false) {
        alert ("Please enter a valid email address");
        return false;
      } else {
        disableAllButtons(form);
        $("input[type=submit]").removeClass('show');
        $('button[type=button]').addClass('show');
        var url = "https://script.google.com/macros/s/AKfycbz_P_TRH_5yW86oRnPsRFHI5CyOyrkQvCoc78lTsfkPRLGNH735/exec"; // production
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
          console.log(xhr.status, xhr.statusText);
          console.log(xhr.responseText);
          if (this.readyState == 4 && this.status == 200) {
            var response = jQuery.parseJSON(this.responseText);
            var formElements = $(".collapse");
            if (formElements) {
              if (response.result == 'success') {
                //formElements.append('<pre class="text-left"><code>'+response.result+'</code></pre>');
                //formElements.append('<pre class="text-left"><code>'+response.data+'</code></pre>');
                setCookie('email_sent', '1');
                location.reload();
              } else if (response.result == 'fail') {
                if (getCookie('email_form')) deleteCookie('email_form');
                if (getCookie('email_sent')) deleteCookie('email_sent');
                setCookie('email_sent', '0');
                $.getScript('jq-base32.js', function() {
                  setCookie('email_form', base32.encode(data.email).replace(/=/g,'').toLowerCase());
                });
                //formElements.append('<pre class="text-left"><code>'+response.result+'</code></pre>');
                //formElements.append('<pre class="text-left"><code>'+response.data+'</code></pre>');
                location.reload();
              } else {
                //formElements.append('<pre class="text-left"><code>'+JSON.stringify(response.result, null, 2)+'</code></pre>');
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
      }
    }
  }

  function handlePasswordFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target;
    var data = getFormData(form);         // get the values submitted in the form

    //$('.collapse').validator();
    //$('.collapse').append('<pre class="text-left"><code>'+JSON.stringify(data, null, 2)+'</code></pre>');

    if(data.password1) {   // if password is not valid show error
      var invalidPassword = validPassword(data.password1,data.password2);
      if (invalidPassword == false) {
        alert ("Please make to type two times the same password");
        return false;
      } else {
        disableAllButtons(form);
        $("input[type=submit]").removeClass('show');
        $('button[type=button]').addClass('show');
        var url = "https://script.google.com/macros/s/AKfycbwRd7ld_qk94hEEAe1MKVYt4yq1V7g_IxOWYV7TVA/exec"; // production
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            console.log(xhr.status, xhr.statusText);
            console.log(xhr.responseText);
            if (this.readyState == 4 && this.status == 200) {
              var response = jQuery.parseJSON(this.responseText);
              var formElements = $(".collapse");
              if (formElements) {
                if (response.result.toString() == 'success') {
                  setCookie('data_reset', 'true');
                  //New password set successfully.
                  //formElements.append('<pre class="text-left"><code>'+response.data+'</code></pre>');
                  var url = 'clientspace';
                  var stateObj = { index: url };
                  history.pushState(stateObj, '', url);
                  $(window).on('popstate', function () {
                    $.ajax({
                      url: window.location.pathname, success: function () {
                        location.reload();
                      }
                    });
                  });
                  location.reload();
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
      }
    }
  }

  /*
  function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);
  */
  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
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

  function getCheckboxCheckedValue(Checkbox_name) {
    var oCheckbox = document.forms[0].elements[Checkbox_name];
    for(var i = 0; i < oCheckbox.length; i++)
    {
      if(oCheckbox[i].checked)
      {
         return oCheckbox[i].value;
      }
    }
    return '';
  }
});
