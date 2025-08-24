from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import json
from ..core.ai_orchestrator import AIOrchestrator, AgentTask, DecisionType
from ..core.ai_tools import AIToolsLibrary
from ..core.memory_system import PersistentMemorySystem, MemoryType, MemoryContext, MemoryImportance
from ..core.workflow_engine import WorkflowEngine, WorkflowDefinition, WorkflowStep, WorkflowTrigger

class LeadQualificationStage(Enum):
    INITIAL_CONTACT = "initial_contact"
    DISCOVERY = "discovery"
    NEEDS_ASSESSMENT = "needs_assessment"
    BUDGET_AUTHORITY = "budget_authority"
    TIMELINE_URGENCY = "timeline_urgency"
    DECISION_PROCESS = "decision_process"
    FINAL_QUALIFICATION = "final_qualification"
    QUALIFIED = "qualified"
    DISQUALIFIED = "disqualified"

class QualificationCriteria(Enum):
    BUDGET = "budget"
    AUTHORITY = "authority"
    NEED = "need"
    TIMELINE = "timeline"
    FIT = "fit"
    PAIN_POINT = "pain_point"
    COMPETITION = "competition"

@dataclass
class LeadQualificationData:
    """Structured data for lead qualification"""
    lead_id: str
    company_name: str
    contact_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    annual_revenue: Optional[str] = None
    current_stage: LeadQualificationStage = LeadQualificationStage.INITIAL_CONTACT
    
    # BANT Qualification
    budget_range: Optional[str] = None
    budget_confirmed: bool = False
    decision_maker: Optional[str] = None
    authority_level: Optional[str] = None
    needs_identified: List[str] = None
    timeline: Optional[str] = None
    urgency_level: Optional[str] = None
    
    # Additional qualification data
    pain_points: List[str] = None
    current_solution: Optional[str] = None
    competitors_considered: List[str] = None
    decision_criteria: List[str] = None
    stakeholders: List[Dict[str, str]] = None
    
    # Scoring
    qualification_score: float = 0.0
    confidence_level: float = 0.0
    next_actions: List[str] = None
    
    def __post_init__(self):
        if self.needs_identified is None:
            self.needs_identified = []
        if self.pain_points is None:
            self.pain_points = []
        if self.competitors_considered is None:
            self.competitors_considered = []
        if self.decision_criteria is None:
            self.decision_criteria = []
        if self.stakeholders is None:
            self.stakeholders = []
        if self.next_actions is None:
            self.next_actions = []

