export function formatLastSeen(lastSeen) {
  const date = new Date(lastSeen);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString();
  } else {
    return date.toLocaleDateString();
  }
}