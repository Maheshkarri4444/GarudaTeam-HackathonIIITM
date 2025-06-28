// import React, { useState } from 'react';
// import { Upload, Download, FileText, Archive, RotateCcw, Target, Shield, Anchor, Plane, Zap, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import armyimg from "../assets/army.jpg";
// import airforce from "../assets/airforce.jpg";
// import navy from "../assets/navy.avif";
// import weapons from "../assets/weapons.jpeg";


// const MainSystem = () => {
//   const navigate = useNavigate();
//   const [mode, setMode] = useState('Army');
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [videoURL, setVideoURL] = useState(null);
//   const [mp4Path, setMp4Path] = useState(null);
//   const [fileId, setFileId] = useState(null);
//   const [uploadURL, setUploadURL] = useState(null);
//   const [uploadingStarted, setUploadingStarted] = useState(false);

//   const resetAll = () => {
//     setMode('Army');
//     setFile(null);
//     setLoading(false);
//     setVideoURL(null);
//     setMp4Path(null);
//     setFileId(null);
//     setUploadURL(null);
//     setUploadingStarted(false);
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files && e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       console.log('File selected:', selectedFile.name);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file');
//       return;
//     }

//     console.log('Starting upload process...');
//     setUploadingStarted(true);
//     setLoading(true);
    
//     const formData = new FormData();
//     formData.append('mode', mode);
//     formData.append('file', file);
//     setUploadURL(URL.createObjectURL(file));

//     try {
//       const response = await fetch('http://localhost:8000/process', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setVideoURL(`http://localhost:8000/download/${data.gif_path}`);
//       setMp4Path(`http://localhost:8000/download/${data.mp4_path}`);
//       setFileId(data.file_id);
//     } catch (err) {
//       alert('Upload failed! Please check if the server is running.');
//       console.error('Upload error:', err);
//       setUploadingStarted(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getModeConfig = () => {
//     const configs = {
//       Army: {
//         background: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-900',
//         pattern: 'bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.15)_0%,transparent_50%)]',
//         card: 'bg-gradient-to-br from-green-800/90 to-green-900/90 border-green-500/30',
//         primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
//         secondary: 'bg-gradient-to-r from-green-700/80 to-emerald-700/80 hover:from-green-600/80 hover:to-emerald-600/80',
//         accent: 'text-green-400',
//         icon: Shield,
//         image: armyimg,
//         title: 'Ground Forces',
//         description: 'Infantry and armored vehicle detection for ground-based operations'
//       },
//       Navy: {
//         background: 'bg-gradient-to-br from-slate-100 via-gray-200 to-blue-100',
//         pattern: 'bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]',
//         card: 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-300/50',
//         primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
//         secondary: 'bg-gradient-to-r from-gray-200/80 to-blue-200/80 hover:from-gray-300/80 hover:to-blue-300/80',
//         accent: 'text-blue-600',
//         icon: Anchor,
//         image: navy,
//         title: 'Naval Operations',
//         description: 'Maritime surveillance and vessel identification systems',
//         textColor: 'text-gray-800'
//       },
//       Airforce: {
//         background: 'bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900',
//         pattern: 'bg-[radial-gradient(circle_at_50%_25%,rgba(125,211,252,0.15)_0%,transparent_50%)]',
//         card: 'bg-gradient-to-br from-sky-800/90 to-blue-900/90 border-sky-500/30',
//         primary: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500',
//         secondary: 'bg-gradient-to-r from-sky-700/80 to-blue-700/80 hover:from-sky-600/80 hover:to-blue-600/80',
//         accent: 'text-sky-400',
//         icon: Plane,
//         image: airforce,
//         title: 'Air Superiority',
//         description: 'Aerial threat detection and airspace monitoring'
//       },
//       Guns: {
//         background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900',
//         pattern: 'bg-[radial-gradient(circle_at_25%_75%,rgba(156,163,175,0.15)_0%,transparent_50%)]',
//         card: 'bg-gradient-to-br from-gray-800/90 to-slate-900/90 border-gray-500/30',
//         primary: 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500',
//         secondary: 'bg-gradient-to-r from-gray-700/80 to-slate-700/80 hover:from-gray-600/80 hover:to-slate-600/80',
//         accent: 'text-gray-400',
//         icon: Zap,
//         image: weapons,
//         title: 'Tactical Weapons',
//         description: 'Advanced weapons systems and ballistic analysis'
//       }
//     };
//     return configs[mode];
//   };

