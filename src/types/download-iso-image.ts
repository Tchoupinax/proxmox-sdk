// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/storage/{storage}/download-url
export type DownloadIsoImagePayload = {
  /**
   * Content type.
   */
  content: "iso" | "vztmpl";
  /**
   * The name of the file to create. Caution: This will be normalized!
   */
  filename: string;
  /**
   * The cluster node name.
   */
  node: string;
  /**
   * The storage identifier.
   */
  storage: string;
  /**
   * The URL to download the file from.
   */
  url: string;
}
