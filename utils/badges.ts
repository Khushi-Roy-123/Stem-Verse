import { Badge, User, CareerPath } from '../types';
import { FootstepsIcon, StarIcon, BookOpenIcon, CrownIcon } from '../components/icons';

export const ALL_BADGES: Badge[] = [
    {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Completed your first quest.',
        icon: FootstepsIcon,
    },
    {
        id: 'rising-star',
        name: 'Rising Star',
        description: 'Reached Level 3 in any career path.',
        icon: StarIcon,
    },
    {
        id: 'dedicated-learner',
        name: 'Dedicated Learner',
        description: 'Completed 10 quests.',
        icon: BookOpenIcon,
    },
    {
        id: 'stem-champion',
        name: 'STEM Champion',
        description: 'Completed all quests in a career path.',
        icon: CrownIcon,
    },
];

export const getBadgeById = (id: string): Badge | undefined => {
    return ALL_BADGES.find(b => b.id === id);
};


export const checkForNewBadges = (user: User, allCareerPaths: CareerPath[]): string[] => {
    const newBadges: string[] = [];
    const userBadges = new Set(user.badges);

    // Badge: First Steps (1 quest)
    if (!userBadges.has('first-steps') && user.completed_quests.length >= 1) {
        newBadges.push('first-steps');
    }

    // Badge: Rising Star (Level 3)
    if (!userBadges.has('rising-star') && user.level >= 3) {
        newBadges.push('rising-star');
    }
    
    // Badge: Dedicated Learner (10 quests)
    if (!userBadges.has('dedicated-learner') && user.completed_quests.length >= 10) {
        newBadges.push('dedicated-learner');
    }

    // Badge: STEM Champion (complete one career path)
    if (!userBadges.has('stem-champion') && user.selectedCareerPath) {
        const path = allCareerPaths.find(p => p.id === user.selectedCareerPath);
        if (path) {
            const totalQuestsInPath = path.levels.reduce((sum, level) => sum + level.quests.length, 0);
            const completedInPath = user.completed_quests.filter(qId => qId.startsWith(path.id)).length;
            if (totalQuestsInPath > 0 && completedInPath === totalQuestsInPath) {
                newBadges.push('stem-champion');
            }
        }
    }

    return newBadges;
};
