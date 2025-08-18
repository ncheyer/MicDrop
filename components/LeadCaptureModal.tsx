"use client";

import { useState, useEffect } from "react";
import { X, Mail, Sparkles, Lock, Gift, Zap } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, name?: string) => void;
  speakerName: string;
  talkTitle: string;
  resourceCount: number;
  gptCount: number;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  speakerName,
  talkTitle,
  resourceCount = 0,
  gptCount = 0,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanClose(true);
    }
  }, [isOpen, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(email, name);
      // Modal will be closed by parent component
    } catch (error) {
      console.error("Error submitting:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white relative">
          {canClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold mb-1">
              Unlock All {gptCount + resourceCount} Resources
            </h2>
            <p className="text-sm text-primary-100">
              From {speakerName}'s talk
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* What you'll get - Compact version */}
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm">
              {gptCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{gptCount} GPTs</span>
                </div>
              )}
              
              {resourceCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{resourceCount} Resources</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Follow-ups</span>
              </div>
            </div>
          </div>

          {/* Form - Simplified */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Unlocking..." : "Get Instant Access"}
            </button>
          </form>

          {/* Trust signals - Compact */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>No spam</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>

          {/* Skip option - Compact */}
          {!canClose && countdown > 0 && (
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">
                Skip in {countdown}s...
              </p>
            </div>
          )}
          
          {canClose && (
            <div className="text-center mt-3">
              <button
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}