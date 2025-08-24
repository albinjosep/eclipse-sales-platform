'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Building, DollarSign, Calendar, Phone, Mail, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import LeadCaptureForm from './LeadCaptureForm';
import FollowUpReminders from './FollowUpReminders';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stage: string;
  lastContact: string;
  notes: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
}

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    value: 25000,
    stage: 'lead-inbound',
    lastContact: '2024-01-05',
    notes: 'Interested in enterprise solution',
    assignedTo: 'You',
    priority: 'high',
    source: 'Website'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'StartupXYZ',
    email: 'sarah@startupxyz.com',
    phone: '+1-555-0456',
    value: 15000,
    stage: 'qualified',
    lastContact: '2024-01-01',
    notes: 'Budget confirmed, decision maker identified',
    assignedTo: 'You',
    priority: 'medium',
    source: 'Referral'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    company: 'Enterprise Inc',
    email: 'mike@enterprise.com',
    phone: '+1-555-0789',
    value: 50000,
    stage: 'demo',
    lastContact: '2024-01-13',
    notes: 'Demo scheduled for next week',
    assignedTo: 'You',
    priority: 'high',
    source: 'Cold Outreach'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    company: 'Growth Co',
    email: 'lisa@growthco.com',
    phone: '+1-555-0321',
    value: 35000,
    stage: 'proposal',
    lastContact: '2023-12-20',
    notes: 'Proposal sent, awaiting feedback',
    assignedTo: 'You',
    priority: 'high',
    source: 'LinkedIn'
  },
  {
    id: '5',
    name: 'David Brown',
    company: 'Small Biz',
    email: 'david@smallbiz.com',
    phone: '+1-555-0654',
    value: 8000,
    stage: 'closed',
    lastContact: '2024-01-10',
    notes: 'Deal closed successfully',
    assignedTo: 'You',
    priority: 'medium',
    source: 'Website'
  }
];

