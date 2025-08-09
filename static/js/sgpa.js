/**
 * SGPA Calculator - Grade Viewer Version
 *
 * This version re-enables the real-time grade display next to each marks input
 * and enhances the final result display with a detailed breakdown table.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const ui = {
        yearSelect: document.getElementById('year'),
        semesterSelect: document.getElementById('semester'),
        branchSelect: document.getElementById('branch'),
        groupSelect: document.getElementById('group'),
        tableBody: document.getElementById('subjectsTableBody'),
        resultContainer: document.getElementById('result-container'),
        errorMessage: document.getElementById('error-message'),
        calculateBtn: document.getElementById('calculateBtn'),
        clearBtn: document.getElementById('clearBtn'),
        branchSelectorDiv: document.getElementById('branch').parentElement,
        groupSelectorDiv: document.getElementById('group').parentElement
    };

    // --- Data and Constants ---
    const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'F': 0 };
    const semestersByYear = {
        'First Year': ['I', 'II'], 'Second Year': ['III', 'IV'],
        'Third Year': ['V', 'VI'], 'Fourth Year': ['VII', 'VIII']
    };
    const branchMap = {
        'Computer Science & Engineering': 'CSE', 'CSE (Data Science)': 'CSEDS', 'CSE (AI & ML)': 'AIML',
        'Information Technology': 'IT', 'Electronics & Communication Engineering': 'ECE', 'Electrical Engineering': 'EE',
        'Electrical & Electronics Engineering': 'EEE', 'Mechanical Engineering': 'ME', 'Civil Engineering': 'CE'
    };
    let subjectData = null;

    // --- Main Initializer ---
    async function initialize() {
        try {
            const response = await fetch('/static/files/subjects.json');
            if (!response.ok) throw new Error(`Failed to load subjects.json. Status: ${response.status}`);
            subjectData = await response.json();
            
            populateYearOptions();
            setupEventListeners();
            handleYearChange();
        } catch (error) {
            console.error("CRITICAL ERROR:", error);
            showError('Could not load subject data. Check file path and run on a server.');
        }
    }

    function setupEventListeners() {
        ui.yearSelect.addEventListener('change', handleYearChange);
        ui.semesterSelect.addEventListener('change', populateSubjects);
        ui.branchSelect.addEventListener('change', populateSubjects);
        ui.groupSelect.addEventListener('change', populateSubjects);
        ui.calculateBtn.addEventListener('click', calculateSGPA);
        ui.clearBtn.addEventListener('click', clearAll);
        // Add event listener for real-time grade display
        ui.tableBody.addEventListener('input', handleMarksInput);
    }

    // --- Dropdown and UI Logic ---

    function populateYearOptions() {
        if (!subjectData) return;
        ui.yearSelect.innerHTML = '<option value="">Select Year</option>';
        Object.keys(subjectData).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            ui.yearSelect.appendChild(option);
        });
    }

    function handleYearChange() {
        const year = ui.yearSelect.value;
        updateSemesterDropdown(year);
        updateSelectorsVisibility(year);
        populateSubjects();
    }

    function updateSemesterDropdown(year) {
        ui.semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        if (!year) {
            ui.semesterSelect.disabled = true;
            return;
        }

        ui.semesterSelect.disabled = false;
        const semesters = semestersByYear[year] || [];
        semesters.forEach(sem => {
            const option = document.createElement('option');
            option.value = `Semester ${sem}`;
            option.textContent = `Semester ${sem}`;
            ui.semesterSelect.appendChild(option);
        });
    }

    function updateSelectorsVisibility(year) {
        const isFirstYear = (year === 'First Year');
        ui.branchSelectorDiv.style.display = isFirstYear ? 'none' : 'block';
        ui.groupSelectorDiv.style.display = isFirstYear ? 'block' : 'none';
        ui.branchSelect.disabled = isFirstYear;
        ui.groupSelect.disabled = !isFirstYear;
    }

    // --- Subject Loading Logic ---

    function populateSubjects() {
        ui.resultContainer.innerHTML = '';
        if (!subjectData) return;

        const year = ui.yearSelect.value;
        const semester = ui.semesterSelect.value;
        let subjects = {};
        let emptyMessage = "Please make your selections to view subjects.";

        if (year && semester) {
            if (year === 'First Year') {
                const group = ui.groupSelect.value;
                if (group) {
                    const originalSubjects = subjectData[year]?.[semester] || {};
                    for (const [key, value] of Object.entries(originalSubjects)) {
                        const parts = key.split(' / ');
                        const subjectToShow = (group === 'A' || parts.length === 1) ? parts[0].trim() : parts[1].trim();
                        subjects[subjectToShow] = value;
                    }
                    emptyMessage = "No subjects found.";
                } else {
                    emptyMessage = "Please select a group.";
                }
            } else { // For Second, Third, Fourth Year
                const branchValue = ui.branchSelect.value;
                const branchKey = branchMap[branchValue];
                if (branchKey) {
                    subjects = subjectData[year]?.[branchKey]?.[semester] || {};
                    emptyMessage = "No subjects found for this selection.";
                } else {
                    emptyMessage = "Please select a branch.";
                }
            }
        }
        renderSubjectsTable(subjects, emptyMessage);
    }
    
    function renderSubjectsTable(subjects, emptyMessage) {
        if (Object.keys(subjects).length === 0) {
            ui.tableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">${emptyMessage}</td></tr>`;
            return;
        }

        ui.tableBody.innerHTML = '';
        Object.entries(subjects).forEach(([subjectName, credits]) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            row.innerHTML = `
                <td class="px-4 py-3 font-semibold text-gray-700">${subjectName}</td>
                <td class="px-4 py-3 text-center font-bold text-gray-800">${credits}</td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <input type="number" class="marks-input w-24 px-2 py-1 border rounded text-center" min="0" max="100" placeholder="Marks" data-credit="${credits}" data-name="${subjectName}">
                        <span class="grade-display w-10 text-center font-bold">-</span>
                    </div>
                </td>
            `;
            ui.tableBody.appendChild(row);
        });
    }

    // --- Calculation Logic ---

    function handleMarksInput(event) {
        const input = event.target;
        const marks = parseInt(input.value);
        const gradeDisplay = input.closest('tr').querySelector('.grade-display');
        
        if (isNaN(marks) || marks < 0 || marks > 100) {
            gradeDisplay.textContent = '-';
            gradeDisplay.className = 'grade-display w-10 text-center font-bold text-gray-500';
            return;
        }

        const grade = getGrade(marks);
        gradeDisplay.textContent = grade;
        gradeDisplay.className = `grade-display w-10 text-center font-bold ${grade === 'F' ? 'text-red-600' : 'text-green-600'}`;
    }

    function getGrade(marks) {
        if (marks >= 91) return 'O'; if (marks >= 81) return 'A+'; if (marks >= 71) return 'A';
        if (marks >= 61) return 'B+'; if (marks >= 51) return 'B'; if (marks >= 41) return 'C';
        if (marks >= 31) return 'D'; return 'F';
    }

    function calculateSGPA() {
        const marksInputs = ui.tableBody.querySelectorAll('.marks-input');
        if (marksInputs.length === 0) {
            showError('No subjects to calculate.');
            return;
        }

        let totalGradePoints = 0, totalCredits = 0, allInputsValid = true;
        const subjectsForReport = [];
        
        marksInputs.forEach(input => {
            const marks = parseInt(input.value);
            const credits = parseInt(input.dataset.credit);
            const name = input.dataset.name;

            if (isNaN(marks) || marks < 0 || marks > 100) {
                allInputsValid = false;
            } else {
                const grade = getGrade(marks);
                const gradePoint = gradePoints[grade];
                
                subjectsForReport.push({ name, marks, grade, credit: credits, gradePoints: gradePoint });
                
                if (credits > 0) {
                    totalCredits += credits;
                    totalGradePoints += gradePoint * credits;
                }
            }
        });

        if (!allInputsValid) {
            showError('Please enter valid marks (0-100) for all subjects.');
            return;
        }
        if (totalCredits === 0) {
            showError('No subjects with credits to calculate.');
            return;
        }

        const sgpa = (totalGradePoints / totalCredits).toFixed(2);
        renderResult(subjectsForReport, sgpa);
    }
    
    function renderResult(subjects, sgpa) {
    ui.resultContainer.style.display = 'block';

    // --- Helper function to animate the SGPA counter ---
    const animateCounter = (element, finalValue) => {
        const duration = 3000; // Animation duration in milliseconds (3 seconds)
        const frameRate = 60; // Updates per second
        const interval = 1000 / frameRate;
        const totalSteps = Math.ceil(duration / interval);
        const increment = finalValue / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                clearInterval(timer);
                element.textContent = parseFloat(finalValue).toFixed(2);
            } else {
                element.textContent = current.toFixed(2);
            }
        }, interval);
    };

    // --- Prepare data for stats and charts ---
    const totalCredits = subjects.reduce((acc, s) => acc + s.credit, 0);
    const bestPerformingSubject = subjects.reduce((best, current) => (current.marks > best.marks ? current : best), { name: 'N/A', marks: 0 });
    const sgpaGaugeId = 'sgpaGaugeChart';
    const subjectBarChartId = 'subjectBarChart';

    // --- Create the modern result card HTML ---
    ui.resultContainer.innerHTML = `
        <div class="p-6 md:p-8 rounded-2xl text-white aurora-background shadow-2xl">
            <h3 class="text-3xl font-bold mb-8 text-center tracking-wider">Semester Performance Dashboard</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="flex flex-col gap-6">
                    <div class="clay-card p-6 flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-300 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18"/></svg>
                        <div>
                            <div class="text-lg font-semibold text-gray-300">Total Credits</div>
                            <div class="text-4xl font-bold text-white">${totalCredits}</div>
                        </div>
                    </div>
                     <div class="clay-card p-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-300 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        <div class="overflow-hidden">
                            <div class="text-lg font-semibold text-gray-300">Top Subject</div>
                            <div class="text-xl font-bold text-white truncate" title="${bestPerformingSubject.name}">${bestPerformingSubject.name}</div>
                            <p class="text-gray-200">${bestPerformingSubject.marks} Marks</p>
                        </div>
                    </div>
                </div>

                <div class="clay-card p-6 flex flex-col justify-center items-center h-full order-first lg:order-none">
                    <div class="text-2xl font-bold text-gray-200 mb-2">SGPA</div>
                    <div class="relative w-48 h-48">
                         <canvas id="${sgpaGaugeId}"></canvas>
                         <div id="sgpa-counter" class="absolute inset-0 flex items-center justify-center text-5xl font-bold text-cyan-300" style="margin-top: -20px;">0.00</div>
                    </div>
                </div>

                <div class="clay-card p-4 h-80">
                    <canvas id="${subjectBarChartId}"></canvas>
                </div>
            </div>

             <div class="mt-8">
                 <h4 class="text-xl font-semibold mb-4 text-center text-gray-200">Detailed Report</h4>
                <div class="overflow-hidden rounded-xl clay-card p-2">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-white border-opacity-20">
                                    <th class="text-left p-3">Subject</th>
                                    <th class="text-center p-3">Marks</th>
                                    <th class="text-center p-3">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${subjects.map(s => `
                                    <tr class="border-b border-white border-opacity-10 last:border-none">
                                        <td class="p-3 text-left">${s.name}</td>
                                        <td class="p-3 text-center">${s.marks}</td>
                                        <td class="p-3 text-center font-bold text-lg">${s.grade}</td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- Animate the SGPA counter after rendering the element ---
    const sgpaCounterElement = document.getElementById('sgpa-counter');
    if (sgpaCounterElement) {
        animateCounter(sgpaCounterElement, sgpa);
    }
    
    // --- Initialize SGPA Gauge Chart ---
    const gaugeCtx = document.getElementById(sgpaGaugeId)?.getContext('2d');
    if (gaugeCtx) {
        const gaugeColor = sgpa >= 8.5 ? '#2dd4bf' : sgpa >= 7 ? '#60a5fa' : '#facc15';
        new Chart(gaugeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [sgpa, 10 - sgpa],
                    backgroundColor: [gaugeColor, 'rgba(255, 255, 255, 0.1)'],
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 20,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                circumference: 180,
                rotation: -90,
                plugins: { tooltip: { enabled: false } },
            }
        });
    }

    // --- Initialize Subject Bar Chart ---
    const barCtx = document.getElementById(subjectBarChartId)?.getContext('2d');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: subjects.map(s => s.name),
                datasets: [{
                    label: 'Grade Points',
                    data: subjects.map(s => s.gradePoints),
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                    borderRadius: 8,
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bar chart
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true, max: 10,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }
}
    
    function clearAll() {
        ui.yearSelect.value = '';
        ui.semesterSelect.innerHTML = '<option value="">Select Semester</option>';
        ui.semesterSelect.disabled = true;
        ui.branchSelect.value = '';
        ui.groupSelect.value = '';
        ui.tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Please make your selections.</td></tr>';
        ui.resultContainer.innerHTML = '';
        updateSelectorsVisibility('');
    }

    function showError(message) {
        ui.errorMessage.textContent = message;
        setTimeout(() => { ui.errorMessage.textContent = ''; }, 3000);
    }

    initialize();
});