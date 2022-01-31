// All functions in this file should only be called from the browser (client-side)

import { User } from '@prisma/client';
import Axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';
import { COTTAGE_APP } from 'src/constants/analytics';
import { COTTAGE_ANONID, COTTAGE_SESSIONID } from 'src/constants/cookies';
import { v4 as uuidv4 } from 'uuid';

export const publishAppInsights = async (
  eventType: string,
  value: string,
  metadata?: Record<string, any>
) => {
  const anonId = cookieCutter.get(COTTAGE_ANONID);
  let sessionId = cookieCutter.get(COTTAGE_SESSIONID);

  // Set session cookie if not already present
  if (!sessionId) {
    sessionId = uuidv4();
    cookieCutter.set(COTTAGE_SESSIONID, sessionId, {
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      //domain: 'joincottage.com',
      path: '/',
    });

    const response = await Axios.get<User>(
      `/api/v2/users/by-anon-id?anonId=${anonId}`
    );
    const user = response.data;
    Axios.post('/api/discord/notify-new-session', {
      userId: user?.id || 'Anonymous',
      name: user?.name || 'Anonymous',
      sessionId,
      anonId,
    });
  }

  Axios.post('/api/appinsights/publish', {
    EventType: eventType,
    Value: value,
    AnonId: anonId,
    Metadata: metadata ? JSON.stringify(metadata) : '',
    Origin: COTTAGE_APP,
    SessionId: sessionId,
  });
};
