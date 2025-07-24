'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Data is now fetched from Firestore, so these are empty.
const conversations: any[] = [];
const initialMessages: { [key: number]: any[] } = {};

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSelectConversation = (conversation: any) => {
      setSelectedConversation(conversation);
      // In a real app, fetch messages for this conversation from Firestore
      setMessages(initialMessages[conversation.id as keyof typeof initialMessages] || []);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
    // In a real app, save the new message to Firestore
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-8rem)] gap-4">
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle>Conversations</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8" />
          </div>
        </CardHeader>
        <ScrollArea className="h-[calc(100%-110px)]">
          <CardContent className="p-0">
            {conversations.length > 0 ? (
                conversations.map((conv) => (
                <div
                    key={conv.id}
                    className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50',
                    selectedConversation && (selectedConversation as any).id === conv.id && 'bg-muted'
                    )}
                    onClick={() => handleSelectConversation(conv)}
                >
                    <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.avatar} alt={conv.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <div className="font-semibold">{conv.name}</div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                        <div>{conv.timestamp}</div>
                        {conv.unread > 0 && (
                            <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1 ml-auto">
                                {conv.unread}
                            </div>
                        )}
                    </div>
                </div>
                ))
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No conversations yet.
                </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
      
      <Card className="flex flex-col h-full">
        {selectedConversation ? (
            <>
                <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
                    <Avatar>
                    <AvatarImage src={(selectedConversation as any).avatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{(selectedConversation as any).name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold">{(selectedConversation as any).name}</h2>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                        key={msg.id}
                        className={cn(
                            'flex items-end gap-2',
                            msg.sender === 'me' ? 'justify-end' : 'justify-start'
                        )}
                        >
                        <div
                            className={cn(
                            'rounded-lg px-4 py-2 max-w-xs lg:max-w-md',
                            msg.sender === 'me'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                        >
                            <p>{msg.text}</p>
                            <div className={cn("text-xs mt-1", msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground' )}>{msg.timestamp}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                <CardContent className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardContent>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">Select a conversation</h2>
                <p>Choose one of your contacts to start chatting.</p>
            </div>
        )}
      </Card>
    </div>
  );
}