//   const config = getModeConfig();
//   const IconComponent = config.icon;
//   const textColor = config.textColor || 'text-white';

//   return (
//     <div className={` min-h-[calc(100vh-200px)] ${config.background} ${config.pattern} ${textColor} transition-all duration-700`}>
//       {/* Fixed Background Overlay */}
//       <div className={`fixed inset-0 ${config.background} ${config.pattern} -z-10`}></div>
      
//       {/* Header */}
//       <div className="relative pt-8 pb-6">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative z-10 container mx-auto px-6">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate('/')}
//               className={`flex items-center space-x-2 ${config.secondary} px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300`}
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Home</span>
//             </button>
//             <div className="text-center">
//               <h1 className="text-3xl font-bold">GARUDA</h1>
//               <p className={`${config.accent} font-medium`}>Automated Surveillance System</p>
//             </div>
//             <div className="w-32"></div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 mt-10 pb-12 min-h-[calc(100vh-200px)]">
//         <div className="flex gap-8 min-h-[calc(100vh-200px)]">
//           {/* Left Panel - Mode Image */}
//           <div className="w-1/2 relative">
//             <div className="h-full relative overflow-hidden rounded-3xl min-h-[600px]">
//               <div 
//                 key={mode}
//                 className="absolute inset-0 bg-cover bg-center transition-all duration-700 animate-[slideInLeft_0.7s_ease-out]"
//                 style={{ backgroundImage: `url(${config.image})` }}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
//                 <div className="absolute bottom-8 left-8 z-10">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className={`p-4 rounded-2xl ${config.card} backdrop-blur-sm`}>
//                       <IconComponent className={`w-8 h-8 ${config.accent}`} />
//                     </div>
//                     <div>
//                       <h2 className="text-3xl font-bold text-white">{config.title}</h2>
//                       <p className="text-gray-200 text-lg">{config.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Panel - Controls */}
//           <div className="w-1/2 flex flex-col min-h-[600px]">
//             {/* Mode Selection */}
//             <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl mb-6`}>
//               <h3 className="text-xl font-semibold mb-4">Operation Mode</h3>
//               <div className="space-y-3">
//                 {['Army', 'Navy', 'Airforce', 'Guns'].map((modeOption) => {
//                   const isSelected = mode === modeOption;
//                   return (
//                     <button
//                       key={modeOption}
//                       onClick={() => setMode(modeOption)}
//                       className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
//                         isSelected
//                           ? `${config.primary} border-transparent shadow-lg scale-105`
//                           : `${config.secondary} border-transparent hover:scale-102`
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-black/20'}`}>
//                           {modeOption === 'Army' && <Shield className="w-5 h-5" />}
//                           {modeOption === 'Navy' && <Anchor className="w-5 h-5" />}
//                           {modeOption === 'Airforce' && <Plane className="w-5 h-5" />}
//                           {modeOption === 'Guns' && <Zap className="w-5 h-5" />}
//                         </div>
//                         <span className="font-semibold">{modeOption}</span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {!uploadingStarted ? (
//               /* File Upload Section */
//               <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl flex-1`}>
//                 <h3 className="text-xl font-semibold mb-4">Mission Data Upload</h3>
                
//                 <div className="mb-6">
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={handleFileChange}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       id="file-upload"
//                     />
//                     <div className={`${config.secondary} backdrop-blur-sm rounded-xl p-8 border-2 border-dashed border-opacity-50 hover:border-opacity-70 transition-all duration-300 cursor-pointer`}>
//                       <div className="text-center">
//                         <Upload className="w-12 h-12 mx-auto mb-4 opacity-60" />
//                         <p className="text-lg font-medium mb-2">
//                           {file ? file.name : 'Drop surveillance footage here'}
//                         </p>
//                         <p className="text-sm opacity-60">
//                           {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB - Ready for analysis` : 'or click to browse files'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleUpload}
//                   disabled={!file}
//                   className={`w-full ${config.primary} disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-4 px-8 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
//                 >
//                   <Upload className="w-5 h-5 inline mr-2" />
//                   Begin Analysis
//                 </button>
//               </div>
//             ) : (
//               /* Processing Section */
//               <div className="flex-1 space-y-6">
//                 {/* Source Video */}
//                 <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
//                   <div className="flex items-center mb-4">
//                     <Upload className={`w-5 h-5 ${config.accent} mr-2`} />
//                     <h3 className="text-lg font-semibold">Source Material</h3>
//                   </div>
//                   <div className="aspect-video bg-black/30 rounded-xl overflow-hidden">
//                     <video
//                       controls
//                       src={uploadURL || undefined}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>

