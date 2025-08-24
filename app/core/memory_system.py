from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
from sqlalchemy import Column, String, DateTime, Text, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import hashlib
from collections import defaultdict

Base = declarative_base()

class MemoryType(Enum):
    CONVERSATION = "conversation"
    ENTITY = "entity"  # People, companies, deals
    TASK = "task"
    DECISION = "decision"
    CONTEXT = "context"
    PREFERENCE = "preference"
    SKILL = "skill"  # Learned patterns

class MemoryScope(Enum):
    SESSION = "session"  # Current conversation
    USER = "user"  # Specific user context
    ACCOUNT = "account"  # Account-specific memory
    GLOBAL = "global"  # System-wide patterns

class MemoryImportance(Enum):
    CRITICAL = 5  # Never forget
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    EPHEMERAL = 1  # Can be forgotten

@dataclass
class MemoryVector:
    """Vector representation for semantic similarity"""
    embedding: List[float]
    model: str
    dimension: int
    
    def similarity(self, other: 'MemoryVector') -> float:
        """Calculate cosine similarity"""
        if self.dimension != other.dimension:
            return 0.0
        
        dot_product = sum(a * b for a, b in zip(self.embedding, other.embedding))
        norm_a = sum(a * a for a in self.embedding) ** 0.5
        norm_b = sum(b * b for b in other.embedding) ** 0.5
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        
        return dot_product / (norm_a * norm_b)

@dataclass
class MemoryContext:
    """Context for memory retrieval and storage"""
    user_id: str
    session_id: str
    account_id: Optional[str] = None
    lead_id: Optional[str] = None
    opportunity_id: Optional[str] = None
    current_task: Optional[str] = None
    conversation_turn: int = 0

class AIMemoryEntry(Base):
    """Persistent memory storage for AI agent"""
    __tablename__ = 'ai_memory_entries'
    
    id = Column(String, primary_key=True)
    memory_type = Column(String, nullable=False)  # MemoryType enum
    scope = Column(String, nullable=False)  # MemoryScope enum
    importance = Column(Integer, nullable=False)  # MemoryImportance enum
    
    # Content
    content = Column(Text, nullable=False)
    structured_data = Column(JSON)  # Additional structured information
    tags = Column(JSON)  # List of tags for categorization
    
    # Context
    user_id = Column(String)
    session_id = Column(String)
    account_id = Column(String)
    lead_id = Column(String)
    opportunity_id = Column(String)
    
    # Temporal
    created_at = Column(DateTime, default=datetime.utcnow)
    last_accessed = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)  # Optional expiration
    access_count = Column(Integer, default=0)
    
    # Semantic
    embedding_vector = Column(JSON)  # Stored as JSON array
    embedding_model = Column(String)
    content_hash = Column(String)  # For deduplication
    
    # Relationships
    related_memories = Column(JSON)  # List of related memory IDs
    confidence_score = Column(Float, default=1.0)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'memory_type': self.memory_type,
            'scope': self.scope,
            'importance': self.importance,
            'content': self.content,
            'structured_data': self.structured_data,
            'tags': self.tags,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'account_id': self.account_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_accessed': self.last_accessed.isoformat() if self.last_accessed else None,
            'confidence_score': self.confidence_score
        }

class MemoryRetrieval:
    """Memory retrieval and ranking system"""
    
    def __init__(self):
        self.decay_factor = 0.95  # Memory decay over time
        self.recency_weight = 0.3
        self.frequency_weight = 0.2
        self.importance_weight = 0.3
        self.similarity_weight = 0.2
    
    def calculate_relevance_score(self, memory: AIMemoryEntry, 
                                context: MemoryContext,
                                query_vector: Optional[MemoryVector] = None) -> float:
        """Calculate relevance score for memory retrieval"""
        score = 0.0
        
        # Importance score
        importance_score = memory.importance / 5.0
        score += importance_score * self.importance_weight
        
        # Recency score (exponential decay)
        if memory.last_accessed:
            days_since_access = (datetime.utcnow() - memory.last_accessed).days
            recency_score = self.decay_factor ** days_since_access
            score += recency_score * self.recency_weight
        
        # Frequency score
        frequency_score = min(memory.access_count / 10.0, 1.0)  # Normalize to 0-1
        score += frequency_score * self.frequency_weight
        
        # Semantic similarity
        if query_vector and memory.embedding_vector:
            memory_vector = MemoryVector(
                embedding=memory.embedding_vector,
                model=memory.embedding_model or "default",
                dimension=len(memory.embedding_vector)
            )
            similarity_score = query_vector.similarity(memory_vector)
            score += similarity_score * self.similarity_weight
        
        # Context matching bonus
        context_bonus = self._calculate_context_bonus(memory, context)
        score += context_bonus * 0.1
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _calculate_context_bonus(self, memory: AIMemoryEntry, context: MemoryContext) -> float:
        """Calculate bonus score for context matching"""
        bonus = 0.0
        
        if memory.user_id == context.user_id:
            bonus += 0.3
        if memory.session_id == context.session_id:
            bonus += 0.2
        if memory.account_id == context.account_id and context.account_id:
            bonus += 0.3
        if memory.lead_id == context.lead_id and context.lead_id:
            bonus += 0.2
        
        return bonus

