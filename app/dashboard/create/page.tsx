"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  User,
  Mail,
  Linkedin,
  Globe,
  FileText,
  Sparkles
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface CustomGPT {
  name: string;
  description: string;
  url: string;
}

interface Download {
  title: string;
  description: string;
  fileUrl: string;
  requiresEmail: boolean;
}

interface BusinessLink {
  name: string;
  description: string;
  url: string;
  ctaText: string;
}

export default function CreateTalkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    speakerName: "",
    speakerEmail: "",
    speakerPhoto: "",
    speakerBio: "",
    speakerLinkedIn: "",
    hook: "",
    contactEmail: "",
    calendarLink: "",
    newsletterEnabled: false,
    newsletterDescription: "",
    newsletterSignupUrl: "",
  });

  const [customGpts, setCustomGpts] = useState<CustomGPT[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [businessLinks, setBusinessLinks] = useState<BusinessLink[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/talk-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customGpts,
          downloads,
          businessLinks,
          published: false, // Start as draft
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create talk page");
      }

      const data = await response.json();
      router.push(`/dashboard/edit/${data.id}`);
    } catch (err) {
      setError("Failed to create talk page. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addCustomGPT = () => {
    setCustomGpts([...customGpts, { name: "", description: "", url: "" }]);
  };

  const updateCustomGPT = (index: number, field: keyof CustomGPT, value: string) => {
    const updated = [...customGpts];
    updated[index] = { ...updated[index], [field]: value };
    setCustomGpts(updated);
  };

  const removeCustomGPT = (index: number) => {
    setCustomGpts(customGpts.filter((_, i) => i !== index));
  };

  const addDownload = () => {
    setDownloads([...downloads, { title: "", description: "", fileUrl: "", requiresEmail: false }]);
  };

  const updateDownload = (index: number, field: keyof Download, value: any) => {
    const updated = [...downloads];
    updated[index] = { ...updated[index], [field]: value };
    setDownloads(updated);
  };

  const removeDownload = (index: number) => {
    setDownloads(downloads.filter((_, i) => i !== index));
  };

  const addBusinessLink = () => {
    setBusinessLinks([...businessLinks, { name: "", description: "", url: "", ctaText: "" }]);
  };

  const updateBusinessLink = (index: number, field: keyof BusinessLink, value: string) => {
    const updated = [...businessLinks];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessLinks(updated);
  };

  const removeBusinessLink = (index: number) => {
    setBusinessLinks(businessLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold">Create Talk Page</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Talk Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hook (Brief compelling description)
                </label>
                <textarea
                  name="hook"
                  value={formData.hook}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Transform your event operations with AI tools that save 10+ hours monthly..."
                />
              </div>
            </div>
          </div>

          {/* Speaker Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Speaker Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speaker Name *
                  </label>
                  <input
                    type="text"
                    name="speakerName"
                    value={formData.speakerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speaker Email *
                  </label>
                  <input
                    type="email"
                    name="speakerEmail"
                    value={formData.speakerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    name="speakerLinkedIn"
                    value={formData.speakerLinkedIn}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speaker Bio
                </label>
                <textarea
                  name="speakerBio"
                  value={formData.speakerBio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <ImageUpload
                type="speaker"
                id="new"
                label="Speaker Photo"
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, speakerPhoto: url }))}
              />
            </div>
          </div>

          {/* Custom GPTs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600" />
                Custom GPTs
              </h2>
              <button
                type="button"
                onClick={addCustomGPT}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add GPT
              </button>
            </div>
            
            {customGpts.length === 0 ? (
              <p className="text-gray-500 text-sm">No GPTs added yet. Click "Add GPT" to get started.</p>
            ) : (
              <div className="space-y-4">
                {customGpts.map((gpt, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="GPT Name"
                        value={gpt.name}
                        onChange={(e) => updateCustomGPT(index, "name", e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={gpt.description}
                        onChange={(e) => updateCustomGPT(index, "description", e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="GPT URL"
                          value={gpt.url}
                          onChange={(e) => updateCustomGPT(index, "url", e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomGPT(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary-600" />
                Business Links
              </h2>
              <button
                type="button"
                onClick={addBusinessLink}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </button>
            </div>
            
            {businessLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No business links added yet.</p>
            ) : (
              <div className="space-y-4">
                {businessLinks.map((link, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Business Name"
                        value={link.name}
                        onChange={(e) => updateBusinessLink(index, "name", e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="CTA Text"
                        value={link.ctaText}
                        onChange={(e) => updateBusinessLink(index, "ctaText", e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={link.description}
                        onChange={(e) => updateBusinessLink(index, "description", e.target.value)}
                        className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="col-span-2 flex gap-2">
                        <input
                          type="url"
                          placeholder="Business URL"
                          value={link.url}
                          onChange={(e) => updateBusinessLink(index, "url", e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeBusinessLink(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Newsletter Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="newsletterEnabled"
                  checked={formData.newsletterEnabled}
                  onChange={handleChange}
                  className="rounded text-primary-600"
                />
                <span className="text-sm font-medium">Enable newsletter signup</span>
              </label>
              
              {formData.newsletterEnabled && (
                <>
                  <input
                    type="text"
                    name="newsletterDescription"
                    value={formData.newsletterDescription}
                    onChange={handleChange}
                    placeholder="Newsletter description"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="url"
                    name="newsletterSignupUrl"
                    value={formData.newsletterSignupUrl}
                    onChange={handleChange}
                    placeholder="Newsletter signup URL (optional)"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}