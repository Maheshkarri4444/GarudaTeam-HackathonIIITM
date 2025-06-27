import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('Army');
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mp4Path, setMp4Path] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    setLoading(true);
    const formData = new FormData();
    formData.append('mode', mode);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("the data is :",data)
      setVideoURL(`http://localhost:8000/download/${data.gif_path}`);
      setMp4Path(`http://localhost:8000/download/${data.mp4_path}`);
    } catch (err) {
      alert('Upload failed!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-2xl font-bold">YOLO-SAM Media Processor</h1>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="p-2 rounded bg-gray-800 border border-gray-600"
      >
        <option>Army</option>
        <option>Navy</option>
        <option>Airforce</option>
      </select>

      <input
        type="file"
        accept="video/*,image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 text-black bg-white rounded"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>

      {/* {videoURL && (
        <video
          controls
          className="mt-4 max-w-full rounded shadow-lg"
          src={videoURL}
        />
      )} */}
      {videoURL && (
  <div className="flex flex-col items-center">
    <img
      src={videoURL}
      alt="Processed output"
      className="mt-4 w-[400px] rounded shadow-lg"
    />
    {mp4Path && (
      <a
        href={mp4Path}
        download
        className="mt-4 inline-block px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Download Video
      </a>
        )}
      </div>
    )}
    </div>
  );
}

export default App;
