$(function() {
  $.getScript('jq-cookie.js', function() {

    if (preloadImage()) {
      //alert('done');
    };

    $("#navHTML").load("navHTML1", function() {
      $("#navHTML1").addClass("collapse");
    });
    $("#navHTML").load("navHTML0", function() {

      var sidenav = sideNav();

      $(".dropdown").on("hide.bs.dropdown", function() {
          $(".dropdown-toggle").html("Product <i class='fas fa-angle-down'></i>");
      });
      $(".dropdown").on("show.bs.dropdown", function() {
        $(".dropdown-toggle").html("Product <i class='fas fa-angle-up'></i>");
      });

      if (document.location.href.match(/[^\/]+$/)) navbarActive(); // bold active page string
      //$("#navHTML1").removeClass("d-md-block");
      $("#navHTML0").addClass("collapse");
      $("#navHTML0").addClass("show");
      if ($(window).width() >= 992 ) {
        $('.navbar').removeClass('bg-light');
        $('.dropdown-menu').addClass('bg-light');
        $('.dropdown-menu').removeClass('border-0');
        if (document.location.href.match(/[^\/]+$/)) {
          var name = document.location.href.match(/[^\/]+$/)[0];
          if (name && name.indexOf('#') == -1 && name != 'index.html') {
            $('.navbar').addClass('bg-light');
            $('.dropdown-menu').removeClass('border-0');
          }
        } else {
          $('.dropdown-menu').removeClass('border-0');
        }
      }
    });

    var sectionStartHeight = $('.landingPage').outerHeight();
    var cardHeight = $('.card').outerHeight();
    if (sectionStartHeight < cardHeight) {
      $('#landingPage').removeClass('d-flex h-100');
      $('.landingPage').css('height', cardHeight);
      //$('div[class="col-12 pt-5 pb-3"]').removeClass('pt-5');
    }
    if ($(window).width() >= 992 && $(window).width() <= 1024) {
      $('.card').removeClass('col-lg-5');
      $('.card').addClass('col-lg-6');
    }
    //alert('cardHeight '+cardHeight+'\nsectionStartHeight '+sectionStartHeight);

    //check for Navigation Timing API support
    /*
    if (window.performance) {
      console.info("window.performance works fine on this browser");
    }
    if (performance.navigation.type == 1) {
      alert( "This page is reloaded" );
    } else {
      alert( "This page is not reloaded");
    }
    */
    if (performance.navigation.type == 1) {
      navbarLoad();
    }
    $(window).on('scroll', function() {
      var winScroll = $(window).scrollTop();
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      setCookie('scrolled', scrolled);
      //$('.progress-bar').width( scrolled + '%');
      //document.getElementById('.progress-bar').style.width = scrolled + "%";

      navbarLoad();
      var sidebarHeight = navbarScroll();
      setCookie('sidebarHeight', sidebarHeight);
    });
    //setCookie('article27','0');
    $("#footerHTML").load("footerHTML");

    $(window).on("resize load", function() {

      var screenWidth = $(window).outerWidth();
      var containerWidth = $(".container").outerWidth();
      var screenHeight = $(window).outerHeight();

      var sidebarLeft = (screenWidth - containerWidth - 15 )/2;
      setCookie('sidebarLeft', sidebarLeft);

      var navbarHeight = $("#navbarHTML").outerHeight();
      if ( navbarHeight === undefined || navbarHeight === '' ) {
        var navbarHeight = '96';
      }
      setCookie('navbarHeight', navbarHeight);

      var sidebarHeight = navbarScroll();
      setCookie('sidebarHeight', sidebarHeight);
      /*
      var sidebarWidth = $("#sidebarPosition").outerWidth();
      setCookie('sidebarWidth', sidebarWidth);
      */
    });

    $(".collapse").on('hidden.bs.collapse', function() {
      var sidebarHeight = navbarScroll();
      setCookie('sidebarHeight', sidebarHeight);
    });

    var offsetHeight = getCookie("navbarHeight");
    if ( offsetHeight === undefined || offsetHeight === '' ) {
      setCookie('navbarHeight','96');
      var offsetHeight = '96';
    }

    $('body').css('padding-top', offsetHeight + 'px');

    var link = document.location.href.match(/[^\/]+$/);
    if (link) {

      link = link.toString();

      if (link != 'faq') {
        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if( target.length ) {
              event.preventDefault();
              $('html, body').stop().animate({
                  scrollTop: target.offset().top - Number(getCookie("navbarHeight"))
              }, 900);
              return false;
            }
        });
      }

      /**************************************************************************
      * Article pages
      **************************************************************************/
      if($(".article-sticky-share").length) {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="tooltip"]').on('click', function(){
          setTimeout(function() {
            $('[data-toggle="tooltip"]').tooltip('hide');
          }, 1500 /* Show "Done." for a bit */);
        });
        var title = $('.container-text h1').text();
        var uri = 'https://eudpr.com/'+link;
        $('.article-sticky-share a[id="article-twitter-share"]').html('<a href="https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(uri)+'" target="_blank"><i class="fab fa-twitter text-dark mt-3"></i></a>');
        $('.article-sticky-share a[id="article-facebook-share"]').html('<a href="https://www.facebook.com/sharer/sharer.php?caption='+encodeURIComponent(title)+'&u='+encodeURIComponent(uri)+'" target="_blank"><i class="fab fa-facebook text-dark mt-3"></i></a>');
        $('.article-sticky-share a[id="article-linkedin-share"]').html('<a href="https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(uri)+'&title='+encodeURIComponent(title)+'" target="_blank"><i class="fab fa-linkedin text-dark mt-3"></i></a>');
        $('.article-sticky-share a[id="article-email-share"]').html('<a href="mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent('Check out this article ' + uri)+'"><i class="far fa-envelope text-dark mt-3"></i></a>');
        $('.article-sticky-share a[id="article-link-share"]').html('<i class="fas fa-link text-dark mt-3"></i>');
        $('.article-bottom-share a[id="article-twitter-share"]').html('<a class="btn btn-outline-primary" href="https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(uri)+'" target="_blank" role="button"><i class="fab fa-twitter"></i></a>');
        $('.article-bottom-share a[id="article-facebook-share"]').html('<a class="btn btn-outline-primary" href="https://www.facebook.com/sharer/sharer.php?caption='+encodeURIComponent(title)+'&u='+encodeURIComponent(uri)+'" target="_blank" role="button"><i class="fab fa-facebook"></i></a>');
        $('.article-bottom-share a[id="article-linkedin-share"]').html('<a class="btn btn-outline-primary" href="https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(uri)+'&title='+encodeURIComponent(title)+'" target="_blank" role="button"><i class="fab fa-linkedin"></i></a>');
        $('.article-bottom-share a[id="article-email-share"]').html('<a class="btn btn-outline-primary" href="mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent('Check out this article ' + uri)+'" role="button"><i class="far fa-envelope"></i></a>');
        $('.article-bottom-share a[id="article-link-share"]').html('<span class="btn btn-outline-primary" role="button"><i class="fas fa-link"></i></span>');
        function copyToClipboard(text){
            var dummy = document.createElement("input");
            document.body.appendChild(dummy);
            dummy.setAttribute('value', text);
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        }
        $('[id="article-link-share"]').on('click', function(){
          copyToClipboard(uri);
          $(this).attr('title','Copied!').tooltip('dispose').tooltip('show');
        });
        $(".article-sticky-share .fab").css("font-size","32px");//14
        $(".article-sticky-share .far").css("font-size","28px");//16
        $(".article-sticky-share .fas").css("font-size","28px");//18
        $(".article-sticky-share").css("top", "200px");
        var articleStickySharePositionLeft = $('.container-text').position().left + $('.container-text').outerWidth(true);
        $(".article-sticky-share").css("left", articleStickySharePositionLeft);
        $(".article-sticky-share").css("width", "2em");
        $(".article-sticky-share").addClass('d-md-block');
        $(window).on('load resize', function(){
          var articleStickySharePositionLeft = $('.container-text').position().left + $('.container-text').outerWidth(true);
          $(".article-sticky-share").css("left", articleStickySharePositionLeft);
        });
      }
      /**************************************************************************
      * GDPR
      **************************************************************************/
      if (link.indexOf('gdpr') != -1) {

        $('#myBtn').on('click', function(){
          $('html, body').animate({
              scrollTop: $("#TableOfContents").offset().top - 96
          }, 900);
        });

        // When the user scrolls down 20px from the top of the document, show the button
        $(window).on('scroll', function() {
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
          } else {
            document.getElementById("myBtn").style.display = "none";
          }
        });

        if (link.indexOf('#') != -1) {
          link = link.split('#')[1];
          $('a[href^="#'+link+'"]')[0].click();
          var str = document.location.href.split('#')[0];
          var stateObj = { index: str };
          history.pushState(stateObj, '', str);
          $(window).on('popstate', function () {
            $.ajax({
              url: window.location.pathname,
              success: function (result) {
                //alert('success\n'+result);
                location.reload();
              },
              error: function (err) {
                //alert('error\n'+err);
              }
            });
          });
        }

        var offsetHeight = getCookie("navbarHeight");
        if ( offsetHeight === undefined || offsetHeight === '' ) {
          setCookie('navbarHeight','96');
          var offsetHeight = '96';
        }

        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if( target.length ) {
              event.preventDefault();
              $('html, body').stop().animate({
                  scrollTop: target.offset().top - Number(getCookie("navbarHeight"))
              }, 900);
              return false;
            }
        });

        $(window).on('activate.bs.scrollspy', function (e,obj) {

          var needle = obj.relatedTarget
          /*
          if ( needle == "#gdpr" ) {
            $(".accordion").filter(".collapse").collapse('hide');
          }
          */
          var myArray = ["#chapteri","#article1","#article2","#article3","#article4"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapteri").collapse('show');

          var myArray = ["#chapterii","#article5","#article6","#article7","#article8","#article9","#article10","#article11"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterii").collapse('show');

          var myArray = ["#chapteriii","#article12","#article13","#article14","#article15","#article16","#article17","#article18","#article19","#article20","#article21","#article22","#article23"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapteriii").collapse('show');

          var myArray = ["#chapteriv","#article24","#article26","#article27","#article28","#article29","#article30","#article31","#article32","#article33","#article34","#article35","#article36","#article37","#article38","#article39","#article40","#article41","#article42","#article43"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapteriv").collapse('show');

          var myArray = ["#chapterv","#article44","#article45","#article46","#article47","#article48","#article49","#article50"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterv").collapse('show');

          var myArray = ["#chaptervi","#article51","#article52","#article53","#article54","#article55","#article56","#article57","#article58","#article59"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChaptervi").collapse('show');

          var myArray = ["#chaptervii","#article60","#article61","#article62","#article63","#article64","#article65","#article66","#article67","#article68","#article69","#article70","#article71","#article72","#article73","#article74","#article75","#article76"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChaptervii").collapse('show');

          var myArray = ["#chapterviii","#article77","#article78","#article79","#article80","#article81","#article82","#article83","#article84"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterviii").collapse('show');

          var myArray = ["#chapterix","#article85","#article86","#article87","#article88","#article89","#article90","#article91"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterix").collapse('show');

          var myArray = ["#chapterx","#article92","#article93"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterx").collapse('show');

          var myArray = ["#chapterxi","#article94","#article95","#article96","#article97","#article98","#article99"];
          var index = contains.call(myArray, needle); // true
          if ( index == true ) $("#collapseChapterxi").collapse('show');

        });
      }
      /**************************************************************************
      * Pricing
      **************************************************************************/
      if (link.indexOf('pricing') != -1) {

        $.getScript('jq-base32.js', function() {
          var userCountry = base32.decode(getCookie('_uCo'));
          var prices = {
            eur : {
              p1 : { month : '35', year : '420'},
              p2 : { month : '125', year : '1,500'},
              p3 : { month : '225', year : '2,700'},
              p4 : { month : '400', year : '4,800'},
              p5 : '25',
              p6 : '50',
              p7 : '150'
            },
            usd : {
              p1 : { month : '45', year : '540'},
              p2 : { month : '145', year : '1,740'},
              p3 : { month : '255', year : '3,060'},
              p4 : { month : '455', year : '5,460'},
              p5 : '30',
              p6 : '60',
              p7 : '175'
            },
          };
          if(userCountry) {
            if (getCookie('EU') == 'true') $('input[name="currency"][id="price-eur"]').prop('checked', true);
            else $('input[name="currency"][id="price-usd"]').prop('checked', true);
            getPrices();
          } else {
            $('input[name="currency"][id="price-eur"]').prop('checked', true);
          }
          $(window).on('load click', function() {
            getPrices();
          });
          function getPrices() {
            if ($('input[name="currency"][id="price-eur"]').is(':checked')) {
              $('.euro-sign').html('&euro;');
              $('.p1-monthly').html(prices.eur.p1.month);
              $('.p2-monthly').html(prices.eur.p2.month);
              $('.p3-monthly').html(prices.eur.p3.month);
              $('.p4-monthly').html(prices.eur.p4.month);
              $('.p1-annual').html(prices.eur.p1.year);
              $('.p2-annual').html(prices.eur.p2.year);
              $('.p3-annual').html(prices.eur.p3.year);
              $('.p4-annual').html(prices.eur.p4.year);
              $('.p5').html(prices.eur.p5);
              $('.p6').html(prices.eur.p6);
              $('.p7').html(prices.eur.p7);
            }
            if ($('input[name="currency"][id="price-usd"]').is(':checked')) {
              $('.euro-sign').html('&dollar;');
              $('.p1-monthly').html(prices.usd.p1.month);
              $('.p2-monthly').html(prices.usd.p2.month);
              $('.p3-monthly').html(prices.usd.p3.month);
              $('.p4-monthly').html(prices.usd.p4.month);
              $('.p1-annual').html(prices.usd.p1.year);
              $('.p2-annual').html(prices.usd.p2.year);
              $('.p3-annual').html(prices.usd.p3.year);
              $('.p4-annual').html(prices.usd.p4.year);
              $('.p5').html(prices.usd.p5);
              $('.p6').html(prices.usd.p6);
              $('.p7').html(prices.usd.p7);
            }
          }
        });
      }

      /**************************************************************************
      * Supervisory-authorities
      **************************************************************************/
    /*
      if (link.indexOf('supervisory-authorities') != -1) {
        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if( target.length ) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - Number(getCookie("navbarHeight"))
                }, 900);
            }
        });
      }
      */
    } else { // no link is home page, index.html
      $('a[href^="#"]').on('click', function(event) {
          var target = $(this.getAttribute('href'));
          if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top //- Number(getCookie("navbarHeight"))
            }, 900);
            return false;
          }
      });

      $.getScript('jq-base32.js', function() {
        var userCountry;
        $('#homepage-country-input').ready(function() {
          userCountry = base32.decode(getCookie('_uCo'));
          if(userCountry) {
            $('#homepage-country-input option[value="'+userCountry+'"]').attr('selected', true)
            $('a[href="#learn-more"]').removeClass('disabled');
            textCountry(userCountry);
          }
        });
        if (performance.navigation.type == 1) {
          userCountry = base32.decode(getCookie('_uCo'));
          if(userCountry) {
            $('#homepage-country-input option[value="'+userCountry+'"]').attr('selected', true)
            $('a[href="#learn-more"]').removeClass('disabled');
            textCountry(userCountry);
          }
        }
        $('#homepage-country-input').on('change', function(){
          userCountry = $('#homepage-country-input').val();
          if(userCountry) {
            setCookie('_uCo',base32.encode(userCountry));
            $('a[href="#learn-more"]').removeClass('disabled');
            textCountry(userCountry);
          }
        });

        function textCountry(userCountry) {

          var countries = [
            ['Afghanistan','37','out'],
            ['Albania','3','out'],
            ['Algeria','43','out'],
            ['American Samoa','1','out'],
            ['Andorra','1','out'],
            ['Angola','32','out'],
            ['Anguilla','1','out'],
            ['Antigua and Barbuda','1','out'],
            ['Argentina','45','out'],
            ['Armenia','3','out'],
            ['Aruba','1','out'],
            ['Australia','25','out'],
            ['Austria','9','in'],
            ['Azerbaijan','10','out'],
            ['Bahamas','1','out'],
            ['Bahrain','2','out'],
            ['Bangladesh','168','out'],
            ['Barbados','1','out'],
            ['Belarus','10','out'],
            ['Belgium','12','in'],
            ['Belize','1','out'],
            ['Benin','12','out'],
            ['Bermuda','1','out'],
            ['Bhutan','1','out'],
            ['Bolivia','12','out'],
            ['Bosnia and Herzegovina','4','out'],
            ['Botswana','3','out'],
            ['Brazil','212','out'],
            ['British Virgin Islands','1','out'],
            ['Brunei','1','out'],
            ['Bulgaria','8','in'],
            ['Burkina Faso','21','out'],
            ['Burundi','12','out'],
            ['Cambodia','17','out'],
            ['Cameroon','26','out'],
            ['Canada','38','out'],
            ['Cape Verde','1','out'],
            ['Cayman Islands','1','out'],
            ['Central African Republic','5','out'],
            ['Chad','16','out'],
            ['Chile','19','out'],
            ['China','1419','out'],
            ['Colombia','50','out'],
            ['Comoros','1','out'],
            ['Cook Islands','1','out'],
            ['Costa Rica','5','out'],
            ['Croatia','5','in'],
            ['Cuba','12','out'],
            ['Curacao','1','out'],
            ['Cyprus','2','in'],
            ['Czech Republic','11','out'],
            ['Denmark','6','in'],
            ['Djibouti','1','out'],
            ['Dominica','1','out'],
            ['Dominican Republic','11','out'],
            ['DR Congo','86','out'],
            ['Ecuador','18','out'],
            ['Egypt','101','out'],
            ['El Salvador','7','out'],
            ['Equatorial Guinea','2','out'],
            ['Eritrea','6','out'],
            ['Estonia','2','in'],
            ['Ethiopia','110','out'],
            ['Falkland Islands','1','out'],
            ['Faroe Islands','1','out'],
            ['Fiji','1','out'],
            ['Finland','6','in'],
            ['France','66','in'],
            ['French Guiana','1','out'],
            ['French Polynesia','1','out'],
            ['Gabon','3','out'],
            ['Gambia','3','out'],
            ['Georgia','4','out'],
            ['Germany','83','in'],
            ['Ghana','30','out'],
            ['Gibraltar','1','out'],
            ['Greece','12','in'],
            ['Greenland','1','out'],
            ['Grenada','1','out'],
            ['Guadeloupe','1','out'],
            ['Guam','1','out'],
            ['Guatemala','18','out'],
            ['Guinea','14','out'],
            ['Guinea-Bissau','2','out'],
            ['Guyana','1','out'],
            ['Haiti','12','out'],
            ['Honduras','10','out'],
            ['Hong Kong','8','out'],
            ['Hungary','10','in'],
            ['Iceland','1','in'],
            ['India','1365','out'],
            ['Indonesia','269','out'],
            ['Iran','83','out'],
            ['Iraq','41','out'],
            ['Ireland','5','in'],
            ['Isle of Man','1','out'],
            ['Israel','9','out'],
            ['Italy','60','in'],
            ['Ivory Coast','26','out'],
            ['Jamaica','3','out'],
            ['Japan','127','out'],
            ['Jordan','11','out'],
            ['Kazakhstan','19','out'],
            ['Kenya','52','out'],
            ['Kiribati','1','out'],
            ['Kuwait','5','out'],
            ['Kyrgyzstan','7','out'],
            ['Laos','8','out'],
            ['Latvia','2','in'],
            ['Lebanon','7','out'],
            ['Lesotho','3','out'],
            ['Liberia','5','out'],
            ['Libya','7','out'],
            ['Liechtenstein','1','in'],
            ['Lithuania','3','in'],
            ['Luxembourg','1','in'],
            ['Macau','1','out'],
            ['Macedonia','3','out'],
            ['Madagascar','27','out'],
            ['Malawi','20','out'],
            ['Malaysia','33','out'],
            ['Maldives','1','out'],
            ['Mali','20','out'],
            ['Malta','1','in'],
            ['Marshall Islands','1','out'],
            ['Martinique','1','out'],
            ['Mauritania','5','out'],
            ['Mauritius','2','out'],
            ['Mayotte','1','out'],
            ['Mexico','132','out'],
            ['Micronesia','1','out'],
            ['Moldova','5','out'],
            ['Monaco','1','out'],
            ['Mongolia','4','out'],
            ['Montenegro','1','out'],
            ['Montserrat','1','out'],
            ['Morocco','37','out'],
            ['Mozambique','32','out'],
            ['Myanmar','55','out'],
            ['Namibia','3','out'],
            ['Nauru','1','out'],
            ['Nepal','30','out'],
            ['Netherlands','18','in'],
            ['New Caledonia','1','out'],
            ['New Zealand','5','out'],
            ['Nicaragua','7','out'],
            ['Niger','23','out'],
            ['Nigeria','200','out'],
            ['Niue','1','out'],
            ['North Korea','26','out'],
            ['Northern Mariana Islands','1','out'],
            ['Norway','6','in'],
            ['Oman','5','out'],
            ['Pakistan','204','out'],
            ['Palau','1','out'],
            ['Palestine','6','out'],
            ['Panama','5','out'],
            ['Papua New Guinea','9','out'],
            ['Paraguay','7','out'],
            ['Peru','33','out'],
            ['Philippines','108','out'],
            ['Poland','39','in'],
            ['Portugal','11','in'],
            ['Puerto Rico','4','out'],
            ['Qatar','3','out'],
            ['Republic of the Congo','6','out'],
            ['Reunion','1','out'],
            ['Romania','20','out'],
            ['Russia','144','out'],
            ['Rwanda','13','out'],
            ['Saint Kitts and Nevis','1','out'],
            ['Saint Lucia','1','out'],
            ['Saint Pierre and Miquelon','1','out'],
            ['Saint Vincent and the Grenadines','1','out'],
            ['Samoa','1','out'],
            ['San Marino','1','out'],
            ['Sao Tome and Principe','1','out'],
            ['Saudi Arabia','34','out'],
            ['Senegal','17','out'],
            ['Serbia','9','out'],
            ['Seychelles','1','out'],
            ['Sierra Leone','8','out'],
            ['Singapore','6','out'],
            ['Sint Maarten','1','out'],
            ['Slovakia','6','out'],
            ['Slovenia','3','out'],
            ['Solomon Islands','1','out'],
            ['Somalia','16','out'],
            ['South Africa','58','out'],
            ['South Korea','52','out'],
            ['South Sudan','14','out'],
            ['Spain','47','in'],
            ['Sri Lanka','21','out'],
            ['Sudan','43','out'],
            ['Suriname','1','out'],
            ['Swaziland','2','out'],
            ['Sweden','11','out'],
            ['Switzerland','9','out'],
            ['Syria','19','out'],
            ['Taiwan','24','out'],
            ['Tajikistan','10','out'],
            ['Tanzania','61','out'],
            ['Thailand','70','out'],
            ['Timor-Leste','2','out'],
            ['Togo','9','out'],
            ['Tokelau','1','out'],
            ['Tonga','1','out'],
            ['Trinidad and Tobago','2','out'],
            ['Tunisia','12','out'],
            ['Turkey','83','out'],
            ['Turkmenistan','6','out'],
            ['Turks and Caicos Islands','1','out'],
            ['Tuvalu','1','out'],
            ['Uganda','46','out'],
            ['Ukraine','44','out'],
            ['United Arab Emirates','10','out'],
            ['United Kingdom','67','out'],
            ['United States','329','out'],
            ['United States Virgin Islands','1','out'],
            ['Uruguay','4','out'],
            ['Uzbekistan','33','out'],
            ['Vanuatu','1','out'],
            ['Vatican City','1','out'],
            ['Venezuela','33','out'],
            ['Vietnam','98','out'],
            ['Wallis and Futuna','1','out'],
            ['Western Sahara','1','out'],
            ['Yemen','30','out'],
            ['Zambia','18','out'],
            ['Zimbabwe','18','out']
          ];

          var population = 1;
          var countryIn;
          for (var i in countries) {
            if (countries[i][0] == userCountry) {
              population = countries[i][1];
              if (countries[i][2] == 'in') countryIn = true;
              else countryIn = false;
              setCookie('EU', countryIn);
              break;
            }
          }

          if (countryIn) {
            $('#learn-more-text').html('\
              <div id="learn-more-text">\
                <div class="row">\
                  <div class="col-12 pt-5 pb-3">\
                    <h1>EUDPR, seamless GDPR</h1>\
                  </div>\
                  <div class="col-12 pb-3">\
                    <h2 class="mb-2">Even though '+userCountry+' is in the EU, you still need to comply with the GDPR if...</h2>\
                    <ul class="list-group">\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You have a website,</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are doing business on the Internet as a consultant, coach, business professional, service provider or retailer,</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are collecting analytics data,</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are serving clients or customers online.</div>\
                        </div>\
                      </li>\
                    </ul>\
                  </div>\
                  <div class="col-12 mb-3">\
                    <h2 class="mb-3">Required By the EU Law</h2>\
                    <p>Controllers of personal data must put in place appropriate technical and organisational measures to implement the data protection principles. Business processes that handle personal data must be designed and built with consideration of the principles and provide safeguards to protect data (for example, using pseudonymization or full anonymization where appropriate), and use the highest-possible privacy settings by default, so that the data is not available publicly without explicit, informed consent, and cannot be used to identify a subject without additional information stored separately.</p>\
                    <p>No personal data may be processed unless it is done under a lawful basis specified by the regulation, or unless the data controller or processor has received an unambiguous and individualized affirmation of consent from the data subject. The data subject has the right to revoke this consent at any time.<br />[<em>See <a href="https://www.eudpr.com/gdpr#article4" target="_blank">GDPR definitions</a></em>]</p>\
                  </div>\
                  <div class="col-12 py-3 text-center">\
                    <h1 class="">We are here to help you be GDPR compliant.</h1>\
                    <h3 class="text-muted">Make EUDPR your representative in the European Union.</h3>\
                    <div class="my-5 d-none d-md-block">\
                      <a class="btn btn-outline-secondary btn-lg mr-2" href="signup">Open an account</a>\
                      <a class="btn btn-light btn-lg ml-2" href="contact">Talk with our sales team</a>\
                    </div>\
                    <div class="mt-5 d-md-none">\
                      <a class="btn btn-outline-secondary btn-lg" href="contact">Talk with our sales team</a>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            ');
          } else {
            $('#learn-more-text').html('\
              <div id="learn-more-text">\
                <div class="row">\
                  <div class="col-12 pt-5 pb-3">\
                    <h1>EUDPR, seamless GDPR</h1>\
                  </div>\
                  <div class="col-12 pb-3">\
                    <h2 class="mb-2">In '+userCountry+', you need a data protection representative in the EU if...</h2>\
                    <ul class="list-group">\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You have a website,</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are doing business on the Internet as a consultant, coach, business professional, service provider or retailer,</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are located outside the EU, and</div>\
                        </div>\
                      </li>\
                      <li class="list-group-item border-0">\
                        <div class="d-flex flex-row">\
                          <div><i class="fas fa-check mr-3 text-success"></i></div>\
                          <div>You are serving clients or customers in the EU.</div>\
                        </div>\
                      </li>\
                    </ul>\
                  </div>\
                  <div class="col-12 mb-3">\
                    <h2 class="mb-3">Required By the EU Law</h2>\
                    <p>As a processor of personal data, you must clearly disclose any data collection, declare the lawful basis and purpose for data processing, and state how long data is being retained and if it is being shared with any third parties or outside of the European Economic Area (EEA). Data subjects have the right to request a portable copy of the data collected by a processor in a common format, and the right to have their data erased under certain circumstances. Public authorities, and businesses whose core activities centre around regular or systematic processing of personal data, are required to employ a data protection officer (DPO), who is responsible for managing compliance with the GDP. Furthermore, <a href="gdpr#article27" target="_blank">Article 27 of the General Data Protection Regulation</a> <strong>requires that you appoint a representative in the EU</strong> as your point of contact for clients, customers and authorities regarding privacy matters.</p>\
                    <p>Businesses must report any data breaches within 72 hours if they have an adverse effect on user privacy. In some cases, violators of the GDPR may be fined up to €20 million or up to 4% of the annual worldwide turnover of the preceding financial year in case of an enterprise, whichever is greater.</p>\
                    <p>If you are a small business tucked away in a small village and your clientele are all locals, this doesn\'t apply to you.</p>\
                    <p>But if you have clients and customers in the EU, if you want a global presence, and if you want to comply with the law, then <strong>this is not optional</strong>; you must have an Article 27 EU Representative.</p>\
                  </div>\
                  <div class="col-12 py-3 text-center">\
                    <h1 class="">We are here to help you be GDPR compliant.</h1>\
                    <h3 class="text-muted">Make EUDPR your representative in the European Union.</h3>\
                    <div class="my-5 d-none d-md-block">\
                      <a class="btn btn-outline-secondary btn-lg mr-2" href="signup">Open an account</a>\
                      <a class="btn btn-light btn-lg ml-2" href="contact">Talk with our sales team</a>\
                    </div>\
                    <div class="mt-5 d-md-none">\
                      <a class="btn btn-outline-secondary btn-lg" href="contact">Talk with our sales team</a>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            ');
          }
          $('#impact-text').html('\
          <div class="col" id="impact-text">\
            <h1>How will that ever impact me if I’m in '+userCountry+'?</h1>\
            <p class="lead text-muted">It’s the law of the EU but it has worldwide effect.</p>\
            <p>There are 500 million people in the EU. It only takes one of them (versus '+population+' million in '+userCountry+') to take legal action and sue you to enforce their data protection rights. Those are odds we would not like to gamble with.</p>\
            <a class="btn btn-outline-secondary btn-lg ml-2" href="contact">Talk with our sales team</a>\
          </div>');
        }
      });
    }

    /**************************************************************************
    * Miscellaneous functions
    **************************************************************************/

    function navbarActive() { // bold active page string
      var page  = document.location.href.match(/[^\/]+$/)[0].split('#')[0];
      if (page != 'signup') {
        $(".navbar-nav").removeClass("active");
        //$("a[href='"+ page +"']").addClass("active");
        $("a[href='"+ page +"']").css("color","#1d1e21");
      }
      return page;
    }

    var contains = function(needle) {
        // source: https://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    var item = this[i];

                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    }

    function navbarScroll() {
      var sidebarHeight = getCookie('sidebarHeight');
      var screenHeight = $(window).outerHeight();
      var offset = $(window).scrollTop();
      var bottomPos = $(window).scrollTop() + $(window).height();
      console.log(document.location.href.match(/[^\/]+$/));
      if (document.location.href.match(/[^\/]+$/)[0].split('#')[0] == 'supervisory-authorities') {
        if (offset >= 0 && offset < 120) {
          offset = 240 - $(window).scrollTop();
        }
        else if (bottomPos >= $('div[class="container my-5 text-center"]').position().top) {
          //alert($(window).scrollTop() + '\n' +bottomPos);
          offset = bottomPos - $('div[class="container my-5 text-center"]').position().top + 96;
        }
        else {
          offset = 96;
        }
      }

      if (document.location.href.match(/[^\/]+$/)[0].split('#')[0] == 'gdpr') {
        if (bottomPos >= $('footer').position().top) {
          offset = bottomPos - $('footer').position().top + 96 + $('div[class="py-5"]').outerHeight();
        }
        else offset = 96;
      }

      if (sidebarHeight != screenHeight - offset) sidebarHeight = (screenHeight - offset);
      if(sidebarHeight != (screenHeight - offset)) {
        alert(sidebarHeight +'\n'+ (screenHeight - offset));
        if ($(".sidebarLeft").outerHeight() > sidebarHeight && offset <= 7950) {
          $(".sidebarLeft").css('height', sidebarHeight);
          $(".sidebarLeft").css('overflow-y','scroll');
        }
        else {
          sidebarHeight = $(".sidebarLeft").outerHeight();
          $(".sidebarLeft").css('height','');
          $(".sidebarLeft").css('overflow-y','');
        }
      } else {
        $(".sidebarLeft").css('height', sidebarHeight);
        $(".sidebarLeft").css('overflow-y','scroll');
      }
      return sidebarHeight;
    }

    function preloadImage() {
      var img = new Image();
      img.src = "https://eudpr.com/images/pexels-photo-705674.jpeg";
      return true;
    }

    function navbarLoad() {
      var scrollTop = $(window).scrollTop();
      //$(".counter").html(scrollTop);
      if (scrollTop >= 100) {
        $("#navHTML").load("navHTML1", function() {
          $("#navHTML0").addClass("show");
          $("#navHTML1").removeClass("show");
          //$('.progress-bar').width('25%');
          var scrolled = getCookie('scrolled');
          $('.progress-bar').width( scrolled + '%');
          //$("#navHTML1").addClass("d-md-block");
          if (document.location.href.match(/[^\/]+$/)) navbarActive(); // bold active page string
          $('.navbar a[href^="#"]').on('click', function(event) {
            $("html, body").stop().animate({scrollTop: 0}, 900);
            return false;
            if (document.location.href.match(/[^\/]+$/)[0].split('#')[0] == 'gdpr') {
              var isScrolling;
              window.addEventListener('scroll', function ( event ) {
                window.clearTimeout( isScrolling );
                isScrolling = setTimeout(function() {
                  $(".collapse").collapse('hide');
                }, 66);
              }, false);
            }
          });
          var sidenav = sideNav();
        });
      } else {
        $("#navHTML").load("navHTML0", function() {
          $(".dropdown").on("hide.bs.dropdown", function(){
              $(".dropdown-toggle").html("Product <i class='fas fa-angle-down'></i>");
          });
          $(".dropdown").on("show.bs.dropdown", function(){
            $(".dropdown-toggle").html("Product <i class='fas fa-angle-up'></i>");
          });
          //$("#navHTML1").removeClass("d-md-block");
          $("#navHTML1").addClass("collapse show");
          $("#navHTML0").removeClass("show");
          if ($(window).width() >= 992 ) {
            $('.navbar').removeClass('bg-light');
            $('.dropdown-menu').addClass('bg-light');
            $('.dropdown-menu').removeClass('border-0');
            if (document.location.href.match(/[^\/]+$/)) {
              var name = document.location.href.match(/[^\/]+$/)[0];
              if (name && name.indexOf('#') == -1 && name != 'index.html') {
                $('.navbar').addClass('bg-light');
                $('.dropdown-menu').removeClass('border-0');
              }
            } else {
              $('.dropdown-menu').removeClass('border-0');
            }
          }
          var sidenav = sideNav();
        });
      }
      return true;
    }

    //Side navigation
    function sideNav() {
      $('.navbar-brand, .navbar-toggler').on('click', function (event) {
        event.preventDefault();
        //$('#navHTML').addClass("invisible");
        $('#navHTML').fadeOut('fast', function() {
          $('#sidenav').load('sidenav', function() {
            openNav();
          });
        });
        return true;
      });
      return false;
    }
    /* Set the width of the side navigation to 350px */
    function openNav() {
      if ($(window).width() < 768 ) {
        $("#myBtn, .container, #footerHTML").fadeOut('fast');
        $("#mySidenav").css('width', $(window).width());
      } else {
        $('.sidebarLeft').fadeOut();
        $('.sidebarLeft').removeClass('d-md-block');
        $("#mySidenav").css('width', "350px");
      }
      $('.closebtn').on('click', function() {
        closeNav();
      });
    }
    /* Set the width of the side navigation to 0 */
    function closeNav() {
      $("#mySidenav").css('width',"0");
      $('#navHTML, sidebarLeft').fadeIn();
      $('.sidebarLeft').addClass('d-md-block');
      if ($(window).width() < 768 ) {
        $("#myBtn, .container, #footerHTML").fadeIn();
      }
    }
  }); // end of get script js.cookies.js
}); // end of document ready
