import { getElement, querySelectorEl } from "../types/types.js";
export class MenuManager {
    constructor() {
        this.openMenu = false;
        this.headerListDesktop = querySelectorEl('.header-list-desktop');
        this.headerListMobile = querySelectorEl('.header-list-mobile');
        this.menuList = querySelectorEl('.header-list__mobile');
        this.imgMenu = getElement('menu-img');
        this.init();
    }
    init() {
        if (window.innerWidth > 500) {
            this.headerListMobile.style.display = 'none';
            this.headerListDesktop.style.display = 'flex';
        }
        else {
            this.headerListDesktop.style.display = 'none';
            this.headerListMobile.style.display = 'flex';
        }
        this.setupEventListeners();
        this.openSection('main-page');
    }
    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('click', (e) => this.handleLinkClick(e));
        document.addEventListener('click', (e) => this.handleOpenMenu(e));
        document.addEventListener('click', (e) => this.closeMenu(e));
    }
    handleResize() {
        const isDesktop = window.innerWidth > 500;
        this.headerListMobile.style.display = isDesktop ? 'none' : 'flex';
        this.headerListDesktop.style.display = isDesktop ? 'flex' : 'none';
        if (!isDesktop) {
            this.menuList.style.display = 'none';
            this.imgMenu.src = "/img/burger.svg";
            this.openMenu = false;
        }
    }
    handleOpenMenu(e) {
        const target = e.target;
        const divOpen = target.closest('.header-list__open');
        if (!divOpen)
            return;
        this.openMenu = !this.openMenu;
        this.updateBurgerIcon();
        this.menuList.style.display = this.openMenu ? 'flex' : 'none';
    }
    updateBurgerIcon() {
        if (this.imgMenu) {
            this.imgMenu.src = this.openMenu ? "/img/x.svg" : "/img/burger.svg";
        }
    }
    closeMenu(e) {
        const target = e.target;
        if (!target.closest('.header-list__mobile') && this.openMenu && !target.closest('.header-list__open')) {
            this.menuList.style.display = 'none';
            this.imgMenu.src = "/img/burger.svg";
            this.openMenu = false;
        }
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
