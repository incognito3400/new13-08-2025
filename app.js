// Modern JavaScript with ES6+ features
'use strict';

// App configuration
const APP_CONFIG = {
    API_ENDPOINT: '/api',
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 300,
    BREAKPOINTS: {
        mobile: 768,
        tablet: 1024
    }
};

// Utility functions
const Utils = {
    // Debounce function for performance optimization
    debounce: (func, delay = APP_CONFIG.DEBOUNCE_DELAY) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit = 100) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Smooth scroll to element
    scrollToElement: (element, offset = 0) => {
        const elementTop = element.offsetTop - offset;
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Add/remove CSS classes
    toggleClass: (element, className, condition) => {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    },

    // Generate unique ID
    generateId: (prefix = 'id') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Navigation functionality
class Navigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', this.toggleMenu.bind(this));
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavLinkClick.bind(this));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navMenu.classList.contains('active');
        this.navMenu.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', !isActive);
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }

    handleNavLinkClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            Utils.scrollToElement(targetElement, 80);
            this.closeMenu();
        }
    }
}

// Form validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = form.querySelectorAll('[required]');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.fields.forEach(field => {
            field.addEventListener('blur', this.validateField.bind(this));
            field.addEventListener('input', this.clearError.bind(this));
        });

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        this.showError(field, errorMessage);
        return isValid;
    }

    showError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        Utils.toggleClass(field.parentNode, 'error', !!message);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(e) {
        const field = e.target;
        const errorElement = field.parentNode.querySelector('.error-message');
        
        Utils.toggleClass(field.parentNode, 'error', false);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        let isFormValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm();
        }
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        try {
            // Simulate API call
            await this.sendData(data);
            this.showSuccess();
        } catch (error) {
            this.showErrorMessage('Failed to send message. Please try again.');
        }
    }

    async sendData(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }

    showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Message sent successfully!';
        successMessage.style.cssText = `
            background: var(--success);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-top: 1rem;
            text-align: center;
        `;
        
        this.form.appendChild(successMessage);
        this.form.reset();
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: var(--error);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-top: 1rem;
            text-align: center;
        `;
        
        this.form.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        if (this.animatedElements.length === 0) return;
        
        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    animateElement(element) {
        const animation = element.dataset.animate || 'fadeInUp';
        element.style.animation = `${animation} 0.6s ease forwards`;
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeFonts();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeFonts() {
        // Font loading optimization
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        }
    }
}

// Theme management
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('[data-theme-toggle]');
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindEvents();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }
}

// Main application initialization
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.setup.bind(this));
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize all components
        new Navigation();
        new PerformanceOptimizer();
        new ScrollAnimations();
        new ThemeManager();

        // Initialize form validation if form exists
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            new FormValidator(contactForm);
        }

        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    Utils.scrollToElement(target, 80);
                }
            });
        });

        // Add loading states
        this.addLoadingStates();
    }

    addLoadingStates() {
        // Add loading class to body initially
        document.body.classList.add('loading');
        
        // Remove loading class when page is fully loaded
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
        });
    }
}

// Initialize the application
const app = new App();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Utils, Navigation, FormValidator };
}
