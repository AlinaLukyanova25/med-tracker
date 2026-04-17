import { ModalManager } from '../managers/modal.js';
import { querySelectorEl } from '../types/types.js';

export class KeyboardNavigation {
  private modal: ModalManager;

  constructor(modal: ModalManager) {
    this.modal = modal;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e: KeyboardEvent) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.closest('.close')) {
      this.handleCloseModal(e, target);
      return;
    }

    if (target.closest('.active__med-title')) {
      const card = target.closest('.active__med-title');

      if (!(card instanceof HTMLHeadingElement)) return;

      this.handleCardOpen(e, card);
      return;
    }

    if (target.closest('.active__card')) {
      const card = target.closest('.active__card');

      if (!(card instanceof HTMLLIElement)) return;

      this.handleCardOpen(e, card);
      return;
    }

    if (target.closest('.today')) {
      const today = querySelectorEl('.today', HTMLDivElement);
      this.handleCardOpen(e, today);
      return;
    }
  }

  handleCloseModal(e: KeyboardEvent, target: HTMLElement) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.modal.closeModal(target);
    }
  }

  handleCardOpen(e: KeyboardEvent, card: HTMLElement) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      card.click();
    }
  }
}
