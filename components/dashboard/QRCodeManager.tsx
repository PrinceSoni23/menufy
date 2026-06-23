"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/components/common/Toast";
import {
  BarChart3,
  Copy,
  Download,
  QrCode,
  RefreshCw,
  Sparkles,
  Link2,
} from "lucide-react";

interface QRCodeManagerProps {
  restaurantId: string;
  restaurantName: string;
}

export default function QRCodeManager({
  restaurantId,
  restaurantName,
}: QRCodeManagerProps) {
  const [qrCode, setQrCode] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<unknown>(null);
  const [copying, setCopying] = useState(false);

  const loadQRCode = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/qrcode/${restaurantId}`);
      // Response type may be unknown; cast to any for flexible extraction
      const res = response as any;
      // Handle nested response structure: data.qrCode
      const data =
        res.data?.data?.qrCode ||
        res.data?.qrCode ||
        res.data?.data ||
        res.data;
      console.log("Loaded QR code:", data);
      setQrCode(data);

      // Load analytics
      try {
        const analyticsRes = await apiClient.get(
          `/qrcode/${restaurantId}/analytics`,
        );
        const ares = analyticsRes as any;
        const analyticsData =
          ares.data?.data?.analytics ||
          ares.data?.analytics ||
          ares.data?.data ||
          ares.data;
        setAnalytics(analyticsData);
      } catch (err) {
        console.log("Could not load analytics");
      }
    } catch (error: any) {
      // Silently fail if QR code doesn't exist yet (404)
      // Show the "Generate QR Code" UI instead
      if (error.message?.includes("not found")) {
        console.log("No QR code found yet - user can generate one");
        setQrCode(null);
      } else {
        console.error("Failed to load QR code:", error);
        showToast("Failed to load QR code", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCode();
  }, [restaurantId]);

  const generateQRCode = async () => {
    try {
      // If a QR code already exists, require a double-confirmation from the user
      if (qrCode) {
        const ok1 = window.confirm(
          "This will regenerate your QR code and invalidate the previous one. Continue?",
        );
        if (!ok1) return;

        const ok2 = window.confirm(
          "This action is irreversible and cannot be reverted. Are you absolutely sure?",
        );
        if (!ok2) return;
      }

      setLoading(true);
      const publicUrl = restaurantName.toLowerCase().replace(/\s+/g, "-");
      console.log("Generating QR code with:", {
        restaurantId,
        publicUrl,
        restaurantName,
      });

      const response = await apiClient.post("/qrcode/generate", {
        restaurantId,
        publicUrl,
        appUrl: window.location.origin,
      });

      const res = response as any;
      console.log("Generate response:", res);
      console.log("Generate response.data:", res.data);

      // Handle nested response structure: data.qrCode
      const data =
        res.data?.data?.qrCode ||
        res.data?.qrCode ||
        res.data?.data ||
        res.data;
      console.log("Extracted QR code data:", data);

      if (!data) {
        console.warn("No QR code data in response");
        showToast("Error: No QR code data received", "error");
        return;
      }

      setQrCode(data);
      showToast("QR code generated successfully", "success");
    } catch (error: any) {
      console.error("Failed to generate QR code:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      showToast(error.message || "Failed to generate QR code", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode?.qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrCode.qrDataUrl;
    link.download = `${restaurantName}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("QR code downloaded", "success");
  };

  const copyMenuLink = async () => {
    if (!qrCode?.publicUrl) return;

    try {
      setCopying(true);
      const fullUrl = `${window.location.origin}/menu/${qrCode.publicUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      showToast("Menu link copied to clipboard", "success");
    } catch (error) {
      showToast("Failed to copy link", "error");
    } finally {
      setCopying(false);
    }
  };

  if (loading && !qrCode) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🎟️</div>
          <p className="text-black/70">Loading QR code...</p>
        </div>
      </div>
    );
  }

  console.log("QR Code state:", { qrCode, loading }); // Debug

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
          QR Workspace
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
          QR Code Manager
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage your restaurant's digital menu QR code
        </p>
      </div>

      {/* QR Code Display */}
      {qrCode ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* QR Code Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <QrCode className="h-4 w-4 text-violet-600" />
              Your Digital Menu QR Code
            </div>
            {qrCode.qrDataUrl && (
              <img
                src={qrCode.qrDataUrl}
                alt="Menu QR Code"
                className="h-60 w-60 rounded-2xl border border-slate-200 bg-white p-4"
              />
            )}
            <div className="mt-5 flex w-full gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadQRCode}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition-all"
              >
                <Download className="h-4 w-4" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateQRCode}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                {loading ? "Regenerating..." : "Regenerate"}
              </motion.button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div className="space-y-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
                <Link2 className="h-4 w-4 text-violet-600" />
                Menu Link
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
                    Public Menu URL
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/menu/${qrCode.publicUrl}`}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyMenuLink}
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-white transition-all"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics Card */}
            {analytics && (
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
              >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
                  <BarChart3 className="h-4 w-4 text-violet-600" />
                  Analytics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm text-slate-500">Total Scans</p>
                    <p className="text-2xl font-black tracking-tighter text-slate-950">
                      {analytics.totalScans || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm text-slate-500">Scans Today</p>
                    <p className="text-2xl font-black tracking-tighter text-slate-950">
                      {analytics.scansToday || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm text-slate-500">Unique Devices</p>
                    <p className="text-2xl font-black tracking-tighter text-slate-950">
                      {analytics.uniqueDevices || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm text-slate-500">Last Scanned</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {analytics.lastScannedAt
                        ? new Date(analytics.lastScannedAt).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
            <QrCode className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-xl font-black tracking-tighter text-slate-950">
            No QR Code Yet
          </h3>
          <p className="mb-6 text-sm text-slate-600">
            Generate a QR code to start sharing your digital menu
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateQRCode}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating..." : "Generate QR Code"}
          </motion.button>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-bold text-slate-950">How to Use</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>
            ✓ Download the QR code and print it for your tables or display
          </li>
          <li>
            ✓ Share the menu link with customers via social media or email
          </li>
          <li>
            ✓ Customers scan the QR code with their phone camera to view your
            menu
          </li>
          <li>
            ✓ Track analytics to see how many customers are viewing your menu
          </li>
          <li>
            ✓ Edit menu items in the "Menu Items" section to update your
            offerings
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
