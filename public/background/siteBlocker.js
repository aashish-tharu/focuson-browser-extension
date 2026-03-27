const SOCIAL_MEDIA_SITES = ["facebook.com", "youtube.com", instagram.com, x.com];

async function updateBlockingRules() {
    try {
        const data = await chrome.storage.local.get(["isSocialBlocked", "workspaces"]);
        const isSocialBlocked = data.isSocialBlocked || false;
        const workspaces = data.workspaces || [];

        let domainsToBlock = new Set();

        if (isSocialBlocked) {
            SOCIAL_MEDIA_SITES.forEach(site => domainsToBlock.add(site));
        }

        workspaces.forEach(ws => {
            if (ws.isActive) {
                ws.sites.forEach(site => domainsToBlock.add(site));
            }
        });

        const newRules = Array.from(domainsToBlock).map((domain, index) => ({
            id: index + 1,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: `||${domain}`,
                resourceTypes: ["main_frame"]
            }
        }));

        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRuleIds = existingRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,
            addRules: newRules
        });

        console.log("Site blocker updated! Currently blocking:", Array.from(domainsToBlock));
    } catch (error) {
        console.error("Error updating site blocker rules:", error);
    }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && (changes.isSocialBlocked || changes.workspaces)) {
        updateBlockingRules();
    }
});

chrome.runtime.onInstalled.addListener(() => {
    updateBlockingRules();
});

chrome.runtime.onStartup.addListener(() => {
    updateBlockingRules();
});