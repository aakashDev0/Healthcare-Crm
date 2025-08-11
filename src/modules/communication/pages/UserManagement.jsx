import React, { useEffect, useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import SessionChecker from "../utils/SessionChecker";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Import shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import react-icons
import { FiSearch, FiFilter, FiMoreVertical, FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setSelectedMenu } from "@/redux/slices/menuSlice";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";


function AddUserModal() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Agent")

  const handleSubmit = async () => {
    let roleId;
    switch (role) {
      case "Admin":
        roleId = 3;
        break;
      case "Agent":
        roleId = 2;
        break;
      case "Manager":
        roleId = 1;
        break;
      default:
        alert("Invalid role selected");
        return;
    }
  
    const payload = {
      name: fullName,
      email,
      roleId,
    };
  
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/create", payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(res);

      toast.success("User created successfully!");
      setFullName("");
      setEmail("");
      setRole("Agent");
      // closeModal(); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "User creation failed");
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Manager">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
              Save User
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "INACTIVE" : "ACTIVE";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to change this user's status to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, change it!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/v1/auth/user/${id}/status`,
          { status: newStatus }
        );

        console.log("Response from server:", response.data);

        Swal.fire(
          "Success!",
          `User status changed to ${newStatus}.`,
          "success"
        );
        fetchUsers();
      } catch (error) {
        console.error(
          "Error updating user status:",
          error.response ? error.response.data : error.message
        );

        Swal.fire(
          "Error!",
          "Something went wrong while updating the user status.",
          "error"
        );
        fetchUsers();
      }
    }
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/v1/auth/allusers")
      .then((response) => {
        const mappedUsers = response.data.users.map((user) => {
          // Custom display name for roles
          let displayRole = "";
          switch (user.roleName) {
            case "Site Admin":
              displayRole = "AGENT";
              break;
            case "SUPER_USER":
              displayRole = "SUPERVISOR";
              break;
            case "ROOT_USER":
              displayRole = "ADMIN";
              break;
            default:
              displayRole = user.roleName;
          }

          return {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: displayRole,
            department: user.company,
            status: user.status === "ACTIVE" ? "Active" : "Inactive",
            lastActive: new Date(
              user.lastUpdate || user.creationDate
            ).toLocaleDateString(),
          };
        });

        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const updateUsersPerPage = () => {
      if (window.innerWidth < 768) {
        setUsersPerPage(7);
      } else {
        setUsersPerPage(5);
      }
    };
    updateUsersPerPage();
    window.addEventListener("resize", updateUsersPerPage);
    return () => window.removeEventListener("resize", updateUsersPerPage);
  }, []);

  // Filter users by search query, role, and status
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);

      const matchesRole = selectedRole
        ? user.role.toLowerCase() === selectedRole.toLowerCase()
        : true;

      const matchesStatus = selectedStatus
        ? user.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleBackButtonClick = () => {
    // Dispatch action to change the selected menu to 'admin dashboard'
    dispatch(setSelectedMenu("Dashboard"));
  };

  return (
    <Card className="w-full border-0 shadow-none ">
      <CardHeader className="mb-6 flex flex-col items-start gap-3">
        <button
          onClick={handleBackButtonClick}
          className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>

        <CardTitle className="text-xl font-bold">User Management</CardTitle>
        <CardDescription>
          Manage system users, permissions, and roles
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Search and filter bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 w-full pr-4 py-2 rounded-md focus:outline-none focus:border-black"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm">
              <FiFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <AddUserModal />
            {/* <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add User
            </Button> */}
          </div>
        </div>

        {/* Section title */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage contact center users and their permissions
          </p>
        </div>

        {/* Users table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-sm px-2 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FiMoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {user.status === "Active" ? (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              handleStatusChange(user.id, user.status)
                            }
                          >
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() =>
                              handleStatusChange(user.id, user.status)
                            }
                          >
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-gray-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination buttons */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;

