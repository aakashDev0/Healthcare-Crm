import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  Search,
  ArrowLeft,
  Send,
  User,
  MessageSquareText,
  LoaderCircle,
  Filter,
} from "lucide-react";
import { Howl } from "howler"; 
import messageSentSoundFile from '../Sounds/message.mp3';
// --- Configuration ---
const API_BASE_URL = "http://localhost:8080/api";
const WEBSOCKET_URL = "http://localhost:8080/ws-chat";

// --- Role Mapping & Styling ---
const ROLES = {
  1: { name: "Administration", className: "bg-red-100 text-red-700" },
  2: { name: "Site Admin", className: "bg-yellow-100 text-yellow-800" },
  3: { name: "Root User", className: "bg-gray-200 text-gray-800" },
  4: { name: "Doctor", className: "bg-blue-100 text-blue-700" },
  5: { name: "Marketing", className: "bg-purple-100 text-purple-700" },
};
const DEFAULT_ROLE = { name: "User", className: "bg-gray-100 text-gray-700" };

const messageSentSound = new Howl({
  src: [messageSentSoundFile],
  volume: 0.5, // Volume adjust kar sakte hain
});

// --- Animation Styles Component ---
const GlobalChatStyles = () => (
  <style>{`
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes list-item-in {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes message-in {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes pulse-green {
        0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
    }

    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    .animate-fade-in-down { animation: fade-in-down 0.5s ease-out both; }
    .animate-list-item { animation: list-item-in 0.3s ease-out forwards; opacity: 0; }
    .animate-message-in { animation: message-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
    .animate-pulse-green { animation: pulse-green 2s infinite; }
  `}</style>
);

// --- Helper Components ---
const UserAvatar = ({ user }) => (
  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
    {user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={user.name}
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      <User className="w-5 h-5 text-gray-400" />
    )}
  </div>
);

const ListItem = ({ data, onClick, isActive, index }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 border-l-4 ${
      isActive ? "border-green-500 bg-gray-50" : "border-transparent"
    } cursor-pointer hover:bg-gray-100 transition-colors duration-200 animate-list-item`}
    style={{ animationDelay: `${index * 30}ms` }}
  >
    <UserAvatar user={data} />
    <div className="flex-grow overflow-hidden">
      <h3 className="font-semibold text-sm text-gray-800 truncate">
        {data.name}
      </h3>
      {data.roleName && (
        <div className="mt-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.roleClass}`}
          >
            {data.roleName}
          </span>
        </div>
      )}
    </div>
  </div>
);

