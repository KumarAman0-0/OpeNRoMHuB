import Link from "next/link";
import DeviceRequestForm from "../../components/DeviceRequestForm";

export const metadata = {
  title: "Request a Device — Open ROM Hub",
  description: "Request a custom ROM or MDM bypass for locked institutional devices.",
};

export default function RequestPage() {
  return (
    <main>
      <p className="mono" style={{ marginBottom: "0.2rem", fontSize: "0.82rem", color: "var(--muted)" }}>
        <Link href="/devices">← All devices</Link>
      </p>
      <h1 className="hero-title" style={{ fontSize: "1.9rem", marginBottom: "0.5rem" }}>
        Request a Device
      </h1>
      <p className="lede" style={{ marginBottom: "2rem" }}>
        Tell the community which locked device you need a custom ROM or unlock guide for. Enter the
        device name, model identifier, and desired features below.
      </p>

      <DeviceRequestForm />

      <div className="request-tips">
        <h3 className="section-label mono">TIPS FOR A SUCCESSFUL REQUEST</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <strong className="mono">Exact Model Number</strong>
            <p>
              Check <em>Settings → About Phone/Tablet → Model Number</em> or inspect the regulatory
              label printed on the back panel.
            </p>
          </div>
          <div className="tip-card">
            <strong className="mono">Chipset & Processor</strong>
            <p>
              Devices with MediaTek (MTK) or Unisoc SoCs often require specific flashing tools
              (SP Flash Tool, SPD Research Tool), while Qualcomm devices use EDL mode.
            </p>
          </div>
          <div className="tip-card">
            <strong className="mono">Community Review</strong>
            <p>
              ROM requests are tracked publicly via GitHub Issues where contributors, testers, and
              reverse-engineers collaborate.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
