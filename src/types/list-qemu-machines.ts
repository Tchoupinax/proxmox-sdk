// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu/{vmid}
export type ListQemuMachinesPayload = {};

export type QemuMachine = {
  /**
   * Maximum usable CPUs.
   */
  cpus: number;
  /**
   * Root disk size in bytes.
   */
  maxdisk: number;
  /**
   * Maximum memory in bytes.
   */
  maxmem: number;
  name: string;
  /**
   * Current state of the VM.
   *
   * QEMU process status.
   */
  status: "running" | "stopped";
  /**
   * The current configured tags, if any
   * Splitted by ;
   */
  tags: string;
  /**
   * Uptime duration in second.
   */
  uptime: string;
  /**
   * The (unique) ID of the VM.
   */
  vmid: number;
};
export type ListQemuMachinesAnswer = Array<QemuMachine>;
