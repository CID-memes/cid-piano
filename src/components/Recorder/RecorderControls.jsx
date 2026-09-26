import React, { useState, useRef } from 'react';
import { Circle, Square, Play, Trash2, Clock, Download, Share2, Upload, Music } from 'lucide-react';
import { audioManager } from '../../audio/audioManager';

export default function RecorderControls({
  recordedNotes, isRecording, onToggleRecord,
  onPlayRecording, onClearRecording,
  onExportSequence, onImportSequence,
  addToast
}) {
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareInput, setShowShareInput] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const importInputRef = useRef(null);

  const toggleRecord = () => {
    onToggleRecord(!isRecording);
  };

  const handlePlay = async () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    await onPlayRecording();
    setIsPlayingBack(false);
  };

  // Export as audio file
  const handleExportAudio = async () => {
    if (recordedNotes.length === 0) return;
    setIsExporting(true);

    const started = audioManager.startExportRecording();
    if (!started) {
      addToast?.({
        id: Date.now(),
        type: 'warning',
        title: 'Export not supported',
        message: 'Your browser does not support audio export.'
      });
      setIsExporting(false);
      return;
    }

    // Play back the recording
    await onPlayRecording();

    // Wait a bit for trailing audio (reverb, delay)
    await new Promise(r => setTimeout(r, 1000));

    const blob = await audioManager.stopExportRecording();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme-piano-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      addToast?.({
        id: Date.now(),
        type: 'info',
        title: 'Audio exported!',
        message: 'Your recording has been downloaded.'
      });
    }
    setIsExporting(false);
  };

  // Share sequence as JSON code
  const handleShare = () => {
    if (!onExportSequence) return;
    const code = onExportSequence();
    navigator.clipboard?.writeText(code).then(() => {
      addToast?.({
        id: Date.now(),
        type: 'info',
        title: 'Copied to clipboard!',
        message: 'Share this code with friends to import your sequence.'
      });
    }).catch(() => {
      setShareCode(code);
      setShowShareInput(true);
    });
  };

  // Import sequence from JSON code
  const handleImport = () => {
    if (!shareCode.trim()) return;
    const result = onImportSequence?.(shareCode.trim());
    if (result?.success) {
      setShowShareInput(false);
      setShareCode('');
      addToast?.({
        id: Date.now(),
        type: 'info',
        title: 'Sequence imported!',
        message: `Loaded "${result.name}" with ${result.count} notes.`
      });
    } else {
      addToast?.({
        id: Date.now(),
        type: 'error',
        title: 'Import failed',
        message: result?.error || 'Invalid sequence code.'
      });
    }
  };

  return (
    <div className="glass-panel recorder-panel">
      <div className="recorder-header">
        <div>
          <h3 className="recorder-title">
            <Clock size={18} color="var(--accent-primary)" />
            Performance Recorder
            {isRecording && <span className="recording-dot" />}
          </h3>
          <p className="recorder-desc">
            Record key sequences, export audio, and share with friends
          </p>
        </div>

        <div className="recorder-actions">
          <button
            className={`btn ${isRecording ? 'btn-recording' : ''}`}
            onClick={toggleRecord}
          >
            {isRecording ? (
              <>
                <Square size={14} fill="#ef4444" color="#ef4444" />
                <span>Stop ({recordedNotes.length})</span>
              </>
            ) : (
              <>
                <Circle size={14} fill="#ef4444" color="#ef4444" />
                <span>Record</span>
              </>
            )}
          </button>

          <button
            className="btn btn-primary"
            onClick={handlePlay}
            disabled={recordedNotes.length === 0 || isPlayingBack || isExporting}
            style={{ opacity: recordedNotes.length === 0 || isPlayingBack ? 0.5 : 1 }}
          >
            <Play size={14} fill="#ffffff" />
            <span>{isPlayingBack ? 'Playing...' : 'Play'}</span>
          </button>

          <button
            className="btn"
            onClick={handleExportAudio}
            disabled={recordedNotes.length === 0 || isExporting}
            style={{ opacity: recordedNotes.length === 0 ? 0.5 : 1 }}
            title="Export as audio file"
          >
            <Download size={14} />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>

          <button
            className="btn"
            onClick={handleShare}
            disabled={recordedNotes.length === 0}
            style={{ opacity: recordedNotes.length === 0 ? 0.5 : 1 }}
            title="Share sequence code"
          >
            <Share2 size={14} />
          </button>

          <button
            className="btn"
            onClick={() => setShowShareInput(!showShareInput)}
            title="Import sequence from code"
          >
            <Upload size={14} />
          </button>

          <button
            className="btn"
            onClick={onClearRecording}
            disabled={recordedNotes.length === 0}
            style={{ opacity: recordedNotes.length === 0 ? 0.5 : 1 }}
            title="Clear Recording"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Share/Import Input */}
      {showShareInput && (
        <div className="share-input-row">
          <input
            ref={importInputRef}
            type="text"
            placeholder="Paste a sequence code to import..."
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value)}
            className="editable-input"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleImport}>
            Import
          </button>
        </div>
      )}

      {/* Recorded Sequence Timeline Chips */}
      <div className="recorded-timeline">
        {recordedNotes.length === 0 ? (
          <span className="timeline-empty">
            <Music size={14} />
            No sequence recorded yet. Click Record and start jamming!
          </span>
        ) : (
          recordedNotes.map((item, idx) => (
            <div key={idx} className="timeline-chip">
              <span>{item.keyConfig.emoji || '🎵'}</span>
              <span className="chip-name">{item.keyConfig.soundName}</span>
              <span className="chip-time">({(item.time / 1000).toFixed(1)}s)</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
