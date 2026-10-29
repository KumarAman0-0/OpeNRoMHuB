import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="eyebrow mono">COMMUNITY-MAINTAINED FIRMWARE REGISTRY</div>
      <h1 className="hero-title">
        Custom ROMs for devices locked under institutional restrictions.
      </h1>
      <p className="hero-sub">
        Government and institution-issued phones often ship with MDM profiles that block even a
        wallpaper change. Open ROM Hub catalogs community-built ROMs that remove those
        restrictions — reviewed, versioned and discussed in the open.
      </p>
      <div className="hero-ctas">
        <Link href="/devices" className="btn">
          Browse devices →
        </Link>
        <Link href="/request" className="mono text-link">
          Request a device
        </Link>
      </div>

      <div className="how-it-works">
        <h2 className="section-label mono">HOW A ROM GETS LISTED</h2>
        <div className="steps-grid">
          <div>
            <div className="step-no mono">01</div>
            <div className="step-title">Open a pull request</div>
            <div className="step-body">
              A device entry and ROM release link are added as a plain file in the repo.
            </div>
          </div>
          <div>
            <div className="step-no mono">02</div>
            <div className="step-title">Community review</div>
            <div className="step-body">
              Maintainers and testers confirm the ROM actually unlocks the device safely.
            </div>
          </div>
          <div>
            <div className="step-no mono">03</div>
            <div className="step-title">Merged and listed</div>
            <div className="step-body">
              Once merged, the device appears in the directory with its flashing guide.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
