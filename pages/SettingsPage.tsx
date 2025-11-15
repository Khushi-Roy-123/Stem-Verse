import React, { useState } from 'react';
import { User, NotificationPreferences } from '../types';
import { SettingsIcon } from '../components/icons';

interface SettingsPageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const ToggleSwitch: React.FC<{
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => {
    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                type="button"
                className={`${enabled ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white`}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
};


const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser }) => {
    const [preferences, setPreferences] = useState<NotificationPreferences>(currentUser.notificationPreferences);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setSaveStatus('idle'); // Reset save status on new change
    };

    const handleSaveChanges = () => {
        setSaveStatus('saving');
        const updatedUser = { ...currentUser, notificationPreferences: preferences };
        onUpdateUser(updatedUser);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000); // Hide message after 2s
        }, 1000);
    };
    
    // Check if preferences have changed from the original
    const hasChanges = JSON.stringify(preferences) !== JSON.stringify(currentUser.notificationPreferences);

    return (
        <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <SettingsIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account and notification preferences.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Notifications</h2>
                 <p className="text-gray-600 mb-6">Choose which emails you want to receive from Stem Verse. Note: This is a frontend demonstration. No actual emails will be sent.</p>

                <ToggleSwitch 
                    label="Weekly Opportunity Digest"
                    description="Receive a summary of new scholarships and internships every week."
                    enabled={preferences.weeklyDigest}
                    onChange={(value) => handlePreferenceChange('weeklyDigest', value)}
                />

                <ToggleSwitch 
                    label="Quest Reminders"
                    description="Get a reminder if you've been inactive on your STEMQuest for a week."
                    enabled={preferences.questReminders}
                    onChange={(value) => handlePreferenceChange('questReminders', value)}
                />

                <ToggleSwitch 
                    label="New Inspiration Stories"
                    description="Be notified when new inspiring women are added to the Inspiration Hub."
                    enabled={preferences.newInspirations}
                    onChange={(value) => handlePreferenceChange('newInspirations', value)}
                />

                <ToggleSwitch 
                    label="Deadline Alerts"
                    description="Get a notification 7 days before a saved opportunity's deadline."
                    enabled={preferences.deadlineAlerts}
                    onChange={(value) => handlePreferenceChange('deadlineAlerts', value)}
                />
                
                <div className="flex justify-end items-center mt-8 gap-4">
                    {saveStatus === 'saved' && <p className="text-blue-600 text-sm">Preferences saved!</p>}
                    <button 
                        onClick={handleSaveChanges}
                        disabled={!hasChanges || saveStatus === 'saving'}
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;