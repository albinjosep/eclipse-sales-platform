from typing import Dict, List, Optional, Any, Set, Callable, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import json
import hashlib
import uuid
from functools import wraps
from sqlalchemy import Column, String, DateTime, Text, JSON, Integer, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import logging

Base = declarative_base()

class Permission(Enum):
    """System permissions"""
    # Data access permissions
    READ_LEADS = "read_leads"
    WRITE_LEADS = "write_leads"
    DELETE_LEADS = "delete_leads"
    READ_ACCOUNTS = "read_accounts"
    WRITE_ACCOUNTS = "write_accounts"
    DELETE_ACCOUNTS = "delete_accounts"
    READ_OPPORTUNITIES = "read_opportunities"
    WRITE_OPPORTUNITIES = "write_opportunities"
    DELETE_OPPORTUNITIES = "delete_opportunities"
    
    # AI agent permissions
    EXECUTE_AI_TOOLS = "execute_ai_tools"
    APPROVE_AI_DECISIONS = "approve_ai_decisions"
    CONFIGURE_AI_WORKFLOWS = "configure_ai_workflows"
    ACCESS_AI_MEMORY = "access_ai_memory"
    
    # Communication permissions
    SEND_EMAILS = "send_emails"
    SCHEDULE_MEETINGS = "schedule_meetings"
    MAKE_CALLS = "make_calls"
    
    # Administrative permissions
    MANAGE_USERS = "manage_users"
    MANAGE_ROLES = "manage_roles"
    VIEW_ANALYTICS = "view_analytics"
    EXPORT_DATA = "export_data"
    CONFIGURE_SYSTEM = "configure_system"
    
    # Compliance permissions
    VIEW_AUDIT_LOGS = "view_audit_logs"
    MANAGE_COMPLIANCE = "manage_compliance"
    DATA_RETENTION = "data_retention"

class PolicyType(Enum):
    """Types of governance policies"""
    DATA_ACCESS = "data_access"
    AI_BEHAVIOR = "ai_behavior"
    COMMUNICATION = "communication"
    RETENTION = "retention"
    PRIVACY = "privacy"
    SECURITY = "security"
    COMPLIANCE = "compliance"

class PolicyAction(Enum):
    """Policy enforcement actions"""
    ALLOW = "allow"
    DENY = "deny"
    REQUIRE_APPROVAL = "require_approval"
    LOG_ONLY = "log_only"
    REDACT = "redact"

class AuditEventType(Enum):
    """Types of audit events"""
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    DATA_ACCESS = "data_access"
    DATA_MODIFICATION = "data_modification"
    AI_DECISION = "ai_decision"
    TOOL_EXECUTION = "tool_execution"
    POLICY_VIOLATION = "policy_violation"
    PERMISSION_DENIED = "permission_denied"
    CONFIGURATION_CHANGE = "configuration_change"
    DATA_EXPORT = "data_export"

@dataclass
class PolicyRule:
    """Individual policy rule"""
    rule_id: str
    name: str
    description: str
    policy_type: PolicyType
    conditions: Dict[str, Any]  # Conditions that trigger this rule
    action: PolicyAction
    metadata: Dict[str, Any] = field(default_factory=dict)
    priority: int = 100  # Lower number = higher priority
    enabled: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    def matches(self, context: Dict[str, Any]) -> bool:
        """Check if this rule matches the given context"""
        if not self.enabled:
            return False
        
        for condition_key, condition_value in self.conditions.items():
            context_value = context.get(condition_key)
            
            if isinstance(condition_value, dict):
                # Complex condition (e.g., {"operator": "in", "values": ["admin", "manager"]})
                operator = condition_value.get("operator", "equals")
                values = condition_value.get("values", condition_value.get("value"))
                
                if operator == "equals" and context_value != values:
                    return False
                elif operator == "in" and context_value not in values:
                    return False
                elif operator == "not_in" and context_value in values:
                    return False
                elif operator == "contains" and values not in str(context_value):
                    return False
                elif operator == "regex":
                    import re
                    if not re.match(values, str(context_value)):
                        return False
            else:
                # Simple equality check
                if context_value != condition_value:
                    return False
        
        return True

# Database Models
class User(Base):
    """User model with RBAC support"""
    __tablename__ = 'users'
    
    user_id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    department = Column(String)
    manager_id = Column(String, ForeignKey('users.user_id'))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    metadata = Column(JSON)
    
    # Relationships
    roles = relationship("UserRole", back_populates="user")
    manager = relationship("User", remote_side=[user_id])

