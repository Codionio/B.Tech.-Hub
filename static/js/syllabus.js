// Updated Syllabus page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const branchSelection = document.getElementById('branchSelection');
    const yearSelection = document.getElementById('yearSelection');
    const semesterSelection = document.getElementById('semesterSelection');
    const syllabusDisplay = document.getElementById('syllabusDisplay');
    const syllabusTitle = document.getElementById('syllabusTitle');
    const subjectsGrid = document.getElementById('subjectsGrid');

    const syllabusData = {
        cse: {
            1: 'static/syllabus/cse_year1.pdf',
            2: 'static/syllabus/cse_year2.pdf',
            3: 'static/syllabus/cse_year3.pdf',
            4: 'static/syllabus/cse_year4.pdf'
        },
        cseds: {
            1: 'static/syllabus/cse_year1.pdf',
            2: 'static/syllabus/cse_year2.pdf',
            3: 'static/syllabus/cse_year3.pdf',
            4: 'static/syllabus/cse_year4.pdf'
        },
        aiml: {
            1: 'static/syllabus/cse_year1.pdf',
            2: 'static/syllabus/cse_year2.pdf',
            3: 'static/syllabus/cse_year3.pdf',
            4: 'static/syllabus/cse_year4.pdf'
        },
        ece: {
            1: 'static/syllabus/ece_year1.pdf',
            2: 'static/syllabus/ece_year2.pdf',
            3: 'static/syllabus/ece_year3.pdf',
            4: 'static/syllabus/ece_year4.pdf'
        },
        me: {
            1: 'static/syllabus/me_year1.pdf',
            2: 'static/syllabus/me_year2.pdf',
            3: 'static/syllabus/me_year3.pdf',
            4: 'static/syllabus/me_year4.pdf'
        },
        ce: {
            1: 'static/syllabus/ce_year1.pdf',
            2: 'static/syllabus/ce_year2.pdf',
            3: 'static/syllabus/ce_year3.pdf',
            4: 'static/syllabus/ce_year4.pdf'
        },
        ee: {
            1: 'static/syllabus/ee_year1.pdf',
            2: 'static/syllabus/ee_year2.pdf',
            3: 'static/syllabus/ee_year3.pdf',
            4: 'static/syllabus/ee_year4.pdf'
        },
        it: {
            1: 'static/syllabus/it_year1.pdf',
            2: 'static/syllabus/it_year2.pdf',
            3: 'static/syllabus/it_year3.pdf',
            4: 'static/syllabus/it_year4.pdf'
        }
    };

    let currentBranch = null;

    // Make selectBranch function global
    window.selectBranch = function(branchCode) {
        currentBranch = branchCode;
        
        // Hide branch selection
        branchSelection.classList.add('hidden');
        
        // Show year selection in same grid format
        yearSelection.classList.remove('hidden');
        
        // Update year selection title
        const yearTitle = yearSelection.querySelector('h2');
        if (yearTitle) {
            yearTitle.textContent = `Select Year - ${branchCode.toUpperCase()}`;
        }
    };

    // Make selectYear function global
    window.selectYear = function(year) {
        // Hide year selection
        yearSelection.classList.add('hidden');
        
        // Show syllabus PDF directly
        const pdfPath = syllabusData[currentBranch][year];
        if (pdfPath) {
            // Create and show PDF viewer
            syllabusTitle.textContent = `Syllabus - ${currentBranch.toUpperCase()} Year ${year}`;
            
            // Clear subjects grid
            subjectsGrid.innerHTML = '';
            
            // Create PDF viewer iframe
            const iframe = document.createElement('iframe');
            iframe.src = `/${pdfPath}`;
            iframe.className = 'w-full h-screen border-0';
            iframe.style.height = '80vh';
            
            subjectsGrid.appendChild(iframe);
            
            // Show syllabus display
            syllabusDisplay.classList.remove('hidden');
        }
    };

    // Make goBack function global
    window.goBack = function(from) {
        if (from === 'year') {
            // Go back to branch selection
            yearSelection.classList.add('hidden');
            branchSelection.classList.remove('hidden');
            currentBranch = null;
        } else if (from === 'semester') {
            // Go back to year selection
            syllabusDisplay.classList.add('hidden');
            yearSelection.classList.remove('hidden');
        }
    };
});
