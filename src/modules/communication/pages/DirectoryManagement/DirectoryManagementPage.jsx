import React, { useState, useMemo, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  ChevronDown, ChevronUp, Search, Filter, PlusCircle, Edit3, Trash2, MoreHorizontal,
  User, Users, Building, Phone, Mail, CircleUserRound, MessageSquare, Video, UserPlus,
  CheckCircle, XCircle, Clock, Star, ArrowUpDown, Siren, Hospital, Stethoscope, ClipboardCheck, DollarSign
} from 'lucide-react';

// Helper function for class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Mock Shadcn/ui Components (for Preview Environment) ---
// It is STRONGLY recommended to replace these with actual shadcn/ui components in your project.
const Button = ({ variant, size, className, children, ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variant === 'outline'
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        : variant === 'ghost'
        ? 'hover:bg-accent hover:text-accent-foreground'
        : variant === 'secondary'
        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        : variant === 'destructive'
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-blue-600 text-white hover:bg-blue-700',
      size === 'icon'
        ? 'h-8 w-8 p-0'
        : size === 'sm'
        ? 'h-9 px-3'
        : 'h-10 px-4 py-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ className, children, ...props }) => (
  <div className={cn('rounded-lg border bg-white text-card-foreground shadow-sm', className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn('[&_tr]:border-b bg-gray-50', className)} {...props}>
    {children}
  </thead>
);

const TableRow = ({ className, children, ...props }) => (
  <tr className={cn('border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-muted', className)} {...props}>
    {children}
  </tr>
);

const TableHead = ({ className, children, ...props }) => (
  <th className={cn('h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0', className)} {...props}>
    {children}
  </th>
);

const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
    {children}
  </tbody>
);

const TableCell = ({ className, children, ...props }) => (
  <td className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props}>
    {children}
  </td>
);

const DropdownMenu = ({ children }) => <div className="relative inline-block text-left">{children}</div>;

const DropdownMenuTrigger = ({ children, asChild, ...props }) => (
  <div {...props} style={{ display: 'inline-block', cursor: 'pointer' }}>
    {children}
  </div>
);

