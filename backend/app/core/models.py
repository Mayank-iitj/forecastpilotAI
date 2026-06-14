"""ForecastPilot AI — Database Models"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, JSON,
    ForeignKey, Enum as SAEnum, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
import uuid


def generate_id():
    return str(uuid.uuid4())


def utcnow():
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ForecastStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_id)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.ANALYST)
    avatar_url = Column(String, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    organization = relationship("Organization", back_populates="users")
    projects = relationship("Project", back_populates="owner")


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    plan = Column(String, default="starter")
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    users = relationship("User", back_populates="organization")
    projects = relationship("Project", back_populates="organization")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    settings = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    organization = relationship("Organization", back_populates="projects")
    owner = relationship("User", back_populates="projects")
    datasets = relationship("Dataset", back_populates="project")
    forecasts = relationship("Forecast", back_populates="project")
    scenarios = relationship("Scenario", back_populates="project")


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=generate_id)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, default=0)
    row_count = Column(Integer, default=0)
    column_count = Column(Integer, default=0)
    quality_score = Column(Float, default=0.0)
    validation_results = Column(JSON, default=dict)
    columns_meta = Column(JSON, default=dict)
    status = Column(String, default="uploaded")
    created_at = Column(DateTime, default=utcnow)

    project = relationship("Project", back_populates="datasets")
    campaigns = relationship("Campaign", back_populates="dataset")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=generate_id)
    dataset_id = Column(String, ForeignKey("datasets.id"), nullable=False)
    name = Column(String, nullable=False)
    channel = Column(String, nullable=False)
    campaign_type = Column(String, nullable=True)
    date = Column(DateTime, nullable=False)
    spend = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)
    conversions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    cpc = Column(Float, default=0.0)
    ctr = Column(Float, default=0.0)
    roas = Column(Float, default=0.0)
    aov = Column(Float, default=0.0)

    dataset = relationship("Dataset", back_populates="campaigns")

    __table_args__ = (
        Index("idx_campaign_channel_date", "channel", "date"),
    )


class Channel(Base):
    __tablename__ = "channels"

    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False, unique=True)
    display_name = Column(String, nullable=False)
    color = Column(String, default="#3B82F6")
    icon = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(String, primary_key=True, default=generate_id)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    forecast_days = Column(Integer, default=30)
    status = Column(SAEnum(ForecastStatus), default=ForecastStatus.PENDING)
    model_type = Column(String, default="ensemble")
    metrics = Column(JSON, default=dict)
    predictions = Column(JSON, default=dict)
    confidence_intervals = Column(JSON, default=dict)
    channel_forecasts = Column(JSON, default=dict)
    campaign_forecasts = Column(JSON, default=dict)
    decomposition = Column(JSON, default=dict)
    accuracy_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="forecasts")


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True, default=generate_id)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    budget_allocation = Column(JSON, default=dict)
    constraints = Column(JSON, default=dict)
    results = Column(JSON, default=dict)
    risk_level = Column(SAEnum(RiskLevel), default=RiskLevel.MEDIUM)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("Project", back_populates="scenarios")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=generate_id)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    report_type = Column(String, default="executive")
    content = Column(JSON, default=dict)
    generated_by = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class Insight(Base):
    __tablename__ = "insights"

    id = Column(String, primary_key=True, default=generate_id)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    insight_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(SAEnum(RiskLevel), default=RiskLevel.LOW)
    data = Column(JSON, default=dict)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="info")
    is_read = Column(Boolean, default=False)
    data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    __table_args__ = (
        Index("idx_audit_user_action", "user_id", "action"),
    )
