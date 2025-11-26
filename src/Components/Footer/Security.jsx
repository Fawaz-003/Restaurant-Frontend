import React, { useState } from "react";
import { Shield, Lock, CreditCard, Smartphone, ShieldCheck, FileCheck2 } from "lucide-react";

const Security = () => {
  

    const sections = [
        {
            id: "data-security",
            title: "Data Protection",
            icon: <Lock className="text-orange-600 w-6 h-6" />,
            content: "We protect your personal information using encryption, secure servers, and strict policies. Your data is never sold or shared without consent.",
        },
        {
            id: "app-security",
            title: "Application Security",
            icon: <Smartphone className="text-orange-600 w-6 h-6" />,
            content: "Our systems are regularly tested against vulnerabilities. We use secure frameworks, token validation, and strict authorization layers.",
        },
        {
            id: "payment-security",
            title: "Payment Safety",
            icon: <CreditCard className="text-orange-600 w-6 h-6" />,
            content: "All payments are processed securely using PCI-DSS compliant gateways with end-to-end encryption and fraud prevention systems.",
        },
        {
            id: "fraud-prevention",
            title: "Fraud Detection",
            icon: <ShieldCheck className="text-orange-600 w-6 h-6" />,
            content: "AI-powered fraud detection monitors unusual activities. Suspicious transactions are flagged and blocked instantly for user protection.",
        },
        {
            id: "compliance",
            title: "Legal Compliance",
            icon: <FileCheck2 className="text-orange-600 w-6 h-6" />,
            content: "We adhere to data and privacy regulations applicable in your region, and we perform routine system audits for policy compliance.",
        },
        {
            id: "server-security",
            title: "Server Security",
            icon: <Shield className="text-orange-600 w-6 h-6" />,
            content: "Our backend runs in protected cloud environments with firewalls, intrusion monitoring, and 24/7 security safeguards.",
        },
    ];

    const [active, setActive] = useState<string>("data-security");

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-5 md:px-20">
            {/* Header */}
            <div className="text-center mb-12 bg-[#FD3D2D] p-10 rounded-2xl">
                <h1 className="text-4xl font-bold text-white">🔐 Security & Protection</h1>
                <p className="text-white mt-2 text-lg">
                    We ensure a secure and trusted food experience for every customer.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        onClick={() => setActive(section.id)}
                        className={`cursor-pointer shadow-lg rounded-2xl p-6 bg-white hover:shadow-2xl transition-all duration-300 ${active === section.id ? "ring-2 ring-orange-500" : ""
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">{section.icon}
                            <h2 className="text-xl font-semibold text-black">{section.title}</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Security;
