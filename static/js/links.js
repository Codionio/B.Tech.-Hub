document.addEventListener('DOMContentLoaded', function() {
    
    // --- DATA: Later, you can move this to a separate JSON file and use fetch() ---
    const universityData = {
        "ordinances": {
            "title": "University Ordinances",
            "content": "The university ordinances for the B.Tech program cover all academic rules and regulations, including course structure, examination patterns, and degree requirements. These are updated periodically by the academic council.",
            "points": [
                "**Attendance:** A minimum of 75% attendance is mandatory to be eligible for end-semester examinations.",
                "**Examinations:** The evaluation is based on a mix of internal assessments and an external end-semester examination.",
                "**Promotion:** Promotion to the next year is based on a minimum SGPA and earned credits, as defined in the latest ordinance."
            ]
        },
        "gradingSystem": {
            "title": "AKTU Grading System",
            "description": "AKTU follows a 10-point relative grading system. The letter grade and its corresponding grade point are as follows:",
            "grades": [
                { "grade": "O (Outstanding)", "point": "10" },
                { "grade": "A+ (Excellent)", "point": "9" },
                { "grade": "A (Very Good)", "point": "8" },
                { "grade": "B+ (Good)", "point": "7" },
                { "grade": "B (Above Average)", "point": "6" },
                { "grade": "C (Average)", "point": "5" },
                { "grade": "P (Pass)", "point": "4" },
                { "grade": "F (Fail)", "point": "0" }
            ]
        },
        "creditSystem": {
            "title": "Credit System",
            "description": "The total credit requirement for the award of a B.Tech degree is typically around **160 credits**, distributed across eight semesters.",
            "points": [
                "**Theory Courses:** Typically carry 3 or 4 credits.",
                "**Lab Courses:** Usually have 1 or 2 credits.",
                "**Projects & Internships:** Carry a significant number of credits in the final years."
            ]
        },
        "links": {
            "title": "Important Links",
            "items": [
                { "name": "Official University Website", "description": "The main portal for all university-related information.", "url": "https://aktu.ac.in/" },
                { "name": "AKTU One View (ERP)", "description": "Student portal for results, admit cards, and more.", "url": "https://erp.aktu.ac.in/webpages/oneview/oneview.aspx" },
                { "name": "Official Circulars", "description": "Latest notices and circulars from the university.", "url": "https://aktu.ac.in/circulars.html" }
            ]
        },
        "updates": {
            "title": "News & Updates",
            "items": [
                { "headline": "Even Semester Exam Form 2024-25", "details": "The portal for the even semester examination form is now live. Last date to apply is 15th Sept 2025." },
                { "headline": "Scrutiny Result Declared", "details": "Results for the scrutiny of the previous odd semester examinations have been declared on the ERP portal." }
            ]
        }
    };

    // --- DOM Elements ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Functions to build HTML from data ---
    function renderOrdinances() {
        const data = universityData.ordinances;
        const container = document.getElementById('ordinances-content');
        let contentHTML = `<h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<div class="space-y-4 text-gray-700 dark:text-gray-300">`;
        if (data.content) contentHTML += `<p>${data.content}</p>`;
        if (data.points) {
            contentHTML += `<ul class="list-disc list-inside space-y-2 pl-4 mt-2">`;
            data.points.forEach(point => { contentHTML += `<li>${point}</li>`; });
            contentHTML += `</ul>`;
        }
        contentHTML += `</div>`;
        container.innerHTML = contentHTML;
    }

    function renderGradingSystem() {
        const data = universityData.gradingSystem;
        const container = document.getElementById('grading-system-content');
        let contentHTML = `<h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<p class="mb-4 text-gray-700 dark:text-gray-300">${data.description}</p>`;
        contentHTML += `<div class="overflow-x-auto"><table class="w-full min-w-full text-left">`;
        contentHTML += `<thead class="bg-gray-100 dark:bg-gray-700"><tr>
                            <th class="p-4 font-semibold text-gray-800 dark:text-white">Letter Grade</th>
                            <th class="p-4 font-semibold text-gray-800 dark:text-white">Grade Point</th>
                        </tr></thead>`;
        contentHTML += `<tbody class="divide-y divide-gray-200 dark:divide-gray-600">`;
        data.grades.forEach(item => {
            contentHTML += `<tr><td class="p-4">${item.grade}</td><td class="p-4">${item.point}</td></tr>`;
        });
        contentHTML += `</tbody></table></div>`;
        container.innerHTML = contentHTML;
    }

    function renderCreditSystem() {
        const data = universityData.creditSystem;
        const container = document.getElementById('credit-system-content');
        let contentHTML = `<h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<div class="space-y-4 text-gray-700 dark:text-gray-300">`;
        if (data.description) contentHTML += `<p>${data.description}</p>`;
        if (data.points) {
            contentHTML += `<ul class="list-disc list-inside space-y-2 pl-4 mt-2">`;
            data.points.forEach(point => { contentHTML += `<li>${point}</li>`; });
            contentHTML += `</ul>`;
        }
        contentHTML += `</div>`;
        container.innerHTML = contentHTML;
    }

    function renderLinks() {
        const data = universityData.links;
        const container = document.getElementById('links');
        let contentHTML = `<h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
        data.items.forEach(item => {
            contentHTML += `<a href="${item.url}" target="_blank" class="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><p class="font-semibold text-indigo-600 dark:text-indigo-400">${item.name}</p><p class="text-sm text-gray-600 dark:text-gray-300">${item.description}</p></a>`;
        });
        contentHTML += `</div>`;
        container.innerHTML = contentHTML;
    }

    function renderUpdates() {
        const data = universityData.updates;
        const container = document.getElementById('updates');
        let contentHTML = `<h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<div class="space-y-6">`;
        data.items.forEach(item => {
            contentHTML += `<div class="border-l-4 border-indigo-500 pl-4"><p class="font-semibold text-gray-800 dark:text-white">${item.headline}</p><p class="text-sm text-gray-600 dark:text-gray-400">${item.details}</p></div>`;
        });
        contentHTML += `</div>`;
        container.innerHTML = contentHTML;
    }

    // --- Tab Switching Logic ---
    const switchTab = (tabId) => {
        const activeIndicatorClass = 'border-indigo-500';
        const inactiveIndicatorClass = 'border-transparent';
        tabButtons.forEach(btn => {
            btn.classList.remove('active', activeIndicatorClass);
            btn.classList.add(inactiveIndicatorClass);
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active', activeIndicatorClass);
                btn.classList.remove(inactiveIndicatorClass);
            }
        });
        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== tabId);
        });
    };

    // --- Initial Page Setup ---
    renderOrdinances();
    renderGradingSystem();
    renderCreditSystem();
    renderLinks();
    renderUpdates();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    const initiallyActiveButton = document.querySelector('.tab-button.active');
    if (initiallyActiveButton) {
        switchTab(initiallyActiveButton.dataset.tab);
    }
});