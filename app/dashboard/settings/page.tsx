"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/common/Toast";
import { confirmAction } from "@/components/common/ConfirmDialog";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_updates: true,
    marketing: false,
    conversions: true,
    reviews: true,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        showToast("Please enter a name", "error");
        setSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast("Account settings saved successfully!", "success");
    } catch (error) {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form
      if (!formData.currentPassword) {
        showToast("Please enter your current password", "error");
        setSaving(false);
        return;
      }

      if (!formData.newPassword) {
        showToast("Please enter a new password", "error");
        setSaving(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showToast("Passwords do not match", "error");
        setSaving(false);
        return;
      }

      if (formData.newPassword.length < 8) {
        showToast("Password must be at least 8 characters", "error");
        setSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast("Password updated successfully!", "success");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      showToast("Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast("Notification preferences updated!", "success");
    } catch (error) {
      showToast("Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmAction({
      title: "Delete Account?",
      message:
        "Are you sure you want to delete your account? This action is permanent and cannot be undone. All your restaurants and menu items will be deleted.",
      confirmText: "Delete My Account",
      cancelText: "Cancel",
      isDangerous: true,
    });

    if (!confirmed) return;

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast("Account deleted successfully", "success");
      // Would normally redirect to home page
    } catch (error) {
      showToast("Failed to delete account", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl hero-title font-bold text-slate-100">
          Settings
        </h2>
        <p className="text-slate-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-0 overflow-hidden">
            {[
              { id: "account", label: "Account", icon: "👤" },
              { id: "security", label: "Security", icon: "🔒" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "billing", label: "Billing", icon: "💳" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-6 py-3 text-left flex items-center space-x-3 transition-colors ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-500"
                    : "text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === "account" && (
              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    Account Information
                  </h3>
                </div>

                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Contact support to change email
                  </p>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-semibold text-slate-100 mb-4">
                    Danger Zone
                  </h4>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={saving}
                    className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Delete Account
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    "✓ Save Changes"
                  )}
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    Change Password
                  </h3>
                </div>

                <div>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    At least 8 characters
                  </p>
                </div>

                <div>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Updating...
                    </>
                  ) : (
                    "✓ Update Password"
                  )}
                </button>
              </form>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    Notification Preferences
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "email_updates" as const,
                      label: "Email Updates",
                      desc: "Receive updates about new features",
                    },
                    {
                      id: "marketing" as const,
                      label: "Marketing Emails",
                      desc: "Receive promotional offers",
                    },
                    {
                      id: "conversions" as const,
                      label: "Conversion Alerts",
                      desc: "Notify when conversion completes",
                    },
                    {
                      id: "reviews" as const,
                      label: "New Reviews",
                      desc: "Alert when menu gets a review",
                    },
                  ].map(pref => (
                    <label
                      key={pref.id}
                      className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={notificationPrefs[pref.id]}
                        onChange={() => handleNotificationChange(pref.id)}
                        className="w-4 h-4 rounded border-slate-600 accent-cyan-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-100">
                          {pref.label}
                        </p>
                        <p className="text-sm text-slate-400">{pref.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    "✓ Save Preferences"
                  )}
                </button>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    Billing & Plan
                  </h3>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700">
                  <p className="font-semibold text-slate-100">Current Plan</p>
                  <p className="text-cyan-400 text-lg mt-2">Free Tier</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Perfect for getting started
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Pro",
                      price: "$9.99/mo",
                      features: [
                        "5 Restaurants",
                        "Unlimited Items",
                        "Analytics",
                      ],
                    },
                    {
                      name: "Business",
                      price: "$24.99/mo",
                      features: [
                        "Unlimited Restaurants",
                        "Priority Support",
                        "Custom Domain",
                      ],
                    },
                    {
                      name: "Enterprise",
                      price: "Custom",
                      features: [
                        "Everything",
                        "Dedicated Support",
                        "Custom Solutions",
                      ],
                    },
                  ].map(plan => (
                    <div
                      key={plan.name}
                      className={`border rounded-lg p-4 text-center transition-all ${plan.name === "Business" ? "border-cyan-500 bg-cyan-500/5" : "border-slate-600 hover:border-cyan-500/50"}`}
                    >
                      <h4 className="font-bold text-slate-100">{plan.name}</h4>
                      <p className="text-cyan-400 text-lg mt-2">{plan.price}</p>
                      <ul className="text-sm text-slate-400 mt-4 space-y-1">
                        {plan.features.map(feature => (
                          <li key={feature}>✓ {feature}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        disabled={plan.name === "Business"}
                        className="btn-secondary w-full mt-4 text-sm disabled:opacity-50"
                      >
                        {plan.name === "Business" ? "Current Plan" : "Upgrade"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

