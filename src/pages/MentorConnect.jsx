import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Video, Mic, MessageSquare, Star, Clock, Calendar, CheckCircle2, Play, Pause, RefreshCw, Smartphone, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

// --- MOCK DATA ---
const MENTORS = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Senior System Architect',
        company: 'Google',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah',
        skills: ['System Design', 'Scalability', 'Cloud Architecture'],
        rating: 4.9,
        reviews: 120,
        price: '₹10/min',
        availability: 'Mon, Wed, Fri',
        color: 'bg-[#ff6b6b]', // Red-ish
        linkedin: 'https://linkedin.com/in/sarahchen',
    },
    {
        id: 2,
        name: 'David Miller',
        role: 'Staff Engineer',
        company: 'Netflix',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=David',
        skills: ['React', 'Performance', 'Node.js'],
        rating: 4.8,
        reviews: 85,
        price: '₹8/min',
        availability: 'Tue, Thu',
        color: 'bg-[#4ecdc4]', // Teal
        linkedin: 'https://linkedin.com/in/davidmiller',
    },
    {
        id: 3,
        name: 'Emily Zhang',
        role: 'AI Researcher',
        company: 'OpenAI',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Emily',
        skills: ['Machine Learning', 'Python', 'LLMs'],
        rating: 5.0,
        reviews: 200,
        price: '₹12/min',
        availability: 'Weekends',
        color: 'bg-[#ffe66d]', // Yellow
        linkedin: 'https://linkedin.com/in/emilyzhang',
    },
    {
        id: 4,
        name: 'Michael Scott',
        role: 'Product Manager',
        company: 'Microsoft',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Michael',
        skills: ['Product Strategy', 'Interview Prep', 'Leadership'],
        rating: 4.7,
        reviews: 45,
        price: '₹5/min',
        availability: 'Flexible',
        color: 'bg-[#ff9f1c]', // Orange
        linkedin: 'https://linkedin.com/in/michaelscott',
    },
    {
        id: 5,
        name: 'Jessica Pearson',
        role: 'Legal Tech Lead',
        company: 'Pearson Specter',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jessica',
        skills: ['Compliance', 'Data Privacy', 'Security'],
        rating: 4.9,
        reviews: 110,
        price: '₹15/min',
        availability: 'Mon-Fri',
        color: 'bg-[#ff006e]', // Pink
        linkedin: 'https://linkedin.com/in/jessicapearson',
    },
    {
        id: 6,
        name: 'Gilfoyle',
        role: 'DevOps Engineer',
        company: 'Pied Piper',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Gilfoyle',
        skills: ['Kubernetes', 'Security', 'Server Config'],
        rating: 5.0,
        reviews: 666,
        price: '₹20/min',
        availability: 'Never',
        color: 'bg-[#8338ec]', // Purple
        linkedin: 'https://linkedin.com/in/gilfoyle',
    }
];

const TRENDING_ARTICLES = [
    { title: "AI Takes Over Coding?", date: "Oct 12", tag: "Tech" },
    { title: "Why React is Dying (Again)", date: "Oct 10", tag: "Opinion" },
    { title: "Brutalism is Back, Baby!", date: "Oct 08", tag: "Design" },
    { title: "Rust vs Go: The Final War", date: "Oct 05", tag: "Dev" },
];

const INTERVIEW_TOPICS = [
    { title: "Frontend (React)", count: "25 Qs", color: "bg-blue-100" },
    { title: "Backend (Node)", count: "30 Qs", color: "bg-green-100" },
    { title: "System Design", count: "15 Qs", color: "bg-purple-100" },
    { title: "Behavioral", count: "20 Qs", color: "bg-orange-100" },
    { title: "DSA & Algos", count: "40 Qs", color: "bg-red-100" },
];

