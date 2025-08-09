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
            // **IMPORTANT**: Make sure your JSON file is located at this path in your project
            const response = await fetch("static/files/subjects.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            subjectsData = await response.json();
        } catch (error) {
            console.error("Failed to load subjects data:", error);
            resourceGrid.innerHTML = `<p class="text-center p-10 text-red-500 text-lg bg-red-50 border border-dashed border-red-300 rounded-xl">Could not load subject data. Please check the file path in the browser's console (Right-click -> Inspect -> Console) and correct it in resources.js.</p>`;
        }
    }

    // --- Main UI Update Function ---
    function displayResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semesterValue = semesterSelect.value;

        const getSemesterKey = (semVal) => {
            const map = {
                'Semester 1': 'Semester I', 'Semester 2': 'Semester II', 'Semester 3': 'Semester III',
                'Semester 4': 'Semester IV', 'Semester 5': 'Semester V', 'Semester 6': 'Semester VI',
                'Semester 7': 'Semester VII', 'Semester 8': 'Semester VIII'
            };
            return map[semVal] || semVal;
        };

        const semesterKey = getSemesterKey(semesterValue);
        let subjects;

        if (year === 'First Year') {
            subjects = subjectsData[year]?.[semesterKey];
        } else {
            subjects = subjectsData[year]?.[branch]?.[semesterKey];
        }

        if (!subjects || Object.keys(subjects).length === 0) {
            resourceGrid.innerHTML = `<p class="text-center p-10 text-gray-500 text-lg bg-white border border-dashed border-gray-300 rounded-xl">Sorry, no resources found for the selected criteria.</p>`;
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
        rowsContainer.className = "lg:divide-y lg:divide-gray-200/70 space-y-6 lg:space-y-0";
        
        subjectEntries.forEach(([key, credit]) => {
            const match = key.match(/(.*)\s\((.*)\)/);
            let subjectName = key, subjectCode = 'See options';
            if (match) { [ , subjectName, subjectCode] = match; }

            const row = document.createElement('div');
            row.className = "table-row bg-white rounded-xl shadow-lg p-4 lg:p-0 lg:grid lg:grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] lg:hover:bg-indigo-50 lg:transition-colors lg:duration-200 lg:rounded-none lg:shadow-none";
            
            // Placeholder links, since links are not in this JSON
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
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semester = semesterSelect.value;

        if (year === 'First Year') {
            getResourceBtn.disabled = !(year && semester && branch); // Branch selection is now needed
        } else {
            getResourceBtn.disabled = !(year && branch && semester);
        }
    }

    getResourceBtn.addEventListener('click', displayResources);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        branchSelect.value = '';
        semesterSelect.value = '';

        if (selectedYear) {
            semesterSelect.disabled = false;
            branchSelect.disabled = false; // Branch is ALWAYS enabled
            
            const yearMap = { 'First Year': ['Semester 1', 'Semester 2'], 'Second Year': ['Semester 3', 'Semester 4'], 'Third Year': ['Semester 5', 'Semester 6'], 'Fourth Year': ['Semester 7', 'Semester 8'] };
            (yearMap[selectedYear] || []).forEach(sem => {
                const option = document.createElement('option');
                option.value = sem;
                option.textContent = sem;
                semesterSelect.appendChild(option);
            });
        } else {
            semesterSelect.disabled = true;
            branchSelect.disabled = true;
        }
        checkSelections();
    });

    [branchSelect, semesterSelect].forEach(el => {
        el.addEventListener('change', checkSelections);
    });

    // --- Initial Load ---
    loadSubjectsData();
});