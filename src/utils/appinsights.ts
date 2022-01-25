// All functions in this file should only be called from the browser (client-side)

import Axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';
import { COTTAGE_APP } from 'src/constants/analytics';
import { COTTAGE_ANONID } from 'src/constants/cookies';

export const publishAppInsights = (
  eventType: string,
  value: string,
  metadata?: Record<string, any>
) => {
  Axios.post('/api/appinsights/publish', {
    EventType: eventType,
    Value: value,
    AnonId: cookieCutter.get(COTTAGE_ANONID),
    Metadata: metadata ? JSON.stringify(metadata) : '',
    Origin: COTTAGE_APP,
  });
};