const INTERVIEW_QUESTIONS = {
    "Frontend (React)": [
        "What are React Hooks and why were they introduced?",
        "Explain the Virtual DOM and how it improves performance.",
        "What is the difference between state and props?",
        "How does the useEffect dependency array work?",
        "Explain the concept of Higher-Order Components (HOCs)."
    ],
    "Backend (Node)": [
        "What is the Event Loop in Node.js?",
        "Explain the difference between process.nextTick() and setImmediate().",
        "How do you handle errors in async/await functions?",
        "What are Streams in Node.js and why are they useful?",
        "Explain the role of middleware in Express.js."
    ],
    "System Design": [
        "Design a URL shortening service like Bit.ly.",
        "How would you design a scalable notification system?",
        "Explain the difference between vertical and horizontal scaling.",
        "Design a chat application like WhatsApp.",
        "What is consistent hashing and where is it used?"
    ],
    "Behavioral": [
        "Tell me about a time you faced a technical challenge and how you solved it.",
        "How do you handle conflict in a team setting?",
        "Describe a situation where you had to meet a tight deadline.",
        "Tell me about a time you failed and what you learned from it.",
        "Where do you see yourself in 5 years?"
    ],
    "DSA & Algos": [
        "Explain the difference between a stack and a queue.",
        "How does a hash table work and what is collision resolution?",
        "What is the time complexity of QuickSort?",
        "Explain Breadth-First Search (BFS) vs Depth-First Search (DFS).",
        "How would you detect a cycle in a linked list?"
    ]
};

