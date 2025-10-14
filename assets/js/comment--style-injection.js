/**
  * Styles for the Comments
  *
  * @description
  *
  * @param  config         
  * An object of configuration settings:
  *
  *
  * @return new instance of AppendText
  */


// Grab the wrapping div
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

let commentEmbed = document.getElementById('cusdis_thread');




// CSS styles as string
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const iframeStyles = `

label {
  font-family: Alegreya Sans, sans-serif;
  font-weight: 700;
  line-height: 1.5rem;
  font-size: 1.25rem;
  padding-top: 0.11125rem;
  padding-bottom: 0.13875rem;
  margin-bottom: -0.5rem;
  color: rgb(26, 26, 26);
}

input[type=text], 
input[type=email], 
textarea {
  outline: none !important;
  border: solid 1px rgb(26, 26, 26) !important;
  border-radius: 4px;
}

.font-medium {
  font-family: Alegreya Sans, sans-serif !important; 
  font-weight: 700 !important;
  line-height: 1.5rem !important;
  font-size: 1.25rem !important;
  padding-top: 0.11125rem !important;
  padding-bottom: 0.13875rem !important;
  margin-bottom: -4px !important;
}

.text-sm, p {
  font-family: Alegreya Sans, sans-serif !important; 
  font-weight: 400 !important;
  line-height: 1.5rem !important;
  font-size: 1.25rem !important;
  padding-top: 0.11125rem !important;
  padding-bottom: 0.13875rem !important;
}


.text-gray-500 {
  color: rgb(26, 26, 26) !important;
  opacity: .7 !important;
}

div > button:first-child {
  text-decoration: underline;
}

.px-1 > button:first-child {
  font-family: Alegreya Sans, sans-serif !important; 
  font-weight: 700 !important;
  line-height: 1.5rem !important;
  font-size: 1.25rem !important;
  padding-top: 0.11125rem !important;
  padding-bottom: 0.13875rem !important;
  height: 42px !important;
  border-radius: 60px !important;
  padding: 8px 16px !important;
  background-color: #4ff062 !important;
  text-align: center !important;
  color: #323431 !important;
  box-sizing: border-box !important;
  width: 140px !important;
  text-decoration: none;
}
`;





// Styles to inject
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const iframeHeight = function( iframe ) {
  let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
  if (iframeWin.document.body) {
    iframe.style.height = (iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight) + 'px';
  }
}




// Injector Functions
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const styleInject = function( iframe, cssString ){
  if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
    var styleElement = iframe.contentWindow.document.createElement("style");
    styleElement.textContent = cssString;
    iframe.contentWindow.document.head.appendChild(styleElement);
  }
}

const fontInject = function( iframe ){
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const link = iframeDoc.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;700&display=swap'; 
  link.rel = 'stylesheet';
  iframeDoc.head.appendChild(link);
}

    




// Listener
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Listen for iframe to be loaded with a MutationObserver
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const iframe = commentEmbed.querySelector("iframe");
      if (iframe) {
        setTimeout(() => {

          fontInject(iframe);
          styleInject(iframe, iframeStyles);
          iframeHeight(iframe);
          // fade in once finished

        }, 1000); // once comments get longer a small timeout may be needed.
        observer.disconnect();
      }
    }
  }
});
// Start observing the target node for changes to its child elements.
const config = { childList: true, subtree: true };
observer.observe(commentEmbed, config);


