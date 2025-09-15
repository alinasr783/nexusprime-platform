import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  project_id: string;
  sender: string;
  message: string;
  sender_type: 'client' | 'admin';
  created_at: string;
}

interface CommunicationSectionProps {
  projectId: string;
}

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    // Temporarily use dummy data until types are regenerated
    setMessages([
      {
        id: '1',
        project_id: projectId,
        sender: 'مدير المشروع',
        message: 'تم الانتهاء من التصميم المبدئي، يرجى المراجعة',
        sender_type: 'admin',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        project_id: projectId,
        sender: 'أنت',
        message: 'رائع! يمكن تعديل لون الهيدر؟',
        sender_type: 'client',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        project_id: projectId,
        sender: 'مدير المشروع',
        message: 'بالتأكيد! ما هو اللون المفضل لديك؟',
        sender_type: 'admin',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]);
  };

  useEffect(() => {
    fetchMessages();
    // Real-time will be enabled once types are updated
  }, [projectId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    
    try {
      // Add message to local state (will be replaced with Supabase once types are updated)
      const newMsg: Message = {
        id: Date.now().toString(),
        project_id: projectId,
        sender: 'العميل',
        message: newMessage.trim(),
        sender_type: 'client',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      toast({
        title: "تم الإرسال",
        description: "تم إرسال الرسالة بنجاح"
      });
    } catch (err: any) {
      toast({
        title: "خطأ في الإرسال",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-3 py-2 border rounded-lg bg-background"
          disabled={loading}
        />
        <Button variant="ghost" size="sm" disabled={loading}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={sendMessage} disabled={loading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};