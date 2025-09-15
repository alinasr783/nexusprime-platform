import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';

interface CommunicationSectionProps {
  projectId: string;
}

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({ projectId }) => {
  const { messages, loading, sendMessage } = useMessages(projectId);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      return date.toLocaleDateString('ar-EG');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 ml-2" />
        مركز التواصل
      </h3>
      
      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender_type === 'client'
                ? 'bg-primary text-primary-foreground mr-8'
                : 'bg-muted'
            }`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {message.sender_type === 'client' ? 'أ' : 'PM'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{message.sender}</span>
              <span className={`text-xs ${
                message.sender_type === 'client' 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                {formatTime(message.created_at)}
              </span>
            </div>
            <p className="text-sm">{message.message}</p>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2 space-x-reverse">
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-3 py-2 border rounded-lg bg-background"
          disabled={loading}
        />
        <Button variant="ghost" size="sm" disabled={loading}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};