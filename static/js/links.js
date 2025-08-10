document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const activeIndicatorClass = 'border-indigo-500'; // Class for the bottom border
    const inactiveIndicatorClass = 'border-transparent';

    // Function to handle switching tabs
    const switchTab = (tabId) => {
        // Update button styles and bottom border
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove(activeIndicatorClass);
            btn.classList.add(inactiveIndicatorClass);

            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
                btn.classList.remove(inactiveIndicatorClass);
                btn.classList.add(activeIndicatorClass);
            }
        });

        // Show the selected content and hide others
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    };

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // On initial page load, find the default active button and show its content.
    const initiallyActiveButton = document.querySelector('.tab-button.active');
    if (initiallyActiveButton) {
        const initialTabId = initiallyActiveButton.dataset.tab;
        switchTab(initialTabId);
    }
});