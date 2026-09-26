import React, { useState, useRef } from 'react';
import { Play, Search, Upload, Package, Keyboard } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS, SOUND_PACKS } from '../../config/pianoConfig';
import { audioManager } from '../../audio/audioManager';

export default function SoundLibrary({ keysConfig, onUpdateKeyConfig, onTriggerKey, onLoadPack, addToast }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPacks, setShowPacks] = useState(false);
  const [learnShortcutId, setLearnShortcutId] = useState(null);
  const fileInputRef = useRef(null);
  const [dragOverKeyId, setDragOverKeyId] = useState(null);

  const filteredKeys = keysConfig.filter(key => {
    const matchesCategory = selectedCategory === 'All' || key.category === selectedCategory;
    const matchesSearch = key.soundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          key.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          key.shortcut.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNameChange = (id, newName) => {
    onUpdateKeyConfig(id, { soundName: newName });
  };

  const handleShortcutChange = (id, newShortcut) => {
    if (newShortcut.length <= 1) {
      onUpdateKeyConfig(id, { shortcut: newShortcut.toLowerCase() });
    }
  };

  // Drag and drop handler
  const handleDrop = async (e, keyId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverKeyId(null);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('audio/')) {
      addToast?.({
        id: Date.now(),
        type: 'warning',
        title: 'Invalid file',
        message: 'Please drop an audio file (.mp3, .wav, .ogg)'
      });
      return;
    }

    const url = await audioManager.loadFromFile(file);
    if (url) {
      onUpdateKeyConfig(keyId, { audio: url, soundName: file.name.replace(/\.\w+$/, '') });
      addToast?.({
        id: Date.now(),
        type: 'info',
        title: 'Sound loaded!',
        message: `"${file.name}" assigned to key`
      });
    }
  };

  // File input handler
  const handleFileUpload = async (e, keyId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await audioManager.loadFromFile(file);
    if (url) {
      onUpdateKeyConfig(keyId, { audio: url, soundName: file.name.replace(/\.\w+$/, '') });
      addToast?.({
        id: Date.now(),
        type: 'info',
        title: 'Sound loaded!',
        message: `"${file.name}" assigned to key`
      });
    }
  };

  // Learn shortcut mode
  const startLearnShortcut = (keyId) => {
    setLearnShortcutId(keyId);
    const handler = (e) => {
      e.preventDefault();
      if (e.key.length === 1) {
        onUpdateKeyConfig(keyId, { shortcut: e.key.toLowerCase() });
        setLearnShortcutId(null);
        window.removeEventListener('keydown', handler);
      } else if (e.key === 'Escape') {
        setLearnShortcutId(null);
        window.removeEventListener('keydown', handler);
      }
    };
    window.addEventListener('keydown', handler);
  };

  return (
    <div className="sound-library glass-panel">
      <div className="library-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sound Library & Key Mapping</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Customize meme sounds, drag & drop audio files, and set keyboard shortcuts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Sound Packs */}
          <button
            className={`btn btn-sm ${showPacks ? 'btn-active' : ''}`}
            onClick={() => setShowPacks(!showPacks)}
          >
            <Package size={14} />
            <span>Sound Packs</span>
          </button>

          {/* Search */}
          <div style={{ position: 'relative', width: 200 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="Search sounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="editable-input"
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>
      </div>

      {/* Sound Packs Section */}
      {showPacks && (
        <div className="sound-packs-grid">
          {Object.entries(SOUND_PACKS).map(([packId, pack]) => (
            <button
              key={packId}
              className="sound-pack-card glass-panel-sm"
              onClick={() => {
                onLoadPack?.(packId);
                addToast?.({
                  id: Date.now(),
                  type: 'info',
                  title: 'Sound Pack Loaded',
                  message: `Switched to ${pack.name}`
                });
              }}
            >
              <div className="pack-name">{pack.name}</div>
              <div className="pack-desc">{pack.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => {
          const color = CATEGORY_COLORS[cat]?.primary;
          return (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={selectedCategory === cat && color ? {
                background: `${color}25`,
                borderColor: `${color}60`,
                color: color
              } : {}}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sound Table */}
      <div className="table-container">
        <table className="sound-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>Test</th>
              <th style={{ width: 70 }}>Note</th>
              <th style={{ width: 90 }}>Shortcut</th>
              <th>Sound Name</th>
              <th>Audio File</th>
              <th style={{ width: 60 }}>Upload</th>
              <th style={{ width: 80 }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key) => {
              const catColor = CATEGORY_COLORS[key.category] || CATEGORY_COLORS.Meme;
              return (
                <tr
                  key={key.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOverKeyId(key.id); }}
                  onDragLeave={() => setDragOverKeyId(null)}
                  onDrop={(e) => handleDrop(e, key.id)}
                  className={dragOverKeyId === key.id ? 'drag-over' : ''}
                >
                  <td>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => onTriggerKey(key)}
                      title={`Test play ${key.soundName}`}
                    >
                      <Play size={12} fill="#ffffff" />
                    </button>
                  </td>
                  <td>
                    <span className="tag" style={{ fontWeight: 800, background: `${catColor.primary}20`, color: catColor.primary, border: `1px solid ${catColor.primary}30` }}>
                      {key.emoji} {key.id}
                    </span>
                  </td>
                  <td>
                    {learnShortcutId === key.id ? (
                      <span className="learn-shortcut-badge">Press a key...</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          maxLength={1}
                          value={key.shortcut}
                          onChange={(e) => handleShortcutChange(key.id, e.target.value)}
                          className="editable-input"
                          style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
                        />
                        <button
                          className="btn btn-xs btn-icon"
                          onClick={() => startLearnShortcut(key.id)}
                          title="Learn shortcut: press any key"
                          style={{ padding: '0.2rem' }}
                        >
                          <Keyboard size={11} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={key.soundName}
                      onChange={(e) => handleNameChange(key.id, e.target.value)}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <div className="audio-path-cell">
                      <span className="audio-path-text" title={key.audio}>
                        {key.audio ? key.audio.split('/').pop() : '(synthesized)'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-icon"
                      onClick={() => {
                        fileInputRef.current?.setAttribute('data-key-id', key.id);
                        fileInputRef.current?.click();
                      }}
                      title="Upload audio file"
                    >
                      <Upload size={13} />
                    </button>
                  </td>
                  <td>
                    <span className="tag" style={{ background: `${catColor.primary}20`, color: catColor.primary }}>
                      {key.category || 'Meme'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hidden file input for audio upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const keyId = fileInputRef.current?.getAttribute('data-key-id');
          if (keyId) handleFileUpload(e, keyId);
        }}
      />

      <div className="library-footer">
        <span className="drag-hint">💡 Tip: Drag & drop audio files (.mp3, .wav) directly onto any row to assign them!</span>
      </div>
    </div>
  );
}
