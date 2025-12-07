export const formatDateBR = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const formatDateTimeBR = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

export const formatHourTimeBR = (date: Date | string) => {
  const d = new Date(date);

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};
