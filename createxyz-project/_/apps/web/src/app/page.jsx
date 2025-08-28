import React, { useState, useEffect } from "react";
import {
  Home,
  MessageSquare,
  History,
  HelpCircle,
  Settings,
  Plus,
  Search,
  Navigation,
  Menu,
  X,
  LogOut,
  User,
  Stethoscope,
  GraduationCap,
  Scale,
  ChefHat,
  Brain,
  DollarSign,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function HomePage() {
  const { data: user, loading: userLoading } = useUser();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const specialtyIcons = {
    "General Medicine": Stethoscope,
    "Mathematics & Physics": GraduationCap, 
    "Civil & Criminal Law": Scale,
    "Cooking & Nutrition": ChefHat,
    "Mental Health & Therapy": Brain,
    "Personal Finance & Investment": DollarSign,
  };

  const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard", active: true },
    { icon: MessageSquare, label: "My Conversations", id: "conversations" },
    { icon: History, label: "Recent Chats", id: "history" },
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while checking auth
  if (userLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#219079] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#70757F] dark:text-[#A8ADB4]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://www.create.xyz/images/logoipsum/365"
                alt="AI Expert Hub Logo"
                className="w-8 h-8 mr-3"
              />
              <div>
                <span className="text-2xl font-bold text-[#1E1E1E] dark:text-white">AI Expert</span>
                <span className="text-2xl font-bold text-[#219079] dark:text-[#4DD0B1] ml-1">Hub</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-4">
              Connect with AI Professionals
            </h1>
            <p className="text-[#70757F] dark:text-[#A8ADB4] mb-8">
              Chat with specialized AI agents including doctors, lawyers, teachers, and more. 
              Each conversation is personalized and remembered.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/account/signin"
              className="block w-full bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[#1E8169] hover:to-[#8AB05E] dark:hover:from-[#3BC4A3] dark:hover:to-[#A8C75C] transition-all duration-200"
            >
              Sign In
            </a>
            <a
              href="/account/signup"
              className="block w-full border border-[#E2E2E2] dark:border-[#333333] text-[#1E1E1E] dark:text-white py-3 px-6 rounded-2xl font-semibold hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] transition-all duration-200"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#121212] border-b border-[#EDEDED] dark:border-[#333333] z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] rounded-2xl transition-colors"
            >
              <Menu size={24} className="text-[#1E1E1E] dark:text-white" />
            </button>
            <img
              src="https://www.create.xyz/images/logoipsum/365"
              alt="AI Expert Hub Logo"
              className="w-6 h-6 mr-2"
            />
            <span className="text-lg font-medium text-[#1E1E1E] dark:text-white">
              AI Expert
            </span>
            <span className="text-lg font-medium text-[#219079] dark:text-[#4DD0B1] ml-1">
              Hub
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[#121212] border-r border-[#EDEDED] dark:border-[#333333] transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-60`}
      >
        <div className="p-6 pt-8 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] rounded-2xl transition-colors"
          >
            <X size={20} className="text-[#70757F] dark:text-[#A8ADB4]" />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8">
            <img
              src="https://www.create.xyz/images/logoipsum/365"
              alt="AI Expert Hub Logo"
              className="w-6 h-6 mr-3"
            />
            <div>
              <span className="text-lg font-medium text-[#1E1E1E] dark:text-white">
                AI Expert
              </span>
              <span className="text-lg font-medium text-[#219079] dark:text-[#4DD0B1] ml-1">
                Hub
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={item.id}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-[#F1F1F1] dark:bg-[#262626] text-[#1E1E1E] dark:text-white font-bold"
                      : "text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`mr-3 ${isActive ? "text-[#1E1E1E] dark:text-white" : "text-[#A8ADB4] dark:text-[#70757F]"}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="space-y-2 pt-6 border-t border-[#EDEDED] dark:border-[#333333]">
            <button className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626] rounded-2xl transition-colors">
              <HelpCircle
                size={18}
                className="mr-3 text-[#A8ADB4] dark:text-[#70757F]"
              />
              <span className="text-sm">Help</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626] rounded-2xl transition-colors">
              <Settings
                size={18}
                className="mr-3 text-[#A8ADB4] dark:text-[#70757F]"
              />
              <span className="text-sm">Settings</span>
            </button>
            <a
              href="/account/logout"
              className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626] rounded-2xl transition-colors"
            >
              <LogOut
                size={18}
                className="mr-3 text-[#A8ADB4] dark:text-[#70757F]"
              />
              <span className="text-sm">Sign Out</span>
            </a>

            {/* User Profile */}
            <div className="flex items-center pt-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] flex items-center justify-center text-white font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-bold text-[#1E1E1E] dark:text-white">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-60 pt-20 lg:pt-0">
        <div className="px-6 py-6 lg:px-12 lg:py-12">
          {/* Header */}
          <div className="flex flex-col mb-8">
            <div className="mb-4 lg:mb-0">
              <p className="text-base lg:text-lg text-[#70757F] dark:text-[#A8ADB4] mb-2">
                Welcome to AI Expert Hub
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1E1E] dark:text-white leading-tight">
                Connect with AI Professionals
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl p-6 mb-8 shadow-sm dark:shadow-none">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-[#B4B4B4] dark:text-[#70757F]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for AI professionals by name or specialty..."
                className="w-full pl-12 pr-4 py-4 text-lg border-none outline-none placeholder-[#B4B4B4] dark:placeholder-[#70757F] font-inter bg-transparent text-[#1E1E1E] dark:text-white"
              />
            </div>
          </div>

          {/* AI Agents Grid */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] dark:text-white mb-8">
              Available AI Professionals
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#219079] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#70757F] dark:text-[#A8ADB4]">Loading AI professionals...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => {
                  const SpecialtyIcon = specialtyIcons[agent.specialty] || User;
                  return (
                    <a
                      key={agent.id}
                      href={`/agent/${agent.id}`}
                      className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6 hover:border-[#D6D6D6] dark:hover:border-[#404040] hover:shadow-md dark:hover:shadow-none dark:hover:bg-[#262626] active:border-[#BEBEBE] dark:active:border-[#505050] active:shadow-sm dark:active:shadow-none transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <img
                            src={agent.avatar_url}
                            alt={agent.name}
                            className="w-16 h-16 rounded-2xl object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-1 truncate">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-[#219079] dark:text-[#4DD0B1] font-medium mb-1">
                            {agent.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: agent.background_color }}
                            >
                              <SpecialtyIcon size={14} className="text-white" />
                            </div>
                            <span className="text-xs text-[#6B6E73] dark:text-[#A8ADB4]">
                              {agent.specialty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#6B6E73] dark:text-[#A8ADB4] leading-relaxed line-clamp-3">
                        {agent.description}
                      </p>
                    </a>
                  );
                })}
              </div>
            )}

            {!loading && filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#70757F] dark:text-[#A8ADB4]">
                  No AI professionals found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}