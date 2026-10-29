import { getAllDevices } from "../../lib/devices";
import DeviceDirectoryList from "../../components/DeviceDirectoryList";

export const metadata = {
  title: "Device Directory — Open ROM Hub",
  description: "Browse community-maintained custom ROMs and unlock guides for locked devices.",
};

export default function DevicesPage() {
  const devices = getAllDevices();

  return (
    <main>
      <p className="lede">
        Custom ROMs for devices locked by MDM restrictions, maintained by the community. Every
        entry here is added through a reviewed pull request — nothing is uploaded directly.
      </p>

      <DeviceDirectoryList initialDevices={devices} />
    </main>
  );
}
