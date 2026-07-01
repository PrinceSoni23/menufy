"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  Eye,
  Share2,
  Trash2,
  UserCheck,
  AlertCircle,
  Scale,
  Globe,
  Smartphone,
  CreditCard,
  BarChart3,
  Settings,
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
    id: "introduction",
    title: "Introduction",
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    subsections: [
      { id: "personal-information", title: "Personal Information" },
      { id: "business-information", title: "Business Information" },
      { id: "restaurant-information", title: "Restaurant Information" },
      { id: "analytics-data", title: "Analytics Data" },
      { id: "payment-information", title: "Payment Information" },
    ],
  },
  {
    id: "cookies-and-tracking",
    title: "Cookies & Tracking Technologies",
    subsections: [
      { id: "cookies", title: "Cookies" },
      { id: "tracking-technologies", title: "Tracking Technologies" },
    ],
  },
  {
    id: "how-we-use-data",
    title: "How We Use Your Data",
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
  },
  {
    id: "data-retention",
    title: "Data Retention",
  },
  {
    id: "data-security",
    title: "Data Security",
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
  },
  {
    id: "user-rights",
    title: "Your Rights",
    subsections: [
      { id: "gdpr-rights", title: "GDPR Rights" },
      { id: "ccpa-rights", title: "CCPA Rights" },
      { id: "access-correction", title: "Access & Correction" },
    ],
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
  },
  {
    id: "contact-us",
    title: "Contact Us",
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

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
        title="Privacy Policy"
        subtitle="Your data privacy is our priority. Learn how menuffy collects, uses, and protects your information to provide you with the best restaurant management and digital menu experience."
        lastUpdated="2024-06-27"
        estimatedReadTime={12}
      />

      {/* Main Content */}
      <div id="content" className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <div className="md:col-span-1">
              <TableOfContents
                sections={SECTIONS}
                onNavigate={handleNavigate}
                activeSection={activeSection}
              />
            </div>

            {/* Content */}
            <div className="md:col-span-3 space-y-8">
              {/* Introduction */}
              <PolicySection
                id="introduction"
                icon={Shield}
                title="Introduction"
                index={0}
              >
                <SectionContent>
                  <p>
                    menuffy ("we," "us," "our," or "Company") is committed to
                    protecting your privacy. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when
                    you use our platform, including our website, mobile
                    application, and related services (collectively, the
                    "Service").
                  </p>
                  <p>
                    menuffy is a premium digital menu platform designed for
                    restaurants and food service businesses. Our Service
                    provides QR menu access, 3D dish previews, AR experiences,
                    analytics, and comprehensive menu management tools for
                    restaurant owners and their customers.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. If you do not
                    agree with our policies and practices, please do not use our
                    Service. By accessing or using menuffy, you acknowledge that
                    you have read, understood, and agree to be bound by all the
                    terms of this Privacy Policy.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Information We Collect */}
              <PolicySection
                id="information-we-collect"
                icon={Database}
                title="Information We Collect"
                index={1}
              >
                <SectionContent>
                  <p>
                    We collect information from various sources to provide,
                    improve, and personalize our Service. The information we
                    collect depends on how you interact with menuffy—whether you
                    are a restaurant owner, menu manager, or customer viewing a
                    restaurant's digital menu.
                  </p>
                </SectionContent>

                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="personal-information"
                    className="font-semibold text-slate-900  mb-3 flex items-center gap-2"
                  >
                    <UserCheck className="w-5 h-5 text-blue-600 " />
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>
                      • Account credentials (name, email address, phone number,
                      password)
                    </li>
                    <li>
                      • Business details (business name, business registration
                      information)
                    </li>
                    <li>
                      • Profile information (profile photo, bio, business
                      description)
                    </li>
                    <li>• Contact information and communication preferences</li>
                    <li>
                      • Payment and billing information (credit card, bank
                      account details)
                    </li>
                    <li>
                      • Communication history (support tickets, emails, chat
                      messages)
                    </li>
                    <li>
                      • Device information (device type, operating system,
                      unique identifiers)
                    </li>
                  </ul>
                </motion.div>

                {/* Business Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="business-information"
                    className="font-semibold text-slate-900  mb-3 flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5 text-indigo-600 " />
                    Business Information
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• Business type and industry classification</li>
                    <li>• Business location and geographic data</li>
                    <li>• Operating hours and service type information</li>
                    <li>• Tax identification and compliance information</li>
                    <li>• Subscription plan and service tier details</li>
                    <li>• License and certification information</li>
                  </ul>
                </motion.div>

                {/* Restaurant Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-purple-50  border border-purple-200 "
                >
                  <h3
                    id="restaurant-information"
                    className="font-semibold text-slate-900  mb-3 flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5 text-purple-600 " />
                    Restaurant Information
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• Menu items and dish descriptions</li>
                    <li>• Food images and photos (user-uploaded content)</li>
                    <li>• Pricing information and menu structure</li>
                    <li>• Dietary information and allergen data</li>
                    <li>• 3D models and asset files</li>
                    <li>• Category organization and menu hierarchy</li>
                    <li>
                      • Special notes, preparation details, and customization
                      options
                    </li>
                  </ul>
                </motion.div>

                {/* Analytics Data */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-green-50  border border-green-200 "
                >
                  <h3
                    id="analytics-data"
                    className="font-semibold text-slate-900  mb-3 flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5 text-green-600 " />
                    Analytics Data
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• QR code scan counts and timestamps</li>
                    <li>• Menu item views and engagement metrics</li>
                    <li>• Customer device types and operating systems</li>
                    <li>• Geographic location data (country, city level)</li>
                    <li>• Session duration and browsing behavior</li>
                    <li>• 3D model interaction data</li>
                    <li>• Cart actions and abandonment metrics</li>
                    <li>• Customer segment and demographic estimates</li>
                    <li>• Click patterns and navigation flow</li>
                  </ul>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-orange-50  border border-orange-200 "
                >
                  <h3
                    id="payment-information"
                    className="font-semibold text-slate-900  mb-3 flex items-center gap-2"
                  >
                    <CreditCard className="w-5 h-5 text-orange-600 " />
                    Payment Information
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>• Credit card numbers (tokenized and encrypted)</li>
                    <li>• Billing address and payment method</li>
                    <li>• Transaction history and invoice records</li>
                    <li>• Subscription renewal dates and payment status</li>
                    <li>• Refund and adjustment records</li>
                  </ul>
                  <p className="mt-4 text-xs text-slate-600  italic">
                    Note: Payment information is processed by our third-party
                    payment processor and is not stored on our servers in
                    unencrypted form.
                  </p>
                </motion.div>
              </PolicySection>

              {/* Cookies & Tracking */}
              <PolicySection
                id="cookies-and-tracking"
                icon={Eye}
                title="Cookies & Tracking Technologies"
                index={2}
              >
                <SectionContent>
                  <p>
                    menuffy uses cookies and similar tracking technologies to
                    enhance user experience, analyze how our Service is used,
                    and personalize content. These technologies help us
                    understand user preferences and improve our Service's
                    performance.
                  </p>
                </SectionContent>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="cookies"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Cookies
                  </h3>
                  <div className="space-y-3 text-slate-700  text-sm">
                    <div>
                      <strong className="text-slate-900 ">
                        Essential Cookies:
                      </strong>{" "}
                      Required for core functionality, including session
                      authentication and security features.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Performance Cookies:
                      </strong>{" "}
                      Help us understand how users interact with menuffy,
                      including page load times and error rates.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Functional Cookies:
                      </strong>{" "}
                      Remember user preferences such as language settings and
                      dashboard customizations.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Marketing Cookies:
                      </strong>{" "}
                      Used to deliver personalized content and measure marketing
                      campaign effectiveness.
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="tracking-technologies"
                    className="font-semibold text-slate-900  mb-3"
                  >
                    Other Tracking Technologies
                  </h3>
                  <ul className="space-y-2 text-slate-700  text-sm">
                    <li>
                      • <strong>Pixels and Web Beacons:</strong> Tiny graphics
                      used to track user behavior across pages
                    </li>
                    <li>
                      • <strong>Local Storage:</strong> Browser-based data
                      storage for preferences and session information
                    </li>
                    <li>
                      • <strong>Server Logs:</strong> IP addresses, browser
                      type, and access times for security and analytics
                    </li>
                    <li>
                      • <strong>Analytics Tools:</strong> Third-party services
                      that track user behavior and platform performance
                    </li>
                  </ul>
                </motion.div>

                <div className="mt-6 p-4 rounded-lg bg-yellow-50  border border-yellow-200  flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600  flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 ">
                    <strong className="text-slate-900 ">Cookie Consent:</strong>{" "}
                    When you first visit menuffy, we request your consent to use
                    non-essential cookies. You can adjust your preferences at
                    any time through your account settings.
                  </div>
                </div>
              </PolicySection>

              {/* How We Use Data */}
              <PolicySection
                id="how-we-use-data"
                icon={BarChart3}
                title="How We Use Your Data"
                index={3}
              >
                <SectionContent>
                  <p>
                    menuffy uses the information collected for various purposes
                    essential to providing, improving, and securing our Service:
                  </p>
                </SectionContent>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Service Provision",
                      desc: "Create and manage accounts, process subscriptions, and deliver menu management features",
                    },
                    {
                      title: "Analytics & Insights",
                      desc: "Generate usage reports, performance metrics, and customer behavior analytics for restaurant owners",
                    },
                    {
                      title: "Communication",
                      desc: "Send service notifications, billing information, security alerts, and customer support responses",
                    },
                    {
                      title: "Personalization",
                      desc: "Customize user experience based on preferences, device type, and usage patterns",
                    },
                    {
                      title: "Security",
                      desc: "Prevent fraud, ensure platform security, and protect against unauthorized access",
                    },
                    {
                      title: "Service Improvement",
                      desc: "Analyze user behavior to enhance features, fix bugs, and optimize platform performance",
                    },
                    {
                      title: "Legal Compliance",
                      desc: "Fulfill legal obligations, comply with regulations, and enforce terms of service",
                    },
                    {
                      title: "Marketing",
                      desc: "Create targeted content, measure campaign performance, and send promotional materials (with consent)",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50   border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900  mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-700 ">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </PolicySection>

              {/* Third-Party Services */}
              <PolicySection
                id="third-party-services"
                icon={Share2}
                title="Third-Party Services"
                index={4}
              >
                <SectionContent>
                  <p>
                    menuffy integrates with trusted third-party services to
                    deliver complete functionality. We share necessary
                    information with these partners under strict data processing
                    agreements:
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        name: "Payment Processors",
                        services:
                          "Stripe, PayPal - Process subscription payments and refunds",
                      },
                      {
                        name: "Cloud Storage",
                        services:
                          "AWS, Google Cloud - Store images, 3D models, and application data",
                      },
                      {
                        name: "Analytics Providers",
                        services:
                          "Google Analytics, Mixpanel - Track platform usage and performance",
                      },
                      {
                        name: "Email Services",
                        services:
                          "SendGrid, AWS SES - Deliver transactional and marketing emails",
                      },
                      {
                        name: "CRM Platform",
                        services:
                          "HubSpot - Manage customer relationships and support inquiries",
                      },
                      {
                        name: "3D Model Processing",
                        services:
                          "Triposer.ai, Vertex AI - Convert images into 3D models",
                      },
                      {
                        name: "AR Framework",
                        services:
                          "WebAR, WebGL libraries - Enable AR experiences on supported devices",
                      },
                      {
                        name: "CDN Services",
                        services:
                          "Cloudflare - Optimize content delivery globally",
                      },
                    ].map((provider, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                      >
                        <h4 className="font-semibold text-slate-900 ">
                          {provider.name}
                        </h4>
                        <p className="text-sm text-slate-700  mt-1">
                          {provider.services}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-red-50  border border-red-200 ">
                    <p className="text-sm text-slate-700 ">
                      <strong className="text-slate-900 ">Your Control:</strong>{" "}
                      We do not sell your personal data to third parties for
                      their marketing purposes. Any data sharing is limited to
                      service provision and is governed by Data Processing
                      Agreements requiring GDPR and CCPA compliance.
                    </p>
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Data Retention */}
              <PolicySection
                id="data-retention"
                icon={Trash2}
                title="Data Retention"
                index={5}
              >
                <SectionContent>
                  <p>
                    menuffy retains your information for as long as necessary to
                    provide our Service and fulfill the purposes outlined in
                    this Privacy Policy. Retention periods vary based on data
                    type and use case:
                  </p>

                  <div className="mt-6 space-y-3 text-slate-700 ">
                    <div className="p-4 rounded-lg bg-blue-50  border border-blue-200 ">
                      <strong className="block mb-1 text-slate-900 ">
                        Account Data:
                      </strong>
                      Retained while account is active. Deleted within 30 days
                      of account termination.
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50  border border-indigo-200 ">
                      <strong className="block mb-1 text-slate-900 ">
                        Menu & Restaurant Data:
                      </strong>
                      Retained during subscription. Can be exported or deleted
                      upon request within 30 days.
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50  border border-purple-200 ">
                      <strong className="block mb-1 text-slate-900 ">
                        Analytics Data:
                      </strong>
                      Aggregated data retained for 24 months. Individual session
                      data deleted after 90 days.
                    </div>
                    <div className="p-4 rounded-lg bg-green-50  border border-green-200 ">
                      <strong className="block mb-1 text-slate-900 ">
                        Transaction Records:
                      </strong>
                      Retained for 7 years for tax and legal compliance
                      purposes.
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50  border border-orange-200 ">
                      <strong className="block mb-1 text-slate-900 ">
                        Support Communications:
                      </strong>
                      Retained for 2 years after final communication.
                    </div>
                  </div>
                </SectionContent>
              </PolicySection>

              {/* Data Security */}
              <PolicySection
                id="data-security"
                icon={Lock}
                title="Data Security"
                index={6}
              >
                <SectionContent>
                  <p>
                    menuffy implements industry-standard security measures to
                    protect your information from unauthorized access,
                    alteration, and destruction. Our security practices include:
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "End-to-End Encryption",
                        desc: "HTTPS/TLS encryption for all data in transit",
                      },
                      {
                        title: "Database Encryption",
                        desc: "AES-256 encryption for sensitive data at rest",
                      },
                      {
                        title: "Access Controls",
                        desc: "Role-based access control (RBAC) limiting data access to authorized personnel",
                      },
                      {
                        title: "Multi-Factor Authentication",
                        desc: "MFA available for account protection",
                      },
                      {
                        title: "Regular Audits",
                        desc: "Third-party security audits and penetration testing",
                      },
                      {
                        title: "Incident Response",
                        desc: "Documented procedures for security breach response and notification",
                      },
                      {
                        title: "Backup Systems",
                        desc: "Regular encrypted backups stored in geographically distributed locations",
                      },
                      {
                        title: "Security Training",
                        desc: "Staff training on data protection and security best practices",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex gap-3 p-3 rounded-lg bg-green-50  border border-green-200 "
                      >
                        <Lock className="w-4 h-4 text-green-600  flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-slate-900 ">
                            {item.title}:
                          </strong>
                          <span className="text-sm text-slate-700 ">
                            {item.desc}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-yellow-50  border border-yellow-200 ">
                    <p className="text-sm text-slate-700 ">
                      <strong className="text-slate-900 ">No Guarantee:</strong>{" "}
                      While we implement robust security measures, no system is
                      completely secure. menuffy cannot guarantee absolute
                      security and is not liable for unauthorized access
                      resulting from factors beyond our reasonable control.
                    </p>
                  </div>
                </SectionContent>
              </PolicySection>

              {/* International Transfers */}
              <PolicySection
                id="international-transfers"
                icon={Globe}
                title="International Data Transfers"
                index={7}
              >
                <SectionContent>
                  <p>
                    menuffy operates globally and may transfer, store, and
                    process your information in countries other than your
                    country of residence. These countries may have data
                    protection laws different from your home country.
                  </p>

                  <p className="mt-4">
                    When we transfer personal data internationally, we implement
                    appropriate safeguards:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>
                      ✓ Standard Contractual Clauses (SCCs) for EU/UK transfers
                    </li>
                    <li>
                      ✓ Data Processing Agreements ensuring adequate protection
                    </li>
                    <li>
                      ✓ Privacy Shield Frameworks where applicable (deprecated
                      but noted)
                    </li>
                    <li>
                      ✓ Your explicit consent for international transfers when
                      required
                    </li>
                  </ul>

                  <p className="mt-4">
                    By using menuffy, you consent to the transfer of your
                    information to countries outside your country of residence,
                    which may include countries that do not have the same data
                    protection laws as your country.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* User Rights */}
              <PolicySection
                id="user-rights"
                icon={UserCheck}
                title="Your Rights"
                index={8}
              >
                <SectionContent>
                  <p>
                    menuffy respects your privacy rights. Depending on your
                    location, you may have specific rights regarding your
                    personal information:
                  </p>
                </SectionContent>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-blue-50  border border-blue-200 "
                >
                  <h3
                    id="gdpr-rights"
                    className="font-semibold text-slate-900  mb-4 flex items-center gap-2"
                  >
                    <Scale className="w-5 h-5 text-blue-600 " />
                    GDPR Rights (EU/UK/EEA Users)
                  </h3>
                  <div className="space-y-3 text-slate-700  text-sm">
                    <div>
                      <strong className="text-slate-900 ">
                        Right of Access:
                      </strong>{" "}
                      Request a copy of your personal data we hold.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Rectification:
                      </strong>{" "}
                      Correct inaccurate or incomplete information.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Erasure:
                      </strong>{" "}
                      Request deletion of your data ("Right to be Forgotten").
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Restrict Processing:
                      </strong>{" "}
                      Limit how we use your data.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Data Portability:
                      </strong>{" "}
                      Receive your data in structured, portable format.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Object:
                      </strong>{" "}
                      Opt-out of marketing and certain processing activities.
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-indigo-50  border border-indigo-200 "
                >
                  <h3
                    id="ccpa-rights"
                    className="font-semibold text-slate-900  mb-4 flex items-center gap-2"
                  >
                    <Scale className="w-5 h-5 text-indigo-600 " />
                    CCPA Rights (California Residents)
                  </h3>
                  <div className="space-y-3 text-slate-700  text-sm">
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Know:
                      </strong>{" "}
                      Request what personal information we collect, use, and
                      share.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Delete:
                      </strong>{" "}
                      Request deletion of personal information (with
                      exceptions).
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Opt-Out:
                      </strong>{" "}
                      Opt-out of personal information sales or sharing.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Correction:
                      </strong>{" "}
                      Request correction of inaccurate personal information.
                    </div>
                    <div>
                      <strong className="text-slate-900 ">
                        Right to Limit Use:
                      </strong>{" "}
                      Limit use and disclosure of sensitive personal
                      information.
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 rounded-lg bg-purple-50  border border-purple-200 "
                >
                  <h3
                    id="access-correction"
                    className="font-semibold text-slate-900  mb-4"
                  >
                    How to Exercise Your Rights
                  </h3>
                  <ol className="space-y-2 text-slate-700  text-sm list-decimal list-inside">
                    <li>
                      Log in to your menuffy account and access Privacy Settings
                    </li>
                    <li>
                      Submit a formal data request through our Privacy Portal
                    </li>
                    <li>
                      Email your request to privacy@menuар.com with verification
                      documents
                    </li>
                    <li>
                      Contact our Data Protection Officer for complex requests
                    </li>
                  </ol>
                  <p className="mt-4 text-xs text-slate-600 ">
                    Response time: We will respond to verified requests within
                    30 days (or as required by applicable law).
                  </p>
                </motion.div>
              </PolicySection>

              {/* Children's Privacy */}
              <PolicySection
                id="children-privacy"
                icon={Smartphone}
                title="Children's Privacy"
                index={9}
              >
                <SectionContent>
                  <p>
                    menuffy Service is not directed to individuals under 13
                    years old (or the applicable age of digital consent in your
                    jurisdiction). We do not knowingly collect personal
                    information from children under 13.
                  </p>

                  <p className="mt-4">
                    If we become aware that a child under 13 has provided us
                    with personal information, we will take immediate steps to
                    delete such information and terminate the child's account.
                    Parents or guardians who believe their child has provided
                    information to menuffy should contact us immediately.
                  </p>

                  <p className="mt-4">
                    For users aged 13-18 (minors), we provide enhanced privacy
                    protections and limited data processing. Parental consent
                    may be required for certain features depending on local
                    regulations.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Contact Us */}
              <PolicySection
                id="contact-us"
                icon={Contact}
                title="Contact Us"
                index={10}
              >
                <SectionContent>
                  <p>
                    If you have questions about this Privacy Policy, concerns
                    about our data practices, or wish to exercise your privacy
                    rights, please contact us:
                  </p>

                  <div className="mt-6 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900  flex items-center gap-2">
                        <Contact className="w-5 h-5 text-blue-600" />
                        menuffy Privacy Team
                      </h4>
                      <p className="text-sm text-slate-700  mt-2">
                        privacy@menuffy.com
                        <br />
                        +1 (555) 123-4567
                        <br />
                        menuffy Legal Department
                        <br />
                        New Delhi, India
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg bg-slate-50  border border-slate-200 "
                    >
                      <h4 className="font-semibold text-slate-900  flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-600" />
                        Data Protection Officer
                      </h4>
                      <p className="text-sm text-slate-700  mt-2">
                        dpo@menuffy.com
                        <br />
                        (For GDPR-related inquiries only)
                      </p>
                    </motion.div>
                  </div>

                  <p className="mt-6 text-sm text-slate-600  italic">
                    Response time: We will respond to all privacy inquiries
                    within 14 business days.
                  </p>
                </SectionContent>
              </PolicySection>

              {/* Changes to Policy */}
              <PolicySection
                id="changes-policy"
                icon={AlertCircle}
                title="Changes to This Policy"
                index={11}
              >
                <SectionContent>
                  <p>
                    menuffy may update this Privacy Policy periodically to
                    reflect changes in our practices, technology, legal
                    requirements, or other factors. When we make material
                    changes, we will:
                  </p>

                  <ul className="mt-4 space-y-2 text-slate-700 ">
                    <li>
                      • Update the "Last Updated" date at the top of this page
                    </li>
                    <li>
                      • Send email notification to registered account holders
                    </li>
                    <li>
                      • Display a prominent notice on the menuffy homepage
                    </li>
                    <li>• Request your explicit consent for certain changes</li>
                  </ul>

                  <p className="mt-4">
                    Your continued use of menuffy after changes become effective
                    constitutes your acceptance of the updated Privacy Policy.
                    We encourage you to review this policy regularly to stay
                    informed about how we protect your information.
                  </p>
                </SectionContent>
              </PolicySection>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        contactEmail="privacy@menuffy.com"
        contactPhone="+1 (555) 123-4567"
        contactAddress="menuffy Legal Department, New Delhi, India"
        lastUpdated="2024-06-27"
      />

      {/* Back to Top Button */}
      <BackToTop />
    </main>
  );
}
