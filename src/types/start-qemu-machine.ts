// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu/{vmid}/status/start
export type StartQemuMachinePayload = {
  node: string;
  vmid: number;
};
