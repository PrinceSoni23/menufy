"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/common/Toast";
import { confirmAction } from "@/components/common/ConfirmDialog";
import {
  Bell,
  CreditCard,
  LayoutGrid,
  Lock,
  Trash2,
  UserRound,
} from "lucide-react";

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
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
          Workspace Settings
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
          Settings
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage your account and preferences in one compact workspace.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            {[
              { id: "account", label: "Account", icon: UserRound },
              { id: "security", label: "Security", icon: Lock },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "billing", label: "Billing", icon: CreditCard },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
            {activeTab === "account" && (
              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-slate-950">
                    Account Information
                  </h3>
                  <p className="text-sm text-slate-600">
                    Edit your display name and manage account access.
                  </p>
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

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
                    Danger Zone
                  </h4>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <h3 className="mb-2 text-lg font-bold text-slate-950">
                    Change Password
                  </h3>
                  <p className="text-sm text-slate-600">
                    Keep access credentials current and secure.
                  </p>
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
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <h3 className="mb-2 text-lg font-bold text-slate-950">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-slate-600">
                    Choose which updates should reach your inbox.
                  </p>
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
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 cursor-pointer transition hover:border-violet-200 hover:bg-violet-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={notificationPrefs[pref.id]}
                        onChange={() => handleNotificationChange(pref.id)}
                        className="w-4 h-4 rounded border-slate-600 accent-cyan-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {pref.label}
                        </p>
                        <p className="text-sm text-slate-600">{pref.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <h3 className="mb-2 text-lg font-bold text-slate-950">
                    Billing & Plan
                  </h3>
                  <p className="text-sm text-slate-600">
                    Review your current plan and upgrade when needed.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    Current Plan
                  </p>
                  <p className="mt-2 text-lg font-black tracking-tighter text-violet-700">
                    Free Tier
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
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
                      className={`border rounded-lg p-4 text-center transition-all bg-white ${plan.name === "Business" ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-cyan-500/50"}`}
                    >
                      <h4 className="font-bold text-slate-950">{plan.name}</h4>
                      <p className="mt-2 text-lg font-black tracking-tighter text-violet-700">
                        {plan.price}
                      </p>
                      <ul className="text-sm text-slate-600 mt-4 space-y-1">
                        {plan.features.map(feature => (
                          <li key={feature}>✓ {feature}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        disabled={plan.name === "Business"}
                        className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50/60 disabled:opacity-50"
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
