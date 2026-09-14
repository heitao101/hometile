import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, Head } from '@inertiajs/react';
import { Phone, TrendingUp, Clock, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { PageHelp } from '@/components/page-help';

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  total_contacts: number;
  total_called: number;
  total_answered: number;
  created_at: string;
}

interface Call {
  id: number;
  to_number: string;
  status: string;
  duration: number | null;
  created_at: string;
}

interface Analytics {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_calls: number;
  total_answered: number;
  average_answer_rate: number;
  total_duration: number;
  total_duration_formatted: string;
  recent_calls: Call[];
}

interface Props {
  analytics: Analytics;
  recentCampaigns: Campaign[];
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  running: { label: 'Running', variant: 'default' },
  paused: { label: 'Paused', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'destructive' },
};

const callStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  initiated: { label: 'Initiated', variant: 'outline' },
  ringing: { label: 'Ringing', variant: 'default' },
  'in-progress': { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  busy: { label: 'Busy', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'destructive' },
  'no-answer': { label: 'No Answer', variant: 'secondary' },
};

export default function AnalyticsDashboard({ 
  analytics = {
    total_campaigns: 0,
    active_campaigns: 0,
    completed_campaigns: 0,
    total_calls: 0,
    total_answered: 0,
    average_answer_rate: 0,
    total_duration: 0,
    total_duration_formatted: '0s',
    recent_calls: []
  }, 
  recentCampaigns = [] 
}: Props) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: dashboard().url,
    },
    {
      title: 'Analytics',
      href: '/analytics/dashboard',
    },
  ];

  const helpSections = [
    {
      title: 'Analytics Overview',
      content: 'This dashboard provides comprehensive statistics about your campaigns and calls. Monitor performance metrics, call outcomes, and campaign effectiveness.',
    },
    {
      title: 'Campaign Metrics',
      content: 'Total Campaigns shows all campaigns created. Active campaigns are currently running. Completed campaigns have finished calling all contacts.',
    },
    {
      title: 'Call Statistics',
      content: 'Total Calls displays all calls made. Total Answered shows successful connections. Answer Rate is the percentage of calls that were answered.',
    },
    {
      title: 'Call Duration',
      content: 'Total Duration shows the cumulative time spent on all calls. This helps track resource usage and billing.',
    },
    {
      title: 'Recent Activity',
      content: 'View recent campaigns and calls to monitor ongoing activity. Click on campaigns to see detailed analytics for that specific campaign.',
    },
    {
      title: 'Performance Insights',
      content: 'Use these metrics to optimize your campaigns. High answer rates indicate good contact lists and timing. Low rates may suggest adjustments needed.',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytics" />
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your campaign performance and call statistics
            </p>
          </div>
          <PageHelp title="Analytics Help" sections={helpSections} />
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_campaigns}</div>
              <p className="text-xs text-slate-500">
                {analytics.active_campaigns} active, {analytics.completed_campaigns} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_calls}</div>
              <p className="text-xs text-slate-500">
                {analytics.total_answered} answered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Answer Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.average_answer_rate}%</div>
              <p className="text-xs text-slate-500">
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Call Duration</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_duration_formatted}</div>
              <p className="text-xs text-slate-500">
                {analytics.total_duration} seconds
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest campaign activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/campaigns/${campaign.id}`}
                            className="font-medium hover:underline"
                          >
                            {campaign.name}
                          </Link>
                          <Badge variant={statusConfig[campaign.status]?.variant || 'outline'}>
                            {statusConfig[campaign.status]?.label || campaign.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 capitalize">
                          {campaign.type.replace('_', ' ')} ΓÇó {campaign.total_contacts} contacts
                        </p>
                        {campaign.total_called > 0 && (
                          <p className="mt-1 text-xs text-slate-600">
                            {campaign.total_called} called, {campaign.total_answered} answered
                          </p>
                        )}
                      </div>
                      {(campaign.total_called > 0 || ['running', 'completed'].includes(campaign.status)) && (
                        <Link href={`/analytics/campaigns/${campaign.id}`}>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 py-8">No campaigns yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Latest call activity across all campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.recent_calls.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recent_calls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.to_number}</TableCell>
                        <TableCell>
                          <Badge variant={callStatusConfig[call.status]?.variant || 'outline'} className="text-xs">
                            {callStatusConfig[call.status]?.label || call.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(call.duration)}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(call.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-sm text-slate-500 py-8">No calls yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
