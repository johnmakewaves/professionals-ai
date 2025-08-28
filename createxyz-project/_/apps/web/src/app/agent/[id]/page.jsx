import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  Stethoscope,
  GraduationCap,
  Scale,
  ChefHat,
  Brain,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function AgentPage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const [agent, setAgent] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  const specialtyIcons = {
    "General Medicine": Stethoscope,
    "Mathematics & Physics": GraduationCap,
    "Civil & Criminal Law": Scale,
    "Cooking & Nutrition": ChefHat,
    "Mental Health & Therapy": Brain,
    "Personal Finance & Investment": DollarSign,
  };

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = '/account/signin';
      return;
    }
    
    if (user && params.id) {
      fetchAgentAndConversation();
      fetchUserProfile();
    }
  }, [user, userLoading, params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAgentAndConversation = async () => {
    try {
      // Fetch agent details
      const agentResponse = await fetch(`/api/agents/${params.id}`);
      if (!agentResponse.ok) {
        throw new Error('Agent not found');
      }
      const agentData = await agentResponse.json();
      setAgent(agentData);

      // Fetch or create conversation
      const conversationResponse = await fetch(`/api/conversations/agent/${params.id}`);
      if (conversationResponse.ok) {
        const conversationData = await conversationResponse.json();
        setConversation(conversationData);

        // Fetch messages for this conversation
        const messagesResponse = await fetch(`/api/conversations/${conversationData.id}/messages`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }
      } else {
        // No existing conversation, start fresh
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || sending || !agent) return;

    const userMessage = message.trim();
    setMessage("");
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.id,
          message: userMessage,
          conversation_id: conversation?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update conversation if it was just created
      if (!conversation && data.conversation_id) {
        setConversation({ id: data.conversation_id });
      }

      // Add both user message and AI response to messages
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage, created_at: new Date().toISOString() },
        { role: 'assistant', content: data.response, created_at: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add user message and error response
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage, created_at: new Date().toISOString() },
        { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an error processing your request. Please try again.', 
          created_at: new Date().toISOString(),
          error: true
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#219079] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#70757F] dark:text-[#A8ADB4]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-2">Agent Not Found</h1>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mb-6">
            The AI professional you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[#1E8169] hover:to-[#8AB05E] dark:hover:from-[#3BC4A3] dark:hover:to-[#A8C75C] transition-all duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const SpecialtyIcon = specialtyIcons[agent.specialty] || User;
  const userName = userProfile?.preferred_name || user?.name || 'there';

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-[#EDEDED] dark:border-[#333333] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="p-2 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-[#1E1E1E] dark:text-white" />
            </a>
            <div className="flex items-center space-x-3">
              <img
                src={agent.avatar_url}
                alt={agent.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                  {agent.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: agent.background_color }}
                  >
                    <SpecialtyIcon size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
                    {agent.specialty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="mb-8">
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={agent.avatar_url}
                    alt={agent.name}
                    className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold text-[#1E1E1E] dark:text-white">
                        {agent.name}
                      </span>
                      <span className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
                        {agent.title}
                      </span>
                    </div>
                    <div className="text-[#1E1E1E] dark:text-white leading-relaxed">
                      <p className="mb-3">
                        Hello {userName}! {agent.description}
                      </p>
                      <p>How can I help you today?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className="flex space-x-4">
                {msg.role === 'user' ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-[#1E1E1E] dark:text-white">
                          {userName}
                        </span>
                      </div>
                      <div className="bg-[#F7F7F7] dark:bg-[#262626] rounded-2xl px-4 py-3">
                        <p className="text-[#1E1E1E] dark:text-white leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={agent.avatar_url}
                      alt={agent.name}
                      className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-[#1E1E1E] dark:text-white">
                          {agent.name}
                        </span>
                        {msg.error && (
                          <span className="text-xs text-red-500 dark:text-red-400">
                            Error
                          </span>
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.error 
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                          : 'bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333]'
                      }`}>
                        <p className={`leading-relaxed whitespace-pre-wrap ${
                          msg.error 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-[#1E1E1E] dark:text-white'
                        }`}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Typing indicator */}
          {sending && (
            <div className="flex space-x-4 mt-6">
              <img
                src={agent.avatar_url}
                alt={agent.name}
                className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-[#1E1E1E] dark:text-white">
                    {agent.name}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#EDEDED] dark:border-[#333333] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl px-6 py-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${agent.name} anything about ${agent.specialty.toLowerCase()}...`}
                  className="w-full resize-none border-none outline-none placeholder-[#B4B4B4] dark:placeholder-[#70757F] font-inter bg-transparent text-[#1E1E1E] dark:text-white"
                  rows="1"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] rounded-2xl flex items-center justify-center text-white hover:from-[#1E8169] hover:to-[#8AB05E] dark:hover:from-[#3BC4A3] dark:hover:to-[#A8C75C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}