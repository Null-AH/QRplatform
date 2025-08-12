import React from 'react';
import { Check, Upload, LayoutTemplate, QrCode, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

const PricingCard = () => {
  const features = [
    'Upload your custom invitation design',
    'Select where to place guest name and QR code',
    'Auto-generate personalized invites using Excel file',
    'Supports common Excel formats (.xlsx, .csv, etc)',
  ];

  const mainFeatures = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload your design",
      description: "Upload your invitation design as PNG or JPG and get started quickly."
    },
    {
      icon: <LayoutTemplate className="w-6 h-6" />,
      title: "Define name & QR positions",
      description: "Easily click and select where the guest name and QR code should appear on your design."
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: "Connect Excel guest list",
      description: "Upload an Excel file with guest names — we’ll handle the rest."
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "Generate personalized invites",
      description: "Each guest will receive their own invite with their name and unique QR code, ready to send."
    }
  ];

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#ffffff0c] backdrop-blur-3xl border border-gray-500 text-gray-300 px-3 py-1 rounded-full text-sm mb-6">
            Upgrade
          </div>
          <h1 className="text-5xl font-bold mb-6">Unlock Advanced Invitation Tools</h1>
          <p className="text-gray-400 text-lg">
            Powerful and automated features to help you create professional personalized invitations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Features */}
          <div className="flex flex-col justify-between space-y-14 mt-8">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex bg-[#ffffff14] backdrop-blur-3xl border border-gray-500 items-center justify-center w-20 h-20 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Pricing Card */}
          <div className="bg-[#ffffff0a] backdrop-blur-3xl rounded-2xl p-8 border border-gray-500">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">Basic Plan</h2>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
               Must Popular
              </span>
            </div>
            
            <p className="text-gray-400 mb-8">Best suited for event organizers and teams.</p>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-bold">$10</span>
              <span className="text-gray-400">per month</span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide text-gray-300">
                Features
              </h3>
              <p className="text-gray-400 mb-6">Includes everything in the free plan, plus:</p>
              
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href={"/payservice"} className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-center"
>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