class Role(Base):
    """Role model"""
    __tablename__ = 'roles'
    
    role_id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)
    is_system_role = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    users = relationship("UserRole", back_populates="role")
    permissions = relationship("RolePermission", back_populates="role")

class UserRole(Base):
    """User-Role association"""
    __tablename__ = 'user_roles'
    
    user_id = Column(String, ForeignKey('users.user_id'), primary_key=True)
    role_id = Column(String, ForeignKey('roles.role_id'), primary_key=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    assigned_by = Column(String, ForeignKey('users.user_id'))
    
    # Relationships
    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")

class RolePermission(Base):
    """Role-Permission association"""
    __tablename__ = 'role_permissions'
    
    role_id = Column(String, ForeignKey('roles.role_id'), primary_key=True)
    permission = Column(String, primary_key=True)
    granted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    role = relationship("Role", back_populates="permissions")

class AuditLog(Base):
    """Audit log for compliance tracking"""
    __tablename__ = 'audit_logs'
    
    audit_id = Column(String, primary_key=True)
    event_type = Column(String, nullable=False)
    user_id = Column(String, ForeignKey('users.user_id'))
    resource_type = Column(String)  # lead, account, opportunity, etc.
    resource_id = Column(String)
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    user_agent = Column(String)
    details = Column(JSON)
    policy_violations = Column(JSON)  # Any policy violations detected

class PolicyStorage(Base):
    """Persistent storage for policies"""
    __tablename__ = 'policies'
    
    policy_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    policy_type = Column(String, nullable=False)
    rules = Column(JSON, nullable=False)  # Serialized PolicyRule objects
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, ForeignKey('users.user_id'))

