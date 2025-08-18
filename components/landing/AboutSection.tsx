import { Briefcase, Mic, Mail, Calendar } from "lucide-react";

interface BusinessLink {
  name: string;
  description: string;
  url: string;
  ctaText: string;
}

interface AboutSectionProps {
  speakerName: string;
  speakerPhoto?: string;
  speakerBio?: string;
  businessLinks: BusinessLink[];
  onBusinessLinkClick: (name: string) => void;
}

export default function AboutSection({
  speakerName,
  speakerPhoto,
  speakerBio,
  businessLinks,
  onBusinessLinkClick,
}: AboutSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">About {speakerName}</h2>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {speakerPhoto && (
            <div className="flex-shrink-0">
              <img
                src={speakerPhoto}
                alt={speakerName}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            {speakerBio && (
              <p className="text-gray-600 mb-6 leading-relaxed">{speakerBio}</p>
            )}
            
            {businessLinks.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg mb-4">What I Do</h3>
                {businessLinks.map((link) => (
                  <div key={link.name} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      {link.name.toLowerCase().includes("speak") && <Mic className="h-5 w-5 text-primary-600" />}
                      {link.name.toLowerCase().includes("consult") && <Briefcase className="h-5 w-5 text-primary-600" />}
                      {link.name}
                    </h4>
                    <p className="text-gray-600 mb-3">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onBusinessLinkClick(link.name)}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {link.ctaText}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}