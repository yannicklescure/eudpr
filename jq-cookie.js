const $domain = document.location.hostname;
//Set cookies
function setCookie(name, value) {
  if ($domain == 'localhost') document.cookie = name+ '=' + value + ';path=/';
  else document.cookie = name+ '=' + value + ';path=/;domain='+ $domain +';secure';
}

//Delete cookies
function deleteCookie(name) {
  if ($domain == 'localhost') document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  else document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain='+ $domain +';secure';
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name);
  }
}

function getAllCookies() {
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  var cookies = {};
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    c = c.split('\=');
    cookies[c[0]] = c[1];
  }
  cookies = sanitizeCookies(cookies);
  return cookies;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

function sanitizeCookies(c) {
  c.email = c._ema;
  delete c._ema;
  c.browser = c._nav;
  delete c._nav;
  c.ipapi = c._cip;
  delete c._cip;
  c.response = c._res;
  delete c._res;
  c.company = c._com;
  delete c._com;
  c.page = c._pag;
  delete c._pag;
  delete c._ga;
  delete c._gid;
  delete c._gat_gtag_UA_130169086_1;
  return c;
}
