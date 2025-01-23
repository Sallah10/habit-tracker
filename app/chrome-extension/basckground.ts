import { TrackingData } from '../../types/tracking';
import { sendTrackingData } from './api';

const startTime: { [key: number]: number } = {};
const SOCIAL_DOMAINS = ['facebook.com', 'x.com', 'instagram.com', 'linkedin.com'];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.id !== undefined) {
    if (isSocialMedia(tab.url)) {
      startTime[tab.id] = Date.now();
    } else if (startTime[tab.id]) {
      const domain = new URL(tab.url).hostname;
      await updateTracking(tab.id, domain);
    }
  }
});

function isSocialMedia(url: string): boolean {
  return SOCIAL_DOMAINS.some(domain => url.includes(domain));
}

async function updateTracking(tabId: number, domain: string) {
  if (startTime[tabId]) {
    const duration = Date.now() - startTime[tabId];
    const trackingData: TrackingData = {
      timestamp: Date.now(),
      domain,
      duration,
    };
    
    await sendTrackingData(trackingData);
    delete startTime[tabId];
  }
}
