$(function(){
  $.getScript('jq-cookie.js', function() {
    $("#refCode").prop('disabled', true);
    var contactForm = getUrlParameter('f');
    if(contactForm) {
      if(contactForm == 'press' ) {
        $('#enquiry-input option[value="Press"]').prop('selected', true);
      }
      if(contactForm == 'partner' ) {
        $('#enquiry-input option[value="Become a Partner"]').prop('selected', true);
      }
      if(contactForm == 'affiliate' ) {
        $('#enquiry-input option[value="Affiliate Program"]').prop('selected', true);
      }
      if(contactForm == 'account' ) {
        $('#enquiry-input option[value="Account"]').prop('selected', true);
      }
    }
    var cltID = getUrlParameter('c');
    if(cltID) {
      $('#ContactTitle').html('<div class="text-center mb-5"><h1>GDPR Enquiry Contact Form</h1><p class="lead">Regarding Company ID '+cltID+'</p>');
      $('#enquiry-input option[value="GDPR Enquiry"]').prop('selected', true);
      $('#enquiry-input').prop('disabled', true);
      //$('#enquiryInput').remove();
      $('#jobInput').prop('disabled', true);
      $('#jobInput').remove();
      $('#job-input').val('none_xyz');
      $('#companyNameInput').prop('disabled', true);
      $('#companyNameInput').remove();
      $('#company-name-input').val('none_xyz');
      $("#companyTypeInput").prop('disabled', true);
      $("#companyTypeInput").remove();
      $("#companySizeInput").prop('disabled', true);
      $("#companySizeInput").remove();
    }
    var refID = getCookie('refID');
    if(refID) {
      $("#refCode").html('<div class="form-group" id="refCode">\
      <label for="refCode">Referral Code</label>\
      <input type="text" id="refCode-input" class="form-control" value="'+refID+'" readonly>\
      </div>');
    }

    $('input[type="submit"]').on('click', function() {
      var data = submitToAPI(event);
      // add log record to spreedsheet
    });
  });

  function submitToAPI(e) {

    e.preventDefault();

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
    if (!$("#email-input").val()) {
      alert ("Please enter your email address");
      return;
    }
    var reemail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
    if (!reemail.test($("#email-input").val())) {
      alert ("Please enter a valid email address");
      return;
    }

    if ( !$("#enquiry-input").val() ) {
      alert("Please select an enquiry");
      return;
    }

    var arr = ["Talk with Sales Team","Account","Billing","Press","Become a Partner","Affiliate Program"];
    var enquiry = $("#enquiry-input").val();
    if ($.inArray(enquiry, arr) !== -1) {
      //alert(enquiry);
      var rejob = /[A-Za-z]{1}[A-Za-z]/;
      if (!rejob.test($("#job-input").val())) {
        alert ("Job title can not have less than 2 char");
        return;
      }
      var recompany = /[A-Za-z]{1}[A-Za-z]/;
      if (!recompany.test($("#company-name-input").val())) {
        alert ("Company/Affiliation can not have less than 2 char");
        return;
      }
    }
    if ( !$("#description-input").val() ) {
      alert("How may we assist you?");
      return;
    }

    $("input[type=submit]").removeClass('show');
    $('button[type=button]').addClass('show');

    var firstName = $("#first-name-input").val();
    var lastName = $("#last-name-input").val();
    var email = $("#email-input").val();
    var job = $("#job-input").val();
    var company = $("#company-name-input").val();
    var street1 = $("#street-address-1").val();
    var street2 = $("#street-address-2").val();
    var country = $("#country-input").val();
    var city = $("#city-input").val();
    var zip = $("#zip-input").val();
    var companyType = $("#company-type-input").val();
    var enquiry = $("#enquiry-input").val();
    var message = $("#description-input").val();
    var elementExists = document.getElementById("companySizeInput");
    if (elementExists) var companySize = getCheckboxCheckedValue("company-size-input");

    var refID = getCookie('refID');

    var cltID = getUrlParameter('c');
    if (cltID) {
      var data = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        street1 : street1,
        street2 : street2,
        country : country,
        city : city,
        zip : zip,
        enquiry : enquiry,
        message : message,
        ClientID : cltID,
        refID : refID
      };
    } else {
      var data = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        job : job,
        company : company,
        street1 : street1,
        street2 : street2,
        country : country,
        city : city,
        zip : zip,
        companyType : companyType,
        companySize : companySize,
        enquiry : enquiry,
        message : message,
        ClientID : cltID,
        refID : refID
      };
    }

    var API_ENDPOINT = atob('aHR0cHM6Ly81MmFscGRndWFmLmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3Byb2R1Y3Rpb24vY29udGFjdC11cw==');
    $.ajax({
      type: "POST",
      url : API_ENDPOINT,
      dataType: "json",
      crossDomain: "true",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function () {
        // clear form and show a success message
        alert("Your message has been sent successfully.\nOur team will reach out to you as soon as possible.");
        document.getElementById("contact-form").reset();
        location.reload();
      },
      error: function () {
        // show an error message
        alert("UnSuccessfull");
      }
    });
    return data;
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
    for(var i = 0; i < oCheckbox.length; i++){
      if(oCheckbox[i].checked){
         return oCheckbox[i].value;
      }
    }
    return '';
  }
});
