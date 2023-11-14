export const Store = {
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  reset: () => {
    localStorage.clear();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};
