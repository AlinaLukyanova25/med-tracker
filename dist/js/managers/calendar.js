import { getElement } from "../types/types.js";
export class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.init();
    }
    init() {
        this.setupEventLisneters();
        this.renderCalendar();
    }
    updateMonthHeader() {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const currentMonthEl = getElement('current-month');
        const monthName = monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        currentMonthEl.textContent = `${monthName} ${year}`;
    }
    renderCalendar() {
        const calendarElement = getElement('calendar');
        calendarElement.innerHTML = '';
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const dayInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const startOffset = startingDay === 0 ? 6 : startingDay - 1;
        const endDay = lastDay.getDay();
        const endOffset = endDay === 0 ? 6 : endDay - 1;
        for (let day = 0; day < startOffset; day++) {
            const dayElement = this.createDayComponent();
            calendarElement.insertAdjacentHTML('beforeend', dayElement);
        }
        for (let day = 1; day <= dayInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayElement = this.createDayComponent(date, day);
            calendarElement.insertAdjacentHTML('beforeend', dayElement);
        }
        for (let day = endOffset; day < 6; day++) {
            const dayElement = this.createDayComponent();
            calendarElement.insertAdjacentHTML('beforeend', dayElement);
        }
        this.updateMonthHeader();
    }
    createDayComponent(date, day) {
        if (!date || !day) {
            return `
            <div tabindex="0" class="calendar__day" style="color: gray;">
            </div>
            `;
        }
        const dayNumber = date.getDate();
        const dateToString = this.formatDateToString(date);
        // ${dateToString}
        return `
        <div tabindex="0" class="calendar__day" style="color: #1e293b;" data-date="${dateToString}">
        ${dayNumber}
        </div>
        `;
    }
    formatDateToString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    changeMonth(direction) {
        this.currentDate.setDate(1);
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }
    setupEventLisneters() {
        getElement('prev-month').addEventListener('click', () => this.changeMonth(-1));
        getElement('next-month').addEventListener('click', () => this.changeMonth(1));
    }
}
