// All functions in this file should only be called from the browser (client-side)

import Axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';
import { COTTAGE_APP } from 'src/constants/analytics';
import { COTTAGE_ANONID, COTTAGE_SESSIONID } from 'src/constants/cookies';
import { v4 as uuidv4 } from 'uuid';

export const publishAppInsights = (
  eventType: string,
  value: string,
  metadata?: Record<string, any>
) => {
  // Set session cookie if not already present
  if (!cookieCutter.get(COTTAGE_SESSIONID)) {
    const sessionId = uuidv4();
    cookieCutter.set(COTTAGE_SESSIONID, sessionId, {
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      domain: 'joincottage.com',
    });
  }

  Axios.post('/api/appinsights/publish', {
    EventType: eventType,
    Value: value,
    AnonId: cookieCutter.get(COTTAGE_ANONID),
    Metadata: metadata ? JSON.stringify(metadata) : '',
    Origin: COTTAGE_APP,
  });
};
