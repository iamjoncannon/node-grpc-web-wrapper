export const prettyDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

export const getConnectionStatusDisplay = (isConnected: boolean) =>
  isConnected ? "Connected" : "Not Connected";
