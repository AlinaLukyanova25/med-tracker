import { getElement, querySelectorEl } from "../types/types.js"

export class MenuManager {
    private openMenu: boolean = false;
    private imgMenu: HTMLImageElement;
    private headerListDesktop: HTMLUListElement;
    private headerListMobile: HTMLUListElement;
    private menuList: HTMLDivElement;

    constructor() {
        this.headerListDesktop = querySelectorEl<HTMLUListElement>('.header-list-desktop');
        this.headerListMobile = querySelectorEl<HTMLUListElement>('.header-list-mobile');
        this.menuList = querySelectorEl<HTMLDivElement>('.header-list__mobile');
        this.imgMenu = getElement<HTMLImageElement>('menu-img');

        this.init()
    }

    init() {
        if (window.innerWidth > 500) {
            this.headerListMobile.style.display = 'none'
            this.headerListDesktop.style.display = 'flex'
        } else {
            this.headerListDesktop.style.display = 'none'
            this.headerListMobile.style.display = 'flex'
        }

        this.setupEventListeners()
        this.openSection('main-page')
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize())
        document.addEventListener('click', (e) => this.handleLinkClick(e))
        document.addEventListener('click', (e) => this.handleOpenMenu(e))
        document.addEventListener('click', (e) => this.closeMenu(e))
    }

    handleResize() {
        const isDesktop = window.innerWidth > 500
        this.headerListMobile.style.display = isDesktop ? 'none' : 'flex'
        this.headerListDesktop.style.display = isDesktop ? 'flex' : 'none'

        if (!isDesktop) {
            this.menuList.style.display = 'none'
            this.imgMenu.src = "img/burger.svg"
            this.openMenu = false
        }
    }

    handleOpenMenu(e: Event) {
        const target = e.target as HTMLElement

        const divOpen = target.closest('.header-list__open')
        if (!divOpen) return

        this.openMenu = !this.openMenu
        this.updateBurgerIcon()

        this.menuList.style.display = this.openMenu ? 'flex' : 'none'
    }

    updateBurgerIcon() {
        if (this.imgMenu) {
            this.imgMenu.src = this.openMenu ? "img/x.svg"  : "img/burger.svg"
        }
    }

    closeMenu(e: Event) {
        const target = e.target as HTMLElement
    
        if (!target.closest('.header-list__mobile') && this.openMenu && !target.closest('.header-list__open')) {
            this.menuList.style.display = 'none'
            this.imgMenu.src = "img/burger.svg"
            this.openMenu = false
        }
    }

    handleLinkClick(e: Event) {
        const target = e.target as HTMLElement;

        const link: HTMLElement | null = target.closest('.header-list__link')
        if (!link) return

        const page: string | undefined = link.dataset.page
        if (!page) return

        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none'
        });

        this.openSection(page)
    }

    openSection(page: string) {
        const link: HTMLElement | null = document.querySelector(`.${page}`)
        if (!link) {
            console.warn(`Секция с классом ${page} не найдена`)
            return
        }
        link.style.display = 'block'
    }
}