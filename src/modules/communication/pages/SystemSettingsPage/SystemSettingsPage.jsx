import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

const SystemSettingsPage = () => {
  // State for form fields
  const [companyName, setCompanyName] = useState("Contact Center Inc.");
  const [supportEmail, setSupportEmail] = useState("support@contactcenter.com");
  const [supportPhone, setSupportPhone] = useState("+1 (555) 123-4567");
  const [timezone, setTimezone] = useState("Eastern Time (ET)");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [systemLanguage, setSystemLanguage] = useState("English (US)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Call settings state
  const [maxQueueTime, setMaxQueueTime] = useState(300);
  const [agentWrapUpTime, setAgentWrapUpTime] = useState(60);
  const [recordAllCalls, setRecordAllCalls] = useState(true);
  const [enableTranscription, setEnableTranscription] = useState(false);
  const [afterHoursMessage, setAfterHoursMessage] = useState(
    "Thank you for calling. Our office is currently closed. Please call back during our normal business hours."
  );
  const [holidayMessage, setHolidayMessage] = useState(
    "Thank you for calling. Our office is closed for the holiday. Please call back during our normal business hours."
  );
  const [maxVoicemailLength, setMaxVoicemailLength] = useState(120);

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [missedCallAlerts, setMissedCallAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(true);
  const [reportFrequency, setReportFrequency] = useState("Weekly");

  // Active tab state
  const [activeTab, setActiveTab] = useState("general");

  // Save settings handler
  const handleSaveSettings = () => {
    console.log("Settings saved");
    // Implementation for saving settings would go here
  };

  // Clear cache handler
  const handleClearCache = () => {
    console.log("Cache cleared");
    // Implementation for clearing cache would go here
  };

  // Backup now handler
  const handleBackupNow = () => {
    console.log("Backup started");
    // Implementation for starting backup would go here
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        {/* {/ Page Header /} */}
        <h1 className="text-2xl font-bold mb-1">System Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Configure global system preferences and parameters
        </p>

        <div className=" min-h-screen p-2">
          <div className=" ">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="">
                <TabsList className="inline-flex space-x-2 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger
                    value="general"
                    className="px-4 py-2 text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition cursor-pointer"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="call-settings"
                    className="px-4 py-2 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition cursor-pointer"
                  >
                    Call Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="px-4 py-2 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition cursor-pointer"
                  >
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* General Tab Content */}
              <TabsContent value="general" className="mt-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-medium flex items-center">
                      <span className="mr-2">🌐</span>
                      General Settings
                    </h2>
                  </div>
                  <p className="text-gray-500 mb-6">
                    Configure basic system settings and preferences
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Support Email
                      </label>
                      <Input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Support Phone
                      </label>
                      <Input
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Eastern Time (ET)">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="Central Time (CT)">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="Mountain Time (MT)">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="Pacific Time (PT)">
                            Pacific Time (PT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Format
                      </label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        System Language
                      </label>
                      <Select
                        value={systemLanguage}
                        onValueChange={setSystemLanguage}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English (US)">
                            English (US)
                          </SelectItem>
                          <SelectItem value="English (UK)">
                            English (UK)
                          </SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <hr className="my-6 border-gray-200" />

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Maintenance Mode
                        </h3>
                        <p className="text-sm text-gray-500">
                          When enabled, the system will be unavailable to
                          regular users.
                        </p>
                      </div>
                      <Switch
                        checked={maintenanceMode}
                        onCheckedChange={setMaintenanceMode}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button className="flex items-center gap-2">
                      <Save size={16} />
                      Save Settings
                    </Button>
                  </div>
                </div>

                {/* System Maintenance Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-medium flex items-center">
                      <span className="mr-2">📋</span>
                      System Maintenance
                    </h2>
                  </div>
                  <p className="text-gray-500 mb-6">
                    Manage system cache and backups
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          System Cache
                        </h3>
                        <p className="text-sm text-gray-500">
                          Clear system cache to resolve performance issues
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="rotate-90"
                        >
                          <path
                            d="M20 4V10.5C20 11.8807 18.8807 13 17.5 13H4.5C3.11929 13 2 11.8807 2 10.5V4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M22 2L14 10M14 2L22 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Clear Cache
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          System Backup
                        </h3>
                        <p className="text-sm text-gray-500">
                          Backup all system data including configurations
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path d="M8 8H16V10H8V8Z" fill="currentColor" />
                          <path d="M8 12H16V14H8V12Z" fill="currentColor" />
                          <path d="M8 16H12V18H8V16Z" fill="currentColor" />
                        </svg>
                        Backup Now
                      </Button>
                    </div>
                  </div>

                  <div className="pl-4 border-l-4 border-green-500 py-2">
                    <div className="flex items-center mb-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-500 mr-2"
                      >
                        <path
                          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 12L11 15L16 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-medium text-gray-700">
                        Last Automated Backup
                      </span>
                    </div>
                    <div className="ml-7">
                      <p className="text-sm text-gray-600">
                        April 10, 2025 at 02:00 AM
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        System backups are automatically performed daily at 2
                        AM.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Call Settings Tab Content */}
              <TabsContent
                value="call-settings"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-4"
              >
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-medium">Call Settings</h2>
                </div>
                <p className="text-gray-500 mb-6">
                  Configure call handling and recording preferences
                </p>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Maximum Queue Time (seconds)
                      </label>
                      <span className="text-sm text-gray-700">
                        {maxQueueTime} seconds
                      </span>
                    </div>
                    <Slider
                      value={[maxQueueTime]}
                      min={60}
                      max={600}
                      step={30}
                      onValueChange={(value) => setMaxQueueTime(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum time callers can wait in queue before being
                      redirected
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Agent Wrap-Up Time (seconds)
                      </label>
                      <span className="text-sm text-gray-700">
                        {agentWrapUpTime} seconds
                      </span>
                    </div>
                    <Slider
                      value={[agentWrapUpTime]}
                      min={30}
                      max={300}
                      step={10}
                      onValueChange={(value) => setAgentWrapUpTime(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Time allowed for agents to complete tasks after ending a
                      call
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Record All Calls
                          </h3>
                          <p className="text-xs text-gray-500">
                            Automatically record all incoming and outgoing calls
                          </p>
                        </div>
                        <Switch
                          checked={recordAllCalls}
                          onCheckedChange={setRecordAllCalls}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Enable Call Transcription
                          </h3>
                          <p className="text-xs text-gray-500">
                            Automatically transcribe recorded calls
                          </p>
                        </div>
                        <Switch
                          checked={enableTranscription}
                          onCheckedChange={setEnableTranscription}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After Hours Message
                    </label>
                    <Input
                      value={afterHoursMessage}
                      onChange={(e) => setAfterHoursMessage(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Message played to callers outside of business hours
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holiday Message
                    </label>
                    <Input
                      value={holidayMessage}
                      onChange={(e) => setHolidayMessage(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Message played to callers during holidays
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Max Voicemail Length (seconds)
                      </label>
                      <span className="text-sm text-gray-700">
                        {maxVoicemailLength} seconds
                      </span>
                    </div>
                    <Slider
                      value={[maxVoicemailLength]}
                      min={30}
                      max={300}
                      step={10}
                      onValueChange={(value) => setMaxVoicemailLength(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum recording length for voicemails
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save size={16} />
                    Save Call Settings
                  </Button>
                </div>
              </TabsContent>

              {/* Notifications Tab Content */}
              <TabsContent
                value="notifications"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-4"
              >
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-medium">Notification Settings</h2>
                </div>
                <p className="text-gray-500 mb-6">
                  Configure system notifications and alerts
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Email Notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          Receive important system notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          SMS Notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          Receive urgent alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-700 mt-6 mb-2">
                    Alert Types
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Missed Call Alerts
                        </h3>
                        <p className="text-xs text-gray-500">
                          Notify when calls are missed or abandoned
                        </p>
                      </div>
                      <Switch
                        checked={missedCallAlerts}
                        onCheckedChange={setMissedCallAlerts}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          System Alerts
                        </h3>
                        <p className="text-xs text-gray-500">
                          Receive notifications about system issues
                        </p>
                      </div>
                      <Switch
                        checked={systemAlerts}
                        onCheckedChange={setSystemAlerts}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">
                          Performance Reports
                        </h3>
                        <p className="text-xs text-gray-500">
                          Receive scheduled performance reports
                        </p>
                      </div>
                      <Switch
                        checked={performanceReports}
                        onCheckedChange={setPerformanceReports}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Frequency
                    </label>
                    <Select
                      value={reportFrequency}
                      onValueChange={setReportFrequency}
                      disabled={!performanceReports}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      How often to receive scheduled reports
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save size={16} />
                    Save Notification Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
