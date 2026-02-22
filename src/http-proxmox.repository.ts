import axios from "axios";
import { Logger } from "nestjs-pino";

import { encodeSSHKey } from "./tools/encode-ssh-key";
import { UPID } from "./types";
import { CloneQemuMachinePayload } from "./types/clone-qemu-machine";
import {
  CreateQemuMachinePayload,
  CreateQemuMachineProxmoxPayload,
} from "./types/create-qemu-machine";
import { DeleteQemuMachinePayload } from "./types/delete-qemu-machine";
import { DownloadIsoImagePayload } from "./types/download-iso-image";
import { IP } from "./types/ip";
import { ListQemuMachinesAnswer } from "./types/list-qemu-machines";
import { StartQemuMachinePayload } from "./types/start-qemu-machine";
import { StopQemuMachinePayload } from "./types/stop-qemu-machine";
import {
  UpdateQemuMachinePayload,
  UpdateQemuMachineProxmoxPayload,
} from "./types/update-qemu-machine";

export type AuthConfig = {
  host: string;
  password: string;
  username: string;
};

// authorize self signed cert if you do not use a valid SSL certificat
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// https://pve.proxmox.com/wiki/Proxmox_VE_API#Authentication
export class HttpProxmoxRepository {
  constructor(
    private readonly parameters: AuthConfig,
    private readonly logger: Logger,
  ) {}