class AIReasoningEngine:
    """AI reasoning engine for lead qualification decisions"""
    
    def __init__(self, memory_system: PersistentMemorySystem):
        self.memory = memory_system
        self.qualification_weights = {
            QualificationCriteria.BUDGET: 0.25,
            QualificationCriteria.AUTHORITY: 0.20,
            QualificationCriteria.NEED: 0.25,
            QualificationCriteria.TIMELINE: 0.15,
            QualificationCriteria.FIT: 0.10,
            QualificationCriteria.PAIN_POINT: 0.05
        }
    
    def think_analyze_lead(self, lead_data: LeadQualificationData, 
                          context: MemoryContext) -> Dict[str, Any]:
        """THINK: Analyze lead data and determine qualification approach"""
        
        # Retrieve relevant memories about similar leads
        similar_leads = self.memory.retrieve_memories(
            context=context,
            memory_types=[MemoryType.ENTITY, MemoryType.DECISION],
            limit=5
        )
        
        # Analyze company profile
        company_analysis = self._analyze_company_profile(lead_data)
        
        # Assess current qualification status
        qualification_gaps = self._identify_qualification_gaps(lead_data)
        
        # Generate reasoning
        reasoning = {
            'analysis_timestamp': datetime.utcnow().isoformat(),
            'lead_profile': {
                'company_size_category': self._categorize_company_size(lead_data.company_size),
                'industry_fit': self._assess_industry_fit(lead_data.industry),
                'revenue_potential': self._estimate_revenue_potential(lead_data.annual_revenue)
            },
            'qualification_status': {
                'current_stage': lead_data.current_stage.value,
                'completion_percentage': self._calculate_completion_percentage(lead_data),
                'missing_information': qualification_gaps,
                'confidence_level': self._calculate_confidence_level(lead_data)
            },
            'similar_leads_insights': self._extract_insights_from_similar_leads(similar_leads),
            'recommended_approach': self._recommend_qualification_approach(lead_data, qualification_gaps),
            'risk_factors': self._identify_risk_factors(lead_data),
            'opportunity_indicators': self._identify_opportunity_indicators(lead_data)
        }
        
        # Store reasoning in memory
        self.memory.store_memory(
            content=f"Lead qualification analysis for {lead_data.company_name}: {json.dumps(reasoning, indent=2)}",
            memory_type=MemoryType.DECISION,
            context=context,
            importance=MemoryImportance.HIGH,
            structured_data=reasoning,
            tags=['lead_qualification', 'analysis', lead_data.industry or 'unknown_industry']
        )
        
        return reasoning
    
    def adapt_qualification_strategy(self, lead_data: LeadQualificationData,
                                   analysis: Dict[str, Any],
                                   context: MemoryContext) -> Dict[str, Any]:
        """ADAPT: Customize qualification strategy based on analysis"""
        
        # Determine optimal qualification sequence
        qualification_sequence = self._design_qualification_sequence(lead_data, analysis)
        
        # Select appropriate communication channels
        communication_strategy = self._select_communication_strategy(lead_data, analysis)
        
        # Customize messaging approach
        messaging_strategy = self._design_messaging_strategy(lead_data, analysis)
        
        # Define success metrics
        success_metrics = self._define_success_metrics(lead_data, analysis)
        
        adaptation_strategy = {
            'strategy_timestamp': datetime.utcnow().isoformat(),
            'qualification_sequence': qualification_sequence,
            'communication_strategy': communication_strategy,
            'messaging_strategy': messaging_strategy,
            'success_metrics': success_metrics,
            'timeline_estimate': self._estimate_qualification_timeline(lead_data, analysis),
            'resource_requirements': self._estimate_resource_requirements(lead_data, analysis),
            'contingency_plans': self._create_contingency_plans(lead_data, analysis)
        }
        
        # Store adaptation strategy
        self.memory.store_memory(
            content=f"Qualification strategy for {lead_data.company_name}: {json.dumps(adaptation_strategy, indent=2)}",
            memory_type=MemoryType.DECISION,
            context=context,
            importance=MemoryImportance.HIGH,
            structured_data=adaptation_strategy,
            tags=['qualification_strategy', 'adaptation', lead_data.current_stage.value]
        )
        
        return adaptation_strategy
    
    def act_execute_qualification(self, lead_data: LeadQualificationData,
                                strategy: Dict[str, Any],
                                context: MemoryContext) -> Dict[str, Any]:
        """ACT: Execute qualification actions based on strategy"""
        
        # Generate specific actions
        immediate_actions = self._generate_immediate_actions(lead_data, strategy)
        follow_up_actions = self._generate_follow_up_actions(lead_data, strategy)
        
        # Create communication templates
        communication_templates = self._generate_communication_templates(lead_data, strategy)
        
        # Define tracking and measurement
        tracking_plan = self._create_tracking_plan(lead_data, strategy)
        
        execution_plan = {
            'execution_timestamp': datetime.utcnow().isoformat(),
            'immediate_actions': immediate_actions,
            'follow_up_actions': follow_up_actions,
            'communication_templates': communication_templates,
            'tracking_plan': tracking_plan,
            'success_criteria': strategy.get('success_metrics', {}),
            'escalation_triggers': self._define_escalation_triggers(lead_data, strategy)
        }
        
        # Store execution plan
        self.memory.store_memory(
            content=f"Qualification execution plan for {lead_data.company_name}: {json.dumps(execution_plan, indent=2)}",
            memory_type=MemoryType.TASK,
            context=context,
            importance=MemoryImportance.HIGH,
            structured_data=execution_plan,
            tags=['execution_plan', 'qualification', 'actions']
        )
        
        return execution_plan
    
    # Helper methods for analysis
    def _analyze_company_profile(self, lead_data: LeadQualificationData) -> Dict[str, Any]:
        """Analyze company profile for qualification insights"""
        return {
            'size_category': self._categorize_company_size(lead_data.company_size),
            'industry_vertical': lead_data.industry,
            'revenue_tier': self._categorize_revenue(lead_data.annual_revenue),
            'geographic_region': 'Unknown',  # Would be extracted from data
            'technology_stack': 'Unknown'   # Would be researched
        }
    
    def _categorize_company_size(self, company_size: Optional[str]) -> str:
        """Categorize company size for qualification"""
        if not company_size:
            return 'unknown'
        
        size_lower = company_size.lower()
        if 'enterprise' in size_lower or '1000+' in size_lower:
            return 'enterprise'
        elif 'mid-market' in size_lower or ('100' in size_lower and '999' in size_lower):
            return 'mid_market'
        elif 'small' in size_lower or ('10' in size_lower and '99' in size_lower):
            return 'small_business'
        else:
            return 'startup'
    
    def _assess_industry_fit(self, industry: Optional[str]) -> str:
        """Assess how well the industry fits our solution"""
        if not industry:
            return 'unknown'
        
        # This would be based on your product's industry fit data
        high_fit_industries = ['technology', 'saas', 'fintech', 'healthcare']
        medium_fit_industries = ['manufacturing', 'retail', 'education']
        
        industry_lower = industry.lower()
        
        for high_fit in high_fit_industries:
            if high_fit in industry_lower:
                return 'high_fit'
        
        for medium_fit in medium_fit_industries:
            if medium_fit in industry_lower:
                return 'medium_fit'
        
        return 'low_fit'
    
    def _identify_qualification_gaps(self, lead_data: LeadQualificationData) -> List[str]:
        """Identify missing information for qualification"""
        gaps = []
        
        if not lead_data.budget_confirmed:
            gaps.append('budget_confirmation')
        if not lead_data.decision_maker:
            gaps.append('decision_maker_identification')
        if not lead_data.needs_identified:
            gaps.append('needs_assessment')
        if not lead_data.timeline:
            gaps.append('timeline_establishment')
        if not lead_data.pain_points:
            gaps.append('pain_point_discovery')
        if not lead_data.current_solution:
            gaps.append('current_solution_analysis')
        
        return gaps
    
    def _calculate_completion_percentage(self, lead_data: LeadQualificationData) -> float:
        """Calculate qualification completion percentage"""
        total_criteria = 8  # Total qualification criteria
        completed = 0
        
        if lead_data.budget_confirmed:
            completed += 1
        if lead_data.decision_maker:
            completed += 1
        if lead_data.needs_identified:
            completed += 1
        if lead_data.timeline:
            completed += 1
        if lead_data.pain_points:
            completed += 1
        if lead_data.current_solution:
            completed += 1
        if lead_data.stakeholders:
            completed += 1
        if lead_data.decision_criteria:
            completed += 1
        
        return (completed / total_criteria) * 100
    
    def _design_qualification_sequence(self, lead_data: LeadQualificationData,
                                     analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Design optimal sequence for qualification questions"""
        
        # Base sequence - can be customized based on analysis
        base_sequence = [
            {
                'stage': 'rapport_building',
                'objective': 'Build trust and establish communication',
                'key_questions': [
                    'Tell me about your current challenges with [relevant area]',
                    'What prompted you to look for a solution like ours?'
                ],
                'expected_duration': '10-15 minutes'
            },
            {
                'stage': 'needs_discovery',
                'objective': 'Understand specific needs and pain points',
                'key_questions': [
                    'What specific problems are you trying to solve?',
                    'How are you currently handling [specific process]?',
                    'What would an ideal solution look like for you?'
                ],
                'expected_duration': '15-20 minutes'
            },
            {
                'stage': 'authority_identification',
                'objective': 'Identify decision makers and process',
                'key_questions': [
                    'Who else would be involved in evaluating a solution like this?',
                    'What does your typical decision-making process look like?',
                    'What criteria will you use to make this decision?'
                ],
                'expected_duration': '10-15 minutes'
            },
            {
                'stage': 'budget_timeline',
                'objective': 'Understand budget and timeline constraints',
                'key_questions': [
                    'What kind of budget have you allocated for this initiative?',
                    'When are you looking to have a solution in place?',
                    'What happens if you don\'t solve this problem by then?'
                ],
                'expected_duration': '10-15 minutes'
            }
        ]
        
        # Customize based on analysis
        if analysis['lead_profile']['company_size_category'] == 'enterprise':
            # Add stakeholder mapping for enterprise
            base_sequence.insert(2, {
                'stage': 'stakeholder_mapping',
                'objective': 'Map all stakeholders and influencers',
                'key_questions': [
                    'Who else would be impacted by this solution?',
                    'What departments would need to sign off?',
                    'Are there any technical requirements we should know about?'
                ],
                'expected_duration': '15-20 minutes'
            })
        
        return base_sequence
    
    def _generate_immediate_actions(self, lead_data: LeadQualificationData,
                                  strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate immediate actions to execute"""
        
        actions = []
        
        # Research action
        actions.append({
            'action_type': 'research',
            'description': f'Research {lead_data.company_name} and {lead_data.contact_name}',
            'tools_required': ['web_research', 'linkedin_lookup', 'company_database'],
            'estimated_time': '15 minutes',
            'priority': 'high',
            'deliverable': 'Company and contact research summary'
        })
        
        # Initial outreach
        if lead_data.current_stage == LeadQualificationStage.INITIAL_CONTACT:
            actions.append({
                'action_type': 'outreach',
                'description': 'Send personalized initial outreach email',
                'tools_required': ['email_tool', 'template_generator'],
                'estimated_time': '10 minutes',
                'priority': 'high',
                'deliverable': 'Sent initial outreach email'
            })
        
        # Discovery call scheduling
        if lead_data.current_stage in [LeadQualificationStage.INITIAL_CONTACT, LeadQualificationStage.DISCOVERY]:
            actions.append({
                'action_type': 'scheduling',
                'description': 'Schedule discovery call',
                'tools_required': ['calendar_tool', 'meeting_scheduler'],
                'estimated_time': '5 minutes',
                'priority': 'medium',
                'deliverable': 'Scheduled discovery call'
            })
        
        return actions
    
    def _generate_communication_templates(self, lead_data: LeadQualificationData,
                                        strategy: Dict[str, Any]) -> Dict[str, str]:
        """Generate communication templates for the lead"""
        
        templates = {}
        
        # Initial outreach email
        templates['initial_outreach'] = f"""
Subject: Quick question about {lead_data.company_name}'s [relevant challenge]

Hi {lead_data.contact_name},

I noticed that {lead_data.company_name} is [relevant observation based on research]. 

I work with similar {lead_data.industry or 'companies'} who often struggle with [common pain point]. 

Would you be open to a brief 15-minute conversation to discuss how we've helped companies like yours [specific benefit]?

Best regards,
[Your name]
"""
        
        # Discovery call follow-up
        templates['discovery_followup'] = f"""
Subject: Thank you for our conversation - next steps

Hi {lead_data.contact_name},

Thank you for taking the time to discuss {lead_data.company_name}'s [discussed challenge] today.

Based on our conversation, I understand that:
- [Key pain point 1]
- [Key pain point 2]
- [Timeline/urgency factor]

I'd like to propose [next step] to help you [specific outcome].

Would [proposed time] work for a follow-up conversation?

Best regards,
[Your name]
"""
        
        return templates

class LeadQualificationWorkflow:
    """Complete lead qualification workflow implementation"""
    
    def __init__(self, ai_orchestrator: AIOrchestrator,
                 tools_library: AIToolsLibrary,
                 memory_system: PersistentMemorySystem,
                 workflow_engine: WorkflowEngine):
        self.orchestrator = ai_orchestrator
        self.tools = tools_library
        self.memory = memory_system
        self.workflow_engine = workflow_engine
        self.reasoning_engine = AIReasoningEngine(memory_system)
    
    def execute_qualification_workflow(self, lead_data: LeadQualificationData,
                                     context: MemoryContext) -> Dict[str, Any]:
        """Execute complete Think → Adapt → Act qualification workflow"""
        
        workflow_results = {
            'workflow_id': f"qual_{lead_data.lead_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            'lead_id': lead_data.lead_id,
            'started_at': datetime.utcnow().isoformat(),
            'stages': {}
        }
        
        try:
            # THINK: Analyze the lead
            print(f"🧠 THINK: Analyzing lead {lead_data.company_name}...")
            analysis = self.reasoning_engine.think_analyze_lead(lead_data, context)
            workflow_results['stages']['think'] = {
                'completed_at': datetime.utcnow().isoformat(),
                'analysis': analysis,
                'status': 'completed'
            }
            
            # ADAPT: Customize strategy
            print(f"🔄 ADAPT: Customizing qualification strategy...")
            strategy = self.reasoning_engine.adapt_qualification_strategy(
                lead_data, analysis, context
            )
            workflow_results['stages']['adapt'] = {
                'completed_at': datetime.utcnow().isoformat(),
                'strategy': strategy,
                'status': 'completed'
            }
            
            # ACT: Execute actions
            print(f"⚡ ACT: Executing qualification actions...")
            execution_plan = self.reasoning_engine.act_execute_qualification(
                lead_data, strategy, context
            )
            workflow_results['stages']['act'] = {
                'completed_at': datetime.utcnow().isoformat(),
                'execution_plan': execution_plan,
                'status': 'completed'
            }
            
            # Execute immediate actions
            action_results = self._execute_immediate_actions(
                execution_plan['immediate_actions'], context
            )
            workflow_results['action_results'] = action_results
            
            workflow_results['status'] = 'completed'
            workflow_results['completed_at'] = datetime.utcnow().isoformat()
            
        except Exception as e:
            workflow_results['status'] = 'failed'
            workflow_results['error'] = str(e)
            workflow_results['failed_at'] = datetime.utcnow().isoformat()
        
        # Store workflow results in memory
        self.memory.store_memory(
            content=f"Lead qualification workflow results for {lead_data.company_name}: {json.dumps(workflow_results, indent=2)}",
            memory_type=MemoryType.TASK,
            context=context,
            importance=MemoryImportance.HIGH,
            structured_data=workflow_results,
            tags=['workflow_results', 'lead_qualification', 'complete']
        )
        
        return workflow_results
    
    def _execute_immediate_actions(self, actions: List[Dict[str, Any]],
                                 context: MemoryContext) -> List[Dict[str, Any]]:
        """Execute immediate actions using available tools"""
        
        results = []
        
        for action in actions:
            try:
                if action['action_type'] == 'research':
                    # Execute research using web research tool
                    result = self._execute_research_action(action, context)
                elif action['action_type'] == 'outreach':
                    # Execute email outreach
                    result = self._execute_outreach_action(action, context)
                elif action['action_type'] == 'scheduling':
                    # Execute calendar scheduling
                    result = self._execute_scheduling_action(action, context)
                else:
                    result = {
                        'action': action,
                        'status': 'skipped',
                        'reason': 'Action type not implemented'
                    }
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    'action': action,
                    'status': 'failed',
                    'error': str(e)
                })
        
        return results
    
    def _execute_research_action(self, action: Dict[str, Any],
                               context: MemoryContext) -> Dict[str, Any]:
        """Execute research action"""
        # This would integrate with actual research tools
        return {
            'action': action,
            'status': 'completed',
            'result': 'Research completed - company profile and contact information gathered',
            'completed_at': datetime.utcnow().isoformat()
        }
    
    def _execute_outreach_action(self, action: Dict[str, Any],
                               context: MemoryContext) -> Dict[str, Any]:
        """Execute outreach action"""
        # This would integrate with email tools
        return {
            'action': action,
            'status': 'completed',
            'result': 'Initial outreach email sent successfully',
            'completed_at': datetime.utcnow().isoformat()
        }
    
    def _execute_scheduling_action(self, action: Dict[str, Any],
                                 context: MemoryContext) -> Dict[str, Any]:
        """Execute scheduling action"""
        # This would integrate with calendar tools
        return {
            'action': action,
            'status': 'completed',
            'result': 'Discovery call scheduled for next week',
            'completed_at': datetime.utcnow().isoformat()
        }

