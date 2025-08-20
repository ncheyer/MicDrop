"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Eye, 
  MousePointer, 
  Mail, 
  TrendingUp,
  BarChart3,
  Users,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";

interface Analytics {
  overview: {
    pageViews: number;
    linkClicks: number;
    emailCaptures: number;
    conversionRate: string;
  };
  gpts: Array<{
    name: string;
    clickCount: number;
  }>;
  businessLinks: Array<{
    name: string;
    clickCount: number;
  }>;
  downloads: Array<{
    title: string;
    downloadCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    event: string;
    data: any;
    createdAt: string;
  }>;
}

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [timeRange, setTimeRange] = useState("all"); // all, 7days, 30days

  useEffect(() => {
    fetchAnalytics();
    fetchPageInfo();
  }, [params.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/track?talkPageId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageInfo = async () => {
    try {
      const response = await fetch(`/api/talk-pages/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPageTitle(data.title);
      }
    } catch (error) {
      console.error("Error fetching page info:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Analytics Data</h1>
          <p className="text-gray-600">Analytics will appear once your page has visitors.</p>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatActivity = (activity: any) => {
    const date = new Date(activity.createdAt);
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    switch (activity.event) {
      case 'page_view':
        return {
          icon: <Eye className="h-4 w-4" />,
          text: 'Page viewed',
          time,
          day
        };
      case 'link_click':
        return {
          icon: <MousePointer className="h-4 w-4" />,
          text: `Clicked ${activity.data.linkName || activity.data.linkType}`,
          time,
          day
        };
      case 'email_capture':
        return {
          icon: <Mail className="h-4 w-4" />,
          text: `Email captured (${activity.data.captureType})`,
          time,
          day
        };
      default:
        return {
          icon: <BarChart3 className="h-4 w-4" />,
          text: activity.event,
          time,
          day
        };
    }
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
              <div>
                <h1 className="text-xl font-semibold">Analytics</h1>
                <p className="text-sm text-gray-500">{pageTitle}</p>
              </div>
            </div>
            <Link
              href={`/talk/${params.id}`}
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            >
              View Page
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-8 w-8 text-blue-600 opacity-50" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold">{analytics.overview.pageViews}</p>
            <p className="text-sm text-gray-600">Page Views</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="h-8 w-8 text-green-600 opacity-50" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold">{analytics.overview.linkClicks}</p>
            <p className="text-sm text-gray-600">Link Clicks</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Mail className="h-8 w-8 text-purple-600 opacity-50" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold">{analytics.overview.emailCaptures}</p>
            <p className="text-sm text-gray-600">Emails Captured</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-orange-600 opacity-50" />
              <span className="text-xs text-gray-500">Rate</span>
            </div>
            <p className="text-2xl font-bold">{analytics.overview.conversionRate}%</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Resources */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Top GPTs
            </h2>
            {analytics.gpts.length === 0 ? (
              <p className="text-gray-500 text-sm">No GPT clicks yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.gpts.slice(0, 5).map((gpt, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{gpt.name}</span>
                    <span className="text-sm font-medium text-gray-900">{gpt.clickCount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Business Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary-600" />
              Business Links
            </h2>
            {analytics.businessLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No business link clicks yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.businessLinks.slice(0, 5).map((link, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{link.name}</span>
                    <span className="text-sm font-medium text-gray-900">{link.clickCount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Downloads */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Top Downloads
            </h2>
            {analytics.downloads.length === 0 ? (
              <p className="text-gray-500 text-sm">No downloads yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.downloads.slice(0, 5).map((download, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">{download.title}</span>
                    <span className="text-sm font-medium text-gray-900">{download.downloadCount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Recent Activity
          </h2>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {analytics.recentActivity.map((activity) => {
                const formatted = formatActivity(activity);
                return (
                  <div key={activity.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="text-gray-400">{formatted.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm">{formatted.text}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{formatted.time}</p>
                      <p className="text-xs text-gray-400">{formatted.day}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* UTM Tracking Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📊 UTM Tracking Active</h3>
          <p className="text-sm text-blue-800 mb-3">
            All external links from your talk page automatically include UTM parameters for tracking in Google Analytics:
          </p>
          <div className="bg-white rounded p-3 font-mono text-xs">
            <div>utm_source=micdrop</div>
            <div>utm_medium=speaker_page</div>
            <div>utm_campaign={`your-talk-slug`}</div>
            <div>utm_content={`link-name`}</div>
            <div>utm_term={`link-type`}</div>
          </div>
          <p className="text-sm text-blue-800 mt-3">
            This helps you track which resources drive the most engagement and conversions in your own analytics tools.
          </p>
        </div>
      </div>
    </div>
  );
}