const DropdownMenuContent = ({ children, align = "end", className, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    if (ref.current) {
      triggerRef.current = ref.current.previousElementSibling;
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const toggle = (e) => {
      if (ref.current?.contains(e.target)) return;
      setIsOpen((o) => !o);
    };
    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      currentTrigger.addEventListener('click', toggle);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      if (currentTrigger) {
        currentTrigger.removeEventListener('click', toggle);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        `absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-popover-foreground shadow-md mt-2`,
        align === 'end' ? 'right-0' : 'left-0',
        !isOpen && 'hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className, onClick, ...props }) => (
  <a
    href="#"
    className={cn('relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)}
    onClick={(e) => {
      e.preventDefault();
      onClick && onClick(e);
    }}
    {...props}
  >
    {children}
  </a>
);

const DropdownMenuSeparator = ({ className, ...props }) => <div className={cn('-mx-1 my-1 h-px bg-gray-200', className)} {...props} />;

const Input = ({ className, ...props }) => (
  <input
    className={cn('flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)}
    {...props}
  />
);

const SelectComponent = ({ children, value, onValueChange, name, id, className, ...props }) => {
  const handleChange = (e) => {
    onValueChange && onValueChange(e.target.value);
  };
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </select>
  );
};

const SelectTrigger = ({ children, className, ...props }) => (
  <button
    type="button"
    className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

const SelectContent = ({ children, className, ...props }) => (
  <div
    className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)}
    {...props}
  >
    {children}
  </div>
);

const SelectItem = ({ children, value, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);

const Badge = ({ variant, className, children, ...props }) => {
  let variantClasses = '';
  switch (variant) {
    case 'success':
      variantClasses = 'border-transparent bg-green-100 text-green-700 hover:bg-green-200';
      break;
    case 'warning':
      variantClasses = 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      break;
    case 'destructive':
      variantClasses = 'border-transparent bg-red-100 text-red-700 hover:bg-red-200';
      break;
    case 'secondary':
      variantClasses = 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200';
      break;
    case 'outline':
      variantClasses = 'text-foreground border-gray-300';
      break;
    case 'info':
      variantClasses = 'border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200';
      break;
    default:
      variantClasses = 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200';
  }
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variantClasses, className)}
      {...props}
    >
      {children}
    </span>
  );
};

const Dialog = ({ children, open, onOpenChange, size = "lg" }) => {
  if (!open) return null;
  let maxWidthClass = 'max-w-lg';
  if (size === 'md') maxWidthClass = 'max-w-md';
  if (size === 'xl') maxWidthClass = 'max-w-xl';
  if (size === '2xl') maxWidthClass = 'max-w-2xl';
  if (size === '3xl') maxWidthClass = 'max-w-3xl';
  if (size === '4xl') maxWidthClass = 'max-w-4xl';
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => onOpenChange && onOpenChange(false)}>
      <div className={cn("bg-white rounded-lg shadow-xl w-full transform transition-all max-h-[90vh] overflow-y-auto", maxWidthClass)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className, ...props }) => (
  <div className={cn("p-6 space-y-4", className)} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left border-b pb-4 mb-4", className)} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

const DialogFooter = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t mt-4", className)} {...props}>
    {children}
  </div>
);

const TooltipProvider = ({ children }) => <>{children}</>;
const Tooltip = ({ children }) => <div className="relative inline-block group">{children}</div>;
const TooltipTrigger = ({ children, asChild, ...props }) => <span {...props}>{children}</span>;
const TooltipContent = ({ children, className, ...props }) => (
  <div
    className={cn("absolute z-50 invisible group-hover:visible p-2 text-xs bg-black text-white rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-2 left-1/2 -translate-x-1/2", className)}
    {...props}
  >
    {children}
  </div>
);

const LabelComponent = ({ children, htmlFor, className, ...props }) => (
  <label htmlFor={htmlFor} className={cn("text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5", className)} {...props}>
    {children}
  </label>
);

const Avatar = ({ children, className, ...props }) => (
  <span className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
    {children}
  </span>
);

const AvatarImage = ({ className, ...props }) => (
  <img className={cn("aspect-square h-full w-full", className)} {...props} />
);

const AvatarFallback = ({ children, className, ...props }) => (
  <span className={cn("flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-medium", className)} {...props}>
    {children}
  </span>
);

// --- End Mock Shadcn/ui Components ---

// Types for Directory (Removed TypeScript type annotations for plain JSX)

// Mock Data - Updated with more relevant roles/departments
const mockDirectoryEntries = [
  {
    id: 'dir1',
    name: 'Dr. Alice Smith',
    avatarUrl: 'https://placehold.co/100x100/EBF4FF/1D4ED8?text=AS',
    role: 'Doctor',
    department: 'Cardiology',
    extension: '101',
    phoneNumber: '555-0101',
    email: 'alice.s@hospital.org',
    status: 'Online',
    location: 'Wing A, Floor 2',
    teamUnit: 'Cardiology Unit A',
    lastSeen: new Date(Date.now() - 60000 * 5).toISOString()
  },
  {
    id: 'dir2',
    name: 'Bob Johnson (IT)',
    avatarUrl: 'https://placehold.co/100x100/FEF3C7/92400E?text=BJ',
    role: 'Support Staff',
    department: 'IT Support',
    extension: '202',
    phoneNumber: '555-0202',
    email: 'bob.j@hospital.org',
    status: 'Away',
    location: 'Building B, Tech Hub',
    lastSeen: new Date(Date.now() - 60000 * 15).toISOString()
  },
  {
    id: 'dir3',
    name: 'Carol White (RN)',
    avatarUrl: 'https://placehold.co/100x100/FEF3C7/92400E?text=CW',
    role: 'Nurse',
    department: 'Pediatrics',
    extension: '303',
    phoneNumber: '555-0303',
    email: 'carol.w@hospital.org',
    status: 'Busy',
    location: 'Childrens Ward',
    teamUnit: 'Peds Ward 1',
    lastSeen: new Date(Date.now() - 60000 * 1).toISOString()
  },
  {
    id: 'agent1',
    name: 'John Agent',
    avatarUrl: 'https://placehold.co/100x100/FEF3C7/92400E?text=JA',
    role: 'Agent',
    department: 'Contact Center',
    extension: '5001',
    phoneNumber: '555-5001',
    email: 'john.a@hospital.org',
    status: 'Ready',
    location: 'Contact Center Floor',
    teamUnit: 'Support Team',
    lastSeen: new Date(Date.now() - 60000 * 2).toISOString()
  },
  {
    id: 'agent2',
    name: 'Jane Agent',
    avatarUrl: 'https://placehold.co/100x100/D1FAE5/065F46?text=JA',
    role: 'Agent',
    department: 'Contact Center',
    extension: '5002',
    phoneNumber: '555-5002',
    email: 'jane.a@hospital.org',
    status: 'On Call',
    location: 'Contact Center Floor',
    teamUnit: 'Billing Team',
    lastSeen: new Date(Date.now() - 60000 * 0).toISOString()
  },
  {
    id: 'sup1',
    name: 'Sarah Supervisor',
    avatarUrl: 'https://placehold.co/100x100/DBEAFE/1E40AF?text=SS',
    role: 'Supervisor',
    department: 'Contact Center',
    extension: '5000',
    phoneNumber: '555-5000',
    email: 'sarah.s@hospital.org',
    status: 'Online',
    location: 'Contact Center Floor',
    teamUnit: 'Management',
    lastSeen: new Date(Date.now() - 60000 * 3).toISOString()
  },
  {
    id: 'bill1',
    name: 'David Lee',
    avatarUrl: 'https://placehold.co/100x100/FEF3C7/92400E?text=DL',
    role: 'Billing Specialist',
    department: 'Billing',
    extension: '401',
    phoneNumber: '555-0401',
    email: 'david.l@hospital.org',
    status: 'Offline',
    location: 'Admin Building, Floor 3',
    lastSeen: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Utility to format date (simplified)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return 'Invalid Date';
  }
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
};

// Updated status badge logic
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Online':
    case 'Ready':
      return 'success';
    case 'Offline':
      return 'secondary';
    case 'Busy':
    case 'On Call':
      return 'destructive';
    case 'Away':
    case 'Not Ready':
      return 'warning';
    default:
      return 'outline';
  }
};

