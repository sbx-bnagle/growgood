/**
  * Styles for the Reviews
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

let sociableWrapper = document.getElementById('sociable_wrapper');




// CSS styles as string
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// const iframeStyles = `

// `;





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

// const styleInject = function( iframe, cssString ){
//   if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
//     var styleElement = iframe.contentWindow.document.createElement("style");
//     styleElement.textContent = cssString;
//     iframe.contentWindow.document.head.appendChild(styleElement);
//   }
// }

// const fontInject = function( iframe ){
//   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//   const link = iframeDoc.createElement('link');
//   link.href = 'https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;700&display=swap'; 
//   link.rel = 'stylesheet';
//   iframeDoc.head.appendChild(link);
// }

    




// Listener
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Listen for iframe to be loaded with a MutationObserver
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const iframe = sociableWrapper.querySelector("iframe");
      if (iframe) {
        setTimeout(() => {

          // fontInject(iframe);
          // styleInject(iframe, iframeStyles);
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
observer.observe(sociableWrapper, config);


