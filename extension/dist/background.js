/******/ (() => { // webpackBootstrap
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
// Simple background script
console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
}); 
/******/ })()
;
//# sourceMappingURL=background.js.map