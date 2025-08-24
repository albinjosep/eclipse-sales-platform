'use client'

import { useState, useRef } from 'react'
import { ArrowRightIcon, PaperAirplaneIcon, ChartBarIcon, UserIcon, CurrencyDollarIcon, ClockIcon, MicrophoneIcon, PaperClipIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline'
import { X } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  attachments?: Array<{
    name: string
    type: string
    size: number
    url?: string
  }>
  audioUrl?: string
}

interface ContextData {
  marketTrends: {
    sector: string
    growth: string
    trend: 'up' | 'down'
  }
  salesMetrics: {
    pipelineValue: string
    activeDeals: number
    winRate: string
  }
  suggestedActions: string[]
  recentInteractions: Array<{
    company: string
    lastContact: string
    status: string
  }>
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI sales copilot. I can help you with lead qualification, follow-ups, deal strategy, and more. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [contextData] = useState<ContextData>({
    marketTrends: {
      sector: 'SaaS',
      growth: '+12.4%',
      trend: 'up'
    },
    salesMetrics: {
      pipelineValue: '$47.2K',
      activeDeals: 8,
      winRate: '68%'
    },
    suggestedActions: [
      'Follow up with Johnson Corp (2 days overdue)',
      'Review pricing strategy for Q4',
      'Schedule team sync on new leads'
    ],
    recentInteractions: [
      { company: 'Johnson Corp', lastContact: '2 days ago', status: 'Follow-up needed' },
      { company: 'TechFlow Inc', lastContact: '1 day ago', status: 'Proposal sent' },
      { company: 'DataSync Solutions', lastContact: '3 days ago', status: 'Discovery call scheduled' }
    ]
  })

