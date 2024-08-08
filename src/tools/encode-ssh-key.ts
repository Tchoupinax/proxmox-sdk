export function encodeSSHKey(key: string): string {
  return encodeURIComponent(key);
}
