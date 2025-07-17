// src/pages/InboxPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getMessages, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { groupBy } from 'lodash';

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const conversations = useMemo(() => {
    if (!messages.length || !user) return {};
    return groupBy(messages, msg => {
      if (!msg.sender || !msg.receiver) return null;
      const otherPersonId = msg.sender._id === user._id ? msg.receiver._id : msg.sender._id;
      return `${otherPersonId}-${msg.property?._id || 'general'}`;
    });
  }, [messages, user]);

  const selectedConversation = useMemo(() => {
    return conversations[selectedConversationId] || [];
  }, [conversations, selectedConversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation.length) return;
    setSendError(null);

    const firstMessage = selectedConversation[0];
    const receiverId = firstMessage.sender._id === user._id ? firstMessage.receiver._id : firstMessage.sender._id;
    const propertyId = firstMessage.property?._id;

    try {
      await sendMessage({ receiverId, content: newMessage, propertyId });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setSendError(err.message || 'Failed to send message.');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading Inbox...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold mb-4">Inbox</h1>
      <div className="flex h-full border rounded-lg bg-white shadow-md">
        {/* Conversation List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {Object.keys(conversations).length > 0 ? Object.entries(conversations).map(([convoId, convoMessages]) => {
            if (!convoMessages || convoMessages.length === 0) return null;
            const lastMessage = convoMessages[0];
            const otherPerson = lastMessage.sender?._id === user._id ? lastMessage.receiver : lastMessage.sender;
            if (!otherPerson) return null;

            return (
              <div
                key={convoId}
                onClick={() => { setSelectedConversationId(convoId); setSendError(null); }}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversationId === convoId ? 'bg-indigo-100' : ''}`}
              >
                <p className="font-semibold">{otherPerson.name}</p>
                <p className="text-sm text-gray-600 truncate">{lastMessage.property?.title || 'General Inquiry'}</p>
                <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>
              </div>
            );
          }) : <p className="p-4 text-gray-500">No conversations yet.</p>}
        </div>

        {/* Message View */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation.length > 0 ? (
            <>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
                <div className="space-y-4">
                {[...selectedConversation].reverse().map(msg => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender._id === user._id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                </div>
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                {sendError && <p className="text-sm text-red-600 mb-2">{sendError}</p>}
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700">Send</button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a conversation to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
