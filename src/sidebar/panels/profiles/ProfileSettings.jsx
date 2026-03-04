import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styles from './Profiles.module.css';

const ProfileSettings = () => {
  const [profileName, setProfileName] = useState("Guest");
  const [username, setUsername] = useState("Guest");
  const [profileIcon, setProfileIcon] = useState('🐱');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempIcon, setTempIcon] = useState('');
  const availableIcons = ['🐱', '🐶', '🐹', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁'];

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['extenUserName'], (result) => {
        if (result.extenUserName) {
          setProfileName(result.extenUserName);
        }
      });
    }
  }, []);

  const openEditModal = () => {
    setTempName(profileName);
    setTempIcon(profileIcon);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setProfileName(tempName);
    setProfileIcon(tempIcon);
    setIsEditing(false);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ "extenUserName": tempName }, () => {
        console.log("Name successfully saved to Chrome Storage!");
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
      <div className={styles.header}>
        <h2>Profiles</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.avatarLarge}>{profileIcon}</div>
          
          <div className={styles.userInfo}>
            <h3>{profileName}</h3>
            <span className={styles.syncStatus}>✓ Sync is on</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.iconButton} onClick={openEditModal} title="Edit">✏️</button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit profile</h3>
              <button className={styles.closeBtn} onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <input 
              type="text" 
              className={styles.nameInput} 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)} 
            />

            <div className={styles.iconGrid}>
              {availableIcons.map((icon, index) => (
                <button 
                  key={index} 
                  className={`${styles.iconOption} ${tempIcon === icon ? styles.selectedIcon : ''}`}
                  onClick={() => setTempIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
              <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProfileSettings;