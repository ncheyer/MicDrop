"use client";

import { useState } from "react";
import { ExternalLink, Download, Lock, Sparkles } from "lucide-react";
import { addUTMParams, generateTalkPageUTM, trackLinkClick } from "@/lib/utm-tracking";

interface CustomGPT {
  name: string;
  description: string;
  url: string;
}

interface DownloadResource {
  title: string;
  description?: string;
  fileUrl: string;
  requiresEmail: boolean;
}

interface ResourcesSectionProps {
  customGpts: CustomGPT[];
  downloads: DownloadResource[];
  onGPTClick: (name: string) => void;
  onDownload: (title: string, requiresEmail: boolean) => void;
  totalGpts?: number;
  totalDownloads?: number;
  isLocked?: boolean;
}

export default function ResourcesSection({
  customGpts,
  downloads,
  onGPTClick,
  onDownload,
  totalGpts = 0,
  totalDownloads = 0,
  isLocked = false,
}: ResourcesSectionProps) {
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<DownloadResource | null>(null);

  const handleDownload = (download: DownloadResource) => {
    if (download.requiresEmail && !email) {
      setSelectedDownload(download);
      setShowEmailModal(true);
    } else {
      onDownload(download.title, download.requiresEmail);
      window.open(download.fileUrl, "_blank");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDownload) {
      onDownload(selectedDownload.title, true);
      window.open(selectedDownload.fileUrl, "_blank");
      setShowEmailModal(false);
    }
  };

  return (
    <section id="resources" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <Sparkles className="inline-block h-8 w-8 text-yellow-500 mr-2" />
          FREE TOOLS & RESOURCES FROM THIS TALK
        </h2>

        {(customGpts.length > 0 || totalGpts > 0) && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">AI Implementation Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customGpts.map((gpt, index) => (
                <div
                  key={gpt.name}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    onGPTClick(gpt.name);
                    if (!isLocked) {
                      window.open(gpt.url, "_blank");
                    }
                  }}
                >
                  <h4 className="font-semibold mb-2 flex items-center justify-between">
                    {gpt.name}
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </h4>
                  <p className="text-sm text-gray-600">{gpt.description}</p>
                </div>
              ))}
              
              {/* Show locked items */}
              {isLocked && totalGpts > customGpts.length && (
                <div
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-400 transition-colors flex flex-col items-center justify-center"
                  onClick={() => onGPTClick("locked")}
                >
                  <Lock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    +{totalGpts - customGpts.length} more GPTs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Click to unlock</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(downloads.length > 0 || totalDownloads > 0) && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Downloadable Frameworks</h3>
            <div className="bg-white rounded-lg shadow-sm">
              {downloads.map((download, index) => (
                <div
                  key={download.title}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                    index !== downloads.length - 1 ? "border-b" : ""
                  }`}
                  onClick={() => handleDownload(download)}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      {download.title}
                      {download.requiresEmail && (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </h4>
                    {download.description && (
                      <p className="text-sm text-gray-600">{download.description}</p>
                    )}
                  </div>
                  <Download className="h-5 w-5 text-primary-600" />
                </div>
              ))}
              
              {/* Show locked downloads */}
              {isLocked && totalDownloads > downloads.length && (
                <div
                  className="p-6 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer border-t"
                  onClick={() => onDownload("locked", true)}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-semibold text-gray-600">
                        +{totalDownloads - downloads.length} more resources available
                      </h4>
                      <p className="text-sm text-gray-500">Enter email to unlock all downloads</p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            Download All Resources
          </button>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Get Your Resources</h3>
            <p className="text-gray-600 mb-6">
              Enter your email to access exclusive frameworks and guides
            </p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Get Resources
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}