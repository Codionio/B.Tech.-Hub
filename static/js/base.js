// Handles the responsive mobile menu
const handleResponsiveMenu = function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
};

// Typing animation for the navbar logo
const typing_animation = function () {
    if (!document.getElementById('typing-text')) return;
    gsap.registerPlugin(TextPlugin);
    const phrases = ["🎓 B.Tech Hub", "By Team Codion", "All Problems, One Solution."];
    const textElement = "#typing-text";
    const cursorElement = ".cursor";

    gsap.timeline({ repeat: -1 })
        .to(cursorElement, { opacity: 0, duration: 0, delay: 0.5 })
        .to(cursorElement, { opacity: 1, duration: 0, delay: 0.5 });

    const mainTimeline = gsap.timeline({ repeat: -1 });
    phrases.forEach(phrase => {
        mainTimeline
            .to(textElement, { duration: phrase.length * 0.1, text: phrase, ease: "none" })
            .to({}, { duration: 2.0 })
            .to(textElement, { duration: phrase.length * 0.05, text: "", ease: "none" })
            .to({}, { duration: 0.5 });
    });
};

// ** NEW: Handles the light/dark theme toggle functionality **
const handleThemeToggle = function () {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.innerHTML = themeToggleBtn.innerHTML;
    }

    const setTheme = (isDark) => {
        const root = document.documentElement;
        const darkIconDesktop = themeToggleBtn.querySelector('#theme-toggle-dark-icon');
        const lightIconDesktop = themeToggleBtn.querySelector('#theme-toggle-light-icon');
        const darkIconMobile = themeToggleBtnMobile.querySelector('#theme-toggle-dark-icon');
        const lightIconMobile = themeToggleBtnMobile.querySelector('#theme-toggle-light-icon');

        if (isDark) {
            root.classList.add('dark');
            darkIconDesktop.classList.remove('hidden');
            lightIconDesktop.classList.add('hidden');
            if (darkIconMobile) darkIconMobile.classList.remove('hidden');
            if (lightIconMobile) lightIconMobile.classList.add('hidden');
        } else {
            root.classList.remove('dark');
            darkIconDesktop.classList.add('hidden');
            lightIconDesktop.classList.remove('hidden');
            if (darkIconMobile) darkIconMobile.classList.add('hidden');
            if (lightIconMobile) lightIconMobile.classList.remove('hidden');
        }
    };

    // Defaults to light mode unless 'dark' is explicitly saved
    // Replace it with this line
    const isDarkMode = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDarkMode);

    const toggle = (btn) => {
        if (btn) {
            btn.addEventListener('click', function () {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                setTheme(isDark);
            });
        }
    };

    toggle(themeToggleBtn);
    toggle(themeToggleBtnMobile);
};

// --- Fetches and displays the live visitor count ---
const handleVisitorCount = async function() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    try {
        // This makes a request to a backend API endpoint
        const response = await fetch('/api/visitor_count');
        const data = await response.json();

        if (data.count !== undefined) {
            countElement.textContent = data.count.toLocaleString(); // Format with commas
        } else {
            countElement.textContent = 'N/A';
        }
    } catch (error) {
        console.error('Failed to fetch visitor count:', error);
        countElement.textContent = 'N/A';
    }
};


// --- RUN ALL INITIALIZATION SCRIPTS ---
document.addEventListener('DOMContentLoaded', function () {
    // Your existing functions are still called
    handleResponsiveMenu();
    typing_animation();

    // The new theme toggle function is added
    handleThemeToggle();
    handleVisitorCount();
});