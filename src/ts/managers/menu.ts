import { domElements } from '../core/domElements.js';
import burgerSvg from '../../../img/burger.svg';
import xSvg from '../../../img/x.svg';

export class MenuManager {
  private openMenu: boolean = false;
  private imgMenu: HTMLImageElement = domElements.header.imgMenu;
  private headerListDesktop: HTMLUListElement =
    domElements.header.headerListDesktop;
  private headerListMobile: HTMLUListElement =
    domElements.header.headerListMobile;
  private menuList: HTMLDivElement = domElements.header.menuList;

  constructor() {
    this.init();
  }

  init() {
    if (window.innerWidth > 500) {
      this.headerListMobile.style.display = 'none';
      this.headerListDesktop.style.display = 'flex';
    } else {
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
      this.imgMenu.src = `${burgerSvg}`;
      this.openMenu = false;
    }
  }

  handleOpenMenu(e: MouseEvent) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    const divOpen = target.closest('.header-list__open');
    if (!divOpen) return;

    this.openMenu = !this.openMenu;
    this.updateBurgerIcon();

    this.menuList.style.display = this.openMenu ? 'flex' : 'none';
  }

  updateBurgerIcon() {
    if (this.imgMenu) {
      this.imgMenu.src = this.openMenu ? `${xSvg}` : `${burgerSvg}`;
    }
  }

  closeMenu(e: MouseEvent) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    if (
      !target.closest('.header-list__mobile') &&
      this.openMenu &&
      !target.closest('.header-list__open')
    ) {
      this.menuList.style.display = 'none';
      this.imgMenu.src = `${burgerSvg}`;
      this.openMenu = false;
    }
  }

  handleLinkClick(e: MouseEvent) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    const link = target.closest('.header-list__link');
    if (!(link instanceof HTMLElement)) return;

    const page = link.dataset.page;
    if (!page) return;

    document.querySelectorAll('section').forEach((section) => {
      section.style.display = 'none';
    });

    this.openSection(page);
  }

  openSection(page: string) {
    const link: HTMLElement | null = document.querySelector(`.${page}`);
    if (!link) {
      console.warn(`Секция с классом ${page} не найдена`);
      return;
    }
    link.style.display = 'block';
  }
}
