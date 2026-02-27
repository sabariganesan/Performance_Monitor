import { RangeType } from "./dateTimeUtil.type";

const formatDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const formatted =
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())} ` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`;

  return formatted;
};

export const isWithinTimeRange = (lastHeartbeat: string, range: string) => {
  if (range === "custom") return true; // skip for now

  // Convert "YYYY-MM-DD HH:mm:ss" -> ISO
  const normalized = lastHeartbeat.replace(" ", "T");
  const heartbeatTime = new Date(normalized).getTime();
  const now = Date.now();

  const diffMs = now - heartbeatTime;

  switch (range) {
    case "1h":
      return diffMs <= 60 * 60 * 1000;
    case "6h":
      return diffMs <= 6 * 60 * 60 * 1000;
    case "24h":
      return diffMs <= 24 * 60 * 60 * 1000;
    default:
      return true;
  }
};

export const getDateRange = (range: RangeType) => {
  const end = new Date();
  let start = new Date();

  switch (range) {
    case "1h":
      start = new Date(end.getTime() - 60 * 60 * 1000);
      break;

    case "6h":
      start = new Date(end.getTime() - 6 * 60 * 60 * 1000);
      break;

    case "24h":
      start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      break;

    default:
      start = new Date(0);
  }

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};
