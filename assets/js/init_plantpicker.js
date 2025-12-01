// import the main app file
import { PlantPicker } from './plantpicker_app.js';

// Set to client ID and API key from the Developer Console
const CLIENT_ID = '1080407561813-4u1d5vfhvvbpgr5eatp26o5bk7bnkf91.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAAfrRN-2niWn-vtbwEJxmyWutWO1GsNgI';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

window.PP_APP = {}; 
window.Plants = {};
window.Plants_Staging = {};





// Functions
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------


// Callback after api.js is loaded.
window.gapiLoaded = function() {
  gapi.load('client', initializeGapiClient);
}

// Callback after Google Identity Services are loaded.
window.gisLoaded = function() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}




// Callback after the API client is loaded. 
// Loads the discovery doc to initialize the API.
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Enables user interaction after all libraries are loaded.
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}


// Sign in the user upon button click.
window.handleAuthClick = function() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await populatePlants();
  };
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}


// Sign out the user upon button click.
window.handleSignoutClick = function() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}


// Poplulate plant object
async function populatePlants() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '11qyEleVqm8gwWJGeMCwVMSyXHrX0TiZqCxfViyG1NEk',
      range: 'Sheet1!A2:AP12',
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById('content').innerText = 'No values found.';
    return;
  }
  range.values.forEach((info, index) => {
    let p = new Plant( range.values[index] );
    Plants[p.slug] = p;
  });
  PP_APP = new PlantPicker( Plants );
}