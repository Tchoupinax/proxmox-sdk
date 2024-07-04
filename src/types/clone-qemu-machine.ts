// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu/{vmid}/clone
export type CloneQemuMachinePayload = {
  newid: number;
  node: string;
  vmid: number;
}
