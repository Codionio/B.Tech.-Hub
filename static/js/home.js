const links = function(){
    let alpha = document.querySelector(".Sgpa_calculator");

alpha.addEventListener("click", () => {
  window.location.href = "/sgpa";
});
let beta = document.querySelector(".resources");

beta.addEventListener("click", () => {
    window.location.href = "/resources";
});

let gamma = document.querySelector(".syllabus");

gamma.addEventListener("click", () => {
    window.location.href = "/Syllabus";
});

let delta = document.querySelector(".links");

delta.addEventListener("click", () => {
    window.location.href = "/links";
});
let cgpa = document.querySelector(".cgpa_calculator");

cgpa.addEventListener("click", () => {
    window.location.href = "/cgpa";
});

let quiz = document.querySelector(".Quiz");

delta.addEventListener("click", () => {
    window.location.href = "/links";
});


}
const Loading_Animation = function(){
document.addEventListener('DOMContentLoaded', function() {
const initialLoadTimeline = gsap.timeline();
    const logo = document.querySelector('.logo');
    const logoText = document.querySelector('.logo_text');
    const page = document.querySelector('.page');
    const loader = document.querySelector('.loader');
    // Initial page load animation
    if(logo && logoText && page && loader) {
        loader.classList.remove('hidden');
        page.classList.add('hidden');
        // Initial states
        gsap.set('.loader', {
            backgroundColor: '#000000'
        });
        
        gsap.set(['.logo', '.logo_text'], {
            opacity: 0,
            scale: 0,
            transformOrigin: "center center"
        });

        initialLoadTimeline
            .to('.loader', {
                duration: 0.8,
                backgroundColor: '#ffffff',
                ease: "power2.inOut"
            })
            .to('.logo', {
                duration: 0.6,
                opacity: 1,
                scale: 1,
                rotation: 360,
                ease: "power3.out"
            }, "-=0.4")
            .to('.logo_text', {
                duration: 0.4,
                opacity: 1,
                scale: 1,
                ease: "back.out(1.7)"
            })
            .to('.logo_text', {
                duration: 0.3,
                opacity: 0,
                scale: 0.8,
                ease: "power3.in"
            })
            .to('.logo', {
                duration: 0.5,
                scale: 12,
                opacity: 0,
                ease: "power4.in"
            })
            .to('.loader', {
                duration: 0.3,
                opacity: 0,
                onComplete: () => {
                    loader.classList.add('hidden');
                    page.classList.remove('hidden');
                }
            })
            .from('.page', {
                duration: 0.4,
                opacity: 0,
                y: 20,
                ease: "power2.out"
            });
    }
});
}


links();
Loading_Animation();