  const handleSendMessage = async () => {
    if (!inputText.trim() && attachedFiles.length === 0) return

    const attachments = attachedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }))

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText || (attachedFiles.length > 0 ? `Shared ${attachedFiles.length} file(s)` : ''),
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setAttachedFiles([])
    setIsTyping(true)
    
    // Show insights when user starts conversation
    if (!showInsights) {
      setShowInsights(true)
    }

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = generateAIResponse(inputText)
      
      // Add file-specific responses
      if (attachments.length > 0) {
        const fileTypes = attachments.map(att => att.type.split('/')[0])
        if (fileTypes.includes('image')) {
          aiResponse = "I can see the image(s) you've shared. Let me analyze them and provide insights based on the visual content. " + aiResponse
        } else if (fileTypes.includes('application')) {
          aiResponse = "I've received the document(s) you've shared. I'll analyze the content and provide relevant insights. " + aiResponse
        } else {
          aiResponse = "I've received the file(s) you've shared. Let me process them and provide appropriate assistance. " + aiResponse
        }
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('draft') && input.includes('email')) {
      return "I'll draft a personalized follow-up email for you. Based on our recent interaction, here's a compelling follow-up:\n\nSubject: Quick follow-up on our discussion\n\nHi [Name],\n\nI wanted to follow up on our conversation about [specific topic]. I've prepared some additional insights that might be valuable for your team.\n\nWould you be available for a brief call this week to discuss how we can help [specific benefit]?\n\nBest regards,\n[Your name]"
    }
    
    if (input.includes('market') || input.includes('trend')) {
      return `The current market trend in the ${contextData.marketTrends.sector} sector shows ${contextData.marketTrends.growth} growth this quarter. This is driven by increased demand for cloud solutions and digital transformation initiatives. I recommend focusing on enterprise clients who are prioritizing these areas.`
    }
    
    if (input.includes('lead') || input.includes('qualify')) {
      return "I can help you qualify leads! I'll analyze company data, engagement patterns, and market fit to score leads from 1-10. Would you like me to evaluate a specific company, or should I review your current lead pipeline?"
    }
    
    if (input.includes('pricing') || input.includes('strategy')) {
      return "For pricing strategy, I recommend analyzing competitor positioning and customer value perception. Based on current market data, consider a value-based pricing model with tiered packages. Would you like me to create a detailed pricing analysis for your target segments?"
    }
    
    return "I understand you're asking about that. Let me help you with that request. Could you provide more specific details so I can give you the most relevant assistance?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Add voice message
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: '[Voice Message]',
          sender: 'user',
          timestamp: new Date(),
          audioUrl: audioUrl
        }
        
        setMessages(prev => [...prev, voiceMessage])
        
        // Simulate AI response to voice
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "I received your voice message. I'm processing the audio and will respond accordingly.",
            sender: 'ai',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiResponse])
        }, 1000)
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }
  
  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles(prev => [...prev, ...files])
  }
  
  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    setAttachedFiles(prev => [...prev, ...files])
  }
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }
  
  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }
  
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Eclipse Alpha Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Copilot Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 transition-all duration-500 ${
          showInsights ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
        }`}>
          {/* Main Chat Interface - Always Visible */}
          <div className={`bg-white rounded-xl border border-gray-200 flex flex-col ${
            showInsights ? 'lg:col-span-1' : 'lg:col-span-1 max-w-4xl mx-auto'
          }`}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Eclipse AI Sales Copilot</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Ask me anything about sales, leads, or market insights. Now with voice and file support!</p>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    
                    {/* Audio Message */}
                    {message.audioUrl && (
                      <div className="mt-2">
                        <audio controls className="w-full">
                          <source src={message.audioUrl} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    
                    {/* File Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                            message.sender === 'user' ? 'bg-white/20' : 'bg-gray-200'
                          }`}>
                            <PaperClipIcon className="w-4 h-4" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{attachment.name}</div>
                              <div className="text-xs opacity-75">{formatFileSize(attachment.size)}</div>
                            </div>
                            {attachment.type.startsWith('image/') && attachment.url && (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-gray-200' : 'text-gray-600'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className={`p-6 border-t border-gray-200 ${
              isDragOver ? 'bg-cyan-50 border-cyan-300' : ''
            }`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            >
              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  <div className="text-sm font-medium text-gray-700">Attached Files:</div>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <PaperClipIcon className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-600">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachedFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Recording Status */}
              {isRecording && (
                <div className="mb-4 flex items-center justify-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-medium">Recording: {formatRecordingTime(recordingTime)}</span>
                </div>
              )}
              
              {/* Drag and Drop Overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-cyan-100/80 border-2 border-dashed border-cyan-400 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <PaperClipIcon className="w-12 h-12 text-cyan-600 mx-auto mb-2" />
                    <div className="text-lg font-medium text-cyan-800">Drop files here to attach</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-end space-x-3">
                {/* File Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Attach files"
                >
                  <PaperClipIcon className="w-5 h-5" />
                </button>
                
                {/* Voice Recording Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  {isRecording ? (
                    <StopIcon className="w-5 h-5" />
                  ) : (
                    <MicrophoneIcon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your AI sales copilot anything..."
                  className="flex-1 bg-gray-50 text-black px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-cyan-500"
                  disabled={isRecording}
                />
                
                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputText.trim() && attachedFiles.length === 0) || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-3 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.csv,.xlsx,.pptx"
              />
            </div>
          </div>

          {/* Right Side - Contextual Insights (Only shown when active) */}
          {showInsights && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Live Context & Insights</h2>
              </div>
              
              <div className="space-y-6">
                {/* Market Trends */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Market Trends</h3>
                    <ChartBarIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${
                      contextData.marketTrends.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {contextData.marketTrends.growth}
                    </span>
                    <span className="text-sm text-gray-600">{contextData.marketTrends.sector} sector growth</span>
                  </div>
                </div>
                
                {/* Sales KPIs */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-black">{contextData.salesMetrics.pipelineValue}</div>
                      <p className="text-xs text-gray-600">Pipeline Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-black">{contextData.salesMetrics.activeDeals}</div>
                      <p className="text-xs text-gray-600">Active Deals</p>
                    </div>
                    <div className="text-center col-span-2">
                      <div className="text-lg font-bold text-black">{contextData.salesMetrics.winRate}</div>
                      <p className="text-xs text-gray-600">Win Rate</p>
                    </div>
                  </div>
                </div>
                
                {/* Suggested Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Actions</h3>
                  <div className="space-y-2">
                    {contextData.suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-black">
                        <ClockIcon className="w-4 h-4 text-yellow-600" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Interactions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Interactions</h3>
                  <div className="space-y-3">
                    {contextData.recentInteractions.map((interaction, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-black">{interaction.company}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">{interaction.lastContact}</div>
                          <div className="text-xs text-black">{interaction.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions for users */}
        {!showInsights && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              💡 <strong>Tip:</strong> Start typing a question above to see contextual insights appear on the right
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
