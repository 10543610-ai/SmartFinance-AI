
export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(`finance_app_${key}`, JSON.stringify(data));
};

export const loadFromStorage = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(`finance_app_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
};
