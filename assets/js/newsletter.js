/**
  * Newsletter subscription
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */



// Mailer Lite info and other vars
// --------------------------------------------------------------------------------

const mailerAuth  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYjJlMzkxODJlNDQ2ZDIxMGIzNGQ0OTBhOGU3OThhMDY5MTg2NDVjM2YwNTZjYTQ1YzNhNjliZWRjZDMwMmZiMGFiY2Q5ZGMxYTA1OTlmNTUiLCJpYXQiOjE3NjAxOTg0NTUuMzU4ODgzLCJuYmYiOjE3NjAxOTg0NTUuMzU4ODg2LCJleHAiOjQ5MTU4NzIwNTUuMzUyNDE5LCJzdWIiOiIxODY2NzU2Iiwic2NvcGVzIjpbXX0.RvLgjWJ1DYaqdZk-cvNEDrPGnRhxL3QFpEqqPh7Vyv_hk4n5W1zP5SMhZ80PRBAR60-L0DpQ80rLYIvjQdcDQzU3E6PsZL9eKZwSUFGlQE8wFWyISD5JwS3HL0ZhbUrItH68TFhP7UVgCpNwiw7uZOCxMWA23XhD88XA7p3lpsHoGFiu6lXAl8Wx3mWL9GPjj61nnz7KmC7tF-7hChZkCqxBK437w0DpUzWxvZsz3g5pYKPOCnsHhEkpykTWopZHjuI9a7h9GLOigZjaT6n6CsZhmeIAC0jxLDV8J5HHrIPjHYfcdNiEbj9yK1jEpG-eLSyjT2sU5PpwTDkD0G1zyCEcyoxbCJHWFFrOpdIO-6B-vqv6fi8PueJ8oDBysrsBavTvbL1V1z8bPKsoFotxV4wm27sC-T38-iIvJxrOte7yPqlD52cWC5vd72JwkqT8qLuqRDlKrF_oRyhZD8FH5JWie8tbQ5y4yOJTlNOU04mOx0B8wXj86XzsFCShUfldmEtKumQ7-WEoPFalHWbK5XZOSf1odIP5hpkZUGSMke6Ssy3V3on09CAv04cvD-gXI388dLNGwLKPZCi-s43yNmnfFi9tJLPjixQiOtfcFjeCwGAOONoWfXXMoQ33zVMW26a0s92UmDKRrVsG6Gxgx6GQI28tJUb6VNYdxLevbuQ';
const mailerUrl   = 'https://connect.mailerlite.com/api/subscribers';
const mailerGroup = '1679;78117149755200';
const mailerWrap = document.getElementById('js_subscribe__text');
const mailerForm  = document.getElementById('js_subscribe__form');
const mailerEmail = document.getElementById('js_subscribe__email');




// Functions
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

const subscriberSend = function( email ) {
  let data = { 'email': email } 
  data = JSON.stringify(data);
  fetch(mailerUrl, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + mailerAuth,
    },
    body: data, 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status );
    }
    return response.json(); 
  })
  .then(responseData => {
    console.log('Success:', responseData); 
    mailerWrap.innerHTML = 'Thanks!';
  })
  .catch(error => {
    console.error('Error:', error); 
  });
}




// Event Handlers
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

mailerForm.addEventListener('submit', function(event) {
  event.preventDefault();
  subscriberSend( mailerEmail.value );
});

