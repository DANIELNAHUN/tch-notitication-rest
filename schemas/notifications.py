from enum import Enum
from datetime import datetime
from pydantic import BaseModel, ConfigDict, validator
from typing import Optional


class NotificationChannel(str, Enum):
    EMAIL = 'email'
    SMS = 'sms'
    PUSH = 'push'

class NotificationStatus(str, Enum):
    PENDING = 'pending'
    SENT = 'sent'
    FAILED = 'failed'

class NotificationBase(BaseModel):    
    receiver_id: int
    subject: str
    message: str
    status: NotificationStatus = NotificationStatus.PENDING
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)

class NotificationCreate(NotificationBase):
    sender_id: int
    sender_contact: Optional[str] = None
    receiver_contact: Optional[str] = None
    channel: Optional[NotificationChannel] = None

class NotificationCreateMail(NotificationCreate):
    receiver_contact: str
    sender_contact: str
    channel: NotificationChannel = NotificationChannel.EMAIL
    @validator('receiver_contact', 'sender_contact')
    def contacts_are_emails(cls, v):
        if '@' not in v:
            raise ValueError('receiver_contact or sender_contact is not a email')
        return v

class NotificationCreateNumber(NotificationCreate):
    receiver_contact: str
    sender_contact: str
    channel: NotificationChannel = NotificationChannel.SMS
    @validator('receiver_contact', 'sender_contact')
    def contacts_are_numbers(cls, v):
        if not v.isdigit():
            raise ValueError('receiver_contact or sender_contact is not a number')
        return v

class NotificationCreatePush(NotificationCreate):
    receiver_contact: str
    sender_contact: str
    channel: NotificationChannel = NotificationChannel.PUSH
    @validator('receiver_contact', 'sender_contact')
    def contacts_are_numbers(cls, v):
        if not v.isdigit():
            raise ValueError('receiver_contact or sender_contact is not a number')
        return v
    

class NotificationResponse(NotificationBase):
    id_notification: int
    channel: NotificationChannel
    receiver_contact: str
    sender_contact: str