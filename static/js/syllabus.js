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
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1JnUgc5r_uQFh54oAteRhREKAEdhKRy8h/preview',
            3: 'https://drive.google.com/file/d/1d4kTWnGKLv7VA8HJ36YfzOhs0CbD_Lor/preview',
            4: 'https://drive.google.com/file/d/1RJCTfYpyuqorVDRpT3wnroTHZNlrvoBP/preview'
        },
        cseds: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1JnUgc5r_uQFh54oAteRhREKAEdhKRy8h/preview',
            3: 'https://drive.google.com/file/d/1doJi4t_ZxKzQ1bx0AKf4UslEAXIHNUaF/preview',
            4: 'https://drive.google.com/file/d/1nxxYZ5vwsvB9LopzkH3OhJPo8yxx7mqb/preview'
        },
        aiml: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1JnUgc5r_uQFh54oAteRhREKAEdhKRy8h/preview',
            3: 'https://drive.google.com/file/d/1WRJfxFnbOugj_UY3m1jo0-8zzutWxT71/preview',
            4: 'https://drive.google.com/file/d/1tXQGl6JwxK0sx3mcn2fxwDc09xjUqp1z/preview'
        },
        ece: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1JvTVE89hLEUUYEn49IaD8LmZ54mZn9Cx/preview',
            3: 'https://drive.google.com/file/d/11VrEjzWbe5_yw9_NdL1-J_Hzen0E-2Z7/preview',
            4: 'https://drive.google.com/file/d/1Pxj275hqbAuSiKnfaH0YVZxPuIE9nyGJ/preview'
        },
        me: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1bLt5ssaNJHXEBBoov34wUkKWfPkuuuHk/preview',
            3: 'https://drive.google.com/file/d/1qjrDn-nHV-b6up0m8tlD08imbxQLma00/preview',
            4: 'https://drive.google.com/file/d/1CcwyDAusPj9SUek2W3U-XA6mGS1V4KdR/preview'
        },
        ce: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1Z9kikfnQXu5cD-Vi6Uu6ktpekGL1DSEy/preview',
            3: 'https://drive.google.com/file/d/1Ke6OdXp_mZxpOzk_U44DUAnZUMHJzJba/preview',
            4: 'https://drive.google.com/file/d/1jehZ8SETIm9GIRien8lGrX3C4ymOX7-b/preview'
        },
        ee: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1aGre3rqJnzWxRj_ozz88HzsebLoaf9mI/preview',
            3: 'https://drive.google.com/file/d/1zyhn_v_3GosQLwE7NQkCBa4111H1hk1Y/preview',
            4: 'https://drive.google.com/file/d/1L4NBa3qSmYyuJfFP0Wk70qAFOOiYR05o/preview'
        },
        it: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1JnUgc5r_uQFh54oAteRhREKAEdhKRy8h/preview',
            3: 'https://drive.google.com/file/d/1y7liroLz6TN-foAC6iUe2O17y6qKFQ7l/preview',
            4: 'https://drive.google.com/file/d/14xYS5K3Vbh_xGhtYzvfdGLkUBKNn6dkl/preview'
        },
        eee: {
            1: 'https://drive.google.com/file/d/1ihtj9_ZfqivmF-4343LZP1lBhUc8kW_6/preview',
            2: 'https://drive.google.com/file/d/1iR_aCBWvaDBFsun3jltZg-IiYEuX7Vpj/preview',
            3: 'https://drive.google.com/file/d/14_bO3xMr4SZ8BN7N8pyyrjnqJzMdnYOr/preview',
            4: 'https://drive.google.com/file/d/1L4NBa3qSmYyuJfFP0Wk70qAFOOiYR05o/preview'
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
            iframe.src = pdfPath;
            iframe.className = 'w-full h-screen border-0';
            iframe.style.height = '95vh';
            // iframe.style.width = '50vw';
            
            subjectsGrid.appendChild(iframe);
            
            // Show syllabus display
            syllabusDisplay.classList.remove('hidden');
        }
    };

    // Make goBack function global
    window.goBack = function(from) {
        if (from === 'branch') {
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
