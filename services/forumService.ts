import { ForumPost, Reply, User, ForumTag, Notification } from '../types';
import { getUsers, saveUsers } from '../utils/auth';

const FORUM_KEY = 'stemverse_forum_posts';

const SPAM_KEYWORDS = [
    'spam', 'buy now', 'free money', 'click here', 'subscribe', 'crypto', 'viagra', 'cialis',
    'casino', 'gambling', 'win money', 'make money fast', 'investment opportunity', 'forex',
    'work from home', 'multi-level marketing', 'mlm', 'adult', 'xxx', 'loan', 'credit score',
    'limited time offer', 'guaranteed', '100% free', 'no cost', 'winner', 'claim your prize'
];

// --- Basic Data Operations ---

export const getPosts = (): ForumPost[] => {
    const postsJson = localStorage.getItem(FORUM_KEY);
    if (!postsJson) return [];
    const posts: ForumPost[] = JSON.parse(postsJson);
    // Ensure all posts have the necessary fields to avoid errors with old data structures
    return posts.map(post => ({
        ...post,
        upvotes: post.upvotes || [],
        replies: post.replies ? post.replies.map(reply => ({ ...reply, upvotes: reply.upvotes || [] })) : [],
    }));
};

const savePosts = (posts: ForumPost[]): void => {
    localStorage.setItem(FORUM_KEY, JSON.stringify(posts));
};

// --- Spam Filter ---

export const containsSpam = (text: string): boolean => {
    const lowerCaseText = text.toLowerCase();

    // 1. Keyword check
    if (SPAM_KEYWORDS.some(keyword => lowerCaseText.includes(keyword))) {
        return true;
    }

    // 2. Excessive capitalization heuristic
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 20) { // Only apply to reasonably long text
        const upperCaseLetters = letters.replace(/[^A-Z]/g, '');
        if ((upperCaseLetters.length / letters.length) > 0.5) {
            return true; // More than 50% uppercase
        }
    }
    
    // 3. Excessive special characters heuristic
    if (text.length > 30) {
        const specialChars = text.replace(/[a-zA-Z0-9\s]/g, '');
        if ((specialChars.length / text.length) > 0.4) {
            return true; // More than 40% special characters
        }
    }
    
    // 4. Too many links heuristic
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex);
    if (links && links.length > 3) {
        return true; // More than 3 links
    }

    return false;
};

// --- Main Service Functions ---

export const addPost = (title: string, content: string, tags: ForumTag[], author: string): ForumPost | null => {
    if (containsSpam(title) || containsSpam(content)) {
        alert("Your post seems to contain spam and could not be submitted.");
        return null;
    }

    const newPost: ForumPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author,
        title,
        content,
        tags,
        createdAt: new Date().toISOString(),
        upvotes: [],
        replies: [],
    };

    const posts = getPosts();
    savePosts([newPost, ...posts]);
    return newPost;
};

export const addReply = (postId: string, content: string, author: string): ForumPost | null => {
    if (containsSpam(content)) {
        alert("Your reply seems to contain spam and could not be submitted.");
        return null;
    }
    
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return null;

    const newReply: Reply = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author,
        content,
        createdAt: new Date().toISOString(),
        upvotes: [],
    };
    
    const targetPost = posts[postIndex];
    targetPost.replies.push(newReply);
    savePosts(posts);

    // Create a notification for the post author
    if (author !== targetPost.author) {
        createNotification(targetPost.author, {
            id: `notif_${Date.now()}`,
            postId: targetPost.id,
            postTitle: targetPost.title,
            replier: author,
            createdAt: new Date().toISOString(),
            read: false,
        });
    }


    return targetPost;
};

export const toggleUpvotePost = (postId: string, username: string): ForumPost | null => {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const upvoteIndex = post.upvotes.indexOf(username);
    if (upvoteIndex > -1) {
        post.upvotes.splice(upvoteIndex, 1); // Unlike
    } else {
        post.upvotes.push(username); // Like
    }

    savePosts(posts);
    return post;
};

export const toggleUpvoteReply = (postId: string, replyId: string, username: string): ForumPost | null => {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const reply = post.replies.find(r => r.id === replyId);
    if (!reply) return null;

    const upvoteIndex = reply.upvotes.indexOf(username);
    if (upvoteIndex > -1) {
        reply.upvotes.splice(upvoteIndex, 1); // Unlike
    } else {
        reply.upvotes.push(username); // Like
    }

    savePosts(posts);
    return post;
};

export const deletePost = (postId: string, username: string): boolean => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return false; // Post not found

    if (posts[postIndex].author !== username) {
        console.warn("User trying to delete a post they don't own.");
        return false; // Authorization failed
    }

    posts.splice(postIndex, 1);
    savePosts(posts);
    return true;
};

export const deleteReply = (postId: string, replyId: string, username: string): ForumPost | null => {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const replyIndex = post.replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return null; // Reply not found

    if (post.replies[replyIndex].author !== username) {
        console.warn("User trying to delete a reply they don't own.");
        return null; // Authorization failed
    }
    
    post.replies.splice(replyIndex, 1);
    savePosts(posts);
    return post;
};


// --- Notification Management ---
const createNotification = (usernameToNotify: string, notification: Notification) => {
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.username === usernameToNotify);

    if (userIndex > -1) {
        if (!allUsers[userIndex].notifications) {
            allUsers[userIndex].notifications = [];
        }
        allUsers[userIndex].notifications.unshift(notification); // Add to the beginning
        saveUsers(allUsers);
    }
};