// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu/{vmid}
export type DeleteQemuMachinePayload = {
  /**
   * If set, destroy additionally all disks not referenced in the config but with a matching VMID from all enabled storages.
   *
   * default = false
   */
  "destroy-unreferenced-disks"?: boolean;
  /**
   * The cluster node name.
   */
  node: string;
  /**
   * Remove VMID from configurations, like backup & replication jobs and HA.
   */
  purge?: boolean;
  /**
   * ignore locks - only root is allowed to use this option.
   */
  skiplock?: boolean;
  /**
   * The (unique) ID of the VM.
   * It should be between 100 and 999999999.
   */
  vmid: number;
};
