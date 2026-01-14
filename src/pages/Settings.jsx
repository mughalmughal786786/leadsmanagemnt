import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    language: "en",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    alert("Settings saved!");
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p className="sub">Manage your account settings</p>

      <div className="settings-card">
        <h3>Preferences</h3>

        <div className="form-group">
          <label>Theme</label>
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            Enable Notifications
          </label>
        </div>

        <div className="form-group">
          <label>Language</label>
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <button onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