class PersistentMemorySystem:
    """Main memory system for AI agent context retention"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.retrieval = MemoryRetrieval()
        self.max_session_memories = 100
        self.max_user_memories = 1000
        self.cleanup_threshold_days = 30
    
    def store_memory(self, 
                    content: str,
                    memory_type: MemoryType,
                    context: MemoryContext,
                    importance: MemoryImportance = MemoryImportance.MEDIUM,
                    structured_data: Optional[Dict] = None,
                    tags: Optional[List[str]] = None,
                    embedding_vector: Optional[List[float]] = None,
                    expires_in_days: Optional[int] = None) -> str:
        """Store a new memory entry"""
        
        # Generate content hash for deduplication
        content_hash = hashlib.md5(content.encode()).hexdigest()
        
        # Check for existing memory with same content
        existing = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.content_hash == content_hash,
            AIMemoryEntry.user_id == context.user_id
        ).first()
        
        if existing:
            # Update existing memory
            existing.last_accessed = datetime.utcnow()
            existing.access_count += 1
            existing.importance = max(existing.importance, importance.value)
            self.db.commit()
            return existing.id
        
        # Create new memory
        memory_id = f"mem_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{content_hash[:8]}"
        
        # Determine scope
        if context.session_id:
            scope = MemoryScope.SESSION
        elif context.account_id:
            scope = MemoryScope.ACCOUNT
        elif context.user_id:
            scope = MemoryScope.USER
        else:
            scope = MemoryScope.GLOBAL
        
        # Set expiration
        expires_at = None
        if expires_in_days:
            expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        elif importance == MemoryImportance.EPHEMERAL:
            expires_at = datetime.utcnow() + timedelta(days=1)
        
        memory = AIMemoryEntry(
            id=memory_id,
            memory_type=memory_type.value,
            scope=scope.value,
            importance=importance.value,
            content=content,
            structured_data=structured_data,
            tags=tags or [],
            user_id=context.user_id,
            session_id=context.session_id,
            account_id=context.account_id,
            lead_id=context.lead_id,
            opportunity_id=context.opportunity_id,
            embedding_vector=embedding_vector,
            content_hash=content_hash,
            expires_at=expires_at
        )
        
        self.db.add(memory)
        self.db.commit()
        
        # Cleanup old memories if needed
        self._cleanup_old_memories(context)
        
        return memory_id
    
    def retrieve_memories(self,
                         context: MemoryContext,
                         query: Optional[str] = None,
                         query_vector: Optional[MemoryVector] = None,
                         memory_types: Optional[List[MemoryType]] = None,
                         limit: int = 10,
                         min_relevance: float = 0.1) -> List[Dict[str, Any]]:
        """Retrieve relevant memories based on context and query"""
        
        # Build base query
        query_builder = self.db.query(AIMemoryEntry)
        
        # Filter by context
        filters = []
        filters.append(AIMemoryEntry.user_id == context.user_id)
        
        # Add optional filters
        if context.session_id:
            filters.append(AIMemoryEntry.session_id == context.session_id)
        if context.account_id:
            filters.append(AIMemoryEntry.account_id == context.account_id)
        
        # Filter by memory types
        if memory_types:
            type_values = [mt.value for mt in memory_types]
            filters.append(AIMemoryEntry.memory_type.in_(type_values))
        
        # Filter out expired memories
        filters.append(
            (AIMemoryEntry.expires_at.is_(None)) | 
            (AIMemoryEntry.expires_at > datetime.utcnow())
        )
        
        memories = query_builder.filter(*filters).all()
        
        # Calculate relevance scores and rank
        scored_memories = []
        for memory in memories:
            relevance = self.retrieval.calculate_relevance_score(
                memory, context, query_vector
            )
            
            if relevance >= min_relevance:
                # Update access tracking
                memory.last_accessed = datetime.utcnow()
                memory.access_count += 1
                
                scored_memories.append({
                    'memory': memory.to_dict(),
                    'relevance_score': relevance
                })
        
        # Sort by relevance and return top results
        scored_memories.sort(key=lambda x: x['relevance_score'], reverse=True)
        self.db.commit()
        
        return scored_memories[:limit]
    
    def update_memory(self, memory_id: str, 
                     content: Optional[str] = None,
                     structured_data: Optional[Dict] = None,
                     tags: Optional[List[str]] = None,
                     importance: Optional[MemoryImportance] = None) -> bool:
        """Update an existing memory"""
        
        memory = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.id == memory_id
        ).first()
        
        if not memory:
            return False
        
        if content:
            memory.content = content
            memory.content_hash = hashlib.md5(content.encode()).hexdigest()
        
        if structured_data is not None:
            memory.structured_data = structured_data
        
        if tags is not None:
            memory.tags = tags
        
        if importance:
            memory.importance = importance.value
        
        memory.last_accessed = datetime.utcnow()
        self.db.commit()
        
        return True
    
    def forget_memory(self, memory_id: str) -> bool:
        """Delete a specific memory"""
        
        memory = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.id == memory_id
        ).first()
        
        if memory:
            self.db.delete(memory)
            self.db.commit()
            return True
        
        return False
    
    def get_memory_summary(self, context: MemoryContext) -> Dict[str, Any]:
        """Get summary of stored memories for context"""
        
        base_query = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.user_id == context.user_id
        )
        
        total_memories = base_query.count()
        
        # Count by type
        type_counts = defaultdict(int)
        for memory_type in MemoryType:
            count = base_query.filter(
                AIMemoryEntry.memory_type == memory_type.value
            ).count()
            type_counts[memory_type.value] = count
        
        # Recent activity
        recent_memories = base_query.filter(
            AIMemoryEntry.created_at > datetime.utcnow() - timedelta(days=7)
        ).count()
        
        return {
            'total_memories': total_memories,
            'memory_types': dict(type_counts),
            'recent_memories': recent_memories,
            'session_memories': base_query.filter(
                AIMemoryEntry.session_id == context.session_id
            ).count() if context.session_id else 0
        }
    
    def _cleanup_old_memories(self, context: MemoryContext):
        """Clean up old, low-importance memories"""
        
        # Remove expired memories
        self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.expires_at < datetime.utcnow()
        ).delete()
        
        # Limit session memories
        session_memories = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.session_id == context.session_id,
            AIMemoryEntry.importance <= MemoryImportance.LOW.value
        ).order_by(AIMemoryEntry.last_accessed.desc()).offset(
            self.max_session_memories
        ).all()
        
        for memory in session_memories:
            self.db.delete(memory)
        
        # Limit user memories (keep only important ones)
        old_memories = self.db.query(AIMemoryEntry).filter(
            AIMemoryEntry.user_id == context.user_id,
            AIMemoryEntry.importance <= MemoryImportance.MEDIUM.value,
            AIMemoryEntry.last_accessed < datetime.utcnow() - timedelta(
                days=self.cleanup_threshold_days
            )
        ).order_by(AIMemoryEntry.access_count.asc()).offset(
            self.max_user_memories
        ).all()
        
        for memory in old_memories:
            self.db.delete(memory)
        
        self.db.commit()

# Example usage and integration
class MemoryEnhancedAgent:
    """Example of AI agent with persistent memory"""
    
    def __init__(self, memory_system: PersistentMemorySystem):
        self.memory = memory_system
    
    def process_conversation_turn(self, 
                                 user_input: str,
                                 context: MemoryContext) -> Dict[str, Any]:
        """Process a conversation turn with memory integration"""
        
        # Retrieve relevant memories
        relevant_memories = self.memory.retrieve_memories(
            context=context,
            query=user_input,
            memory_types=[MemoryType.CONVERSATION, MemoryType.ENTITY, MemoryType.CONTEXT],
            limit=5
        )
        
        # Store current conversation turn
        self.memory.store_memory(
            content=f"User: {user_input}",
            memory_type=MemoryType.CONVERSATION,
            context=context,
            importance=MemoryImportance.MEDIUM,
            structured_data={
                'turn': context.conversation_turn,
                'timestamp': datetime.utcnow().isoformat()
            }
        )
        
        # Generate response using memories
        response = self._generate_response_with_memory(
            user_input, relevant_memories, context
        )
        
        # Store AI response
        self.memory.store_memory(
            content=f"AI: {response}",
            memory_type=MemoryType.CONVERSATION,
            context=context,
            importance=MemoryImportance.MEDIUM
        )
        
        return {
            'response': response,
            'relevant_memories': relevant_memories,
            'memory_summary': self.memory.get_memory_summary(context)
        }
    
    def _generate_response_with_memory(self, 
                                     user_input: str,
                                     memories: List[Dict],
                                     context: MemoryContext) -> str:
        """Generate response incorporating relevant memories"""
        
        # This would integrate with your LLM/AI system
        memory_context = "\n".join([
            f"Memory: {mem['memory']['content']} (relevance: {mem['relevance_score']:.2f})"
            for mem in memories[:3]
        ])
        
        # Placeholder for actual AI response generation
        return f"Based on our previous conversations and context: {memory_context}\n\nResponse to: {user_input}"