export function generateToken() {
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  const token = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return token;
}
