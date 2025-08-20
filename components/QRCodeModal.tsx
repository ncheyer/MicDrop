"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { X, Download, Share2, Copy, Check } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function QRCodeModal({ isOpen, onClose, url, title }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector("#qr-code-container svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 250;
    canvas.height = 250;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 250, 250);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-qr-code.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Share Your Talk Page</h3>
            <p className="text-sm text-gray-600 mt-1">QR code and link for easy sharing</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 mb-6">
          <div id="qr-code-container" className="bg-white rounded-lg p-4 inline-block mx-auto">
            <QRCode
              value={url}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="text-center text-xs text-primary-700 mt-3 font-medium">
            {title}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download QR
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    text: `Check out my talk page: ${title}`,
                    url: url,
                  });
                } else {
                  handleCopyLink();
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Display this QR code at the end of your presentation for easy audience access
          </p>
        </div>
      </div>
    </div>
  );
}