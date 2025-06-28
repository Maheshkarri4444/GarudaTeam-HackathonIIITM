import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Target, Layers, BarChart3, FileText, Play, Shield, Anchor, Plane, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Eye,
      title: "YOLO11 Detection",
      description: "Advanced object detection using the latest YOLO11 architecture for real-time threat identification and classification.",
      color: "text-blue-400"
    },
    {
      icon: Target,
      title: "SAM2 Segmentation",
      description: "Precise object segmentation using Segment Anything Model 2 for detailed boundary detection and isolation.",
      color: "text-green-400"
    },
    {
      icon: Layers,
      title: "Depth Analysis",
      description: "Depth_Anything_V2 integration for comprehensive 3D spatial analysis and distance measurement capabilities.",
      color: "text-purple-400"
    },
    {
      icon: BarChart3,
      title: "Real-time Processing",
      description: "Frame-by-frame analysis with instant results and comprehensive reporting for tactical decision making.",
      color: "text-orange-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000); // Faster animation - 2 seconds instead of 3
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Shield className="w-16 h-16 text-blue-400 mr-4" />
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                GARUDA
              </h1>
              <p className="text-xl text-gray-300 font-light">Automated Enhanced Global Intelligence System</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4 text-gray-100">
              Advanced Military Surveillance & Intelligence Platform
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              State-of-the-art automated surveillance system designed for military operations. 
              Integrating cutting-edge AI models for comprehensive threat detection, analysis, and reporting.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Feature Showcase */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center mb-8">Core Technologies</h3>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 ${
                    currentFeature === index ? 'scale-105 border-blue-500/50 shadow-2xl shadow-blue-500/20' : 'hover:scale-102'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-800/50 ${currentFeature === index ? 'animate-pulse' : ''}`}>
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Demo */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Real-Time Analysis</h4>
                  <p className="text-gray-400 text-sm">Processing live surveillance feeds</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Detection Accuracy</span>
                    <span className="text-green-400 font-semibold">82.7%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Processing Speed</span>
                    <span className="text-blue-400 font-semibold">30 FPS</span>
                  </div>
                  {/* <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Threat Level</span>
                    <span className="text-orange-400 font-semibold">MEDIUM</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Capabilities */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-8">Mission Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-600/30">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Ground Operations</h4>
              <p className="text-gray-400 text-sm">Infantry and vehicle detection for ground-based missions</p>
            </div>
            <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30">
              <Anchor className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Naval Operations</h4>
              <p className="text-gray-400 text-sm">Maritime surveillance and vessel identification</p>
            </div>
            <div className="bg-gradient-to-br from-sky-800/30 to-sky-900/30 backdrop-blur-sm rounded-2xl p-6 border border-sky-600/30">
              <Plane className="w-12 h-12 text-sky-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Aerial Operations</h4>
              <p className="text-gray-400 text-sm">Airborne threat detection and tracking</p>
            </div>
            <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-600/30">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Civilian Operations</h4>
              <p className="text-gray-400 text-sm">Public safety and crowd monitoring systems</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/system')}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-3">
              <Play className="w-6 h-6" />
              <span>Initialize System</span>
            </div>
          </button>
          <p className="text-gray-400 text-sm mt-4">Click to access the surveillance control center</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;