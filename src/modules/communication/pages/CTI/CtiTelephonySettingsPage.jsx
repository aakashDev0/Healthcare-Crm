import React, { useState, useCallback, useEffect } from 'react';
import {
    ChevronDown, ChevronUp, Search, Filter, PlusCircle, Edit3, Trash2, MoreHorizontal,
    User, Users, Building, Phone, Mail, CircleUserRound, MessageSquare, Video, UserPlus,
    CheckCircle, XCircle, Clock, Star, ArrowUpDown, Siren, Hospital, Stethoscope, ClipboardCheck, DollarSign,
    Send, Megaphone, ListOrdered, Settings2, LogOut, PieChartIcon, FileAudio, AreaChart, History,
    Save, Calendar as CalendarIcon, RadioTower, Wifi, WifiOff, KeyRound, Server, Globe
} from 'lucide-react';

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Mock Shadcn/ui Components (for Preview Environment) ---
const Button = ({ variant, size, className, children, ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
      variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
      variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
      variant === 'destructive' ? 'bg-red-500 text-white hover:bg-red-600' :
      'bg-blue-600 text-white hover:bg-blue-700',
      size === 'icon' ? 'h-8 w-8 p-0' : size === 'sm' ? 'h-9 px-3' : 'h-10 px-4 py-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ className, children, ...props }) => <div className={cn('rounded-lg border bg-white text-card-foreground shadow-sm', className)} {...props}>{children}</div>;
const CardHeader = ({ className, children, ...props }) => <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>{children}</div>;
const CardTitle = ({ className, children, ...props }) => <h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props}>{children}</h3>;
const CardDescription = ({ className, children, ...props }) => <p className={cn('text-sm text-muted-foreground', className)} {...props}>{children}</p>;
const CardContent = ({ className, children, ...props }) => <div className={cn('p-6 pt-0', className)} {...props}>{children}</div>;
const Label = ({ children, htmlFor, className, ...props }) => <label htmlFor={htmlFor} className={cn("text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5", className)} {...props}>{children}</label>;
const Input = ({ className, type, ...props }) => <input type={type || "text"} className={cn('flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />;
const PasswordInput = ({ className, ...props }) => <Input type="password" className={className} {...props} />;
const Select = ({ children, value, onValueChange, name, id, className, ...props }) => {
    const handleChange = (e) => {
        if (onValueChange) {
            onValueChange(e.target.value);
        }
    };
    return <select id={id} name={name} value={value} onChange={handleChange} className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>{children}</select>;
};
const Badge = ({ variant, className, children, ...props }) => {
  let variantClasses = '';
  switch (variant) {
    case 'success': variantClasses = 'border-transparent bg-green-100 text-green-700 hover:bg-green-200'; break;
    case 'warning': variantClasses = 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200'; break;
    case 'destructive': variantClasses = 'border-transparent bg-red-100 text-red-700 hover:bg-red-200'; break;
    case 'secondary': variantClasses = 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200'; break;
    case 'outline': variantClasses = 'text-foreground border-gray-300'; break;
    case 'info': variantClasses = 'border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200'; break;
    default: variantClasses = 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200';
  }
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variantClasses, className)} {...props}>{children}</span>;
};

// --- Mock Initial Settings ---
const mockInitialSettings = {
    provider: 'asterisk',
    asterisk_interface: 'AMI',
    asterisk_ami_host: '192.168.1.100',
    asterisk_ami_port: '5038',
    asterisk_ami_user: 'manager_user',
    asterisk_ami_secret: 'secretpassword',
    asterisk_ari_host: '',
    asterisk_ari_port: '8088',
    asterisk_ari_user: '',
    asterisk_ari_secret: '',
    asterisk_wss_url: 'wss://pbx.example.com:8089/ws',
    asterisk_stun_server: 'stun:stun.l.google.com:19302',
    twilio_account_sid: '',
    twilio_api_key_sid: '',
    twilio_api_secret: '',
    twilio_twiml_app_sid: '',
    twilio_default_caller_id: '',
    default_codecs: ['opus', 'pcmu'],
    connection_status: 'Disconnected',
};

const CtiTelephonySettingsPage = () => {
    const [settings, setSettings] = useState(mockInitialSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [notifications, setNotifications] = useState(["CTI Settings page loaded."]);

    useEffect(() => {
        console.log("Fetching CTI settings (simulated)...");
        setTimeout(() => {
            setSettings(mockInitialSettings);
            addNotification("Current CTI settings loaded.", "info");
        }, 500);
    }, []);

    const addNotification = useCallback((message, type = 'info') => {
        console.log(`[CTI NOTIFICATION - ${type.toUpperCase()}]: ${message}`);
        setNotifications(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 3));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleProviderChange = (value) => {
        setSettings(prev => ({
            ...prev,
            provider: value,
            connection_status: 'Unknown',
        }));
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        addNotification(`Testing connection to ${settings.provider}...`, "info");
        console.log("Sending test connection request to backend:", settings.provider);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const success = Math.random() > 0.3;
        const newStatus = success ? 'Connected' : 'Error';
        setSettings(prev => ({ ...prev, connection_status: newStatus }));
        addNotification(`Connection test ${success ? 'successful!' : 'failed.'}`, success ? 'success' : 'error');
        setIsTesting(false);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        addNotification("Saving CTI settings...", "info");
        console.log("Saving settings to backend:", settings);
        await new Promise(resolve => setTimeout(resolve, 1500));
        addNotification("CTI settings saved successfully.", "success");
        handleTestConnection();
        setIsLoading(false);
    };

    const handleLogout = () => {
        console.log("Admin logging out...");
        addNotification("Logged out successfully.");
    };

    const getConnectionStatusBadge = (status) => {
        let variant = "secondary";
        let icon = <WifiOff className="h-3 w-3 mr-1" />;
        let text = status || 'Unknown';

        switch (status) {
            case 'Connected':
                variant = 'success'; icon = <Wifi className="h-3 w-3 mr-1" />; break;
            case 'Disconnected':
                variant = 'secondary'; icon = <WifiOff className="h-3 w-3 mr-1" />; break;
            case 'Connecting':
                variant = 'warning'; icon = <RadioTower className="h-3 w-3 mr-1 animate-pulse" />; break;
            case 'Error':
                variant = 'destructive'; icon = <Siren className="h-3 w-3 mr-1" />; break;
        }
        return <Badge variant={variant} className="text-xs">{icon}{text}</Badge>;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl font-semibold">CTI / Telephony Settings</h1>
                        <p className="text-sm text-gray-500">Configure connection to the telephony platform (Asterisk/Twilio)</p>
                    </div>
                </div>
                {/* <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-sm font-semibold text-white">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-1 h-4 w-4" /> Logout
                    </Button>
                </div> */}
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <form onSubmit={handleSaveChanges}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Telephony Provider</CardTitle>
                            <CardDescription>Select and configure your CTI provider.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="provider">Provider</Label>
                                <Select id="provider" name="provider" value={settings.provider} onValueChange={handleProviderChange}>
                                    <option value="none">None / Disabled</option>
                                    <option value="asterisk">Asterisk</option>
                                    <option value="twilio">Twilio (CPaaS)</option>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button type="button" variant="outline" onClick={handleTestConnection} disabled={isTesting || settings.provider === 'none'}>
                                    {isTesting ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2 h-4 w-4" />}
                                    Test Connection
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <Label className="text-sm mb-0">Status:</Label>
                                    {getConnectionStatusBadge(settings.connection_status)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {settings.provider === 'asterisk' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Asterisk Configuration</CardTitle>
                                <CardDescription>Settings for connecting to your Asterisk server.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="asterisk_interface">Interface</Label>
                                    <Select id="asterisk_interface" name="asterisk_interface" value={settings.asterisk_interface || 'AMI'} onValueChange={(val) => handleInputChange({ target: { name: 'asterisk_interface', value: val } })}>
                                        <option value="AMI">AMI (Asterisk Manager Interface)</option>
                                        <option value="ARI">ARI (Asterisk REST Interface)</option>
                                        <option value="Both">Both AMI & ARI</option>
                                    </Select>
                                </div>
                                {(settings.asterisk_interface === 'AMI' || settings.asterisk_interface === 'Both') && (
                                    <fieldset className="border p-4 rounded-md space-y-4">
                                        <legend className="text-sm font-medium px-1">AMI Settings</legend>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><Label htmlFor="asterisk_ami_host">Host</Label><Input id="asterisk_ami_host" name="asterisk_ami_host" value={settings.asterisk_ami_host || ''} onChange={handleInputChange} placeholder="e.g., 192.168.1.100" /></div>
                                            <div><Label htmlFor="asterisk_ami_port">Port</Label><Input id="asterisk_ami_port" name="asterisk_ami_port" value={settings.asterisk_ami_port || ''} onChange={handleInputChange} placeholder="e.g., 5038" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><Label htmlFor="asterisk_ami_user">Username</Label><Input id="asterisk_ami_user" name="asterisk_ami_user" value={settings.asterisk_ami_user || ''} onChange={handleInputChange} /></div>
                                            <div><Label htmlFor="asterisk_ami_secret">Secret (Password)</Label><PasswordInput id="asterisk_ami_secret" name="asterisk_ami_secret" value={settings.asterisk_ami_secret || ''} onChange={handleInputChange} /></div>
                                        </div>
                                    </fieldset>
                                )}
                                {(settings.asterisk_interface === 'ARI' || settings.asterisk_interface === 'Both') && (
                                    <fieldset className="border p-4 rounded-md space-y-4">
                                        <legend className="text-sm font-medium px-1">ARI Settings</legend>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><Label htmlFor="asterisk_ari_host">Host (incl. http/https)</Label><Input id="asterisk_ari_host" name="asterisk_ari_host" value={settings.asterisk_ari_host || ''} onChange={handleInputChange} placeholder="e.g., http://192.168.1.100" /></div>
                                            <div><Label htmlFor="asterisk_ari_port">Port</Label><Input id="asterisk_ari_port" name="asterisk_ari_port" value={settings.asterisk_ari_port || ''} onChange={handleInputChange} placeholder="e.g., 8088" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><Label htmlFor="asterisk_ari_user">Username</Label><Input id="asterisk_ari_user" name="asterisk_ari_user" value={settings.asterisk_ari_user || ''} onChange={handleInputChange} /></div>
                                            <div><Label htmlFor="asterisk_ari_secret">Secret (Password)</Label><PasswordInput id="asterisk_ari_secret" name="asterisk_ari_secret" value={settings.asterisk_ari_secret || ''} onChange={handleInputChange} /></div>
                                        </div>
                                    </fieldset>
                                )}
                                <fieldset className="border p-4 rounded-md space-y-4">
                                    <legend className="text-sm font-medium px-1">WebRTC Settings</legend>
                                    <div><Label htmlFor="asterisk_wss_url">WebSocket URL (WSS)</Label><Input id="asterisk_wss_url" name="asterisk_wss_url" value={settings.asterisk_wss_url || ''} onChange={handleInputChange} placeholder="wss://your-asterisk-server:8089/ws" /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><Label htmlFor="asterisk_stun_server">STUN Server (Optional)</Label><Input id="asterisk_stun_server" name="asterisk_stun_server" value={settings.asterisk_stun_server || ''} onChange={handleInputChange} placeholder="stun:stun.l.google.com:19302" /></div>
                                        <div><Label htmlFor="asterisk_turn_server">TURN Server (Optional)</Label><Input id="asterisk_turn_server" name="asterisk_turn_server" value={settings.asterisk_turn_server || ''} onChange={handleInputChange} placeholder="turn:turn.example.com:3478" /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><Label htmlFor="asterisk_turn_user">TURN Username</Label><Input id="asterisk_turn_user" name="asterisk_turn_user" value={settings.asterisk_turn_user || ''} onChange={handleInputChange} /></div>
                                        <div><Label htmlFor="asterisk_turn_secret">TURN Password</Label><PasswordInput id="asterisk_turn_secret" name="asterisk_turn_secret" value={settings.asterisk_turn_secret || ''} onChange={handleInputChange} /></div>
                                    </div>
                                </fieldset>
                            </CardContent>
                        </Card>
                    )}

                    {settings.provider === 'twilio' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Twilio Configuration</CardTitle>
                                <CardDescription>Settings for connecting via Twilio CPaaS.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="twilio_account_sid">Account SID</Label><Input id="twilio_account_sid" name="twilio_account_sid" value={settings.twilio_account_sid || ''} onChange={handleInputChange} /></div>
                                    <div><Label htmlFor="twilio_twiml_app_sid">TwiML App SID</Label><Input id="twilio_twiml_app_sid" name="twilio_twiml_app_sid" value={settings.twilio_twiml_app_sid || ''} onChange={handleInputChange} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="twilio_api_key_sid">API Key SID</Label><Input id="twilio_api_key_sid" name="twilio_api_key_sid" value={settings.twilio_api_key_sid || ''} onChange={handleInputChange} /></div>
                                    <div><Label htmlFor="twilio_api_secret">API Secret</Label><PasswordInput id="twilio_api_secret" name="twilio_api_secret" value={settings.twilio_api_secret || ''} onChange={handleInputChange} /></div>
                                </div>
                                <div><Label htmlFor="twilio_default_caller_id">Default Outbound Caller ID</Label><Input id="twilio_default_caller_id" name="twilio_default_caller_id" value={settings.twilio_default_caller_id || ''} onChange={handleInputChange} placeholder="Your Twilio Phone Number (e.g., +1555...)" /></div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>General Telephony Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="default_codecs">Preferred Codecs (comma-separated)</Label>
                                <Input id="default_codecs" name="default_codecs" value={settings.default_codecs?.join(',') || 'opus,pcmu'} onChange={(e) => setSettings(prev => ({ ...prev, default_codecs: e.target.value.split(',').map(c => c.trim()).filter(Boolean) }))} placeholder="e.g., opus,pcmu,pcma,g729" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading || isTesting || settings.provider === 'none'}>
                            {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Settings
                        </Button>
                    </div>
                </form>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>System Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
                        {notifications.map((note, index) => (
                            <p key={index} className="border-b last:border-b-0 pb-1 mb-1">{note}</p>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default CtiTelephonySettingsPage;
