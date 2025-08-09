document.addEventListener('DOMContentLoaded', function() {
    let subjectsData = {};

    const yearSelect = document.getElementById('year');
    const branchSelect = document.getElementById('branch');
    const semesterSelect = document.getElementById('semester');
    const resourceGrid = document.getElementById('resourceGrid');

    // Fetch subject data from a JSON file
    async function loadSubjectsData() {
        try {
            // In a real application, you would fetch this from your server/API
            // const response = await fetch('/static/files/subjects.json');
            // subjectsData = await response.json();
            
            // Using mock data for demonstration purposes
            subjectsData = {
                "Second Year": {
                    "cse": {
                        "Semester 3": {
                            "Data Structure": "BCS301",
                            "Computer Organization & Architecture": "BCS302",
                            "Discrete Structures & Theory of Logic": "BCS303",
                            "Universal Human Values": "BVE301"
                        },
                        "Semester 4": {
                            "Operating System": "BCS401",
                            "Theory of Automata & Formal Language": "BCS402",
                            "Microprocessor": "BCS403",
                            "Python Programming": "BPL401"
                        }
                    }
                }
                // Add more data for other years, branches, and semesters here
            };
            console.log('Subjects data loaded successfully.');
        } catch (error) {
            console.error('Error loading subjects data:', error);
            resourceGrid.innerHTML = '<p class="placeholder-text col-span-full">Could not load subject data. Please try again later.</p>';
        }
    }

    // Update the UI based on dropdown selections
    function updateResources() {
        const year = yearSelect.value;
        const branch = branchSelect.value;
        const semester = semesterSelect.value;

        if (!year || !branch || !semester) {
            resourceGrid.innerHTML = '<p class="placeholder-text col-span-full">Please make your selections to view resources.</p>';
            return;
        }

        const subjects = subjectsData[year]?.[branch]?.[semester];
        
        resourceGrid.innerHTML = ''; // Clear previous results

        if (!subjects || Object.keys(subjects).length === 0) {
            resourceGrid.innerHTML = '<p class="placeholder-text col-span-full">Sorry, no resources found for the selected criteria. We are updating our database.</p>';
            return;
        }

        for (const [subjectName, subjectCode] of Object.entries(subjects)) {
            const card = document.createElement('div');
            card.className = 'subject-card';

            let notesLinks = '';
            let pyqLinks = '';
            let videoLinks = '';

            for (let i = 1; i <= 5; i++) {
                notesLinks += `<a href="#" class="resource-link">Unit ${i}</a>`;
                pyqLinks += `<a href="#" class="resource-link">${2024 - i}</a>`;
                videoLinks += `<a href="#" class="resource-link">Unit ${i} Videos</a>`;
            }

            card.innerHTML = `
                <div class="subject-card-header">
                    <h3 class="subject-title">${subjectName}</h3>
                    <p class="subject-code">${subjectCode}</p>
                </div>
                <div>
                    <h4 class="resource-section-title">📝 Unit-wise Notes</h4>
                    <div class="resource-links">${notesLinks}</div>
                    
                    <h4 class="resource-section-title">📄 Previous Year Questions (PYQs)</h4>
                    <div class="resource-links">${pyqLinks}</div>
                    
                    <h4 class="resource-section-title">🎥 Video Lectures</h4>
                    <div class="resource-links">${videoLinks}</div>
                </div>
            `;
            resourceGrid.appendChild(card);
        }
    }

    // Event Listeners for dropdowns
    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        semesterSelect.innerHTML = '<option value="">Select Semester</option>'; // Reset semesters
        
        if (selectedYear) {
            branchSelect.disabled = false;
            
            const yearMap = {
                'First Year': ['Semester 1', 'Semester 2'],
                'Second Year': ['Semester 3', 'Semester 4'],
                'Third Year': ['Semester 5', 'Semester 6'],
                'Fourth Year': ['Semester 7', 'Semester 8']
            };

            const semesters = yearMap[selectedYear] || [];
            semesters.forEach(sem => {
                const option = document.createElement('option');
                option.value = sem;
                option.textContent = sem;
                semesterSelect.appendChild(option);
            });
        } else {
            branchSelect.disabled = true;
            semesterSelect.disabled = true;
        }
        branchSelect.value = '';
        semesterSelect.value = '';
        updateResources();
    });

    branchSelect.addEventListener('change', () => {
        if (branchSelect.value) {
            semesterSelect.disabled = false;
        } else {
            semesterSelect.disabled = true;
        }
        semesterSelect.value = '';
        updateResources();
    });

    semesterSelect.addEventListener('change', updateResources);

    // Initial setup
    async function init() {
        await loadSubjectsData();
        // Any initial state setup can go here
    }

    init();
});