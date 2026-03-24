import { getElement, querySelectorEl } from "../types/types.js";
export class MenuManager {
    constructor() {
        this.openMenu = false;
        this.imgMenu = null;
        this.headerList = querySelectorEl('.header-list');
        if (window.innerWidth < 500) {
            this.mobileStyle();
            this.imgMenu = getElement('menu-img');
            document.addEventListener('click', (e) => this.handleOpenMenu(e));
            document.addEventListener('click', (e) => this.closeMenu(e));
        }
        this.init();
    }
    init() {
        this.headerList.addEventListener('click', (e) => this.handleLinkClick(e));
        this.openSection('main-page');
    }
    mobileStyle() {
        this.headerList.innerHTML = this.createMobileHeaderComponent();
    }
    createMobileHeaderComponent() {
        return `
        <li class="header-list__item"><a href="#" data-page="main-page" class="header-list__link">Главная</a></li>
        <div class="header-list__open">
        <img src="./../../img/burger.svg" id="menu-img">
        </div>
        `;
    }
    handleOpenMenu(e) {
        var _a;
        const target = e.target;
        const divOpen = target.closest('.header-list__open');
        if (!divOpen)
            return;
        if (target.closest('.header-list__mobile'))
            return;
        if (this.imgMenu) {
            if (this.openMenu) {
                this.imgMenu.src = "./../../img/burger.svg";
                this.openMenu = false;
            }
            else {
                this.imgMenu.src = "./../../img/x.svg";
                this.openMenu = true;
            }
        }
        const menu = `
        <div class="header-list__mobile">
            <li class="header-list__item"><a href="#" data-page="active" class="header-list__link">Активные</a></li>
            <li class="header-list__item"><a href="#" data-page="calendar" class="header-list__link">Календарь</a></li>
            <li class="header-list__item"><a href="#" data-page="archive" class="header-list__link">Архив</a></li>
        </div>
        `;
        this.openMenu ? divOpen.insertAdjacentHTML('beforeend', menu) : (_a = divOpen.querySelector('.header-list__mobile')) === null || _a === void 0 ? void 0 : _a.remove();
    }
    closeMenu(e) {
        var _a;
        const target = e.target;
        if (!target.closest('.header-list__mobile') && this.openMenu && !target.closest('.header-list__open')) {
            (_a = document.querySelector('.header-list__mobile')) === null || _a === void 0 ? void 0 : _a.remove();
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
