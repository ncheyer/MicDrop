"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Image,
  Type,
  Layout,
  Zap,
  MessageSquare,
  HelpCircle,
  Bot
} from 'lucide-react';

interface Section {
  id?: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: any;
  backgroundImage?: string;
  backgroundColor?: string;
  visible: boolean;
  order: number;
}

const SECTION_TYPES = [
  { id: 'hero', name: 'Hero Section', icon: Layout, description: 'Eye-catching header with CTA' },
  { id: 'features', name: 'Features', icon: Zap, description: 'Highlight key features' },
  { id: 'gpts', name: 'GPTs & AI Tools', icon: Bot, description: 'Showcase AI assistants' },
  { id: 'cta', name: 'Call to Action', icon: MessageSquare, description: 'Drive conversions' },
  { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, description: 'Social proof' },
  { id: 'faq', name: 'FAQ', icon: HelpCircle, description: 'Answer common questions' },
  { id: 'custom', name: 'Custom HTML', icon: Type, description: 'Add custom content' }
];

export default function CreateLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Page data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('general');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [customGpts, setCustomGpts] = useState<Array<{name: string; description: string; url: string}>>([]);
  
  // Talk pages for linking
  const [talkPages, setTalkPages] = useState<any[]>([]);
  const [selectedTalkPageId, setSelectedTalkPageId] = useState('');

  useEffect(() => {
    fetchTalkPages();
  }, []);

  const fetchTalkPages = async () => {
    try {
      const response = await fetch('/api/talk-pages');
      if (response.ok) {
        const data = await response.json();
        setTalkPages(data);
      }
    } catch (error) {
      console.error('Error fetching talk pages:', error);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const addSection = (sectionType: string) => {
    const newSection: Section = {
      type: sectionType,
      visible: true,
      order: sections.length,
      title: '',
      subtitle: '',
      content: getDefaultContent(sectionType)
    };
    setSections([...sections, newSection]);
  };

  const getDefaultContent = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return {
          headline: 'Welcome to Our Landing Page',
          subheadline: 'Create amazing experiences',
          ctaText: 'Get Started',
          ctaLink: '#'
        };
      case 'features':
        return {
          features: [
            { title: 'Feature 1', description: 'Description here' },
            { title: 'Feature 2', description: 'Description here' },
            { title: 'Feature 3', description: 'Description here' }
          ]
        };
      case 'cta':
        return {
          headline: 'Ready to get started?',
          buttonText: 'Sign Up Now',
          buttonLink: '#'
        };
      case 'testimonials':
        return {
          testimonials: [
            { name: 'John Doe', role: 'CEO', quote: 'Amazing product!' }
          ]
        };
      case 'faq':
        return {
          questions: [
            { question: 'How does it work?', answer: 'It works great!' }
          ]
        };
      case 'gpts':
        return {
          showGpts: true
        };
      default:
        return {};
    }
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order values
    newSections.forEach((section, i) => {
      section.order = i;
    });
    
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!title || !slug) {
      alert('Please provide a title and slug');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          type,
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || description,
          talkPageId: selectedTalkPageId || undefined,
          sections,
          customGpts
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/landing-pages/${data.id}/edit`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create landing page');
      }
    } catch (error) {
      console.error('Error creating landing page:', error);
      alert('Failed to create landing page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/landing-pages">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <h1 className="text-xl font-semibold">Create Landing Page</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Awesome Landing Page"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-1">/lp/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="my-awesome-page"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of your landing page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="talk">Talk Landing Page</option>
                    <option value="event">Event</option>
                    <option value="product">Product</option>
                  </select>
                </div>

                {type === 'talk' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link to Talk Page (Optional)
                    </label>
                    <select
                      value={selectedTalkPageId}
                      onChange={(e) => setSelectedTalkPageId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      {talkPages.map((talk) => (
                        <option key={talk.id} value={talk.id}>
                          {talk.title} - {talk.speakerName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Page Sections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Page Sections</h2>
              
              {sections.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No sections added yet</p>
                  <p className="text-sm text-gray-400">Add sections from the sidebar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                          <span className="font-medium">{section.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => deleteSection(index)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Section content editor would go here */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Section title"
                        />
                        <input
                          type="text"
                          value={section.subtitle || ''}
                          onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Section subtitle"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Sections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Add Section</h3>
              <div className="space-y-2">
                {SECTION_TYPES.map((sectionType) => {
                  const Icon = sectionType.icon;
                  return (
                    <button
                      key={sectionType.id}
                      onClick={() => addSection(sectionType.id)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{sectionType.name}</div>
                          <div className="text-xs text-gray-500">{sectionType.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder={title || 'Page title'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder={description || 'Page description'}
                  />
                </div>
              </div>
            </div>

            {/* GPT Management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                GPT Links
              </h3>
              <div className="space-y-3">
                {customGpts.map((gpt, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={gpt.name}
                        onChange={(e) => {
                          const newGpts = [...customGpts];
                          newGpts[index].name = e.target.value;
                          setCustomGpts(newGpts);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="GPT Name"
                      />
                      <input
                        type="text"
                        value={gpt.description}
                        onChange={(e) => {
                          const newGpts = [...customGpts];
                          newGpts[index].description = e.target.value;
                          setCustomGpts(newGpts);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Description"
                      />
                      <input
                        type="url"
                        value={gpt.url}
                        onChange={(e) => {
                          const newGpts = [...customGpts];
                          newGpts[index].url = e.target.value;
                          setCustomGpts(newGpts);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="https://chat.openai.com/g/..."
                      />
                      <button
                        onClick={() => {
                          setCustomGpts(customGpts.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCustomGpts([...customGpts, { name: '', description: '', url: '' }]);
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400"
                >
                  + Add GPT Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}