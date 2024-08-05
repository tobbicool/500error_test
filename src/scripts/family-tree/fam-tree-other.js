document.addEventListener('DOMContentLoaded', (event) => {
    const toggleButton = document.querySelector('.fam-tree-sidebar__arrow');
    const toggleButtonImg = document.querySelector('.fam-tree-sidebar__arrow img');
    const sidebarSection = document.querySelector('.fam-tree-sidebar');
    const sidebarSectionWrapper = document.querySelector('.fam-tree-sidebar-wrapper');

    toggleButton.addEventListener('click', () => {
        sidebarSection.classList.toggle('toggleSidebar');
        sidebarSectionWrapper.classList.toggle('toggleSidebarWrapper');
        toggleButtonImg.classList.toggle('transformArrow');
    });

    // Detect touch devices and show touch-specific tips
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    if (isTouchDevice) {
        document.querySelector('.fam-tree-sidebar__additional-tips__touch').style.display = 'block';
        document.querySelector('.fam-tree-sidebar__additional-tips__pc').style.display = 'none';
    } else {
        document.querySelector('.fam-tree-sidebar__additional-tips__touch').style.display = 'none';
        document.querySelector('.fam-tree-sidebar__additional-tips__pc').style.display = 'block';
    }


    // Overflowing gradient sidebar
    const tipsWrapper = document.querySelector('.fam-tree-sidebar__tips');
    const tipsContainer = document.querySelector('.fam-tree-sidebar__tips-wrapper');

    function checkScroll() {
        const scrollTop = tipsWrapper.scrollTop;
        const scrollHeight = tipsWrapper.scrollHeight;
        const offsetHeight = tipsWrapper.offsetHeight;

        const topOpacity = scrollTop === 0 ? 0 : 1;
        const bottomOpacity = scrollTop + offsetHeight >= scrollHeight ? 0 : 1;

        tipsContainer.style.setProperty('--before-opacity', topOpacity);
        tipsContainer.style.setProperty('--after-opacity', bottomOpacity);
    }

    tipsWrapper.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
});
