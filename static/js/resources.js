document.addEventListener('DOMContentLoaded', function() {
    let subjectsData = {};
    let resourceLinksData = {};

    // --- DOM Elements ---
    const yearSelect = document.getElementById('year');
    const branchSelect = document.getElementById('branch');
    const semesterSelect = document.getElementById('semester');
    const getResourceBtn = document.getElementById('getResourceBtn');
    const resourceGrid = document.getElementById('resourceGrid');

    // --- Initial State ---
    getResourceBtn.disabled = true;

    // --- Data Loading ---
    async function loadData() {
        try {
            const [subjectsResponse, resourcesResponse] = await Promise.all([
                fetch("static/files/subjects.json"),
                fetch("static/files/resource.json")
            ]);
            
            if (!subjectsResponse.ok || !resourcesResponse.ok) {
                throw new Error(`HTTP error! Failed to load one or more JSON files.`);
            }
            
            subjectsData = await subjectsResponse.json();
            resourceLinksData = await resourcesResponse.json();

        } catch (error) {
            console.error("Failed to load data:", error);
            resourceGrid.innerHTML = `<p class="text-center p-10 text-red-500 text-lg bg-red-50 border border-dashed border-red-300 rounded-xl">Could not load data. Please check file paths in the browser's console (Right-click -> Inspect -> Console).</p>`;
        }
    }

    // --- Main UI Update Function ---
    function displayResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semesterValue = semesterSelect.value;

        const getSemesterKeyRoman = (semVal) => {
            const map = {
                'Semester 1': 'Semester I', 'Semester 2': 'Semester II', 'Semester 3': 'Semester III',
                'Semester 4': 'Semester IV', 'Semester 5': 'Semester V', 'Semester 6': 'Semester VI',
                'Semester 7': 'Semester VII', 'Semester 8': 'Semester VIII'
            };
            return map[semVal] || semVal;
        };

        const semesterKeyForSubjects = getSemesterKeyRoman(semesterValue);
        const semesterKeyForResources = semesterValue; 

        let subjects;
        let resources;

        if (year === 'First Year') {
            subjects = subjectsData[year]?.[semesterKeyForSubjects];
            resources = resourceLinksData[year]?.[semesterKeyForResources];
        } else {
            subjects = subjectsData[year]?.[branch]?.[semesterKeyForSubjects];
            resources = resourceLinksData[year]?.[branch]?.[semesterKeyForResources];
        }

        if (!subjects || Object.keys(subjects).length === 0) {
            resourceGrid.innerHTML = `<p class="text-center p-10 text-gray-500 text-lg bg-white border border-dashed border-gray-300 rounded-xl">Sorry, no subjects found for the selected criteria.</p>`;
            return;
        }
        
        resourceGrid.innerHTML = '';
        const subjectEntries = Object.entries(subjects);
        const resourceLinkClasses = "dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700  inline-block bg-slate-100 text-slate-700 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 hover:scale-105";

        const container = document.createElement('div');
        container.className = " lg:bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden lg:border lg:border-gray-200/50";

        const headerHTML = ['Subject', 'Notes', 'PYQs', 'Video Lectures', 'Important Questions']
            .map(text => `<div class="dark:text-white dark:bg-gray-800 hidden lg:flex items-center p-4 font-bold text-gray-600 uppercase tracking-wider text-sm">${text}</div>`).join('');
        const tableHeader = `<div class="hidden lg:grid grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] bg-gray-50/70">${headerHTML}</div>`;
        container.innerHTML = tableHeader;

        const rowsContainer = document.createElement('div');
        rowsContainer.className = "lg:divide-y lg:divide-gray-200/70 space-y-6 lg:space-y-0";
        
        subjectEntries.forEach(([key, credit]) => {
            const resourceLinks = resources ? resources[key] : {};
            
            const match = key.match(/(.*)\s\((.*)\)/);
            let subjectName = key, subjectCode = 'See options';
            if (match) { [ , subjectName, subjectCode] = match; }

            const generateLinks = (linksObject, labelPrefix) => {
                if (!linksObject || Object.keys(linksObject).length === 0) return '<span class="dark:text-white text-xs text-gray-400">Not Available</span>';
                return Object.entries(linksObject).map(([unitKey, link]) => {
                    const unitNumber = unitKey.split('_')[1];
                    let label = `${labelPrefix} ${unitNumber}`;
                    if (labelPrefix === 'PYQ') {
                        const currentYear = new Date().getFullYear();
                        label = `${currentYear - (parseInt(unitNumber, 10) - 1)}`;
                    }
                    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="${resourceLinkClasses}">${label}</a>`;
                }).join('');
            };
            
            const row = document.createElement('div');
            row.className = "dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md table-row bg-white rounded-xl shadow-lg p-4 lg:p-0 lg:grid lg:grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] ";
            
            row.innerHTML = `
                <div class="dark:text-white lg:p-4 font-semibold text-gray-800 border-b lg:border-none pb-3 mb-3">
                    ${subjectName}
                    <div class="dark:text-white font-normal text-sm text-gray-500 font-mono mt-1">${subjectCode}</div>
                </div>
                <div class="grid grid-cols-2 gap-4 lg:contents">
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 lg:hidden ">Notes</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.notes, 'Unit -')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 lg:hidden">PYQs</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.pyq, 'PYQ')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 lg:hidden">Video Lectures</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.lectures, 'Unit -')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 lg:hidden">Important Questions</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.imp_questions, 'Unit -')}</div></div>
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

        // ** CORRECTED LOGIC **
        if (year === 'First Year') {
            // For first year, branch is not required
            getResourceBtn.disabled = !(year && semester);
        } else {
            // For other years, all three are required
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
            // ** CORRECTED LOGIC: Disable branch for First Year, enable for others **
            branchSelect.disabled = (selectedYear === 'First Year');
            
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
    
    branchSelect.addEventListener('change', () => {
        semesterSelect.disabled = !branchSelect.value;
        semesterSelect.value = '';
        checkSelections();
    });

    semesterSelect.addEventListener('change', checkSelections);

    // --- Initial Load ---
    loadData();
});