export default function MentorConnect() {
    const [activeTab, setActiveTab] = useState('find-mentors');
    const [filter, setFilter] = useState('');
    const [selectedTopic, setSelectedTopic] = useState("Behavioral");

    // Interview Simulator State
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [recordingTime, setRecordingTime] = useState(0);
    const videoRef = useRef(null);

    // Get current questions based on topic
    const currentQuestions = INTERVIEW_QUESTIONS[selectedTopic] || INTERVIEW_QUESTIONS["Behavioral"];

    // Reset index when topic changes
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setIsInterviewActive(false);
    }, [selectedTopic]);

    // Filter Mentors
    const filteredMentors = MENTORS.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase()) ||
        m.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
    );

    // Webcam Handling
    useEffect(() => {
        let stream = null;
        if (isInterviewActive && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => toast.error("Camera access denied or missing."));
        }
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isInterviewActive]);

    // Timer
    useEffect(() => {
        let interval;
        if (isInterviewActive) {
            interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isInterviewActive]);

    const startInterview = () => {
        setIsInterviewActive(true);
        setCurrentQuestionIndex(0);
        setRecordingTime(0);
        toast.success("Interview session started. Good luck!");
    };

    const stopInterview = () => {
        setIsInterviewActive(false);
        toast("Interview ended. Recording saved to 'My Progress'.");
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => (prev + 1) % currentQuestions.length);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <DashboardLayout>
            <div className={activeTab === 'find-mentors' ? "h-[170vh] flex flex-col overflow-hidden font-sans" : "space-y-6 max-w-7xl mx-auto px-4 lg:px-8 pb-12 font-sans"}>
                {/* Header Section */}
                <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-4 mb-6">
                    <div style={{ perspective: '1000px' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                exit={{ rotateX: 90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="origin-top"
                            >
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' }}>
                                    {activeTab === 'find-mentors' ? 'Mentor Connect' : 'Mock Interview'}
                                </h1>
                                <p className="text-lg font-bold text-gray-600 bg-yellow-300 inline-block px-2 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                    {activeTab === 'find-mentors'
                                        ? 'Find an expert • Master the interview • Get hired'
                                        : 'Practice real questions • Record yourself • Get feedback'}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-none border-2 border-black px-3 py-1 font-bold bg-white text-black shadow-[4px_4px_0px_0px_#ff00ff]">
                            {MENTORS.length} Mentors Online
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="find-mentors" className={activeTab === 'find-mentors' ? "flex-1 flex flex-col min-h-0" : "w-full space-y-8"} onValueChange={setActiveTab}>
                    <div className={activeTab === 'find-mentors' ? "flex-1 flex flex-col md:flex-row gap-8 items-start min-h-0" : "flex flex-col md:flex-row gap-8 items-start"}>

                        {/* LEFT COLUMN: Tabs + Trending News - Fixed & Scrollable Sidebar */}
                        <div className={activeTab === 'find-mentors' ? "flex flex-col gap-8 md:w-72 shrink-0 h-full overflow-y-auto no-scrollbar pb-4" : "flex flex-col gap-8 md:w-72 shrink-0"}>
                            {/* Navigation Tabs */}
                            <TabsList className="flex-col h-auto items-stretch bg-transparent space-gap-0 p-0 rounded-none border-2 border-black shadow-[6px_6px_0px_0px_#000] bg-white">
                                <TabsTrigger
                                    value="find-mentors"
                                    className="rounded-none justify-start px-6 py-4 text-base font-bold type-button data-[state=active]:bg-[#ff00ff] data-[state=active]:text-white border-b-2 border-black last:border-0 hover:bg-gray-100 transition-colors"
                                >
                                    <Search className="mr-3 h-5 w-5" /> Find Mentors
                                </TabsTrigger>
                                <TabsTrigger
                                    value="simulator"
                                    className="rounded-none justify-start px-6 py-4 text-base font-bold data-[state=active]:bg-[#adfa1d] data-[state=active]:text-black hover:bg-gray-100 transition-colors"
                                >
                                    <Video className="mr-3 h-5 w-5" /> Simulator
                                </TabsTrigger>
                            </TabsList>

                            {/* New Trending Articles / Topics Component */}
                            <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_#ff0000] min-h-[550px] flex flex-col">
                                <div className="bg-black text-white p-3 border-b-2 border-black flex-none">
                                    <h3 className="font-black text-xl uppercase tracking-widest text-center">
                                        {activeTab === 'find-mentors' ? 'Trending' : 'Select Topic'}
                                    </h3>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto">
                                    <ul className="space-y-4">
                                        {activeTab === 'find-mentors' ? (
                                            TRENDING_ARTICLES.map((article, i) => (
                                                <li key={i} className="group cursor-pointer">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <Badge className="rounded-none bg-black text-white hover:bg-black border border-black text-[10px] px-1 py-0 uppercase">
                                                            {article.tag}
                                                        </Badge>
                                                        <span className="text-xs font-bold text-gray-500">{article.date}</span>
                                                    </div>
                                                    <h4 className="font-bold leading-tight group-hover:text-[#ff0000] transition-colors line-clamp-2">
                                                        {article.title}
                                                    </h4>
                                                    <div className="h-0.5 w-full bg-gray-200 mt-3 group-hover:bg-[#ff0000] transition-colors" />
                                                </li>
                                            ))
                                        ) : (
                                            INTERVIEW_TOPICS.map((topic, i) => (
                                                <li key={i} onClick={() => setSelectedTopic(topic.title)} className={`group cursor-pointer p-3 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] ${selectedTopic === topic.title ? 'bg-black text-white ring-2 ring-offset-2 ring-black' : topic.color}`}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-black uppercase tracking-tight">{topic.title}</span>
                                                        <Badge className={`rounded-none border border-black text-[10px] px-1 py-0 uppercase group-hover:bg-white group-hover:text-black ${selectedTopic === topic.title ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                                            {topic.count}
                                                        </Badge>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                                <div className="p-3 border-t-2 border-black bg-gray-50 flex-none text-center">
                                    <a href="#" className="font-bold text-sm uppercase tracking-wider underline hover:text-[#ff0000]">
                                        {activeTab === 'find-mentors' ? 'View All News →' : 'View All Topics →'}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Content Area */}
                        <div className={activeTab === 'find-mentors' ? "flex-1 w-full min-w-0 h-full flex flex-col" : "flex-1 w-full min-w-0"}>
                            <TabsContent value="find-mentors" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=active]:flex">
                                {/* Search Bar - Fixed */}
                                <div className="flex-none flex gap-0 group shadow-[6px_6px_0px_0px_#4ecdc4] mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-3.5 h-6 w-6 text-black" />
                                        <Input
                                            placeholder="Search by name, company, or skill..."
                                            className="pl-12 rounded-none border-2 border-black h-14 text-lg font-bold placeholder:text-gray-400 focus-visible:ring-0 border-r-0 bg-white"
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="ghost" className="rounded-none border-2 border-black h-14 px-8 bg-[#adfa1d] text-black hover:bg-[#8ce000] font-black text-lg tracking-tight uppercase">
                                        <Filter className="mr-2 h-5 w-5" /> Filter
                                    </Button>
                                </div>

                                {/* Mentor Grid - Scrollable */}
                                <div className="flex-1 overflow-y-auto pr-4 pb-4">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <AnimatePresence>
                                            {filteredMentors.map((mentor) => (
                                                <motion.div
                                                    key={mentor.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="group"
                                                >
                                                    <Card className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 h-full flex flex-col bg-white overflow-hidden">
                                                        {/* Colorful Header */}
                                                        <div className={`relative h-20 ${mentor.color} border-b-2 border-black flex items-start justify-end p-2`}>
                                                            <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white p-1 border-2 border-black hover:bg-blue-600 hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5" title="Connect on LinkedIn">
                                                                <Linkedin className="h-4 w-4" />
                                                            </a>
                                                        </div>

                                                        <div className="px-6 -mt-10 mb-2 relative z-10">
                                                            <img
                                                                src={mentor.image}
                                                                alt={mentor.name}
                                                                className="w-20 h-20 rounded-none border-2 border-black object-cover bg-white shadow-[4px_4px_0px_0px_#000]"
                                                            />
                                                        </div>

                                                        <CardContent className="p-4 pt-2 flex-1 flex flex-col gap-4">
                                                            <div>
                                                                <h3 className="font-heading text-2xl font-black leading-tight mb-1">{mentor.name}</h3>
                                                                <p className="text-sm font-bold text-gray-600 flex items-center gap-1 uppercase tracking-tight">
                                                                    {mentor.role} <span className="text-black mx-1">@</span> {mentor.company}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                {mentor.skills.slice(0, 3).map(skill => (
                                                                    <span key={skill} className="px-2 py-1 text-xs uppercase tracking-wider font-bold border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-dashed border-gray-300">
                                                                <div className="flex items-center gap-1.5 bg-yellow-300 px-2 py-1 border border-black shadow-[2px_2px_0px_0px_#000]">
                                                                    <Star className="h-4 w-4 fill-black text-black" />
                                                                    <span className="text-sm font-black">{mentor.rating}</span>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    className="rounded-none border-2 border-black bg-black text-white hover:bg-[#ff00ff] hover:text-white font-bold tracking-wider uppercase shadow-[3px_3px_0px_0px_#888] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-y-[2px] transition-all"
                                                                    onClick={() => toast.success(`Request sent to ${mentor.name}!`)}
                                                                >
                                                                    Connect Now
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="simulator" className="flex-1 flex flex-col min-h-0 mt-0 overflow-y-auto pr-4 pb-4 border-2 border-transparent data-[state=active]:flex">
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* Left: Video & Controls */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="rounded-none border-2 border-black shadow-[8px_8px_0px_0px_#adfa1d] overflow-hidden bg-black">
                                            <div className="relative aspect-video flex items-center justify-center bg-gray-900 border-b-2 border-white">
                                                {isInterviewActive ? (
                                                    <>
                                                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                                                        <div className="absolute top-4 left-4 bg-[#ff0000] text-white px-3 py-1 font-mono text-sm font-bold animate-pulse flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_0px_#000]">
                                                            <div className="w-3 h-3 bg-white rounded-full"></div> REC {formatTime(recordingTime)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-gray-500 space-y-4">
                                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-dashed border-gray-700">
                                                            <Video className="h-10 w-10 text-gray-700" />
                                                        </div>
                                                        <p className="font-mono text-sm uppercase tracking-widest text-gray-400">Camera Feed Offline</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 bg-white border-t-2 border-black flex justify-between items-center">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border-2 border-black text-xs font-black uppercase">
                                                        <Mic className="h-4 w-4" /> {isInterviewActive ? 'On' : 'Off'}
                                                    </div>
                                                </div>
                                                {!isInterviewActive ? (
                                                    <Button onClick={startInterview} className="rounded-none border-2 border-black bg-[#adfa1d] hover:bg-[#8ce000] text-black font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                                        <Play className="mr-2 h-5 w-5" /> Start Simulation
                                                    </Button>
                                                ) : (
                                                    <Button onClick={stopInterview} className="rounded-none border-2 border-black bg-[#ff0000] text-white hover:bg-[#cc0000] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                                        <CheckCircle2 className="mr-2 h-5 w-5" /> Finish Session
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>

                                        {/* Question Board */}
                                        <Card className="rounded-none border-2 border-black shadow-[6px_6px_0px_0px_#ff9f1c]">
                                            <CardHeader className="border-b-2 border-black bg-yellow-300 py-3">
                                                <CardTitle className="flex justify-between items-center text-sm font-black uppercase tracking-wider text-black">
                                                    <span>Question {currentQuestionIndex + 1} / {currentQuestions.length}</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-none border-2 border-black hover:bg-black hover:text-white"
                                                            disabled={currentQuestionIndex === 0}
                                                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                                        >
                                                            &larr;
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-none border-2 border-black hover:bg-black hover:text-white"
                                                            disabled={currentQuestionIndex === currentQuestions.length - 1}
                                                            onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
                                                        >
                                                            &rarr;
                                                        </Button>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 text-center bg-white min-h-[300px] flex flex-col justify-center items-center">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={currentQuestionIndex}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="w-full max-w-2xl"
                                                    >
                                                        <h2 className="text-3xl font-black mb-6 leading-tight min-h-[4.5rem]">
                                                            {currentQuestions[currentQuestionIndex]}
                                                        </h2>

                                                        <div className="flex justify-center gap-4">
                                                            {!isInterviewActive ? (
                                                                <Button size="lg" onClick={startInterview} className="rounded-none bg-black text-white hover:bg-[#4ecdc4] hover:text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] font-bold text-lg px-8">
                                                                    Start Answer
                                                                </Button>
                                                            ) : (
                                                                <Button size="lg" onClick={stopInterview} className="rounded-none bg-red-500 text-white hover:bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_#000] font-bold text-lg px-8">
                                                                    Stop Recording
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>

                                    </div>

                                    {/* Right: Notes & Tips */}
                                    <div className="space-y-6">
                                        <Card className="rounded-none border-2 border-black h-full flex flex-col shadow-[6px_6px_0px_0px_#00ffff]">
                                            <CardHeader className="bg-[#00ffff] border-b-2 border-black py-4">
                                                <CardTitle className="flex items-center gap-2 text-base font-black uppercase tracking-wider">
                                                    <MessageSquare className="h-5 w-5" /> AI Coach Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-6 flex-1 flex flex-col bg-white">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-black uppercase bg-black text-white inline-block px-1">Focus Areas</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['STAR Method', 'Clarity', 'Tone'].map(tag => (
                                                            <Badge key={tag} className="rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors cursor-default text-[10px] px-2 py-0.5 font-bold uppercase shadow-[2px_2px_0px_0px_#ccc]">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-yellow-100 p-4 border-2 border-black text-xs font-bold leading-relaxed shadow-[4px_4px_0px_0px_#000]">
                                                    <strong className="block text-base mb-1 uppercase">🔥 Pro Tip:</strong>
                                                    Don't just answer the question. Tell a story. Use the camera eye-contact to build connection even with AI.
                                                </div>

                                                <div className="flex-1 flex flex-col mt-2">
                                                    <label className="text-xs font-black uppercase mb-2">Scratchpad</label>
                                                    <Input
                                                        placeholder="Quick notes..."
                                                        className="flex-1 rounded-none border-2 border-black align-top p-4 resize-none bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_#000] transition-all font-mono text-sm"
                                                        as="textarea"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
