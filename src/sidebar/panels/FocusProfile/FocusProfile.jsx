import React, { useMemo } from 'react';
import './FocusSession.css';

const FocusProfile = () => {
  // Mock data: Simulating sessions with actual dates and time spent
  // Using today's context (March 20, 2026) for realistic recent data
  const sessionHistory = [
    { id: 1, date: '2026-03-20', minutes: 45 },
    { id: 2, date: '2026-03-20', minutes: 30 }, // Multiple sessions on same day
    { id: 3, date: '2026-03-19', minutes: 120 },
    { id: 4, date: '2026-03-17', minutes: 60 },
    { id: 5, date: '2026-03-15', minutes: 15 },
    { id: 6, date: '2026-03-01', minutes: 200 },
  ];

  // 1. Group data by date to get total minutes per day
  const dailyTotals = useMemo(() => {
    return sessionHistory.reduce((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = 0;
      }
      acc[session.date] += session.minutes;
      return acc;
    }, {});
  }, [sessionHistory]);

  // 2. Generate the heatmap grid data (Last 364 days = 52 weeks)
  const heatmapSquares = useMemo(() => {
    const squares = [];
    const today = new Date('2026-03-20'); // Hardcoded for this example
    
    // Loop backwards to generate the last 364 days
    for (let i = 363; i >= 0; i--) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      
      // Format to YYYY-MM-DD to match our mock data
      const dateString = pastDate.toISOString().split('T')[0];
      const minutesSpent = dailyTotals[dateString] || 0;

      // Determine the "level" of green based on time spent
      let level = 0;
      if (minutesSpent > 0 && minutesSpent <= 30) level = 1;
      else if (minutesSpent > 30 && minutesSpent <= 60) level = 2;
      else if (minutesSpent > 60 && minutesSpent <= 120) level = 3;
      else if (minutesSpent > 120) level = 4; // Highest intensity

      squares.push(
        <div 
          key={dateString} 
          className={`square level-${level}`}
          title={`${dateString}: ${minutesSpent} mins`} // Tooltip on hover
        ></div>
      );
    }
    return squares;
  }, [dailyTotals]);

  return (
    <div className="leetcode-theme-container">
      {/* Top Section: Activity Heatmap */}
      <div className="activity-panel">
        <div className="activity-header">
          <div className="header-left">
            <span className="total-submissions">{sessionHistory.length}</span>
            <span className="header-text">sessions in the past one year</span>
          </div>
        </div>
        
        <div className="heatmap-container">
          <div className="heatmap-grid">
            {heatmapSquares}
          </div>
        </div>
      </div>

      {/* Bottom Section: The List */}
      <div className="list-panel">
        <div className="tabs-container">
          <button className="tab active-tab">Recent Sessions</button>
        </div>

        <div className="session-list">
          {sessionHistory.map((session) => (
            <div key={session.id} className="session-item">
              <span className="session-date">{session.date}</span>
              <span className="session-time">
                <span className="time-badge">{session.minutes} mins</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusProfile;