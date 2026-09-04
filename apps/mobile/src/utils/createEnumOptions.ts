export function createEnumOptions<
  T extends Record<string, string>,
  K extends string,
>(enumObj: T, prefix: K) {
  return (Object.values(enumObj).reverse() as Array<T[keyof T]>).map(
    (value) => ({
      value,
      labelKey: `${prefix}.${value}` as const,
    }),
  );
}
