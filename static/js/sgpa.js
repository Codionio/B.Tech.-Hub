
import data from 'static\files\subjects.json'
console.log(data)

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


