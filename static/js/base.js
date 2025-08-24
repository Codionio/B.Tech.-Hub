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
const handleVisitorCount = async function () {
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
// handel the chat bot logic --- 


// const chat_bot = function(){
//     // --- Get references to your HTML elements ---
// const chatArea = document.getElementById('chat-area');
// const inputField = document.getElementById('Input_field');
// const sendButton = document.getElementById('input_button');

// // --- Get references to all your templates ---
// const chatbotTemplate = document.getElementById('chatbot-message-template');
// const userTemplate = document.getElementById('user-message-template');
// const loaderTemplate = document.getElementById('loader-template');

// // --- Your Website's Knowledge Base ---
// const TrainData = `
// Your name is now Vac 🔥. Your purpose is to be the chatbot for the B.tech hub application. Your creator is Sahil Sharma. The meaning of your name is the Vedic goddess of speech.

// ## B.Tech Hub Website Information ##

// ### Home Page (Welcome Mat) ###
// Link: https://b-tech-hub.onrender.com/
// The homepage is the front door. It has a welcome message and buttons that lead to other sections like "Syllabus" and "SGPA Calculator."

// ### Syllabus (Treasure Map) ###
// Link: https://b-tech-hub.onrender.com/Syllabus
// This section shows a list of all subjects and topics for each school term (semester). You find your grade or year to see the subjects you'll be studying.

// ### SGPA Calculator (Report Card Helper) ###
// Link: https://b-tech-hub.onrender.com/sgpa
// This tool calculates your score for one term (SGPA). You enter the grade you got for each subject, and it instantly shows your final score for that term.

// ### CGPA Calculator (All-Time High Score) ###
// Link: https://b-tech-hub.onrender.com/cgpa
// This calculates your all-time high score (CGPA) by adding up scores from all the terms you've finished so far.

// ### University Info (Rulebook Room) ###
// Link: https://b-tech-hub.onrender.com/links
// This section contains important university rules and information, like the credit system. It specifically mentions AKTU regulations.

// ### Resources (Secret Toolkit) ###
// Link: https://b-tech-hub.onrender.com/resources
// This is a digital library with helpful notes, guides, and tools to make learning easier.

// ### About (Meet the Builders) ###
// Link: https://codionio.github.io/Devs-Codion/
// This link leads to a page about the development team that built the website, called "Codion."
// `;

// // --- NEW: Function to find relevant context from TrainData ---
// function findRelevantContext(userInput) {
//     const personaInfo = "Your name is now Vac 🔥. Your purpose is to be the chatbot for the B.tech hub application. Your creator is Sahil Sharma. The meaning of your name is the Vedic goddess of speech.";

//     // Split the training data into sections. '###' is used as a separator.
//     const sections = TrainData.split('###').slice(1); // slice(1) to skip the initial persona part

//     let relevantSections = [];
//     const keywords = userInput.toLowerCase().split(/\s+/); // Split user input into keywords

//     // Simple keyword matching to find relevant sections
//     sections.forEach(section => {
//         const sectionLower = section.toLowerCase();
//         keywords.forEach(keyword => {
//             if (sectionLower.includes(keyword) && !relevantSections.includes(section)) {
//                 relevantSections.push(section);
//             }
//         });
//     });

//     // If no specific context is found, check if the input is valid
//     if (relevantSections.length === 0) {
//         const validResponses = [
//             "I can help you with information about the syllabus, SGPA, CGPA, and university rules.",
//             "Feel free to ask about any specific subject or topic!",
//             "If you have a question about resources, I can assist with that too."
//         ];
//         return personaInfo + "\n\n" + validResponses.join('\n');
//     }

//     // Combine persona and relevant context
//     return personaInfo + "\n\nUse the following information to answer the user's question:\n" + relevantSections.join('\n\n');
// }

// // --- Main async function to call the Gemini API ---
// async function getAuraResponse(userInput) {
//     const GEMINI_API_KEY = 'AIzaSyCCJ-oqrg2dH50zPUuETUQ4AtjBac9eKq4';
//     const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';


//     const dynamicContext = findRelevantContext(userInput);
//     // const dynamicContext = userInput;

//     const requestBody = {
//         "contents": [{ "parts": [{ "text": userInput }] }],
//         "systemInstruction": {
//             "parts": [{
//                 "text": dynamicContext
//             }]
//         }
//     };

//     try {
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-goog-api-key': GEMINI_API_KEY,
//             },
//             body: JSON.stringify(requestBody)
//         });

//         if (!response.ok) {
//             const errorBody = await response.text();
//             throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
//         }

//         const data = await response.json();
//         const botResponse = data.candidates[0].content.parts[0].text.trim();
//         return botResponse;

//     } catch (error) {
//         console.error("Error fetching from Gemini API:", error);
//         return "Sorry, I'm having trouble connecting right now. Please check the console for errors.";
//     }
// }


// // --- (The rest of your code: addUserMessage, addChatbotMessage, showLoader, etc., remains the same) ---

// function addUserMessage(message) {
//     const newMessage = userTemplate.cloneNode(true);
//     newMessage.classList.remove('hidden');
//     newMessage.removeAttribute('id');
//     newMessage.querySelector('p').textContent = message;
//     newMessage.classList.add('chat-message-enter');
//     chatArea.appendChild(newMessage);

//     // Smooth scroll to bottom
//     setTimeout(() => {
//         chatArea.scrollTo({
//             top: chatArea.scrollHeight,
//             behavior: 'smooth'
//         });
//     }, 50);
// }

// function addChatbotMessage(message) {
//     const newMessage = chatbotTemplate.cloneNode(true);
//     newMessage.classList.remove('hidden');
//     newMessage.removeAttribute('id');
//     newMessage.querySelector('p').textContent = message;
//     newMessage.classList.add('chat-message-enter');
//     chatArea.appendChild(newMessage);

//     // Smooth scroll to bottom
//     setTimeout(() => {
//         chatArea.scrollTo({
//             top: chatArea.scrollHeight,
//             behavior: 'smooth'
//         });
//     }, 50);
// }

// function showLoader() {
//     const loader = loaderTemplate.cloneNode(true);
//     loader.classList.remove('hidden');
//     loader.id = 'active-loader';
//     chatArea.appendChild(loader);
//     chatArea.scrollTop = chatArea.scrollHeight;
// }

// function hideLoader() {
//     const activeLoader = document.getElementById('active-loader');
//     if (activeLoader) {
//         activeLoader.remove();
//     }
// }

// function addWelcomeMessage() {
//     const welcomeMessageHTML = `
//         <div class="flex justify-start animated-message">
//             <div class="dark-glass rounded-2xl rounded-tl-none p-4 max-w-lg">
//                 <p class="text-white leading-relaxed">Hello! I'm Vac, your guide for the B.Tech Hub. How can I help you today? 🔥</p>
//             </div>
//         </div>`;
//     chatArea.insertAdjacentHTML('beforeend', welcomeMessageHTML);
// }

// function resetChat() {
//     chatArea.innerHTML = '';
//     addWelcomeMessage();
// }

// async function inputTrigger() {
//     const input = inputField.value.trim();

//     if (input.toLowerCase() === 'clear') {
//         inputField.value = "";
//         resetChat();
//         return;
//     }

//     if (input) {
//         inputField.value = "";
//         addUserMessage(input);
//         chatArea.scrollTop = chatArea.scrollHeight;

//         showLoader();
//         const botResponse = await getAuraResponse(input);
//         hideLoader();

//         addChatbotMessage(botResponse);
//         chatArea.scrollTop = chatArea.scrollHeight;
//     }
// }

// sendButton.addEventListener('click', inputTrigger);
// inputField.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//         e.preventDefault();
//         inputTrigger();
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     if (chatArea.children.length === 0) {
//         addWelcomeMessage();
//     }
// });
// }

const chat_bot = function () {
    // --- Get references to your HTML elements ---
    const chatArea = document.getElementById('chat-area');
    const inputField = document.getElementById('Input_field');
    const sendButton = document.getElementById('input_button');

    // --- Get references to all your templates ---
    const chatbotTemplate = document.getElementById('chatbot-message-template');
    const userTemplate = document.getElementById('user-message-template');
    const loaderTemplate = document.getElementById('loader-template');

    // --- ✅ FINAL: Your Website's Knowledge Base and Main Prompt ---
    const TrainData = `
Your name is Vac 🔥. You are a helpful AI assistant for the B.tech hub application. Your creator is Sahil Sharma. The meaning of your name is the Vedic goddess of speech.

**If the user's question is about the B.Tech Hub website, its features (like Syllabus, SGPA, CGPA), or its creators, you MUST prioritize the information provided below under "B.Tech Hub Website Information."**

**For all other general questions (like "what is the capital of France?", "explain quantum computing," or math problems), answer them using your own extensive knowledge.**

## B.Tech Hub Website Information ##

### Home Page (Welcome Mat) ###
Link: https://b-tech-hub.onrender.com/
The homepage is the front door. It has a welcome message and buttons that lead to other sections like "Syllabus" and "SGPA Calculator."

### Syllabus (Treasure Map) ###
Link: https://b-tech-hub.onrender.com/Syllabus
This section shows a list of all subjects and topics for each school term (semester). You find your grade or year to see the subjects you'll be studying.

### SGPA Calculator (Report Card Helper) ###
Link: https://b-tech-hub.onrender.com/sgpa
This tool calculates your score for one term (SGPA). You enter the grade you got for each subject, and it instantly shows your final score for that term.

### CGPA Calculator (All-Time High Score) ###
Link: https://b-tech-hub.onrender.com/cgpa
This calculates your all-time high score (CGPA) by adding up scores from all the terms you've finished so far.

### University Info (Rulebook Room) ###
Link: https://b-tech-hub.onrender.com/links
This section contains important university rules and information, like the credit system. It specifically mentions AKTU regulations.

### Resources (Secret Toolkit) ###
Link: https://b-tech-hub.onrender.com/resources
This is a digital library with helpful notes, guides, and tools to make learning easier.

### About (Meet the Builders) ###
Link: https://codionio.github.io/Devs-Codion/
This link leads to a page about the development team that built the website, called "Codion."
`;

    // --- ✅ FINAL: Simplified function to return the main prompt ---
    function getSystemPrompt() {
        return TrainData;
    }

    // --- Main async function to call the Gemini API ---
    async function getAuraResponse(userInput) {
        // 🚨 CRITICAL: Never expose your API key in client-side code.
        // This key should be moved to a secure backend server/proxy for production.
        const GEMINI_API_KEY = 'AIzaSyCCJ-oqrg2dH50zPUuETUQ4AtjBac9eKq4'; // Replace with your key
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        const systemPrompt = getSystemPrompt();

        const requestBody = {
            "contents": [{ "parts": [{ "text": userInput }] }],
            "systemInstruction": {
                "parts": [{
                    "text": systemPrompt
                }]
            }
        };

        try {
            const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const data = await response.json();
            const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() ?? "Sorry, I couldn't get a valid response.";
            return botResponse;

        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            return "Sorry, I'm having trouble connecting right now. Please check the console for errors.";
        }
    }

    // --- (No changes needed for the functions below) ---

    function addUserMessage(message) {
        const newMessage = userTemplate.cloneNode(true);
        newMessage.classList.remove('hidden');
        newMessage.removeAttribute('id');
        newMessage.querySelector('p').textContent = message;
        newMessage.classList.add('chat-message-enter');
        chatArea.appendChild(newMessage);

        setTimeout(() => {
            chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
        }, 50);
    }

    function addChatbotMessage(message) {
        const newMessage = chatbotTemplate.cloneNode(true);
        newMessage.classList.remove('hidden');
        newMessage.removeAttribute('id');

        // This is the container for the bot's message
        const messageContainer = newMessage.querySelector('div'); // Assuming the text goes in a div or p

        // ✨ NEW: Parse Markdown and apply Tailwind's typography styles
        messageContainer.innerHTML = marked.parse(message); // 👈 AFTER
        messageContainer.classList.add('prose', 'prose-invert', 'max-w-none');

        newMessage.classList.add('chat-message-enter');
        chatArea.appendChild(newMessage);

        setTimeout(() => {
            chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
        }, 50);
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
        if (activeLoader) {
            activeLoader.remove();
        }
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

        if (input.toLowerCase() === 'clear') {
            inputField.value = "";
            resetChat();
            return;
        }

        if (input) {
            inputField.value = "";
            addUserMessage(input);
            showLoader();
            const botResponse = await getAuraResponse(input);
            hideLoader();
            addChatbotMessage(botResponse);
        }
    }

    sendButton.addEventListener('click', inputTrigger);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputTrigger();
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('chatbot-message-template').classList.add('hidden');
        document.getElementById('user-message-template').classList.add('hidden');
        document.getElementById('loader-template').classList.add('hidden');

        if (chatArea.children.length === 0) {
            addWelcomeMessage();
        }
    });
};

