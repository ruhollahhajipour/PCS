export default function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
