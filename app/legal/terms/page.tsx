"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  CreditCard,
  Ban,
  Scale,
  Clock,
  Percent,
  User,
  Shield,
  Gavel,
  MessageSquare,
  Globe,
  Settings,
  Smartphone,
  Trash2,
  Share2,
  Contact,
} from "lucide-react";
import { HeroSection } from "@/components/legal/HeroSection";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { PolicySection } from "@/components/legal/PolicySection";
import { ReadingProgress } from "@/components/legal/ReadingProgress";
import { BackToTop } from "@/components/legal/BackToTop";
import { AnimatedContainer } from "@/components/legal/AnimatedContainer";
import { SectionContent } from "@/components/legal/SectionContent";
import { Footer } from "@/components/legal/Footer";

interface Section {
  id: string;
  title: string;
  subsections?: Section[];
}

const SECTIONS: Section[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
  },
  {
    id: "eligibility",
    title: "Eligibility",
  },
  {
    id: "account-creation",
    title: "Account Creation",
  },
  {
    id: "subscription-plans",
    title: "Subscription Plans",
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    subsections: [
      { id: "billing-cycle", title: "Billing Cycle" },
      { id: "payment-methods", title: "Payment Methods" },
      { id: "failed-payments", title: "Failed Payments" },
      { id: "taxes", title: "Taxes" },
    ],
  },
  {
    id: "renewal-cancellation",
    title: "Renewal & Cancellation",
    subsections: [
      { id: "auto-renewal", title: "Automatic Renewal" },
      { id: "cancellation", title: "Cancellation Policy" },
      { id: "refund-policy", title: "Refund Policy" },
    ],
  },
  {
    id: "license-rights",
    title: "License & Rights",
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
  },
  {
    id: "restaurant-responsibilities",
    title: "Restaurant Responsibilities",
  },
  {
    id: "prohibited-activities",
    title: "Prohibited Activities",
  },
  {
    id: "content-ownership",
    title: "Content Ownership",
  },
  {
    id: "third-party-integrations",
    title: "Third-Party Integrations",
  },
  {
    id: "service-availability",
    title: "Service Availability",
    subsections: [
      { id: "uptime-sla", title: "Uptime SLA" },
      { id: "scheduled-maintenance", title: "Scheduled Maintenance" },
    ],
  },
  {
    id: "termination",
    title: "Termination",
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
  },
  {
    id: "indemnification",
    title: "Indemnification",
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
  },
  {
    id: "applicable-law",
    title: "Applicable Law",
  },
  {
    id: "contact-us",
    title: "Contact Us",
  },
];

