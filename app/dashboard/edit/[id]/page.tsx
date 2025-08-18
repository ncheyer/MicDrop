"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  User,
  Mail,
  Link as LinkIcon,
  FileText,
  Download,
  Sparkles
} from "lucide-react";

export default function EditTalkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "",
    date: "",
    speakerName: "",
    speakerEmail: "",
    speakerPhoto: "",
    speakerBio: "",
    speakerLinkedIn: "",
    hook: "",
    keynoteNotesUrl: "",
    keynoteSlidesUrl: "",
    contactEmail: "",
    calendarLink: "",
    newsletterEnabled: false,
    newsletterDescription: "",
    newsletterSignupUrl: "",
    published: false,
    customGpts: [],
    downloads: [],
    businessLinks: []
  });

  useEffect(() => {
    fetchTalkPage();
  }, [params.id]);

  const fetchTalkPage = async () => {
    try {
      const response = await fetch(`/api/talk-pages/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : ""
        });
      }
    } catch (error) {
      console.error("Error fetching talk page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/talk-pages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setFormData((prev: any) => ({ ...prev, published: !prev.published }));
    setTimeout(() => handleSave(), 100);
  };

  const addGPT = () => {
    setFormData((prev: any) => ({
      ...prev,
      customGpts: [...prev.customGpts, { name: "", description: "", url: "", order: prev.customGpts.length }]
    }));
  };

  const updateGPT = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customGpts: prev.customGpts.map((gpt: any, i: number) => 
        i === index ? { ...gpt, [field]: value } : gpt
      )
    }));
  };

  const removeGPT = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      customGpts: prev.customGpts.filter((_: any, i: number) => i !== index)
    }));
  };

  const addDownload = () => {
    setFormData((prev: any) => ({
      ...prev,
      downloads: [...prev.downloads, { title: "", description: "", fileUrl: "", requiresEmail: false, order: prev.downloads.length }]
    }));
  };

  const updateDownload = (index: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      downloads: prev.downloads.map((dl: any, i: number) => 
        i === index ? { ...dl, [field]: value } : dl
      )
    }));
  };

  const removeDownload = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      downloads: prev.downloads.filter((_: any, i: number) => i !== index)
    }));
  };

  const addBusinessLink = () => {
    setFormData((prev: any) => ({
      ...prev,
      businessLinks: [...prev.businessLinks, { name: "", description: "", url: "", ctaText: "Learn More", order: prev.businessLinks.length }]
    }));
  };

  const updateBusinessLink = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      businessLinks: prev.businessLinks.map((link: any, i: number) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeBusinessLink = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      businessLinks: prev.businessLinks.filter((_: any, i: number) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold">Edit: {formData.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {formData.slug && (
                <Link
                  href={`/talk/${formData.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              <button
                onClick={handlePublish}
                className={`px-4 py-1.5 text-sm rounded-lg ${
                  formData.published
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                {formData.published ? "Published" : "Draft"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talk Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talk Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hook (Short Description)
                  </label>
                  <textarea
                    name="hook"
                    value={formData.hook}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Speaker Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                Speaker Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="speakerName"
                      value={formData.speakerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="speakerEmail"
                      value={formData.speakerEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    name="speakerPhoto"
                    value={formData.speakerPhoto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="speakerBio"
                    value={formData.speakerBio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="speakerLinkedIn"
                    value={formData.speakerLinkedIn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom GPTs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                  Custom GPTs
                </h2>
                <button
                  onClick={addGPT}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  <Plus className="h-4 w-4" />
                  Add GPT
                </button>
              </div>
              <div className="space-y-3">
                {formData.customGpts.map((gpt: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">GPT #{index + 1}</span>
                      <button
                        onClick={() => removeGPT(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="GPT Name"
                        value={gpt.name}
                        onChange={(e) => updateGPT(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={gpt.description}
                        onChange={(e) => updateGPT(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="url"
                        placeholder="GPT URL"
                        value={gpt.url}
                        onChange={(e) => updateGPT(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
                {formData.customGpts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No GPTs added yet. Click "Add GPT" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Downloads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Download className="h-5 w-5 text-gray-400" />
                  Downloadable Resources
                </h2>
                <button
                  onClick={addDownload}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Resource
                </button>
              </div>
              <div className="space-y-3">
                {formData.downloads.map((download: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">Resource #{index + 1}</span>
                      <button
                        onClick={() => removeDownload(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Resource Title"
                        value={download.title}
                        onChange={(e) => updateDownload(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={download.description}
                        onChange={(e) => updateDownload(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="url"
                        placeholder="File URL"
                        value={download.fileUrl}
                        onChange={(e) => updateDownload(index, 'fileUrl', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={download.requiresEmail}
                          onChange={(e) => updateDownload(index, 'requiresEmail', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Require email to download</span>
                      </label>
                    </div>
                  </div>
                ))}
                {formData.downloads.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No resources added yet. Click "Add Resource" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Business Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                  Business Links
                </h2>
                <button
                  onClick={addBusinessLink}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {formData.businessLinks.map((link: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">Link #{index + 1}</span>
                      <button
                        onClick={() => removeBusinessLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Link Name"
                        value={link.name}
                        onChange={(e) => updateBusinessLink(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={link.description}
                        onChange={(e) => updateBusinessLink(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateBusinessLink(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Button Text (e.g., Learn More)"
                        value={link.ctaText}
                        onChange={(e) => updateBusinessLink(index, 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
                {formData.businessLinks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No business links added yet. Click "Add Link" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                Contact & Calendar
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calendar Link
                  </label>
                  <input
                    type="url"
                    name="calendarLink"
                    value={formData.calendarLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="newsletterEnabled"
                    checked={formData.newsletterEnabled}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Enable Newsletter Signup</span>
                </label>
                {formData.newsletterEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="newsletterDescription"
                        value={formData.newsletterDescription}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signup URL
                      </label>
                      <input
                        type="url"
                        name="newsletterSignupUrl"
                        value={formData.newsletterSignupUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Keynote Files */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Keynote Files</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes URL
                  </label>
                  <input
                    type="url"
                    name="keynoteNotesUrl"
                    value={formData.keynoteNotesUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slides URL
                  </label>
                  <input
                    type="url"
                    name="keynoteSlidesUrl"
                    value={formData.keynoteSlidesUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {formData.slug && (
                  <Link
                    href={`/talk/${formData.slug}`}
                    target="_blank"
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Page
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 text-center block"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}