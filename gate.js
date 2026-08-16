/* ==========================================================================
   THE GATE — a curtain, not a lock.

   This is a static site. Everything the gate hides is still delivered to the
   browser in full, so anyone who opens the developer tools, reads this file,
   or fetches the page with curl can read the whole site without the passcode.
   Search engines can too, which is why robots.txt disallows everything for as
   long as this gate is in place.

   What it is good for: keeping an unfinished page away from casual visitors
   while the copy is still full of placeholders. That is all it is for.

   If real protection is wanted, it has to happen on the server before the HTML
   is sent. On Apache or cPanel hosting that is .htaccess with Basic Auth; see
   the note at the bottom of this file. Delete this script once the site is
   meant to be public, and restore robots.txt.

   Loaded synchronously in <head>, before the stylesheet, so the page is never
   briefly visible before the gate appears.
   ========================================================================== */
(function () {
  var KEY = 'sm-gate';
  var EXPECTED = 1020412109;

  /* Not encryption. It only keeps the passcode from sitting in plain sight in
     view-source; anyone reading this file can still defeat it in a moment. */
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h;
  }

  function unlocked() {
    try { return localStorage.getItem(KEY) === String(EXPECTED); }
    catch (e) { return false; }   /* private mode, storage disabled */
  }

  if (!unlocked()) document.documentElement.className += ' locked';

  document.addEventListener('DOMContentLoaded', function () {
    var gate = document.querySelector('.gate');
    if (!gate) return;
    var form = gate.querySelector('form');
    var input = gate.querySelector('input');
    var error = gate.querySelector('.gate-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (hash(input.value.trim().toLowerCase()) === EXPECTED) {
        try { localStorage.setItem(KEY, String(EXPECTED)); } catch (err) {}
        document.documentElement.className =
          document.documentElement.className.replace(/\blocked\b/, '').trim();
        error.hidden = true;
      } else {
        error.hidden = false;
        input.value = '';
        input.focus();
      }
    });

    if (document.documentElement.className.indexOf('locked') > -1) input.focus();
  });
})();

/* --------------------------------------------------------------------------
   Stronger alternative, if the host runs Apache (cPanel, public_html):

     .htaccess in the site root
       AuthType Basic
       AuthName "Sensing Movement"
       AuthUserFile /home/<account>/.htpasswd
       Require valid-user

     .htpasswd above the web root, generated with
       htpasswd -c /home/<account>/.htpasswd swati

   That stops the HTML leaving the server at all, which this file cannot do.
   -------------------------------------------------------------------------- */
