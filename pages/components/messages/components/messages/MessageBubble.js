import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function MessageBubble({ message, isFromUser }) {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`flex mb-4 ${isFromUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isFromUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isFromUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
