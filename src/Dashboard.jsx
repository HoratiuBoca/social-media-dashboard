import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye,
  DollarSign, Target, Zap, Calendar, Bell, AlertTriangle, ChevronRight,
  BarChart3, Activity, Globe, Star, Clock, ArrowUpRight, ArrowDownRight,
  Filter, Download, RefreshCw, Search, ExternalLink, Play, Image, Video,
  ThumbsUp, Bookmark, Send, Award, Layers, PieChart as PieChartIcon
} from "lucide-react";

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/lbaopu3j9qznaq1fv92h9fom8bvxst9l";


// ═══════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════

const kpiData = {
  totalFollowers: 127845,
  followersGrowth: 3.2,
  totalEngagement: 45230,
  engagementGrowth: 7.8,
  totalReach: 892400,
  reachGrowth: 12.1,
  totalImpressions: 1456000,
  impressionsGrowth: 5.4,
  adSpend: 4850,
  adSpendGrowth: -2.3,
  roas: 4.2,
  roasGrowth: 15.6,
};

const platformStats = {
  facebook: { followers: 45200, engagement: 3.2, reach: 320000, posts: 28, likes: 12400, comments: 3200, shares: 1800, color: "#1877F2" },
  instagram: { followers: 52300, engagement: 4.8, reach: 410000, posts: 35, likes: 22100, comments: 5600, shares: 3100, color: "#E4405F" },
  tiktok: { followers: 30345, engagement: 8.1, reach: 162400, posts: 22, likes: 18900, comments: 4200, shares: 6800, color: "#000000" },
};

const monthlyTrend = [
  { month: "Oct", facebook: 42100, instagram: 46800, tiktok: 21200, reach: 650000, engagement: 32100 },
  { month: "Nov", facebook: 43200, instagram: 48500, tiktok: 24100, reach: 720000, engagement: 36400 },
  { month: "Dec", facebook: 43800, instagram: 49200, tiktok: 25800, reach: 780000, engagement: 38900 },
  { month: "Ian", facebook: 44100, instagram: 50100, tiktok: 27500, reach: 810000, engagement: 40200 },
  { month: "Feb", facebook: 44600, instagram: 51400, tiktok: 28900, reach: 855000, engagement: 42800 },
  { month: "Mar", facebook: 45200, instagram: 52300, tiktok: 30345, reach: 892400, engagement: 45230 },
];

const weeklyEngagement = [
  { day: "Luni", likes: 1820, comments: 420, shares: 310 },
  { day: "Marti", likes: 2100, comments: 380, shares: 280 },
  { day: "Miercuri", likes: 2450, comments: 510, shares: 420 },
  { day: "Joi", likes: 1950, comments: 350, shares: 290 },
  { day: "Vineri", likes: 2800, comments: 620, shares: 510 },
  { day: "Sambata", likes: 3200, comments: 780, shares: 680 },
  { day: "Duminica", likes: 2900, comments: 650, shares: 540 },
];

const topPosts = {
  facebook: [
    { id: 1, type: "video", content: "Behind the scenes - procesul de productie", likes: 2400, comments: 380, shares: 210, reach: 45000, date: "15 Mar" },
    { id: 2, type: "image", content: "Lansare produs nou - Colectia Primavara", likes: 1800, comments: 290, shares: 180, reach: 38000, date: "12 Mar" },
    { id: 3, type: "link", content: "Blog: 5 tendinte in industrie pentru 2026", likes: 950, comments: 120, shares: 340, reach: 28000, date: "10 Mar" },
  ],
  instagram: [
    { id: 1, type: "reel", content: "Reel viral - Tutorial rapid", likes: 8200, comments: 1200, shares: 890, reach: 125000, date: "14 Mar" },
    { id: 2, type: "carousel", content: "Carousel - Top 10 produse preferate", likes: 4500, comments: 680, shares: 420, reach: 68000, date: "11 Mar" },
    { id: 3, type: "story", content: "Story Q&A cu echipa", likes: 3200, comments: 890, shares: 210, reach: 52000, date: "9 Mar" },
  ],
  tiktok: [
    { id: 1, type: "video", content: "Trend viral - Day in the life", likes: 12400, comments: 2100, shares: 4500, reach: 89000, date: "16 Mar" },
    { id: 2, type: "video", content: "Tutorial produs in 60 secunde", likes: 8900, comments: 1400, shares: 2800, reach: 67000, date: "13 Mar" },
    { id: 3, type: "video", content: "Raspundem la comentarii", likes: 5600, comments: 980, shares: 1200, reach: 42000, date: "8 Mar" },
  ],
};

const recentComments = [
  { platform: "instagram", user: "@maria_design", text: "Super produs! De unde pot comanda?", post: "Lansare colectie", time: "2 min", sentiment: "positive" },
  { platform: "facebook", user: "Ion Popescu", text: "Calitate excelenta, recomand!", post: "Review produs", time: "15 min", sentiment: "positive" },
  { platform: "tiktok", user: "@cool_reviewer", text: "Astept si eu un cod de reducere :)", post: "Tutorial produs", time: "32 min", sentiment: "neutral" },
  { platform: "instagram", user: "@ana.shop", text: "Cand revine in stoc marimea M?", post: "Produs sold out", time: "1h", sentiment: "neutral" },
  { platform: "facebook", user: "George V.", text: "Am comandat si nu am primit tracking-ul", post: "Post promovat", time: "2h", sentiment: "negative" },
  { platform: "tiktok", user: "@fashionlover", text: "Cel mai bun brand din RO! 🔥", post: "Trend viral", time: "3h", sentiment: "positive" },
  { platform: "instagram", user: "@mihai_foto", text: "Puteti face si un tutorial video?", post: "Carousel tips", time: "4h", sentiment: "neutral" },
];

// Ads Data
const metaAdsData = {
  totalSpend: 3200,
  impressions: 892000,
  clicks: 18400,
  ctr: 2.06,
  cpc: 0.17,
  cpm: 3.59,
  conversions: 486,
  costPerConversion: 6.58,
  roas: 4.8,
  revenue: 15360,
};

const tiktokAdsData = {
  totalSpend: 1650,
  impressions: 564000,
  clicks: 12800,
  ctr: 2.27,
  cpc: 0.13,
  cpm: 2.93,
  conversions: 312,
  costPerConversion: 5.29,
  roas: 3.4,
  revenue: 5610,
};

const campaignData = [
  { name: "Spring Collection Launch", platform: "Meta", status: "active", spend: 1200, impressions: 342000, clicks: 7200, ctr: 2.11, conversions: 186, roas: 5.2 },
  { name: "Retargeting - Cart Abandon", platform: "Meta", status: "active", spend: 800, impressions: 198000, clicks: 5400, ctr: 2.73, conversions: 142, roas: 6.1 },
  { name: "Brand Awareness", platform: "Meta", status: "active", spend: 1200, impressions: 352000, clicks: 5800, ctr: 1.65, conversions: 158, roas: 3.8 },
  { name: "Product Showcase", platform: "TikTok", status: "active", spend: 900, impressions: 312000, clicks: 7800, ctr: 2.50, conversions: 198, roas: 3.8 },
  { name: "UGC Campaign", platform: "TikTok", status: "active", spend: 450, impressions: 156000, clicks: 3200, ctr: 2.05, conversions: 72, roas: 2.7 },
  { name: "Spark Ads - Influencer", platform: "TikTok", status: "paused", spend: 300, impressions: 96000, clicks: 1800, ctr: 1.88, conversions: 42, roas: 2.4 },
];

const adSpendTrend = [
  { week: "S1 Feb", meta: 780, tiktok: 380, conversions: 95 },
  { week: "S2 Feb", meta: 820, tiktok: 410, conversions: 108 },
  { week: "S3 Feb", meta: 790, tiktok: 420, conversions: 112 },
  { week: "S4 Feb", meta: 810, tiktok: 440, conversions: 118 },
  { week: "S1 Mar", meta: 850, tiktok: 460, conversions: 128 },
  { week: "S2 Mar", meta: 880, tiktok: 480, conversions: 135 },
  { week: "S3 Mar", meta: 870, tiktok: 470, conversions: 142 },
];

// Competitor Data
const competitors = [
  { name: "Brand-ul Tau", followers_fb: 45200, followers_ig: 52300, followers_tt: 30345, engagement: 5.4, posts_week: 12, growth: 3.2, isYou: true },
  { name: "Competitor A", followers_fb: 68400, followers_ig: 89200, followers_tt: 45600, engagement: 3.8, posts_week: 15, growth: 1.8, isYou: false },
  { name: "Competitor B", followers_fb: 32100, followers_ig: 41500, followers_tt: 52800, engagement: 6.2, posts_week: 18, growth: 5.1, isYou: false },
  { name: "Competitor C", followers_fb: 55800, followers_ig: 62300, followers_tt: 28400, engagement: 4.1, posts_week: 10, growth: 2.4, isYou: false },
];

const competitorRadar = [
  { metric: "Followers", you: 85, compA: 95, compB: 70, compC: 80 },
  { metric: "Engagement", you: 88, compA: 62, compB: 95, compC: 68 },
  { metric: "Reach", you: 78, compA: 85, compB: 72, compC: 75 },
  { metric: "Content Freq.", you: 70, compA: 82, compB: 95, compC: 58 },
  { metric: "Growth Rate", you: 75, compA: 55, compB: 92, compC: 65 },
  { metric: "Ad Presence", you: 80, compA: 90, compB: 60, compC: 72 },
];

// Content Calendar
const contentCalendar = [
  { date: "18 Mar", platform: "instagram", type: "Reel", title: "Tutorial - Spring Look", status: "scheduled", time: "10:00" },
  { date: "18 Mar", platform: "tiktok", type: "Video", title: "Trend Challenge #SpringVibes", status: "scheduled", time: "14:00" },
  { date: "18 Mar", platform: "facebook", type: "Post", title: "Blog share - Ghid primavara", status: "published", time: "09:00" },
  { date: "19 Mar", platform: "instagram", type: "Story", title: "Q&A Session cu echipa", status: "draft", time: "11:00" },
  { date: "19 Mar", platform: "instagram", type: "Carousel", title: "Top 5 produse martie", status: "draft", time: "16:00" },
  { date: "19 Mar", platform: "tiktok", type: "Video", title: "Behind the scenes - Sedinta foto", status: "scheduled", time: "12:00" },
  { date: "20 Mar", platform: "facebook", type: "Video", title: "Live Q&A - Lansare noua", status: "draft", time: "18:00" },
  { date: "20 Mar", platform: "instagram", type: "Reel", title: "Unboxing - Colectia noua", status: "scheduled", time: "13:00" },
  { date: "20 Mar", platform: "tiktok", type: "Video", title: "Raspundem la comentarii #2", status: "draft", time: "15:00" },
  { date: "21 Mar", platform: "instagram", type: "Post", title: "Testimonial client", status: "draft", time: "10:00" },
  { date: "21 Mar", platform: "facebook", type: "Post", title: "Oferta weeked - 20% reducere", status: "draft", time: "09:00" },
];

const alerts = [
  { type: "spike", message: "Engagement spike +240% pe TikTok - video viral detectat", time: "1h", severity: "info" },
  { type: "warning", message: "3 comentarii negative neadresate pe Facebook", time: "2h", severity: "warning" },
  { type: "milestone", message: "Instagram a depasit 52K followers!", time: "5h", severity: "success" },
  { type: "ad", message: "Campaign 'Retargeting' - ROAS scazut sub 3.0 pe TikTok", time: "8h", severity: "warning" },
  { type: "competitor", message: "Competitor B a lansat o campanie agresiva pe TikTok", time: "12h", severity: "info" },
];

// ═══════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════

