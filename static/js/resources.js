document.addEventListener('DOMContentLoaded', function() {
    let subjectsData = {};

    // --- DOM Elements ---
    const yearSelect = document.getElementById('year');
    const branchSelect = document.getElementById('branch');
    const semesterSelect = document.getElementById('semester');
    const getResourceBtn = document.getElementById('getResourceBtn');
    const resourceGrid = document.getElementById('resourceGrid');

    // --- Initial State ---
    getResourceBtn.disabled = true;

    // --- Data Loading ---
    async function loadSubjectsData() {
        try {
            subjectsData = {
                "Second Year": {
                    "cse": {
                        "Semester 3": {
                            "Data Structure": "KCS-301",
                            "Computer Organization & Architecture": "KCS-302",
                            "Discrete Structures & Theory of Logic": "KCS-303",
                            "Universal Human Values": "KVE-301",
                            "Maths IV": "KAS-302"
                        }
                    }
                }
            };
        } catch (error) {
            resourceGrid.innerHTML = `<div class="text-center p-12 text-red-500 bg-red-50 border border-dashed border-red-300 rounded-2xl"><p>Could not load subject data. Please try again later.</p></div>`;
        }
    }

    // --- UI Update Functions ---
    function checkSelections() {
        const isReady = yearSelect.value && branchSelect.value && semesterSelect.value;
        getResourceBtn.disabled = !isReady;
    }

    function displayResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semester = semesterSelect.value;
        const subjects = subjectsData[year]?.[branch]?.[semester];

        if (!subjects) {
            resourceGrid.innerHTML = `<div class="text-center p-12 text-gray-500 bg-white/50 border border-dashed border-gray-300 rounded-2xl"><p>Sorry, no resources found. We are updating our database.</p></div>`;
            return;
        }

        const table = document.createElement('div');
        table.className = 'bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50';

        const headerIcons = {
            Subject: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>`,
            Notes: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>`,
            PYQs: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clip-rule="evenodd" /></svg>`,
            'Video Lectures': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>`,
            'Important Questions': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`,
        };

        const headerHTML = Object.keys(headerIcons).map(headerText =>
            `<div class="flex items-center bg-slate-100/80 py-4 px-6 font-bold text-slate-700 border-b-2 border-slate-200 text-left text-base">${headerIcons[headerText]}${headerText}</div>`
        ).join('');

        const subjectEntries = Object.entries(subjects);
        const resourceLinkClasses = "inline-block bg-slate-100 text-slate-700 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 hover:scale-105";

        const rowsHTML = subjectEntries.map(([subjectName, subjectCode], index) => {
            const zebraClass = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70';
            const subjectCell = `<div class="py-5 px-6 font-semibold text-slate-800">${subjectName}<div class="font-normal text-sm text-slate-500 font-mono mt-1">${subjectCode}</div></div>`;
            const notesCell = `<div class="py-5 px-6 flex flex-wrap gap-2 items-center">${[...Array(5)].map((_, i) => `<a href="#" class="${resourceLinkClasses}">Unit ${i+1}</a>`).join('')}</div>`;
            const pyqsCell = `<div class="py-5 px-6 flex flex-wrap gap-2 items-center">${[...Array(5)].map((_, i) => `<a href="#" class="${resourceLinkClasses}">${new Date().getFullYear() - i}</a>`).join('')}</div>`;
            const videosCell = `<div class="py-5 px-6 flex flex-wrap gap-2 items-center"><a href="#" class="${resourceLinkClasses}">Playlist 1</a></div>`;
            const questionsCell = `<div class="py-5 px-6 flex flex-wrap gap-2 items-center"><a href="#" class="${resourceLinkClasses}">Q-Bank</a></div>`;
            
            return `<div class="resource-row grid grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] ${zebraClass} transition-colors duration-300 group hover:bg-indigo-50">${subjectCell}${notesCell}${pyqsCell}${videosCell}${questionsCell}</div>`;
        }).join('');

        table.innerHTML = `<div class="grid grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)]">${headerHTML}</div>` + rowsHTML;
        
        resourceGrid.innerHTML = '';
        resourceGrid.appendChild(table);

        gsap.from(".resource-row", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out"
        });
    }

    // --- Event Listeners ---
    // **This section is corrected**
    
    getResourceBtn.addEventListener('click', displayResources);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        branchSelect.value = ''; // Reset branch
        semesterSelect.value = ''; // Reset semester

        if (selectedYear) {
            branchSelect.disabled = false;
            const yearMap = { 'First Year': ['Semester 1', 'Semester 2'], 'Second Year': ['Semester 3', 'Semester 4'], 'Third Year': ['Semester 5', 'Semester 6'], 'Fourth Year': ['Semester 7', 'Semester 8'] };
            (yearMap[selectedYear] || []).forEach(sem => {
                const option = document.createElement('option');
                option.value = sem;
                option.textContent = sem;
                semesterSelect.appendChild(option);
            });
        } else {
            branchSelect.disabled = true;
        }
        
        semesterSelect.disabled = true;
        checkSelections(); // Check button state
    });

    branchSelect.addEventListener('change', () => {
        semesterSelect.value = ''; // Reset semester
        semesterSelect.disabled = !branchSelect.value;
        checkSelections(); // Check button state
    });

    semesterSelect.addEventListener('change', () => {
        checkSelections(); // Check button state
    });


    // --- Initial Load ---
    loadSubjectsData();
});