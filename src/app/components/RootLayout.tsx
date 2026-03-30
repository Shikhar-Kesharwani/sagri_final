import { Outlet } from 'react-router';
import { VoiceAssistant } from './VoiceAssistant';
import { BottomNav } from './BottomNav';
import { AppProviders } from './AppProviders';

export function RootLayout() {
  return (
    <AppProviders>
      <>
        <Outlet />
        <VoiceAssistant />
        <BottomNav />
      </>
    </AppProviders>
  );
}