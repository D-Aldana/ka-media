/**
 * ig.me opens the DM thread instead of the profile grid, so "say hi" is one
 * tap away. Falls back to the profile for handles it can't vouch for.
 */
export function instagramDm(handle: string, profileUrl: string): string {
  const user = handle.trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]+$/.test(user) ? `https://ig.me/m/${user}` : profileUrl;
}
