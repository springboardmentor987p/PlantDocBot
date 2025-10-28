import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiSearch } from 'react-icons/fi';
import axios from 'axios';


const API_IMAGE = "http://127.0.0.1:8000/image-prediction/";
const API_TEXT = "http://127.0.0.1:8000/text-prediction/";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const resultVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }
};


const ResultCard = ({ prediction }) => {
  
  const confidencePercent = (prediction.confidence * 100).toFixed(2);

  return (
    <motion.div variants={resultVariants} initial="hidden" animate="visible" exit="exit" className="result-card">
      <h3>{prediction.predicted_class}</h3>
      <p className="confidence-score">Confidence: {confidencePercent}%</p>
      <p>Recommendation :</p>
      <p>{prediction.recommendation}</p>
    </motion.div>
  );
};

const Loader = () => (
    <motion.div className="loader"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
);

const ImageClassifier = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPrediction(null);
      setError('');
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(API_IMAGE, formData);
      setPrediction(res.data);
    } catch (err) {
      setError('Prediction failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="classifier-container" variants={cardVariants}>
      <h2 className="card-title">Image Analysis</h2>
      <label htmlFor="image-upload" className="file-drop-zone">
        <FiUpload size={32} />
        <p>{file ? file.name : 'Upload Image'}</p>
      </label>
      <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <motion.img className="preview-image" src={preview} alt="Preview" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} />}
      <motion.button className="predict-button" onClick={handlePredict} disabled={loading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {loading ? <Loader /> : 'Identify Disease'}
      </motion.button>
      <AnimatePresence>
        {error && <motion.p className="error-text" variants={resultVariants} initial="hidden" animate="visible" exit="exit">{error}</motion.p>}
        {prediction && <ResultCard prediction={prediction} />}
      </AnimatePresence>
    </motion.div>
  );
};

const TextClassifier = () => {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!text.trim()) {
      setError('Please describe the symptoms.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(API_TEXT, { text });
      setPrediction(res.data);
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="classifier-container" variants={cardVariants}>
      <h2 className="card-title">Symptom Analysis</h2>
      <textarea
        placeholder="e.g., The leaves show brown, circular spots and are starting to wilt..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <motion.button className="predict-button" onClick={handlePredict} disabled={loading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {loading ? <Loader /> : 'Analyze Symptoms'}
      </motion.button>
      <AnimatePresence>
        {error && <motion.p className="error-text" variants={resultVariants} initial="hidden" animate="visible" exit="exit">{error}</motion.p>}
        {prediction && <ResultCard prediction={prediction} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="app-bg">
      <motion.div className="app-container" initial="hidden" animate="visible">
        <h1 className="main-title">AI Plant Health Assistant</h1>
        <div className="classifiers-wrapper">
          <ImageClassifier />
          <TextClassifier />
        </div>
      </motion.div>
    </div>
  );
}