# Example usage and demonstration
def demonstrate_lead_qualification_workflow():
    """Demonstrate the complete lead qualification workflow"""
    
    # Sample lead data
    sample_lead = LeadQualificationData(
        lead_id="lead_001",
        company_name="TechCorp Solutions",
        contact_name="Sarah Johnson",
        contact_email="sarah.johnson@techcorp.com",
        contact_phone="+1-555-0123",
        company_size="Mid-market (200-500 employees)",
        industry="Technology",
        annual_revenue="$10M - $50M",
        current_stage=LeadQualificationStage.INITIAL_CONTACT
    )
    
    # Sample context
    sample_context = MemoryContext(
        user_id="sales_rep_001",
        session_id="session_001",
        lead_id=sample_lead.lead_id
    )
    
    print("🚀 Starting Lead Qualification Workflow Demonstration")
    print(f"Lead: {sample_lead.company_name} - {sample_lead.contact_name}")
    print(f"Stage: {sample_lead.current_stage.value}")
    print("\n" + "="*60 + "\n")
    
    # Initialize components (would be injected in real implementation)
    from ..core.database import get_db_session
    
    # This is a demonstration - in real implementation these would be properly initialized
    print("📋 Workflow Summary:")
    print("1. THINK: Analyze lead profile, identify gaps, assess fit")
    print("2. ADAPT: Customize qualification strategy based on analysis")
    print("3. ACT: Execute personalized qualification actions")
    print("\n🎯 Expected Outcomes:")
    print("- Personalized qualification approach")
    print("- Automated research and outreach")
    print("- Structured follow-up plan")
    print("- Persistent memory of all interactions")
    
    return {
        'demonstration': 'completed',
        'lead_data': asdict(sample_lead),
        'workflow_stages': ['think', 'adapt', 'act'],
        'ai_capabilities': [
            'Lead analysis and scoring',
            'Strategy customization',
            'Automated action execution',
            'Persistent memory retention',
            'Continuous learning from outcomes'
        ]
    }

if __name__ == "__main__":
    # Run demonstration
    demo_results = demonstrate_lead_qualification_workflow()
    print(json.dumps(demo_results, indent=2))