const formatNum = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const KPICard = ({ title, value, growth, icon: Icon, color, prefix = "", suffix = "" }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: color + "15" }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">
      {prefix}{typeof value === "number" ? formatNum(value) : value}{suffix}
    </div>
    <div className={`flex items-center text-sm ${growth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
      {growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      <span className="font-medium ml-1">{Math.abs(growth)}%</span>
      <span className="text-gray-400 ml-1">vs luna trecuta</span>
    </div>
  </div>
);

const PlatformBadge = ({ platform }) => {
  const colors = { facebook: "#1877F2", instagram: "#E4405F", tiktok: "#000000" };
  const labels = { facebook: "FB", instagram: "IG", tiktok: "TT" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: colors[platform] }}>
      {labels[platform]}
    </span>
  );
};

const SentimentDot = ({ sentiment }) => {
  const colors = { positive: "#10b981", neutral: "#f59e0b", negative: "#ef4444" };
  return <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: colors[sentiment] }} />;
};

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-100 text-emerald-700",
    paused: "bg-amber-100 text-amber-700",
    published: "bg-blue-100 text-blue-700",
    scheduled: "bg-purple-100 text-purple-700",
    draft: "bg-gray-100 text-gray-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const ContentIcon = ({ type }) => {
  const icons = { video: Video, reel: Video, image: Image, carousel: Layers, story: Clock, link: ExternalLink, post: MessageCircle };
  const IconComp = icons[type.toLowerCase()] || MessageCircle;
  return <IconComp size={14} className="text-gray-400" />;
};

// ═══════════════════════════════════════════
// TAB SECTIONS
// ═══════════════════════════════════════════

const OverviewTab = () => (
  <div className="space-y-6">
    {/* KPI Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard title="Total Followers" value={kpiData.totalFollowers} growth={kpiData.followersGrowth} icon={Users} color="#6366f1" />
      <KPICard title="Engagement Total" value={kpiData.totalEngagement} growth={kpiData.engagementGrowth} icon={Heart} color="#ec4899" />
      <KPICard title="Reach Total" value={kpiData.totalReach} growth={kpiData.reachGrowth} icon={Eye} color="#8b5cf6" />
      <KPICard title="Impressions" value={kpiData.totalImpressions} growth={kpiData.impressionsGrowth} icon={Activity} color="#06b6d4" />
      <KPICard title="Ad Spend" value={kpiData.adSpend} growth={kpiData.adSpendGrowth} icon={DollarSign} color="#f59e0b" prefix="€" />
      <KPICard title="ROAS Global" value={kpiData.roas} growth={kpiData.roasGrowth} icon={Target} color="#10b981" suffix="x" />
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Followers Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Evolutie Followers</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="facebook" stackId="1" stroke="#1877F2" fill="#1877F2" fillOpacity={0.3} name="Facebook" />
            <Area type="monotone" dataKey="instagram" stackId="1" stroke="#E4405F" fill="#E4405F" fillOpacity={0.3} name="Instagram" />
            <Area type="monotone" dataKey="tiktok" stackId="1" stroke="#000" fill="#000" fillOpacity={0.15} name="TikTok" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Engagement */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Engagement Saptamanal</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyEngagement}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#ec4899" name="Likes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comments" fill="#8b5cf6" name="Comentarii" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shares" fill="#06b6d4" name="Shares" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Platform Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(platformStats).map(([platform, stats]) => (
        <div key={platform} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stats.color + "15" }}>
              <Globe size={20} style={{ color: stats.color }} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 capitalize">{platform}</h4>
              <span className="text-xs text-gray-400">{stats.posts} postari luna aceasta</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-xs text-gray-400">Followers</span><p className="font-bold text-gray-800">{formatNum(stats.followers)}</p></div>
            <div><span className="text-xs text-gray-400">Engagement</span><p className="font-bold text-gray-800">{stats.engagement}%</p></div>
            <div><span className="text-xs text-gray-400">Likes</span><p className="font-bold text-gray-800">{formatNum(stats.likes)}</p></div>
            <div><span className="text-xs text-gray-400">Comentarii</span><p className="font-bold text-gray-800">{formatNum(stats.comments)}</p></div>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Comments & Alerts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Comments Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Comentarii Recente</h3>
          <span className="text-xs text-gray-400">{recentComments.length} noi</span>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentComments.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <PlatformBadge platform={c.platform} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-800">{c.user}</span>
                  <SentimentDot sentiment={c.sentiment} />
                  <span className="text-xs text-gray-400 ml-auto">{c.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 truncate">{c.text}</p>
                <span className="text-xs text-gray-400">pe: {c.post}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Alerte & Notificari</h3>
          <Bell size={18} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {alerts.map((a, i) => {
            const sevColors = { info: "border-blue-400 bg-blue-50", warning: "border-amber-400 bg-amber-50", success: "border-emerald-400 bg-emerald-50" };
            const icons = { info: Zap, warning: AlertTriangle, success: Star };
            const IconA = icons[a.severity];
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${sevColors[a.severity]}`}>
                <IconA size={18} className={a.severity === "warning" ? "text-amber-500" : a.severity === "success" ? "text-emerald-500" : "text-blue-500"} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.message}</p>
                  <span className="text-xs text-gray-400">{a.time} in urma</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

