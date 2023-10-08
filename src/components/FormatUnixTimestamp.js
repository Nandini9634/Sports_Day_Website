export default function FormatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  };

  return date.toLocaleDateString("en-IN", options);
}
