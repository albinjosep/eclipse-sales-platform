'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, TrendingUp, Users, Calendar, Mail, Phone, Target, AlertCircle, CheckCircle, Clock, ArrowRight, FileText, MessageSquare, BarChart3, Search, Bell, Settings, Sparkles, Plus, Paperclip, Mic, MicOff, MoreHorizontal, Calculator, Eye, UserCheck, Activity, Zap, Star, X, Upload, Image as ImageIcon, File, Play as PlayIcon, Square as StopIcon } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: ToolAction[];
  context?: any;
  attachments?: any[];
  audioUrl?: string;
  structuredData?: {
    type: 'account_summary' | 'pipeline_chart' | 'engagement_history';
    data: any;
  };
}

interface ToolAction {
  id: string;
  type: 'email' | 'calendar' | 'crm_update' | 'lead_enrichment' | 'call';
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

interface InsightData {
  type: 'lead_score' | 'account_info' | 'pipeline' | 'tasks' | 'metrics' | 'recommendations';
  title: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
}

const SalesCopilotContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [activeContext, setActiveContext] = useState<string>('overview');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Suggested action cards for Sales Chat
  const suggestedActions = [
    {
      icon: FileText,
      title: 'Show Fabrikam Account Summary',
      subtitle: 'View comprehensive account details with rich insights',
      description: 'Get comprehensive account insights and recent activities',
      action: 'Show me Fabrikam account summary'
    },
    {
      icon: TrendingUp,
      title: 'Show Pipeline Chart',
      subtitle: 'Visual overview of your sales pipeline stages',
      description: 'Interactive chart showing pipeline distribution',
      action: 'Show me pipeline chart'
    },
    {
      icon: Calculator,
      title: 'Calculate customer spend',
      subtitle: 'What is [Account name]\'s year over year spend?',
      description: 'Analyze spending patterns and trends',
      action: 'What is Fabrikam\'s year over year spend?'
    },
    {
      icon: TrendingUp,
      title: 'Get renewal status',
      subtitle: 'Can you tell me how the renewal looks for [opportunity ID]?',
      description: 'Check renewal probability and timeline',
      action: 'Can you tell me how the renewal looks for opportunity 12345?'
    },
    {
      icon: UserCheck,
      title: 'Check customer sentiment',
      subtitle: 'What is [Account name]\'s sentiment based on recent meetings with my company?',
      description: 'Analyze customer satisfaction and engagement',
      action: 'What is Fabrikam\'s sentiment based on recent meetings with my company?'
    },
    {
      icon: Users,
      title: 'Identify decision makers',
      subtitle: 'Who are the key decision makers at [Account name]?',
      description: 'Map organizational structure and influence',
      action: 'Who are the key decision makers at Fabrikam?'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with sample insights
    setInsights([
      {
        type: 'metrics',
        title: 'Today\'s Metrics',
        data: {
          leads_contacted: 12,
          meetings_scheduled: 3,
          emails_sent: 8,
          pipeline_value: '$45,000'
        },
        priority: 'high'
      },
      {
        type: 'tasks',
        title: 'Pending Tasks',
        data: [
          { id: 1, description: 'Follow up with Acme Corp', priority: 'high', due: '2 hours' },
          { id: 2, description: 'Send proposal to TechStart Inc', priority: 'medium', due: '1 day' },
          { id: 3, description: 'Schedule demo with Global Solutions', priority: 'high', due: '3 hours' }
        ],
        priority: 'high'
      },
      {
        type: 'recommendations',
        title: 'AI Recommendations',
        data: [
          'Contact Sarah Johnson at TechCorp - high intent signals detected',
          'Follow up on Enterprise Solutions proposal - decision timeline approaching',
          'Schedule quarterly review with top 5 accounts'
        ],
        priority: 'medium'
      }
    ]);
  }, []);

