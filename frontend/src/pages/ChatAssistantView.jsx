import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  FileText,
  Bot,
  User,
  Trash2,
  Download,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { clearChatHistory, fetchChatHistory, sendChatMessage } from '../services/api';

export default function ChatAssistantView({ onSelectSource }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Namaste! I am your AgriAI Smart Assistant powered by Retrieval-Augmented Generation (RAG). I retrieve answers directly from verified ICAR manuals, Soil Health cards, and government agricultural guides. How can I assist your farm today?",
      time: '10:20 AM',
      followups: [
        'What is the best fertilizer for paddy crop?',
        'How to manage Yellow Stem Borer organically?',
        'How much subsidy do small farmers get for drip irrigation under PMKSY?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customText) => {
    const text = customText || input;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text);
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.answer,
        time: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources || [],
        followups: res.followups || [],
        model_used: res.model_used,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error retrieving agricultural data: ${err.message}. Please verify backend server is online.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Clear all conversation history?')) {
      await clearChatHistory();
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Chat session reset. Ask any question to start anew!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleExport = () => {
    const transcript = messages
      .map((m) => `[${m.time}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriAI_Consultation_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
            🌾 Ask AI Assistant (RAG Grounded)
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Every answer is verified against ICAR packages of practice and agricultural manuals with page citations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <Download size={15} />
            <span>Export Notes</span>
          </button>
          <button
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #fee2e2',
              background: '#fff5f5',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ef4444',
            }}
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div
        className="dashboard-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '650px',
          padding: '20px',
        }}
      >
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingRight: '10px',
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              {m.role === 'assistant' && (
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#10b981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                style={{
                  background: m.role === 'user' ? '#10b981' : '#f8fafc',
                  color: m.role === 'user' ? '#ffffff' : '#0f172a',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  borderBottomRightRadius: m.role === 'user' ? '4px' : '14px',
                  borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '14px',
                  padding: '14px 18px',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>

                {/* Grounding Source Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={13} />
                      <span>Retrieved Source Citations ({m.sources.length})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {m.sources.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectSource(s)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#ffffff',
                            border: '1px solid #a7f3d0',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#065f46',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          }}
                        >
                          <FileText size={12} color="#059669" />
                          <span>{s.document_name}</span>
                          <span style={{ color: '#64748b' }}>• p.{s.page_number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Questions */}
                {m.followups && m.followups.length > 0 && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                      💡 Recommended Follow-up Questions:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {m.followups.map((q, qidx) => (
                        <button
                          key={qidx}
                          onClick={() => handleSend(q)}
                          style={{
                            textAlign: 'left',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            color: '#065f46',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#ecfdf5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                        >
                          → {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    color: m.role === 'user' ? 'rgba(255,255,255,0.75)' : '#94a3b8',
                    marginTop: '6px',
                    textAlign: m.role === 'user' ? 'right' : 'left',
                  }}
                >
                  {m.time} {m.model_used ? `• ${m.model_used}` : ''}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RefreshCw size={15} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Searching vector knowledge base and synthesizing agronomic guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '9999px',
            padding: '8px 16px',
            marginTop: '16px',
          }}
        >
          <button
            onClick={toggleVoice}
            title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-text)'}
            style={{
              color: isListening ? '#ef4444' : '#64748b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            placeholder={isListening ? 'Listening to your voice...' : 'Ask about crops, fertilizers, pest control, soil tests...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0f172a',
            }}
          />

          <button
            onClick={() => handleSend()}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
