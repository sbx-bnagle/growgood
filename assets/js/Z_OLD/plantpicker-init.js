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

let plants = {};




// Functions
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------


// Callback after api.js is loaded.
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
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


// Callback after Google Identity Services are loaded.
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}


// Enables user interaction after all libraries are loaded.
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}


// Sign in the user upon button click.
function handleAuthClick() {
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
function handleSignoutClick() {
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
      range: 'Sheet1!A2:W5',
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
    let p = new Plant(range.values[index]);
    plants[p.slug] = p;
  });
  listPlants(plants);
}