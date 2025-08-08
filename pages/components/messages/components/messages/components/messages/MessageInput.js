import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';

function MessageInput({ onSendMessage, disabled = false, placeholder = "Digite sua mensagem..." }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSending) {
      return;
    }

    setIsSending(true);
    
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Attachment button (placeholder) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="p-2"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        {/* Message input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="resize-none"
          />
        </div>
        
        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className="p-2"
        >
          <Send className={`h-4 w-4 ${isSending ? 'animate-pulse' : ''}`} />
        </Button>
      </form>
    </div>
  );
}

export default MessageInput;
