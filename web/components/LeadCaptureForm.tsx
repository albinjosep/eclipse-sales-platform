'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Building, Mail, Phone, DollarSign, Tag, CheckCircle, AlertCircle } from 'lucide-react';

interface LeadCaptureData {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  notes: string;
  estimatedValue: number;
  priority: 'low' | 'medium' | 'high';
}

interface LeadCaptureFormProps {
  onLeadCaptured?: (lead: LeadCaptureData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onLeadCaptured, isOpen, onClose }) => {
  const [formData, setFormData] = useState<LeadCaptureData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
    estimatedValue: 0,
    priority: 'medium'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const leadSources = [
    'Website',
    'Referral',
    'Cold Outreach',
    'LinkedIn',
    'Trade Show',
    'Webinar',
    'Content Download',
    'Partner',
    'Other'
  ];

  const handleInputChange = (field: keyof LeadCaptureData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.company.trim()) {
      setErrorMessage('Company is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Call the backend API to create a new lead
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          source: formData.source,
          notes: formData.notes,
          estimated_value: formData.estimatedValue,
          priority: formData.priority,
          stage: 'lead-inbound',
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create lead');
      }

      const newLead = await response.json();
      
      // Trigger the new lead workflow
      try {
        await fetch('/api/workflows/new-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: newLead.id,
            lead_data: formData
          })
        });
      } catch (workflowError) {
        console.warn('Lead created but workflow failed:', workflowError);
      }

      setSubmitStatus('success');
      onLeadCaptured?.(formData);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          source: '',
          notes: '',
          estimatedValue: 0,
          priority: 'medium'
        });
        setSubmitStatus('idle');
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating lead:', error);
      setErrorMessage('Failed to create lead. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Capture New Lead
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Tech Corp Inc"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@techcorp.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>

            {/* Lead Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Lead Source
                </Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedValue" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Estimated Value
                </Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', parseInt(e.target.value) || 0)}
                  placeholder="25000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700">{errorMessage}</span>
              </div>
            )}
            
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Lead captured successfully! AI workflow initiated.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Creating...' : 'Capture Lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadCaptureForm;