import { querySelectorEl } from "../types/types.js";

export const domElements = {
    mainPage: querySelectorEl<HTMLElement>('.main-page'),
    sectionActive: querySelectorEl<HTMLElement>('.active'),

    activeList: querySelectorEl<HTMLUListElement>('.active__list'),
    receptionList: querySelectorEl<HTMLUListElement>('.reception-list'),
    missedList: querySelectorEl<HTMLUListElement>('.missed-list'),
    stockList: querySelectorEl<HTMLUListElement>('.stock-list'),

    activeButton: querySelectorEl<HTMLButtonElement>('.active__button')

}