// Directory Entry Form Dialog Component
const DirectoryEntryFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [entry, setEntry] = useState({});
  const roles = ['Agent', 'Supervisor', 'Admin', 'Manager', 'Support Staff', 'Doctor', 'Nurse', 'Clinical Staff', 'Billing Specialist', 'Patient Coordinator'];
  const departments = ['Cardiology', 'IT Support', 'Pediatrics', 'Administration', 'Contact Center', 'Oncology', 'General', 'Radiology', 'Pharmacy', 'Billing', 'Patient Services'];
  const statuses = ['Online', 'Offline', 'Busy', 'Away', 'Ready', 'On Call', 'Not Ready'];

  useEffect(() => {
    if (isOpen) {
      setEntry(
        initialData || {
          id: `dir-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: '',
          email: '',
          status: statuses[0],
          role: roles[0],
          department: departments[0],
          extension: '',
          phoneNumber: '',
          location: '',
          avatarUrl: '',
          teamUnit: ''
        }
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    if (name === 'status') {
      setEntry(prev => ({ ...prev, [name]: value }));
    } else if (name === 'role') {
      setEntry(prev => ({ ...prev, [name]: value }));
    } else {
      setEntry(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entry.name || !entry.email) {
      alert("Name and Email are required.");
      return;
    }
    const finalEntry = {
      id: entry.id,
      name: entry.name,
      email: entry.email,
      role: entry.role || roles[0],
      department: entry.department || departments[0],
      status: entry.status || statuses[0],
      extension: entry.extension || undefined,
      phoneNumber: entry.phoneNumber || undefined,
      location: entry.location || undefined,
      teamUnit: entry.teamUnit || undefined,
      avatarUrl: entry.avatarUrl || undefined,
      notes: entry.notes || undefined,
      lastSeen: entry.lastSeen || new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    onSubmit(finalEntry);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="xl">
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the directory entry. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelComponent htmlFor="name">Full Name *</LabelComponent>
              <Input id="name" name="name" value={entry.name || ''} onChange={handleChange} required />
            </div>
            <div>
              <LabelComponent htmlFor="email">Email *</LabelComponent>
              <Input id="email" name="email" type="email" value={entry.email || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelComponent htmlFor="role">Role</LabelComponent>
              <SelectComponent value={entry.role || roles[0]} onValueChange={(val) => handleSelectChange('role', val)} name="role" id="role">
                {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectComponent>
            </div>
            <div>
              <LabelComponent htmlFor="department">Department</LabelComponent>
              <SelectComponent value={entry.department || departments[0]} onValueChange={(val) => handleSelectChange('department', val)} name="department" id="department">
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectComponent>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelComponent htmlFor="extension">Extension</LabelComponent>
              <Input id="extension" name="extension" value={entry.extension || ''} onChange={handleChange} placeholder="e.g., 5001" />
            </div>
            <div>
              <LabelComponent htmlFor="phoneNumber">Direct Phone</LabelComponent>
              <Input id="phoneNumber" name="phoneNumber" value={entry.phoneNumber || ''} onChange={handleChange} placeholder="e.g., 555-1234" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelComponent htmlFor="status">Status</LabelComponent>
              <SelectComponent value={entry.status || statuses[0]} onValueChange={(val) => handleSelectChange('status', val)} name="status" id="status">
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectComponent>
              <p className="text-xs text-gray-500 mt-1">Note: Status might be updated in real-time.</p>
            </div>
            <div>
              <LabelComponent htmlFor="teamUnit">Team / Unit</LabelComponent>
              <Input id="teamUnit" name="teamUnit" value={entry.teamUnit || ''} onChange={handleChange} placeholder="e.g., Support Team A" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelComponent htmlFor="location">Location</LabelComponent>
              <Input id="location" name="location" value={entry.location || ''} onChange={handleChange} placeholder="e.g., Wing C, Floor 3" />
            </div>
            <div>
              <LabelComponent htmlFor="avatarUrl">Avatar URL</LabelComponent>
              <Input id="avatarUrl" name="avatarUrl" value={entry.avatarUrl || ''} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>
          <div>
            <LabelComponent htmlFor="notes">Notes</LabelComponent>
            <textarea id="notes" name="notes" value={entry.notes || ''} onChange={handleChange} rows={3} className="w-full border border-input rounded-md px-3 py-2 text-sm" placeholder="Optional notes..."></textarea>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Add Contact'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Directory Page Component
const DirectoryManagementPage = () => {
  const [directory, setDirectory] = useState(mockDirectoryEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState();

  const departments = useMemo(() => ['All', ...new Set(mockDirectoryEntries.map(e => e.department).sort())], []);
  const roles = useMemo(() => ['All', ...new Set(mockDirectoryEntries.map(e => e.role).sort())], []);
  const statuses = ['All', 'Online', 'Offline', 'Busy', 'Away', 'Ready', 'On Call', 'Not Ready'];

  const filteredDirectory = useMemo(() => {
    return directory
      .filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.extension && entry.extension.includes(searchTerm)) ||
        entry.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(entry => departmentFilter === 'All' || entry.department === departmentFilter)
      .filter(entry => roleFilter === 'All' || entry.role === roleFilter)
      .filter(entry => statusFilter === 'All' || entry.status === statusFilter);
  }, [directory, searchTerm, departmentFilter, roleFilter, statusFilter]);

  const sortedDirectory = useMemo(() => {
    let sortableItems = [...filteredDirectory];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (typeof valA === 'string' && typeof valB === 'string') {
          const comparison = valA.localeCompare(valB);
          return sortConfig.direction === 'ascending' ? comparison : -comparison;
        }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredDirectory, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown className="h-4 w-4 inline ml-1 opacity-30 group-hover:opacity-70" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 inline ml-1" /> : <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const handleEntrySubmit = (submittedEntry) => {
    setDirectory(prevDirectory => {
      if (editingEntry) {
        return prevDirectory.map(e => e.id === submittedEntry.id ? submittedEntry : e);
      } else {
        return [submittedEntry, ...prevDirectory];
      }
    });
    setEditingEntry(undefined);
    alert(editingEntry ? 'Contact updated successfully!' : 'Contact added successfully!');
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setDirectory(prev => prev.filter(e => e.id !== entryId));
      alert('Contact deleted successfully!');
    }
  };

  const handleCall = (entry) => {
    const target = entry.extension || entry.phoneNumber;
    if (target) {
      console.log(`Initiating call to ${entry.name} at ${target}`);
      alert(`Initiating call to ${entry.name} at ${target}...\n(Connect this to your CTI module)`);
    } else {
      alert(`No phone number or extension available for ${entry.name}.`);
    }
  };

  const handleChat = (entry) => {
    console.log(`Initiating chat with ${entry.name}`);
    alert(`Initiating chat with ${entry.name}...\n(Requires internal chat system integration)`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0 flex items-center">
          <Hospital className="h-8 w-8 mr-3 text-blue-600" /> Internal Directory
        </h1>
        <Button onClick={() => { setEditingEntry(undefined); setIsFormModalOpen(true); }}> 
          <UserPlus className="h-5 w-5 mr-2" /> Add Contact 
        </Button>             
      </div> 
      <Card className="border-none"> 
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div> 
              <CardTitle className="text-xl text-gray-800">Staff & Department Contacts</CardTitle>
              <CardDescription>Find colleagues, check status, and initiate communication.</CardDescription>
            </div>
            <div className="w-full md:w-auto md:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input  
                  type="text"
                  placeholder="Search name, email, dept, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectComponent value={departmentFilter} onValueChange={setDepartmentFilter}>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</SelectItem>
              ))}
            </SelectComponent>
            <SelectComponent value={roleFilter} onValueChange={setRoleFilter}>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role === 'All' ? 'All Roles' : role}</SelectItem>
              ))}
            </SelectComponent>
            <SelectComponent value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
              {statuses.map(stat => (
                <SelectItem key={stat} value={stat}>{stat === 'All' ? 'All Statuses' : stat}</SelectItem>
              ))}
            </SelectComponent>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">  
          <Table>    
            <TableHeader>
              <TableRow>   
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead onClick={() => requestSort('name')} className="group cursor-pointer hover:bg-gray-100">
                  Name {getSortIndicator('name')}
                </TableHead> 
                <TableHead onClick={() => requestSort('department')} className="group cursor-pointer hover:bg-gray-100">
                  Department {getSortIndicator('department')}
                </TableHead>
                <TableHead onClick={() => requestSort('extension')} className="group cursor-pointer hover:bg-gray-100">
                  Extension {getSortIndicator('extension')} 
                </TableHead>
                <TableHead onClick={() => requestSort('email')} className="group cursor-pointer hover:bg-gray-100">
                  Email {getSortIndicator('email')}
                </TableHead>
                <TableHead onClick={() => requestSort('status')} className="group cursor-pointer hover:bg-gray-100">
                  Status {getSortIndicator('status')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDirectory.length > 0
                ? sortedDirectory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={entry.avatarUrl}
                            alt={entry.name}
                            onError={(e) => {
                              const target = e.target;
                              target.onerror = null;
                              target.style.display = 'none';
                            }}
                          />
                          <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-800">{entry.name}</div>
                        <div className="text-xs text-gray-500">{entry.role}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{entry.department}</TableCell>
                      <TableCell className="text-sm text-gray-600">{entry.extension || 'N/A'}</TableCell>
                      <TableCell className="text-sm text-blue-600 hover:underline">
                        <a href={`mailto:${entry.email}`}>{entry.email}</a>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant={getStatusBadgeVariant(entry.status)}>{entry.status}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last seen: {formatDate(entry.lastSeen)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCall(entry)} disabled={!entry.extension && !entry.phoneNumber}>
                                  <Phone className="h-4 w-4 text-green-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Call {entry.extension || entry.phoneNumber || 'N/A'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleChat(entry)}>
                                  <MessageSquare className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Chat</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingEntry(entry); setIsFormModalOpen(true); }}>
                                <Edit3 className="mr-2 h-4 w-4" />Edit Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert(`Viewing profile of ${entry.name}`)}>
                                <User className="mr-2 h-4 w-4" />View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteEntry(entry.id)} className="text-red-600 hover:bg-red-50!">
                                <Trash2 className="mr-2 h-4 w-4" />Delete Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-10">
                      <Siren className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      No contacts found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DirectoryEntryFormDialog
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingEntry(undefined); }}
        onSubmit={handleEntrySubmit}
        initialData={editingEntry}
      />
    </div>
  );
};

export default DirectoryManagementPage;