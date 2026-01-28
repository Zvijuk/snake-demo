/**
 * Coinis Gallery Slider
 * Handles the display of company images in a slideshow.
 */

const Gallery = {
    // Configuration
    duration: 90 * 1000,    // 1 Minute 30 Seconds Total
    slideDuration: 5000,    // 5 Seconds per image

    // Using provided asset multiple times to demonstrate sliding
    images: [
        "https://coinis.com/assets/e9488828ddf1bc43d480.webp",
        "https://coinis.com/assets/e9488828ddf1bc43d480.webp",
        "https://coinis.com/assets/e9488828ddf1bc43d480.webp"
    ],

    // State
    isActive: false,
    timer: null,
    slideInterval: null,
    currentIndex: 0,
    onComplete: null,

    // DOM Elements
    elements: {
        container: null,
        wrapper: null,
        indicators: null
    },

    init: function () {
        this.elements.container = document.getElementById('gallery-overlay');
        this.elements.wrapper = document.querySelector('.gallery-wrapper'); // Need wrapper to inject images
        this.elements.indicators = document.getElementById('gallery-indicators');
    },

    start: function (callback) {
        if (this.isActive) return;
        this.isActive = true;
        this.onComplete = callback;
        this.currentIndex = 0;

        console.log("Starting Gallery Slider...");

        if (this.elements.container) {
            this.elements.container.classList.add('active');
            this.elements.container.classList.remove('fade-out');
        }

        // Pre-render all images for sliding
        this.renderImages();
        this.renderIndicators();

        // Show first
        this.activateSlide(0);

        // Cycle images
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);

        // Total Duration
        this.timer = setTimeout(() => {
            this.stop();
        }, this.duration);
    },

    stop: function () {
        if (!this.isActive) return;

        console.log("Stopping Gallery. Returning to game logic.");

        clearTimeout(this.timer);
        clearInterval(this.slideInterval);

        if (this.elements.container) {
            this.elements.container.classList.remove('active');
            this.elements.container.classList.add('fade-out');
        }

        this.isActive = false;

        if (typeof this.onComplete === 'function') {
            setTimeout(this.onComplete, 1000);
        }
    },

    nextSlide: function () {
        const resetIndex = this.currentIndex;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.transitionSlide(resetIndex, this.currentIndex);
    },

    renderImages: function () {
        if (!this.elements.wrapper) return;
        this.elements.wrapper.innerHTML = ''; // Clear existing

        this.images.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'gallery-image';
            if (i === 0) img.classList.add('active');
            else img.classList.add('slide-in'); // Start waiting on the right
            this.elements.wrapper.appendChild(img);
        });
    },

    activateSlide: function (index) {
        const imgs = this.elements.wrapper.children;
        // Just force set (initial)
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].className = 'gallery-image'; // Reset
            if (i === index) imgs[i].classList.add('active');
            else imgs[i].classList.add('slide-in');
        }
        this.updateIndicators(index);
    },

    transitionSlide: function (fromIndex, toIndex) {
        const imgs = this.elements.wrapper.children;
        if (!imgs[fromIndex] || !imgs[toIndex]) return;

        // Current one slides OUT to LEFT
        imgs[fromIndex].classList.remove('active');
        imgs[fromIndex].classList.add('slide-out');

        // Next one slides IN from RIGHT
        imgs[toIndex].classList.remove('slide-in'); // Was waiting on right
        imgs[toIndex].classList.add('active'); // Moves to center due to CSS

        // Cleanup old 'slide-out' after transition? 
        // We can just leave them or reset them off-screen to the right after delay.
        setTimeout(() => {
            imgs[fromIndex].classList.remove('slide-out');
            imgs[fromIndex].classList.add('slide-in'); // Move back to queue (Right)
        }, 800); // Match CSS transition time

        this.updateIndicators(toIndex);
    },

    renderIndicators: function () {
        if (!this.elements.indicators) return;
        this.elements.indicators.innerHTML = '';

        this.images.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            if (i === 0) dot.classList.add('active');
            this.elements.indicators.appendChild(dot);
        });
    },

    updateIndicators: function (index) {
        if (!this.elements.indicators) return;
        const dots = this.elements.indicators.children;
        for (let i = 0; i < dots.length; i++) {
            if (i === index) dots[i].classList.add('active');
            else dots[i].classList.remove('active');
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Gallery.init();
});
