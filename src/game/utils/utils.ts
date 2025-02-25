// Только утилиты, связанные с игрой. Остальные утилиты в src/utils

// Возвращает поле с инвертированными колонками и клетками в колонках.
// (не изменяет оригинальное поле)
export const reverseField = (field: number[][]) => {
  return field.map((column) => column.toReversed()).toReversed();
};
