"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/components/common/Toast";

interface QRCodeManagerProps {
  restaurantId: string;
  restaurantName: string;
}

export default function QRCodeManager({
  restaurantId,
  restaurantName,
}: QRCodeManagerProps) {
  const [qrCode, setQrCode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    loadQRCode();
  }, [restaurantId]);

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
          <p className="text-slate-400">Loading QR code...</p>
        </div>
      </div>
    );
  }

  console.log("QR Code state:", { qrCode, loading }); // Debug

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">QR Code Manager</h2>
        <p className="text-slate-400 text-sm mt-1">
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
            className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center"
          >
            <div className="mb-4 text-sm font-semibold text-slate-300">
              Your Digital Menu QR Code
            </div>
            {qrCode.qrDataUrl && (
              <img
                src={qrCode.qrDataUrl}
                alt="Menu QR Code"
                className="w-64 h-64 border-4 border-slate-700 rounded-lg bg-white p-4"
              />
            )}
            <div className="flex gap-3 mt-6 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadQRCode}
                className="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                📥 Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateQRCode}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "🔄 Regenerating..." : "🔄 Regenerate"}
              </motion.button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div className="space-y-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-4">
                Menu Link
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">
                    Public Menu URL
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/menu/${qrCode.publicUrl}`}
                      className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyMenuLink}
                      className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
                    >
                      {copying ? "✓" : "📋"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics Card */}
            {analytics && (
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-slate-100 mb-4">
                  📊 Analytics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Total Scans</p>
                    <p className="text-2xl font-bold text-orange-300">
                      {analytics.totalScans || 0}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Scans Today</p>
                    <p className="text-2xl font-bold text-blue-300">
                      {analytics.scansToday || 0}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Unique Devices</p>
                    <p className="text-2xl font-bold text-green-300">
                      {analytics.uniqueDevices || 0}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Last Scanned</p>
                    <p className="text-sm font-semibold text-slate-300">
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
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12 text-center"
        >
          <div className="text-4xl mb-4">🎟️</div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            No QR Code Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Generate a QR code to start sharing your digital menu
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateQRCode}
            disabled={loading}
            className="px-8 py-3 bg-linear-to-r from-orange-500 to-amber-400 text-amber-950 font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Generating..." : "Generate QR Code"}
          </motion.button>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-slate-100 mb-4">How to Use</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
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
