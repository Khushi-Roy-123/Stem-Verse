import React from 'react';

export type Page = 'Home' | 'Ask STEMVerse' | 'Opportunities' | 'Inspiration Hub' | 'STEMQuest' | 'Resume Tips' | 'Community Forum' | 'Settings' | 'Wellbeing Hub';

// Fix: Add Theme type for ThemeToggle component
export type Theme = 'light' | 'dark';

export interface MenuItem {
  name: Page;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface NotificationPreferences {
    weeklyDigest: boolean;
    questReminders: boolean;
    newInspirations: boolean;
    deadlineAlerts: boolean;
}

export type Mood = 'great' | 'okay' | 'stressed' | 'overwhelmed';

export interface WellbeingEntry {
    mood: Mood;
    date: string;
}

export interface User {
    username: string;
    email: string;
    hashed_password: string;
    xp: number;
    level: number;
    completed_quests: string[]; // Stores quest IDs
    savedOpportunities: string[]; // Stores titles of saved opportunities
    selectedCareerPath?: string; // Stores the ID of the selected career path, e.g., 'swe'
    badges: string[]; // Stores badge IDs
    questCompletionDates: { [questId: string]: string }; // e.g., { 'swe-1-1': '2023-10-27T10:00:00Z' }
    notifications: Notification[];
    notificationPreferences: NotificationPreferences;
    wellbeingHistory: WellbeingEntry[];
}

export interface Opportunity {
    title: string;
    organization: string;
    category: 'Scholarship' | 'Internship' | 'Grant' | 'Conference';
    field: 'Computer Science' | 'Engineering' | 'Data Science' | 'All STEM';
    eligibility: string;
    deadline: string;
    description: string;
    link: string;
}

export interface InspirationalPerson {
    id: string;
    name: string;
    field: string;
    photoUrl: string;
    bio: string;
    majorAchievements: string[];
    awards: string[];
    quote: string;
    links: {
        wikipedia?: string;
        website?: string;
        twitter?: string;
    };
    category: 'Historical Pioneers' | 'Modern Innovators' | 'Rising Stars' | 'Nobel Laureates';
    videoUrl?: string; // Optional YouTube video URL
}


// Gamification Types
export interface QuestResource {
    title: string;
    url: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    xp: number;
    resources: QuestResource[];
}

export interface CareerLevel {
    level: number;
    title: string;
    quests: Quest[];
}

export interface CareerPath {
    id: string;
    name: string;
    description: string;
    levels: CareerLevel[];
}

// Badge/Achievement Type
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Resume Analyzer Type
export interface ResumeAnalysisResult {
    score: number;
    overall: string;
    positivePoints: string[];
    areasForImprovement: string[];
}

// Forum Types
export type ForumTag = 'Career Advice' | 'Scholarships' | 'Technical Help' | 'Interview Prep' | 'General Discussion';

export interface Reply {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    upvotes: string[]; // Array of usernames who upvoted
}

export interface ForumPost {
    id: string;
    author: string;
    title: string;
    content: string;
    tags: ForumTag[];
    createdAt: string;
    upvotes: string[]; // Array of usernames who upvoted
    replies: Reply[];
}

// Notification Type
export interface Notification {
    id: string;
    postId: string;
    postTitle: string;
    replier: string;
    createdAt: string;
    read: boolean;
}