function getTokenExpiration(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return null;

    // Convert from seconds to milliseconds
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
}
function isTokenExpired(token: string): boolean {
  const expirationDate = getTokenExpiration(token);
  if (!expirationDate) return true;

  const currentDate = new Date();
  return currentDate > expirationDate;
}
