
import React, { useState, useRef, useEffect } from 'react';
import { Project, User, ChatMessage, UserRole } from '../types';

interface ChatRoomProps {
  project: Project;
  currentUser: User;
  onSendMessage: (projectId: string, message: Partial<ChatMessage>) => void;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ project, currentUser, onSendMessage, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [project.messages]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(project.id, {
      text: inputText,
      timestamp: new Date().toISOString(),
    });
    setInputText('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload - in a real app, this would go to S3/Cloudinary
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onSendMessage(project.id, {
        mediaUrl: base64,
        mediaType: file.type.startsWith('image/') ? 'image' : 'file',
        text: file.name,
        timestamp: new Date().toISOString(),
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-4 border-construction-yellow rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-construction-slate text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-construction-yellow text-construction-slate rounded-lg flex items-center justify-center font-black">
            <i className="fas fa-comments"></i>
          </div>
          <div>
            <h3 className="font-black uppercase italic tracking-tighter">Site Communication</h3>
            <p className="text-[10px] text-construction-yellow font-bold uppercase tracking-widest">Project #{project.id.toUpperCase()}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <i className="fas fa-times-circle text-xl"></i>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 construction-grid">
        {!project.messages || project.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-50">
            <i className="fas fa-comment-dots text-4xl"></i>
            <p className="font-black uppercase text-xs">No messages yet. Start the drill.</p>
          </div>
        ) : (
          project.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-2 rounded-xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-construction-yellow text-construction-slate font-bold rounded-tr-none border-2 border-construction-slate' 
                      : 'bg-white text-slate-800 border-2 border-slate-200 rounded-tl-none font-medium'
                  }`}>
                    {!isMe && <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{msg.senderName}</p>}
                    
                    {msg.mediaUrl && (
                      <div className="mb-2">
                        {msg.mediaType === 'image' ? (
                          <img src={msg.mediaUrl} alt="uploaded" className="max-w-full rounded-lg border border-slate-200" />
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded border border-slate-200">
                            <i className="fas fa-file-pdf text-red-500"></i>
                            <span className="text-xs truncate">{msg.text}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {msg.text && (msg.mediaType !== 'file' || msg.mediaUrl === undefined) && <p className="leading-relaxed">{msg.text}</p>}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 mt-1 uppercase">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t-4 border-construction-yellow">
        <form onSubmit={handleSendText} className="flex gap-2 items-center">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,.pdf,.doc,.docx"
          />
          <button 
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paperclip text-lg"></i>}
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or share site photos..." 
            className="flex-grow p-3 bg-slate-100 border-2 border-slate-200 rounded-xl outline-none focus:border-construction-yellow transition-all font-bold text-sm"
          />
          <button 
            type="submit"
            className="w-12 h-12 bg-construction-slate text-construction-yellow rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg active:scale-95"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