const stages = [
  { 
    id: 'lead-inbound', 
    name: 'Lead Inbound', 
    color: 'bg-blue-50 border-blue-200', 
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'New leads that need initial review'
  },
  { 
    id: 'qualified', 
    name: 'Qualified', 
    color: 'bg-green-50 border-green-200', 
    badgeColor: 'bg-green-100 text-green-800',
    description: 'Leads that meet our criteria'
  },
  { 
    id: 'demo', 
    name: 'Demo/Discovery', 
    color: 'bg-yellow-50 border-yellow-200', 
    badgeColor: 'bg-yellow-100 text-yellow-800',
    description: 'Scheduled demos and discovery calls'
  },
  { 
    id: 'proposal', 
    name: 'Proposal/Negotiation', 
    color: 'bg-orange-50 border-orange-200', 
    badgeColor: 'bg-orange-100 text-orange-800',
    description: 'Proposals sent and in negotiation'
  },
  { 
    id: 'closed', 
    name: 'Closed Won/Lost', 
    color: 'bg-gray-50 border-gray-200', 
    badgeColor: 'bg-gray-100 text-gray-800',
    description: 'Completed deals (won or lost)'
  }
];

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
};

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [leadToAssign, setLeadToAssign] = useState<Lead | null>(null);

  // Available sales reps
  const salesReps = [
    'You',
    'Sarah Johnson',
    'Mike Chen',
    'Alex Rodriguez',
    'Emma Thompson',
    'David Kim'
  ];

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (stageId: string) => {
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggedLead) {
      setLeads(prev => prev.map(lead => 
        lead.id === draggedLead 
          ? { ...lead, stage: targetStage, lastContact: new Date().toISOString().split('T')[0] }
          : lead
      ));
      setDraggedLead(null);
      setDragOverStage(null);
    }
  };

  const addNewLead = () => {
    if (newLead.name && newLead.company && newLead.email) {
      const lead: Lead = {
        id: Date.now().toString(),
        name: newLead.name,
        company: newLead.company,
        email: newLead.email,
        phone: newLead.phone || '',
        value: newLead.value || 0,
        stage: 'lead-inbound',
        lastContact: new Date().toISOString().split('T')[0],
        notes: newLead.notes || '',
        assignedTo: 'You',
        priority: (newLead.priority as 'low' | 'medium' | 'high') || 'medium',
        source: newLead.source || 'Manual'
      };
      setLeads(prev => [...prev, lead]);
      setNewLead({});
      setIsAddingLead(false);
    }
  };

  const handleLeadCaptured = (leadData: any) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      value: leadData.estimatedValue || 0,
      stage: 'lead-inbound',
      lastContact: new Date().toISOString().split('T')[0],
      notes: leadData.notes,
      assignedTo: 'You',
      priority: leadData.priority || 'medium',
      source: leadData.source || 'Website'
    };
    
    setLeads(prev => [...prev, newLead]);
  };

  const handleFollowUpAction = (leadId: string, action: string) => {
    // Update the lead's last contact date when a follow-up action is taken
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ));
    
    // In a real implementation, you would also log this action to the backend
    console.log(`Follow-up action '${action}' taken for lead ${leadId}`);
  };

  const handleAssignLead = (leadId: string, assignedTo: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, assignedTo }
        : lead
    ));
    setIsAssignmentOpen(false);
    setLeadToAssign(null);
  };

  const openAssignmentModal = (lead: Lead) => {
    setLeadToAssign(lead);
    setIsAssignmentOpen(true);
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  const getTotalValue = (stageId: string) => {
    return getLeadsByStage(stageId).reduce((sum, lead) => sum + lead.value, 0);
  };

  const getAtRiskLeads = () => {
    const today = new Date();
    return leads.filter(lead => {
      const lastContact = new Date(lead.lastContact);
      const daysDiff = Math.floor((today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7 && lead.stage !== 'closed';
    });
  };

  const getTotalPipelineValue = () => {
    return leads.filter(lead => lead.stage !== 'closed').reduce((sum, lead) => sum + lead.value, 0);
  };

  const atRiskLeads = getAtRiskLeads();
  const totalPipelineValue = getTotalPipelineValue();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with metrics */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Manage your leads through the sales process</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsLeadCaptureOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Capture Lead
            </Button>
            <Button 
              onClick={() => setIsAddingLead(true)} 
              variant="outline" 
              className="border-black text-black hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manual
            </Button>
          </div>
        </div>
        
        {/* Pipeline metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pipeline Value</p>
                  <p className="text-2xl font-bold text-gray-900">${totalPipelineValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{leads.filter(l => l.stage !== 'closed').length}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At Risk Deals</p>
                  <p className="text-2xl font-bold text-red-600">{atRiskLeads.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Closed This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{leads.filter(l => l.stage === 'closed').length}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {stages.map(stage => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageValue = getTotalValue(stage.id);
          const isDragOver = dragOverStage === stage.id;
          
          return (
            <div
              key={stage.id}
              className={`rounded-lg border-2 transition-all duration-200 ${
                isDragOver ? 'border-blue-400 bg-blue-50' : stage.color
              } min-h-[600px]`}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{stage.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{stage.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{stageLeads.length} leads</span>
                    <span className="font-medium text-gray-900">${stageValue.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {stageLeads.map(lead => {
                    const daysSinceContact = Math.floor(
                      (new Date().getTime() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isAtRisk = daysSinceContact > 7 && lead.stage !== 'closed';
                    
                    return (
                      <Card
                        key={lead.id}
                        className={`cursor-move hover:shadow-lg transition-all duration-200 bg-white border ${
                          isAtRisk ? 'border-red-200 bg-red-50' : 'border-gray-200'
                        } ${draggedLead === lead.id ? 'opacity-50 rotate-2' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge className={`text-xs ${stage.badgeColor}`}>
                                ${lead.value.toLocaleString()}
                              </Badge>
                              <Badge className={`text-xs ${priorityColors[lead.priority]}`}>
                                {lead.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{daysSinceContact}d ago</span>
                            {isAtRisk && <AlertCircle className="w-3 h-3 text-red-500" />}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{lead.source}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLead(lead)}
                              className="flex items-center gap-1"
                            >
                              <User className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAssignmentModal(lead)}
                              className="flex items-center gap-1"
                            >
                              <User className="h-3 w-3" />
                              Assign
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {/* Drop zone indicator */}
                  {isDragOver && (
                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50">
                      Drop lead here
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{selectedLead.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span>{selectedLead.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{selectedLead.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>${selectedLead.value.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Last contact: {selectedLead.lastContact}</span>
              </div>
              {selectedLead.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Lead Modal */}
      <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newLead.name || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter lead name"
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={newLead.company || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newLead.email || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newLead.phone || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="value">Deal Value</Label>
              <Input
                id="value"
                type="number"
                value={newLead.value || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                placeholder="Enter deal value"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newLead.priority || 'medium'} onValueChange={(value) => setNewLead(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={newLead.source || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Enter lead source"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newLead.notes || ''}
                onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingLead(false)}>
                Cancel
              </Button>
              <Button onClick={addNewLead} className="bg-black hover:bg-gray-800">
                Add Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Capture Form */}
      <LeadCaptureForm 
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* Assignment Modal */}
      <Dialog open={isAssignmentOpen} onOpenChange={setIsAssignmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
          </DialogHeader>
          {leadToAssign && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Assign <strong>{leadToAssign.name}</strong> from <strong>{leadToAssign.company}</strong> to:
                </p>
                <div className="space-y-2">
                  {salesReps.map(rep => (
                    <Button
                      key={rep}
                      variant={leadToAssign.assignedTo === rep ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleAssignLead(leadToAssign.id, rep)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {rep}
                      {leadToAssign.assignedTo === rep && " (Current)"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-up Reminders */}
       <FollowUpReminders 
         leads={leads}
         onActionTaken={handleFollowUpAction}
       />
    </div>
  );
}