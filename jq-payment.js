$(function(){
  $.getScript('jq-cookie.js', function() {
    var companySize = atob(getCookie('companySize'));
    var billingOption = atob(getCookie('billingOption'));
    $('input[name="company-size-input"][value="'+companySize+'"]').prop('checked', true);
    $('input[name="billing-input"][value="'+billingOption+'"]').prop('checked', true);

    $('input[type="submit"]').on('click', function(){
      setOptions(event);
      $("input[type=submit]").removeClass('show');
      $('button[type=button]').addClass('show');
    });
  });

  function setOptions(e) {

    var a3, p3, t3;

    var companySize = getCheckboxCheckedValue('company-size-input');
    var billingOption = getCheckboxCheckedValue('billing-input');

    if( companySize == 'Blogger' && billingOption == 'Monthly Billing') {
      a3 = '35';
      p3 = '1';
      t3 = 'M';
    };
    if( companySize == 'Blogger' && billingOption == 'Annual Billing') {
      a3 = '420';
      p3 = '1';
      t3 = 'Y';
    };
    if( companySize == 'Micro Enterprise' && billingOption == 'Monthly Billing') {
      a3 = '125';
      p3 = '1';
      t3 = 'M';
    };
    if( companySize == 'Micro Enterprise' && billingOption == 'Annual Billing') {
      a3 = '1500';
      p3 = '1';
      t3 = 'Y';
    };
    if( companySize == 'Small Enterprise' && billingOption == 'Monthly Billing') {
      a3 = '225';
      p3 = '1';
      t3 = 'M';
    };
    if( companySize == 'Small Enterprise' && billingOption == 'Annual Billing') {
      a3 = '2700';
      p3 = '1';
      t3 = 'Y';
    };
    if( companySize == 'Medium-sized Enterprise' && billingOption == 'Monthly Billing') {
      a3 = '400';
      p3 = '1';
      t3 = 'M';
    };
    if( companySize == 'Medium-sized Enterprise' && billingOption == 'Annual Billing') {
      a3 = '4800';
      p3 = '1';
      t3 = 'Y';
    };

    $('form[action="https://www.paypal.com/cgi-bin/webscr"]').append('\
      <input type="hidden" name="currency_code" value="EUR">\
      <input type="hidden" name="no_shipping" value="1">\
      <input type="hidden" name="a3" value="'+a3+'">\
      <input type="hidden" name="p3" value="'+p3+'">\
      <input type="hidden" name="t3" value="'+t3+'">\
      <input type="hidden" name="src" value="1">\
      <input type="hidden" name="sra" value="1">\
    ');
  }

  function getCheckboxCheckedValue(Checkbox_name) {
    var oCheckbox = document.forms[0].elements[Checkbox_name];
    for(var i = 0; i < oCheckbox.length; i++) {
      if (oCheckbox[i].checked) {
         return oCheckbox[i].value;
      }
    }
    return '';
  }
});
