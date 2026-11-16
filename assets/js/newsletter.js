/**
  * Newsletter sign-up
  *
  * @description
  * Sends the email address and a reCAPTCHA token to the site's newsletter Worker at
  * /api/newsletter (workers/newsletter). The Worker checks the token and adds the subscriber
  * in MailerLite. No key or secret belongs in this file: the Worker holds them.
  *
  * Works for every subscribe form on the page: the footer's, and the services page's
  * coming-soon form. The reCAPTCHA site key is read from the form's button (data-sitekey).
  */

(function () {

  const endpoint = '/api/newsletter';
  const action   = 'subscribe';   // must match ACTION in workers/newsletter/src/worker.js

  const messages = {
    sending: 'Sending…',
    done:    'Thanks for subscribing.',
    email:   'Check your email address and try again.',
    failed:  'That didn’t go through. Please try again later.',
  };


  // Functions
  // --------------------------------------------------------------------------------

  const recaptchaToken = function( sitekey ) {
    return new Promise(function( resolve, reject ) {
      if ( !window.grecaptcha || !sitekey ) { reject( new Error('reCAPTCHA did not load') ); return; }
      window.grecaptcha.ready(function() {
        window.grecaptcha.execute( sitekey, { action: action } ).then( resolve, reject );
      });
    });
  };

  const subscribe = function( email, token ) {
    return fetch( endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, token: token }),
    })
    .then(function( response ) {
      return response.json().catch(function() { return { ok: false }; });
    });
  };


  // Each form
  // --------------------------------------------------------------------------------

  document.querySelectorAll('form.subscribe__form').forEach(function( form ) {
    const input   = form.querySelector('input[type="email"]');
    const button  = form.querySelector('button[type="submit"]');
    const sitekey = button ? button.getAttribute('data-sitekey') : '';

    // A live region, so screen readers hear each message.
    const status = document.createElement('p');
    status.className = 'subscribe__status';
    status.setAttribute('role', 'status');
    form.insertAdjacentElement( 'afterend', status );

    form.addEventListener('submit', function( event ) {
      event.preventDefault();
      if ( button ) button.disabled = true;
      status.textContent = messages.sending;

      recaptchaToken( sitekey )
        .then(function( token ) { return subscribe( input.value.trim(), token ); })
        .then(function( result ) {
          if ( result.ok ) {
            form.hidden = true;
            status.textContent = messages.done;
            return;
          }
          status.textContent = result.error === 'email' ? messages.email : messages.failed;
          if ( button ) button.disabled = false;
        })
        .catch(function( error ) {
          console.error( 'Newsletter sign-up:', error );
          status.textContent = messages.failed;
          if ( button ) button.disabled = false;
        });
    });
  });

})();
