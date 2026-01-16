import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  MessageSquare, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Upload,
  Search,
  Bell,
  ChevronRight,
  Plus,
  Clock,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Upload, label: "Upload Paper", path: "/upload" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: FolderOpen, label: "Library", path: "/library" },
    { icon: BarChart3, label: "Data Extraction", path: "/extraction" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const recentPapers = [
    { title: "Catalytic Conversion of Biomass", date: "2 hours ago", status: "analyzed" },
    { title: "Thermodynamic Properties of Ionic Liquids", date: "Yesterday", status: "analyzing" },
    { title: "Process Optimization in Distillation", date: "3 days ago", status: "analyzed" },
  ];

  const stats = [
    { label: "Papers Analyzed", value: "47", trend: "+12%", icon: FileText },
    { label: "Data Points Extracted", value: "1,284", trend: "+8%", icon: BarChart3 },
    { label: "AI Conversations", value: "156", trend: "+24%", icon: MessageSquare },
    { label: "Time Saved", value: "42h", trend: "+15%", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="p-2 gradient-bg rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            IntelliDoc AI
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4 mt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search papers, data, conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome back, Researcher!
            </h1>
            <p className="text-muted-foreground">
              Continue your research with AI-powered paper analysis
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/upload">
                    <div className="p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Upload New Paper</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop or browse to upload
                      </p>
                    </div>
                  </Link>
                  <Link to="/chat">
                    <div className="p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                      <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Start AI Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Ask questions about your papers
                      </p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Papers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Papers</CardTitle>
                <Link to="/library">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPapers.map((paper, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{paper.title}</h4>
                      <p className="text-xs text-muted-foreground">{paper.date}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        paper.status === "analyzed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {paper.status}
                    </span>
                  </div>
                ))}
                <Link to="/upload">
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Paper
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;