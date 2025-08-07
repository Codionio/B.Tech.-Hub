// Resources page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const branchSelect = document.getElementById('branch-select');
    const semesterSelect = document.getElementById('semester-select');
    const semesterContainer = document.getElementById('semester-container');
    const resourceContainer = document.getElementById('resource-container');
    const resourceBlocks = resourceContainer.querySelectorAll('.resource-block');

    branchSelect.addEventListener('change', () => {
        if (branchSelect.value) {
            semesterContainer.classList.remove('hidden');
        } else {
            semesterContainer.classList.add('hidden');
            resourceBlocks.forEach(block => block.classList.add('hidden'));
            semesterSelect.value = '';
        }
    });

    semesterSelect.addEventListener('change', () => {
        const selectedBranch = branchSelect.value;
        const selectedSemester = semesterSelect.value;

        resourceBlocks.forEach(block => {
            const blockBranch = block.getAttribute('data-branch');
            const blockSemester = block.getAttribute('data-semester');

            if (blockBranch === selectedBranch && blockSemester === selectedSemester) {
                block.classList.remove('hidden');
            } else {
                block.classList.add('hidden');
            }
        });
    });
});
