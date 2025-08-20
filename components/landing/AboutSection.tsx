import { Briefcase, Mic, Mail, Calendar } from "lucide-react";
import { addUTMParams, generateTalkPageUTM } from "@/lib/utm-tracking";

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
  talkSlug?: string;
}

export default function AboutSection({
  speakerName,
  speakerPhoto,
  speakerBio,
  businessLinks,
  onBusinessLinkClick,
  talkSlug,
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
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Services & Expertise</h3>
                {businessLinks.map((link, index) => (
                  <div key={link.name} className="group bg-gradient-to-r from-primary-50 to-transparent border-l-4 border-primary-500 pl-6 pr-4 py-4 rounded-r-lg hover:from-primary-100 transition-all">
                    {index === 0 ? (
                      <div className="mb-2">
                        <img 
                          src="/favicon.png" 
                          alt="Speak About AI" 
                          className="h-12 w-auto rounded"
                        />
                      </div>
                    ) : (
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800 group-hover:text-primary-700">
                        {link.name.toLowerCase().includes("speak") && <Mic className="h-5 w-5 text-primary-600" />}
                        {link.name.toLowerCase().includes("consult") && <Briefcase className="h-5 w-5 text-primary-600" />}
                        {!link.name.toLowerCase().includes("speak") && !link.name.toLowerCase().includes("consult") && 
                          <Calendar className="h-5 w-5 text-primary-600" />}
                        {link.name}
                      </h4>
                    )}
                    <p className="text-gray-600 mb-4 leading-relaxed">{link.description}</p>
                    <a
                      href={talkSlug ? addUTMParams(link.url, generateTalkPageUTM(talkSlug, 'business', link.name)) : link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onBusinessLinkClick(link.name)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      {link.ctaText}
                      <span className="text-xs">→</span>
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