import React, { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Trash2,
  MoreVertical,
  Edit,
  Eye,
  Trash,
  Ban,
  Copy,
  FlaskConical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// IVR Flow data
const ivrFlows = [
  {
    id: 1,
    name: "Main Menu IVR",
    description: "Primary customer entry point",
    nodes: 12,
    status: "Published",
    modified: "Apr 10, 2025, 09:00 PM",
  },
  {
    id: 2,
    name: "Technical Support IVR",
    description: "Technical support troubleshooting flow",
    nodes: 8,
    status: "Draft",
    modified: "Apr 8, 2025, 04:50 PM",
  },
  {
    id: 3,
    name: "Billing Department IVR",
    description: "Payment and billing inquiries",
    nodes: 6,
    status: "Published",
    modified: "Apr 5, 2025, 03:15 PM",
  },
  {
    id: 4,
    name: "After Hours IVR",
    description: "Non-business hours call handling",
    nodes: 5,
    status: "Published",
    modified: "Apr 1, 2025, 09:45 PM",
  },
  {
    id: 5,
    name: "Sales Department IVR",
    description: "New sales and product inquiries",
    nodes: 9,
    status: "Draft",
    modified: "Mar 28, 2025, 07:50 PM",
  },
];

// Template data
const templates = [
  {
    id: 1,
    title: "Simple Customer Support",
    description: "Basic support flow with 3 options",
    nodes: 4,
    complexity: "Simple",
  },
  {
    id: 2,
    title: "Advanced Technical Support",
    description: "Detailed troubleshooting with escalation paths",
    nodes: 10,
    complexity: "Complex",
  },
  {
    id: 3,
    title: "Payment Processing",
    description: "Handle payment issues and billing inquiries",
    nodes: 7,
    complexity: "Medium",
  },
  {
    id: 4,
    title: "Holiday Schedule",
    description: "Special routing for holidays and closures",
    nodes: 3,
    complexity: "Simple",
  },
];

// Tabs components
const TabsList = ({ children }) => (
  <div className="flex border-b border-gray-200">{children}</div>
);

const TabsTrigger = ({ children, value, activeValue, onValueChange }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      value === activeValue
        ? "bg-white text-gray-900 border-b-2 border-blue-500"
        : "text-gray-500 hover:text-gray-700"
    }`}
    onClick={() => onValueChange(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeValue }) => (
  <div className={value === activeValue ? "block" : "hidden"}>{children}</div>
);

// Status Badge component
const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-blue-500 text-white",
    Draft: "bg-gray-500 text-white",
  };

  return (
    <span
      className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${styles[status]}`}
    >
      {status}
    </span>
  );
};

// Complexity Badge component
const ComplexityBadge = ({ complexity }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {complexity}
    </span>
  );
};

// IVR Flow Card component
const IvrFlowCard = ({ flow }) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 w-full">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-gray-900">{flow.name}</h3>
          <StatusBadge status={flow.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 leading-snug">
          {flow.description}
        </p>

        {/* Nodes and Modified Date */}
        <div className="text-sm text-gray-500 flex gap-6">
          <div>Nodes: {flow.nodes}</div>
          <div>Modified: {flow.modified}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Action buttons */}
      <div className="flex border-t border-gray-200 rounded-b-xl overflow-hidden">
        <button className="flex-1 flex items-center justify-center py-3 px-8 text-sm text-gray-700 hover:bg-gray-50 font-medium border-r border-gray-200 cursor-pointer">
          <Edit size={16} className="mr-1" />
          Edit
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-12 flex items-center justify-center hover:bg-gray-50 text-gray-700 cursor-pointer">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => console.log("Test clicked")}>
              <FlaskConical size={14} className="mr-2" />
              Test
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Duplicate clicked")}>
              <Copy size={14} className="mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => console.log("Delete clicked")}
            >
              <Trash size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// Template Card component
const TemplateCard = ({ template }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{template.title}</h3>
        <ComplexityBadge complexity={template.complexity} />
      </div>
      <p className="text-sm text-gray-600 mb-4">{template.description}</p>

      <div className="flex text-sm text-gray-500 items-center">
        <Phone size={16} className="mr-1" />
        <span>{template.nodes} Nodes</span>
      </div>
    </div>

    <div className="flex border-t border-gray-200 rounded-b-xl overflow-hidden">
      <button className="flex-1 py-3 text-white bg-blue-500 font-medium text-sm hover:bg-blue-600 cursor-pointer">
        Use Template
      </button>
      <button className="w-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 bg-white cursor-pointer">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

const IvrBuilderPage = () => {
  const [activeTab, setActiveTab] = useState("flows");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-1">IVR Builder</h1>
      <p className="text-sm text-gray-500 mb-6">
        Create and manage interactive voice response flows
      </p>

      {/* Toolbar Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto flex-grow">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search IVR flows..."
            className="pl-10 w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New IVR Flow
        </button>
      </div>

      {/* Tabs Section */}
      <TabsList>
        <TabsTrigger
          value="flows"
          activeValue={activeTab}
          onValueChange={setActiveTab}
        >
          IVR Flows
        </TabsTrigger>
        <TabsTrigger
          value="templates"
          activeValue={activeTab}
          onValueChange={setActiveTab}
        >
          Templates
        </TabsTrigger>
      </TabsList>

      {/* Content Section */}
      <div className="mt-6">
        {/* IVR Flows Content */}
        <TabsContent value="flows" activeValue={activeTab}>
          <h2 className="text-lg font-semibold mb-1">IVR Flows</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage your interactive voice response flows
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ivrFlows.map((flow) => (
              <IvrFlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        </TabsContent>

        {/* Templates Content */}
        <TabsContent value="templates" activeValue={activeTab}>
          <h2 className="text-lg font-semibold mb-1">IVR Templates</h2>
          <p className="text-sm text-gray-500 mb-4">
            Start with a pre-built template for common scenarios
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default IvrBuilderPage;