  // Generate AI response with structured data
  const generateAIResponse = (userInput: string, attachments: any[]): Message => {
    // Check if user is asking for account summary
    if (userInput.toLowerCase().includes('account') || userInput.toLowerCase().includes('fabrikam') || userInput.toLowerCase().includes('company')) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Here's a summary of Fabrikam's account:",
        sender: 'ai',
        timestamp: new Date(),
        structuredData: {
          type: 'account_summary',
          data: {
            companyName: "Fabrikam, Inc.",
            industry: "Manufacturing",
            location: "Seattle, WA",
            revenue: "$2.5B",
            employees: "15,000",
            website: "www.fabrikam.com",
            crmLink: "View in CRM",
            highlights: [
              "Fabrikam is a subsidiary of Fabrikam Holding, located in the Redmond, although with a broad international presence.",
              "The company has been a strategic account for Contoso, operating within the United States with branches in 35 countries.",
              "The account executive is Greg Whitman. The primary contact is Ryan Behr (VP).",
              "The upcoming opportunity is Expansion project that could potentially close within an estimated close date of March 29, 2025."
            ],
            pipelineInsights: {
              totalOpportunities: 8,
              totalRevenue: "$1,025,000",
              stages: {
                qualify: { count: 2, revenue: "$125,000" },
                develop: { count: 3, revenue: "$450,000" },
                propose: { count: 3, revenue: "$450,000" }
              }
            },
            topOpportunities: [
              { name: "Cloud Migration Initiative", revenue: "$250,000", closeDate: "May 6, 2025" },
              { name: "Hub Implementation", revenue: "$35,000", closeDate: "April 14, 2025" },
              { name: "Strategic Partnership", revenue: "$125,000", closeDate: "March 29, 2025" }
            ],
            recentEngagement: {
              interactions: 15,
              lastInteraction: "Contoso product demonstration",
              participants: ["Greg Whitman", "Ryan Behr"]
            }
          }
        }
      };
    } else if (userInput.toLowerCase().includes('pipeline') || userInput.toLowerCase().includes('chart') || userInput.toLowerCase().includes('graph')) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Here's your pipeline looking:",
        sender: 'ai',
        timestamp: new Date(),
        structuredData: {
          type: 'pipeline_chart',
          data: {
            stages: [
              { name: "Lead", value: 150000, color: "#3b82f6" },
              { name: "Qualify", value: 125000, color: "#8b5cf6" },
              { name: "Develop", value: 200000, color: "#06b6d4" },
              { name: "Propose", value: 175000, color: "#10b981" },
              { name: "Close", value: 100000, color: "#f59e0b" }
            ]
          }
        }
      };
    } else {
      return {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. Let me help you with that. Try asking about 'Fabrikam account summary' or 'show pipeline chart' to see rich content examples.",
        sender: 'ai',
        timestamp: new Date()
      };
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() && attachedFiles.length === 0) return;

    setShowWelcome(false);

    // Create attachment objects
    const attachments = attachedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend || (attachedFiles.length > 0 ? `Shared ${attachedFiles.length} file(s)` : ''),
      sender: 'user',
      timestamp: new Date(),
      attachments
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAttachedFiles([]);
    setIsLoading(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = attachments.length > 0 ? generateAIResponseWithAttachments(messageToSend, attachments) : generateAIResponse(messageToSend, []);
      setMessages(prev => [...prev, aiResponse]);
      updateInsightsBasedOnMessage(messageToSend);
      setIsLoading(false);
    }, 1500);
  };

  // Demo function to test rich content display
  const addDemoMessage = (type: 'account' | 'pipeline') => {
    const demoMessage: Message = {
      id: Date.now().toString(),
      content: type === 'account' ? 'Show me Fabrikam account summary' : 'Show me pipeline chart',
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, demoMessage]);
    setShowWelcome(false);
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(demoMessage.content, []);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestedAction = (action: string) => {
    handleSendMessage(action);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event: any) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Add voice message
        const voiceMessage: Message = {
          id: Date.now().toString(),
          content: `Voice message (${formatRecordingTime(recordingTime)})`,
          sender: 'user',
          timestamp: new Date(),
          audioUrl
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Simulate AI response to voice
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: "I received your voice message. I'm analyzing the audio content to provide you with the best assistance.",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };
  
  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    setAttachedFiles(prev => [...prev, ...files]);
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };
  
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAIResponseWithAttachments = (userInput: string, attachments?: any[]): Message => {
    const input = userInput.toLowerCase();
    
    // Handle file attachments
    if (attachments && attachments.length > 0) {
      const fileTypes = attachments.map(att => att.type);
      if (fileTypes.some(type => type.startsWith('image/'))) {
        return {
          id: Date.now().toString(),
          content: "I can see the images you've shared. Let me analyze them and provide insights relevant to your sales activities.",
          sender: 'ai',
          timestamp: new Date()
        };
      } else if (fileTypes.some(type => type.includes('pdf') || type.includes('document'))) {
        return {
          id: Date.now().toString(),
          content: "I've received your documents. I'll analyze the content to help you with sales strategies, proposals, or any relevant insights.",
          sender: 'ai',
          timestamp: new Date()
        };
      }
    }
    
    let response = '';
    let actions: ToolAction[] = [];
    let structuredData: any = null;
    
    // Account summary queries
    if (input.includes('account summary') || input.includes('fabrikam') || input.includes('company overview')) {
      response = 'Sure, Fabrikam is a strategic account for Contoso, operating within the United States with branches in all 50 states.';
      structuredData = {
        type: 'account_summary',
        data: {
          companyName: 'Fabrikam Works Global',
          industry: 'Retailers',
          location: 'United States',
          revenue: '$20 million',
          employees: '109,000',
          accountExecutive: 'Craig Velliquette',
          primaryContact: 'Lydia Bauer',
          highlights: [
            'Fabrikam is a subsidiary of Fabrikam Works Global. It is a public company operating in the Retailers vertical and is based out of the United States. They have annual revenues of $20 million with over 109,000 employees.',
            'The account executive is Craig Velliquette. The primary contact is Lydia Bauer.',
            'The closest upcoming opportunity is Expansion project East Coast subsidiary with an estimated close date of March 29, 2025.'
          ],
          pipelineInsights: {
            totalOpportunities: 20,
            totalRevenue: '$21M',
            stages: {
              qualify: { count: 10, revenue: '$15M' },
              develop: { count: 5, revenue: '$5.6M' },
              propose: { count: 3, revenue: '$425K' }
            }
          },
          topOpportunities: [
            {
              name: 'Expansion project East Coast subsidiary',
              revenue: '$150,000',
              closeDate: 'March 28, 2025'
            },
            {
              name: 'Cloud Migration Initiative',
              revenue: '$250,000',
              closeDate: 'May 6, 2025'
            },
            {
              name: 'Hub Implementation',
              revenue: '$25,000',
              closeDate: 'April 14, 2025'
            }
          ],
          recentEngagement: {
            interactions: 11,
            lastInteraction: 'Contoso Hub Implementation Meeting',
            participants: ['Chris Naidoo', 'Lydia Bauer', 'Ji-Min An']
          },
          website: 'Fabrikam.com',
          crmLink: 'Fabrikam'
        }
      };
    } else if (input.includes('pipeline') || input.includes('forecast')) {
      response = 'Got it, here\'s a visual to help you see how your pipeline is looking.';
      structuredData = {
        type: 'pipeline_chart',
        data: {
          stages: [
            { name: 'Blank', value: 0, color: '#8B5CF6' },
            { name: 'Qualify', value: 150000, color: '#3B82F6' },
            { name: 'Develop', value: 300000, color: '#10B981' },
            { name: 'Propose', value: 250000, color: '#F59E0B' },
            { name: 'Close', value: 100000, color: '#EF4444' }
          ],
          totalRevenue: '$800K',
          chartType: 'bar'
        }
      };
    } else if (input.includes('lead') || input.includes('qualify')) {
      response = 'I\'ll help you qualify this lead. Let me analyze their profile and recent interactions.';
      actions = [
        {
          id: '1',
          type: 'lead_enrichment',
          description: 'Enriching lead data from external sources',
          status: 'executing'
        },
        {
          id: '2',
          type: 'crm_update',
          description: 'Updating lead score and qualification status',
          status: 'pending'
        }
      ];
    } else if (input.includes('email') || input.includes('send')) {
      response = 'I\'ll draft a personalized email for you. Based on the lead\'s profile and recent interactions, here\'s what I recommend:';
      actions = [
        {
          id: '3',
          type: 'email',
          description: 'Drafting personalized email with AI insights',
          status: 'executing'
        }
      ];
    } else if (input.includes('meeting') || input.includes('schedule')) {
      response = 'I\'ll check availability and schedule the meeting. Let me coordinate with both calendars.';
      actions = [
        {
          id: '4',
          type: 'calendar',
          description: 'Checking calendar availability',
          status: 'executing'
        },
        {
          id: '5',
          type: 'email',
          description: 'Sending meeting invitation',
          status: 'pending'
        }
      ];
    } else {
      response = 'I understand you want to work on that. Let me analyze the current situation and provide you with the best recommendations. What specific aspect would you like me to focus on?';
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      actions,
      structuredData
    };
  };

  const updateInsightsBasedOnMessage = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('lead')) {
      setActiveContext('lead_analysis');
      setInsights(prev => [
        {
          type: 'lead_score',
          title: 'Lead Analysis',
          data: {
            name: 'Sarah Johnson',
            company: 'TechCorp Inc',
            score: 85,
            intent_signals: ['Visited pricing page 3x', 'Downloaded whitepaper', 'Attended webinar'],
            next_action: 'Schedule discovery call'
          },
          priority: 'high'
        },
        ...prev.slice(1)
      ]);
    } else if (input.includes('pipeline')) {
      setActiveContext('pipeline');
      setInsights(prev => [
        {
          type: 'pipeline',
          title: 'Pipeline Overview',
          data: {
            total_value: '$245,000',
            deals_closing_this_month: 3,
            at_risk_deals: 1,
            forecast_accuracy: '92%'
          },
          priority: 'high'
        },
        ...prev.slice(1)
      ]);
    }
  };

  const executeToolAction = async (messageId: string, actionId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.actions) {
        return {
          ...msg,
          actions: msg.actions.map(action => 
            action.id === actionId 
              ? { ...action, status: 'executing' as const }
              : action
          )
        };
      }
      return msg;
    }));

    // Simulate tool execution
    setTimeout(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId && msg.actions) {
          return {
            ...msg,
            actions: msg.actions.map(action => 
              action.id === actionId 
                ? { ...action, status: 'completed' as const, result: 'Success' }
                : action
            )
          };
        }
        return msg;
      }));
    }, 2000);
  };



  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Eclipse Sales Chat</h1>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-medium">Live Context & Insights</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <Plus className="w-4 h-4" />
                <span>New chat</span>
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4" />
              </button>
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">DJ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Chat and Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {showWelcome ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                <div className="max-w-3xl w-full">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">Good morning!</h2>
                    <p className="text-gray-600">How can I help you with your sales activities today? You can type, upload files, or use voice messages.</p>
                  </div>

                  {/* Suggested Actions Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedActions.map((action: any, index: any) => {
                      const Icon = action.icon;
                      return (
                        <div
                           key={index}
                           onClick={() => handleSendMessage(action.action)}
                           className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                         >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{action.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg rounded-br-sm'
                          : 'bg-gray-50 border border-gray-200 rounded-lg rounded-bl-sm'
                      } p-3 shadow-sm`}>
                        <div className="flex items-start space-x-2">
                          {message.sender === 'ai' && (
                            <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-900'}`}>
                              {message.content}
                            </p>
                            
                            {/* Audio Message */}
                            {message.audioUrl && (
                              <div className="mt-2 flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                                <button className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                  <PlayIcon className="w-3 h-3 text-white" />
                                </button>
                                <div className="flex-1 h-1 bg-white/20 rounded-full">
                                  <div className="h-full bg-white/40 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                              </div>
                            )}
                            
                            {/* File Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="bg-white/10 rounded-lg p-2">
                                    {attachment.type.startsWith('image/') ? (
                                      <img 
                                        src={attachment.url} 
                                        alt={attachment.name}
                                        className="max-w-full h-32 object-cover rounded"
                                      />
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <Paperclip className="w-4 h-4 text-white/70" />
                                        <span className="text-sm text-white/90">{attachment.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Structured Data Display */}
                            {message.structuredData && (
                              <div className="mt-3">
                                {message.structuredData.type === 'account_summary' && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                                    {/* Account Header */}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{message.structuredData.data.companyName}</h3>
                                        <p className="text-sm text-gray-600">{message.structuredData.data.industry} • {message.structuredData.data.location}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-600">Revenue: {message.structuredData.data.revenue}</p>
                                        <p className="text-sm text-gray-600">Employees: {message.structuredData.data.employees}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Account Highlights */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Account Highlights</h4>
                                      <ul className="space-y-1">
                                        {message.structuredData.data.highlights.map((highlight: string, index: number) => (
                                          <li key={index} className="text-sm text-gray-700 flex items-start">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                            {highlight}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    {/* Pipeline Insights */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Pipeline Insights</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-600">Total Opportunities: <span className="font-medium">{message.structuredData.data.pipelineInsights.totalOpportunities}</span></p>
                                          <p className="text-sm text-gray-600">Total Revenue: <span className="font-medium">{message.structuredData.data.pipelineInsights.totalRevenue}</span></p>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs">
                                            <span>Qualify: {message.structuredData.data.pipelineInsights.stages.qualify.count} opportunities</span>
                                            <span>{message.structuredData.data.pipelineInsights.stages.qualify.revenue}</span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                            <span>Develop: {message.structuredData.data.pipelineInsights.stages.develop.count} opportunities</span>
                                            <span>{message.structuredData.data.pipelineInsights.stages.develop.revenue}</span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                            <span>Propose: {message.structuredData.data.pipelineInsights.stages.propose.count} opportunities</span>
                                            <span>{message.structuredData.data.pipelineInsights.stages.propose.revenue}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Top Opportunities */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Your top opportunities (3, organized by revenue):</h4>
                                      <div className="space-y-2">
                                        {message.structuredData.data.topOpportunities.map((opp: any, index: number) => (
                                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div>
                                              <p className="text-sm font-medium text-blue-600">{opp.name}</p>
                                              <p className="text-xs text-gray-600">Close date: {opp.closeDate}</p>
                                            </div>
                                            <span className="text-sm font-medium">{opp.revenue}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Recent Engagement */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Recent Engagement</h4>
                                      <p className="text-sm text-gray-700">There have been {message.structuredData.data.recentEngagement.interactions} interactions with this account in the last 30 days.</p>
                                      <p className="text-sm text-gray-700 mt-1">The most recent interaction involving you is {message.structuredData.data.recentEngagement.lastInteraction} which included {message.structuredData.data.recentEngagement.participants.join(', ')}.</p>
                                    </div>
                                    
                                    {/* Footer Links */}
                                    <div className="flex items-center space-x-4 pt-2 border-t border-gray-200">
                                      <p className="text-sm text-gray-600">For more detailed information, you can visit <a href="#" className="text-blue-600 hover:underline">{message.structuredData.data.website}</a> or go to <a href="#" className="text-blue-600 hover:underline">{message.structuredData.data.crmLink}</a>.</p>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                      Is there anything else you would like to know about {message.structuredData.data.companyName.split(' ')[0]}?
                                    </div>
                                  </div>
                                )}
                                
                                {message.structuredData.type === 'pipeline_chart' && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="mb-4">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Overview</h3>
                                      <div className="h-64 bg-gray-50 rounded flex items-end justify-center space-x-4 p-4">
                                        {message.structuredData.data.stages.map((stage: any, index: number) => (
                                          <div key={index} className="flex flex-col items-center">
                                            <div 
                                              className="w-12 rounded-t" 
                                              style={{ 
                                                height: `${Math.max((stage.value / 300000) * 150, 4)}px`,
                                                backgroundColor: stage.color 
                                              }}
                                            ></div>
                                            <span className="text-xs text-gray-600 mt-2 text-center">{stage.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex justify-center mt-4">
                                        <div className="flex space-x-4 text-xs">
                                          {message.structuredData.data.stages.map((stage: any, index: number) => (
                                            <div key={index} className="flex items-center">
                                              <div className="w-3 h-3 rounded mr-1" style={{ backgroundColor: stage.color }}></div>
                                              <span>{stage.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            
                            {/* Tool Actions */}
                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.actions.map((action) => (
                                  <div key={action.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        {action.type === 'email' && <Mail className="w-4 h-4 text-blue-500" />}
                                        {action.type === 'calendar' && <Calendar className="w-4 h-4 text-green-500" />}
                                        {action.type === 'crm_update' && <Target className="w-4 h-4 text-purple-500" />}
                                        {action.type === 'lead_enrichment' && <TrendingUp className="w-4 h-4 text-orange-500" />}
                                        {action.type === 'call' && <Phone className="w-4 h-4 text-red-500" />}
                                        <span className="text-sm font-medium text-gray-900">{action.description}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {action.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                                        {action.status === 'executing' && (
                                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        )}
                                        {action.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        {action.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                        {action.status === 'pending' && (
                                          <button
                                            onClick={() => executeToolAction(message.id, action.id)}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                                          >
                                            Execute
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg rounded-bl-sm p-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Insights Panel */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Insights</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                  {insight.type === 'metrics' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Leads contacted</span>
                        <span className="font-medium">{insight.data.leads_contacted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Meetings scheduled</span>
                        <span className="font-medium">{insight.data.meetings_scheduled}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pipeline value</span>
                        <span className="font-medium text-green-600">{insight.data.pipeline_value}</span>
                      </div>
                    </div>
                  )}
                  {insight.type === 'tasks' && (
                    <div className="space-y-2">
                      {insight.data.map((task: any) => (
                        <div key={task.id} className="flex items-start space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            task.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-gray-900">{task.description}</p>
                            <p className="text-gray-500 text-xs">Due in {task.due}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {insight.type === 'recommendations' && (
                    <div className="space-y-2">
                      {insight.data.map((rec: string, recIndex: number) => (
                        <div key={recIndex} className="flex items-start space-x-2 text-sm">
                          <Star className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e: any) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputMessage);
                      }
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    placeholder={isRecording ? "Recording..." : "Ask me anything..."}
                    className="w-full px-4 py-3 bg-transparent border-none resize-none focus:outline-none text-sm"
                    rows={1}
                    disabled={isLoading || isRecording}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  {/* Drag and drop overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-dashed border-cyan-500 rounded-lg flex items-center justify-center z-10">
                      <div className="text-cyan-600 font-medium">Drop files here</div>
                    </div>
                  )}
                  
                  {/* Attached files display */}
                  {attachedFiles.length > 0 && (
                    <div className="px-3 py-2 border-b border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1 text-sm">
                            <Paperclip className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-700">{file.name}</span>
                            <span className="text-gray-500">({formatFileSize(file.size)})</span>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="px-3 py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Recording: {formatRecordingTime(recordingTime)}</span>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.csv,.xlsx,.pptx"
                  />
                  
                  <div className="absolute bottom-2 left-3 flex items-center space-x-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-1.5 rounded transition-colors ${
                        isRecording 
                          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Start voice recording'}
                    >
                      {isRecording ? <StopIcon className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={(!inputMessage.trim() && attachedFiles.length === 0) || isLoading}
                className="p-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Copilot uses AI. Check for mistakes.</span>
              <div className="flex items-center space-x-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SalesCopilot() {
  return (
    <ProtectedRoute>
      <SalesCopilotContent />
    </ProtectedRoute>
  );
}