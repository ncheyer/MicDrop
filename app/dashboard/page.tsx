"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Eye, Download, Mail, Mic, LogOut, BarChart, Users, Calendar } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface TalkPageSummary {
  id: string;
  title: string;
  slug: string;
  date: string;
  views: number;
  leads: number;
  published: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [talkPages, setTalkPages] = useState<TalkPageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Load talk pages (mock data for now)
    const mockPages: TalkPageSummary[] = [
      {
        id: "1",
        title: "AI in Events: Transform Your Operations in 30 Days",
        slug: "ai-events-2025",
        date: "2025-01-15",
        views: 245,
        leads: 42,
        published: true,
      },
      {
        id: "2",
        title: "The Future of AI Speakers",
        slug: "future-ai-speakers",
        date: "2025-02-20",
        views: 0,
        leads: 0,
        published: false,
      },
    ];
    
    setTalkPages(mockPages);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalViews = talkPages.reduce((sum, page) => sum + page.views, 0);
  const totalLeads = talkPages.reduce((sum, page) => sum + page.leads, 0);
  const publishedCount = talkPages.filter(page => page.published).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mic className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold">MicDrop</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold">{talkPages.length}</p>
              </div>
              <BarChart className="h-8 w-8 text-primary-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Captured</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Talk Pages</h1>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Page
          </Link>
        </div>

        {/* Talk Pages List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {talkPages.length === 0 ? (
            <div className="p-12 text-center">
              <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No talk pages yet</h3>
              <p className="text-gray-600 mb-6">Create your first speaker landing page to get started</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {talkPages.map((page) => (
                <div key={page.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                        {page.published ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(page.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {page.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {page.leads} leads
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/edit/${page.id}`}
                        className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      {page.published && (
                        <Link
                          href={`/talk/${page.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 border border-primary-600 rounded-lg hover:bg-primary-50 flex items-center gap-1"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Add your GPT tools to provide immediate value to attendees</li>
            <li>• Gate premium resources with email capture to build your list</li>
            <li>• Include your LinkedIn and business links to drive connections</li>
            <li>• Share your page URL and QR code at the end of your presentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}