// --- To run the chatbot, call the function ---
// chat_bot();

const chat_bot_handler = function () {
    let alpha = document.querySelector(".chat_bot_logo");
    let main_chat = document.querySelector("#main");
    let chat_logo = document.querySelector(".chat_bot_logo");
    let close_button = document.querySelector("#close_box");

    // Open chat
    alpha.addEventListener("click", function () {
        main_chat.classList.remove("hidden");
        chat_logo.classList.add("hidden");
        // Focus on input field when chat opens
        setTimeout(() => {
            document.getElementById("Input_field").focus();
        }, 100);
    });

    // Close chat
    close_button.addEventListener("click", function (e) {
        e.stopPropagation();
        main_chat.classList.add("hidden");
        chat_logo.classList.remove("hidden");
    });

    // Close chat when clicking outside
    document.addEventListener('click', function (e) {
        if (main_chat && !main_chat.classList.contains('hidden')) {
            const isClickInsideChat = main_chat.contains(e.target);
            const isClickOnLogo = alpha.contains(e.target);

            if (!isClickInsideChat && !isClickOnLogo) {
                main_chat.classList.add("hidden");
                chat_logo.classList.remove("hidden");
            }
        }
    });

    // Keyboard navigation support
    alpha.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            main_chat.classList.remove("hidden");
            chat_logo.classList.add("hidden");
            setTimeout(() => {
                document.getElementById("Input_field").focus();
            }, 100);
        }
    });
}

// --- RUN ALL INITIALIZATION SCRIPTS ---
document.addEventListener('DOMContentLoaded', function () {
    // Your existing functions are still called
    handleResponsiveMenu();
    typing_animation();

    // The new theme toggle function is added
    handleThemeToggle();
    handleVisitorCount();

    // handel the chatbot logic
    chat_bot_handler();
    chat_bot();
});