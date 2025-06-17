const getLocalStorage = (nameLocal) => {
  const getLocal = localStorage.getItem(nameLocal);
  return JSON.parse(getLocal) || [];
};

export default getLocalStorage;
