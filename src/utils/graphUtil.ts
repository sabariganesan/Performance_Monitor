export const mapSeries = <T extends Record<string, any>>(
  arr: T[] = [],
  key: string,
) =>
  arr.map((item) => ({
    time: new Date(item.datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Number(item[key]) || 0,
  }));