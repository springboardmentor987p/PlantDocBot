import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const apiBase = 'http://127.0.0.1:8000' // using Vite proxy to avoid CORS; calls go to /api/*
  const [textValue, setTextValue] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [isTextLoading, setIsTextLoading] = useState(false)

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(imageFile)
    setImagePreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  function handleTextChange(event) {
    setTextValue(event.target.value)
  }

  function validateAndSetImage(file) {
    if (!file) return
    setErrorMessage('')
    const isImage = file.type.startsWith('image/')
    const maxBytes = 5 * 1024 * 1024
    if (!isImage) {
      setErrorMessage('Please select a valid image file.')
      return
    }
    if (file.size > maxBytes) {
      setErrorMessage('Image exceeds 5 MB size limit.')
      return
    }
    setImageFile(file)
  }

  function handleImageChange(event) {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0) {
      setImageFile(null)
      return
    }
    validateAndSetImage(fileList[0])
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    const file = event.dataTransfer?.files?.[0]
    if (!file) return
    validateAndSetImage(file)
  }

  function clearImage() {
    setImageFile(null)
    setPrediction(null)
  }

  function clearText() {
    setTextValue('')
    setCopied(false)
    if (prediction?.source === 'text') {
      setPrediction(null)
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(textValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setErrorMessage('Unable to copy to clipboard.')
    }
  }

  async function predictImage(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${apiBase}/predict_image`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) throw new Error(`Image prediction failed (${res.status})`)
    const json = await res.json()
    console.log('predict_image raw json:', json)
    return json
  }

  async function predictText(text) {
    const res = await fetch(`${apiBase}/predict_text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error(`Text prediction failed (${res.status})`)
    return res.json()
  }

  async function predictDisease() {
    if (!imageFile) {
      setErrorMessage('Please select an image first.')
      return
    }
    setErrorMessage('')
    setIsLoading(true)
    setPrediction(null)
    try {
      if (!apiBase) {
        // Mock prediction if no API is configured
        await new Promise((r) => setTimeout(r, 1200))
        const mockDiseases = [
          { name: 'Early Blight', severity: 'medium', advice: ['Remove affected leaves', 'Apply fungicide', 'Avoid overhead watering'] },
          { name: 'Late Blight', severity: 'high', advice: ['Isolate plant immediately', 'Use copper-based fungicide', 'Disinfect tools'] },
          { name: 'Leaf Spot', severity: 'low', advice: ['Improve air circulation', 'Reduce leaf wetness', 'Use neem oil spray'] },
          { name: 'Healthy', severity: 'none', advice: ['Maintain good hygiene', 'Balanced fertilization', 'Regular monitoring'] },
        ]
        const picked = mockDiseases[Math.floor(Math.random() * mockDiseases.length)]
        const confidence = picked.name === 'Healthy' ? 0.92 : 0.78 + Math.random() * 0.18
        setPrediction({ disease: picked.name, confidence, severity: picked.severity, suggestions: picked.advice, source: 'image' })
      } else {
        const data = await predictImage(imageFile)
        console.log('predict_image response:', data)
        if (!data || typeof data.predicted_class === 'undefined') {
          setErrorMessage('Prediction succeeded but response was not in expected format.')
        } else {
          const suggestions = Array.isArray(data.recommendations)
            ? data.recommendations
            : (Array.isArray(data.suggestions) ? data.suggestions : undefined)
          const recommendation = typeof data.recommendation === 'string' && data.recommendation
            ? data.recommendation
            : undefined
          const confidence = (typeof data.confidence_percent === 'number')
            ? data.confidence_percent / 100
            : (typeof data.confidence === 'number'
                ? (data.confidence > 1 ? data.confidence / 100 : data.confidence)
                : undefined)
          setPrediction({
            disease: String(data.predicted_class),
            confidence,
            severity: data.severity,
            suggestions,
            recommendation,
            source: 'image',
          })
        }
      }
    } catch (err) {
      setErrorMessage(err?.message || 'An unexpected error occurred during prediction.')
    } finally {
      setIsLoading(false)
    }
  }

  async function predictDiseaseFromText() {
    if (!textValue.trim()) {
      setErrorMessage('Please enter a description of the plant/leaf symptoms.')
      return
    }
    setErrorMessage('')
    setIsTextLoading(true)
    setPrediction(null)
    try {
      if (!apiBase) {
        await new Promise((r) => setTimeout(r, 900))
        const mock = {
          disease: 'Powdery Mildew',
          severity: 'medium',
          confidence: 0.81,
          suggestions: ['Increase airflow', 'Avoid leaf wetness at night', 'Use sulfur-based spray'],
        }
        setPrediction({ ...mock, source: 'text' })
      } else {
        const data = await predictText(textValue)
        // FastAPI returns { predicted_class, confidence_percent }
        const suggestions = Array.isArray(data.recommendations)
          ? data.recommendations
          : (Array.isArray(data.suggestions) ? data.suggestions : undefined)
        const recommendation = typeof data.recommendation === 'string' && data.recommendation
          ? data.recommendation
          : undefined
        const confidence = (typeof data.confidence_percent === 'number')
          ? data.confidence_percent / 100
          : (typeof data.confidence === 'number'
              ? (data.confidence > 1 ? data.confidence / 100 : data.confidence)
              : undefined)
        setPrediction({
          disease: String(data.predicted_class),
          confidence,
          severity: data.severity,
          suggestions,
          recommendation,
          source: 'text',
        })
      }
    } catch (err) {
      setErrorMessage(err?.message || 'An unexpected error occurred during text prediction.')
    } finally {
      setIsTextLoading(false)
    }
  }

  return (
    <>
      <header className="appHeader">
        <h1>Plant Disease Detection</h1>
        <p>Upload a plant leaf image to analyze potential diseases.</p>
      </header>

      {errorMessage && (
        <div role="alert" className="alert">
          {errorMessage}
        </div>
      )}

      <div className="cardGrid">
        <section className="card">
          <h2 className="cardTitle">String Input</h2>
          <div className="fieldGroup">
            <label htmlFor="textInput" className="label">Your text</label>
            <input
              id="textInput"
              className="textInput"
              type="text"
              placeholder="Type something..."
              value={textValue}
              onChange={handleTextChange}
              aria-label="String input"
            />
          </div>
          <div className="actions">
            <button className="btn" onClick={copyText} disabled={!textValue}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="btn secondary" onClick={clearText} disabled={!textValue}>Clear</button>
            <button className="btn" onClick={predictDiseaseFromText} disabled={!textValue || isTextLoading}>
              {isTextLoading ? 'Analyzing…' : 'Predict from Text'}
            </button>
          </div>
          <div className="preview">
            <span>Current value:</span>
            <strong className="mono">{textValue || '—'}</strong>
          </div>
        </section>

        <section className="card">
          <h2 className="cardTitle">Image Input</h2>
          <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Drag & drop an image here</p>
            <p className="muted">or</p>
            <label className="btn" role="button">
              Browse
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                aria-label="Image input"
                hidden
              />
            </label>
            <p className="hint">PNG, JPG, GIF — up to 5 MB</p>
          </div>

          {imagePreviewUrl && (
            <div className="imagePreview" style={{animation: 'fadeIn 400ms ease both'}}>
              <img src={imagePreviewUrl} alt="Selected preview" />
              <div className="actions">
                <button className="btn secondary" onClick={clearImage}>Remove image</button>
                <a className="btn" href={imagePreviewUrl} download={imageFile?.name || 'image'}>Download</a>
                <button className="btn" onClick={predictDisease} disabled={isLoading}> {isLoading ? 'Analyzing…' : 'Predict'} </button>
              </div>
              {isLoading && (
                <div className="loader" aria-label="Analyzing image" />
              )}
            </div>
          )}
        </section>

        <section className="card resultsCard">
          <h2 className="cardTitle">Results</h2>
          {!prediction && <p className="muted">Prediction results will appear here.</p>}
          {prediction && (
            <div className="results" style={{animation: 'fadeIn 400ms ease both'}}>
              <div className="resultHeader">
                {prediction.severity && (
                  <span className={`badge ${prediction.severity}`}>{prediction.severity}</span>
                )}
                <h3 className="resultTitle">{prediction.disease}</h3>
                {prediction.source && (
                  <span className="sourceTag">{prediction.source}</span>
                )}
              </div>
              <div className="meta">
                <p><strong>Predicted class:</strong> {prediction.disease}</p>
              </div>
              {typeof prediction.confidence === 'number' && (
                <div className="confidence">
                  <div className="confidenceBar">
                    <div className="confidenceFill" style={{width: `${Math.min(100, Math.max(0, Math.round(prediction.confidence * 100)))}%`}} />
                  </div>
                  <span className="mono">{Math.round(prediction.confidence * 100)}%</span>
                </div>
              )}
              {prediction.recommendation && (
                <p className="recommendation"><strong>Recommendation:</strong> {prediction.recommendation}</p>
              )}
              {prediction.suggestions?.length > 0 && (
                <ul className="suggestions">
                  {prediction.suggestions.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default App
