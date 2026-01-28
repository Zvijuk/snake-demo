/**
 * Coinis Company Values Presentation
 * Handles the display of core values: Dedication, Integrity, Professionalism.
 */

const Presentation = {
    // Configuration
    duration: 2 * 60 * 1000, // 2 Minutes Total
    slideDuration: 10000,    // 10 Seconds per slide

    values: [
        {
            title: "DEDICATION",
            desc: "Displaying absolute commitment to building and retaining a strong brand image."
        },
        {
            title: "INTEGRITY",
            desc: "Preserving strong moral principles and being honest in all business conduct."
        },
        {
            title: "PROFESSIONALISM",
            desc: "Using everybody's acumen to conclude anything we launch with excellence."
        }
    ],

    // State
    isActive: false,
    timer: null,
    slideInterval: null,
    currentIndex: 0,
    onComplete: null,

    // DOM Elements (Cached on init)
    elements: {
        container: null,
        title: null,
        desc: null,
        indicators: null
    },

    init: function () {
        // Create elements dynamically if they don't exist, OR expect them in HTML.
        // Let's expect them in HTML for cleaner separation, but we can grab them here.
        this.elements.container = document.getElementById('presentation-overlay');
        this.elements.title = document.getElementById('value-title');
        this.elements.desc = document.getElementById('value-desc');
        this.elements.indicators = document.getElementById('value-indicators');
    },

    start: function (callback) {
        if (this.isActive) return;
        this.isActive = true;
        this.onComplete = callback;
        this.currentIndex = 0;

        console.log("Starting Company Values Presentation...");

        // Show Overlay
        if (this.elements.container) {
            this.elements.container.classList.add('active');
            this.elements.container.classList.remove('fade-out');
        }

        // Prepare Indicators
        this.renderIndicators();

        // Show First Slide
        this.showSlide(0);

        // Start cycling
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);

        // Set Total Duration Timer
        this.timer = setTimeout(() => {
            this.stop();
        }, this.duration);
    },

    stop: function () {
        if (!this.isActive) return;

        console.log("Stopping Presentation. Returning to game.");

        // Clear Timers
        clearTimeout(this.timer);
        clearInterval(this.slideInterval);

        // Hide Overlay
        if (this.elements.container) {
            this.elements.container.classList.remove('active');
            this.elements.container.classList.add('fade-out');
        }

        this.isActive = false;

        // Callback to reset game
        if (typeof this.onComplete === 'function') {
            // small delay to allow fade out
            setTimeout(this.onComplete, 1000);
        }
    },

    nextSlide: function () {
        this.currentIndex = (this.currentIndex + 1) % this.values.length;
        this.showSlide(this.currentIndex);
    },

    showSlide: function (index) {
        const item = this.values[index];

        // Animate Out (Optional, but let's just swap content with CSS transitions)
        // For simplicity: Update text. CSS 'active' class on content wrapper can handle fade.

        if (this.elements.title) this.elements.title.innerText = item.title;
        if (this.elements.desc) this.elements.desc.innerText = item.desc;

        // Update Indicators
        this.updateIndicators(index);
    },

    renderIndicators: function () {
        if (!this.elements.indicators) return;
        this.elements.indicators.innerHTML = '';

        this.values.forEach((_, i) => {
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

// Auto-init on load
window.addEventListener('DOMContentLoaded', () => {
    Presentation.init();
});
