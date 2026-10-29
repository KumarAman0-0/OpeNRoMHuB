import { getAllDevices, getDeviceBySlug } from "../../../lib/devices";
import DeviceDiscussion from "../../../components/Giscus";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllDevices().map((d) => ({ slug: d.slug }));
}

export default function DevicePage({ params }: { params: { slug: string } }) {
  const device = getDeviceBySlug(params.slug);
  if (!device) return notFound();

  return (
    <main>
      <p className="mono" style={{ marginBottom: "0.2rem", fontSize: "0.82rem", color: "var(--muted)" }}>
        <a href="/devices">← All devices</a>
      </p>
      <h2 className="mono" style={{ marginBottom: "0.2rem" }}>{device.name}</h2>
      <p style={{ color: "var(--muted)", marginTop: 0, fontSize: "0.9rem" }}>
        {device.manufacturer} · {device.schemeTag} · {device.lockType}
      </p>

      {device.warnings.length > 0 && (
        <div className="warning-box">
          <strong>Before you unlock this device:</strong>
          <ul>
            {device.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="mono" style={{ fontSize: "0.8rem", letterSpacing: "0.03em", color: "var(--muted)" }}>
        AVAILABLE ROMS
      </h3>
      {device.roms.map((rom) => (
        <div className="rom-card" key={rom.version}>
          <strong className="mono">{rom.version}</strong>{" "}
          {rom.verified && <span className="badge">community-verified</span>}
          <p style={{ margin: "0.4rem 0" }}>{rom.changelog}</p>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0 0 0.6rem" }}>
            {rom.date} · uploaded by {rom.uploader}
          </p>
          <a className="btn" href={rom.downloadUrl}>
            Download
          </a>
        </div>
      ))}

      <h3 className="mono" style={{ fontSize: "0.8rem", letterSpacing: "0.03em", color: "var(--muted)" }}>
        FLASHING GUIDE
      </h3>
      <ol className="steps">
        {device.flashingGuide.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h3 className="mono" style={{ fontSize: "0.8rem", letterSpacing: "0.03em", color: "var(--muted)" }}>
        DISCUSSION
      </h3>
      <DeviceDiscussion term={device.slug} />
    </main>
  );
}
