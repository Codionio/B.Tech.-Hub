
// import data from '../files/data.json'
// console.log(data)

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science",
    "History",
    "Geography",
    "Economics",
    "Hindi"
  ];

const subjectDropdown = document.querySelectorAll(".subject");
  subjectDropdown.forEach(alpha => {

  
  // Add a default disabled option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select a subject";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  alpha.appendChild(defaultOption);

  // Dynamically create <option> elements
  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.text = subject;
    alpha.appendChild(option);
  });

  // Store selected subject
  alpha.addEventListener("change", () => {
    const selected = alpha.value;
    localStorage.setItem("selectedSubject", selected);  // optional
    console.log("Selected:", selected);
  });

  // Optional: Load saved selection on page load
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("selectedSubject");
    if (saved) {
      subjectDropdown.value = saved;
    }
  });
  });

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
// Loading_Animation();