export default function TermsOfConditions() {
  const [activeSection, setActiveSection] = useState("acceptance-of-terms");

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.flatMap(s => [s, ...(s.subsections || [])]);
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50   ">
      <ReadingProgress />

      {/* Hero Section */}
      <HeroSection
        title="Terms & Conditions"
        subtitle="These Terms & Conditions govern your use of menuffy, our digital menu platform, and related services. By accessing or using menuffy, you agree to be bound by these terms."
        lastUpdated="2024-06-27"
        estimatedReadTime={15}
      />

      {/* Main Content */}
      <div id="content" className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="md:col-span-1">
              <TableOfContents
                sections={SECTIONS}
                onNavigate={handleNavigate}
                activeSection={activeSection}
              />
            </div>

            {/* Content */}
            <div className="md:col-span-3 space-y-8">
              {/* Acceptance of Terms */}
              <PolicySection
                id="acceptance-of-terms"
                icon={CheckCircle}
                title="Acceptance of Terms"
                index={0}
              >
                <SectionContent>
                  <p>
                    By accessing, browsing, or using menuffy (including our
                    website, mobile application, API, and related services), you
                    acknowledge and agree to be bound by these Terms &
                    Conditions and our Privacy Policy. If you do not agree to
                    these terms, please do not use menuffy.
                  </p>
                  <p>
                    menuffy reserves the right to modify these Terms &
                    Conditions at any time. Changes become effective immediately
                    upon posting. Continued use of the Service after
                    modifications constitutes acceptance of the updated terms.
                    We recommend reviewing these terms regularly.
                  </p>
                  <p>
                    These Terms & Conditions constitute the entire agreement
                    between you and menuffy regarding your use of the Service
                    and supersede all prior agreements, understandings, and
                    negotiations.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Eligibility */}
              <PolicySection
                id="eligibility"
                icon={User}
                title="Eligibility"
                index={1}
              >
                <SectionContent>
                  <p>
                    You represent and warrant that you meet the following
                    eligibility requirements:
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      "You are at least 18 years old (or the age of majority in your jurisdiction)",
                      "You have the legal authority to enter into these Terms & Conditions",
                      "You are not a person or entity prohibited by law from using menuffy",
                      "You are not located in a country subject to U.S. or international trade embargoes",
                      "You agree to comply with all applicable laws and regulations",
                      "For restaurant owners: You own or have authorization to operate the restaurant",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex gap-3 p-3 rounded-lg bg-blue-50  border border-blue-200 "
                      >
                        <CheckCircle className="w-5 h-5 text-blue-600  flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 ">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Account Creation */}
              <PolicySection
                id="account-creation"
                icon={Settings}
                title="Account Creation"
                index={2}
              >
                <SectionContent>
                  <p>When creating a menuffy account, you agree to:</p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>
                      • Provide accurate, complete, and current information
                    </li>
                    <li>
                      • Maintain the confidentiality of your password and
                      account credentials
                    </li>
                    <li>• Not share your account with unauthorized persons</li>
                    <li>• Promptly notify us of unauthorized account access</li>
                    <li>
                      • Accept responsibility for all activities under your
                      account
                    </li>
                    <li>• Update your information if it changes</li>
                  </ul>

                  <p className="mt-4">
                    menuffy may suspend or terminate accounts that violate these
                    terms or contain false information. You are solely
                    responsible for maintaining account security and all account
                    activity.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Subscription Plans */}
              <PolicySection
                id="subscription-plans"
                icon={Zap}
                title="Subscription Plans"
                index={3}
              >
                <SectionContent>
                  <p>
                    menuffy offers multiple subscription tiers with varying
                    features, storage, and capabilities. Each plan includes
                    specific features and limitations clearly outlined in our
                    pricing page.
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        name: "Free Plan",
                        features:
                          "1 restaurant, basic menu management, 100 monthly QR scans, limited analytics",
                      },
                      {
                        name: "Starter Plan",
                        features:
                          "1 restaurant, advanced menu tools, 10,000 monthly scans, full analytics, email support",
                      },
                      {
                        name: "Professional Plan",
                        features:
                          "5 restaurants, all features, 100,000+ scans, priority support, 3D model conversions",
                      },
                      {
                        name: "Enterprise Plan",
                        features:
                          "Unlimited restaurants, custom features, dedicated support, white-label options",
                      },
                    ].map((plan, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50   border border-slate-200 "
                      >
                        <h4 className="font-semibold text-slate-900 ">
                          {plan.name}
                        </h4>
                        <p className="text-sm text-slate-700  mt-1">
                          {plan.features}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <p className="mt-4">
                    Features and pricing are subject to change at menuffy's
                    discretion. We will notify users of material changes in
                    advance. You acknowledge that your subscription grants a
                    limited, non-exclusive license to use menuffy for internal
                    business purposes only.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Payment Terms */}
              <PolicySection
                id="payment-terms"
                icon={CreditCard}
                title="Payment Terms"
                index={4}
              >
                <SectionContent>
                  <p>
                    By subscribing to a paid menuffy plan, you authorize menuffy
                    to charge your selected payment method for the subscription
                    fee and any applicable taxes.
                  </p>
                </SectionContent>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="billing-cycle"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Billing Cycle
                  </h3>
                  <p className="text-slate-700  text-sm">
                    Your subscription renews automatically on the same day each
                    month (or annually) unless cancelled. Invoices are sent to
                    your registered email address on renewal date.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="payment-methods"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Payment Methods
                  </h3>
                  <p className="text-slate-700  text-sm mb-3">
                    menuffy accepts the following payment methods:
                  </p>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• Credit cards (Visa, Mastercard, American Express)</li>
                    <li>• Debit cards</li>
                    <li>• Digital wallets (Apple Pay, Google Pay)</li>
                    <li>• Bank transfers (for Enterprise plans)</li>
                    <li>• UPI payments (for India-based restaurants)</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-purple-50  border border-purple-200 "
                >
                  <h3
                    id="failed-payments"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Failed Payments
                  </h3>
                  <p className="text-slate-700  text-sm">
                    If a payment fails, menuffy will attempt re-collection up to
                    3 times over 15 days. If payment ultimately fails, your
                    subscription will be suspended. Access to your restaurants
                    and data will be restricted until payment is successful.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-green-50  border border-green-200 "
                >
                  <h3 id="taxes" className="font-semibold text-slate-900  mb-3">
                    Taxes
                  </h3>
                  <p className="text-slate-700  text-sm">
                    All subscription fees are exclusive of applicable taxes
                    (GST, VAT, sales tax, etc.). Your billing address is used to
                    calculate applicable tax rates. You are responsible for
                    paying all applicable taxes on your own.
                  </p>
                </motion.div>
              </PolicySection>

              {/* Renewal & Cancellation */}
              <PolicySection
                id="renewal-cancellation"
                icon={Clock}
                title="Renewal & Cancellation"
                index={5}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="auto-renewal"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Automatic Renewal
                  </h3>
                  <p className="text-slate-700  text-sm mb-3">
                    Paid subscriptions renew automatically unless cancelled.
                    Auto-renewal terms:
                  </p>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• Monthly plans renew on the same date each month</li>
                    <li>• Annual plans renew on the same date each year</li>
                    <li>
                      • You will receive email notification 7 days before
                      renewal
                    </li>
                    <li>• Renewal charge will appear on your invoice</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="cancellation"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Cancellation Policy
                  </h3>
                  <p className="text-slate-700  text-sm mb-3">
                    You may cancel your subscription at any time by:
                  </p>
                  <ol className="space-y-2 text-slate-700  text-sm list-decimal list-inside">
                    <li>
                      Logging into your account and visiting Account Settings
                    </li>
                    <li>
                      Clicking "Cancel Subscription" in the Billing section
                    </li>
                    <li>Confirming cancellation in the dialog box</li>
                  </ol>
                  <p className="mt-3 text-xs text-slate-600 ">
                    Cancellation takes effect at the end of your current billing
                    cycle. No refunds are issued for partial months.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-purple-50  border border-purple-200 "
                >
                  <h3
                    id="refund-policy"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Refund Policy
                  </h3>
                  <p className="text-slate-700  text-sm mb-3">
                    menuffy's refund policy:
                  </p>
                  <div className="space-y-3 text-slate-700  text-sm">
                    <div>
                      <strong className="text-slate-900 ">
                        Cancellation Refunds:
                      </strong>{" "}
                      No refunds for unused subscription time. Your access
                      continues until billing period end.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Billing Errors:
                      </strong>{" "}
                      If we overcharge you, we will refund the difference within
                      30 days.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Service Failure:
                      </strong>{" "}
                      If we fail to provide Service for more than 30 consecutive
                      days, you may request a pro-rata refund.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">Downgrade:</strong>{" "}
                      Downgrading to a lower plan may result in feature loss but
                      no refund.
                    </div>
                  </div>
                </motion.div>
              </PolicySection>

              {/* License & Rights */}
              <PolicySection
                id="license-rights"
                icon={Shield}
                title="License & Rights"
                index={6}
              >
                <SectionContent>
                  <p>
                    Subject to these Terms & Conditions, menuffy grants you a
                    limited, non-exclusive, non-transferable, revocable license
                    to use menuffy solely for your internal business purposes.
                  </p>

                  <p className="mt-4">
                    This license does NOT grant you the right to:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>• Sublicense, sell, rent, lease, or lend menuffy</li>
                    <li>
                      • Reverse engineer, decompile, or attempt to derive source
                      code
                    </li>
                    <li>• Remove or alter proprietary notices or labels</li>
                    <li>• Use menuffy with competitive products</li>
                    <li>
                      • Access the Service via automated means (bots, scrapers)
                    </li>
                    <li>• Create derivative works based on menuffy</li>
                  </ul>

                  <p className="mt-4">
                    All intellectual property rights, including patents,
                    copyrights, and trademarks related to menuffy, are the
                    exclusive property of menuffy Inc. or our licensors.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* User Responsibilities */}
              <PolicySection
                id="user-responsibilities"
                icon={User}
                title="User Responsibilities"
                index={7}
              >
                <SectionContent>
                  <p>You are responsible for:</p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Maintaining account security and confidential credentials",
                      "Ensuring your account information is accurate and current",
                      "Complying with all applicable laws and regulations",
                      "Not violating intellectual property rights of others",
                      "Not using menuffy for illegal, harmful, or fraudulent activities",
                      "Backing up important data stored in menuffy",
                      "Notifying menuffy immediately of security breaches or unauthorized access",
                      "Not harassing, threatening, or defaming other users",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex gap-3 p-3 rounded-lg bg-slate-50  border border-slate-200 "
                      >
                        <CheckCircle className="w-5 h-5 text-blue-600  flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 ">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Restaurant Responsibilities */}
              <PolicySection
                id="restaurant-responsibilities"
                icon={Smartphone}
                title="Restaurant Responsibilities"
                index={8}
              >
                <SectionContent>
                  <p>If you are a restaurant owner, you agree to:</p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Provide accurate restaurant information (hours, location, cuisine type)",
                      "Ensure all menu items comply with local food labeling regulations",
                      "Accurately list prices, ingredients, and allergens",
                      "Update menu availability and pricing in real-time",
                      "Not misrepresent dishes or make false claims about food",
                      "Provide authentic food images (no stock photos without disclosure)",
                      "Comply with local health and safety regulations",
                      "Not use menuffy to advertise illegal goods or services",
                      "Ensure all 3D models and images are original or properly licensed",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex gap-3 p-3 rounded-lg bg-slate-50  border border-slate-200 "
                      >
                        <CheckCircle className="w-5 h-5 text-green-600  flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 ">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Prohibited Activities */}
              <PolicySection
                id="prohibited-activities"
                icon={Ban}
                title="Prohibited Activities"
                index={9}
              >
                <SectionContent>
                  <p>
                    You agree NOT to engage in any of the following activities
                    while using menuffy:
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "Illegal Activities",
                        desc: "Use menuffy for any illegal purpose or violating local/international laws",
                      },
                      {
                        title: "Hacking & Attacks",
                        desc: "Attempt to access, hack, or disrupt menuffy systems or other user accounts",
                      },
                      {
                        title: "Malware",
                        desc: "Upload viruses, malware, or harmful code to menuffy",
                      },
                      {
                        title: "Impersonation",
                        desc: "Pretend to be someone else or misrepresent affiliation",
                      },
                      {
                        title: "Harassment",
                        desc: "Harass, threaten, intimidate, or abuse other users",
                      },
                      {
                        title: "Spam",
                        desc: "Send unsolicited commercial messages or spam through menuffy",
                      },
                      {
                        title: "Data Scraping",
                        desc: "Automatically download or extract data from menuffy",
                      },
                      {
                        title: "DDoS Attacks",
                        desc: "Conduct denial-of-service attacks on menuffy infrastructure",
                      },
                      {
                        title: "Content Theft",
                        desc: "Steal or copy other restaurants' menus without authorization",
                      },
                      {
                        title: "Fraud",
                        desc: "Engage in fraudulent transactions or chargebacks",
                      },
                    ].map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        viewport={{ once: true }}
                        className="p-4 rounded-lg bg-red-50  border border-red-200 "
                      >
                        <h4 className="font-semibold text-slate-900  mb-1 flex items-center gap-2">
                          <Ban className="w-4 h-4 text-red-600 " />
                          {activity.title}
                        </h4>
                        <p className="text-sm text-slate-700 ">
                          {activity.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-orange-50  border border-orange-200 ">
                    <p className="text-sm text-slate-700 ">
                      <strong className="text-slate-900 ">Enforcement:</strong>{" "}
                      menuffy reserves the right to investigate violations and
                      take legal action, including account termination, legal
                      prosecution, and cooperation with law enforcement.
                    </p>
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Content Ownership */}
              <PolicySection
                id="content-ownership"
                icon={FileText}
                title="Content Ownership"
                index={10}
              >
                <SectionContent>
                  <p>
                    You retain all ownership rights to content you upload to
                    menuffy, including menu items, descriptions, images, and 3D
                    models. By uploading content, you grant menuffy a worldwide,
                    royalty-free license to:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>
                      • Display and distribute your menu content to customers
                      via QR codes
                    </li>
                    <li>
                      • Cache and serve content globally for performance
                      optimization
                    </li>
                    <li>• Generate analytics and insights from your content</li>
                    <li>• Use anonymized data for service improvement</li>
                    <li>
                      • Create backup copies for security and disaster recovery
                    </li>
                  </ul>

                  <p className="mt-4">
                    You represent and warrant that all content you upload is
                    original, lawfully obtained, and does not infringe
                    third-party rights. You indemnify menuffy from any claims
                    related to your content.
                  </p>

                  <p className="mt-4">
                    menuffy respects copyright. If you believe content on
                    menuffy infringes your rights, please submit a DMCA takedown
                    notice to legal@menuffy.com.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Third-Party Integrations */}
              <PolicySection
                id="third-party-integrations"
                icon={Share2}
                title="Third-Party Integrations"
                index={11}
              >
                <SectionContent>
                  <p>
                    menuffy may integrate with third-party services (payment
                    processors, analytics tools, cloud providers). Your use of
                    these services is governed by their terms, not ours. menuffy
                    is not responsible for:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>• Third-party service outages or failures</li>
                    <li>• Loss or compromise of data by third parties</li>
                    <li>• Changes to third-party services or pricing</li>
                    <li>• Third-party support or customer service</li>
                  </ul>

                  <p className="mt-4">
                    menuffy may discontinue integrations with third-party
                    services at any time. We recommend reviewing third-party
                    privacy policies and terms before authorizing integration.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Service Availability */}
              <PolicySection
                id="service-availability"
                icon={Zap}
                title="Service Availability & Maintenance"
                index={12}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="uptime-sla"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Uptime & SLA
                  </h3>
                  <p className="text-slate-700  text-sm mb-3">
                    menuffy commits to maintaining 99.5% uptime for paid plans
                    (measured monthly). For free accounts, no specific uptime
                    guarantee is provided.
                  </p>
                  <p className="text-slate-700  text-sm">
                    If menuffy is unavailable for more than 4 consecutive hours
                    due to our negligence, you may request a pro-rata service
                    credit.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="scheduled-maintenance"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Scheduled Maintenance
                  </h3>
                  <p className="text-slate-700  text-sm">
                    menuffy performs maintenance on Sundays 2:00-4:00 AM IST.
                    During maintenance, menuffy may be unavailable. We will
                    notify users of major maintenance via email.
                  </p>
                </motion.div>
              </PolicySection>

              {/* Termination */}
              <PolicySection
                id="termination"
                icon={AlertCircle}
                title="Termination"
                index={13}
              >
                <SectionContent>
                  <p>
                    Either party may terminate these Terms & Conditions at any
                    time. menuffy may terminate your account:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>• If you violate these Terms & Conditions</li>
                    <li>• If you engage in illegal or harmful activities</li>
                    <li>
                      • If you fail to pay subscription fees after 30 days
                      notice
                    </li>
                    <li>• If you repeatedly violate menuffy policies</li>
                    <li>
                      • At menuffy's discretion for any reason with 30 days
                      notice
                    </li>
                  </ul>

                  <p className="mt-4">
                    Upon termination, you lose access to your account and data.
                    menuffy may delete your data after 90 days unless you export
                    it first. Some provisions (limitations of liability,
                    indemnification, governing law) survive termination.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Limitation of Liability */}
              <PolicySection
                id="limitation-of-liability"
                icon={Gavel}
                title="Limitation of Liability"
                index={14}
              >
                <SectionContent>
                  <p className="font-semibold text-slate-900  mb-4">
                    DISCLAIMER
                  </p>

                  <p>
                    menuffy IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.
                    menuffy MAKES NO WARRANTY THAT THE SERVICE WILL MEET YOUR
                    REQUIREMENTS, BE UNINTERRUPTED, OR ERROR-FREE.
                  </p>

                  <p className="mt-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>
                      • menuffy is not liable for indirect, incidental, special,
                      or consequential damages
                    </li>
                    <li>
                      • menuffy is not liable for loss of profits, data, or
                      business opportunities
                    </li>
                    <li>
                      • menuffy's total liability is limited to fees paid in the
                      last 12 months
                    </li>
                    <li>
                      • Some jurisdictions do not allow limitation of liability;
                      applicable laws override this clause
                    </li>
                  </ul>

                  <p className="mt-4">
                    menuffy does not control or endorse third-party content,
                    services, or integrations. You use them at your own risk.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Indemnification */}
              <PolicySection
                id="indemnification"
                icon={Shield}
                title="Indemnification"
                index={15}
              >
                <SectionContent>
                  <p>
                    You agree to indemnify and hold menuffy, its officers,
                    directors, and employees harmless from any claims, damages,
                    or costs (including attorney fees) arising from:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>• Your violation of these Terms & Conditions</li>
                    <li>• Your infringement of intellectual property rights</li>
                    <li>• Your content or use of menuffy</li>
                    <li>• Your violation of applicable laws or regulations</li>
                    <li>
                      • Claims by other users or third parties related to your
                      account
                    </li>
                  </ul>

                  <p className="mt-4">
                    menuffy will notify you of indemnifiable claims and
                    cooperate in your defense.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Dispute Resolution */}
              <PolicySection
                id="dispute-resolution"
                icon={MessageSquare}
                title="Dispute Resolution"
                index={16}
              >
                <SectionContent>
                  <p>
                    Any disputes arising from these Terms & Conditions shall be
                    resolved as follows:
                  </p>

                  <div className="mt-6 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg bg-blue-50  border border-blue-200 "
                    >
                      <h4 className="font-semibold text-slate-900  mb-2">
                        1. Negotiation
                      </h4>
                      <p className="text-sm text-slate-700 ">
                        First, contact menuffy support at support@menuffy.com to
                        discuss the issue.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                    >
                      <h4 className="font-semibold text-slate-900  mb-2">
                        2. Mediation
                      </h4>
                      <p className="text-sm text-slate-700 ">
                        If unresolved, disputes may be referred to mediation
                        before litigation.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-lg bg-purple-50  border border-purple-200 "
                    >
                      <h4 className="font-semibold text-slate-900  mb-2">
                        3. Arbitration
                      </h4>
                      <p className="text-sm text-slate-700 ">
                        Disputes shall be resolved through binding arbitration
                        in New Delhi, India, under Indian Arbitration and
                        Conciliation Act, 1996.
                      </p>
                    </motion.div>
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Applicable Law */}
              <PolicySection
                id="applicable-law"
                icon={Globe}
                title="Applicable Law"
                index={17}
              >
                <SectionContent>
                  <p>
                    These Terms & Conditions are governed by and construed in
                    accordance with the laws of India, without regard to its
                    conflict of law provisions.
                  </p>

                  <p className="mt-4">
                    You consent to the exclusive jurisdiction of the courts
                    located in New Delhi, India for resolution of any disputes.
                  </p>

                  <p className="mt-4">
                    If any provision of these Terms & Conditions is found
                    invalid, the remaining provisions continue in effect, and
                    the invalid provision is modified to the minimum extent
                    necessary for validity.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Contact Us */}
              <PolicySection
                id="contact-us"
                icon={Contact}
                title="Contact Us"
                index={18}
              >
                <SectionContent>
                  <p>
                    For questions about these Terms & Conditions or to report
                    violations:
                  </p>

                  <div className="mt-6 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900 ">
                        General Support
                      </h4>
                      <p className="text-sm text-slate-700  mt-2">
                        support@menuffy.com
                        <br />
                        Live chat on menuffy.com
                        <br />
                        +1 (555) 123-4567
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900 ">
                        Legal Issues
                      </h4>
                      <p className="text-sm text-slate-700  mt-2">
                        legal@menuffy.com
                        <br />
                        menuffy Legal Department
                        <br />
                        New Delhi, India
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900 ">
                        Abuse Reporting
                      </h4>
                      <p className="text-sm text-slate-700  mt-2">
                        abuse@menuffy.com
                        <br />
                        Report violations or suspicious activity
                      </p>
                    </motion.div>
                  </div>
                </SectionContent>
              </PolicySection>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        contactEmail="support@menuffy.com"
        contactPhone="+1 (555) 123-4567"
        contactAddress="menuffy Legal Department, New Delhi, India"
        lastUpdated="2024-06-27"
      />

      {/* Back to Top Button */}
      <BackToTop />
    </main>
  );
}