// --- Contact List Panel ---
const ContactListPanel = ({
  activeTab,
  setActiveTab,
  onSelect,
  selectedItem,
  directoryUsers,
  inboxUsers,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const handleRoleChange = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const dataToShow = activeTab === "inbox" ? inboxUsers : directoryUsers;
  const ListItemComponent = ListItem;

  let filteredData = dataToShow.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeTab === "directory" && selectedRoles.length > 0) {
    filteredData = filteredData.filter((user) =>
      selectedRoles.includes(user.roleName)
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "inbox"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:bg-white/50"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === "directory"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:bg-white/50"
            }`}
          >
            Directory
          </button>
        </div>
      </div>

      {/* FIX: Reverted to the simpler, always-visible search and filter layout */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {activeTab === "directory" && (
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Filter size={18} />
              </button>
              <div
                style={{
                  transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                  transformOrigin: "top right",
                }}
                className={`absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-30 ${
                  isFilterOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="p-3">
                  <h4 className="font-semibold text-xs mb-2 text-gray-500 px-1 uppercase tracking-wider">
                    Filter by role
                  </h4>
                  {Object.values(ROLES).map((role) => (
                    <label
                      key={role.name}
                      className="flex items-center space-x-3 text-gray-700 my-1 cursor-pointer p-2 rounded-md hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        checked={selectedRoles.includes(role.name)}
                        onChange={() => handleRoleChange(role.name)}
                      />
                      <span>{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          filteredData.map((item, index) => (
            <ListItemComponent
              key={item.userId}
              data={item}
              onClick={() => onSelect(item)}
              isActive={selectedItem?.userId === item.userId}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

// --- Chat Window ---
const ChatWindow = ({
  conversation,
  messages,
  currentUserId,
  loading,
  onSendMessage,
  isConnected,
  onBack,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full w-full bg-gray-50 p-8 text-center animate-fade-in">
        <MessageSquareText className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Select a Conversation
        </h2>
        <p className="text-gray-500 mt-1 max-w-xs mx-auto">
          Choose someone from the left panel to begin your chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* FIX: "View Profile" button has been removed from here */}
      <div className="flex items-center p-4 border-b border-gray-200 z-10 bg-white/80 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="mr-2 p-2 rounded-full hover:bg-gray-100 md:hidden transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <UserAvatar user={conversation} />
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse-green" : "bg-red-500"
              }`}
            ></div>
            <p
              className={`text-sm font-medium ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        {!loading &&
          messages.map((msg, index) => (
            <div
              key={`${msg.messageId}-${index}`}
              className={`flex items-end gap-3 animate-message-in ${
                msg.sender.userId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.sender.userId !== currentUserId && (
                <UserAvatar user={msg.sender} />
              )}
              <div
                className={`max-w-lg p-3 px-4 rounded-2xl shadow-md ${
                  msg.sender.userId === currentUserId
                    ? "bg-green-600 text-white rounded-br-lg"
                    : "bg-white text-gray-800 rounded-bl-lg"
                }`}
              >
                <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </p>
                <p
                  className={`text-xs mt-2 text-right opacity-70 ${
                    msg.sender.userId === currentUserId
                      ? "text-green-200"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {msg.sender.userId === currentUserId && (
                <UserAvatar user={{ name: "You" }} />
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full pl-6 pr-16 py-3 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="absolute right-2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isConnected}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState("directory");
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);
  const currentUserId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!currentUserId) return;
      setLoadingUsers(true);
      try {
        const [inboxResponse, directoryResponse] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/v1/chatting/inbox?userId=${currentUserId}`
          ),
          axios.get(`${API_BASE_URL}/v1/chatting/directory`),
        ]);

        const hydrateUserData = (users) => {
          if (!Array.isArray(users)) return [];
          return users.map((user) => {
            const roleInfo = ROLES[user.role?.roleId] || DEFAULT_ROLE;
            return {
              ...user,
              roleName: roleInfo.name,
              roleClass: roleInfo.className,
            };
          });
        };

        const hydratedInbox = hydrateUserData(inboxResponse.data);
        const hydratedDirectory = hydrateUserData(
          directoryResponse.data.filter((user) => user.userId !== currentUserId)
        );

        setInboxUsers(hydratedInbox);
        setDirectoryUsers(hydratedDirectory);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUserLists();
  }, [currentUserId]);

  useEffect(() => {
    const cleanup = () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        setIsConnected(false);
      }
    };

    if (!selectedConversation) {
      cleanup();
      return;
    }

    const fetchAndConnect = async () => {
      cleanup();
      setLoadingMessages(true);
      setMessages([]);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v1/chatting/messages`,
          {
            params: {
              senderId: currentUserId,
              receiverId: selectedConversation.userId,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }

      const client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        reconnectDelay: 5000,
        onConnect: () => {
          setIsConnected(true);
          stompClientRef.current = client;
          client.subscribe("/topic/public", (message) => {
            const incomingMessage = JSON.parse(message.body);
            if (
              (incomingMessage.sender.userId === currentUserId &&
                incomingMessage.receiver.userId ===
                  selectedConversation.userId) ||
              (incomingMessage.sender.userId === selectedConversation.userId &&
                incomingMessage.receiver.userId === currentUserId)
            ) {
              setMessages((prev) => [...prev, incomingMessage]);
            }
          });
        },
        onWebSocketClose: () => setIsConnected(false),
      });
      client.activate();
    };

    fetchAndConnect();
    return cleanup;
  }, [selectedConversation, currentUserId]);

  const handleSelectConversation = (user) => {
    if (selectedConversation?.userId === user.userId) return;
    setSelectedConversation(user);
    if (!inboxUsers.some((inboxUser) => inboxUser.userId === user.userId)) {
      setInboxUsers((prevInboxUsers) => [user, ...prevInboxUsers]);
    }
  };

  const handleSendMessage = (messageContent) => {
    if (!stompClientRef.current?.connected) {
      alert("Connection is not active. Please wait and try again.");
      return;
    }
    const chatMessage = {
      senderId: currentUserId,
      receiverId: selectedConversation.userId,
      content: messageContent,
    };
    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessage),
    });
    messageSentSound.play();
  };

  const handleBack = () => setSelectedConversation(null);

  return (
    <>
      <GlobalChatStyles />
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans">
        {/* FIX: Header reverted to your preferred style and View Profile button added */}
        <header className="mb-6 flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your conversations and directory
            </p>
          </div>
          <div>
            {selectedConversation && (
              <button className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                View {selectedConversation.name}'s Profile
              </button>
            )}
          </div>
        </header>

        <main
          className="flex-grow flex overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in"
          style={{ animationDelay: "200ms", height: "calc(100vh - 150px)" }}
        >
          <div
            className={`w-full md:w-[380px] flex-shrink-0 flex flex-col transition-transform duration-500 ease-in-out ${
              selectedConversation
                ? "-translate-x-full md:translate-x-0"
                : "translate-x-0"
            } md:flex`}
          >
            <ContactListPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSelect={handleSelectConversation}
              selectedItem={selectedConversation}
              directoryUsers={directoryUsers}
              inboxUsers={inboxUsers}
              loading={loadingUsers}
            />
          </div>
          <div
            className={`absolute md:static top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out flex flex-1 ${
              selectedConversation ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0`}
          >
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              currentUserId={currentUserId}
              loading={loadingMessages}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
              onBack={handleBack}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default MessagesPage;
