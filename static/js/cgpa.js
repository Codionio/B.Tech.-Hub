document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const yearlyView = document.getElementById('yearly-view');
    const overallView = document.getElementById('overall-view');
    const viewToggleYearly = document.getElementById('view-toggle-yearly');
    const viewToggleOverall = document.getElementById('view-toggle-overall');
    
    const yearTabs = document.querySelectorAll('.year-tab');
    const yearlySgpaInputs = document.getElementById('yearly-sgpa-inputs');
    const yearlyCgpaDisplay = document.getElementById('cgpa-display-yearly');
    const yearlyChartCanvas = document.getElementById('yearlySgpaChart');
    const yearlyForecasterInput = document.getElementById('target-cgpa-yearly');
    const yearlyForecastResult = document.getElementById('forecast-result-yearly');
    
    const overallSgpaInputs = document.getElementById('overall-sgpa-inputs');
    const overallCgpaDisplay = document.getElementById('cgpa-display-overall');
    const overallChartCanvas = document.getElementById('overallSgpaChart');

    let yearlyChart, overallChart;
    let currentYear = 1;
    const semestersByYear = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8] };

    // --- View Switching Logic ---
    function setView(view) {
        if (view === 'yearly') {
            yearlyView.classList.remove('hidden');
            overallView.classList.add('hidden');
            viewToggleYearly.classList.add('active');
            viewToggleOverall.classList.remove('active');
        } else {
            yearlyView.classList.add('hidden');
            overallView.classList.remove('hidden');
            viewToggleYearly.classList.remove('active');
            viewToggleOverall.classList.add('active');
        }
    }

    // --- YEAR-WISE CALCULATOR LOGIC ---
    function renderYearlyInputs() {
        const semesters = semestersByYear[currentYear];
        document.getElementById('input-title').textContent = `${currentYear}${currentYear === 1 ? 'st' : 'nd'} Year SGPA`;
        yearlySgpaInputs.innerHTML = semesters.map(sem => `
            <div class="flex items-center justify-between">
                <label for="sem-${sem}" class="font-medium text-gray-700 dark:text-gray-300">Semester ${sem}</label>
                <input type="number" id="sem-${sem}" class="sgpa-input-yearly w-24 px-3 py-1 border dark:bg-gray-700 dark:border-gray-600 rounded-lg" placeholder="SGPA">
            </div>
        `).join('');
        calculateYearly();
    }

    function calculateYearly() {
        const inputs = yearlySgpaInputs.querySelectorAll('.sgpa-input-yearly');
        let total = 0, count = 0;
        const chartData = [null, null];
        inputs.forEach((input, i) => {
            const val = parseFloat(input.value);
            if (!isNaN(val) && val >= 0 && val <= 10) {
                total += val;
                count++;
                chartData[i] = val;
            }
        });
        const cgpa = count > 0 ? (total / count).toFixed(2) : '0.00';
        yearlyCgpaDisplay.textContent = cgpa;
        updateYearlyChart(chartData);
        calculateYearlyForecast();
    }
    
    function calculateYearlyForecast() {
        const targetCgpa = parseFloat(yearlyForecasterInput.value);
        const inputs = yearlySgpaInputs.querySelectorAll('.sgpa-input-yearly');
        yearlyForecastResult.style.display = 'none';
        if (isNaN(targetCgpa) || targetCgpa <= 0 || inputs.length < 2) return;

        const firstSemValue = parseFloat(inputs[0].value);
        if (!isNaN(firstSemValue) && inputs[1].value === '') {
            const requiredSgpa = (targetCgpa * 2 - firstSemValue).toFixed(2);
            let message, className;
            if (requiredSgpa > 10) {
                message = `Target is not achievable. You need an SGPA of <span class="font-bold text-red-500">${requiredSgpa}</span>.`;
                className = 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200';
            } else if (requiredSgpa <= 4) {
                 message = `You have already surpassed your target!`;
                 className = 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200';
            } else {
                message = `You need an SGPA of <span class="font-bold text-green-600 dark:text-green-400">${requiredSgpa}</span> in the next semester.`;
                className = 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200';
            }
            yearlyForecastResult.innerHTML = message;
            yearlyForecastResult.className = `mt-4 p-4 rounded-lg text-lg font-semibold ${className}`;
            yearlyForecastResult.style.display = 'block';
        }
    }

    function updateYearlyChart(data) {
        const labels = semestersByYear[currentYear].map(sem => `Sem ${sem}`);
        const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 10 } } };
        if (yearlyChart) {
            yearlyChart.data.labels = labels;
            yearlyChart.data.datasets[0].data = data;
            yearlyChart.update();
        } else {
            yearlyChart = new Chart(yearlyChartCanvas.getContext('2d'), { type: 'bar', data: { labels, datasets: [{ label: 'SGPA', data, backgroundColor: 'rgba(79, 70, 229, 0.6)', borderRadius: 4 }] }, options: chartOptions });
        }
    }

    // --- OVERALL CGPA CALCULATOR LOGIC ---
    function initializeOverall() {
        overallSgpaInputs.innerHTML = Array.from({ length: 8 }, (_, i) => `
            <div class="flex items-center justify-between">
                <label for="overall-sem-${i + 1}" class="font-medium text-gray-700 dark:text-gray-300">Semester ${i + 1}</label>
                <input type="number" id="overall-sem-${i + 1}" class="sgpa-input-overall w-24 px-3 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="SGPA">
            </div>
        `).join('');
        calculateOverall();
    }

    function calculateOverall() {
        const inputs = overallSgpaInputs.querySelectorAll('.sgpa-input-overall');
        let total = 0, count = 0;
        const chartData = Array(8).fill(null);
        inputs.forEach((input, i) => {
            const val = parseFloat(input.value);
            if (!isNaN(val) && val >= 0 && val <= 10) {
                total += val;
                count++;
                chartData[i] = val;
            }
        });
        const cgpa = count > 0 ? (total / count).toFixed(2) : '0.00';
        overallCgpaDisplay.textContent = cgpa;
        updateOverallChart(chartData);
    }
    
    function updateOverallChart(data) {
        const labels = Array.from({ length: 8 }, (_, i) => `Sem ${i + 1}`);
        const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 10 } } };
        if (overallChart) {
            overallChart.data.datasets[0].data = data;
            overallChart.update();
        } else {
            overallChart = new Chart(overallChartCanvas.getContext('2d'), { type: 'line', data: { labels, datasets: [{ label: 'SGPA', data, borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true, tension: 0.3 }] }, options: chartOptions });
        }
    }
    
    // --- EVENT LISTENERS & INITIAL SETUP ---
    viewToggleYearly.addEventListener('click', () => setView('yearly'));
    viewToggleOverall.addEventListener('click', () => setView('overall'));
    yearTabs.forEach(tab => tab.addEventListener('click', () => { yearTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentYear = parseInt(tab.dataset.year); renderYearlyInputs(); }));
    yearlySgpaInputs.addEventListener('input', calculateYearly);
    yearlyForecasterInput.addEventListener('input', calculateYearlyForecast);
    overallSgpaInputs.addEventListener('input', calculateOverall);

    setView('yearly');
    renderYearlyInputs();
    initializeOverall();
});