//                 {/* Analysis Output */}
//                 <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
//                   <div className="flex items-center mb-4">
//                     <Target className={`w-5 h-5 ${config.accent} mr-2`} />
//                     <h3 className="text-lg font-semibold">
//                       {loading ? 'Processing...' : 'Analysis Complete'}
//                     </h3>
//                   </div>
                  
//                   <div className="aspect-video bg-black/30 rounded-xl overflow-hidden flex items-center justify-center">
//                     {loading ? (
//                       <div className="text-center">
//                         <div className="relative flex items-center justify-center">
//                           <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <IconComponent className={`w-6 h-6 ${config.accent}`} />
//                           </div>
//                         </div>
//                         <p className="mt-4 opacity-60">Analyzing surveillance data...</p>
//                       </div>
//                     ) : videoURL ? (
//                       <img
//                         src={videoURL}
//                         alt="Analysis Result"
//                         className="w-full h-full object-cover rounded-lg"
//                       />
//                     ) : (
//                       <div className="text-center opacity-60">
//                         <Target className="w-12 h-12 mx-auto mb-2" />
//                         <p>Awaiting analysis results...</p>
//                       </div>
//                     )}
//                   </div>

//                   {!loading && videoURL && mp4Path && (
//                     <div className="mt-4 flex space-x-3">
//                       <a
//                         href={mp4Path}
//                         download
//                         className={`${config.primary} rounded-lg py-2 px-4 font-medium transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center`}
//                       >
//                         <Download className="w-4 h-4 mr-2" />
//                         Download
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Panel */}
//         {fileId && !loading && (
//           <div className="mt-8">
//             <div className={`${config.card} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl`}>
//               <h3 className="text-2xl font-semibold text-center mb-8">Mission Reports & Intelligence</h3>
              
//               <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 <a
//                   href={`http://localhost:8000/report/${fileId}`}
//                   download
//                   className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
//                 >
//                   <FileText className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
//                   <h4 className="font-semibold mb-2">Intelligence Report</h4>
//                   <p className="text-sm opacity-60">Comprehensive analysis</p>
//                 </a>

//                 <a
//                   href={`http://localhost:8000/imageszip/${fileId}`}
//                   download
//                   className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
//                 >
//                   <Archive className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
//                   <h4 className="font-semibold mb-2">Source Frames</h4>
//                   <p className="text-sm opacity-60">Original footage</p>
//                 </a>

//                 <a
//                   href={`http://localhost:8000/segmentedzip/${fileId}`}
//                   download
//                   className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
//                 >
//                   <Target className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
//                   <h4 className="font-semibold mb-2">Segmented Data</h4>
//                   <p className="text-sm opacity-60">Processed analysis</p>
//                 </a>

//                 <button
//                   onClick={resetAll}
//                   className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group text-white`}
//                 >
//                   <RotateCcw className={`w-8 h-8 text-red-200 mb-3 group-hover:scale-110 transition-transform`} />
//                   <h4 className="font-semibold mb-2">Reset</h4>
//                   <p className="text-sm text-red-200">New mission</p>
//                 </button>

//                 <button
//                   onClick={() => navigate('/')}
//                   className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
//                 >
//                   <ArrowLeft className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
//                   <h4 className="font-semibold mb-2">Home</h4>
//                   <p className="text-sm opacity-60">Return to main</p>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes slideInLeft {
//           from {
//             transform: translateX(-100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MainSystem;


