// import React, { useState } from 'react';

// function App() {
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

//   const handleUpload = async () => {
//     if (!file) return alert('Please select a file');

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

//       const data = await response.json();
//       setVideoURL(`http://localhost:8000/download/${data.gif_path}`);
//       setMp4Path(`http://localhost:8000/download/${data.mp4_path}`);
//       setFileId(data.file_id);
//     } catch (err) {
//       alert('Upload failed!');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">🎯 YOLO-SAM + Depth Analyzer</h1>

//       {!uploadingStarted && (
//         <div className="flex flex-col items-center space-y-6">
//           <select
//             value={mode}
//             onChange={(e) => setMode(e.target.value)}
//             className="p-2 rounded bg-gray-800 border border-gray-600"
//           >
//             <option>Army</option>
//             <option>Navy</option>
//             <option>Airforce</option>
//             <option>Guns</option>
//           </select>

//           <input
//             type="file"
//             accept="video/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="p-2 text-black bg-white rounded"
//           />

//           <button
//             onClick={handleUpload}
//             className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
//           >
//             Upload & Process
//           </button>
//         </div>
//       )}

//       {uploadingStarted && (
//         <div className="mt-10 flex justify-center space-x-10 items-start">
//           {/* Uploaded Video */}
//           <div className="flex flex-col items-center">
//             <h2 className="mb-2 text-lg font-bold">📤 Uploaded Video</h2>
//             <video
//               controls
//               src={uploadURL}
//               className="w-[400px] rounded shadow-lg"
//             />
//           </div>

//           {/* Right Side: Loader or Output */}
//           <div className="flex flex-col items-center">
//             <h2 className="mb-2 text-lg font-bold">
//               {loading ? '⏳ Processing Output' : '✅ Processed Output'}
//             </h2>

//             {loading ? (
//               <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-opacity-50"></div>
//             ) : (
//               <>
//                 <img
//                   src={videoURL}
//                   alt="Processed GIF"
//                   className="w-[400px] rounded shadow-lg"
//                 />
//                 <a
//                   href={mp4Path}
//                   download
//                   className="mt-2 inline-block px-4 py-2 bg-green-600 rounded hover:bg-green-700"
//                 >
//                   🎥 Download Video
//                 </a>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Downloads + Back */}
//       {fileId && !loading && (
//         <div className="flex flex-col items-center mt-8 space-y-3">
//           <a
//             href={`http://localhost:8000/report/${fileId}`}
//             download
//             className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
//           >
//             📄 Download PDF Report
//           </a>
//           <a
//             href={`http://localhost:8000/imageszip/${fileId}`}
//             download
//             className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
//           >
//             🗂️ Download Original Frames ZIP
//           </a>
//           <a
//             href={`http://localhost:8000/segmentedzip/${fileId}`}
//             download
//             className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700"
//           >
//             🧠 Download Segmented Frames ZIP
//           </a>
//           <button
//             onClick={resetAll}
//             className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
//           >
//             🔙 Back to Upload
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { Upload, Download, FileText, Archive, RotateCcw, Target, Shield, Plane, Zap } from 'lucide-react';

