import { querySelectorEl } from "../types/types.js";
export class MenuManager {
    constructor() {
        this.headerList = querySelectorEl('.header-list');
        this.init();
    }
    init() {
        this.headerList.addEventListener('click', (e) => this.handleLinkClick(e));
        this.openSection('main-page');
    }
    handleLinkClick(e) {
        const target = e.target;
        const link = target.closest('.header-list__link');
        if (!link)
            return;
        const page = link.dataset.page;
        if (!page)
            return;
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        this.openSection(page);
    }
    openSection(page) {
        const link = document.querySelector(`.${page}`);
        if (!link) {
            console.warn(`Секция с классом ${page} не найдена`);
            return;
        }
        link.style.display = 'block';
    }
}
