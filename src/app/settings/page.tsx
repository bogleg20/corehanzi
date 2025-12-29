"use client";

import { useState, useEffect } from "react";
import { Settings } from "@/lib/db/schema";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyNewWordLimit: settings.dailyNewWordLimit,
          audioEnabled: settings.audioEnabled,
        }),
      });

      if (res.ok) {
        setMessage("Settings saved!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Daily Word Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily New Word Limit
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.dailyNewWordLimit}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyNewWordLimit: parseInt(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-lg font-medium text-gray-900 w-12 text-center">
              {settings.dailyNewWordLimit}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            How many new words to learn per day
          </p>
        </div>

        {/* Audio Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Audio Playback
              </span>
              <p className="text-sm text-gray-500">
                Enable audio pronunciation
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  audioEnabled: !settings.audioEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.audioEnabled ? "bg-red-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.audioEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Stats */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500">Current Streak</div>
              <div className="text-xl font-bold text-red-600">
                {settings.currentStreak} days
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500">Last Study</div>
              <div className="text-xl font-bold text-gray-900">
                {settings.lastStudyDate || "Never"}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("Failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* About */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-gray-600 text-sm">
          Chinese Learning App - MVP
          <br />
          Learn Mandarin Chinese through spaced repetition.
          <br />
          HSK 3.0 vocabulary (Levels 1-3, 2,225 words)
        </p>
      </div>
    </div>
  );
}
