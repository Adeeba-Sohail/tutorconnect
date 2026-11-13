// Small helpers that turn raw values into text for the screen.
const priceFormatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

export function formatPKR(amount) {
  return `PKR ${priceFormatter.format(amount)}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
  return `${hours} h ${rest} min`;
}

// "17:00" -> "5:00 PM"
export function formatTime(time) {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
}

export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
