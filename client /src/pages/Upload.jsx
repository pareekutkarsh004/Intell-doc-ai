import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Upload as UploadIcon,
  Search,
  Bell,
  X,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Upload = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  // Removed <UploadedFile[]> generic
  const [files, setFiles] = useState([]);

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: UploadIcon, label: "Upload Paper", path: "/upload" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: FolderOpen, label: "Library", path: "/library" },
    { icon: BarChart3, label: "Data Extraction", path: "/extraction" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Removed React.DragEvent type
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Removed React.DragEvent type
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Removed React.DragEvent type
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  // Removed React.ChangeEvent<HTMLInputElement> type
  const handleFileInput = useCallback((e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  // Removed File[] type
  const processFiles = (newFiles) => {
    const uploadFiles = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Simulate upload progress
    uploadFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === file.id) {
              const newProgress = Math.min(f.progress + 10, 100);
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "processing" : "uploading",
              };
            }
            return f;
          })
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: 100, status: "complete" } : f
          )
        );
      }, 2500);
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

        {/* Upload Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Upload Research Papers
              </h1>
              <p className="text-muted-foreground">
                Upload your PDF research papers for AI-powered analysis
              </p>
            </div>

            {/* Upload Zone */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="p-4 gradient-bg rounded-2xl w-fit mx-auto mb-6">
                    <UploadIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Drag and drop your research papers here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Supports PDF, DOC, DOCX files up to 50MB each
                  </p>
                  <label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button className="gradient-bg text-white cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {file.status === "complete" ? (
                          <FileCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        {file.status !== "complete" && (
                          <Progress value={file.progress} className="h-2" />
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {file.status === "uploading" && (
                            <span className="text-xs text-muted-foreground">
                              Uploading... {file.progress}%
                            </span>
                          )}
                          {file.status === "processing" && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing with AI...
                            </span>
                          )}
                          {file.status === "complete" && (
                            <span className="text-xs text-green-600">
                              Ready for analysis
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-primary">💡</span> Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Upload high-quality PDF files with selectable text</li>
                <li>• Papers with clear tables and figures work best</li>
                <li>• You can upload multiple papers at once for batch processing</li>
                <li>• Scientific papers from major journals are optimized for extraction</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;