const PlatformTab = ({ platform }) => {
  const stats = platformStats[platform];
  const posts = topPosts[platform];
  const platformComments = recentComments.filter(c => c.platform === platform);

  const engagementByType = [
    { name: "Likes", value: stats.likes, color: "#ec4899" },
    { name: "Comentarii", value: stats.comments, color: "#8b5cf6" },
    { name: "Shares", value: stats.shares, color: "#06b6d4" },
  ];

  const dailyData = [
    { day: "L", reach: Math.floor(stats.reach / 7 * 0.85), engagement: Math.floor(stats.likes / 7 * 0.9) },
    { day: "Ma", reach: Math.floor(stats.reach / 7 * 0.92), engagement: Math.floor(stats.likes / 7 * 0.95) },
    { day: "Mi", reach: Math.floor(stats.reach / 7 * 1.1), engagement: Math.floor(stats.likes / 7 * 1.15) },
    { day: "J", reach: Math.floor(stats.reach / 7 * 0.88), engagement: Math.floor(stats.likes / 7 * 0.87) },
    { day: "V", reach: Math.floor(stats.reach / 7 * 1.2), engagement: Math.floor(stats.likes / 7 * 1.25) },
    { day: "S", reach: Math.floor(stats.reach / 7 * 1.35), engagement: Math.floor(stats.likes / 7 * 1.4) },
    { day: "D", reach: Math.floor(stats.reach / 7 * 1.15), engagement: Math.floor(stats.likes / 7 * 1.2) },
  ];

  return (
    <div className="space-y-6">
      {/* Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard title="Followers" value={stats.followers} growth={3.2} icon={Users} color={stats.color} />
        <KPICard title="Engagement Rate" value={stats.engagement} growth={1.5} icon={Heart} color="#ec4899" suffix="%" />
        <KPICard title="Reach" value={stats.reach} growth={8.3} icon={Eye} color="#8b5cf6" />
        <KPICard title="Likes" value={stats.likes} growth={5.2} icon={ThumbsUp} color="#f59e0b" />
        <KPICard title="Comentarii" value={stats.comments} growth={12.1} icon={MessageCircle} color="#06b6d4" />
        <KPICard title="Shares" value={stats.shares} growth={7.8} icon={Share2} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Performanta Zilnica (Ultimele 7 zile)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reach" stroke={stats.color} strokeWidth={2} name="Reach" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={2} name="Engagement" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Distributie Engagement</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={engagementByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {engagementByType.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {engagementByType.map((e, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-xs text-gray-500">{e.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Top Postari</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Tip</th>
                <th className="pb-3 font-medium">Continut</th>
                <th className="pb-3 font-medium text-right">Likes</th>
                <th className="pb-3 font-medium text-right">Comentarii</th>
                <th className="pb-3 font-medium text-right">Shares</th>
                <th className="pb-3 font-medium text-right">Reach</th>
                <th className="pb-3 font-medium text-right">Data</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3"><ContentIcon type={p.type} /></td>
                  <td className="py-3 font-medium text-gray-700 max-w-xs truncate">{p.content}</td>
                  <td className="py-3 text-right text-gray-600">{formatNum(p.likes)}</td>
                  <td className="py-3 text-right text-gray-600">{formatNum(p.comments)}</td>
                  <td className="py-3 text-right text-gray-600">{formatNum(p.shares)}</td>
                  <td className="py-3 text-right text-gray-600">{formatNum(p.reach)}</td>
                  <td className="py-3 text-right text-gray-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Comments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Comentarii Recente - {platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
        <div className="space-y-3">
          {platformComments.length > 0 ? platformComments.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <SentimentDot sentiment={c.sentiment} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{c.user}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
              </div>
            </div>
          )) : <p className="text-sm text-gray-400">Nu sunt comentarii noi.</p>}
        </div>
      </div>
    </div>
  );
};

const AdsTab = () => (
  <div className="space-y-6">
    {/* Ads Summary */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Meta Ads */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center"><span className="text-xs font-bold text-blue-600">M</span></div>
          Meta Ads (Facebook + Instagram)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div><span className="text-xs text-gray-400">Spend</span><p className="font-bold text-lg">€{metaAdsData.totalSpend.toLocaleString()}</p></div>
          <div><span className="text-xs text-gray-400">ROAS</span><p className="font-bold text-lg text-emerald-600">{metaAdsData.roas}x</p></div>
          <div><span className="text-xs text-gray-400">Revenue</span><p className="font-bold text-lg">€{metaAdsData.revenue.toLocaleString()}</p></div>
          <div><span className="text-xs text-gray-400">CTR</span><p className="font-bold">{metaAdsData.ctr}%</p></div>
          <div><span className="text-xs text-gray-400">CPC</span><p className="font-bold">€{metaAdsData.cpc}</p></div>
          <div><span className="text-xs text-gray-400">CPM</span><p className="font-bold">€{metaAdsData.cpm}</p></div>
          <div><span className="text-xs text-gray-400">Clicks</span><p className="font-bold">{formatNum(metaAdsData.clicks)}</p></div>
          <div><span className="text-xs text-gray-400">Conversii</span><p className="font-bold">{metaAdsData.conversions}</p></div>
          <div><span className="text-xs text-gray-400">Cost/Conv.</span><p className="font-bold">€{metaAdsData.costPerConversion}</p></div>
        </div>
      </div>

      {/* TikTok Ads */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-gray-800">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"><span className="text-xs font-bold text-gray-800">TT</span></div>
          TikTok Ads
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div><span className="text-xs text-gray-400">Spend</span><p className="font-bold text-lg">€{tiktokAdsData.totalSpend.toLocaleString()}</p></div>
          <div><span className="text-xs text-gray-400">ROAS</span><p className="font-bold text-lg text-emerald-600">{tiktokAdsData.roas}x</p></div>
          <div><span className="text-xs text-gray-400">Revenue</span><p className="font-bold text-lg">€{tiktokAdsData.revenue.toLocaleString()}</p></div>
          <div><span className="text-xs text-gray-400">CTR</span><p className="font-bold">{tiktokAdsData.ctr}%</p></div>
          <div><span className="text-xs text-gray-400">CPC</span><p className="font-bold">€{tiktokAdsData.cpc}</p></div>
          <div><span className="text-xs text-gray-400">CPM</span><p className="font-bold">€{tiktokAdsData.cpm}</p></div>
          <div><span className="text-xs text-gray-400">Clicks</span><p className="font-bold">{formatNum(tiktokAdsData.clicks)}</p></div>
          <div><span className="text-xs text-gray-400">Conversii</span><p className="font-bold">{tiktokAdsData.conversions}</p></div>
          <div><span className="text-xs text-gray-400">Cost/Conv.</span><p className="font-bold">€{tiktokAdsData.costPerConversion}</p></div>
        </div>
      </div>
    </div>

    {/* Ad Spend Trend */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Trend Spend & Conversii</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={adSpendTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="meta" fill="#1877F2" name="Meta Spend (€)" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="tiktok" fill="#333" name="TikTok Spend (€)" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} name="Conversii" dot={{ r: 5 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Campaigns Table */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Campanii Active</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-3 font-medium">Campanie</th>
              <th className="pb-3 font-medium">Platforma</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Spend</th>
              <th className="pb-3 font-medium text-right">Impressions</th>
              <th className="pb-3 font-medium text-right">CTR</th>
              <th className="pb-3 font-medium text-right">Conv.</th>
              <th className="pb-3 font-medium text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaignData.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-700">{c.name}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${c.platform === "Meta" ? "bg-blue-500" : "bg-gray-800"}`}>
                    {c.platform}
                  </span>
                </td>
                <td className="py-3"><StatusBadge status={c.status} /></td>
                <td className="py-3 text-right">€{c.spend}</td>
                <td className="py-3 text-right text-gray-600">{formatNum(c.impressions)}</td>
                <td className="py-3 text-right">{c.ctr}%</td>
                <td className="py-3 text-right font-medium">{c.conversions}</td>
                <td className="py-3 text-right">
                  <span className={`font-bold ${c.roas >= 4 ? "text-emerald-600" : c.roas >= 3 ? "text-amber-600" : "text-red-500"}`}>
                    {c.roas}x
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CompetitionTab = () => (
  <div className="space-y-6">
    {/* Competitor Comparison Table */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Comparatie Competitori</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-3 font-medium">Brand</th>
              <th className="pb-3 font-medium text-right">FB Followers</th>
              <th className="pb-3 font-medium text-right">IG Followers</th>
              <th className="pb-3 font-medium text-right">TT Followers</th>
              <th className="pb-3 font-medium text-right">Engagement</th>
              <th className="pb-3 font-medium text-right">Post/sapt</th>
              <th className="pb-3 font-medium text-right">Growth</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className={`border-b border-gray-50 ${c.isYou ? "bg-indigo-50 font-semibold" : "hover:bg-gray-50"}`}>
                <td className="py-3 text-gray-700 flex items-center gap-2">
                  {c.isYou && <Star size={14} className="text-indigo-500" />}
                  {c.name}
                </td>
                <td className="py-3 text-right">{formatNum(c.followers_fb)}</td>
                <td className="py-3 text-right">{formatNum(c.followers_ig)}</td>
                <td className="py-3 text-right">{formatNum(c.followers_tt)}</td>
                <td className="py-3 text-right">{c.engagement}%</td>
                <td className="py-3 text-right">{c.posts_week}</td>
                <td className="py-3 text-right">
                  <span className={c.growth >= 3 ? "text-emerald-600" : "text-gray-600"}>+{c.growth}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Comparatie Radar</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={competitorRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Tu" dataKey="you" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
            <Radar name="Comp. A" dataKey="compA" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
            <Radar name="Comp. B" dataKey="compB" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            <Radar name="Comp. C" dataKey="compC" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Followers Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Total Followers per Platforma</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={competitors} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="followers_fb" fill="#1877F2" name="Facebook" radius={[0, 4, 4, 0]} />
            <Bar dataKey="followers_ig" fill="#E4405F" name="Instagram" radius={[0, 4, 4, 0]} />
            <Bar dataKey="followers_tt" fill="#333" name="TikTok" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Insights */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Insights Competitie</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <h4 className="font-semibold text-emerald-800 text-sm mb-1">Avantajul Tau</h4>
          <p className="text-sm text-emerald-700">Engagement rate mai mare decat Competitor A (+1.6%) si C (+1.3%). Continutul tau rezoneaza mai bine cu audienta.</p>
        </div>
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
          <h4 className="font-semibold text-amber-800 text-sm mb-1">Oportunitate</h4>
          <p className="text-sm text-amber-700">Competitor B creste rapid pe TikTok (+5.1%). Considera cresterea frecventei de postare pe aceasta platforma.</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">Threat</h4>
          <p className="text-sm text-blue-700">Competitor A domina pe Instagram cu 89.2K followers. Focus pe Reels si colaborari cu influenceri pentru a reduce gap-ul.</p>
        </div>
      </div>
    </div>
  </div>
);

const CalendarTab = () => {
  const dates = [...new Set(contentCalendar.map(c => c.date))];
  return (
    <div className="space-y-6">
      {/* Calendar Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <Calendar size={24} className="text-indigo-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{contentCalendar.length}</p>
          <p className="text-xs text-gray-400">Postari planificate</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <Send size={24} className="text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{contentCalendar.filter(c => c.status === "published").length}</p>
          <p className="text-xs text-gray-400">Publicate</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <Clock size={24} className="text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{contentCalendar.filter(c => c.status === "scheduled").length}</p>
          <p className="text-xs text-gray-400">Programate</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <Bookmark size={24} className="text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{contentCalendar.filter(c => c.status === "draft").length}</p>
          <p className="text-xs text-gray-400">Draft-uri</p>
        </div>
      </div>

      {/* Calendar Grid */}
      {dates.map(date => (
        <div key={date} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            {date} 2026
          </h3>
          <div className="space-y-3">
            {contentCalendar.filter(c => c.date === date).map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-mono text-gray-400 w-12">{item.time}</span>
                <PlatformBadge platform={item.platform} />
                <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-medium">{item.type}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">{item.title}</span>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Content Mix */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Mix Continut Planificat</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Video/Reel", value: contentCalendar.filter(c => ["Video", "Reel"].includes(c.type)).length, color: "#6366f1" },
                { name: "Post/Story", value: contentCalendar.filter(c => ["Post", "Story"].includes(c.type)).length, color: "#ec4899" },
                { name: "Carousel", value: contentCalendar.filter(c => c.type === "Carousel").length, color: "#f59e0b" },
              ]}
              cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
            >
              {[{ color: "#6366f1" }, { color: "#ec4899" }, { color: "#f59e0b" }].map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "facebook", label: "Facebook", icon: Globe },
  { id: "instagram", label: "Instagram", icon: Heart },
  { id: "tiktok", label: "TikTok", icon: Play },
  { id: "ads", label: "Ads Performance", icon: Target },
  { id: "competition", label: "Competitie", icon: Award },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export default function SocialMediaDashboard() {

  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const r = await fetch(MAKE_WEBHOOK_URL);
        if (r.ok) { const d = await r.json(); setLiveData(d); }
      } catch(e) { console.log("Demo mode"); }
      finally { setLoading(false); }
    }
    fetchDashboardData();
  }, []);
  const liveKpi = liveData?.kpi || kpiData;
  const livePlatforms = liveData?.platform_stats || platformStats;
  const liveTrend = liveData?.monthly_trend || monthlyTrend;
  const liveWeekly = liveData?.weekly_engagement || weeklyEngagement;
  const livePosts = liveData?.top_posts || topPosts;
  const liveComments = liveData?.recent_comments || recentComments;
  const liveMeta = liveData?.meta_ads || metaAdsData;
  const liveTiktok = liveData?.tiktok_ads || tiktokAdsData;
  const liveCamps = liveData?.campaigns || campaignData;
  const liveSpend = liveData?.ad_spend_trend || adSpendTrend;
  const liveComps = liveData?.competitors || competitors;
  const liveCal = liveData?.calendar || contentCalendar;
  const liveAlerts = liveData?.alerts || alerts;
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("30d");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity size={24} className="text-indigo-600" />
                Social Media Command Center
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">Dashboard complet · Facebook · Instagram · TikTok</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7d">Ultimele 7 zile</option>
                <option value="30d">Ultimele 30 zile</option>
                <option value="90d">Ultimele 90 zile</option>
              </select>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "facebook" && <PlatformTab platform="facebook" />}
        {activeTab === "instagram" && <PlatformTab platform="instagram" />}
        {activeTab === "tiktok" && <PlatformTab platform="tiktok" />}
        {activeTab === "ads" && <AdsTab />}
        {activeTab === "competition" && <CompetitionTab />}
        {activeTab === "calendar" && <CalendarTab />}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <p className="text-xs text-gray-400">Social Media Dashboard · Marmorex · Ultimul update: 18 Mar 2026, 10:30</p>
      </div>
    </div>
  );
}


