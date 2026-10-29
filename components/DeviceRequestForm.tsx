"use client";

import { useState } from "react";

const SUGGESTED_FEATURES = [
  "Bypass MDM / Institutional Lock",
  "Debloated Stock Firmware",
  "LineageOS (Vanilla)",
  "Root / Magisk Support",
  "Google Play Services (GApps)",
  "Treble GSI Compatible",
  "Disable Telemetry & Tracking",
];

export default function DeviceRequestForm() {
  const [deviceName, setDeviceName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [requestedFeatures, setRequestedFeatures] = useState("");
  const [schemeTag, setSchemeTag] = useState("");
  const [chipset, setChipset] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFeatureChip = (feature: string) => {
    if (requestedFeatures.includes(feature)) {
      // Remove feature
      const updated = requestedFeatures
        .split("\n")
        .filter((line) => line.trim() !== `- ${feature}` && line.trim() !== feature)
        .join("\n");
      setRequestedFeatures(updated);
    } else {
      // Add feature as bullet
      const prefix = requestedFeatures.trim() ? `${requestedFeatures.trim()}\n` : "";
      setRequestedFeatures(`${prefix}- ${feature}`);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!deviceName.trim()) {
      newErrors.deviceName = "Device name is required (e.g. Samsung Galaxy Tab A7).";
    }
    if (!modelNumber.trim()) {
      newErrors.modelNumber = "Model number is required (e.g. SM-T225).";
    }
    if (!requestedFeatures.trim()) {
      newErrors.requestedFeatures = "Please describe the features or ROM requirements needed.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateMarkdown = () => {
    return [
      `### Device Information`,
      `- **Device Name:** ${deviceName.trim()}`,
      `- **Model Identifier:** ${modelNumber.trim()}`,
      schemeTag.trim() ? `- **Issuing Scheme / Lock:** ${schemeTag.trim()}` : null,
      chipset.trim() ? `- **Chipset / SoC:** ${chipset.trim()}` : null,
      ``,
      `### Requested Features & Requirements`,
      requestedFeatures.trim(),
      ``,
      notes.trim() ? `### Additional Notes & Links\n${notes.trim()}\n` : null,
      `---`,
      `*Submitted via Open ROM Hub Device Request Form*`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  };

  const handleCopy = async () => {
    if (!validate()) return;
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const title = `[Request]: ${deviceName.trim()} (${modelNumber.trim()})`;
    const body = generateMarkdown();
    const issueUrl = `https://github.com/KumarAman0-0/GovermentOS/issues/new?title=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(body)}&labels=device-request`;

    setSubmitted(true);
    window.open(issueUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="request-form-wrap">
      {submitted && (
        <div className="alert-success">
          <strong>Request prepared!</strong> GitHub Issue tab has been opened with your pre-filled
          data. You can also copy the markdown text below if needed.
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-card" noValidate>
        <div className="form-grid-2">
          {/* Device Name */}
          <div className="form-group">
            <label htmlFor="device-name" className="form-label mono">
              DEVICE NAME <span className="req">*</span>
            </label>
            <input
              id="device-name"
              type="text"
              className={`form-input ${errors.deviceName ? "has-error" : ""}`}
              placeholder="e.g. Samsung Galaxy Tab A7 Lite"
              value={deviceName}
              onChange={(e) => {
                setDeviceName(e.target.value);
                if (errors.deviceName) setErrors((prev) => ({ ...prev, deviceName: "" }));
              }}
              required
            />
            {errors.deviceName && <span className="form-error">{errors.deviceName}</span>}
          </div>

          {/* Model Number */}
          <div className="form-group">
            <label htmlFor="model-number" className="form-label mono">
              MODEL NUMBER / ID <span className="req">*</span>
            </label>
            <input
              id="model-number"
              type="text"
              className={`form-input mono ${errors.modelNumber ? "has-error" : ""}`}
              placeholder="e.g. SM-T225, LXX501"
              value={modelNumber}
              onChange={(e) => {
                setModelNumber(e.target.value);
                if (errors.modelNumber) setErrors((prev) => ({ ...prev, modelNumber: "" }));
              }}
              required
            />
            {errors.modelNumber && <span className="form-error">{errors.modelNumber}</span>}
          </div>
        </div>

        <div className="form-grid-2">
          {/* Scheme / Lock Tag */}
          <div className="form-group">
            <label htmlFor="scheme-tag" className="form-label mono">
              ISSUING SCHEME / LOCK TYPE <span className="opt">(optional)</span>
            </label>
            <input
              id="scheme-tag"
              type="text"
              className="form-input"
              placeholder="e.g. UP Govt Student Scheme, Knox MDM"
              value={schemeTag}
              onChange={(e) => setSchemeTag(e.target.value)}
            />
          </div>

          {/* Chipset */}
          <div className="form-group">
            <label htmlFor="chipset" className="form-label mono">
              CHIPSET / PROCESSOR <span className="opt">(optional)</span>
            </label>
            <input
              id="chipset"
              type="text"
              className="form-input"
              placeholder="e.g. MediaTek Helio P22T, Unisoc T606"
              value={chipset}
              onChange={(e) => setChipset(e.target.value)}
            />
          </div>
        </div>

        {/* Requested Features */}
        <div className="form-group">
          <label htmlFor="requested-features" className="form-label mono">
            REQUESTED FEATURES & REQUIREMENTS <span className="req">*</span>
          </label>
          <div className="feature-chips-container">
            <span className="chips-label mono">Quick add:</span>
            <div className="tag-chips">
              {SUGGESTED_FEATURES.map((feature) => {
                const isActive = requestedFeatures.includes(feature);
                return (
                  <button
                    type="button"
                    key={feature}
                    onClick={() => toggleFeatureChip(feature)}
                    className={`tag-chip mono ${isActive ? "active" : ""}`}
                  >
                    {isActive ? "✓" : "+"} {feature}
                  </button>
                );
              })}
            </div>
          </div>
          <textarea
            id="requested-features"
            rows={4}
            className={`form-textarea ${errors.requestedFeatures ? "has-error" : ""}`}
            placeholder="Specify what features you need (e.g. debloated stock firmware, custom recovery, bypassing institutional app locks, LineageOS build)..."
            value={requestedFeatures}
            onChange={(e) => {
              setRequestedFeatures(e.target.value);
              if (errors.requestedFeatures)
                setErrors((prev) => ({ ...prev, requestedFeatures: "" }));
            }}
            required
          />
          {errors.requestedFeatures && (
            <span className="form-error">{errors.requestedFeatures}</span>
          )}
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label htmlFor="additional-notes" className="form-label mono">
            ADDITIONAL NOTES / STOCK ROM LINKS <span className="opt">(optional)</span>
          </label>
          <textarea
            id="additional-notes"
            rows={3}
            className="form-textarea"
            placeholder="Links to existing firmware files, GitHub issues, Telegram groups, or chipset research..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-submit">
            Open Request on GitHub →
          </button>
          <button
            type="button"
            className="btn btn-secondary mono"
            onClick={handleCopy}
            title="Copy formatted request to clipboard"
          >
            {copied ? "✓ Copied Markdown!" : "Copy as Markdown"}
          </button>
        </div>
      </form>
    </div>
  );
}
