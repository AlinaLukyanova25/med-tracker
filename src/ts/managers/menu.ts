import { getElement, querySelectorEl } from "../types/types.js"

export class MenuManager {
    private headerList: HTMLUListElement;
    private openMenu: boolean = false;
    private imgMenu: HTMLImageElement | null = null;

    constructor() {
        this.headerList = querySelectorEl<HTMLUListElement>('.header-list');

        if (window.innerWidth < 500) {
            this.mobileStyle()
            this.imgMenu = getElement<HTMLImageElement>('menu-img')
            document.addEventListener('click', (e) => this.handleOpenMenu(e))
            document.addEventListener('click', (e) => this.closeMenu(e))
        }

        this.init()

    }

    init() {
        this.headerList.addEventListener('click', (e) => this.handleLinkClick(e))
        this.openSection('main-page')
    }

    mobileStyle() {
        this.headerList.innerHTML = this.createMobileHeaderComponent()
    }

    createMobileHeaderComponent(): string  {
        return `
        <li class="header-list__item"><a href="#" data-page="main-page" class="header-list__link">Главная</a></li>
        <div class="header-list__open">
        <img src="./../../img/burger.svg" id="menu-img">
        </div>
        `
    }

    handleOpenMenu(e: Event) {
        const target = e.target as HTMLElement

        const divOpen = target.closest('.header-list__open')
        if (!divOpen) return

        if (target.closest('.header-list__mobile')) return

        if (this.imgMenu) {
            if (this.openMenu) {
                this.imgMenu.src = "./../../img/burger.svg"
                this.openMenu = false
            } else {
                this.imgMenu.src = "./../../img/x.svg"
                this.openMenu = true
            }
        }

        const menu = `
        <div class="header-list__mobile">
            <li class="header-list__item"><a href="#" data-page="active" class="header-list__link">Активные</a></li>
            <li class="header-list__item"><a href="#" data-page="calendar" class="header-list__link">Календарь</a></li>
            <li class="header-list__item"><a href="#" data-page="archive" class="header-list__link">Архив</a></li>
        </div>
        `

        this.openMenu ? divOpen.insertAdjacentHTML('beforeend', menu) : divOpen.querySelector('.header-list__mobile')?.remove()
    }

    closeMenu(e: Event) {
        const target = e.target as HTMLElement
    
        if (!target.closest('.header-list__mobile') && this.openMenu && !target.closest('.header-list__open')) {
            document.querySelector('.header-list__mobile')?.remove()
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

    private openSection(page: string) {
        const link: HTMLElement | null = document.querySelector(`.${page}`)
        if (!link) {
            console.warn(`Секция с классом ${page} не найдена`)
            return
        }
        link.style.display = 'block'
    }
}