// https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu
type CreateQemuMachineBasePayload = {
  /**
   * Automatic restart after crash (currently ignored).
   */
  autostart?: boolean;
  /**
   * Select BIOS implementation.
   *
   * default = seabios.
   */
  bios?: "seabios" | "ovmf";
  /**
   * Memory quantity.
   *
   * default = 512(MB)
   */
  memory?: number;
  /**
   * The name of the VM.
   */
  name: string;
  /**
   * The cluster node name.
   */
  node: string;
  /**
   * Specify guest operating system. This is used to enable special
   * optimization/features for specific operating systems:
   *
   * - l24: Linux 2.4 Kernel
   * - l26: Linux 2.6 - 6.X Kernel
   * - other: unspecified OS
   * - solaris: Solaris/OpenSolaris/OpenIndiania kernel
   * - w2k3: Microsoft Windows 2003
   * - w2k8: Microsoft Windows 2008
   * - w2k: Microsoft Windows 2000
   * - win10: Microsoft Windows 10/2016/2019
   * - win11: Microsoft Windows 11/2022
   * - win7: Microsoft Windows 7
   * - win8: Microsoft Windows 8/2012/2012r2
   * - wvista: Microsoft Windows Vista
   * - wxp: Microsoft Windows XP
   */
  ostype?: OS;
  /**
   * The (unique) ID of the VM.
   * It should be between 100 and 999999999.
   */
  vmid: number;
};

export type CreateQemuMachinePayload = CreateQemuMachineBasePayload & {
  /**
   * The number of cores per socket.
   *
   * default = 1
   */
  coreCount?: number;
  /**
   * ISO name
   *
   * The name of the filename you gave to the ISO.
   * (e.g: debian.iso)
   */
  isoName?: string;
  /**
   * Specify the name of the storage, according to the Proxmox installation
   * it can be different
   *
   * It's the storage where you have a section "VM Disks"
   */
  localStorageName: "local" | "local-lvm";
  /**
   * Networks configurations
   */
  networks?: Array<QemuNetwork>;
};

export type CreateQemuMachineProxmoxPayload = CreateQemuMachineBasePayload & {
  /**
   * The number of cores per socket.
   *
   * default = 1
   */
  cores?: number;
  efidisk0: string;
  /**
   * cloud-init: Specify IP addresses and gateways for the corresponding interface.
   *
   * IP addresses use CIDR notation, gateways are optional but need an IP of the same type specified.
   * The special string 'dhcp' can be used for IP addresses to use DHCP, in which case no explicit
   * gateway should be provided.
   *
   * For IPv6 the special string 'auto' can be used to use stateless autoconfiguration. This requires
   * cloud-init 19.4 or newer.
   *
   * If cloud-init is enabled and neither an IPv4 nor an IPv6 address is specified, it defaults to using
   * dhcp on IPv4.
   *
   * [gw=<GatewayIPv4>] [,gw6=<GatewayIPv6>] [,ip=<IPv4Format/CIDR>] [,ip6=<IPv6Format/CIDR>]
   */
  ipconfig0?: string;
  /**
   * cloud-init: Specify IP addresses and gateways for the corresponding interface.
   *
   * IP addresses use CIDR notation, gateways are optional but need an IP of the same type specified.
   * The special string 'dhcp' can be used for IP addresses to use DHCP, in which case no explicit
   * gateway should be provided.
   *
   * For IPv6 the special string 'auto' can be used to use stateless autoconfiguration. This requires
   * cloud-init 19.4 or newer.
   *
   * If cloud-init is enabled and neither an IPv4 nor an IPv6 address is specified, it defaults to using
   * dhcp on IPv4.
   *
   * [gw=<GatewayIPv4>] [,gw6=<GatewayIPv6>] [,ip=<IPv4Format/CIDR>] [,ip6=<IPv6Format/CIDR>]
   */
  ipconfig1?: string;
  net0: string;
  numa: number;
  /**
   * scsi[n]
   * Use volume as SCSI hard disk or CD-ROM (n is 0 to 30).
   * Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.
   * Use STORAGE_ID:0 and the 'import-from' parameter to import
   * from an existing volume.
   */
  scsi0?: string;
  /**
   * scsi[n]
   * Use volume as SCSI hard disk or CD-ROM (n is 0 to 30).
   * Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.
   * Use STORAGE_ID:0 and the 'import-from' parameter to import
   * from an existing volume.
   */
  scsi2?: string;
  scsihw?: "virtio-scsi-single";

  sockets: number;
};

export type OS =
  | "other" |
  "wxp" |
  "w2k" |
  "w2k3" |
  "w2k8" |
  "wvista" |
  "win7" |
  "win8" |
  "win10" |
  "win11" |
  "l24" |
  "l26" |
  "solaris";

export type QemuNetwork = {
  bridge: "vmbr0";
  firewall: boolean;
  model: "virtio";
};
