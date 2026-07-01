import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    } else {
      setError("Mohon upload file gambar yang valid.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError(null);
    } else {
      setError("Mohon upload file gambar yang valid.");
    }
  };

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal melakukan prediksi dari server.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatLabel = (label) => {
    if (!label) return "";
    const parts = label.split('_');
    if (parts.length === 2) {
      const script = parts[0].replace('Aksara ', '');
      const char = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      return `${script} - ${char}`;
    }
    return label;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Klasifikasi Aksara Nusantara</h1>
        <p>Kenali Aksara Jawa, Bali, dan Sunda menggunakan EfficientNet</p>
      </header>

      <main className="main-content">
        <div className="upload-section">
          {!preview ? (
            <div 
              className="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} className="icon-primary" />
              <h3>Upload atau Drag & Drop Gambar Aksara</h3>
              <p>Format yang didukung: JPG, PNG, JPEG</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <button className="btn-browse">Pilih Gambar</button>
            </div>
          ) : (
            <div className="preview-container">
              <div className="image-wrapper">
                <img src={preview} alt="Preview" className="image-preview" />
              </div>
              <div className="actions">
                <button onClick={handleClear} className="btn-secondary">Ganti Gambar</button>
                <button onClick={handlePredict} disabled={loading} className="btn-primary">
                  {loading ? (
                    <><Loader2 size={18} className="spinner" /> Memproses...</>
                  ) : (
                    <>Deteksi Aksara</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-card">
              <ImageIcon size={32} className="icon-success" />
              <div className="result-info">
                <h4>Hasil Prediksi</h4>
                <div className="prediction-details">
                  <span className="label-title">Aksara Terdeteksi:</span>
                  <span className="label-value">{formatLabel(result.prediction)}</span>
                </div>
                <div className="prediction-details">
                  <span className="label-title">Tingkat Keyakinan:</span>
                  <span className="label-confidence">{result.confidence}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Aksara Nusantara Classifier © 2026</p>
      </footer>
    </div>
  );
}

export default App;
