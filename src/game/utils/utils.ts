// Только утилиты, связанные с игрой. Остальные утилиты в src/utils

// Возвращает поле с инвертированными колонками
// (не изменяет оригинальное поле)
export const reverseField = (field: number[][]) => {
  return field.toReversed();
};
