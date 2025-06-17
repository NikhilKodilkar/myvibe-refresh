/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/popup.css":
/*!*****************************!*\
  !*** ./src/popup/popup.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/utils/logger.js":
/*!*****************************!*\
  !*** ./src/utils/logger.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
const log = {
    info: (message, ...args) => {
        console.log(`[MyVibe Extension] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[MyVibe Extension ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[MyVibe Extension WARN] ${message}`, ...args);
    }
}; 

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/popup/popup.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup.css */ "./src/popup/popup.css");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.js");



class VibeExtension {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.initializeExtension();
        this.setupTabs();
    }

    async initializeExtension() {
        const registration = await this.getStoredRegistration();
        if (registration) {
            this.showSentimentButtons();
        } else {
            this.setupRegistrationForm();
        }
    }

    async getStoredRegistration() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['registration'], (result) => {
                resolve(result.registration);
            });
        });
    }

    setupRegistrationForm() {
        const form = document.getElementById('register');
        if (!form) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.error('Registration form not found');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const handle = document.getElementById('handle').value;
            const company = document.getElementById('company').value;

            try {
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info('Attempting registration...', { handle, company });
                
                const response = await fetch(`${this.API_BASE}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ handle, company })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }

                _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info('Registration successful:', data);

                // Store registration
                await chrome.storage.local.set({
                    registration: {
                        handleId: data.handleId,
                        company: company
                    }
                });

                this.showSentimentButtons();

            } catch (error) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.error('Registration failed:', error);
                alert('Registration failed: ' + error.message);
            }
        });

        // Add login form handler
        const loginForm = document.getElementById('login');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const handle = document.getElementById('loginHandle').value;

                try {
                    _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info('Attempting login...', { handle });
                    
                    const response = await fetch(`${this.API_BASE}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ handle })
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Login failed');
                    }

                    _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info('Login successful:', data);

                    // Store registration
                    await chrome.storage.local.set({
                        registration: {
                            handleId: data.handleId,
                            company: data.company
                        }
                    });

                    this.showSentimentButtons();

                } catch (error) {
                    _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.error('Login failed:', error);
                    alert('Login failed: ' + error.message);
                }
            });
        }
    }

    showSentimentButtons() {
        const regForm = document.getElementById('registrationForm');
        const sentButtons = document.getElementById('sentimentButtons');
        
        if (regForm && sentButtons) {
            regForm.style.display = 'none';
            sentButtons.style.display = 'block';
            this.setupSentimentButtons();
        }
    }

    setupSentimentButtons() {
        const sentiments = ['great', 'meh', 'ugh'];
        sentiments.forEach(sentiment => {
            const btn = document.getElementById(`${sentiment}Btn`);
            if (btn) {
                btn.addEventListener('click', () => this.sendSentiment(sentiment.toUpperCase()));
            }
        });
    }

    async sendSentiment(sentiment) {
        try {
            const registration = await this.getStoredRegistration();
            if (!registration) {
                throw new Error('Not registered');
            }

            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info(`Sending sentiment: ${sentiment}`);
            
            const response = await fetch(`${this.API_BASE}/sentiment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    handleId: registration.handleId,
                    sentiment: sentiment
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send sentiment');
            }

            const data = await response.json();
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.info('Sentiment sent successfully:', data);
            
            this.showFeedback(sentiment);

        } catch (error) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.log.error('Failed to send sentiment:', error);
            alert('Failed to send sentiment. Please try again.');
        }
    }

    showFeedback(sentiment) {
        const btn = document.getElementById(`${sentiment.toLowerCase()}Btn`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Sent! 👍';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab') + 'Tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    new VibeExtension();
}); 
})();

/******/ })()
;
//# sourceMappingURL=popup.js.map