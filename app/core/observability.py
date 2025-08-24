from typing import Dict, List, Optional, Any, Callable, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
from collections import defaultdict, deque
import json
import time
import asyncio
from contextlib import contextmanager
import logging
from sqlalchemy import Column, String, DateTime, Text, JSON, Integer, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class MetricType(Enum):
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"

class EventType(Enum):
    AI_DECISION = "ai_decision"
    TOOL_EXECUTION = "tool_execution"
    WORKFLOW_STEP = "workflow_step"
    USER_INTERACTION = "user_interaction"
    SYSTEM_ERROR = "system_error"
    PERFORMANCE = "performance"
    BUSINESS_OUTCOME = "business_outcome"

class SeverityLevel(Enum):
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class TelemetryEvent:
    """Individual telemetry event"""
    event_id: str
    event_type: EventType
    timestamp: datetime
    source: str  # Component that generated the event
    severity: SeverityLevel
    message: str
    metadata: Dict[str, Any]
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    trace_id: Optional[str] = None
    parent_span_id: Optional[str] = None
    span_id: Optional[str] = None
    duration_ms: Optional[float] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'event_id': self.event_id,
            'event_type': self.event_type.value,
            'timestamp': self.timestamp.isoformat(),
            'source': self.source,
            'severity': self.severity.value,
            'message': self.message,
            'metadata': self.metadata,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'trace_id': self.trace_id,
            'parent_span_id': self.parent_span_id,
            'span_id': self.span_id,
            'duration_ms': self.duration_ms
        }

@dataclass
class Metric:
    """System metric"""
    name: str
    metric_type: MetricType
    value: Union[int, float]
    timestamp: datetime
    tags: Dict[str, str]
    description: Optional[str] = None

@dataclass
class FeedbackEvent:
    """User or system feedback event"""
    feedback_id: str
    source: str  # user, system, ai_agent
    target_event_id: Optional[str]  # Event being rated
    target_decision_id: Optional[str]  # AI decision being rated
    rating: Optional[float]  # 1-5 scale or 0-1 scale
    feedback_type: str  # thumbs_up, thumbs_down, rating, comment
    content: Optional[str]  # Text feedback
    timestamp: datetime
    metadata: Dict[str, Any]

class TelemetryStorage(Base):
    """Persistent storage for telemetry events"""
    __tablename__ = 'telemetry_events'
    
    event_id = Column(String, primary_key=True)
    event_type = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    source = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    message = Column(Text)
    metadata = Column(JSON)
    user_id = Column(String)
    session_id = Column(String)
    trace_id = Column(String)
    parent_span_id = Column(String)
    span_id = Column(String)
    duration_ms = Column(Float)

class FeedbackStorage(Base):
    """Persistent storage for feedback events"""
    __tablename__ = 'feedback_events'
    
    feedback_id = Column(String, primary_key=True)
    source = Column(String, nullable=False)
    target_event_id = Column(String)
    target_decision_id = Column(String)
    rating = Column(Float)
    feedback_type = Column(String, nullable=False)
    content = Column(Text)
    timestamp = Column(DateTime, nullable=False)
    metadata = Column(JSON)

