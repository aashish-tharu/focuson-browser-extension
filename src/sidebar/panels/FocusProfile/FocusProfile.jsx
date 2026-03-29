import React, { useState, useEffect } from 'react';
import './FocusHistoryList.css';

const FocusHistoryList = () => {
  const [sessionData, setSessionData] = useState([]);
  const STORAGE_KEY = 'focus_history';

  useEffect(() => {
    if (typeof window.chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const rawData = result[STORAGE_KEY] || [];
        const sortedData = rawData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSessionData(sortedData);
      });
    }
  }, []);

  const todayDate = new Date().toISOString().split('T')[0];
  const todayEntry = sessionData.find(entry => entry.date === todayDate);
  const todaySeconds = todayEntry ? todayEntry.totalTime : 0;

  let weeklySeconds = 0;
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  sessionData.forEach(entry => {
    if (new Date(entry.date) >= startOfWeek) {
      weeklySeconds += entry.totalTime;
    }
  });

  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "0s";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="desktop-focus-container">
      <h1 className="dashboard-title">Focus Profile</h1>
      
      {/* Top Stats Layout - Side by Side Grid */}
      <div className="stats-grid">
        <div className="desktop-stat-card">
          <span className="stat-title">Today's Focus</span>
          <h2 className="stat-number highlight">{formatTime(todaySeconds)}</h2>
        </div>
        <div className="desktop-stat-card">
          <span className="stat-title">This Week</span>
          <h2 className="stat-number">{formatTime(weeklySeconds)}</h2>
        </div>
      </div>

      {/* Bottom List Layout - Expansive width */}
      <div className="list-section">
        <h3 className="list-header">Recent Sessions</h3>
        
        {sessionData.length > 0 ? (
          <ul className="desktop-session-list">
            {sessionData.map((session, index) => (
              <li key={index} className="desktop-session-item">
                <span className="item-date">{session.date}</span>
                <span className="item-time">{formatTime(session.totalTime)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-message">No focus sessions recorded yet. Start working to build your history!</div>
        )}
      </div>
    </div>
  );
};

export default FocusHistoryList;