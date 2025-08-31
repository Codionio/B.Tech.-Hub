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
    if (!document.getElementById('typing-text') || typeof gsap === 'undefined' || typeof TextPlugin === 'undefined') return;
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
        const darkIconMobile = themeToggleBtnMobile ? themeToggleBtnMobile.querySelector('#theme-toggle-dark-icon') : null;
        const lightIconMobile = themeToggleBtnMobile ? themeToggleBtnMobile.querySelector('#theme-toggle-light-icon') : null;

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
const handleVisitorCount = async function () {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    try {
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

// --- Handles chatbot UI visibility ---
const chat_bot_handler = function () {
    const alpha = document.querySelector(".chat_bot_logo");
    const main_chat = document.querySelector("#main");
    const close_button = document.querySelector("#close_box");

    if (!alpha || !main_chat || !close_button) return;

    alpha.addEventListener("click", function () {
        main_chat.classList.remove("hidden");
        alpha.classList.add("hidden");
        setTimeout(() => {
            document.getElementById("Input_field").focus();
        }, 100);
    });

    close_button.addEventListener("click", function (e) {
        e.stopPropagation();
        main_chat.classList.add("hidden");
        alpha.classList.remove("hidden");
    });

    document.addEventListener('click', function (e) {
        if (main_chat && !main_chat.classList.contains('hidden')) {
            const isClickInsideChat = main_chat.contains(e.target);
            const isClickOnLogo = alpha.contains(e.target);
            if (!isClickInsideChat && !isClickOnLogo) {
                main_chat.classList.add("hidden");
                alpha.classList.remove("hidden");
            }
        }
    });

    alpha.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            main_chat.classList.remove("hidden");
            alpha.classList.add("hidden");
            setTimeout(() => {
                document.getElementById("Input_field").focus();
            }, 100);
        }
    });
};

// --- Handles chatbot core logic ---
const chat_bot = function () {
    const chatArea = document.getElementById('chat-area');
    const inputField = document.getElementById('Input_field');
    const sendButton = document.getElementById('input_button');
    const chatbotTemplate = document.getElementById('chatbot-message-template');
    const userTemplate = document.getElementById('user-message-template');
    const loaderTemplate = document.getElementById('loader-template');

    if (!chatArea || !inputField || !sendButton || !chatbotTemplate || !userTemplate || !loaderTemplate) {
        console.error("Chatbot essential elements not found. Aborting initialization.");
        return;
    }

    // Hide templates initially
    chatbotTemplate.classList.add('hidden');
    userTemplate.classList.add('hidden');
    loaderTemplate.classList.add('hidden');

    async function getAuraResponse(userInput) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: userInput })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error fetching from backend API:", error);
            return "Sorry, I'm having trouble connecting right now. Please check the console for errors.";
        }
    }

    function addUserMessage(message) {
        const newMessage = userTemplate.cloneNode(true);
        newMessage.classList.remove('hidden');
        newMessage.removeAttribute('id');
        newMessage.querySelector('p').textContent = message;
        newMessage.classList.add('chat-message-enter');
        chatArea.appendChild(newMessage);
        setTimeout(() => chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' }), 50);
    }

    function addChatbotMessage(message) {
        const newMessage = chatbotTemplate.cloneNode(true);
        newMessage.classList.remove('hidden');
        newMessage.removeAttribute('id');
        const messageContainer = newMessage.querySelector('div');

        if (window.marked) {
            messageContainer.innerHTML = marked.parse(message);
        } else {
            messageContainer.textContent = message;
        }
        messageContainer.classList.add('prose', 'prose-invert', 'max-w-none');
        newMessage.classList.add('chat-message-enter');
        chatArea.appendChild(newMessage);
        setTimeout(() => chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' }), 50);
    }

    function showLoader() {
        const loader = loaderTemplate.cloneNode(true);
        loader.classList.remove('hidden');
        loader.id = 'active-loader';
        chatArea.appendChild(loader);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function hideLoader() {
        const activeLoader = document.getElementById('active-loader');
        if (activeLoader) activeLoader.remove();
    }

    function addWelcomeMessage() {
        const welcomeMessageHTML = `
            <div class="flex justify-start animated-message">
                <div class="dark-glass rounded-2xl rounded-tl-none p-4 max-w-lg">
                    <p class="text-white leading-relaxed">Hello! I'm Vac, your guide for the B.Tech Hub. How can I help you today? 🔥</p>
                </div>
            </div>`;
        chatArea.insertAdjacentHTML('beforeend', welcomeMessageHTML);
    }

    function resetChat() {
        chatArea.innerHTML = '';
        addWelcomeMessage();
    }

    async function inputTrigger() {
        const input = inputField.value.trim();
        if (!input) return;

        inputField.value = "";
        if (input.toLowerCase() === 'clear') {
            resetChat();
            return;
        }

        addUserMessage(input);
        showLoader();
        const botResponse = await getAuraResponse(input);
        hideLoader();
        addChatbotMessage(botResponse);
    }

    sendButton.addEventListener('click', inputTrigger);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputTrigger();
        }
    });

    if (chatArea.children.length === 0) {
        addWelcomeMessage();
    }
};

// --- RUN ALL INITIALIZATION SCRIPTS ---
document.addEventListener('DOMContentLoaded', function () {
    handleResponsiveMenu();
    typing_animation();
    handleThemeToggle();
    handleVisitorCount();
    chat_bot_handler();
    chat_bot();

    const chatbotSection = document.getElementById('chatbot-section');
    if (chatbotSection) {
        const isHomepage = window.location.pathname === '/';

        if (isHomepage) {
            // On the homepage, wait for the loading animation before fading in.
            setTimeout(() => {
                chatbotSection.classList.add('visible');
            }, 2000);
        } else {
            // On all other pages, make it visible immediately.
            chatbotSection.classList.add('visible');
        }
    }
});