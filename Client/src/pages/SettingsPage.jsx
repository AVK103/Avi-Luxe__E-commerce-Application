import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    marketingEmails: false,
    conciergeMode: true,
    darkLuxuryTheme: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const saveSettings = () => {
    setSaved(true);
  };

  return (
    <div className="page container premium-page">
      <section className="section">
        <SectionHeading
          eyebrow="Settings"
          title="Personalize Your Experience"
          subtitle="Control notifications, communication preferences, and premium account behavior."
        />
      </section>

      <section className="settings-card">
        <h3>Account Preferences</h3>
        <div className="settings-list">
          <label className="setting-row">
            <span>Order updates and dispatch alerts</span>
            <input
              type="checkbox"
              checked={settings.orderUpdates}
              onChange={() => toggle("orderUpdates")}
            />
          </label>
          <label className="setting-row">
            <span>Marketing and premium drop emails</span>
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={() => toggle("marketingEmails")}
            />
          </label>
          <label className="setting-row">
            <span>Concierge assistance mode</span>
            <input
              type="checkbox"
              checked={settings.conciergeMode}
              onChange={() => toggle("conciergeMode")}
            />
          </label>
          <label className="setting-row">
            <span>Dark luxury interface style</span>
            <input
              type="checkbox"
              checked={settings.darkLuxuryTheme}
              onChange={() => toggle("darkLuxuryTheme")}
            />
          </label>
        </div>

        <button type="button" className="btn btn-primary" onClick={saveSettings}>
          Save settings
        </button>
        {saved ? <p className="banner success">Settings saved successfully.</p> : null}
      </section>
    </div>
  );
};

export default SettingsPage;
