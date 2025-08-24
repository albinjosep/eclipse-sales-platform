'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Mail, Phone, Calendar, CheckCircle, User, Building } from 'lucide-react';

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

interface FollowUpReminder {
  id: string;
  leadId: string;
  lead: Lead;
  daysSinceLastContact: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: string;
  reminderType: 'follow_up' | 'check_in' | 'urgent_action';
}

interface FollowUpRemindersProps {
  leads: Lead[];
  onActionTaken?: (leadId: string, action: string) => void;
}

const FollowUpReminders: React.FC<FollowUpRemindersProps> = ({ leads, onActionTaken }) => {
  const [reminders, setReminders] = useState<FollowUpReminder[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generateReminders = () => {
      const today = new Date();
      const newReminders: FollowUpReminder[] = [];

      leads.forEach(lead => {
        const lastContactDate = new Date(lead.lastContact);
        const daysDiff = Math.floor((today.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));

        // Generate reminders based on days since last contact
        if (daysDiff >= 3) {
          let urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
          let suggestedAction: string;
          let reminderType: 'follow_up' | 'check_in' | 'urgent_action';

          if (daysDiff >= 14) {
            urgencyLevel = 'critical';
            suggestedAction = 'Urgent: Re-engage immediately or mark as lost';
            reminderType = 'urgent_action';
          } else if (daysDiff >= 7) {
            urgencyLevel = 'high';
            suggestedAction = 'Schedule call or send personalized email';
            reminderType = 'follow_up';
          } else if (daysDiff >= 5) {
            urgencyLevel = 'medium';
            suggestedAction = 'Send follow-up email or LinkedIn message';
            reminderType = 'follow_up';
          } else {
            urgencyLevel = 'low';
            suggestedAction = 'Quick check-in call or email';
            reminderType = 'check_in';
          }

          // Increase urgency for high-priority leads
          if (lead.priority === 'high' && urgencyLevel !== 'critical') {
            urgencyLevel = urgencyLevel === 'low' ? 'medium' : 'high';
          }

          newReminders.push({
            id: `reminder_${lead.id}_${daysDiff}`,
            leadId: lead.id,
            lead,
            daysSinceLastContact: daysDiff,
            urgencyLevel,
            suggestedAction,
            reminderType
          });
        }
      });

      // Sort by urgency and days since last contact
      newReminders.sort((a: FollowUpReminder, b: FollowUpReminder) => {
        const getUrgencyValue = (level: 'low' | 'medium' | 'high' | 'critical'): number => {
          switch (level) {
            case 'critical': return 4;
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
          }
        };
        
        const aUrgency = getUrgencyValue(a.urgencyLevel);
        const bUrgency = getUrgencyValue(b.urgencyLevel);
        
        if (aUrgency !== bUrgency) {
          return bUrgency - aUrgency;
        }
        return b.daysSinceLastContact - a.daysSinceLastContact;
      });

      setReminders(newReminders);
    };

    generateReminders();
  }, [leads]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleActionTaken = async (reminder: FollowUpReminder, actionType: string) => {
    try {
      // Mark action as completed locally
      setCompletedActions(prev => new Set([...prev, reminder.id]));
      
      // Call the parent callback
      onActionTaken?.(reminder.leadId, actionType);
      
      // In a real implementation, you would call the backend API here
      // await fetch('/api/follow-up-actions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     leadId: reminder.leadId,
      //     action: actionType,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
    } catch (error) {
      console.error('Error recording follow-up action:', error);
      // Remove from completed actions if API call failed
      setCompletedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(reminder.id);
        return newSet;
      });
    }
  };

  const activeReminders = reminders.filter(r => !completedActions.has(r.id));
  const criticalCount = activeReminders.filter(r => r.urgencyLevel === 'critical').length;
  const highCount = activeReminders.filter(r => r.urgencyLevel === 'high').length;

  if (activeReminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Follow-up Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">All leads are up to date! No follow-ups needed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Follow-up Reminders
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {criticalCount} Critical
              </Badge>
            )}
            {highCount > 0 && (
              <Badge className="bg-orange-100 text-orange-800">
                {highCount} High
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg border ${getUrgencyColor(reminder.urgencyLevel)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getUrgencyIcon(reminder.urgencyLevel)}
                    <h4 className="font-semibold">{reminder.lead.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {reminder.daysSinceLastContact} days ago
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {reminder.lead.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {reminder.lead.assignedTo}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{reminder.suggestedAction}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleActionTaken(reminder, 'email')}
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      Send Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActionTaken(reminder, 'call')}
                      className="flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActionTaken(reminder, 'meeting')}
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      Schedule
                    </Button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    ${reminder.lead.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reminder.lead.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activeReminders.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All {activeReminders.length} Reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpReminders;