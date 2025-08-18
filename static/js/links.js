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
        },
         "scholarship": {
            "title": "UP Scholarship Information (Post-Matric)",
            "description": "The Social Welfare Department of Uttar Pradesh provides the Post-Matric Scholarship Scheme for students pursuing higher education. Here are the key details for AKTU students.",
            "eligibility": {
                "title": "Eligibility Criteria",
                "points": [
                    "The student must be a domicile (resident) of Uttar Pradesh.",
                    "The student must be enrolled in a post-matriculation course (like B.Tech) at a recognized university.",
                    "**Annual Family Income Limit:**",
                    "  - For SC/ST Students: Must not exceed ₹2.5 Lakh per year.",
                    "  - For General, OBC, and Minority Students: Must not exceed ₹2.0 Lakh per year."
                ]
            },
            "documents_1": {
                "title": "Required Documents Checklist",
                "items": [
                    "Aadhaar Card (must be linked with your bank account and mobile number).",
                    "Domicile Certificate (Nivas Praman Patra).",
                    "Caste Certificate (Jati Praman Patra), if applicable.",
                    "Income Certificate (Aay Praman Patra), issued by a competent authority.",
                    "Marksheet of your last qualifying examination (e.g., 12th Standard).",
                    "Current year's fee receipt and admission letter from the institution.",
                    "Bank passbook with your account number and IFSC code clearly visible.",
                    "Latest passport-sized photograph."
                ]
            },
            "documents": [
                {
                    "name": "Domicile Certificate (Nivas Praman Patra)",
                    "description": "This certificate proves that you are a permanent resident of Uttar Pradesh.",
                    "process": [
                        "Visit the official UP e-District portal.",
                        "Register as a new user or log in with your credentials.",
                        "Select 'Domicile Certificate' from the list of services.",
                        "Fill in the required details and upload scanned copies of your photo, identity proof, and address proof.",
                        "Submit the application and pay the nominal fee online."
                    ],
                    "link": "https://edistrict.up.gov.in/",
                    "linkLabel": "Apply on e-District Portal"
                },
                {
                    "name": "Caste Certificate (Jati Praman Patra)",
                    "description": "Required for students applying under SC, ST, or OBC categories.",
                    "process": [
                        "Visit the official UP e-District portal.",
                        "Register or log in to your account.",
                        "Select 'Caste Certificate' from the list of services.",
                        "Fill the application form with your details and upload supporting documents like a self-declaration and proof from a village/ward head.",
                        "Submit the application and pay the fee."
                    ],
                    "link": "https://edistrict.up.gov.in/",
                    "linkLabel": "Apply on e-District Portal"
                },
                {
                    "name": "Income Certificate (Aay Praman Patra)",
                    "description": "This certificate declares your total annual family income, which must be below the threshold for your category.",
                    "process": [
                        "Visit the official UP e-District portal.",
                        "Register or log in to your account.",
                        "Select 'Income Certificate' from the services list.",
                        "Complete the form with details of family members and their income sources, and upload documents like salary slips or a self-declaration.",
                        "Submit the application and pay the fee."
                    ],
                    "link": "https://edistrict.up.gov.in/",
                    "linkLabel": "Apply on e-District Portal"
                },
                {
                    "name": "Aadhaar Card",
                    "description": "Your Aadhaar card must be up-to-date and linked to your bank account and a working mobile number for OTP verification.",
                    "process": [
                        "To update your details or check the status, visit the official UIDAI website.",
                        "Log in to the myAadhaar portal using your Aadhaar number and OTP.",
                        "You can update your address online or book an appointment at an Aadhaar Seva Kendra for other changes."
                    ],
                    "link": "https://myaadhaar.uidai.gov.in/",
                    "linkLabel": "Visit myAadhaar Portal"
                }
            ],
            "applicationProcess": {
                "title": "How to Apply for the Scholarship",
                "steps": [
                    "Visit the official UP Scholarship portal: <a href='https://scholarship.up.gov.in' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>scholarship.up.gov.in</a>.",
                    "Go to the 'Student' section and complete the 'Fresh Registration' process.",
                    "Log in with your new registration number and password.",
                    "Fill out the application form with all personal, academic, and bank details carefully.",
                    "Upload scanned copies of all the required documents.",
                    "After a final review, submit the form and take a printout.",
                    "Submit the printed hard copy along with all attached documents to your college/institute."
                ]
            }
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

    function renderScholarship() {
        const data = universityData.scholarship;
        const container = document.getElementById('scholarship');
        let contentHTML = `<h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">${data.title}</h2>`;
        contentHTML += `<p class="mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">${data.description}</p>`;

        // Eligibility Section
        contentHTML += `<div class="mb-8"><h3 class="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">${data.eligibility.title}</h3><ul class="list-disc list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300">`;
        data.eligibility.points.forEach(point => {
            contentHTML += `<li>${point}</li>`;
        });
        contentHTML += `</ul></div>`;

        // Documents Section
        contentHTML += `<div class="mb-8"><h3 class="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">${data.documents_1.title}</h3><ul class="list-disc list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300">`;
        data.documents_1.items.forEach(item => {
            contentHTML += `<li>${item}</li>`;
        });
        contentHTML += `</ul></div>`;

        // Render each required document section
        data.documents.forEach(doc => {
            contentHTML += `<div class="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">`;
            contentHTML += `<h3 class="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">${doc.name}</h3>`;
            contentHTML += `<p class="mb-4 text-gray-600 dark:text-gray-400">${doc.description}</p>`;
            contentHTML += `<h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">How to Obtain:</h4>`;
            contentHTML += `<ol class="list-decimal list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300">`;
            doc.process.forEach(step => { contentHTML += `<li>${step}</li>`; });
            contentHTML += `</ol>`;
            contentHTML += `<a href="${doc.link}" target="_blank" class="inline-block mt-4 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">${doc.linkLabel} →</a>`;
            contentHTML += `</div>`;
        });
        
        // Render the main application process
        contentHTML += `<div><h3 class="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">${data.applicationProcess.title}</h3><ol class="list-decimal list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300">`;
        data.applicationProcess.steps.forEach(step => { contentHTML += `<li>${step}</li>`; });
        contentHTML += `</ol></div>`;

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
    renderScholarship();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    const initiallyActiveButton = document.querySelector('.tab-button.active');
    if (initiallyActiveButton) {
        switchTab(initiallyActiveButton.dataset.tab);
    }

    
});