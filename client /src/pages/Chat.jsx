import { useState, useRef, useEffect } from "react";
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
  Send,
  Bot,
  User,
  Paperclip,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chat = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Removed <Message[]> type annotation
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your IntelliDoc AI assistant. I can help you analyze your research papers, extract data, and answer questions with citations. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  
  // Removed <HTMLDivElement> type annotation
  const messagesEndRef = useRef(null);

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Upload, label: "Upload Paper", path: "/upload" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: FolderOpen, label: "Library", path: "/library" },
    { icon: BarChart3, label: "Data Extraction", path: "/extraction" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const suggestedQuestions = [
    "What are the key findings of my latest paper?",
    "Extract all numerical data from Table 3",
    "Compare the reaction rates across studies",
    "Summarize the methodology section",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Removed Message type annotation
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your uploaded research papers, I found relevant information regarding "${inputValue}".\n\nThe catalytic conversion process shows a 95.2% efficiency rate at 350°C, with the primary reaction products being ethylene (42.3%) and propylene (31.7%). This data is consistent with findings from Chen et al. (2024) in their thermodynamic analysis.\n\nKey parameters extracted:\n• Temperature: 350°C\n• Pressure: 2.5 MPa\n• Catalyst loading: 15 wt%\n• Conversion rate: 95.2%`,
        timestamp: new Date(),
        citations: ["Chen et al., 2024, J. Chem. Eng., p.145-152", "Smith & Johnson, 2023, AIChE Journal, p.789-801"],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  // Removed React.KeyboardEvent type annotation
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3"
                        : "bg-card border border-border rounded-2xl rounded-tl-md p-4"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          📚 Citations:
                        </p>
                        <ul className="space-y-1">
                          {message.citations.map((citation, index) => (
                            <li
                              key={index}
                              className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
                            >
                              [{index + 1}] {citation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <Copy className="w-3 h-3 mr-1" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" /> Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <RotateCcw className="w-3 h-3 mr-1" /> Regenerate
                        </Button>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-md p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-muted-foreground">Analyzing your papers...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-border bg-card">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-border focus-within:border-primary transition-colors">
                <CardContent className="p-2">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <textarea
                      placeholder="Ask about your research papers..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-transparent border-0 resize-none focus:outline-none min-h-[44px] max-h-32 py-3"
                      rows={1}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="gradient-bg text-white shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-center text-muted-foreground mt-2">
                IntelliDoc AI provides citations to help verify accuracy. Always cross-reference with original sources.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;