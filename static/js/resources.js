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

    // --- Data Loading (Using your hardcoded sample data) ---
    async function loadSubjectsData() {
        try {
            subjectsData = {
                "Second Year": {
                    "cse": {
                        "Semester 3": {
                            "Data Structure": "KCS-301",
                            "Computer Organization & Architecture": "KCS-302",
                            "Discrete Structures & Theory of Logic": "KCS-303",
                            "Universal Human Values": "KVE-301"
                        }
                    }
                }
            };
        } catch (error) {
            resourceGrid.innerHTML = `<div class="text-center p-12 text-red-500 bg-red-50 border border-dashed border-red-300 rounded-2xl"><p>Could not load subject data. Please try again later.</p></div>`;
        }
    }

    // --- Main UI Update Function (Now Responsive) ---
    function displayResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semester = semesterSelect.value;
        const subjects = subjectsData[year]?.[branch]?.[semester];

        if (!subjects) {
            resourceGrid.innerHTML = `<div class="text-center p-12 text-gray-500 bg-white/50 border border-dashed border-gray-300 rounded-2xl"><p>Sorry, no resources found. We are updating our database.</p></div>`;
            return;
        }
        
        resourceGrid.innerHTML = '';
        const subjectEntries = Object.entries(subjects);
        const resourceLinkClasses = "inline-block bg-slate-100 text-slate-700 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 hover:scale-105";

        const container = document.createElement('div');
        container.className = "lg:bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden lg:border lg:border-gray-200/50";

        const headerHTML = ['Subject', 'Notes', 'PYQs', 'Video Lectures', 'Important Questions']
            .map(text => `<div class="hidden lg:flex items-center p-4 font-bold text-gray-600 uppercase tracking-wider text-sm">${text}</div>`).join('');
        const tableHeader = `<div class="hidden lg:grid grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] bg-gray-50/70">${headerHTML}</div>`;
        container.innerHTML = tableHeader;

        const rowsContainer = document.createElement('div');
        // ** MORE SPACE ADDED HERE FOR MOBILE **
        rowsContainer.className = "lg:divide-y lg:divide-gray-200/70 space-y-6 lg:space-y-0";
        
        subjectEntries.forEach(([subjectName, subjectCode]) => {
            const row = document.createElement('div');
            row.className = "table-row bg-white rounded-xl shadow-lg p-4 lg:p-0 lg:grid lg:grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] lg:hover:bg-indigo-50 lg:transition-colors lg:duration-200 lg:rounded-none lg:shadow-none";
            
            const notesLinks = [...Array(5)].map((_, i) => `<a href="#" class="${resourceLinkClasses}">Unit ${i + 1}</a>`).join('');
            const pyqsLinks = [...Array(5)].map((_, i) => `<a href="#" class="${resourceLinkClasses}">${new Date().getFullYear() - i}</a>`).join('');
            const videoLinks = `<a href="#" class="${resourceLinkClasses}">Playlist 1</a>`;
            const questionLinks = `<a href="#" class="${resourceLinkClasses}">Q-Bank</a>`;
            
            row.innerHTML = `
                <div class="lg:p-4 font-semibold text-gray-800 border-b lg:border-none pb-3 mb-3">
                    ${subjectName}
                    <div class="font-normal text-sm text-gray-500 font-mono mt-1">${subjectCode}</div>
                </div>
                <div class="grid grid-cols-2 gap-4 lg:contents">
                    <div class="lg:p-4 flex flex-col items-start gap-2">
                        <h4 class="font-bold text-gray-500 lg:hidden">Notes</h4>
                        <div class="flex flex-wrap gap-2 items-center">${notesLinks}</div>
                    </div>
                    <div class="lg:p-4 flex flex-col items-start gap-2">
                         <h4 class="font-bold text-gray-500 lg:hidden">PYQs</h4>
                        <div class="flex flex-wrap gap-2 items-center">${pyqsLinks}</div>
                    </div>
                    <div class="lg:p-4 flex flex-col items-start gap-2">
                        <h4 class="font-bold text-gray-500 lg:hidden">Video Lectures</h4>
                        <div class="flex flex-wrap gap-2 items-center">${videoLinks}</div>
                    </div>
                    <div class="lg:p-4 flex flex-col items-start gap-2">
                        <h4 class="font-bold text-gray-500 lg:hidden">Important Questions</h4>
                        <div class="flex flex-wrap gap-2 items-center">${questionLinks}</div>
                    </div>
                </div>
            `;
            rowsContainer.appendChild(row);
        });

        container.appendChild(rowsContainer);
        resourceGrid.appendChild(container);

        gsap.from(".table-row", { opacity: 0, y: 15, duration: 0.4, stagger: 0.1, ease: "power2.out" });
    }

    // --- Event Listeners ---
    function checkSelections() {
        const isReady = yearSelect.value && branchSelect.value && semesterSelect.value;
        getResourceBtn.disabled = !isReady;
    }

    getResourceBtn.addEventListener('click', displayResources);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        branchSelect.value = '';
        semesterSelect.value = '';

        if (selectedYear) {
            branchSelect.disabled = false;
            semesterSelect.disabled = true;
            const yearMap = { 'First Year': ['Semester 1', 'Semester 2'], 'Second Year': ['Semester 3', 'Semester 4'], 'Third Year': ['Semester 5', 'Semester 6'], 'Fourth Year': ['Semester 7', 'Semester 8'] };
            (yearMap[selectedYear] || []).forEach(sem => {
                const option = document.createElement('option');
                option.value = sem;
                option.textContent = sem;
                semesterSelect.appendChild(option);
            });
        } else {
            branchSelect.disabled = true;
            semesterSelect.disabled = true;
        }
        checkSelections();
    });

    branchSelect.addEventListener('change', () => {
        semesterSelect.disabled = !branchSelect.value;
        semesterSelect.value = '';
        checkSelections();
    });
    
    semesterSelect.addEventListener('change', checkSelections);

    // --- Initial Load ---
    loadSubjectsData();
});