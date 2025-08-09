const Handel_responsive = function(){

    document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    
    const alpha = document.querySelector(".nav_logo");
    if(alpha) {
        alpha.addEventListener("click", () => {
            window.location.href = "/";
        });
    }
});

}

const typing_animation = function(){   
     document.addEventListener('DOMContentLoaded', function () {
            // Register the GSAP TextPlugin
            gsap.registerPlugin(TextPlugin);

            // --- SELECTORS AND CONFIG ---
            const phrases = ["🎓 B.Tech Hub", "By Team Codion.", "All Problem One Solution."];
            const animationWindow = document.querySelector("#animation-window");
            const textContainer = document.querySelector("#text-container");
            const textElement = "#typing-text";
            const cursorElement = ".cursor";

            // --- ANIMATIONS ---

            // Initial fade-in for the whole component
            gsap.from(animationWindow, { duration: 0.8, opacity: 0, y: 20, ease: "power2.out"});

            // Intelligent cursor blinking timeline
            const cursorTimeline = gsap.timeline({ repeat: -1 });
            cursorTimeline
                .to(cursorElement, { opacity: 0, duration: 0, delay: 0.5 })
                .to(cursorElement, { opacity: 1, duration: 0, delay: 0.5 });

            // Main timeline for typing, deleting, and sliding
            const mainTimeline = gsap.timeline({ repeat: -1 });

            // This function handles the sliding logic
            const checkOverflowAndSlide = () => {
                const windowWidth = animationWindow.offsetWidth;
                const textWidth = textContainer.offsetWidth;
                const overflow = textWidth - windowWidth;

                if (overflow > 0) {
                    gsap.to(textContainer, { 
                        x: -overflow, 
                        duration: 0.2, 
                        ease: "power2.inOut" 
                    });
                } else {
                    gsap.to(textContainer, { x: 0, duration: 0.2, ease: "power2.inOut" });
                }
            };
            
            phrases.forEach(phrase => {
                // FASTER typing duration
                const typingDuration = phrase.length * 0.06;

                mainTimeline
                    .call(() => cursorTimeline.pause())
                    .set(cursorElement, { opacity: 1 })
                    .to(textElement, {
                        duration: typingDuration,
                        text: phrase,
                        ease: "none",
                        onUpdate: checkOverflowAndSlide 
                    })
                    .call(() => cursorTimeline.play())
                    // FASTER pause after typing
                    .to({}, { duration: 1.5 }) 
                    .call(() => cursorTimeline.pause())
                    .to(textElement, {
                        duration: typingDuration * 0.7, // FASTER deletion
                        text: "",
                        ease: "none",
                        onUpdate: checkOverflowAndSlide
                    })
                    .set(textContainer, { x: 0 })
                    .call(() => cursorTimeline.play())
                    // FASTER pause before next phrase
                    .to({}, { duration: 0.5 });
            });
        });
 }


typing_animation ();
Handel_responsive();
