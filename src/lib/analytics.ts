import analytics from '@react-native-firebase/analytics';

/**
 * Safe wrapper around @react-native-firebase/analytics.
 * Every call is guarded with try/catch so analytics failures never block the app.
 */

export async function trackScreen(screenName: string, screenClass?: string) {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  } catch {
    // Silently ignore — analytics should never block UX
  }
}

export async function trackSignUp(method: string = 'email') {
  try {
    await analytics().logSignUp({ method });
  } catch {
    // ignore
  }
}

export async function trackLogin(method: string = 'email') {
  try {
    await analytics().logLogin({ method });
  } catch {
    // ignore
  }
}

export async function trackLogout() {
  try {
    await analytics().logEvent('logout', {});
  } catch {
    // ignore
  }
}

export async function trackEvent(name: string, params?: Record<string, string | number>) {
  try {
    await analytics().logEvent(name, params);
  } catch {
    // ignore
  }
}

/** Associate future Analytics events with the given user. */
export async function setUserId(userId: string | null) {
  try {
    await analytics().setUserId(userId ?? null);
  } catch {
    // ignore
  }
}

/** Set user-level properties that persist across sessions. */
export async function setUserProperties(properties: Record<string, string | null>) {
  try {
    await analytics().setUserProperties(properties);
  } catch {
    // ignore
  }
}

/** Clear all analytics data (call on logout). */
export async function resetAnalytics() {
  try {
    await analytics().resetAnalyticsData();
  } catch {
    // ignore
  }
}
