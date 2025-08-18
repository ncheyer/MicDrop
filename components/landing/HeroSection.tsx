import { Calendar, MapPin } from "lucide-react";

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
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        
        <div className="flex items-center justify-center gap-6 mb-6 text-primary-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {speakerPhoto && (
            <img
              src={speakerPhoto}
              alt={speakerName}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
          )}
          <div className="text-xl font-medium">{speakerName}</div>
        </div>

        {hook && (
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            {hook}
          </p>
        )}

        <button
          onClick={onGetResources}
          className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Get All Resources & Tools
        </button>
      </div>
    </section>
  );
}