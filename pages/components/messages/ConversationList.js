import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ConversationList({ 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  onRefresh,
  onNewConversation 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.contact?.phoneNumber?.includes(searchTerm) ||
    conversation.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const formatLastMessageTime = (timestamp) => {
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            {onNewConversation && (
              <Button
                size="sm"
                onClick={onNewConversation}
                className="p-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <div className="text-4xl mb-2">🔍</div>
                <p>Nenhuma conversa encontrada</p>
                <p className="text-sm">Tente buscar por outro termo</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">💬</div>
                <p>Nenhuma conversa ainda</p>
                <p className="text-sm">Inicie uma nova conversa</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-blue-50 border-r-2 border-blue-500' 
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {conversation.contact?.name?.charAt(0)?.toUpperCase() || 
                       conversation.contact?.phoneNumber?.slice(-2) || '?'}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.contact?.name || conversation.contact?.phoneNumber || 'Contato Desconhecido'}
                      </h3>
                      {conversation.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatLastMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.contact?.phoneNumber && conversation.contact?.name && (
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.contact.phoneNumber}
                      </p>
                    )}
                    
                    {conversation.lastMessage?.content && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage.fromUser ? 'Você: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  
                  {/* Unread indicator */}
                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationList;
