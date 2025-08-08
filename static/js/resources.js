// Resources page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let selectedBranch = '';
    let selectedYear = 0;
    let selectedSemester = 0;

    // Popup modal functionality
    const modal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    let userData = null;

    // Show modal on page load
    modal.classList.remove('hidden');

    // Handle form submission
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        userData = {
            name: document.getElementById('userName').value,
            branch: document.getElementById('userBranch').value,
            year: document.getElementById('userYear').value,
            semester: document.getElementById('userSemester').value
        };
        
        // Hide modal
        modal.classList.add('hidden');
        
        // Clear form data after processing
        userForm.reset();
        userData = null;
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            userForm.reset();
            userData = null;
        }
    });

    // Navigation functions
    window.selectBranch = function(branch) {
        selectedBranch = branch;
        showYearSelection();
    };

    window.selectYear = function(year) {
        selectedYear = year;
        showSemesterSelection();
    };

    window.selectSemester = function(semester) {
        selectedSemester = semester;
        showSyllabus();
    };

    window.goBack = function(target) {
        // Hide all sections
        document.getElementById('branchSelection').classList.add('hidden');
        document.getElementById('yearSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('syllabusDisplay').classList.add('hidden');
        
        // Show target section
        switch(target) {
            case 'branch':
                document.getElementById('branchSelection').classList.remove('hidden');
                break;
            case 'year':
                document.getElementById('yearSelection').classList.remove('hidden');
                break;
            case 'semester':
                document.getElementById('semesterSelection').classList.remove('hidden');
                break;
        }
    };

    // Show year selection
    function showYearSelection() {
        document.getElementById('branchSelection').classList.add('hidden');
        document.getElementById('yearSelection').classList.remove('hidden');
    }

    // Show semester selection
    function showSemesterSelection() {
        document.getElementById('yearSelection').classList.add('hidden');
        document.getElementById('semesterSelection').classList.remove('hidden');
    }

    // Show syllabus
    function showSyllabus() {
        document.getElementById('semesterSelection').classList.add('hidden');
        document.getElementById('syllabusDisplay').classList.remove('hidden');
        
        // Update syllabus title
        document.getElementById('syllabusTitle').textContent = 
            `${getBranchName(selectedBranch)} - Year ${selectedYear}, Semester ${selectedSemester}`;
        
        // Populate subjects
        populateSubjects(selectedBranch, selectedYear, selectedSemester);
    }

    // Get branch name
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

    // Populate subjects
    function populateSubjects(branch, year, semester) {
        const subjectsGrid = document.getElementById('subjectsGrid');
        subjectsGrid.innerHTML = '';
        
        // Get subjects for the selected branch, year, and semester
        const subjects = getSubjectsForBranch(branch, year, semester);
        
        subjects.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500';
            subjectCard.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800 mb-4">${subject}</h3>
                <div class="flex flex-wrap gap-2">
                    <a href="#" class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors">Syllabus</a>
                    <a href="#" class="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition-colors">Notes</a>
                    <a href="#" class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors">Previous Papers</a>
                    <a href="#" class="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors">Books</a>
                </div>
            `;
            subjectsGrid.appendChild(subjectCard);
        });
    }

    // Get subjects for branch (mock data - replace with actual data)
    function getSubjectsForBranch(branch, year, semester) {
        // This is mock data - replace with actual subject data
        const mockSubjects = [
            "Engineering Mathematics",
            "Data Structures",
            "Computer Networks",
            "Database Management Systems",
            "Operating Systems",
            "Software Engineering"
        ];
        return mockSubjects;
    }

    // Branch data with subjects (for reference)
    const branchData = {
        cse: {
            name: "Computer Science & Engineering",
            subjects: {
                1: ["Engineering Mathematics-I", "Engineering Physics", "Engineering Chemistry", "Programming for Problem Solving", "Basic Electrical Engineering", "Environmental Studies"],
                2: ["Engineering Mathematics-II", "Data Structures", "Computer Organization", "Discrete Mathematics", "Technical Communication", "Python Programming"],
                3: ["Engineering Mathematics-III", "Design & Analysis of Algorithms", "Operating Systems", "Database Management Systems", "Computer Networks", "Software Engineering"],
                4: ["Engineering Mathematics-IV", "Theory of Computation", "Microprocessors", "Web Technologies", "Artificial Intelligence", "Machine Learning"],
                5: ["Compiler Design", "Computer Graphics", "Cloud Computing", "Cyber Security", "Mobile Computing", "Big Data Analytics"],
                6: ["Distributed Systems", "Internet of Things", "Blockchain Technology", "Natural Language Processing", "Computer Vision", "Quantum Computing"],
                7: ["Advanced Algorithms", "Deep Learning", "Robotics", "Augmented Reality", "Edge Computing", "DevOps"],
                8: ["Final Year Project", "Internship", "Research Methodology", "Technical Seminar", "Industrial Training", "Placement Preparation"]
            }
        },
        cseds: {
            name: "Data Science",
            subjects: {
                1: ["Engineering Mathematics-I", "Engineering Physics", "Engineering Chemistry", "Programming for Problem Solving", "Basic Electrical Engineering", "Environmental Studies"],
                2: ["Engineering Mathematics-II", "Data Structures", "Statistics for Data Science", "Python Programming", "Database Systems", "Technical Communication"],
                3: ["Probability & Statistics", "Data Mining", "Machine Learning", "Big Data Analytics", "Data Visualization", "Cloud Computing"],
                4: ["Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Time Series Analysis", "Business Analytics"],
                5: ["Advanced Machine Learning", "Neural Networks", "Data Engineering", "AI Ethics", "Recommendation Systems", "Data Governance"],
                6: ["MLOps", "Edge AI", "Quantum Computing", "Advanced Statistics", "Research Methods", "Capstone Project-I"],
                7: ["Specialized Electives", "Industry Projects", "Research Papers", "Advanced Topics", "Seminar", "Internship"],
                8: ["Final Year Project", "Thesis", "Placement Training", "Industry Collaboration", "Entrepreneurship", "Career Development"]
            }
        },
        aiml: {
            name: "AI & ML",
            subjects: {
                1: ["Engineering Mathematics-I", "Engineering Physics", "Engineering Chemistry", "Programming for Problem Solving", "Basic Electrical Engineering", "Environmental Studies"],
                2: ["Engineering Mathematics-II", "Data Structures", "Python Programming", "Linear Algebra", "Statistics", "Technical Communication"],
                3: ["Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing", "Robotics", "AI Programming"],
                4: ["Reinforcement Learning", "Neural Networks", "Advanced AI", "Edge Computing", "Quantum Computing", "Research Methods"]
            }
        }
    };
});




