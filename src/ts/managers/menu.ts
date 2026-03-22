import { querySelectorEl } from "../types/types.js"

export class MenuManager {
    private headerList: HTMLUListElement;

    constructor() {
        this.headerList = querySelectorEl<HTMLUListElement>('.header-list');

        this.init()
    }

    init() {
        this.headerList.addEventListener('click', (e) => this.handleLinkClick(e))
        this.openSection('main-page')
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