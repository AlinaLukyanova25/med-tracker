export function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Элемент #${id} не найден`);
    return el;
}
export function querySelectorEl(selector) {
    const el = document.querySelector(selector);
    if (!el)
        throw new Error(`Элемент "${selector}" не найден`);
    return el;
}