class MetricsCollector:
    """Collects and aggregates system metrics"""
    
    def __init__(self):
        self.metrics: Dict[str, List[Metric]] = defaultdict(list)
        self.counters: Dict[str, int] = defaultdict(int)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, List[float]] = defaultdict(list)
        self.timers: Dict[str, List[float]] = defaultdict(list)
        
        # Performance tracking
        self.active_spans: Dict[str, float] = {}  # span_id -> start_time
        
    def increment_counter(self, name: str, value: int = 1, tags: Optional[Dict[str, str]] = None):
        """Increment a counter metric"""
        self.counters[name] += value
        metric = Metric(
            name=name,
            metric_type=MetricType.COUNTER,
            value=self.counters[name],
            timestamp=datetime.utcnow(),
            tags=tags or {}
        )
        self.metrics[name].append(metric)
    
    def set_gauge(self, name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Set a gauge metric"""
        self.gauges[name] = value
        metric = Metric(
            name=name,
            metric_type=MetricType.GAUGE,
            value=value,
            timestamp=datetime.utcnow(),
            tags=tags or {}
        )
        self.metrics[name].append(metric)
    
    def record_histogram(self, name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Record a histogram value"""
        self.histograms[name].append(value)
        metric = Metric(
            name=name,
            metric_type=MetricType.HISTOGRAM,
            value=value,
            timestamp=datetime.utcnow(),
            tags=tags or {}
        )
        self.metrics[name].append(metric)
    
    def start_timer(self, name: str) -> str:
        """Start a timer and return span ID"""
        span_id = str(uuid.uuid4())
        self.active_spans[span_id] = time.time()
        return span_id
    
    def end_timer(self, name: str, span_id: str, tags: Optional[Dict[str, str]] = None) -> float:
        """End a timer and record the duration"""
        if span_id not in self.active_spans:
            return 0.0
        
        start_time = self.active_spans.pop(span_id)
        duration = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        self.timers[name].append(duration)
        metric = Metric(
            name=name,
            metric_type=MetricType.TIMER,
            value=duration,
            timestamp=datetime.utcnow(),
            tags=tags or {}
        )
        self.metrics[name].append(metric)
        
        return duration
    
    def get_metric_summary(self, name: str) -> Dict[str, Any]:
        """Get summary statistics for a metric"""
        if name not in self.metrics:
            return {}
        
        recent_metrics = self.metrics[name][-100:]  # Last 100 values
        values = [m.value for m in recent_metrics]
        
        if not values:
            return {}
        
        return {
            'count': len(values),
            'min': min(values),
            'max': max(values),
            'avg': sum(values) / len(values),
            'latest': values[-1],
            'timestamp': recent_metrics[-1].timestamp.isoformat()
        }

class DistributedTracing:
    """Distributed tracing for request flows"""
    
    def __init__(self):
        self.active_traces: Dict[str, Dict[str, Any]] = {}
        self.completed_traces: deque = deque(maxlen=1000)
    
    def start_trace(self, operation_name: str, user_id: Optional[str] = None) -> str:
        """Start a new trace"""
        trace_id = str(uuid.uuid4())
        
        self.active_traces[trace_id] = {
            'trace_id': trace_id,
            'operation_name': operation_name,
            'user_id': user_id,
            'start_time': time.time(),
            'spans': [],
            'status': 'active'
        }
        
        return trace_id
    
    def start_span(self, trace_id: str, span_name: str, 
                   parent_span_id: Optional[str] = None) -> str:
        """Start a new span within a trace"""
        if trace_id not in self.active_traces:
            return ""
        
        span_id = str(uuid.uuid4())
        span = {
            'span_id': span_id,
            'span_name': span_name,
            'parent_span_id': parent_span_id,
            'start_time': time.time(),
            'end_time': None,
            'duration_ms': None,
            'status': 'active',
            'tags': {},
            'logs': []
        }
        
        self.active_traces[trace_id]['spans'].append(span)
        return span_id
    
    def end_span(self, trace_id: str, span_id: str, 
                 status: str = 'completed', tags: Optional[Dict[str, str]] = None):
        """End a span"""
        if trace_id not in self.active_traces:
            return
        
        trace = self.active_traces[trace_id]
        for span in trace['spans']:
            if span['span_id'] == span_id:
                span['end_time'] = time.time()
                span['duration_ms'] = (span['end_time'] - span['start_time']) * 1000
                span['status'] = status
                if tags:
                    span['tags'].update(tags)
                break
    
    def end_trace(self, trace_id: str, status: str = 'completed'):
        """End a trace"""
        if trace_id not in self.active_traces:
            return
        
        trace = self.active_traces.pop(trace_id)
        trace['end_time'] = time.time()
        trace['duration_ms'] = (trace['end_time'] - trace['start_time']) * 1000
        trace['status'] = status
        
        self.completed_traces.append(trace)
    
    def get_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        """Get trace information"""
        # Check active traces first
        if trace_id in self.active_traces:
            return self.active_traces[trace_id]
        
        # Check completed traces
        for trace in self.completed_traces:
            if trace['trace_id'] == trace_id:
                return trace
        
        return None

class FeedbackLoop:
    """Feedback collection and processing system"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.feedback_handlers: Dict[str, List[Callable]] = defaultdict(list)
        self.feedback_buffer: deque = deque(maxlen=1000)
    
    def register_feedback_handler(self, feedback_type: str, handler: Callable):
        """Register a handler for specific feedback types"""
        self.feedback_handlers[feedback_type].append(handler)
    
    def collect_feedback(self, source: str, feedback_type: str,
                        target_event_id: Optional[str] = None,
                        target_decision_id: Optional[str] = None,
                        rating: Optional[float] = None,
                        content: Optional[str] = None,
                        metadata: Optional[Dict[str, Any]] = None) -> str:
        """Collect feedback from users or systems"""
        
        feedback_id = str(uuid.uuid4())
        feedback = FeedbackEvent(
            feedback_id=feedback_id,
            source=source,
            target_event_id=target_event_id,
            target_decision_id=target_decision_id,
            rating=rating,
            feedback_type=feedback_type,
            content=content,
            timestamp=datetime.utcnow(),
            metadata=metadata or {}
        )
        
        # Store in buffer
        self.feedback_buffer.append(feedback)
        
        # Store in database
        feedback_record = FeedbackStorage(
            feedback_id=feedback.feedback_id,
            source=feedback.source,
            target_event_id=feedback.target_event_id,
            target_decision_id=feedback.target_decision_id,
            rating=feedback.rating,
            feedback_type=feedback.feedback_type,
            content=feedback.content,
            timestamp=feedback.timestamp,
            metadata=feedback.metadata
        )
        
        self.db.add(feedback_record)
        self.db.commit()
        
        # Process feedback through handlers
        self._process_feedback(feedback)
        
        return feedback_id
    
    def _process_feedback(self, feedback: FeedbackEvent):
        """Process feedback through registered handlers"""
        handlers = self.feedback_handlers.get(feedback.feedback_type, [])
        
        for handler in handlers:
            try:
                handler(feedback)
            except Exception as e:
                # Log error but don't fail the feedback collection
                logging.error(f"Feedback handler error: {e}")
    
    def get_feedback_summary(self, target_type: str = None,
                           days: int = 7) -> Dict[str, Any]:
        """Get feedback summary for analysis"""
        
        since_date = datetime.utcnow() - timedelta(days=days)
        
        query = self.db.query(FeedbackStorage).filter(
            FeedbackStorage.timestamp >= since_date
        )
        
        if target_type:
            query = query.filter(FeedbackStorage.feedback_type == target_type)
        
        feedback_records = query.all()
        
        # Aggregate statistics
        total_feedback = len(feedback_records)
        ratings = [f.rating for f in feedback_records if f.rating is not None]
        
        feedback_by_type = defaultdict(int)
        feedback_by_source = defaultdict(int)
        
        for feedback in feedback_records:
            feedback_by_type[feedback.feedback_type] += 1
            feedback_by_source[feedback.source] += 1
        
        return {
            'total_feedback': total_feedback,
            'average_rating': sum(ratings) / len(ratings) if ratings else None,
            'rating_distribution': self._calculate_rating_distribution(ratings),
            'feedback_by_type': dict(feedback_by_type),
            'feedback_by_source': dict(feedback_by_source),
            'period_days': days
        }
    
    def _calculate_rating_distribution(self, ratings: List[float]) -> Dict[str, int]:
        """Calculate distribution of ratings"""
        if not ratings:
            return {}
        
        distribution = defaultdict(int)
        for rating in ratings:
            if rating >= 4.5:
                distribution['excellent'] += 1
            elif rating >= 3.5:
                distribution['good'] += 1
            elif rating >= 2.5:
                distribution['average'] += 1
            elif rating >= 1.5:
                distribution['poor'] += 1
            else:
                distribution['very_poor'] += 1
        
        return dict(distribution)

class ObservabilitySystem:
    """Main observability system coordinating all components"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.metrics = MetricsCollector()
        self.tracing = DistributedTracing()
        self.feedback = FeedbackLoop(db_session)
        self.event_buffer: deque = deque(maxlen=10000)
        
        # Configure logging
        self.logger = logging.getLogger('observability')
        
        # Performance thresholds
        self.performance_thresholds = {
            'ai_decision_time_ms': 5000,
            'tool_execution_time_ms': 10000,
            'workflow_step_time_ms': 30000,
            'api_response_time_ms': 2000
        }
    
    def emit_event(self, event_type: EventType, source: str, message: str,
                   severity: SeverityLevel = SeverityLevel.INFO,
                   metadata: Optional[Dict[str, Any]] = None,
                   user_id: Optional[str] = None,
                   session_id: Optional[str] = None,
                   trace_id: Optional[str] = None,
                   span_id: Optional[str] = None,
                   duration_ms: Optional[float] = None) -> str:
        """Emit a telemetry event"""
        
        event_id = str(uuid.uuid4())
        event = TelemetryEvent(
            event_id=event_id,
            event_type=event_type,
            timestamp=datetime.utcnow(),
            source=source,
            severity=severity,
            message=message,
            metadata=metadata or {},
            user_id=user_id,
            session_id=session_id,
            trace_id=trace_id,
            span_id=span_id,
            duration_ms=duration_ms
        )
        
        # Add to buffer
        self.event_buffer.append(event)
        
        # Store in database
        event_record = TelemetryStorage(
            event_id=event.event_id,
            event_type=event.event_type.value,
            timestamp=event.timestamp,
            source=event.source,
            severity=event.severity.value,
            message=event.message,
            metadata=event.metadata,
            user_id=event.user_id,
            session_id=event.session_id,
            trace_id=event.trace_id,
            span_id=event.span_id,
            duration_ms=event.duration_ms
        )
        
        self.db.add(event_record)
        self.db.commit()
        
        # Check for performance issues
        self._check_performance_thresholds(event)
        
        # Log based on severity
        if severity == SeverityLevel.ERROR or severity == SeverityLevel.CRITICAL:
            self.logger.error(f"{source}: {message}")
        elif severity == SeverityLevel.WARNING:
            self.logger.warning(f"{source}: {message}")
        else:
            self.logger.info(f"{source}: {message}")
        
        return event_id
    
    def _check_performance_thresholds(self, event: TelemetryEvent):
        """Check if event exceeds performance thresholds"""
        if event.duration_ms is None:
            return
        
        threshold_key = f"{event.event_type.value}_time_ms"
        threshold = self.performance_thresholds.get(threshold_key)
        
        if threshold and event.duration_ms > threshold:
            self.emit_event(
                event_type=EventType.PERFORMANCE,
                source="performance_monitor",
                message=f"Performance threshold exceeded: {event.source} took {event.duration_ms}ms (threshold: {threshold}ms)",
                severity=SeverityLevel.WARNING,
                metadata={
                    'original_event_id': event.event_id,
                    'duration_ms': event.duration_ms,
                    'threshold_ms': threshold,
                    'exceeded_by_ms': event.duration_ms - threshold
                }
            )
    
    @contextmanager
    def trace_operation(self, operation_name: str, user_id: Optional[str] = None):
        """Context manager for tracing operations"""
        trace_id = self.tracing.start_trace(operation_name, user_id)
        
        try:
            yield trace_id
            self.tracing.end_trace(trace_id, 'completed')
        except Exception as e:
            self.tracing.end_trace(trace_id, 'error')
            self.emit_event(
                event_type=EventType.SYSTEM_ERROR,
                source=operation_name,
                message=f"Operation failed: {str(e)}",
                severity=SeverityLevel.ERROR,
                trace_id=trace_id,
                metadata={'error_type': type(e).__name__, 'error_message': str(e)}
            )
            raise
    
    @contextmanager
    def trace_span(self, trace_id: str, span_name: str, 
                   parent_span_id: Optional[str] = None):
        """Context manager for tracing spans"""
        span_id = self.tracing.start_span(trace_id, span_name, parent_span_id)
        start_time = time.time()
        
        try:
            yield span_id
            duration_ms = (time.time() - start_time) * 1000
            self.tracing.end_span(trace_id, span_id, 'completed')
            
            # Emit span completion event
            self.emit_event(
                event_type=EventType.PERFORMANCE,
                source=span_name,
                message=f"Span completed: {span_name}",
                severity=SeverityLevel.DEBUG,
                trace_id=trace_id,
                span_id=span_id,
                duration_ms=duration_ms
            )
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            self.tracing.end_span(trace_id, span_id, 'error')
            
            self.emit_event(
                event_type=EventType.SYSTEM_ERROR,
                source=span_name,
                message=f"Span failed: {str(e)}",
                severity=SeverityLevel.ERROR,
                trace_id=trace_id,
                span_id=span_id,
                duration_ms=duration_ms,
                metadata={'error_type': type(e).__name__, 'error_message': str(e)}
            )
            raise
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get overall system health metrics"""
        
        # Recent events analysis
        recent_events = list(self.event_buffer)[-100:]  # Last 100 events
        error_count = sum(1 for e in recent_events if e.severity in [SeverityLevel.ERROR, SeverityLevel.CRITICAL])
        warning_count = sum(1 for e in recent_events if e.severity == SeverityLevel.WARNING)
        
        # Performance metrics
        avg_response_times = {}
        for event_type in EventType:
            events_with_duration = [e for e in recent_events 
                                  if e.event_type == event_type and e.duration_ms is not None]
            if events_with_duration:
                avg_duration = sum(e.duration_ms for e in events_with_duration) / len(events_with_duration)
                avg_response_times[event_type.value] = avg_duration
        
        # Active traces
        active_trace_count = len(self.tracing.active_traces)
        
        # Feedback summary
        feedback_summary = self.feedback.get_feedback_summary(days=1)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'health_status': 'healthy' if error_count == 0 else 'degraded' if error_count < 5 else 'unhealthy',
            'recent_events': {
                'total': len(recent_events),
                'errors': error_count,
                'warnings': warning_count
            },
            'performance': {
                'average_response_times_ms': avg_response_times,
                'active_traces': active_trace_count
            },
            'feedback': feedback_summary,
            'metrics_summary': {
                'counters': len(self.metrics.counters),
                'gauges': len(self.metrics.gauges),
                'histograms': len(self.metrics.histograms),
                'timers': len(self.metrics.timers)
            }
        }
    
    def get_ai_performance_insights(self) -> Dict[str, Any]:
        """Get AI-specific performance insights"""
        
        # Filter AI-related events
        ai_events = [e for e in self.event_buffer 
                    if e.event_type in [EventType.AI_DECISION, EventType.TOOL_EXECUTION]]
        
        if not ai_events:
            return {'message': 'No AI events found'}
        
        # Decision time analysis
        decision_times = [e.duration_ms for e in ai_events 
                         if e.event_type == EventType.AI_DECISION and e.duration_ms]
        
        # Tool execution analysis
        tool_times = [e.duration_ms for e in ai_events 
                     if e.event_type == EventType.TOOL_EXECUTION and e.duration_ms]
        
        # Success rate analysis
        total_decisions = len([e for e in ai_events if e.event_type == EventType.AI_DECISION])
        failed_decisions = len([e for e in ai_events 
                              if e.event_type == EventType.AI_DECISION and e.severity == SeverityLevel.ERROR])
        
        success_rate = ((total_decisions - failed_decisions) / total_decisions * 100) if total_decisions > 0 else 0
        
        return {
            'ai_decision_performance': {
                'average_time_ms': sum(decision_times) / len(decision_times) if decision_times else 0,
                'min_time_ms': min(decision_times) if decision_times else 0,
                'max_time_ms': max(decision_times) if decision_times else 0,
                'total_decisions': total_decisions,
                'success_rate_percent': success_rate
            },
            'tool_execution_performance': {
                'average_time_ms': sum(tool_times) / len(tool_times) if tool_times else 0,
                'min_time_ms': min(tool_times) if tool_times else 0,
                'max_time_ms': max(tool_times) if tool_times else 0,
                'total_executions': len(tool_times)
            },
            'recommendations': self._generate_performance_recommendations(decision_times, tool_times, success_rate)
        }
    
    def _generate_performance_recommendations(self, decision_times: List[float],
                                            tool_times: List[float],
                                            success_rate: float) -> List[str]:
        """Generate performance improvement recommendations"""
        recommendations = []
        
        avg_decision_time = sum(decision_times) / len(decision_times) if decision_times else 0
        avg_tool_time = sum(tool_times) / len(tool_times) if tool_times else 0
        
        if avg_decision_time > 3000:  # 3 seconds
            recommendations.append("Consider optimizing AI decision-making process - average time exceeds 3 seconds")
        
        if avg_tool_time > 5000:  # 5 seconds
            recommendations.append("Tool execution times are high - consider caching or optimization")
        
        if success_rate < 95:
            recommendations.append(f"AI success rate is {success_rate:.1f}% - investigate failure patterns")
        
        if not recommendations:
            recommendations.append("AI performance is within acceptable thresholds")
        
        return recommendations

# Example usage and integration
class ObservabilityDecorator:
    """Decorator for automatic observability instrumentation"""
    
    def __init__(self, observability: ObservabilitySystem):
        self.obs = observability
    
    def trace_ai_decision(self, decision_type: str):
        """Decorator for AI decision functions"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                with self.obs.trace_operation(f"ai_decision_{decision_type}") as trace_id:
                    with self.obs.trace_span(trace_id, f"execute_{func.__name__}") as span_id:
                        start_time = time.time()
                        try:
                            result = func(*args, **kwargs)
                            duration_ms = (time.time() - start_time) * 1000
                            
                            self.obs.emit_event(
                                event_type=EventType.AI_DECISION,
                                source=func.__name__,
                                message=f"AI decision completed: {decision_type}",
                                severity=SeverityLevel.INFO,
                                trace_id=trace_id,
                                span_id=span_id,
                                duration_ms=duration_ms,
                                metadata={'decision_type': decision_type, 'result_type': type(result).__name__}
                            )
                            
                            return result
                            
                        except Exception as e:
                            duration_ms = (time.time() - start_time) * 1000
                            
                            self.obs.emit_event(
                                event_type=EventType.AI_DECISION,
                                source=func.__name__,
                                message=f"AI decision failed: {str(e)}",
                                severity=SeverityLevel.ERROR,
                                trace_id=trace_id,
                                span_id=span_id,
                                duration_ms=duration_ms,
                                metadata={'decision_type': decision_type, 'error': str(e)}
                            )
                            
                            raise
            return wrapper
        return decorator
    
    def trace_tool_execution(self, tool_name: str):
        """Decorator for tool execution functions"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                with self.obs.trace_operation(f"tool_execution_{tool_name}") as trace_id:
                    with self.obs.trace_span(trace_id, f"execute_{tool_name}") as span_id:
                        start_time = time.time()
                        try:
                            result = func(*args, **kwargs)
                            duration_ms = (time.time() - start_time) * 1000
                            
                            self.obs.emit_event(
                                event_type=EventType.TOOL_EXECUTION,
                                source=tool_name,
                                message=f"Tool execution completed: {tool_name}",
                                severity=SeverityLevel.INFO,
                                trace_id=trace_id,
                                span_id=span_id,
                                duration_ms=duration_ms,
                                metadata={'tool_name': tool_name, 'success': True}
                            )
                            
                            return result
                            
                        except Exception as e:
                            duration_ms = (time.time() - start_time) * 1000
                            
                            self.obs.emit_event(
                                event_type=EventType.TOOL_EXECUTION,
                                source=tool_name,
                                message=f"Tool execution failed: {str(e)}",
                                severity=SeverityLevel.ERROR,
                                trace_id=trace_id,
                                span_id=span_id,
                                duration_ms=duration_ms,
                                metadata={'tool_name': tool_name, 'error': str(e), 'success': False}
                            )
                            
                            raise
            return wrapper
        return decorator

# Example feedback handlers
def handle_thumbs_feedback(feedback: FeedbackEvent):
    """Handle thumbs up/down feedback"""
    if feedback.feedback_type in ['thumbs_up', 'thumbs_down']:
        # Update AI model confidence or training data
        print(f"Received {feedback.feedback_type} feedback for {feedback.target_event_id}")

def handle_rating_feedback(feedback: FeedbackEvent):
    """Handle numeric rating feedback"""
    if feedback.feedback_type == 'rating' and feedback.rating is not None:
        # Use rating for model improvement
        print(f"Received rating {feedback.rating}/5 for {feedback.target_event_id}")

# Example usage
if __name__ == "__main__":
    # This would be integrated with your database session
    print("🔍 Observability System Demonstration")
    print("\nKey Features:")
    print("- Distributed tracing for request flows")
    print("- Metrics collection (counters, gauges, histograms, timers)")
    print("- Event logging with structured metadata")
    print("- Feedback loops for continuous improvement")
    print("- Performance monitoring and alerting")
    print("- AI-specific performance insights")
    print("\n🎯 Benefits:")
    print("- Real-time visibility into AI agent performance")
    print("- Automated detection of performance issues")
    print("- User feedback integration for model improvement")
    print("- Comprehensive audit trail for compliance")
    print("- Data-driven optimization recommendations")