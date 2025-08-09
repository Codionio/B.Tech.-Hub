/**
 * SGPA Calculator - Corrected Implementation
 *
 * This version fixes the critical "emptyMessage is not defined" reference error,
 * allowing the subject table to render correctly for all selections.
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
        'Computer Science & Engineering': 'CSE',
        'CSE (Data Science)': 'CSEDS',
        'CSE (AI & ML)': 'AIML',
        'Information Technology': 'IT',
        'Electronics & Communication Engineering': 'ECE',
        'Electrical Engineering': 'EE',
        'Electrical & Electronics Engineering': 'EEE',
        'Mechanical Engineering': 'ME',
        'Civil Engineering': 'CE'
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
            showError('Could not load subject data. Please check file path and run on a server.');
        }
    }

    function setupEventListeners() {
        ui.yearSelect.addEventListener('change', handleYearChange);
        ui.semesterSelect.addEventListener('change', populateSubjects);
        ui.branchSelect.addEventListener('change', populateSubjects);
        ui.groupSelect.addEventListener('change', populateSubjects);
        ui.calculateBtn.addEventListener('click', calculateSGPA);
        ui.clearBtn.addEventListener('click', clearAll);
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
            // The value should match the key in the JSON, e.g., "Semester I"
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
    
    // **FIXED FUNCTION SIGNATURE**
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

        ui.tableBody.querySelectorAll('.marks-input').forEach(input => {
            input.addEventListener('input', handleMarksInput);
        });
    }

    // --- Calculation Logic ---

    function handleMarksInput(event) {
        const input = event.target;
        const marks = parseInt(input.value);
        const gradeDisplay = input.closest('tr').querySelector('.grade-display');
        
        if (isNaN(marks) || marks < 0 || marks > 100) {
            gradeDisplay.textContent = '-';
            gradeDisplay.classList.remove('text-green-600');
            gradeDisplay.classList.add('text-red-600');
            return;
        }

        const grade = getGrade(marks);
        gradeDisplay.textContent = grade;
        gradeDisplay.classList.remove('text-red-600');
        gradeDisplay.classList.add(grade === 'F' ? 'text-red-600' : 'text-green-600');
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
        
        marksInputs.forEach(input => {
            const marks = parseInt(input.value);
            const credits = parseInt(input.dataset.credit);
            if (isNaN(marks) || marks < 0 || marks > 100) {
                allInputsValid = false;
            } else {
                if (credits > 0) {
                    totalCredits += credits;
                    totalGradePoints += gradePoints[getGrade(marks)] * credits;
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
        ui.resultContainer.innerHTML = `<p class="text-2xl font-bold text-green-600">Your Final SGPA is: ${sgpa}</p>`;
    }

    // --- Helper Functions ---
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