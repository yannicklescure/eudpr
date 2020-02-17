$(function() {
  $.getScript('jq-cookie.js', function() {
    $.getScript('jq-base32.js', function() {
      var dataStatus = localStorage.getItem('dataStatus');
      if(dataStatus) {
        $('#section-start').html(dataStatus);
      } else {
        var dataSU = localStorage.getItem('dataSU');
        if(dataSU) {
          var tab = base32.decode(dataSU).split("|");
          var company = {
            firstname : tab[0],
            lastname : tab[1],
            email : tab[2],
            job : tab[3],
            companyName : tab[4],
            companyWebsite : tab[5],
            street1 : tab[6],
            street2 : tab[7],
            country : tab[8],
            city : tab[9],
            zip : tab[10],
            companyType : tab[11],
            companyEntityState : tab[12],
            companyEntityType : tab[13],
            companySize : tab[14],
            billingOption : tab[15],
            enquiry : tab[16],
            hostname : tab[17],
            ip : tab[18]
          };
        } else {
          $('#section-start').empty();
          var delay = 0; //milliseconds
          var URL = 'https://eudpr.com';
          setTimeout(function(){ window.location = URL; }, delay);
        }
        var data = {
            firstname : company.firstname,
            lastname : company.lastname,
            email : company.email,
            job : company.job,
            company : company.companyName,
            website : company.companyWebsite,
            street1 : company.street1,
            street2 : company.street2,
            country : company.country,
            city : company.city,
            zip : company.zip,
            type : company.companyType,
            state : company.companyEntityState,
            entity : company.companyEntityType,
            size : company.companySize,
            option : company.billingOption,
            enquiry : company.enquiry,
            hostname : company.hostname,
            ip : company.ip
          };
        $('#company-company, #company-company2').text(company.companyName);
        $('#company-fullname, #company-fullname2').text(company.firstname +' '+ company.lastname);
        $('#company-position, #company-position2').text(company.job);
        $('#company-entity-state').text(company.companyEntityState);
        $('#company-entity-type').text(company.companyEntityType);
        var membershipFees = getSubscriptionFees(company.companySize, company.billingOption);
        data.membershipFees = membershipFees;
        $('#company-size').html(company.companySize +', recurring '+ company.billingOption.toLowerCase() +' of &euro;'+ membershipFees + ' EUR.');
        $('#company-email').text(company.email);
        var today = new Date();
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $('#date1').text(today.getDate() +' '+ months[today.getMonth()] +' '+ today.getFullYear());
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) dd = '0'+dd;
        if(mm<10) mm = '0'+mm;
        today = dd + '/' + mm + '/' + yyyy;
        $('#date2, #date3').text(today);
        $('#company-companyName').text(company.companyName);
        if(company.street2) {
          $('#company-address').html(company.street1 +'<br />'+ company.street2 + '<br />'+ company.city +', '+ company.country+'<br />'+ company.zip);
        } else {
          $('#company-address').html(company.street1 +'<br />'+ company.city +', '+ company.country+'<br />'+ company.zip);
        }
        $('#company-country').text(company.country);
        var dataUrlString = localStorage.getItem("dataUrl");
        if (dataUrlString) {
          $('#signature-result').removeClass('d-none');
          $('#company-signature').addClass('d-none');
          $('#signature').addClass('d-none');
          $('#signature-default').removeClass('d-none');

          dataUrlString = base32.decode(localStorage.getItem("dataUrl"));
          var img = $('<img class="img-fluid signature-result" alt="signature" width="100%">').attr('src', dataUrlString);
          $('.signature-result').html(img);
        } else {
          $('#company-signature').text(company.firstname.charAt(0) +'.'+ company.lastname);
        }
        $.getJSON("designee.json", function(designee) {
          $('#designee-company, #designee-company2').text(designee.companyName);
          $('#designee-fullname, #designee-fullname2').text(designee.firstname +' '+ designee.lastname);
          $('#designee-position, #designee-position2').text(designee.job);
          $('#designee-entity-state').text(designee.companyEntityState);
          $('#designee-entity-type').text(designee.companyEntityType);
          if(designee.street2) {
            $('#designee-address').html(designee.street1 +'<br />'+ designee.street2 + '<br />'+ designee.city +', '+ designee.country+'<br />'+ designee.zip);
            $('#designee-contact-information').html(designee.street1 +'<br />'+ designee.street2 + '<br />'+ designee.city +', '+ designee.country+'<br />'+ designee.zip);
          } else {
            $('#designee-address').html(designee.street1 +'<br />'+ designee.city +', '+ designee.country+'<br />'+ designee.zip);
            $('#designee-contact-information').html(designee.companyName + '<br />'+ designee.street1 +'<br />'+ designee.city +', '+ designee.country+'<br />'+ designee.zip);
          }
          $('#designee-country').text(designee.country);
          $('#designee-signature').text(designee.firstname.charAt(0) +'.'+ designee.lastname);
          var base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsYAAADICAYAAADr/SfsAAAgAElEQVR4Xu2dCdwd0/3/kZ0U0Z8tsjwkhNBQoZaioVTsW4ou9qDqF0qiSvlJiFqrRau1hErqXyRFtUQkldhqjaWJSORJ8mS3VIVGxJPF//295qZzJzP3zr3PvXe2z7xe87rPc++Zc77f9zkz85kz53zPuutoEwEREAEREAEREAEREAERWGddMRABERABERABERABERABEVhHwliNQAREQAREQAREQAREQASMgHqM1Q5EQAREQAREQAREQAREQMJYbUAEREAEREAEREAEREAEviSgHmO1BBEQAREQAREQAREQARGQMFYbEAEREAEREAEREAEREAH1GKsNiIAIiIAIiIAIiIAIiMAaAhpKocYgAiIgAiIgAiIgAiIgAhCQMFYzEAEREAEREAEREAEREAEJY7UBERABERABERABERABEfiSgHqM1RJEQAREQAREQAREQAREQMJYbUAEREAEREAEREAEREAE1GOsNiACIiACIiACIiACIiACawhoKEXEjWHrrbc+cs6cOY9GbIaKFwEREAEREAEREIHME5AwjqAJdO7cef0OHToMXr169U/WZcOEm0uZQbJlpF+83nrrLVq5cuVi/l/c1NS0pNRx+l0EREAEREAEREAERCAcAQnjcJyqnmqbbbb5PZmeXUbGM0jby5P+U/5fzL7oiy++yIll9kUmoO3vVatWLZKALoOwkoqACIiACIiACGSagIRxRNXfs2fPvRCw/yij+P+Q9itlpHcnzQvoxQjonFjmx43ZmyrMr5LD/kPZU/F5yty5c618bSIgAiIgAiIgAiIQKwISxhFWB73GX0RYfL2LHk+BBzmFvsvnFNsR6VNMMDNEZEpjY+Pn9TZK5YmACIiACIiACIhAnoCEcYRtIWPC2MTwFiVwT0Mk5wSzieU2bdpMmTlz5uwIq0hFi4AIiIAIiIAIZIiAhHGEld2jR4+rEYDrY8LHxcwgTQM9q0vYt+TvzqTdkt0+O1Ro/icct2GFx9b7MGOTE8t5wWziWRMP610NKk8EREAEREAE0k9AwjjBddytW7dObdu23ZJxu50Ri1syHCEnnB0BnRfP9mni2735TeRLGok5NgzDEcxT7W+GYryVNCdkrwiIgAiIgAiIQHwISBjHpy5qZolLQOeEsyOgvWK5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rjliFZAkAvQa74O9z7CvdW4gmocwrOKXSfJHtoqACIiACIiACIQnIGEcnpVSZoQAPccnIoL/5OeuTcabNWvWAxlBITdFQAREQAREIFMEJIwzVd1yNiwBIlUMQQTf4JN+Nd/vhzh+PmxeSicCIiACIiACIpAMAhLGyagnWRkBAYZV/Ipif+JT9Ft89z3GHE+JwCwVKQIiIAIiIAIiUCMCEsY1Aqts00EAcTwaTwbkvcmHceP/pvXWW+/wxsZGE8naREAEREAEREAEUkBAwjgFlSgXakegb9++bZYsWfIMgnhP9nEMozjYVdowvvsdE/Leq50FylkEREAEREAERKBeBCSM60Va5SSWQAObjTdmX9NzjDN/5P9NEcZvMqTi4sQ6J8NFQAREQAREQATWEJAwVmMQgRAEiFSxEyL4MZJ2Y5/F3sM5bCXfd1GvcQiISiICIiACIiACMScgYRzzCpJ58SHQs2fPfqtXr57oY9FQeo2HxcdSWSICIiACIiACIlAJAQnjSqjpmMwSIIzb9Qyh2BmBfFNTU9O4zIKQ4yIgAiIgAiKQQgISximsVLlUOwIMN94CQfxu7UpQziIgAiIgAiIgAlERkDCOirzKFQEREAEREAEREAERiBUBCeNYVYeMEQEREAEREAEREAERiIqAhHFU5FWuCIiACIiACIiACIhArAhIGMeqOmSMCIiACIiACIiACIhAVAQkjKMir3JFQAREQAREQAREQARiRUDCOFbVIWNEQAREQAREQAREQASiIiBhHBV5lSsCIiACIiACIiACIhArAhLGsaoOGSMCIiACIiACIiACIhAVAQnjqMirXBEQAREQAREQAREQgVgRkDCOVXXIGBEQAREQAREQAREQgagISBhHRV7lioAIiIAIiIAIiIAIxIqAhHGsqkPGiIAIiIAIiIAIiIAIREVAwjgq8ipXBERABERABERABEQgVgQkjGNVHTJGBERABERABERABEQgKgISxlGRV7kiIAIiIAIiIAIiIAKxIiBhHKvqkDEiIAIiIAIiIAIiIAJREfj/Vjm/BDOyyu4AAAAASUVORK5CYII=";
          var img = $('<img class="img-fluid signature-result" alt="signature" style="width: 100%">').attr('src', base64);
          $('#designee-signature').html(img);
        });
        if ($('.js-signature').length) {
          $('#hw-signature').removeClass('d-none');
          $('#hw-signature').addClass('d-block');
          $('.js-signature').jqSignature({border: '1px solid #AAAAAA', height: 200, autoFit: true, lineWidth: 5});
          $('.js-signature').jqSignature('clearCanvas');
          $('[value="Save Signature"]').attr('disabled', true);
          $('#signature').addClass('d-none');
          $('#signature-default').addClass('d-none');
          /*
          $('#signature-default').on('click', function() {
              $('#hw-signature').removeClass('d-block');
              $('#hw-signature').addClass('d-none');
              $('#company-signature').text(company.firstname.charAt(0) +'.'+ company.lastname);
              $('#company-signature').removeClass('d-none');
              $('#signature-result').addClass('d-none');
              $('#signature').removeClass('d-none');
              $('#signature-default').addClass('d-none');
              localStorage.removeItem("dataUrl");
          });
          */
          $('[value="Clear Canvas"]').on('click', function() {
            $('.js-signature').jqSignature('clearCanvas');
            //$('.signature-result').empty();
            $('[value="Save Signature"]').attr('disabled', true);
            localStorage.removeItem("dataUrl");
          });

          $('[value="Save Signature"]').on('click', function() {
            var dataUrl = $('.js-signature').jqSignature('getDataURL');
            var dataUrlString = base32.encode(dataUrl);
            localStorage.setItem("dataUrl", dataUrlString);
            var dataUrlString = base32.decode(localStorage.getItem("dataUrl"));
            $('#company-signature').addClass('d-none');
            $('#signature-result').removeClass('d-none');
            $('#hw-signature').removeClass('d-block');
            $('#hw-signature').addClass('d-none');
            var img = $('<img class="img-fluid signature-result" alt="signature" style="width: 100%">').attr('src', dataUrlString);
            $('.signature-result').html(img);
            $('.js-signature').jqSignature('clearCanvas');
            $('.hw-signature').removeClass('show');
            //$('#signature-default').removeClass('d-none');
            $('.finalCheck').removeClass('d-none');
          });
          $('.js-signature').on('jq.signature.changed', function() {
            $('[value="Save Signature"]').attr('disabled', false);
        	});
        }
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

          submitToAPI(data);
          //TODO add log record to spreedsheet
        });

        function submitToAPI(data) {
          var dataUrlString = localStorage.getItem("dataUrl");
          if (dataUrlString) {
            dataUrlString = base32.decode(dataUrlString);
            data.signature = Math.ceil((dataUrlString.length)/5844);
            data.part = 0;
          } else {
            data.signature = 0;
            data.part = 0;
          }
          $.ajax({
            url: "https://script.google.com/macros/s/AKfycbyS-MWjisKd59KM9AdSIYZsoB39aEupDiNKtG5fYA/exec",
            type: "POST",
            data: data,
            contentType: "application/javascript",
            dataType: 'jsonp'
          })
          .done(function(res) {
            console.log('success')
          })
          .fail(function(e) {
            console.log("error")
          });
          var dataUrlString = localStorage.getItem("dataUrl");
          if (dataUrlString) {
            dataUrlString = base32.decode(dataUrlString);
            var exit = false,
            m = 1;
            while (dataUrlString.length > 0) {
              str = dataUrlString.substr(0, 5843);
              data = {
                part: m,
                signature: str
              };
              m +=1;
              if (dataUrlString.length >= 5844) {
                dataUrlString = dataUrlString.slice(5843, dataUrlString.length);
              } else {
                dataUrlString = dataUrlString.slice(0, dataUrlString.length);
                exit = true;
              }
              $.ajax({
                url: "https://script.google.com/macros/s/AKfycbyS-MWjisKd59KM9AdSIYZsoB39aEupDiNKtG5fYA/exec",
                type: "POST",
                data: data,
                contentType: "application/javascript",
                dataType: 'jsonp'
              })
              .done(function(res) {
                console.log('success')
              })
              .fail(function(e) {
                console.log("error")
              });

              if (exit) break;
            }
          }
          window.receipt = function(res) {
            // this function will execute upon finish
            //$('button[type=button]').html('data sent!');
            var dataStatus = '<div class="my-5 d-flex h-50">\
              <h1>EUDPR Article 27 Representative Agreement</h1>\
              <div class="mt-5">\
                <p>Welcome to our community.</p>\
                <p>Please, check your email inbox to verify that you received a signed copy of our agreement.</p>\
                <p>Sincerely,<br />EUDPR team</p>\
              </div>\
            </div>';
            localStorage.setItem("dataStatus", dataStatus);
            $('#section-start').html(dataStatus);
          }
        }

        function getSubscriptionFees(companySize, billingOption) {
          if( companySize == 'Blogger' && billingOption == 'Monthly Billing') {
            a3 = '35';
          };
          if( companySize == 'Blogger' && billingOption == 'Annual Billing') {
            a3 = '420';
          };
          if( companySize == 'Micro Enterprise' && billingOption == 'Monthly Billing') {
            a3 = '125';
          };
          if( companySize == 'Micro Enterprise' && billingOption == 'Annual Billing') {
            a3 = '1500';
          };
          if( companySize == 'Small Enterprise' && billingOption == 'Monthly Billing') {
            a3 = '225';
          };
          if( companySize == 'Small Enterprise' && billingOption == 'Annual Billing') {
            a3 = '2700';
          };
          if( companySize == 'Medium-sized Enterprise' && billingOption == 'Monthly Billing') {
            a3 = '400';
          };
          if( companySize == 'Medium-sized Enterprise' && billingOption == 'Annual Billing') {
            a3 = '4800';
          };
          return a3;
        }
      }
    });
  });
});
