
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.70c25b8a074f4f20bd7d13cf46dfa315',
  appName: 'WhatsApp-Style Notifications',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://70c25b8a-074f-4f20-bd7d-13cf46dfa315.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
