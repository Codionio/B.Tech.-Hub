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


  const aktuBTechSyllabus = {
  "First Year": {
      Theory : {
      "Engineering Physics (BAS101)": 4,
      "Engineering Mathematics-I (BAS103)": 4,
      "Fundamentals of Electrical Engineering (BEE101)": 3,
      "Programming for Problem Solving (BCS101)": 3,
      "Environment and Ecology (BAS104)": 3,
      "Engineering Chemistry (BAS102)": 4,
      "Engineering Mathematics-I (BAS103)": 4,
      "Fundamentals of Electronics Engineering (BEC101)": 3,
      "Fundamentals of Mechanical Engineering (BME101)": 3,
      "Soft Skills (BAS105)": 3,
      "Engineering Chemistry (BAS202)": 4,
      "Engineering Mathematics-II (BAS203)": 4,
      "Fundamentals of Electronics Engineering (BEC201)": 3,
      "Fundamentals of Mechanical Engineering (BME201)": 3,
      "Soft Skills (BAS205)": 3,
      "Engineering Physics (BAS201)": 4,
      "Engineering Mathematics-II (BAS203)": 4,
      "Fundamentals of Electrical Engineering (BEE201)": 3,
      "Programming for Problem Solving (BCS201)": 3,
      "Environment and Ecology (BAS204)": 3,
    },
    Labs : {
        "Engineering Physics Lab (BAS151)": 1,
        "Basic Electrical Engineering Lab (BEE151)": 1,
        "Programming for Problem Solving Lab (BCS151)": 1,
        "Engineering Chemistry Lab (BAS152)": 1,
        "Basic Electronics Engineering Lab (BEC151)": 1,
        "Programming for Problem Solving Lab (BCS251)": 1,
        "English Language Lab (BAS155)": 1,
        "Engineering Chemistry Lab (BAS252)": 1,
        "Basic Electronics Engineering Lab (BEC251)": 1,
        "English Language Lab (BAS255)": 1,
        "Basic Electrical Engineering Lab (BEE251)": 1,
        "Engineering Physics Lab (BAS251)": 1,
        "Engineering Graphics & Design Lab (BCE251)": 2,
        "Engineering Graphics & Design Lab (BCE151)": 2,
        "Workshop Practice Lab (BWS251)": 2,
        "Workshop Practice Lab (BWS151)": 2, 
      }
  },
  "Second Year": {
    "Computer Science & Engineering": {
        "Science Based Open Elective/Mathematics IV (BOE3**/BAS303)": 4,
        "Universal Human Value/Technical Communication (BVE301/BAS301)": 3,
        "Data Structure (BCS301)": 4,
        "Computer Organization and Architecture (BCS302)": 4,
        "Discrete Structures & Theory of Logic (BCS303)": 3,
        "Data Structure Lab (BCS351)": 1,
        "Computer Organization and Architecture Lab (BCS352)": 1,
        "Web Designing Workshop (BCS353)": 1,
        "Cyber Security/Python Programming (BCC301/BCC302)": 2,
        "Internship Assessment/Mini Project (BCC351)": 2,
        "Mathematics IV/Science Based Open Elective (BAS403/BOE4**)": 4,
        "Technical Communication/Universal Human Value (BAS401/BVE401)": 3,
        "Operating System (BCS401)": 4,
        "Theory of Automata and Formal Languages (BCS402)": 4,
        "Object Oriented Programming with Java (BCS403)": 3,
        "Operating System Lab (BCS451)": 1,
        "Object Oriented Programming with Java Lab (BCS452)": 1,
        "Cyber Security Workshop (BCS453)": 1,
        "Python Programming/Cyber Security (BCC402/BCC401)": 2,
        "Sports and Yoga - II / NSS-II (BVE451/BVE452)": 0
      
    },
    "Civil Engineering": {
        "Science Based Open Elective/Mathematics III (BOE3**/BAS302)": 4,
        "Universal Human Value/Technical Communication (BVE301/BAS301)": 3,
        "Engineering Mechanics (BCE301)": 4,
        "Surveying and Geomatics (BCE302)": 4,
        "Fluid Mechanics (BCE303)": 3,
        "Building Planning & Drawing Lab (BCE351)": 1,
        "Surveying and Geomatics Lab (BCE352)": 1,
        "Fluid Mechanics Lab (BCE353)": 1,
        "Mathematics III/Science Based Open Elective (BAS402/BOE4**)": 4,
        "Technical Communication/Universal Human Value (BAS401/BVE401)": 3,
        "Materials, Testing & Construction Practices (BCE401)": 4,
        "Introduction to Solid Mechanics (BCE402)": 4,
        "Hydraulic Engineering and Machines (BCE403)": 3,
        "Material Testing Lab (BCE451)": 1,
        "Solid Mechanics Lab (BCE452)": 1,
        "Hydraulics & Hydraulic Machine Lab (BCE453)": 1,
        "Python Programming/Cyber Security (BCC402/BCC401)": 2,
        "Sports and Yoga - II / NSS-II (BVE451/BVE452)": 0
      
    },
    "Electronics & Communication Engineering": {
      
        "Science Based Open Elective/Mathematics IV (BOE3**/BAS303)": 4,
        "Universal Human Value/Technical Communication (BVE301/BAS301)": 3,
        "Electronic Devices (BEC301)": 4,
        "Digital System Design (BEC302)": 4,
        "Network Analysis and Synthesis (BEC303)": 3,
        "Electronic Devices Lab (BEC351)": 1,
        "Digital System Design Lab (BEC352)": 1,
        "Network Analysis and Synthesis Lab (BEC353)": 1,
        "Mathematics IV/Science Based Open Elective (BAS403/BOE4**)": 4,
        "Technical Communication/Universal Human Value (BAS401/BVE401)": 3,
        "Communication Engineering (BEC401)": 4,
        "Analog Circuits (BEC402)": 4,
        "Signal System (BEC403)": 3,
        "Communication Engineering Lab (BEC451)": 1,
        "Analog Circuits Lab (BEC452)": 1,
        "Signal System Lab (BEC453)": 1,
        "Python Programming/Cyber Security (BCC402/BCC401)": 2,
        "Sports and Yoga - II / NSS-II (BVE451/BVE452)": 0

    },
    "Biotechnology": {
      
        "Science Based Open Elective/Mathematics V (BOE3**/BAS304)": 4,
        "Universal Human Value/Technical Communication (BVE301/BAS301)": 3,
        "Techniques in Biotechnology (BBT301)": 4,
        "Microbiology and Immunology (BBT302)": 4,
        "Biochemistry (BBT303)": 3,
        "Techniques in Biotechnology lab (BBT351)": 1,
        "Microbiology and Immunology lab (BBT352)": 1,
        "Biochemistry lab (BBT353)": 1,
        "Mathematics V/Science Based Open Elective (BAS404/BOE4**)": 4,
        "Technical Communication/Universal Human Value (BAS401/BVE401)": 3,
        "Bioprocess Engineering (BBT401)": 4,
        "Genetics and Molecular Biology (BBT402)": 4,
        "Enzyme Engineering (BBT403)": 3,
        "Bioprocess Engineering lab (BBT451)": 1,
        "Genetics and Molecular Biology lab (BBT452)": 1,
        "Enzyme Engineering lab (BBT453)": 1,
        "Python Programming/Cyber Security (BCC402/BCC401)": 2,
        "Sports and Yoga - II / NSS-II (BVE451/BVE452)": 0
      
    }
  }
};