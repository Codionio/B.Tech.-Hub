// Resources page JavaScript functionality with hierarchical navigation
document.addEventListener('DOMContentLoaded', function() {
    let subjectsData = {};
    let currentBranch = '';
    let currentYear = '';
    let currentSemester = '';
    
    // Load subjects data from JSON file
    async function loadSubjectsData() {
        try {
            const response = await fetch('/static/files/subjects.json');
            subjectsData = await response.json();
            console.log('Subjects data loaded:', subjectsData);
        } catch (error) {
            console.error('Error loading subjects data:', error);
            // Fallback data
            subjectsData = {
                "First Year": {
                    "Semester 1": {
                        "Engineering Physics": "BAS101",
                        "Engineering Mathematics-I": "BAS103",
                        "Fundamentals of Electrical Engineering": "BEE101",
                        "Programming for Problem Solving": "BCS101"
                    },
                    "Semester 2": {
                        "Engineering Chemistry": "BAS202",
                        "Engineering Mathematics-II": "BAS203",
                        "Fundamentals of Electronics Engineering": "BEC201",
                        "Fundamentals of Mechanical Engineering": "BME201"
                    }
                },
                "Second Year": {
                    "Semester 3": {
                        "Data Structure": "BCS301",
                        "Computer Organization and Architecture": "BCS302",
                        "Discrete Structures & Theory of Logic": "BCS303"
                    },
                    "Semester 4": {
                        "Operating System": "BCS401",
                        "Theory of Automata and Formal Languages": "BCS402",
                        "Object Oriented Programming with Java": "BCS403"
                    }
                }
            };
        }
    }
    
    // Initialize the page
    async function init() {
        await loadSubjectsData();
        showBranches();
    }
    
    // Navigation functions
    window.showBranches = function() {
        document.getElementById('branchSelection').classList.remove('hidden');
        document.getElementById('yearSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('subjectSelection').classList.add('hidden');
        document.getElementById('breadcrumbBranch').classList.add('hidden');
        document.getElementById('breadcrumbYear').classList.add('hidden');
        document.getElementById('breadcrumbSemester').classList.add('hidden');
        document.querySelector('.back-button').style.display = 'none';
    };
    
    window.selectBranch = function(branch) {
        currentBranch = branch;
        document.getElementById('branchSelection').classList.add('hidden');
        document.getElementById('yearSelection').classList.remove('hidden');
        document.getElementById('yearTitle').textContent = `📚 ${getBranchName(branch)} - Select Year`;
        document.getElementById('breadcrumbBranch').classList.remove('hidden');
        document.getElementById('breadcrumbBranch').querySelector('span').textContent = getBranchName(branch);
        document.querySelector('.back-button').style.display = 'block';
        document.querySelector('.back-button').onclick = showBranches;
    };
    
    window.selectYear = function(year) {
        currentYear = year;
        document.getElementById('yearSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.remove('hidden');
        document.getElementById('semesterTitle').textContent = `📚 ${getBranchName(currentBranch)} - ${year}`;
        document.getElementById('breadcrumbYear').classList.remove('hidden');
        document.getElementById('breadcrumbYear').querySelector('span').textContent = year;
        document.querySelector('.back-button').onclick = () => selectBranch(currentBranch);
        
        // Update semester cards based on year
        updateSemesterCards(year);
    };
    
    window.selectSemester = function(semester) {
        currentSemester = semester;
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('subjectSelection').classList.remove('hidden');
        document.getElementById('subjectTitle').textContent = `📖 ${getBranchName(currentBranch)} - ${currentYear} - ${semester}`;
        document.getElementById('breadcrumbSemester').classList.remove('hidden');
        document.getElementById('breadcrumbSemester').querySelector('span').textContent = semester;
        document.querySelector('.back-button').onclick = () => selectYear(currentYear);
        
        loadSubjects();
    };
    
    function updateSemesterCards(year) {
        const semesterCards = document.querySelectorAll('.semester-card');
        const yearMap = {
            'First Year': [1, 2],
            'Second Year': [3, 4],
            'Third Year': [5, 6],
            'Fourth Year': [7, 8]
        };
        
        const semesters = yearMap[year] || [1, 2, 3, 4, 5, 6, 7, 8];
        
        semesterCards.forEach((card, index) => {
            const semesterNum = index + 1;
            if (semesters.includes(semesterNum)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function loadSubjects() {
        const subjectGrid = document.getElementById('subjectGrid');
        subjectGrid.innerHTML = '';
        
        // Get subjects from the loaded JSON data
        const yearData = subjectsData[currentYear];
        if (!yearData) {
            subjectGrid.innerHTML = '<p class="text-gray-500">No subjects found for this year.</p>';
            return;
        }
        
        // Find the correct semester data
        let semesterData = null;
        const semesterKey = `Semester ${currentSemester.match(/\d+/)[0]}`;
        
        // Check if it's a common structure or branch-specific
        if (currentYear === 'First Year') {
            // First year has common subjects
            semesterData = yearData[semesterKey] || yearData[`Common Subjects (${semesterKey})`];
        } else {
            // Other years have branch-specific subjects
            // For now, show all branches' subjects
            Object.keys(yearData).forEach(branch => {
                if (yearData[branch][semesterKey]) {
                    semesterData = yearData[branch][semesterKey];
                }
            });
        }
        
        if (!semesterData) {
            subjectGrid.innerHTML = '<p class="text-gray-500">No subjects found for this semester.</p>';
            return;
        }
        
        // Create subject cards
        Object.entries(semesterData).forEach(([subjectName, credits]) => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            
            // Extract subject code if available
            const subjectCode = subjectName.match(/\(([^)]+)\)/)?.[1] || '';
            const cleanSubjectName = subjectName.replace(/\([^)]+\)/, '').trim();
            
            subjectCard.innerHTML = `
                <h3 class="subject-name">${cleanSubjectName}</h3>
                ${subjectCode ? `<p class="subject-code">${subjectCode}</p>` : ''}
                ${typeof credits === 'number' ? `<p class="text-sm text-gray-600 mt-2">${credits} Credits</p>` : ''}
            `;
            
            subjectCard.onclick = () => selectSubject(subjectName, subjectCode);
            subjectGrid.appendChild(subjectCard);
        });
    }
    
    function getBranchName(branchCode) {
        const branchNames = {
            'cse': 'Computer Science & Engineering',
            'cseds': 'Data Science',
            'aiml': 'AI & ML',
            'it': 'Information Technology',
            'ee': 'Electrical Engineering',
            'me': 'Mechanical Engineering',
            'ece': 'Electronics & Communication',
            'eee': 'Electrical & Electronics',
            'ce': 'Civil Engineering'
        };
        return branchNames[branchCode] || branchCode;
    }
    
    window.selectSubject = function(subjectName, subjectCode) {
        // Handle subject selection
        console.log(`Selected: ${subjectName} (${subjectCode}) for ${currentBranch} - ${currentYear} - ${currentSemester}`);
        
        // Example: Redirect to subject resources page
        // window.location.href = `/resources/${currentBranch}/${currentYear}/${currentSemester}/${subjectCode}`;
        
        // Or show subject details
        alert(`Selected: ${subjectName}\nCode: ${subjectCode}\nBranch: ${getBranchName(currentBranch)}\nYear: ${currentYear}\nSemester: ${currentSemester}`);
    };
    
    window.goBack = function() {
        if (document.getElementById('subjectSelection').classList.contains('hidden') === false) {
            selectYear(currentYear);
        } else if (document.getElementById('semesterSelection').classList.contains('hidden') === false) {
            selectBranch(currentBranch);
        } else if (document.getElementById('yearSelection').classList.contains('hidden') === false) {
            showBranches();
        }
    };
    
    // Initialize the page
    init();
});
