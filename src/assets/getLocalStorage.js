const getLocalStorage = () => {
  const getLocal = localStorage.getItem("users");
  return JSON.parse(getLocal) || [];
};

export default getLocalStorage;
