// Syllabus page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const yearContainer = document.getElementById('year-container');
    const yearCards = document.getElementById('year-cards');
    const syllabusContainer = document.getElementById('syllabus-container');
    const syllabusTitle = document.getElementById('syllabus-title');
    const syllabusPdf = document.getElementById('syllabus-pdf');

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

    function showYears(branchCode) {
        syllabusContainer.classList.add('hidden');
        syllabusPdf.src = '';
        syllabusTitle.textContent = '';

        yearCards.innerHTML = '';
        yearContainer.classList.remove('hidden');

        const years = [1, 2, 3, 4];
        years.forEach(year => {
            const card = document.createElement('div');
            card.className = 'cursor-pointer rounded-lg shadow-lg p-6 bg-gray-200 text-center hover:bg-gray-300';
            card.textContent = `Year ${year}`;
            card.onclick = () => showSyllabus(branchCode, year);
            yearCards.appendChild(card);
        });
    }

    function showSyllabus(branchCode, year) {
        const pdfPath = syllabusData[branchCode][year];
        if (pdfPath) {
            syllabusTitle.textContent = `Syllabus - ${branchCode.toUpperCase()} Year ${year}`;
            syllabusPdf.src = `/${pdfPath}`;
            syllabusContainer.classList.remove('hidden');
        }
    }
});
