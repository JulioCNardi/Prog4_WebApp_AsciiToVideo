document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleSectionBtn');
    const sectionToToggle = document.getElementById('main-content-section');

    if (toggleButton && sectionToToggle) {
        toggleButton.addEventListener('click', () => {
            sectionToToggle.classList.toggle('hidden');
        });
    }
});