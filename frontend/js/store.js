/**
 * STORE
 * Small wrapper around sessionStorage so every page (welcome -> login ->
 * examtype -> exam -> result) can read/write the same session object
 * without passing data through URLs.
 */
const STORE_KEY = "nu-exam-session";

const Store = {
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  },
  set(patch) {
    const current = Store.get();
    const next = Object.assign({}, current, patch);
    sessionStorage.setItem(STORE_KEY, JSON.stringify(next));
    return next;
  },
  clear() {
    sessionStorage.removeItem(STORE_KEY);
  }
};
