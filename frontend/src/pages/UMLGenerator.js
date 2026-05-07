import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Save, Copy, Play, FileCode, Layout as LayoutIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_UML = `classDiagram
    class User {
        +String id
        +String username
        +String password
        +String role
        +String name
        +String phone
        +String email
        +boolean passwordResetRequested
    }
    class Car {
        +String id
        +String brand
        +String model
        +double pricePerDay
        +boolean isAvailable
        +String fuelType
        +String transmission
        +int seatingCapacity
        +int year
    }
    class Booking {
        +String id
        +String userId
        +String carId
        +long startDate
        +long endDate
        +double totalPrice
        +String status
    }
    User "1" --> "*" Booking : makes
    Car "1" --> "*" Booking : assigned to
    Booking ..> User : references
    Booking ..> Car : references`;

const UMLGenerator = () => {
    const [code, setCode] = useState(DEFAULT_UML);
    const [error, setError] = useState(null);
    const mermaidRef = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
        });
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (mermaidRef.current) {
                try {
                    mermaidRef.current.innerHTML = '';
                    const { svg } = await mermaid.render('mermaid-diagram', code);
                    mermaidRef.current.innerHTML = svg;
                    setError(null);
                } catch (err) {
                    console.error('Mermaid rendering error:', err);
                    setError('Invalid Mermaid syntax. Please check your code.');
                }
            }
        };

        const timer = setTimeout(renderDiagram, 500);
        return () => clearTimeout(timer);
    }, [code]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        toast.success('Mermaid code copied to clipboard!');
    };

    const handleDownloadSVG = () => {
        const svg = mermaidRef.current.innerHTML;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'uml-diagram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('SVG downloaded successfully!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Online UML Generator
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Design and visualize your system architecture with Mermaid.js
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        >
                            <Copy size={18} />
                            <span>Copy Code</span>
                        </button>
                        <button
                            onClick={handleDownloadSVG}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg shadow-blue-600/20"
                        >
                            <Save size={18} />
                            <span>Save SVG</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px]">
                            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <FileCode size={16} />
                                    Mermaid Script
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setCode(DEFAULT_UML)}
                                        className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400"
                                        title="Reset to default"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 bg-transparent p-6 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-blue-100 leading-relaxed"
                                spellCheck="false"
                            />
                        </div>
                        
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                <LayoutIcon size={16} />
                                Quick Tips
                            </h3>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Use <code className="text-blue-300">classDiagram</code> for static structures.</li>
                                <li>• Use <code className="text-blue-300">sequenceDiagram</code> for interactions.</li>
                                <li>• Define relationships with <code className="text-blue-300">--&gt;</code>, <code className="text-blue-300">--*</code>, etc.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px] relative">
                            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Play size={16} className="text-green-500" />
                                Live Preview
                            </div>
                            
                            <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[radial-gradient(#1a1a20_1px,transparent_1px)] [background-size:20px_20px]">
                                <div 
                                    ref={mermaidRef} 
                                    className="max-w-full transition-opacity duration-300"
                                    style={{ opacity: error ? 0.3 : 1 }}
                                />
                                
                                {error && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm backdrop-blur-md">
                                            {error}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                                <h4 className="text-sm font-medium mb-1 group-hover:text-blue-400 transition-colors">Documentation</h4>
                                <p className="text-xs text-gray-500">Learn Mermaid syntax and features</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                                <h4 className="text-sm font-medium mb-1 group-hover:text-blue-400 transition-colors">Export Image</h4>
                                <p className="text-xs text-gray-500">Generate high-res PNG or PDF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UMLGenerator;
