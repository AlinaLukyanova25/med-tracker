import { saveToStorage } from "./storage.js";
import { querySelectorEl } from "./types.js";
import { baseFunctions } from "./base.js";
export class MainPageManager {
    constructor(receptions) {
        this.receptionManager = receptions;
        this.receptions = receptions.getReceptions();
        this.receptionList = querySelectorEl('.reception-list');
        this.init();
    }
    init() {
        baseFunctions.renderReceptionList(this.receptions);
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e));
    }
    handleButtonAcceptedClick(e) {
        const target = e.target;
        const button = target.closest('.reception-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const needReception = this.receptions.find(r => r.id === Number(dataId));
        if (!needReception)
            return;
        needReception.taken = true;
        if (needReception.stock > 0)
            needReception.stock = needReception.stock - 1;
        saveToStorage(this.receptions);
        console.log(this.receptions);
        baseFunctions.renderReceptionList(this.receptions);
    }
}
MainPageManager.instance = null;
