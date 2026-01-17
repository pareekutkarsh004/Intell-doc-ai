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
  Table,
  Download,
  Copy,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Extraction = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("paper1");

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Upload, label: "Upload Paper", path: "/upload" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: FolderOpen, label: "Library", path: "/library" },
    { icon: BarChart3, label: "Data Extraction", path: "/extraction" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const extractedTables = [
    {
      id: "table1",
      name: "Table 1: Reaction Kinetics Parameters",
      rows: [
        ["Parameter", "Value", "Unit", "Source"],
        ["Activation Energy", "72.5 ± 2.3", "kJ/mol", "Experimental"],
        ["Pre-exponential Factor", "3.2 × 10⁸", "s⁻¹", "Calculated"],
        ["Reaction Order", "1.0", "-", "Fitted"],
        ["Rate Constant (350°C)", "4.7 × 10⁻³", "s⁻¹", "Experimental"],
      ],
      confidence: 98,
    },
    {
      id: "table2",
      name: "Table 2: Catalyst Performance Comparison",
      rows: [
        ["Catalyst", "Conversion (%)", "Selectivity (%)", "Yield (%)"],
        ["Ni/Al₂O₃", "95.2", "87.3", "83.1"],
        ["Co/SiO₂", "89.7", "91.2", "81.8"],
        ["Fe/ZrO₂", "78.4", "94.6", "74.2"],
        ["Cu/TiO₂", "82.1", "89.5", "73.5"],
      ],
      confidence: 95,
    },
  ];

  const extractedFigures = [
    {
      id: "fig1",
      name: "Figure 3: Temperature vs Conversion Rate",
      description: "Shows the relationship between reaction temperature and conversion efficiency",
      dataPoints: 24,
    },
    {
      id: "fig2",
      name: "Figure 5: Arrhenius Plot",
      description: "Linear fit for activation energy determination",
      dataPoints: 12,
    },
  ];

  const keyValues = [
    { label: "Optimal Temperature", value: "350°C", confidence: 99, verified: true },
    { label: "Maximum Conversion", value: "95.2%", confidence: 98, verified: true },
    { label: "Catalyst Loading", value: "15 wt%", confidence: 96, verified: true },
    { label: "Reaction Time", value: "2.5 hours", confidence: 94, verified: false },
    { label: "Pressure", value: "2.5 MPa", confidence: 97, verified: true },
    { label: "WHSV", value: "0.8 h⁻¹", confidence: 92, verified: false },
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

        {/* Extraction Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Data Extraction
              </h1>
              <p className="text-muted-foreground">
                Extract and verify data from your research papers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPaper} onValueChange={setSelectedPaper}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Select a paper" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper1">Catalytic Conversion of Biomass...</SelectItem>
                  <SelectItem value="paper2">Thermodynamic Properties of Ionic Liquids...</SelectItem>
                  <SelectItem value="paper3">Process Optimization in Distillation...</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gradient-bg text-white">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Key Values */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Key Extracted Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyValues.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/30 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-xl font-semibold">{item.value}</p>
                    </div>
                    <div className="text-right">
                      {item.verified ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mb-1 ml-auto" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mb-1 ml-auto" />
                      )}
                      <span className="text-xs text-muted-foreground">{item.confidence}% conf.</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Tables and Figures */}
          <Tabs defaultValue="tables" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tables" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                Tables ({extractedTables.length})
              </TabsTrigger>
              <TabsTrigger value="figures" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Figures ({extractedFigures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tables" className="space-y-4">
              {extractedTables.map((table) => (
                <Card key={table.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{table.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confidence: {table.confidence}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-border rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-muted/50">
                            {table.rows[0].map((cell, index) => (
                              <th
                                key={index}
                                className="text-left p-3 text-sm font-semibold border-b border-border"
                              >
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.slice(1).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="p-3 text-sm border-b border-border"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="figures" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {extractedFigures.map((figure) => (
                  <Card key={figure.id}>
                    <CardContent className="p-6">
                      <div className="aspect-video bg-muted/30 rounded-xl mb-4 flex items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">{figure.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {figure.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {figure.dataPoints} data points extracted
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Accuracy Notice */}
          <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Data Verification
            </h3>
            <p className="text-sm text-muted-foreground">
              All extracted data is cross-referenced with the original document. Values with{" "}
              <CheckCircle2 className="w-4 h-4 text-green-600 inline" /> have been verified
              against multiple sources. Values with{" "}
              <AlertCircle className="w-4 h-4 text-yellow-600 inline" /> require manual
              verification. Always cross-check critical values with the original paper.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Extraction;
