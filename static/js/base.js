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
const Loading_animation = function(){
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        const logo = document.querySelector('.logo');
        
        if (loader && logo) {
            // Create a timeline for smoother animation sequence
            const tl = gsap.timeline({
                onComplete: () => {
                    // Hide loader after animation completes
                    gsap.to(loader, {
                        duration: 0.5,
                        opacity: 0,
                        onComplete: () => {
                            loader.style.display = 'none';
                            document.body.style.overflow = 'visible';
                        }
                    });
                }
            });

            // Add animations to timeline
            tl.from(logo, {
                duration: 0.8,
                scale: 0.5,
                opacity: 0,
                ease: "back.out(1.7)"
            })
            .to(logo, {
                duration: 0.8,
                scale: 1.2,
                opacity: 1,
                ease: "power2.inOut"
            })
            .to(logo, {
                duration: 0.6,
                scale: 1.5,
                opacity: 0,
                ease: "power2.in"
            });
        }
    });
}

// Loading_animation();
Handel_responsive();