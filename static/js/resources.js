document.addEventListener('DOMContentLoaded', function() {
    let subjectsData = {};
    let resourceLinksData = {};

    const yearSelect = document.getElementById('year');
    const branchSelect = document.getElementById('branch');
    const semesterSelect = document.getElementById('semester');
    const getResourceBtn = document.getElementById('getResourceBtn');
    const resourceGrid = document.getElementById('resourceGrid');
    const branchSelectorDiv = branchSelect.parentElement;
    const semesterSelectorDiv = semesterSelect.parentElement;

    getResourceBtn.disabled = true;

    async function loadData() {
        try {
            const [subjectsResponse, resourcesResponse] = await Promise.all([
                fetch("static/files/sub_for_res.json"),
                fetch("static/files/resource.json")
            ]);
            if (!subjectsResponse.ok || !resourcesResponse.ok) throw new Error(`HTTP error!`);
            subjectsData = await subjectsResponse.json();
            resourceLinksData = await resourcesResponse.json();
        } catch (error) {
            console.error("Failed to load data:", error);
            resourceGrid.innerHTML = `<p class="text-center p-10 text-red-500 text-lg bg-red-50 dark:bg-red-900/50 dark:text-red-300 border border-dashed border-red-300 rounded-xl">Could not load data. Please check file paths.</p>`;
        }
    }

    function resolveFirstYearSubjects(sem1, sem2) {
        const allSubjects = { ...sem1, ...sem2 };
        const resolved = {};
        for (const [key, value] of Object.entries(allSubjects)) {
            if (key.includes('/')) {
                const parts = key.split('/').map(p => p.trim());
                resolved[parts[0]] = value;
                resolved[parts[1]] = value;
            } else {
                resolved[key] = value;
            }
        }
        return resolved;
    }

    function displayResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semesterValue = semesterSelect.value;

        const getSemesterKeyRoman = (semVal) => {
            const map = { 'Semester 1': 'Semester I', 'Semester 2': 'Semester II', 'Semester 3': 'Semester III', 'Semester 4': 'Semester IV', 'Semester 5': 'Semester V', 'Semester 6': 'Semester VI', 'Semester 7': 'Semester VII', 'Semester 8': 'Semester VIII' };
            return map[semVal];
        };

        let subjects, resources;

        if (year === 'First Year') {
            subjects = resolveFirstYearSubjects(subjectsData[year]?.['Semester I'], subjectsData[year]?.['Semester II']);
            resources = { ...resourceLinksData[year]?.['Semester 1'], ...resourceLinksData[year]?.['Semester 2'] };
        } else {
            subjects = subjectsData[year]?.[branch]?.[getSemesterKeyRoman(semesterValue)];
            resources = resourceLinksData[year]?.[branch]?.[semesterValue];
        }

        if (!subjects || Object.keys(subjects).length === 0) {
            resourceGrid.innerHTML = `<p class="text-center p-10 text-gray-500 dark:text-gray-400 text-lg bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">Sorry, no subjects found.</p>`;
            return;
        }
        
        resourceGrid.innerHTML = '';
        const container = document.createElement('div');
        container.className = "lg:bg-white lg:dark:bg-gray-800 lg:rounded-2xl lg:shadow-xl lg:overflow-hidden lg:border lg:border-gray-200 lg:dark:border-gray-700";
        
        const headerHTML = ['Subject', 'Notes', 'PYQs', 'Video Lectures', 'Important Questions']
            .map(text => `<div class="hidden lg:flex items-center p-4 font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-sm">${text}</div>`).join('');
        container.innerHTML = `<div class="hidden lg:grid grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] bg-gray-50/70 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">${headerHTML}</div>`;

        const rowsContainer = document.createElement('div');
        // ** THE FIX IS HERE: Removed conflicting divide classes, relying only on spacing for mobile **
        rowsContainer.className = "space-y-6 lg:space-y-0";
        
        Object.entries(subjects).forEach(([key, credit]) => {
            const resourceKey = Object.keys(resources || {}).find(rKey => rKey.includes(key));
            const resourceLinks = resources ? resources[resourceKey] : {};
            
            const match = key.match(/(.*)\s\((.*)\)/);
            let subjectName = key, subjectCode = 'N/A';
            if (match) { [ , subjectName, subjectCode] = match; }

            const generateLinks = (linksObject, labelPrefix) => {
                if (!linksObject || Object.keys(linksObject).length === 0) return '<span class="text-xs text-gray-400">Not Available</span>';
                const resourceLinkClasses = "inline-block bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-indigo-100 dark:hover:bg-indigo-600 hover:text-indigo-700 dark:hover:text-white hover:scale-105";
                return Object.entries(linksObject).map(([unitKey, link]) => `<a href="${link}" target="_blank" rel="noopener noreferrer" class="${resourceLinkClasses}">${labelPrefix} ${unitKey.split('_')[1]}</a>`).join('');
            };
            
            // ** THE FIX IS HERE: Added a border between desktop rows but not on mobile cards **
            const row = document.createElement('div');
            // REPLACE IT WITH THIS LINE
            row.className = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-0 lg:bg-transparent lg:dark:bg-transparent lg:rounded-none lg:shadow-none lg:grid lg:grid-cols-[minmax(250px,_2fr)_repeat(4,_1fr)] lg:hover:bg-indigo-50 lg:dark:hover:bg-gray-700/50 lg:border-b lg:border-gray-200 lg:dark:border-gray-700 transition-colors duration-200";
            
            row.innerHTML = `
                <div class="lg:p-4 font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 lg:border-none pb-3 mb-3">
                    ${subjectName}<div class="font-normal text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">${subjectCode}</div>
                </div>
                <div class="grid grid-cols-2 gap-4 lg:contents">
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 dark:text-gray-400 lg:hidden">Notes</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.notes, 'Unit')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 dark:text-gray-400 lg:hidden">PYQs</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.pyq, 'PYQ')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 dark:text-gray-400 lg:hidden">Lectures</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.lectures, 'Lecture')}</div></div>
                    <div class="lg:p-4 flex flex-col items-start gap-2"><h4 class="font-bold text-gray-500 dark:text-gray-400 lg:hidden">Imp. Questions</h4><div class="flex flex-wrap gap-2 items-center">${generateLinks(resourceLinks?.imp_questions, 'Set')}</div></div>
                </div>`;
            rowsContainer.appendChild(row);
        });

        container.appendChild(rowsContainer);
        resourceGrid.appendChild(container);

        gsap.from(".table-row", { opacity: 0, y: 15, duration: 0.4, stagger: 0.05, ease: "power2.out" });
    }

    // --- Event Listeners ---
    function checkSelections() {
        const year = yearSelect.value;
        if (year === 'First Year') {
            getResourceBtn.disabled = false;
        } else {
            getResourceBtn.disabled = !(year && branchSelect.value && semesterSelect.value);
        }
    }

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        branchSelect.value = '';
        semesterSelect.value = '';
        
        const isFirstYear = selectedYear === 'First Year';
        
        branchSelectorDiv.style.display = isFirstYear ? 'none' : 'flex';
        semesterSelectorDiv.style.display = isFirstYear ? 'none' : 'flex';

        if (isFirstYear) {
            getResourceBtn.disabled = false;
        } else {
            branchSelect.disabled = !selectedYear;
            semesterSelect.disabled = true;
            if (selectedYear) {
                const yearMap = { 'Second Year': ['Semester 3', 'Semester 4'], 'Third Year': ['Semester 5', 'Semester 6'] };
                semesterSelect.innerHTML = '<option value="">Select Semester</option>';
                if(yearMap[selectedYear]) {
                    yearMap[selectedYear].forEach(sem => {
                        const option = document.createElement('option');
                        option.value = sem;
                        option.textContent = sem;
                        semesterSelect.appendChild(option);
                    });
                }
            }
        }
        checkSelections();
    });
    
    branchSelect.addEventListener('change', () => {
        semesterSelect.disabled = !branchSelect.value;
        semesterSelect.value = '';
        checkSelections();
    });

    semesterSelect.addEventListener('change', checkSelections);
    getResourceBtn.addEventListener('click', displayResources);

    // --- Initial Load ---
    async function init() {
        await loadData();
        const fourthYearOption = yearSelect.querySelector('option[value="Fourth Year"]');
        if (fourthYearOption) {
            fourthYearOption.disabled = true;
        }
    }

    init();
});