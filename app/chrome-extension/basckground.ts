import { TrackingData } from '../src/types/tracking';
import { sendTrackingData } from './api';

let startTime: { [key: number]: number } = {};
const SOCIAL_DOMAINS = ['facebook.com', 'twitter.com', 'instagram.com'];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && isSocialMedia(tab.url)) {
    startTime[tab.id] = Date.now();
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
