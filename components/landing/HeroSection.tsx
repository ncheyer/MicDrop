"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, ArrowDown, Sparkles, Gift } from "lucide-react";

interface HeroSectionProps {
  title: string;
  date: string;
  speakerName: string;
  speakerPhoto?: string;
  hook?: string;
  onGetResources: () => void;
}

export default function HeroSection({
  title,
  date,
  speakerName,
  speakerPhoto,
  hook,
  onGetResources,
}: HeroSectionProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  
  useEffect(() => {
    // Format date on client side only to avoid hydration mismatch
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setFormattedDate(`${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`);
  }, [date]);
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
          <Gift className="h-4 w-4" />
          <span>Exclusive Resources from the Talk</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">{title}</h1>
        
        <div className="flex items-center justify-center gap-6 mb-6 text-primary-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate || "Loading..."}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {speakerPhoto && (
            <img
              src={speakerPhoto}
              alt={speakerName}
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl"
            />
          )}
          <div>
            <div className="text-sm text-primary-200 mb-1">Presented by</div>
            <div className="text-2xl font-semibold">{speakerName}</div>
          </div>
        </div>

        {hook && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <Sparkles className="h-6 w-6 text-yellow-400 mx-auto mb-3" />
            <p className="text-lg text-white/95 leading-relaxed">
              {hook}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={onGetResources}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-2xl"
          >
            <Gift className="h-5 w-5" />
            Access Your Free Resources
            <ArrowDown className="h-5 w-5 group-hover:animate-bounce" />
          </button>
          <p className="text-sm text-primary-200">
            AI Tools • Frameworks • Templates • Exclusive Content
          </p>
        </div>
      </div>
    </section>
  );
}