import React, { useState, useEffect } from 'react';
import './FocusOnDashboard.css';

const FocusOnDashboard = () => {
  const [allApps, setAllApps] = useState([]);
  const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0', '#00BCD4', '#FFC107'];
  
  //This is daily goal.
  const TARGET_MS = 6 * 60 * 60 * 1000; 

//getting todays date.
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //Converting raw data into hour and min.
  const processUsageData = (dataObj) => {
    const appsArray = Object.keys(dataObj).map((domain, index) => {
      const rawMs = dataObj[domain];
      const totalMinutes = Math.floor(rawMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      const percentage = Math.min((rawMs / TARGET_MS) * 100, 100);

      return {
        name: domain,
        time: timeString,
        rawMs: rawMs,
        percentage: percentage,
        color: COLORS[index % COLORS.length] 
      };
    });

    return appsArray.sort((a, b) => b.rawMs - a.rawMs);
  };

  useEffect(() => {
    const todayKey = getTodayDateString();
    const loadInitialData = async () => {
      if (window.chrome && chrome.storage) {
        const result = await chrome.storage.local.get([todayKey]);
        const todayData = result[todayKey] || {};
        setAllApps(processUsageData(todayData));
      }
    };

    loadInitialData();

    // Listening background changes.
    const handleStorageChange = (changes, namespace) => {
      if (namespace === 'local' && changes[todayKey]) {
        const newData = changes[todayKey].newValue || {};
        setAllApps(processUsageData(newData));
      }
    };

    if (window.chrome && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if (window.chrome && chrome.storage) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  console.log(allApps);

  const topApps = allApps.slice(0, 3);
  const remainingApps = allApps.slice(3);

  //calculating pie-chart data
  const totalMs = allApps.reduce((acc, app) => acc + app.rawMs, 0);
  const totalPercentage = Math.min((totalMs / TARGET_MS) * 100, 100);
  const totalTotalMinutes = Math.floor(totalMs / (1000 * 60));
  const displayHours = Math.floor(totalTotalMinutes / 60);
  const displayMins = totalTotalMinutes % 60;

  return (
    <div className="dashboard-panel">
      <header className="panel-header">
        <h2>Dashboard Overview</h2>
        <button className="settings-btn">⚙️</button>
      </header>
      <div className="top-widgets">

        <section className="widget-card overview-widget">
          <div className="focus-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="circle" 
                strokeDasharray={`${totalPercentage}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="ring-content">
              <span className="ring-label">USAGE TODAY</span>
              <h1 className="ring-time">{displayHours}h {displayMins}m</h1>
              <span className="ring-target">Target: 6h 00m</span>
            </div>
          </div>
        </section> 

        <section className="widget-card top-apps-widget">
          <h3 className="widget-title">Top Used Apps</h3>
          <div className="mini-app-list">
            {topApps.length > 0 ? (
              topApps.map((app, index) => (
                <div className="mini-app-row" key={index}>
                  <div className="mini-app-info">
                    <span className="mini-app-name">{app.name}</span>
                    <span className="mini-app-time">{app.time}</span>
                  </div>
                  <div className="mini-progress-bg">
                    <div 
                      className="mini-progress-fill" 
                      style={{ width: `${app.percentage}%`, backgroundColor: app.color }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-apps-text">Start browsing to see data!</p>
            )}
          </div>
        </section>

      </div>

      <section className="app-list-section">
        <h3 className="section-title">OTHER APPLICATIONS</h3>
        <div className="app-list">
          {remainingApps.length > 0 ? (
            remainingApps.map((app, index) => (
              <div className="app-row" key={index}>
                <span className="app-name">{app.name}</span>
                <div className="progress-container">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${app.percentage}%`, backgroundColor: app.color }}
                    ></div>
                  </div>
                </div>
                <span className="app-time">{app.time}</span>
              </div>
            ))
          ) : (
            <p className="no-apps-text">No other apps tracked today.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FocusOnDashboard;