"use client";

import { useEffect, useState } from "react";
import { Device, Rom } from "../lib/devices";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<"form" | "manage" | "json">("form");

  // Form Fields
  const [name, setName] = useState("");
  const [modelName, setModelName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [schemeTag, setSchemeTag] = useState("UP Govt Student Scheme");
  const [lockType, setLockType] = useState("MDM + locked bootloader");
  const [status, setStatus] = useState<"unlock-verified" | "in-progress" | "requested">(
    "unlock-verified"
  );
  const [romVersion, setRomVersion] = useState("LineageOS 21 (Android 14)");
  const [romDescription, setRomDescription] = useState(
    "Full MDM removal, Knox disabled, working camera, Wi-Fi, audio and Google Play pre-installed."
  );
  const [downloadUrl, setDownloadUrl] = useState("");
  const [uploader, setUploader] = useState("community-admin");
  const [flashingGuideText, setFlashingGuideText] = useState(
    "1. Backup all data — flashing will wipe the device.\n2. Enable Developer Options & OEM Unlocking in Settings.\n3. Boot into fastboot / bootloader mode.\n4. Flash custom recovery / ROM image.\n5. Wipe cache/data and reboot into system."
  );
  const [warningsText, setWarningsText] = useState(
    "Unlocking institutional devices may violate terms of use.\nIncorrect flashing carries a risk of permanent bricking."
  );

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [savedDevices, setSavedDevices] = useState<Device[]>([]);

  // Load existing local custom devices
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("admin_custom_devices");
        if (stored) {
          setSavedDevices(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate slug from name & model
  const autoSlug =
    `${name}-${modelName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "custom-rom-device";

  const constructDeviceJson = (): Device => {
    const guide = flashingGuideText
      .split("\n")
      .map((s) => s.trim().replace(/^\d+\.\s*/, ""))
      .filter(Boolean);

    const warn = warningsText
      .split("\n")
      .map((s) => s.trim().replace(/^[-*]\s*/, ""))
      .filter(Boolean);

    const rom: Rom = {
      version: romVersion.trim() || "v1.0",
      date: new Date().toISOString().split("T")[0],
      changelog: romDescription.trim() || "Initial ROM release.",
      downloadUrl: downloadUrl.trim() || "https://github.com/your-org/rom-site/releases",
      uploader: uploader.trim() || "admin",
      verified: status === "unlock-verified",
    };

    return {
      slug: autoSlug,
      name: name.trim() || "Custom Device",
      manufacturer: manufacturer.trim() || "Generic OEM",
      schemeTag: schemeTag.trim() || "Community ROM",
      lockType: lockType.trim() || "MDM",
      status: status,
      roms: [rom],
      flashingGuide: guide.length ? guide : ["Follow standard fastboot flashing procedure."],
      warnings: warn.length ? warn : ["Flashing carries risk of bricking."],
    };
  };

  const currentJsonString = JSON.stringify(constructDeviceJson(), null, 2);

  const handleSaveToDirectory = () => {
    if (!name.trim()) {
      setFeedbackMsg({ type: "error", text: "Device name is required!" });
      return;
    }
    if (!modelName.trim()) {
      setFeedbackMsg({ type: "error", text: "Model name/number is required!" });
      return;
    }
    if (!romDescription.trim()) {
      setFeedbackMsg({ type: "error", text: "ROM description/changelog is required!" });
      return;
    }

    const newDevice = constructDeviceJson();
    const updated = [newDevice, ...savedDevices.filter((d) => d.slug !== newDevice.slug)];

    try {
      localStorage.setItem("admin_custom_devices", JSON.stringify(updated));
      setSavedDevices(updated);
      setFeedbackMsg({
        type: "success",
        text: `Device "${newDevice.name}" has been listed in your directory!`,
      });
      // trigger storage event for other components on page
      window.dispatchEvent(new Event("admin_devices_updated"));
    } catch {
      setFeedbackMsg({ type: "error", text: "Could not save to localStorage." });
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = currentJsonString;
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${autoSlug}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedbackMsg({
      type: "success",
      text: `Downloaded ${autoSlug}.json! You can place it into data/devices/ in your repository.`,
    });
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(currentJsonString);
      setFeedbackMsg({ type: "success", text: "JSON copied to clipboard!" });
    } catch {
      setFeedbackMsg({ type: "error", text: "Clipboard copy failed." });
    }
  };

  const handleOpenGitHubPR = () => {
    const filename = `data/devices/${autoSlug}.json`;
    const repo = "KumarAman0-0/GovermentOS";
    const prUrl = `https://github.com/${repo}/new/main?filename=${encodeURIComponent(
      filename
    )}&value=${encodeURIComponent(currentJsonString)}`;
    window.open(prUrl, "_blank", "noopener,noreferrer");
  };

  const handleDeleteDevice = (slug: string) => {
    const updated = savedDevices.filter((d) => d.slug !== slug);
    localStorage.setItem("admin_custom_devices", JSON.stringify(updated));
    setSavedDevices(updated);
    window.dispatchEvent(new Event("admin_devices_updated"));
    setFeedbackMsg({ type: "success", text: `Removed device (${slug}) from local storage.` });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header */}
        <div className="admin-modal-header mono">
          <div className="admin-header-title">
            <span className="admin-pulse-dot" />
            <span>OPEN ROM HUB // SECRET ADMIN CONSOLE</span>
            <span className="admin-badge">EASTER EGG UNLOCKED</span>
          </div>
          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
            aria-label="Close Admin Panel"
            title="Press Esc to close"
          >
            [ESC] ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="admin-tabs mono">
          <button
            type="button"
            className={`admin-tab ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            01. List New ROM
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "json" ? "active" : ""}`}
            onClick={() => setActiveTab("json")}
          >
            02. JSON Generator
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            03. Manage Listed ({savedDevices.length})
          </button>
        </div>

        {/* Status Toast */}
        {feedbackMsg && (
          <div
            className={`admin-toast mono ${
              feedbackMsg.type === "success" ? "toast-success" : "toast-error"
            }`}
          >
            <span>{feedbackMsg.type === "success" ? "✔" : "✖"}</span> {feedbackMsg.text}
          </div>
        )}

        {/* Body Content */}
        <div className="admin-modal-body">
          {activeTab === "form" && (
            <div className="admin-form-content">
              <p className="admin-intro mono">
                Add a new custom ROM or unlock guide directly to the repository manifest.
              </p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label mono">
                    DEVICE NAME <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Samsung Galaxy Tab A7 Lite"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mono">
                    MODEL NAME / ID <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input mono"
                    placeholder="e.g. SM-T225, LXX501"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label mono">OEM / MANUFACTURER</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Samsung, Xiaomi, Lava"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mono">SCHEME / TAG</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. UP Govt Student Scheme"
                    value={schemeTag}
                    onChange={(e) => setSchemeTag(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label mono">LOCK TYPE</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. MDM + locked bootloader"
                    value={lockType}
                    onChange={(e) => setLockType(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mono">VERIFICATION STATUS</label>
                  <select
                    className="form-input mono"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "unlock-verified" | "in-progress" | "requested")
                    }
                  >
                    <option value="unlock-verified">UNLOCK-VERIFIED (Tested & Working)</option>
                    <option value="in-progress">IN-PROGRESS (Beta Testing)</option>
                    <option value="requested">REQUESTED (Needs Maintainer)</option>
                  </select>
                </div>
              </div>

              {/* ROM Details */}
              <div
                style={{
                  borderTop: "1px dashed var(--line)",
                  paddingTop: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label mono">
                      ROM VERSION <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input mono"
                      placeholder="e.g. LineageOS 21 (Android 14)"
                      value={romVersion}
                      onChange={(e) => setRomVersion(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label mono">MAINTAINER / UPLOADER</label>
                    <input
                      type="text"
                      className="form-input mono"
                      placeholder="e.g. your-github-handle"
                      value={uploader}
                      onChange={(e) => setUploader(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label mono">
                    ROM DESCRIPTION & CHANGELOG <span className="req">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe what restrictions this ROM removes and what features are tested..."
                    value={romDescription}
                    onChange={(e) => setRomDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mono">ROM DOWNLOAD URL (GitHub Release / Source)</label>
                  <input
                    type="text"
                    className="form-input mono"
                    placeholder="https://github.com/your-org/rom-site/releases/download/..."
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label mono">FLASHING GUIDE (1 step per line)</label>
                  <textarea
                    rows={3}
                    className="form-textarea mono"
                    value={flashingGuideText}
                    onChange={(e) => setFlashingGuideText(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-submit mono"
                  onClick={handleSaveToDirectory}
                >
                  ⚡ List in Directory Now
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mono"
                  onClick={handleDownloadJson}
                >
                  💾 Download {autoSlug}.json
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mono"
                  onClick={handleOpenGitHubPR}
                >
                  ↗ Open GitHub PR
                </button>
              </div>
            </div>
          )}

          {activeTab === "json" && (
            <div className="admin-json-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.8rem",
                }}
              >
                <span className="mono" style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                  Target path: <code>data/devices/{autoSlug}.json</code>
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary mono"
                    style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                    onClick={handleCopyJson}
                  >
                    Copy JSON
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mono"
                    style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                    onClick={handleDownloadJson}
                  >
                    Download File
                  </button>
                </div>
              </div>
              <pre className="admin-json-preview mono">{currentJsonString}</pre>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="admin-manage-content">
              {savedDevices.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--muted)" }}>
                  <p className="mono">No custom ROMs listed in local storage yet.</p>
                  <button
                    type="button"
                    className="btn mono"
                    onClick={() => setActiveTab("form")}
                    style={{ marginTop: "0.8rem" }}
                  >
                    + Add your first ROM
                  </button>
                </div>
              ) : (
                <div className="admin-device-list">
                  {savedDevices.map((dev) => (
                    <div key={dev.slug} className="admin-device-item">
                      <div>
                        <strong className="mono">{dev.name}</strong>
                        <div className="meta">
                          {dev.manufacturer} · {dev.slug} · {dev.roms.length} ROM(s)
                        </div>
                        <p style={{ margin: "0.3rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                          {dev.roms[0]?.changelog}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <a href={`/devices`} className="badge" style={{ textDecoration: "none" }}>
                          View in directory
                        </a>
                        <button
                          type="button"
                          className="admin-del-btn mono"
                          onClick={() => handleDeleteDevice(dev.slug)}
                          title="Delete from local listing"
                        >
                          Delete ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
