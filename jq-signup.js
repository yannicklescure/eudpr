$(function() {
  $.getScript('jq-cookie.js', function() {

    $.getJSON('https://ipapi.co/json/', function(data) {
      var _cip = btoa(data.ip).replace(/=/g,'');
      setCookie('_cip', _cip);
    });
    var refID = getCookie('refID');
    if(refID) {
      $("#refCode").html('<div class="form-group" id="refCode">\
      <label for="refCode">Referral Code</label>\
      <input type="text" id="refCode-input" class="form-control" value="'+refID+'" readonly>\
      </div>');
    }

    $.getJSON("entityRegistration.json", function(newOptions) {
      var $el = $("#company-entity-state-input");
      $el.empty(); // remove old options
      $el.append($('<option disabled selected value> -- select an option -- </option>'));
      $.each(newOptions, function(key,value) {
        $el.append($("<option></option>").attr("value", key).text(key));
      });
      $el.append($('<option value="Other">Other</option>'));

      $("#company-type-input").on('change', function() {
        $("#company-entity-state").addClass('show');
      });
      $("#company-entity-state-input").on('change', function() {
        $("#company-entity-type").addClass('show');
        var $key = $("#company-entity-state-input").val();
        var $el = $("#company-entity-type-input");
        $el.empty(); // remove old options
        $el.append($('<option disabled selected value> -- select an option -- </option>'));
        var value = newOptions[$key];
        for(var i in value) {
          $el.append($("<option></option>").attr("value", value[i]).text(value[i]));
        };
        $el.append($('<option value="Other">Other</option>'));
      });

    });

    $("input[type=submit]").prop('disabled', true);
    $("#defaultCheck1").on('change', function() {
      if ($("#defaultCheck1").is(':checked')) {
        $("input[type=submit]").prop('disabled', false);
      } else if (!$("#defaultCheck1").is(':checked')) {
        $("input[type=submit]").prop('disabled', true);
      }
    });

    $('input[type="submit"]').on('click', function() {
      $("input[type=submit]").removeClass('show');
      $('button[type=button]').addClass('show');
      var data = submitToAPI(event);
      // add log record to spreedsheet
    });
  });

  function submitToAPI(event) {

    event.preventDefault();

    var FirstNamere = /[A-Za-z]{1}[A-Za-z]/;
    if (!FirstNamere.test($("#first-name-input").val())) {
      alert ("First name can not have less than 2 char");
      return;
    }

    var LastNamere = /[A-Za-z]{1}[A-Za-z]/;
    if (!LastNamere.test($("#last-name-input").val())) {
      alert ("Last name can not have less than 2 char");
      return;
    }

    if ($("#email-input").val()=="") {
      alert ("Please enter your email address");
      return;
    }
    var reemail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
    if (!reemail.test($("#email-input").val())) {
      alert ("Please enter a valid email address");
      return;
    }

    var Jobre = /[A-Za-z]{1}[A-Za-z]/;
    if (!Jobre.test($("#job-input").val())) {
      alert ("Job title can not have less than 2 char");
      return;
    }
    var Companyre = /[A-Za-z]{1}[A-Za-z]/;
    if (!Companyre.test($("#company-name-input").val())) {
      alert ("Company/Affiliation can not have less than 2 char");
      return;
    }

    var recompweb = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (!recompweb.test($("#company-website-input").val())) {
      alert ("Please correct the company website url");
      return;
    }

    if ( !$("#company-type-input").val() ) {
      alert("Please select a company type");
      return;
    }

    if ( !$("#company-entity-state-input").val() ) {
      alert("Please select a state or province of business registration");
      return;
    }

    if ( !$("#company-entity-type-input").val() ) {
      alert("Please select a type of business entity");
      return;
    }

    if (!$("#defaultCheck1").is(':checked')) {
      alert("Please make sure to agree to the Terms and Conditions");
      return;
    }

    $("input[type=submit]").removeClass('show');
    $('button[type=button]').addClass('show');

    var firstName = $("#first-name-input").val();
    var lastName = $("#last-name-input").val();
    var email = $("#email-input").val();
    var job = $("#job-input").val();
    var companyName = $("#company-name-input").val();
    var companyWebsite = $("#company-website-input").val();
    var street1 = $("#street-address-1").val();
    var street2 = $("#street-address-2").val();
    var country = $("#country-input").val();
    var city = $("#city-input").val();
    var zip = $("#zip-input").val();
    var companyType = $("#company-type-input").val();
    var companyEntityState = $("#company-entity-state-input").val(); // https://en.wikipedia.org/wiki/List_of_legal_entity_types_by_country
    var companyEntityType = $("#company-entity-type-input").val(); // https://en.wikipedia.org/wiki/List_of_legal_entity_types_by_country
    var companySize = getCheckboxCheckedValue("company-size-input");
    setCookie('companySize', btoa(companySize));
    var billingOption = getCheckboxCheckedValue("billing-input");
    setCookie('billingOption', btoa(billingOption));
    var enquiry = $("#enquiry-input").val();

    var data = {
      firstName : firstName,
      lastName : lastName,
      email : email,
      job : job,
      companyName : companyName,
      companyWebsite : companyWebsite,
      street1 : street1,
      street2 : street2,
      country : country,
      city : city,
      zip : zip,
      companyType : companyType,
      companyEntityState : companyEntityState,
      companyEntityType : companyEntityType,
      companySize : companySize,
      billingOption : billingOption,
      enquiry : 'Sign-up'
    };

    if (getCookie('refID')) data.refID = 'refID';
    data.hostname =  $(location).attr('hostname');
    data.ip =  atob(getCookie('_cip'));

    $.getScript('jq-base32.js', function() {
      var dataSU = [];
      for (var i in data) {
        dataSU.push(data[i]);
      }
      //setCookie('dataSU', base32.encode(dataSU.join('|')));
      localStorage.setItem('dataSU', base32.encode(dataSU.join('|')));
    });

    $.ajax({
      url : "https://l7hroqobt0.execute-api.us-east-1.amazonaws.com/production/signup",
      type: 'POST',
      data:  JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      success: function (response) {
        // clear form and show a success message
        /*
        alert("Your request has been sent successfully.\nWe will prepare your account and will be getting back to you as soon as possible.");
        document.getElementById("signup-form").reset();
        location.reload();
        */
        $.getScript('jq-payment.js', function() {
          var delay = 1000;
          var URL = 'payment';
          setTimeout(function(){
            window.location = URL;
          }, delay);
        });
      },
      error: function (error) {
        // show an error message
        alert("UnSuccessfull");
      }
    });
    return data;
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