  async getProxmoxVersion(): Promise<string> {
    let data;
    try {
      data = await axios({
        url: this.computeUrl("/api2/json/version"),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      console.log(err);
    }

    return (data as unknown as any).data.data.version;
  }

  async listQemuMachines(node: string): Promise<ListQemuMachinesAnswer> {
    let data;
    try {
      data = await axios({
        url: this.computeUrl(`/api2/json/nodes/${node}/qemu`),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      console.log(err);
    }

    return (data as unknown as any).data.data;
  }

  async getQemuMachineVlanTag(node: string, vmid: number): Promise<number> {
    let data;
    try {
      data = await axios({
        url: this.computeUrl(`/api2/json/nodes/${node}/qemu/${vmid}/config`),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      this.logger.error(err);
      return 1;
    }

    const tag = data.data.data.net0
      .split(",")
      .find((e: string) => e.startsWith("tag"));
    if (tag) {
      return parseInt(tag.split("=").at(1), 10);
    }

    return 1;
  }

  async listQemuMachineIps(node: string, vmid: number): Promise<Array<IP>> {
    let data;
    try {
      data = await axios({
        url: this.computeUrl(
          `/api2/json/nodes/${node}/qemu/${vmid}/agent/network-get-interfaces`,
        ),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      this.logger.error(err);
      return [];
    }

    type PAYLOAD = {
      result: Array<{
        "hardware-address": string;
        "ip-addresses": Array<{
          "ip-address": IP;
          "ip-address-type": "ipv4" | "ipv6";
          "prefix": number;
        }>;
        "name": string;
        "statistics": {
          "rx-bytes": number;
          "rx-dropped": number;
          "rx-errs": number;
          "rx-packets": number;
          "tx-bytes": number;
          "tx-dropped": number;
          "tx-errs": number;
          "tx-packets": number;
        };
      }>;
    };

    const payload = (data as unknown as any)?.data?.data as PAYLOAD;
    console.log(payload);
    const answer = payload.result
      .map(eth =>
        eth["ip-addresses"]
          .filter(ip => ip["ip-address-type"] === "ipv4")
          .map(ip => ip["ip-address"]),
      )
      .flat()
      .filter(ip => !["127.0.0.1"].includes(ip));

    return answer;
  }

  async createQemuMachine(payload: CreateQemuMachinePayload): Promise<string> {
    let data;

    // According to this answer https://forum.proxmox.com/threads/can-not-create-vm-with-qcow2-format.114881/post-496759
    // when your Proxmox uses a local-lvm, the logical block storage does not support qcow2, only raw.
    const FORMAT = payload.localStorageName === "local" ? "qcow2" : "raw";

    const proxmoxPayload: CreateQemuMachineProxmoxPayload = {
      autostart: payload.autostart,
      bios: payload.bios,
      cores: payload.coreCount,
      efidisk0: `${payload.localStorageName}:1,efitype=4m,pre-enrolled-keys=1,format=${FORMAT}`,
      memory: payload.memory,
      name: payload.name,
      net0: "virtio,bridge=vmbr0,firewall=1,vlanid=10",
      node: payload.node,
      numa: 0,
      ostype: payload.ostype,
      scsi0: `${payload.localStorageName}:32,format=${FORMAT},iothread=on`,
      scsihw: "virtio-scsi-single",
      sockets: 1,
      vmid: payload.vmid,
    };

    if (payload.isoName) {
      proxmoxPayload.scsi2 = `${payload.localStorageName}:iso/${payload.isoName},media=cdrom`;
    }

    try {
      data = await axios({
        data: proxmoxPayload,
        headers: await this.prepareHeaders(),
        method: "POST",
        url: this.computeUrl(`/api2/json/nodes/${payload.node}/qemu`),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          vmid: payload.vmid,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  async listTemplates(payload: { node: string }) {
    let data;
    try {
      data = await axios({
        method: "GET",
        url: this.computeUrl(`/api2/json/cluster/resources`),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (
      (data as unknown as any)?.data?.data
        // @ts-ignore
        .filter(resource => resource.template === 1)
    );
  }

  async updateQemuMachine(payload: UpdateQemuMachinePayload): Promise<string> {
    let data;

    // @ts-ignore
    const proxmoxPayload: UpdateQemuMachineProxmoxPayload = {
      cores: payload.coreCount,
      memory: payload.memory,
      name: payload.name,
      tags: payload.tags,
      ipconfig0: "ip=dhcp",
      // ide2: `local:${payload.vmid}/vm-${payload.vmid}-cloudinit.qcow2,media=cdrom`,
      // overridenUsername: "toto",
      // overridenPassword: "toto",
      ciuser: payload.overridenUser,
      cipassword: payload.overridenPassword,
    };

    if (payload.sshkey) {
      proxmoxPayload.sshkeys = encodeSSHKey(payload.sshkey);
    }

    if (payload.networks?.[0]) {
      proxmoxPayload.net0 = `model=${payload.networks[0].model},bridge=${payload.networks[0].bridge},firewall=${payload.networks[0].firewall}`;
      if (payload.networks[0].tag) {
        proxmoxPayload.net0 += `,tag=${payload.networks[0].tag}`;
      }
    }

    try {
      data = await axios({
        data: proxmoxPayload,
        headers: await this.prepareHeaders(),
        method: "PUT",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/qemu/${payload.vmid}/config`,
        ),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          vmid: payload.vmid,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  async deleteQemuMachine(port: DeleteQemuMachinePayload): Promise<UPID> {
    let data;
    try {
      data = await axios({
        headers: await this.prepareHeaders(),
        method: "DELETE",
        url: this.computeUrl(`/api2/json/nodes/${port.node}/qemu/${port.vmid}`),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          vmid: port.vmid,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    const payload = (data as unknown as any)?.data?.data as UPID;

    return payload;
  }

  async downloadISOImage(payload: DownloadIsoImagePayload): Promise<string> {
    const params = new URLSearchParams({
      url: payload.url,
      content: payload.content,
      filename: payload.filename,
    });

    let data;
    try {
      data = await axios({
        headers: await this.prepareHeaders(),
        method: "POST",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/storage/${
            payload.storage
          }/download-url?${params.toString()}`,
        ),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  async startQemuMachine(payload: StartQemuMachinePayload) {
    let data;
    try {
      data = await axios({
        method: "POST",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/qemu/${payload.vmid}/status/start`,
        ),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  async stopQemuMachine(payload: StopQemuMachinePayload) {
    let data;
    try {
      data = await axios({
        method: "POST",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/qemu/${payload.vmid}/status/stop`,
        ),
        headers: await this.prepareHeaders(),
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }
    return (data as unknown as any)?.data?.data as string;
  }

  async cloneQemuMachine(payload: CloneQemuMachinePayload) {
    let data;
    try {
      data = await axios({
        method: "POST",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/qemu/${payload.vmid}/clone`,
        ),
        headers: {
          ...(await this.prepareHeaders()),
        },
        data: {
          full: 1,
          name: "azdzfaef2233",
          newid: payload.newid,
          target: payload.node,
        },
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  async resizeDisk(payload: {
    node: string;
    vmid: number;
    size: number;
    disk: string;
    unit: "G";
  }) {
    let data;
    try {
      data = await axios({
        method: "PUT",
        url: this.computeUrl(
          `/api2/json/nodes/${payload.node}/qemu/${payload.vmid}/resize`,
        ),
        headers: await this.prepareHeaders(),
        data: {
          disk: payload.disk,
          size: `+${payload.size}G`,
        },
      });
    } catch (err) {
      this.logger.error(
        {
          status: (err as any).response.status,
          ...payload,
          errors: (err as any).response.data.errors,
        },
        (err as any).response.statusText,
      );
    }

    return (data as unknown as any)?.data?.data as string;
  }

  private computeUrl(path: string) {
    return `${this.parameters.host}${path}`;
  }

  private async prepareHeaders() {
    const ticket = await this.getTicket();
    return {
      CSRFPreventionToken: ticket.CSRFPreventionToken,
      Cookie: `PVEAuthCookie=${ticket.ticket}`,
    };
  }

  private async getTicket(): Promise<{
    CSRFPreventionToken: string;
    cap: {
      dc: any;
      nodes: any;
    };
    ticket: string;
    username: string;
  }> {
    const params = new URLSearchParams({
      username: this.parameters.username,
      password: this.parameters.password,
    });

    let data;
    try {
      const url = this.computeUrl(
        `/api2/json/access/ticket?${params.toString()}`,
      );
      ({ data } = await axios({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }));
    } catch (err) {
      console.log((err as any).response.status);
      console.log((err as any).response.statusText);
    }

    return (data as unknown as any).data;
  }
}
