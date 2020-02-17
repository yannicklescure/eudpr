var contentURI= 'https://www.eudpr.com';
$(document).ready(function(){

  $('#eudpr-mediakit').html('');
  $('#eudpr-mediakit').append('<p style="margin-top: 1.5em"><span style="font-size:1.25rem;font-weight:300">EUDPR</span><br />\
  Website: <a href="https://www.eudpr.com" target="_blank">https://www.eudpr.com</a><br />\
  Address: 12 place d’Anvers, 75009 Paris<br />\
  Email: info@eudpr.com<br />\
  GDPR enquiry:</p>');

  $('#eudpr-mediakit').append('<div class="eudpr" style="margin-top: 1.5em">\
    <a href="https://www.eudpr.com/referral?r=ClientID" target="_blank">\
    <img src="https://eudpr.com/media/btn-lg.png" style="border-radius: 4px" height="64" width="256" alt="EUDPR, our GDPR representative!">\
    </a>\
    </div>');

  var hostname = $(location).attr('hostname');

  $.getJSON('https://ipapi.co/json/', function(data) {
    var result = {
      "hostname" : hostname,
      "data" : data
    };
    $('#eudpr-mediakit').append('<span style="margin-top: 1.5em; display: block"></span>');
    $('#eudpr-mediakit').append('\
    <p><em>Note:<br />\
    1. EUDPR whitelist its clients and blacklist publicly counterfeit.<br />\
    2. The text in JSON format below represents the information collected when a lambda user uses EUDPR logo on its website.</p>\
    <pre><code>'+JSON.stringify(result, null, 2).toString()+'</code></pre>');
  });

});
