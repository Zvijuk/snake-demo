/**
 * Coinis Gallery Slider
 * Handles the display of company images in a CONTINUOUS Marquee.
 */

const Gallery = {
    // Configuration
    duration: 90 * 1000,    // 1 Minute 30 Seconds Total

    // We need enough copies to fill screen + buffer for infinite scroll
    baseImages: [
        "https://coinis.com/assets/e9488828ddf1bc43d480.webp"
    ],

    // State
    isActive: false,
    timer: null,

    // DOM Elements
    elements: {
        container: null,
        content: null, // The outer wrapper in HTML
        wrapper: null  // The scrolling track we will create
    },

    init: function () {
        this.elements.container = document.getElementById('gallery-overlay');
        // We will target the existing wrapper but modify its structure
        const existingWrapper = document.querySelector('.gallery-wrapper');

        // Re-structure HTML for Marquee if not already done via CSS injection?
        // Let's do it cleanly here.
        if (existingWrapper) {
            this.elements.content = existingWrapper;
            // Clear it and create the track
            this.elements.content.innerHTML = '';

            this.elements.wrapper = document.createElement('div');
            this.elements.wrapper.className = 'gallery-track';
            this.elements.content.appendChild(this.elements.wrapper);

            // Add 'gallery-marquee-container' class to parent for masking
            this.elements.content.classList.add('gallery-marquee-container');
        }
    },

    start: function (callback) {
        if (this.isActive) return;
        this.isActive = true;
        this.onComplete = callback;

        console.log("Starting Continuous Gallery...");

        if (this.elements.container) {
            this.elements.container.classList.add('active');
            this.elements.container.classList.remove('fade-out');
        }

        this.renderMarquee();

        // Total Duration Timer
        this.timer = setTimeout(() => {
            this.stop();
        }, this.duration);
    },

    stop: function () {
        if (!this.isActive) return;

        console.log("Stopping Gallery.");
        clearTimeout(this.timer);

        if (this.elements.container) {
            this.elements.container.classList.remove('active');
            this.elements.container.classList.add('fade-out');
        }

        this.isActive = false;

        if (typeof this.onComplete === 'function') {
            setTimeout(this.onComplete, 1000);
        }
    },

    renderMarquee: function () {
        if (!this.elements.wrapper) return;
        this.elements.wrapper.innerHTML = '';

        // Create 2 sets of images for seamless looping
        // Set 1
        const set1 = this.createImageSet();
        // Set 2 (Duplicate)
        const set2 = this.createImageSet();

        // Append all
        set1.forEach(img => this.elements.wrapper.appendChild(img));
        set2.forEach(img => this.elements.wrapper.appendChild(img));

        // Hide indicators if they exist (not needed for marquee)
        const ind = document.getElementById('gallery-indicators');
        if (ind) ind.style.display = 'none';
    },

    createImageSet: function () {
        // Repeat base images enough times to ensure some length? 
        // Our base is 1 image. Let's make it 5 images per set.
        const set = [];
        for (let i = 0; i < 5; i++) {
            // Use modulus if we had more real images
            const src = this.baseImages[i % this.baseImages.length];
            const img = document.createElement('img');
            img.src = src;
            img.className = 'gallery-image';
            set.push(img);
        }
        return set;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Gallery.init();
});
