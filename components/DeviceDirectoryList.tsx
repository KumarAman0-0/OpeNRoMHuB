"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Device } from "../lib/devices";

const statusStyle: Record<string, { fg: string; bg: string }> = {
  "unlock-verified": { fg: "var(--accent)", bg: "var(--accent-bg)" },
  "in-progress": { fg: "var(--amber)", bg: "var(--amber-bg)" },
  requested: { fg: "var(--muted)", bg: "var(--line-bg)" },
};

export default function DeviceDirectoryList({ initialDevices }: { initialDevices: Device[] }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedCustomDevice, setSelectedCustomDevice] = useState<Device | null>(null);

  const loadDevices = () => {
    try {
      const stored = localStorage.getItem("admin_custom_devices");
      if (stored) {
        const customDevices: Device[] = JSON.parse(stored);
        // Merge without duplicates (custom overrides by slug)
        const customSlugs = new Set(customDevices.map((d) => d.slug));
        const combined = [...customDevices, ...initialDevices.filter((d) => !customSlugs.has(d.slug))];
        setDevices(combined);
        return;
      }
    } catch {
      // ignore
    }
    setDevices(initialDevices);
  };

  useEffect(() => {
    loadDevices();

    const handleUpdate = () => loadDevices();
    window.addEventListener("admin_devices_updated", handleUpdate);
    return () => window.removeEventListener("admin_devices_updated", handleUpdate);
  }, [initialDevices]);

  return (
    <>
      <div className="manifest-head">
        <div>DEVICE</div>
        <div>LOCK TYPE</div>
        <div>STATUS</div>
        <div style={{ textAlign: "right" }}>ROMS</div>
      </div>

      {devices.map((d) => {
        const style = statusStyle[d.status] ?? statusStyle.requested;
        const isCustom = !initialDevices.some((init) => init.slug === d.slug);

        return isCustom ? (
          <div
            key={d.slug}
            className="manifest-row custom-device-row"
            onClick={() => setSelectedCustomDevice(d)}
            style={{ cursor: "pointer" }}
            title="Click to view custom ROM details (Admin listed)"
          >
            <div>
              <div className="mono device-name">
                {d.name}{" "}
                <span className="badge" style={{ marginLeft: "0.4rem" }}>
                  ADMIN LISTED
                </span>
              </div>
              <div className="meta">
                {d.manufacturer} · {d.schemeTag}
              </div>
            </div>
            <div className="lock-type">{d.lockType}</div>
            <div>
              <span className="status-tag mono" style={{ color: style.fg, background: style.bg }}>
                {d.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <div className="mono" style={{ textAlign: "right" }}>
              {d.roms.length}
            </div>
          </div>
        ) : (
          <Link href={`/devices/${d.slug}`} key={d.slug} className="manifest-row">
            <div>
              <div className="mono device-name">{d.name}</div>
              <div className="meta">
                {d.manufacturer} · {d.schemeTag}
              </div>
            </div>
            <div className="lock-type">{d.lockType}</div>
            <div>
              <span className="status-tag mono" style={{ color: style.fg, background: style.bg }}>
                {d.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <div className="mono" style={{ textAlign: "right" }}>
              {d.roms.length}
            </div>
          </Link>
        );
      })}

      {devices.length === 0 && <p>No devices listed yet.</p>}

      {/* Modal for viewing custom listed device */}
      {selectedCustomDevice && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setSelectedCustomDevice(null)}
        >
          <div
            className="admin-modal-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <div className="admin-modal-header mono">
              <span>{selectedCustomDevice.name} (CUSTOM LISTING)</span>
              <button
                type="button"
                className="admin-close-btn"
                onClick={() => setSelectedCustomDevice(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>
              <p style={{ color: "var(--muted)", margin: "0 0 1rem" }}>
                {selectedCustomDevice.manufacturer} · {selectedCustomDevice.schemeTag} ·{" "}
                {selectedCustomDevice.lockType}
              </p>

              {selectedCustomDevice.warnings.length > 0 && (
                <div className="warning-box">
                  <strong>Before you unlock this device:</strong>
                  <ul>
                    {selectedCustomDevice.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 className="mono" style={{ color: "var(--muted)", marginTop: "1.2rem" }}>
                AVAILABLE ROMS
              </h4>
              {selectedCustomDevice.roms.map((rom, i) => (
                <div className="rom-card" key={i}>
                  <strong className="mono">{rom.version}</strong>{" "}
                  {rom.verified && <span className="badge">community-verified</span>}
                  <p style={{ margin: "0.4rem 0" }}>{rom.changelog}</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0 0 0.6rem" }}>
                    {rom.date} · uploaded by {rom.uploader}
                  </p>
                  <a
                    className="btn"
                    href={rom.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download ROM
                  </a>
                </div>
              ))}

              <h4 className="mono" style={{ color: "var(--muted)", marginTop: "1.2rem" }}>
                FLASHING GUIDE
              </h4>
              <ol className="steps">
                {selectedCustomDevice.flashingGuide.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
