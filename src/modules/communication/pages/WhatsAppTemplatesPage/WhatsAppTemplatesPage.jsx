import React from "react";
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Trash2,
  Pencil,
  Phone,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Mock data for WhatsApp templates
const templates = [
  {
    id: 1,
    name: "Appointment Reminder",
    category: "Utility",
    status: "Approved",
    language: "English",
    variables: 2,
    created: "Mar 10, 2025",
  },
  {
    id: 2,
    name: "Order Status Update",
    category: "Utility",
    status: "Approved",
    language: "English",
    variables: 3,
    created: "Mar 15, 2025",
  },
  {
    id: 3,
    name: "Payment Confirmation",
    category: "Utility",
    status: "Pending",
    language: "English",
    variables: 4,
    created: "Apr 5, 2025",
  },
  {
    id: 4,
    name: "Welcome Message",
    category: "Marketing",
    status: "Rejected",
    language: "English",
    variables: 1,
    created: "Apr 8, 2025",
  },
  {
    id: 5,
    name: "Servicio al Cliente",
    category: "Customer Service",
    status: "Approved",
    language: "Spanish",
    variables: 2,
    created: "Mar 28, 2025",
  },
];

// Custom UI Components
const Input = ({ className, ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Button = ({ children, className, variant, size, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantStyles =
    variant === "ghost"
      ? "hover:bg-gray-100 hover:text-gray-900 border-transparent"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeStyles = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-4 py-2";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Helper function for status styling and icons
const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />,
        badgeColor: "bg-blue-500",
      };
    case "Pending":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: <Clock className="h-4 w-4 text-yellow-600 mr-1" />,
        badgeColor: "bg-gray-500",
      };
    case "Rejected":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: <XCircle className="h-4 w-4 text-red-600 mr-1" />,
        badgeColor: "bg-red-500",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: null,
        badgeColor: "bg-gray-500",
      };
  }
};

export default function WhatsAppTemplatesPage() {
  const [activeTab, setActiveTab] = React.useState("all templates");

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* {/ Page Header /} */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">WhatsApp Templates</h1>
        <p className="text-sm text-gray-500">
          Manage message templates for WhatsApp Business API
        </p>
      </div>

      {/* {/ Toolbar Section /} */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-10 w-full"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> New Template
        </Button>
      </div>

      {/* {/ Tabs Section /} */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["All Templates", "Approved", "Pending", "Rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* {/ Tab Content /} */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">WhatsApp Templates</h2>
          <p className="text-sm text-gray-500">
            Manage message templates for WhatsApp Business communication
          </p>
        </div>

        {/* {/ Table /} */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Name
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Category
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Status
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Language
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Variables
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Created
                </th>
                <th className="text-xs text-gray-500 uppercase py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => {
                const statusStyle = getStatusBadge(template.status);

                return (
                  <tr key={template.id} className="border-b last:border-b-0">
                    <td className="py-4 px-4 font-medium">{template.name}</td>
                    <td className="py-4 px-4">{template.category}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-row items-center">
                        {statusStyle.icon}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusStyle.badgeColor}`}
                        >
                          {template.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{template.language}</td>
                    <td className="py-4 px-4">{template.variables}</td>
                    <td className="py-4 px-4">{template.created}</td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleView(row.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(row.id)}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDisable(row.id)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
