"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Eye, Download, Mail, Mic, LogOut, BarChart, Users, Calendar, Trash2, QrCode } from "lucide-react";
import QRCodeModal from "@/components/QRCodeModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<TalkPageSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPage, setQrPage] = useState<TalkPageSummary | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Load talk pages from database
    fetchTalkPages();
  }, [router]);

  const fetchTalkPages = async () => {
    try {
      const response = await fetch("/api/talk-pages");
      if (response.ok) {
        const data = await response.json();
        
        // Transform the data to match our interface
        const pages: TalkPageSummary[] = data.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          date: page.date,
          views: page._count?.analytics || 0,
          leads: page._count?.emailCaptures || 0,
          published: page.published,
        }));
        
        setTalkPages(pages);
      }
    } catch (error) {
      console.error("Error fetching talk pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  const handleDeleteClick = (page: TalkPageSummary) => {
    setPageToDelete(page);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/talk-pages/${pageToDelete.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Remove the page from the list
        setTalkPages(talkPages.filter(p => p.id !== pageToDelete.id));
        setDeleteModalOpen(false);
        setPageToDelete(null);
      } else {
        alert("Failed to delete the page. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("An error occurred while deleting the page.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPageToDelete(null);
  };

  const handleTogglePublish = async (page: TalkPageSummary) => {
    setPublishing(page.id);
    try {
      const response = await fetch(`/api/talk-pages/${page.id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !page.published }),
      });
      
      if (response.ok) {
        // Update the page in the list
        setTalkPages(talkPages.map(p => 
          p.id === page.id ? { ...p, published: !p.published } : p
        ));
      } else {
        alert("Failed to update publish status. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("An error occurred while updating the publish status.");
    } finally {
      setPublishing(null);
    }
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
              <img 
                src="/favicon.png" 
                alt="Speak About AI" 
                className="h-10 w-10"
              />
              <div className="ml-3">
                <span className="text-xl font-bold bg-speakabout-gradient bg-clip-text text-transparent">
                  MicDrop
                </span>
                <span className="block text-xs text-gray-600 -mt-1">
                  by Speak About AI
                </span>
              </div>
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
                      <button
                        onClick={() => handleTogglePublish(page)}
                        disabled={publishing === page.id}
                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors ${
                          page.published
                            ? "text-yellow-700 border border-yellow-600 hover:bg-yellow-50"
                            : "text-green-700 border border-green-600 hover:bg-green-50"
                        } ${publishing === page.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={page.published ? "Unpublish page" : "Publish page"}
                      >
                        {publishing === page.id ? (
                          <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        {page.published ? "Unpublish" : "Publish"}
                      </button>
                      {page.published && (
                        <button
                          onClick={() => {
                            setQrPage(page);
                            setQrModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                          title="Show QR Code"
                        >
                          <QrCode className="h-3 w-3" />
                          QR Code
                        </button>
                      )}
                      <Link
                        href={`/talk/${page.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 border border-primary-600 rounded-lg hover:bg-primary-50 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </Link>
                      <Link
                        href={`/dashboard/analytics/${page.id}`}
                        className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                      >
                        <BarChart className="h-3 w-3" />
                        Analytics
                      </Link>
                      <Link
                        href={`/dashboard/edit/${page.id}`}
                        className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(page)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete Talk Page</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{pageToDelete?.title}"</strong>? 
              This action cannot be undone and will permanently remove:
            </p>
            
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li>All page content and settings</li>
              <li>Associated GPTs and resources</li>
              <li>Analytics and email captures</li>
              <li>The public page URL</li>
            </ul>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && qrPage && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setQrPage(null);
          }}
          url={`${window.location.origin}/talk/${qrPage.slug}`}
          title={qrPage.title}
        />
      )}
    </div>
  );
}