import React, { useState } from 'react';
import { Upload, Download, FileText, Archive, RotateCcw, Target, Shield, Anchor, Plane, Zap, ArrowLeft, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import armyimg from "../assets/army.jpg";
import airforce from "../assets/airforce.jpg";
import navy from "../assets/navy.avif";
import weapons from "../assets/weapons.jpeg";


const MainSystem = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('Army');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [mp4Path, setMp4Path] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploadURL, setUploadURL] = useState(null);
  const [uploadingStarted, setUploadingStarted] = useState(false);

  const resetAll = () => {
    setMode('Army');
    setFile(null);
    setLoading(false);
    setVideoURL(null);
    setMp4Path(null);
    setFileId(null);
    setUploadURL(null);
    setUploadingStarted(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('File selected:', selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    console.log('Starting upload process...');
    setUploadingStarted(true);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('mode', mode);
    formData.append('file', file);
    setUploadURL(URL.createObjectURL(file));

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVideoURL(`http://localhost:8000/download/${data.gif_path}`);
      setMp4Path(`http://localhost:8000/download/${data.mp4_path}`);
      setFileId(data.file_id);
    } catch (err) {
      alert('Upload failed! Please check if the server is running.');
      console.error('Upload error:', err);
      setUploadingStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const getModeConfig = () => {
    const configs = {
      Army: {
        background: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-900',
        pattern: 'bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.15)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-green-800/90 to-green-900/90 border-green-500/30',
        primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
        secondary: 'bg-gradient-to-r from-green-700/80 to-emerald-700/80 hover:from-green-600/80 hover:to-emerald-600/80',
        accent: 'text-green-400',
        icon: Shield,
        image: armyimg,
        title: 'Ground Forces',
        description: 'Infantry and armored vehicle detection for ground-based operations'
      },
      Navy: {
        background: 'bg-gradient-to-br from-slate-100 via-gray-200 to-blue-100',
        pattern: 'bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-300/50',
        primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
        secondary: 'bg-gradient-to-r from-gray-200/80 to-blue-200/80 hover:from-gray-300/80 hover:to-blue-300/80',
        accent: 'text-blue-600',
        icon: Anchor,
        image: navy,
        title: 'Naval Operations',
        description: 'Maritime surveillance and vessel identification systems',
        textColor: 'text-gray-800'
      },
      Airforce: {
        background: 'bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900',
        pattern: 'bg-[radial-gradient(circle_at_50%_25%,rgba(125,211,252,0.15)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-sky-800/90 to-blue-900/90 border-sky-500/30',
        primary: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500',
        secondary: 'bg-gradient-to-r from-sky-700/80 to-blue-700/80 hover:from-sky-600/80 hover:to-blue-600/80',
        accent: 'text-sky-400',
        icon: Plane,
        image: airforce,
        title: 'Air Superiority',
        description: 'Aerial threat detection and airspace monitoring'
      },
      Guns: {
        background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900',
        pattern: 'bg-[radial-gradient(circle_at_25%_75%,rgba(156,163,175,0.15)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-gray-800/90 to-slate-900/90 border-gray-500/30',
        primary: 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500',
        secondary: 'bg-gradient-to-r from-gray-700/80 to-slate-700/80 hover:from-gray-600/80 hover:to-slate-600/80',
        accent: 'text-gray-400',
        icon: Zap,
        image: weapons,
        title: 'Tactical Weapons',
        description: 'Advanced weapons systems and ballistic analysis'
      },
      NightMode: {
        background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-black',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-indigo-500/30',
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
        secondary: 'bg-gradient-to-r from-indigo-800/80 to-purple-800/80 hover:from-indigo-700/80 hover:to-purple-700/80',
        accent: 'text-indigo-400',
        icon: Moon,
        image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
        title: 'Night Operations',
        description: 'Low-light surveillance and thermal imaging systems'
      }
    };
    return configs[mode];
  };

  const config = getModeConfig();
  const IconComponent = config.icon;
  const textColor = config.textColor || 'text-white';

  return (
    <div className={`min-h-screen ${config.background} ${config.pattern} ${textColor} transition-all duration-700`}>
      {/* Fixed Background Overlay */}
      <div className={`fixed inset-0 ${config.background} ${config.pattern} -z-10`}></div>
      
      {/* Header */}
      <div className="relative pt-8 pb-6">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 ${config.secondary} px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold">AEGIS Control Center</h1>
              <p className={`${config.accent} font-medium`}>Automated Surveillance System</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="container mt-10 mx-auto px-6 pb-12 min-h-[calc(100vh-200px)]">
        <div className="flex gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Mode Image */}
          <div className="w-1/2 relative">
            <div className="h-full relative overflow-hidden rounded-3xl min-h-[600px]">
              <div 
                key={mode}
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 animate-[slideInLeft_0.7s_ease-out]"
                style={{ backgroundImage: `url(${config.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-4 rounded-2xl ${config.card} backdrop-blur-sm`}>
                      <IconComponent className={`w-8 h-8 ${config.accent}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{config.title}</h2>
                      <p className="text-gray-200 text-lg">{config.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-1/2 flex flex-col min-h-[600px]">
            {/* Mode Selection */}
            <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl mb-6`}>
              <h3 className="text-xl font-semibold mb-4">Operation Mode</h3>
              <div className="space-y-3">
                {['Army', 'Navy', 'Airforce', 'Guns', 'NightMode'].map((modeOption) => {
                  const isSelected = mode === modeOption;
                  return (
                    <button
                      key={modeOption}
                      onClick={() => setMode(modeOption)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? `${config.primary} border-transparent shadow-lg scale-105`
                          : `${config.secondary} border-transparent hover:scale-102`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-black/20'}`}>
                          {modeOption === 'Army' && <Shield className="w-5 h-5" />}
                          {modeOption === 'Navy' && <Anchor className="w-5 h-5" />}
                          {modeOption === 'Airforce' && <Plane className="w-5 h-5" />}
                          {modeOption === 'Guns' && <Zap className="w-5 h-5" />}
                          {modeOption === 'NightMode' && <Moon className="w-5 h-5" />}
                        </div>
                        <span className="font-semibold">{modeOption === 'NightMode' ? 'Night Mode' : modeOption}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {!uploadingStarted ? (
              /* File Upload Section */
              <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl flex-1`}>
                <h3 className="text-xl font-semibold mb-4">Mission Data Upload</h3>
                
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="file-upload"
                    />
                    <div className={`${config.secondary} backdrop-blur-sm rounded-xl p-8 border-2 border-dashed border-opacity-50 hover:border-opacity-70 transition-all duration-300 cursor-pointer`}>
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 opacity-60" />
                        <p className="text-lg font-medium mb-2">
                          {file ? file.name : 'Drop surveillance footage here'}
                        </p>
                        <p className="text-sm opacity-60">
                          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB - Ready for analysis` : 'or click to browse files'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className={`w-full ${config.primary} disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-4 px-8 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Begin Analysis
                </button>
              </div>
            ) : (
              /* Processing Section */
              <div className="flex-1 space-y-6">
                {/* Source Video */}
                <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
                  <div className="flex items-center mb-4">
                    <Upload className={`w-5 h-5 ${config.accent} mr-2`} />
                    <h3 className="text-lg font-semibold">Source Material</h3>
                  </div>
                  <div className="aspect-video bg-black/30 rounded-xl overflow-hidden">
                    <video
                      controls
                      src={uploadURL || undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Analysis Output */}
                <div className={`${config.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
                  <div className="flex items-center mb-4">
                    <Target className={`w-5 h-5 ${config.accent} mr-2`} />
                    <h3 className="text-lg font-semibold">
                      {loading ? 'Processing...' : 'Analysis Complete'}
                    </h3>
                  </div>
                  
                  <div className="aspect-video bg-black/30 rounded-xl overflow-hidden flex items-center justify-center">
                    {loading ? (
                      <div className="text-center">
                        <div className="relative flex items-center justify-center">
                          <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IconComponent className={`w-6 h-6 ${config.accent}`} />
                          </div>
                        </div>
                        <p className="mt-4 opacity-60">Analyzing surveillance data...</p>
                      </div>
                    ) : videoURL ? (
                      <img
                        src={videoURL}
                        alt="Analysis Result"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center opacity-60">
                        <Target className="w-12 h-12 mx-auto mb-2" />
                        <p>Awaiting analysis results...</p>
                      </div>
                    )}
                  </div>

                  {!loading && videoURL && mp4Path && (
                    <div className="mt-4 flex space-x-3">
                      <a
                        href={mp4Path}
                        download
                        className={`${config.primary} rounded-lg py-2 px-4 font-medium transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        {fileId && !loading && (
          <div className="mt-8">
            <div className={`${config.card} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl`}>
              <h3 className="text-2xl font-semibold text-center mb-8">Mission Reports & Intelligence</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <a
                  href={`http://localhost:8000/report/${fileId}`}
                  download
                  className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <FileText className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Intelligence Report</h4>
                  <p className="text-sm opacity-60">Comprehensive analysis</p>
                </a>

                <a
                  href={`http://localhost:8000/imageszip/${fileId}`}
                  download
                  className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <Archive className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Source Frames</h4>
                  <p className="text-sm opacity-60">Original footage</p>
                </a>

                <a
                  href={`http://localhost:8000/segmentedzip/${fileId}`}
                  download
                  className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <Target className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Segmented Data</h4>
                  <p className="text-sm opacity-60">Processed analysis</p>
                </a>

                <button
                  onClick={resetAll}
                  className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group text-white`}
                >
                  <RotateCcw className={`w-8 h-8 text-red-200 mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Reset</h4>
                  <p className="text-sm text-red-200">New mission</p>
                </button>

                <button
                  onClick={() => navigate('/')}
                  className={`${config.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <ArrowLeft className={`w-8 h-8 ${config.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Home</h4>
                  <p className="text-sm opacity-60">Return to main</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MainSystem;