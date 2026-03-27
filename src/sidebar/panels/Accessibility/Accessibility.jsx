import { useState, useEffect } from 'react';

function Accessibility() {
    const socialMedia = ["facebook.com", "youtube.com"];
    const [isSocialBlocked, setIsSocialBlocked] = useState(false);

    const toggleSocialMedia = (e) => {
        setIsSocialBlocked(e.target.checked);
    };

    const [workspaces, setWorkspaces] = useState([]);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");

    useEffect(()=>{
        if (typeof chrome != "undefined" && chrome.storage) {
            chrome.storage.local.get(["isSocialBlocked", "workspaces"], (result)=>{
                if (result.isSocialBlocked !== undefined) setIsSocialBlocked(result.isSocialBlocked);
                if (result.workspaces !== undefined) setWorkspaces(result.workspaces);
            })
        }
    },[]);

    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.set({ isSocialBlocked });
        }
    }, [isSocialBlocked]);

    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.set({ workspaces });
        }
    }, [workspaces]);

    const [siteInputs, setSiteInputs] = useState({});

    const handleAddWorkspace = (e) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        
        const newWorkspace = {
            id: Date.now(),
            name: newWorkspaceName,
            sites: [],
            isActive: false
        };
        
        setWorkspaces((prev) => [...prev, newWorkspace]);
        setNewWorkspaceName("");
    };

    const handleSiteInputChange = (workspaceId, value) => {
        setSiteInputs((prev) => ({ ...prev, [workspaceId]: value }));
    };

    const handleAddSite = (workspaceId, e) => {
        e.preventDefault();
        const siteName = siteInputs[workspaceId];
        if (!siteName || !siteName.trim()) return;

        setWorkspaces((prev) => 
            prev.map((ws) => 
                ws.id === workspaceId 
                    ? { ...ws, sites: [...ws.sites, siteName] } 
                    : ws
            )
        );
        
        setSiteInputs((prev) => ({ ...prev, [workspaceId]: "" }));
    };

    const toggleWorkspace = (workspaceId, checked) => {
        setWorkspaces((prev) =>
            prev.map((ws) =>
                ws.id === workspaceId ? { ...ws, isActive: checked } : ws
            )
        );
    };

    const handleDeleteWorkspace = (workspaceId) => {
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
        setSiteInputs((prev) => {
            const newInputs = { ...prev };
            delete newInputs[workspaceId];
            return newInputs;
        });
    };

    const handleDeleteSite = (workspaceId, siteIndex) => {
        setWorkspaces((prev) => 
            prev.map((ws) => {
                if (ws.id === workspaceId) {
                    return { ...ws, sites: ws.sites.filter((_, index) => index !== siteIndex) };
                }
                return ws;
            })
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', fontFamily: 'sans-serif' }}>
            
            <div className="block-sites" style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
                <h2>Global Social Media Block</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={isSocialBlocked}
                        onChange={toggleSocialMedia}
                    />
                    Block Social Media (Facebook, YouTube)
                </label>

                {isSocialBlocked && (
                    <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                        Active: Social media sites are currently blocked.
                    </p>
                )}
            </div>

            <div className="workspaces">
                <h2>Custom Workspaces</h2>

                <form onSubmit={handleAddWorkspace} style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        value={newWorkspaceName} 
                        placeholder="E.g., Deep Work, Coding, Study..." 
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <button type="submit">Create Workspace</button>
                </form>

                <div className="workspaces-list">
                    {workspaces.map((ws) => (
                        <div key={ws.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <h3 style={{ margin: 0 }}>{ws.name}</h3>
                                    {/* --- NEW DELETE BUTTON --- */}
                                    <button 
                                        onClick={() => handleDeleteWorkspace(ws.id)}
                                        style={{ backgroundColor: '#ffdddd', color: '#cc0000', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Delete Workspace
                                    </button>
                                </div>
                                <label style={{ cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={ws.isActive}
                                        onChange={(e) => toggleWorkspace(ws.id, e.target.checked)}
                                    /> Enable Blocklist
                                </label>
                            </div>

                            <form onSubmit={(e) => handleAddSite(ws.id, e)} style={{ marginBottom: '10px' }}>
                                <input 
                                    type="text" 
                                    value={siteInputs[ws.id] || ""}
                                    placeholder="Enter site to block (e.g., reddit.com)"
                                    onChange={(e) => handleSiteInputChange(ws.id, e.target.value)}
                                    style={{ marginRight: '10px' }}
                                />
                                <button type="submit">Add Site</button>
                            </form>

                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {ws.sites.length === 0 && <li style={{ color: '#888' }}>No sites added yet.</li>}
                                
                                {ws.sites.map((site, index) => (
                                    <li key={index} style={{ 
                                        color: ws.isActive ? 'red' : 'black',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '5px'
                                    }}>
                                        <span>
                                            {site} {ws.isActive && <strong>(Blocked)</strong>}
                                        </span>
                                        <button 
                                            onClick={() => handleDeleteSite(ws.id, index)}
                                            style={{ background: 'transparent', border: 'none', color: '#cc0000', cursor: 'pointer', fontWeight: 'bold' }}
                                            title="Remove site"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Accessibility;