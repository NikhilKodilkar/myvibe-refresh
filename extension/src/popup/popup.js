import './popup.css';
import { log } from '../utils/logger';

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
            log.error('Registration form not found');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const handle = document.getElementById('handle').value;
            const company = document.getElementById('company').value;

            try {
                log.info('Attempting registration...', { handle, company });
                
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

                log.info('Registration successful:', data);

                // Store registration
                await chrome.storage.local.set({
                    registration: {
                        handleId: data.handleId,
                        company: company
                    }
                });

                this.showSentimentButtons();

            } catch (error) {
                log.error('Registration failed:', error);
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
                    log.info('Attempting login...', { handle });
                    
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

                    log.info('Login successful:', data);

                    // Store registration
                    await chrome.storage.local.set({
                        registration: {
                            handleId: data.handleId,
                            company: data.company
                        }
                    });

                    this.showSentimentButtons();

                } catch (error) {
                    log.error('Login failed:', error);
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

            log.info(`Sending sentiment: ${sentiment}`);
            
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
            log.info('Sentiment sent successfully:', data);
            
            this.showFeedback(sentiment);

        } catch (error) {
            log.error('Failed to send sentiment:', error);
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