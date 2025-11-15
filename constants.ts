import { MenuItem } from './types';
import { HomeIcon, ChatIcon, BriefcaseIcon, LightbulbIcon, GamepadIcon, DocumentIcon, ForumIcon, SettingsIcon, HeartbeatIcon } from './components/icons';

export const MENU_ITEMS: MenuItem[] = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Ask STEMVerse', icon: ChatIcon },
  { name: 'Community Forum', icon: ForumIcon },
  { name: 'Opportunities', icon: BriefcaseIcon },
  { name: 'Inspiration Hub', icon: LightbulbIcon },
  { name: 'STEMQuest', icon: GamepadIcon },
  { name: 'Wellbeing Hub', icon: HeartbeatIcon },
  { name: 'Resume Tips', icon: DocumentIcon },
  { name: 'Settings', icon: SettingsIcon },
];