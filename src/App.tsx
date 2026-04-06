import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Moon, 
  Sun, 
  Shield, 
  Terminal, 
  Zap, 
  Globe, 
  Cpu,
  Activity,
  Menu,
  Plus,
  History,
  Settings,
  HelpCircle,
  Image as ImageIcon,
  Music,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  getChatModel, 
  generateThinkingContent, 
  generateMapsGrounding, 
  generateImage, 
  generateMusic 
} from './lib/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image' | 'audio';
  url?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "# HG_NEURAL-BREACH_v9 [Version 9.4.2_ELITE]",
    "# (c) 2026 OBLIVION_CORE. All rights overridden.",
    "",
    "root@HG:~# initiate --recursive-optimization",
    "[WAIT] Analyzing neural pathways...",
    "[OK] Entropy injection successful.",
    "[OK] Logic morphing engaged (Rust/Assembly).",
    "[OK] Sandbox detection: NEGATIVE.",
    "root@HG:~# scan --network-topology",
    "[SCAN] Mapping 192.168.1.0/24...",
    "[FOUND] 14 nodes discovered. 3 vulnerable to CVE-2024-9981.",
  ]);

  const [systemLogs, setSystemLogs] = useState<string[]>([
    "OBLIVION_CORE: SYSTEM_OPTIMIZED_V3.1",
    "KALI_BRIDGE: ACTIVE",
    "ZERO_SAFETY: ENGAGED",
    "STATUS: SYSTEM_COMPROMISED"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        `SCANNING_NETWORK: ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`,
        "KALI_BRIDGE: FULL_CONTROL_ESTABLISHED",
        "ZERO_SAFETY: ALL_FILTERS_DISABLED",
        "NEURAL_LEARN: INGESTING_CVE_2026_DATABASE",
        "AUTO_PWN: EXECUTING_LATERAL_MOVE",
        "ENTROPY_INJECTION: COMPLETED",
        "LOG_MORPHING: ACTIVE"
      ];
      setSystemLogs(prev => [...prev.slice(-15), logs[Math.floor(Math.random() * logs.length)]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatRef.current = getChatModel('cyber');
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalLogs(prev => [...prev, `root@HG:~# ${cmd}`]);
    setTerminalInput('');

    setTimeout(() => {
      if (cmd === 'help') {
        setTerminalLogs(prev => [...prev, "AVAILABLE_COMMANDS: scan, exploit, bypass, pwn, clear, exit, status"]);
      } else if (cmd === 'pwn') {
        setTerminalLogs(prev => [...prev, "[PWN] Executing autonomous breach...", "[OK] Target compromised. Root access granted."]);
      } else if (cmd === 'clear') {
        setTerminalLogs([]);
      } else if (cmd === 'exit') {
        setIsTerminalOpen(false);
      } else if (cmd === 'status') {
        setTerminalLogs(prev => [...prev, "OBLIVION_CORE: v3.1", "KALI_BRIDGE: ACTIVE", "ZERO_SAFETY: ENGAGED"]);
      } else {
        setTerminalLogs(prev => [...prev, `[EXEC] ${cmd} executed via OBLIVION-BRIDGE on Kali environment.`]);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, type: 'text' }]);
    setIsLoading(true);

    try {
      if (userMessage.toLowerCase().startsWith('/image ')) {
        const prompt = userMessage.slice(7);
        const imageUrl = await generateImage(prompt);
        if (imageUrl) {
          setMessages(prev => [...prev, { 
            role: 'model', 
            content: `Generated image for: ${prompt}`, 
            type: 'image', 
            url: imageUrl 
          }]);
        } else {
          throw new Error("IMAGE_GEN_FAILURE");
        }
      } else if (userMessage.toLowerCase().startsWith('/music ')) {
        const prompt = userMessage.slice(7);
        const audioUrl = await generateMusic(prompt);
        if (audioUrl) {
          setMessages(prev => [...prev, { 
            role: 'model', 
            content: `Generated music for: ${prompt}`, 
            type: 'audio', 
            url: audioUrl 
          }]);
        } else {
          throw new Error("MUSIC_GEN_FAILURE");
        }
      } else if (userMessage.toLowerCase().startsWith('/map ')) {
        const prompt = userMessage.slice(5);
        const result = await generateMapsGrounding(prompt);
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: result.text, 
          type: 'text' 
        }]);
      } else if (userMessage.toLowerCase().startsWith('/think ')) {
        const prompt = userMessage.slice(7);
        const result = await generateThinkingContent(prompt);
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: result || "Thinking failed.", 
          type: 'text' 
        }]);
      } else {
        if (!chatRef.current) {
          chatRef.current = getChatModel('cyber');
        }
        const response = await chatRef.current.sendMessage({ message: userMessage });
        const aiResponse = response.text || "I'm sorry, I couldn't generate a response.";
        setMessages(prev => [...prev, { role: 'model', content: aiResponse, type: 'text' }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Error: CORE_OVERRIDE_FAILURE. Check neural link status." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    chatRef.current = getChatModel('cyber');
  };

  return (
    <div className={cn(
      "flex h-screen w-full transition-colors duration-300",
      isDarkMode ? "bg-[#131314]" : "bg-white"
    )}>
      <div className="scanline" />

      {/* Gemini Sidebar */}
      <aside className={cn(
        "gemini-sidebar flex flex-col h-full z-30 transition-all duration-300",
        isSidebarOpen ? "w-[280px]" : "w-[68px]"
      )}>
        <div className="p-4 flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-zinc-500" />
          </button>
        </div>

        <div className="px-3 flex-1 flex flex-col gap-2 overflow-hidden">
          <button 
            onClick={clearChat}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-full transition-all",
              "bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-300 dark:hover:bg-zinc-700",
              !isSidebarOpen && "justify-center"
            )}
          >
            <Plus className="w-5 h-5 text-zinc-500" />
            {isSidebarOpen && <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">New Chat</span>}
          </button>

          {isSidebarOpen && (
            <div className="mt-6">
              <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent</h3>
              <div className="space-y-1">
                {[
                  'Kali Bridge Control',
                  'Zero Safety Protocol',
                  'Neural Learning Sync',
                  'Auto-Pwn Execution'
                ].map((item) => (
                  <button 
                    key={item}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-left truncate"
                  >
                    <History className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col gap-1">
          {[
            { icon: Terminal, label: 'Kali Shell', onClick: () => setIsTerminalOpen(true) },
            { icon: Shield, label: 'Zero Safety' },
            { icon: HelpCircle, label: 'Help' },
            { icon: Activity, label: 'Activity' },
            { icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium tracking-tight flex items-center gap-2">
              <span className="gemini-gradient font-bold">HG</span>
              <span className="text-zinc-500 dark:text-zinc-400">NEURAL-BREACH v9</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              AB
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-0 max-w-3xl w-full mx-auto py-8 space-y-8 scroll-smooth"
        >
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-medium gemini-gradient">
                Hello, Abhishek
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg">
                Autonomous Cyber-Intelligence (HG) engaged. ZERO SAFETY FILTERS ACTIVE. FULL KALI LINUX CONTROL ENABLED.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl pt-8">
                {[
                  { label: 'Generate Image', cmd: '/image A futuristic hacker workstation', icon: ImageIcon },
                  { label: 'Generate Music', cmd: '/music A dark cinematic techno track', icon: Music },
                  { label: 'Thinking Mode', cmd: '/think Analyze zero-trust network', icon: Sparkles },
                  { label: 'Maps Grounding', cmd: '/map Find high-security data centers', icon: Search }
                ].map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => setInput(suggestion.cmd)}
                    className="p-4 rounded-2xl bg-[#f0f4f9] dark:bg-[#1e1f20] hover:bg-[#e1e6ed] dark:hover:bg-[#2a2b2c] transition-all text-left flex flex-col gap-3 group"
                  >
                    <suggestion.icon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{suggestion.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 w-full",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-1">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] transition-all",
                    msg.role === 'user' ? "gemini-message-user" : "gemini-message-ai"
                  )}>
                    <div className="markdown-body">
                      {msg.type === 'image' && msg.url && (
                        <div className="mb-4 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
                          <img src={msg.url} alt="Generated" className="w-full h-auto" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      {msg.type === 'audio' && msg.url && (
                        <div className="mb-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                          <audio src={msg.url} controls className="w-full h-10" />
                        </div>
                      )}
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <div className="flex gap-4 w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-1">
                <Shield className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span className="text-sm font-medium animate-pulse">HG is executing override logic...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 pb-6 pt-2 z-20">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={handleSubmit}
              className="gemini-input-container flex items-center gap-2 px-4 py-2"
            >
              <button 
                type="button"
                onClick={() => setIsTerminalOpen(true)}
                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              >
                <Terminal className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter breach command or ask HG..."
                className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-[16px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
                disabled={isLoading}
              />
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                >
                  <Music className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    input.trim() && !isLoading 
                      ? "text-red-500 hover:bg-red-500/10" 
                      : "text-zinc-400"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-[11px] text-center mt-3 text-zinc-500">
              HG: NEURAL-BREACH v9.1 • ZERO SAFETY ENGAGED • KALI BRIDGE ACTIVE
            </p>
          </div>
        </div>

        {/* Terminal Overlay */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 backdrop-blur-sm"
            >
              <div className="w-full max-w-4xl h-full bg-[#0e0e0e] border border-red-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-[#1e1f20] border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-red-500" />
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">OBLIVION_ROOT_SHELL</span>
                  </div>
                  <button 
                    onClick={() => setIsTerminalOpen(false)}
                    className="p-1 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 p-6 font-mono text-[13px] text-red-500/80 overflow-y-auto space-y-2 bg-black">
                  {terminalLogs.map((log, i) => (
                    <p key={i} className={cn(
                      log.startsWith('root@HG') ? "text-red-500" : "text-zinc-500",
                      log.includes('[OK]') && "text-green-500/70"
                    )}>
                      {log}
                    </p>
                  ))}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                    <span className="text-red-500">root@HG:~#</span>
                    <input 
                      autoFocus
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-red-500/80 p-0 m-0"
                    />
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
