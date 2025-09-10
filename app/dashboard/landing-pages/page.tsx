"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  MoreVertical,
  FileText,
  Mic,
  Calendar,
  Globe,
  Search,
  Filter
} from 'lucide-react';

interface LandingPage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: string;
  published: boolean;
  viewCount: number;
  conversionCount: number;
  createdAt: string;
  updatedAt: string;
  talkPage?: {
    id: string;
    title: string;
    speakerName: string;
  };
}

export default function LandingPagesPage() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const fetchLandingPages = async () => {
    try {
      const response = await fetch('/api/landing-pages');
      if (response.ok) {
        const data = await response.json();
        setLandingPages(data);
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this landing page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/landing-pages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLandingPages(landingPages.filter(page => page.id !== id));
      }
    } catch (error) {
      console.error('Error deleting landing page:', error);
    }
  };

  const handleDuplicate = async (page: LandingPage) => {
    try {
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${page.title} (Copy)`,
          slug: `${page.slug}-copy-${Date.now()}`,
          type: page.type,
          description: page.description,
          talkPageId: page.talkPage?.id
        })
      });

      if (response.ok) {
        fetchLandingPages();
      }
    } catch (error) {
      console.error('Error duplicating landing page:', error);
    }
  };

  const filteredPages = landingPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || page.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'talk':
        return <Mic className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'product':
        return <FileText className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'talk':
        return 'bg-purple-100 text-purple-700';
      case 'event':
        return 'bg-blue-100 text-blue-700';
      case 'product':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Landing Pages</h1>
          <p className="mt-2 text-gray-600">Create and manage your landing pages</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search landing pages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="talk">Talk</option>
                <option value="event">Event</option>
                <option value="product">Product</option>
              </select>
              <Link href="/dashboard/landing-pages/create">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Landing Pages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading landing pages...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No landing pages yet</h3>
            <p className="text-gray-600 mb-6">Create your first landing page to get started</p>
            <Link href="/dashboard/landing-pages/create">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Landing Page
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(page.type)}`}>
                        {getTypeIcon(page.type)}
                        {page.type}
                      </span>
                      {page.published ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
                  {page.description && (
                    <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <p>/{page.slug}</p>
                    {page.talkPage && (
                      <p className="mt-1">Linked to: {page.talkPage.title}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{page.viewCount} views</span>
                    <span>{page.conversionCount} conversions</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/landing-pages/${page.id}/edit`} className="flex-1">
                      <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </Link>
                    <Link href={`/lp/${page.slug}`} target="_blank" className="flex-1">
                      <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDuplicate(page)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}