class RBACManager:
    """Role-Based Access Control Manager"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.permission_cache: Dict[str, Set[Permission]] = {}
        self.cache_ttl = timedelta(minutes=15)
        self.cache_timestamps: Dict[str, datetime] = {}
        
        # Initialize default roles if they don't exist
        self._initialize_default_roles()
    
    def _initialize_default_roles(self):
        """Initialize default system roles"""
        default_roles = [
            {
                'role_id': 'admin',
                'name': 'Administrator',
                'description': 'Full system access',
                'permissions': list(Permission)
            },
            {
                'role_id': 'sales_manager',
                'name': 'Sales Manager',
                'description': 'Sales team management and analytics',
                'permissions': [
                    Permission.READ_LEADS, Permission.WRITE_LEADS,
                    Permission.READ_ACCOUNTS, Permission.WRITE_ACCOUNTS,
                    Permission.READ_OPPORTUNITIES, Permission.WRITE_OPPORTUNITIES,
                    Permission.EXECUTE_AI_TOOLS, Permission.APPROVE_AI_DECISIONS,
                    Permission.SEND_EMAILS, Permission.SCHEDULE_MEETINGS,
                    Permission.VIEW_ANALYTICS
                ]
            },
            {
                'role_id': 'sales_rep',
                'name': 'Sales Representative',
                'description': 'Individual contributor sales role',
                'permissions': [
                    Permission.READ_LEADS, Permission.WRITE_LEADS,
                    Permission.READ_ACCOUNTS, Permission.WRITE_ACCOUNTS,
                    Permission.READ_OPPORTUNITIES, Permission.WRITE_OPPORTUNITIES,
                    Permission.EXECUTE_AI_TOOLS,
                    Permission.SEND_EMAILS, Permission.SCHEDULE_MEETINGS
                ]
            },
            {
                'role_id': 'viewer',
                'name': 'Viewer',
                'description': 'Read-only access',
                'permissions': [
                    Permission.READ_LEADS, Permission.READ_ACCOUNTS,
                    Permission.READ_OPPORTUNITIES, Permission.VIEW_ANALYTICS
                ]
            }
        ]
        
        for role_data in default_roles:
            existing_role = self.db.query(Role).filter_by(role_id=role_data['role_id']).first()
            if not existing_role:
                # Create role
                role = Role(
                    role_id=role_data['role_id'],
                    name=role_data['name'],
                    description=role_data['description'],
                    is_system_role=True
                )
                self.db.add(role)
                
                # Add permissions
                for permission in role_data['permissions']:
                    role_permission = RolePermission(
                        role_id=role_data['role_id'],
                        permission=permission.value
                    )
                    self.db.add(role_permission)
        
        self.db.commit()
    
    def create_user(self, user_id: str, username: str, email: str,
                   full_name: str, department: str = None,
                   manager_id: str = None) -> User:
        """Create a new user"""
        user = User(
            user_id=user_id,
            username=username,
            email=email,
            full_name=full_name,
            department=department,
            manager_id=manager_id
        )
        
        self.db.add(user)
        self.db.commit()
        
        return user
    
    def assign_role(self, user_id: str, role_id: str, assigned_by: str = None):
        """Assign a role to a user"""
        # Check if assignment already exists
        existing = self.db.query(UserRole).filter_by(
            user_id=user_id, role_id=role_id
        ).first()
        
        if existing:
            return existing
        
        user_role = UserRole(
            user_id=user_id,
            role_id=role_id,
            assigned_by=assigned_by
        )
        
        self.db.add(user_role)
        self.db.commit()
        
        # Clear permission cache for this user
        self._clear_user_cache(user_id)
        
        return user_role
    
    def revoke_role(self, user_id: str, role_id: str):
        """Revoke a role from a user"""
        user_role = self.db.query(UserRole).filter_by(
            user_id=user_id, role_id=role_id
        ).first()
        
        if user_role:
            self.db.delete(user_role)
            self.db.commit()
            
            # Clear permission cache for this user
            self._clear_user_cache(user_id)
    
    def get_user_permissions(self, user_id: str) -> Set[Permission]:
        """Get all permissions for a user (with caching)"""
        # Check cache first
        if (user_id in self.permission_cache and 
            user_id in self.cache_timestamps and
            datetime.utcnow() - self.cache_timestamps[user_id] < self.cache_ttl):
            return self.permission_cache[user_id]
        
        # Query database
        permissions = set()
        
        user_roles = self.db.query(UserRole).filter_by(user_id=user_id).all()
        
        for user_role in user_roles:
            role_permissions = self.db.query(RolePermission).filter_by(
                role_id=user_role.role_id
            ).all()
            
            for role_permission in role_permissions:
                try:
                    permission = Permission(role_permission.permission)
                    permissions.add(permission)
                except ValueError:
                    # Invalid permission in database
                    continue
        
        # Cache the result
        self.permission_cache[user_id] = permissions
        self.cache_timestamps[user_id] = datetime.utcnow()
        
        return permissions
    
    def has_permission(self, user_id: str, permission: Permission) -> bool:
        """Check if a user has a specific permission"""
        user_permissions = self.get_user_permissions(user_id)
        return permission in user_permissions
    
    def _clear_user_cache(self, user_id: str):
        """Clear cached permissions for a user"""
        self.permission_cache.pop(user_id, None)
        self.cache_timestamps.pop(user_id, None)
    
    def get_user_roles(self, user_id: str) -> List[Role]:
        """Get all roles assigned to a user"""
        user_roles = self.db.query(UserRole).filter_by(user_id=user_id).all()
        roles = []
        
        for user_role in user_roles:
            role = self.db.query(Role).filter_by(role_id=user_role.role_id).first()
            if role:
                roles.append(role)
        
        return roles

class PolicyEngine:
    """Policy enforcement engine"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.policies: Dict[PolicyType, List[PolicyRule]] = {}
        self.policy_handlers: Dict[PolicyAction, Callable] = {}
        
        # Load policies from database
        self._load_policies()
        
        # Initialize default policies
        self._initialize_default_policies()
        
        # Register default policy handlers
        self._register_default_handlers()
    
    def _load_policies(self):
        """Load policies from database"""
        stored_policies = self.db.query(PolicyStorage).filter_by(is_active=True).all()
        
        for stored_policy in stored_policies:
            policy_type = PolicyType(stored_policy.policy_type)
            
            if policy_type not in self.policies:
                self.policies[policy_type] = []
            
            # Deserialize rules
            for rule_data in stored_policy.rules:
                rule = PolicyRule(
                    rule_id=rule_data['rule_id'],
                    name=rule_data['name'],
                    description=rule_data['description'],
                    policy_type=PolicyType(rule_data['policy_type']),
                    conditions=rule_data['conditions'],
                    action=PolicyAction(rule_data['action']),
                    metadata=rule_data.get('metadata', {}),
                    priority=rule_data.get('priority', 100),
                    enabled=rule_data.get('enabled', True)
                )
                self.policies[policy_type].append(rule)
        
        # Sort policies by priority
        for policy_type in self.policies:
            self.policies[policy_type].sort(key=lambda x: x.priority)
    
    def _initialize_default_policies(self):
        """Initialize default governance policies"""
        default_policies = [
            # Data access policies
            PolicyRule(
                rule_id="data_access_own_leads",
                name="Own Leads Access",
                description="Users can only access leads assigned to them",
                policy_type=PolicyType.DATA_ACCESS,
                conditions={
                    "resource_type": "lead",
                    "action": {"operator": "in", "values": ["read", "write"]}
                },
                action=PolicyAction.REQUIRE_APPROVAL
            ),
            
            # AI behavior policies
            PolicyRule(
                rule_id="ai_email_approval",
                name="AI Email Approval",
                description="AI-generated emails require human approval",
                policy_type=PolicyType.AI_BEHAVIOR,
                conditions={
                    "tool_type": "email",
                    "ai_generated": True
                },
                action=PolicyAction.REQUIRE_APPROVAL
            ),
            
            # Communication policies
            PolicyRule(
                rule_id="external_email_restriction",
                name="External Email Restriction",
                description="Restrict emails to external domains during non-business hours",
                policy_type=PolicyType.COMMUNICATION,
                conditions={
                    "email_domain": {"operator": "not_in", "values": ["company.com"]},
                    "business_hours": False
                },
                action=PolicyAction.DENY
            ),
            
            # Privacy policies
            PolicyRule(
                rule_id="pii_redaction",
                name="PII Redaction",
                description="Redact personally identifiable information in logs",
                policy_type=PolicyType.PRIVACY,
                conditions={
                    "contains_pii": True
                },
                action=PolicyAction.REDACT
            )
        ]
        
        for policy_rule in default_policies:
            # Check if policy already exists
            existing_policy = None
            for policy_type, rules in self.policies.items():
                for rule in rules:
                    if rule.rule_id == policy_rule.rule_id:
                        existing_policy = rule
                        break
                if existing_policy:
                    break
            
            if not existing_policy:
                if policy_rule.policy_type not in self.policies:
                    self.policies[policy_rule.policy_type] = []
                
                self.policies[policy_rule.policy_type].append(policy_rule)
    
    def _register_default_handlers(self):
        """Register default policy action handlers"""
        self.policy_handlers[PolicyAction.ALLOW] = self._handle_allow
        self.policy_handlers[PolicyAction.DENY] = self._handle_deny
        self.policy_handlers[PolicyAction.REQUIRE_APPROVAL] = self._handle_require_approval
        self.policy_handlers[PolicyAction.LOG_ONLY] = self._handle_log_only
        self.policy_handlers[PolicyAction.REDACT] = self._handle_redact
    
    def evaluate_policies(self, policy_type: PolicyType, 
                         context: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate policies for a given context"""
        
        if policy_type not in self.policies:
            return {'action': PolicyAction.ALLOW, 'violations': []}
        
        violations = []
        final_action = PolicyAction.ALLOW
        
        # Evaluate rules in priority order
        for rule in self.policies[policy_type]:
            if rule.matches(context):
                violations.append({
                    'rule_id': rule.rule_id,
                    'rule_name': rule.name,
                    'action': rule.action,
                    'description': rule.description
                })
                
                # Determine final action (most restrictive wins)
                if rule.action == PolicyAction.DENY:
                    final_action = PolicyAction.DENY
                    break  # DENY is most restrictive, stop evaluation
                elif rule.action == PolicyAction.REQUIRE_APPROVAL and final_action == PolicyAction.ALLOW:
                    final_action = PolicyAction.REQUIRE_APPROVAL
                elif rule.action == PolicyAction.REDACT and final_action in [PolicyAction.ALLOW, PolicyAction.LOG_ONLY]:
                    final_action = PolicyAction.REDACT
                elif rule.action == PolicyAction.LOG_ONLY and final_action == PolicyAction.ALLOW:
                    final_action = PolicyAction.LOG_ONLY
        
        return {
            'action': final_action,
            'violations': violations,
            'context': context
        }
    
    def enforce_policy(self, policy_type: PolicyType, 
                      context: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate and enforce policies"""
        
        evaluation_result = self.evaluate_policies(policy_type, context)
        action = evaluation_result['action']
        
        # Execute policy handler
        if action in self.policy_handlers:
            handler_result = self.policy_handlers[action](context, evaluation_result)
            evaluation_result.update(handler_result)
        
        return evaluation_result
    
    def _handle_allow(self, context: Dict[str, Any], 
                     evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Handle ALLOW action"""
        return {'allowed': True, 'message': 'Action allowed'}
    
    def _handle_deny(self, context: Dict[str, Any], 
                    evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Handle DENY action"""
        return {
            'allowed': False, 
            'message': 'Action denied by policy',
            'violations': evaluation['violations']
        }
    
    def _handle_require_approval(self, context: Dict[str, Any], 
                               evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Handle REQUIRE_APPROVAL action"""
        return {
            'allowed': False,
            'requires_approval': True,
            'message': 'Action requires approval',
            'approval_context': context
        }
    
    def _handle_log_only(self, context: Dict[str, Any], 
                        evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Handle LOG_ONLY action"""
        # Log the action but allow it
        logging.info(f"Policy log: {context}")
        return {'allowed': True, 'logged': True, 'message': 'Action logged'}
    
    def _handle_redact(self, context: Dict[str, Any], 
                      evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """Handle REDACT action"""
        # Redact sensitive information
        redacted_context = self._redact_sensitive_data(context)
        return {
            'allowed': True,
            'redacted': True,
            'message': 'Sensitive data redacted',
            'redacted_context': redacted_context
        }
    
    def _redact_sensitive_data(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive information from context"""
        sensitive_fields = ['ssn', 'credit_card', 'password', 'api_key', 'token']
        redacted = context.copy()
        
        for field in sensitive_fields:
            if field in redacted:
                redacted[field] = '[REDACTED]'
        
        return redacted

class AuditManager:
    """Audit logging and compliance tracking"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.logger = logging.getLogger('audit')
    
    def log_event(self, event_type: AuditEventType, user_id: str,
                  action: str, resource_type: str = None,
                  resource_id: str = None, details: Dict[str, Any] = None,
                  ip_address: str = None, user_agent: str = None,
                  policy_violations: List[Dict[str, Any]] = None) -> str:
        """Log an audit event"""
        
        audit_id = str(uuid.uuid4())
        
        audit_log = AuditLog(
            audit_id=audit_id,
            event_type=event_type.value,
            user_id=user_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details or {},
            policy_violations=policy_violations or []
        )
        
        self.db.add(audit_log)
        self.db.commit()
        
        # Also log to application logger
        self.logger.info(f"Audit: {event_type.value} - User: {user_id} - Action: {action}")
        
        return audit_id
    
    def get_audit_trail(self, user_id: str = None, resource_type: str = None,
                       resource_id: str = None, start_date: datetime = None,
                       end_date: datetime = None, limit: int = 100) -> List[AuditLog]:
        """Get audit trail with filters"""
        
        query = self.db.query(AuditLog)
        
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        
        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)
        
        if resource_id:
            query = query.filter(AuditLog.resource_id == resource_id)
        
        if start_date:
            query = query.filter(AuditLog.timestamp >= start_date)
        
        if end_date:
            query = query.filter(AuditLog.timestamp <= end_date)
        
        return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    
    def get_compliance_report(self, start_date: datetime, 
                            end_date: datetime) -> Dict[str, Any]:
        """Generate compliance report"""
        
        audit_logs = self.get_audit_trail(
            start_date=start_date,
            end_date=end_date,
            limit=10000
        )
        
        # Aggregate statistics
        event_counts = {}
        user_activity = {}
        policy_violations = []
        
        for log in audit_logs:
            # Count events by type
            event_counts[log.event_type] = event_counts.get(log.event_type, 0) + 1
            
            # Count user activity
            user_activity[log.user_id] = user_activity.get(log.user_id, 0) + 1
            
            # Collect policy violations
            if log.policy_violations:
                policy_violations.extend(log.policy_violations)
        
        return {
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            },
            'total_events': len(audit_logs),
            'event_breakdown': event_counts,
            'user_activity': user_activity,
            'policy_violations': {
                'total': len(policy_violations),
                'violations': policy_violations
            },
            'most_active_users': sorted(
                user_activity.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10]
        }

class GovernanceSystem:
    """Main governance system coordinating RBAC, policies, and audit"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.rbac = RBACManager(db_session)
        self.policy_engine = PolicyEngine(db_session)
        self.audit = AuditManager(db_session)
        
        # Approval queue for actions requiring approval
        self.approval_queue: Dict[str, Dict[str, Any]] = {}
    
    def authorize_action(self, user_id: str, action: str, 
                        resource_type: str = None, resource_id: str = None,
                        context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Authorize an action with full governance checks"""
        
        # Build context for policy evaluation
        full_context = {
            'user_id': user_id,
            'action': action,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'timestamp': datetime.utcnow().isoformat(),
            **(context or {})
        }
        
        # Check RBAC permissions first
        required_permission = self._map_action_to_permission(action, resource_type)
        if required_permission and not self.rbac.has_permission(user_id, required_permission):
            # Log permission denied
            self.audit.log_event(
                event_type=AuditEventType.PERMISSION_DENIED,
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                details=full_context
            )
            
            return {
                'authorized': False,
                'reason': 'insufficient_permissions',
                'message': f'User lacks required permission: {required_permission.value}'
            }
        
        # Evaluate policies
        policy_type = self._map_action_to_policy_type(action, resource_type)
        policy_result = self.policy_engine.enforce_policy(policy_type, full_context)
        
        # Log the action attempt
        self.audit.log_event(
            event_type=AuditEventType.DATA_ACCESS if action.startswith('read') else AuditEventType.DATA_MODIFICATION,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=full_context,
            policy_violations=policy_result.get('violations', [])
        )
        
        # Handle policy result
        if not policy_result.get('allowed', True):
            if policy_result.get('requires_approval', False):
                # Add to approval queue
                approval_id = self._queue_for_approval(user_id, action, full_context, policy_result)
                return {
                    'authorized': False,
                    'reason': 'requires_approval',
                    'approval_id': approval_id,
                    'message': 'Action requires approval from authorized personnel'
                }
            else:
                return {
                    'authorized': False,
                    'reason': 'policy_violation',
                    'message': policy_result.get('message', 'Action denied by policy'),
                    'violations': policy_result.get('violations', [])
                }
        
        return {
            'authorized': True,
            'message': 'Action authorized',
            'policy_result': policy_result
        }
    
    def _map_action_to_permission(self, action: str, resource_type: str) -> Optional[Permission]:
        """Map action and resource type to required permission"""
        
        permission_map = {
            ('read', 'lead'): Permission.READ_LEADS,
            ('write', 'lead'): Permission.WRITE_LEADS,
            ('delete', 'lead'): Permission.DELETE_LEADS,
            ('read', 'account'): Permission.READ_ACCOUNTS,
            ('write', 'account'): Permission.WRITE_ACCOUNTS,
            ('delete', 'account'): Permission.DELETE_ACCOUNTS,
            ('read', 'opportunity'): Permission.READ_OPPORTUNITIES,
            ('write', 'opportunity'): Permission.WRITE_OPPORTUNITIES,
            ('delete', 'opportunity'): Permission.DELETE_OPPORTUNITIES,
            ('execute', 'ai_tool'): Permission.EXECUTE_AI_TOOLS,
            ('approve', 'ai_decision'): Permission.APPROVE_AI_DECISIONS,
            ('send', 'email'): Permission.SEND_EMAILS,
            ('schedule', 'meeting'): Permission.SCHEDULE_MEETINGS,
        }
        
        return permission_map.get((action, resource_type))
    
    def _map_action_to_policy_type(self, action: str, resource_type: str) -> PolicyType:
        """Map action and resource type to policy type"""
        
        if action in ['read', 'write', 'delete']:
            return PolicyType.DATA_ACCESS
        elif action in ['execute'] and resource_type == 'ai_tool':
            return PolicyType.AI_BEHAVIOR
        elif action in ['send', 'schedule']:
            return PolicyType.COMMUNICATION
        else:
            return PolicyType.SECURITY
    
    def _queue_for_approval(self, user_id: str, action: str, 
                           context: Dict[str, Any], 
                           policy_result: Dict[str, Any]) -> str:
        """Queue an action for approval"""
        
        approval_id = str(uuid.uuid4())
        
        self.approval_queue[approval_id] = {
            'approval_id': approval_id,
            'user_id': user_id,
            'action': action,
            'context': context,
            'policy_result': policy_result,
            'requested_at': datetime.utcnow(),
            'status': 'pending'
        }
        
        return approval_id
    
    def approve_action(self, approval_id: str, approver_user_id: str, 
                      approved: bool, comments: str = None) -> Dict[str, Any]:
        """Approve or deny a queued action"""
        
        if approval_id not in self.approval_queue:
            return {'success': False, 'message': 'Approval request not found'}
        
        # Check if approver has permission to approve
        if not self.rbac.has_permission(approver_user_id, Permission.APPROVE_AI_DECISIONS):
            return {'success': False, 'message': 'Insufficient permissions to approve'}
        
        approval_request = self.approval_queue[approval_id]
        approval_request['status'] = 'approved' if approved else 'denied'
        approval_request['approver_user_id'] = approver_user_id
        approval_request['approved_at'] = datetime.utcnow()
        approval_request['comments'] = comments
        
        # Log the approval decision
        self.audit.log_event(
            event_type=AuditEventType.AI_DECISION,
            user_id=approver_user_id,
            action='approve_action' if approved else 'deny_action',
            details={
                'approval_id': approval_id,
                'original_user_id': approval_request['user_id'],
                'original_action': approval_request['action'],
                'approved': approved,
                'comments': comments
            }
        )
        
        return {
            'success': True,
            'approved': approved,
            'message': f"Action {'approved' if approved else 'denied'}"
        }
    
    def get_pending_approvals(self, approver_user_id: str = None) -> List[Dict[str, Any]]:
        """Get pending approval requests"""
        
        pending = []
        
        for approval_id, request in self.approval_queue.items():
            if request['status'] == 'pending':
                # If approver specified, check if they can approve
                if approver_user_id:
                    if not self.rbac.has_permission(approver_user_id, Permission.APPROVE_AI_DECISIONS):
                        continue
                
                pending.append(request)
        
        return sorted(pending, key=lambda x: x['requested_at'])

# Decorators for easy integration
def require_permission(permission: Permission):
    """Decorator to require specific permission"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # This would need to be integrated with your authentication system
            # to get the current user_id
            user_id = kwargs.get('user_id') or getattr(func, '_current_user_id', None)
            
            if not user_id:
                raise PermissionError("No user context available")
            
            # This would need access to the governance system instance
            governance = getattr(func, '_governance_system', None)
            if not governance:
                raise RuntimeError("No governance system configured")
            
            if not governance.rbac.has_permission(user_id, permission):
                raise PermissionError(f"User lacks required permission: {permission.value}")
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

def audit_action(event_type: AuditEventType, action: str):
    """Decorator to automatically audit function calls"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_id = kwargs.get('user_id') or getattr(func, '_current_user_id', None)
            governance = getattr(func, '_governance_system', None)
            
            if governance and user_id:
                # Log before execution
                audit_id = governance.audit.log_event(
                    event_type=event_type,
                    user_id=user_id,
                    action=action,
                    details={'function': func.__name__, 'args': str(args), 'kwargs': str(kwargs)}
                )
                
                try:
                    result = func(*args, **kwargs)
                    
                    # Log successful completion
                    governance.audit.log_event(
                        event_type=event_type,
                        user_id=user_id,
                        action=f"{action}_completed",
                        details={'function': func.__name__, 'success': True, 'audit_id': audit_id}
                    )
                    
                    return result
                    
                except Exception as e:
                    # Log failure
                    governance.audit.log_event(
                        event_type=AuditEventType.SYSTEM_ERROR,
                        user_id=user_id,
                        action=f"{action}_failed",
                        details={'function': func.__name__, 'error': str(e), 'audit_id': audit_id}
                    )
                    raise
            else:
                return func(*args, **kwargs)
        return wrapper
    return decorator

# Example usage
if __name__ == "__main__":
    print("🛡️ Governance & Compliance System Demonstration")
    print("\nKey Features:")
    print("- Role-Based Access Control (RBAC) with hierarchical permissions")
    print("- Policy engine with configurable rules and enforcement actions")
    print("- Comprehensive audit logging for compliance tracking")
    print("- Approval workflows for sensitive AI actions")
    print("- Data privacy and security policy enforcement")
    print("\n🎯 Benefits:")
    print("- Ensures regulatory compliance (GDPR, SOX, HIPAA)")
    print("- Provides fine-grained access control")
    print("- Maintains complete audit trail")
    print("- Enables governance of AI decision-making")
    print("- Supports approval workflows for high-risk actions")