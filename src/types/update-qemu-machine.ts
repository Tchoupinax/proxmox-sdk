export type OS = "other" | "wxp" | "w2k" | "w2k3" | "w2k8" | "wvista" | "win7" | "win8" | "win10" | "win11" | "l24" | "l26" | "solaris";

export type QemuNetwork = {
  bridge: "vmbr0" |"vmbr1";
  /**
   * By default Proxmox set true
   */
  firewall: boolean;
  model: "virtio";
  /**
   * If wanted, we can associated the machine to a VLAN
   */
  tag?: number;
}
// PUT https://pve.proxmox.com/pve-docs/api-viewer/#/nodes/{node}/qemu/{vmid}/config
type UpdateQemuMachineBasePayload = {
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
   * Tags of the VM. This is only meta information.
   */
  tags: Array<string>;
  /**
   * The (unique) ID of the VM.
   * It should be between 100 and 999999999.
   */
  vmid: number;
}

export type UpdateQemuMachinePayload = UpdateQemuMachineBasePayload & {
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
   * Networks configurations
   */
  networks?: Array<QemuNetwork>;
  /**
   * Override the default password.
   *
   * PROXMOX DOCS
   *
   * cloud-init: Password to assign the user. Using this is generally not recommended. Use ssh keys instead.
   * Also note that older cloud-init versions do not support hashed passwords.
   */
  overridenPassword?: string;
  /**
   * Override the default user
   *
   * PROXMOX DOCS
   *
   * cloud-init: User name to change ssh keys and password for instead of the image's configured default user.
   */
  overridenUser?: string;
  sshkey?: string;
}

export type UpdateQemuMachineProxmoxPayload = UpdateQemuMachineBasePayload & {
  /**
   * cloud-init: Password to assign the user. Using this is generally not recommended. Use ssh keys instead.
   * Also note that older cloud-init versions do not support hashed passwords.
   */
  cipassword?: string;
  /**
   * cloud-init: User name to change ssh keys and password for instead of the image's configured default user.
   */
  ciuser?: string;
  /**
   * The number of cores per socket.
   *
   * default = 1
   */
  cores?: number;
  efidisk0: string;
  /**
   * Use volume as IDE hard disk or CD-ROM (n is 0 to 3). Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.
   * Use STORAGE_ID:0 and the 'import-from' parameter to import from an existing volume.
   *
   * [file=]<volume> [,aio=<native|threads|io_uring>] [,backup=<1|0>] [,bps=<bps>] [,bps_max_length=<seconds>] [,bps_rd=<bps>] [,bps_rd_max_length=<seconds>] [,bps_wr=<bps>] [,bps_wr_max_length=<seconds>] [,cache=<enum>] [,cyls=<integer>] [,detect_zeroes=<1|0>] [,discard=<ignore|on>] [,format=<enum>] [,heads=<integer>] [,import-from=<source volume>] [,iops=<iops>] [,iops_max=<iops>] [,iops_max_length=<seconds>] [,iops_rd=<iops>] [,iops_rd_max=<iops>] [,iops_rd_max_length=<seconds>] [,iops_wr=<iops>] [,iops_wr_max=<iops>] [,iops_wr_max_length=<seconds>] [,mbps=<mbps>] [,mbps_max=<mbps>] [,mbps_rd=<mbps>] [,mbps_rd_max=<mbps>] [,mbps_wr=<mbps>] [,mbps_wr_max=<mbps>] [,media=<cdrom|disk>] [,model=<model>] [,replicate=<1|0>] [,rerror=<ignore|report|stop>] [,secs=<integer>] [,serial=<serial>] [,shared=<1|0>] [,size=<DiskSize>] [,snapshot=<1|0>] [,ssd=<1|0>] [,trans=<none|lba|auto>] [,werror=<enum>] [,wwn=<wwn>]
   */
  ide0?: string;
  /**
   * Use volume as IDE hard disk or CD-ROM (n is 0 to 3). Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.
   * Use STORAGE_ID:0 and the 'import-from' parameter to import from an existing volume.
   *
   * [file=]<volume> [,aio=<native|threads|io_uring>] [,backup=<1|0>] [,bps=<bps>] [,bps_max_length=<seconds>] [,bps_rd=<bps>] [,bps_rd_max_length=<seconds>] [,bps_wr=<bps>] [,bps_wr_max_length=<seconds>] [,cache=<enum>] [,cyls=<integer>] [,detect_zeroes=<1|0>] [,discard=<ignore|on>] [,format=<enum>] [,heads=<integer>] [,import-from=<source volume>] [,iops=<iops>] [,iops_max=<iops>] [,iops_max_length=<seconds>] [,iops_rd=<iops>] [,iops_rd_max=<iops>] [,iops_rd_max_length=<seconds>] [,iops_wr=<iops>] [,iops_wr_max=<iops>] [,iops_wr_max_length=<seconds>] [,mbps=<mbps>] [,mbps_max=<mbps>] [,mbps_rd=<mbps>] [,mbps_rd_max=<mbps>] [,mbps_wr=<mbps>] [,mbps_wr_max=<mbps>] [,media=<cdrom|disk>] [,model=<model>] [,replicate=<1|0>] [,rerror=<ignore|report|stop>] [,secs=<integer>] [,serial=<serial>] [,shared=<1|0>] [,size=<DiskSize>] [,snapshot=<1|0>] [,ssd=<1|0>] [,trans=<none|lba|auto>] [,werror=<enum>] [,wwn=<wwn>]
   */
  ide1?: string;
  /**
   * Use volume as IDE hard disk or CD-ROM (n is 0 to 3). Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.
   * Use STORAGE_ID:0 and the 'import-from' parameter to import from an existing volume.
   *
   * [file=]<volume> [,aio=<native|threads|io_uring>] [,backup=<1|0>] [,bps=<bps>] [,bps_max_length=<seconds>] [,bps_rd=<bps>] [,bps_rd_max_length=<seconds>] [,bps_wr=<bps>] [,bps_wr_max_length=<seconds>] [,cache=<enum>] [,cyls=<integer>] [,detect_zeroes=<1|0>] [,discard=<ignore|on>] [,format=<enum>] [,heads=<integer>] [,import-from=<source volume>] [,iops=<iops>] [,iops_max=<iops>] [,iops_max_length=<seconds>] [,iops_rd=<iops>] [,iops_rd_max=<iops>] [,iops_rd_max_length=<seconds>] [,iops_wr=<iops>] [,iops_wr_max=<iops>] [,iops_wr_max_length=<seconds>] [,mbps=<mbps>] [,mbps_max=<mbps>] [,mbps_rd=<mbps>] [,mbps_rd_max=<mbps>] [,mbps_wr=<mbps>] [,mbps_wr_max=<mbps>] [,media=<cdrom|disk>] [,model=<model>] [,replicate=<1|0>] [,rerror=<ignore|report|stop>] [,secs=<integer>] [,serial=<serial>] [,shared=<1|0>] [,size=<DiskSize>] [,snapshot=<1|0>] [,ssd=<1|0>] [,trans=<none|lba|auto>] [,werror=<enum>] [,wwn=<wwn>]
   */
  ide2?: string;
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
  /**
   * cloud-init: Setup public SSH keys (one key per line, OpenSSH format).
   */
  sshkeys?: string;
}