function App() {
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
    const selectedFile = e.target.files?.[0];
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

  const getThemeClasses = () => {
    const themes = {
      Army: {
        background: 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-900',
        pattern: 'bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-green-800/90 to-green-900/90 border-green-600/30',
        primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
        secondary: 'bg-gradient-to-r from-green-700/80 to-emerald-700/80 hover:from-green-600/80 hover:to-emerald-600/80',
        accent: 'text-green-400',
        icon: Shield
      },
      Navy: {
        background: 'bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900',
        pattern: 'bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-blue-800/90 to-blue-900/90 border-blue-600/30',
        primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
        secondary: 'bg-gradient-to-r from-blue-700/80 to-cyan-700/80 hover:from-blue-600/80 hover:to-cyan-600/80',
        accent: 'text-blue-400',
        icon: Target
      },
      Airforce: {
        background: 'bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900',
        pattern: 'bg-[radial-gradient(circle_at_50%_25%,rgba(125,211,252,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-slate-800/90 to-sky-900/90 border-sky-600/30',
        primary: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500',
        secondary: 'bg-gradient-to-r from-slate-700/80 to-sky-700/80 hover:from-slate-600/80 hover:to-sky-600/80',
        accent: 'text-sky-400',
        icon: Plane
      },
      Guns: {
        background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900',
        pattern: 'bg-[radial-gradient(circle_at_25%_75%,rgba(156,163,175,0.1)_0%,transparent_50%)]',
        card: 'bg-gradient-to-br from-gray-800/90 to-slate-900/90 border-gray-600/30',
        primary: 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500',
        secondary: 'bg-gradient-to-r from-gray-700/80 to-slate-700/80 hover:from-gray-600/80 hover:to-slate-600/80',
        accent: 'text-gray-400',
        icon: Zap
      }
    };
    return themes[mode];
  };

  const theme = getThemeClasses();
  const IconComponent = theme.icon;

  return (
    <div className={`min-h-screen ${theme.background} ${theme.pattern} text-white transition-all duration-500`}>
      {/* Header */}
      <div className="relative pt-12 pb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center mb-4">
            <IconComponent className={`w-12 h-12 ${theme.accent} mr-4`} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              YOLO-SAM Depth Analyzer
            </h1>
          </div>
          <p className="text-xl text-gray-300 font-light">Advanced Military Intelligence Processing System</p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10 pb-12">
        {!uploadingStarted && (
          <div className="max-w-2xl mx-auto">
            <div className={`${theme.card} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl`}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Mission Configuration</h2>
                <p className="text-gray-300">Select your operational mode and upload mission data</p>
              </div>

              {/* Mode Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-4">Operation Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Army', 'Navy', 'Airforce', 'Guns'].map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => setMode(modeOption)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        mode === modeOption
                          ? `${theme.primary} border-transparent shadow-lg scale-105`
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold">{modeOption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-4">Mission Video Data</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file-upload"
                  />
                  <div className={`${theme.secondary} backdrop-blur-sm rounded-xl p-8 border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer`}>
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
                      <p className="text-lg font-medium mb-2">
                        {file ? file.name : 'Drop your video file here'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {file ? 'File selected - ready for processing' : 'or click to browse'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file}
                className={`w-full ${theme.primary} disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-4 px-8 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                  file ? 'hover:enabled:scale-[1.02]' : ''
                }`}
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Initialize Processing
              </button>

              {/* Debug info */}
              {file && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {uploadingStarted && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Uploaded Video */}
            <div className={`${theme.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
              <div className="flex items-center mb-6">
                <Upload className={`w-6 h-6 ${theme.accent} mr-3`} />
                <h2 className="text-xl font-semibold">Source Material</h2>
              </div>
              <div className="aspect-video bg-black/30 rounded-xl overflow-hidden">
                <video
                  controls
                  src={uploadURL}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-300">Original mission footage uploaded successfully</p>
              </div>
            </div>

            {/* Processing Output */}
            <div className={`${theme.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}>
              <div className="flex items-center mb-6">
                <Target className={`w-6 h-6 ${theme.accent} mr-3`} />
                <h2 className="text-xl font-semibold">
                  {loading ? 'Processing Intelligence' : 'Analysis Complete'}
                </h2>
              </div>
              
              <div className="aspect-video bg-black/30 rounded-xl overflow-hidden flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className={`w-8 h-8 ${theme.accent}`} />
                      </div>
                    </div>
                    <p className="mt-4 text-gray-300">Analyzing tactical data...</p>
                  </div>
                ) : (
                  <img
                    src={videoURL}
                    alt="Processed Analysis"
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {!loading && videoURL && (
                <div className="mt-4">
                  <a
                    href={mp4Path}
                    download
                    className={`${theme.primary} rounded-lg py-3 px-6 font-medium transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Analysis
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Panel */}
        {fileId && !loading && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className={`${theme.card} backdrop-blur-xl rounded-3xl p-8 border shadow-2xl`}>
              <h3 className="text-2xl font-semibold text-center mb-8">Mission Reports & Assets</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <a
                  href={`http://localhost:8000/report/${fileId}`}
                  download
                  className={`${theme.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <FileText className={`w-8 h-8 ${theme.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Intelligence Report</h4>
                  <p className="text-sm text-gray-400">Comprehensive PDF analysis</p>
                </a>

                <a
                  href={`http://localhost:8000/imageszip/${fileId}`}
                  download
                  className={`${theme.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <Archive className={`w-8 h-8 ${theme.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Source Frames</h4>
                  <p className="text-sm text-gray-400">Original frame archive</p>
                </a>

                <a
                  href={`http://localhost:8000/segmentedzip/${fileId}`}
                  download
                  className={`${theme.secondary} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <Target className={`w-8 h-8 ${theme.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">Segmented Data</h4>
                  <p className="text-sm text-gray-400">Processed frame analysis</p>
                </a>

                <button
                  onClick={resetAll}
                  className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                >
                  <RotateCcw className={`w-8 h-8 text-red-200 mb-3 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold mb-2">New Mission</h4>
                  <p className="text-sm text-red-200">Reset and start over</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;