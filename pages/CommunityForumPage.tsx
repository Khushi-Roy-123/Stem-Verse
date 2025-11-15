import React, { useState, useEffect, useMemo } from 'react';
import { User, ForumPost, ForumTag, Reply } from '../types';
import { getPosts, addPost, addReply, toggleUpvotePost, toggleUpvoteReply, containsSpam, deletePost, deleteReply } from '../services/forumService';
import { ForumIcon, UpvoteIcon, CloseIcon, ShareIcon, TrashIcon } from '../components/icons';
import UserAvatar from '../components/UserAvatar';
import ConfirmationModal from '../components/ConfirmationModal';

const TAGS: ForumTag[] = ['Career Advice', 'Scholarships', 'Technical Help', 'Interview Prep', 'General Discussion'];
const SORTS = ['Latest', 'Most Upvoted', 'Most Replies'];
type ReplySortOption = 'Newest' | 'Oldest' | 'Most Upvoted';


const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// --- Sub-components for the Forum Page ---

const CreatePostView: React.FC<{
    currentUser: User;
    onCancel: () => void;
    onSubmit: (title: string, content: string, tags: ForumTag[]) => void;
}> = ({ onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<ForumTag[]>([]);
    const [error, setError] = useState('');

    const handleTagToggle = (tag: ForumTag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }
        if (selectedTags.length === 0) {
            setError('Please select at least one tag.');
            return;
        }
        if (containsSpam(title) || containsSpam(content)) {
            setError('Your post content appears to be spam. Please revise and try again.');
            return;
        }
        setError('');
        onSubmit(title, content, selectedTags);
    };

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
            <p className="text-gray-600 mb-6">Share your thoughts and questions with the community.</p>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
                {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}
                <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="post-title" value={title} onChange={e => setTitle(e.target.value)}
                        className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                 <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea id="post-content" value={content} onChange={e => setContent(e.target.value)} rows={8}
                        className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {TAGS.map(tag => (
                            <button key={tag} onClick={() => handleTagToggle(tag)}
                                className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors">Post</button>
                </div>
            </div>
        </div>
    );
};


const PostDetailView: React.FC<{
    post: ForumPost;
    currentUser: User;
    onBack: () => void;
    onAddReply: (content: string) => void;
    onTogglePostUpvote: () => void;
    onToggleReplyUpvote: (replyId: string) => void;
    onDeletePost: () => void;
    onDeleteReply: (replyId: string) => void;
}> = ({ post, currentUser, onBack, onAddReply, onTogglePostUpvote, onToggleReplyUpvote, onDeletePost, onDeleteReply }) => {
    const [replyContent, setReplyContent] = useState('');
    const [shareSuccess, setShareSuccess] = useState<string | null>(null);
    const hasUpvotedPost = post.upvotes.includes(currentUser.username);
    const [replySortOrder, setReplySortOrder] = useState<ReplySortOption>('Newest');
    const isPostOwner = post.author === currentUser.username;

    const handleReplySubmit = () => {
        if (replyContent.trim()) {
            onAddReply(replyContent);
            setReplyContent('');
        }
    };
    
    const handleShare = async () => {
        const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
        const shareData = {
            title: `Stem Verse: ${post.title}`,
            text: `Check out this discussion on Stem Verse: "${post.title}"`,
            url: url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Couldn't share using Web Share API:", err);
            }
        } else {
            navigator.clipboard.writeText(url).then(() => {
                setShareSuccess('Link copied!');
                setTimeout(() => setShareSuccess(null), 3000);
            }).catch(err => {
                console.error('Failed to copy link:', err);
                setShareSuccess('Failed to copy.');
                setTimeout(() => setShareSuccess(null), 3000);
            });
        }
    };

    const sortedReplies = useMemo(() => {
        const sorted = [...post.replies];
        switch (replySortOrder) {
            case 'Most Upvoted':
                return sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
            case 'Oldest':
                return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'Newest':
            default:
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [post.replies, replySortOrder]);

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            <button onClick={onBack} className="text-sm text-gray-600 hover:underline mb-4">
                &larr; Back to all posts
            </button>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                    <UserAvatar username={post.author} className="w-12 h-12 text-xl" />
                    <div>
                        <p className="font-bold text-gray-800">{post.author}</p>
                        <p className="text-xs text-gray-500">{timeSince(post.createdAt)}</p>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 break-words">{post.title}</h1>
                <div className="flex flex-wrap gap-2 my-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{tag}</span>
                    ))}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
                    <button onClick={onTogglePostUpvote} className={`flex items-center gap-2 text-sm font-medium transition-colors ${hasUpvotedPost ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                        <UpvoteIcon className="w-5 h-5" /> {post.upvotes.length} Upvote{post.upvotes.length !== 1 && 's'}
                    </button>
                    <div className="text-sm font-medium text-gray-500">{post.replies.length} Replies</div>
                     <div className="flex-grow"></div>
                    <div className="relative">
                        <button onClick={handleShare} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                            <ShareIcon className="w-5 h-5" /> Share
                        </button>
                         {shareSuccess && (
                            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md animate-fade-in">
                                {shareSuccess}
                            </div>
                        )}
                    </div>
                    {isPostOwner && (
                        <button onClick={onDeletePost} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                            <TrashIcon className="w-5 h-5" /> Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Replies ({post.replies.length})</h2>
                    <select
                        value={replySortOrder}
                        onChange={(e) => setReplySortOrder(e.target.value as ReplySortOption)}
                        className="text-sm bg-gray-100 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label="Sort replies"
                    >
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Most Upvoted">Most Upvoted</option>
                    </select>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                    <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Add your reply..." rows={3}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="text-right">
                        <button onClick={handleReplySubmit} disabled={!replyContent.trim()} className="px-5 py-2 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">Post Reply</button>
                    </div>
                </div>
                 <div className="mt-6 space-y-5">
                    {sortedReplies.map(reply => {
                        const isReplyOwner = reply.author === currentUser.username;
                        return (
                            <div key={reply.id} className="flex items-start gap-4 group">
                                <UserAvatar username={reply.author} className="w-10 h-10 text-lg mt-1" />
                                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm text-gray-800">{reply.author}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-gray-500">{timeSince(reply.createdAt)}</p>
                                            {isReplyOwner && (
                                                <button onClick={() => onDeleteReply(reply.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete reply">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                                    <button onClick={() => onToggleReplyUpvote(reply.id)} className={`flex items-center gap-1.5 text-xs mt-2 transition-colors ${reply.upvotes.includes(currentUser.username) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                                        <UpvoteIcon className="w-4 h-4" /> {reply.upvotes.length}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                 </div>
            </div>
        </div>
    );
};

const PostCard: React.FC<{
    post: ForumPost;
    currentUser: User;
    onSelectPost: (post: ForumPost) => void;
    onToggleUpvote: (postId: string) => void;
    onDeletePost: (postId: string) => void;
}> = ({ post, currentUser, onSelectPost, onToggleUpvote, onDeletePost }) => {
    const hasUpvoted = post.upvotes.includes(currentUser.username);
    const [copied, setCopied] = useState(false);
    const isOwner = post.author === currentUser.username;

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
        const shareData = {
            title: `Stem Verse: ${post.title}`,
            text: `Check out this discussion on Stem Verse: "${post.title}"`,
            url: url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 transition-colors hover:border-blue-500">
            <div className="flex flex-col items-center">
                 <button onClick={(e) => { e.stopPropagation(); onToggleUpvote(post.id); }} className={`p-2 rounded-md transition-colors ${hasUpvoted ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:bg-gray-200'}`}>
                    <UpvoteIcon className="w-5 h-5"/>
                </button>
                <span className="text-sm font-bold text-gray-800 my-1">{post.upvotes.length}</span>
            </div>
            <div className="flex-1 group">
                <div onClick={() => onSelectPost(post)} className="cursor-pointer">
                    <div className="flex items-center text-xs text-gray-500 gap-2 mb-1">
                        <UserAvatar username={post.author} className="w-5 h-5 text-xs" />
                        <span>Posted by <span className="font-semibold text-gray-700">{post.author}</span></span>
                        <span>&bull;</span>
                        <span>{timeSince(post.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm font-medium text-gray-500">
                    <span>{post.replies.length} Replies</span>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={handleShare}
                                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                                aria-label="Share Post"
                            >
                                <ShareIcon className="w-5 h-5" />
                            </button>
                            {copied && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md animate-fade-in">
                                    Link Copied!
                                </div>
                            )}
                        </div>
                        {isOwner && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
                                className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                                aria-label="Delete Post"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

interface CommunityForumPageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
    initialPostId: string | null;
    setInitialPostId: (id: string | null) => void;
}

const CommunityForumPage: React.FC<CommunityForumPageProps> = ({ currentUser, onUpdateUser, initialPostId, setInitialPostId }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    
    const [activeTag, setActiveTag] = useState<ForumTag | 'All'>('All');
    const [sortOrder, setSortOrder] = useState(SORTS[0]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'reply'; postId: string; replyId?: string } | null>(null);

    useEffect(() => {
        setPosts(getPosts());
    }, []);

    useEffect(() => {
        if (initialPostId) {
            const allPosts = getPosts();
            const post = allPosts.find(p => p.id === initialPostId);
            if (post) {
                setSelectedPost(post);
            }
            setInitialPostId(null);
        }
    }, [initialPostId, setInitialPostId]);

    const handleDeleteRequest = (type: 'post' | 'reply', postId: string, replyId?: string) => {
        setItemToDelete({ type, postId, replyId });
        setIsConfirmModalOpen(true);
    };

    const confirmDeletion = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'post') {
            const success = deletePost(itemToDelete.postId, currentUser.username);
            if (success) {
                setPosts(posts.filter(p => p.id !== itemToDelete.postId));
                if (selectedPost && selectedPost.id === itemToDelete.postId) {
                    setSelectedPost(null);
                }
            }
        } else if (itemToDelete.type === 'reply' && itemToDelete.replyId) {
            const updatedPost = deleteReply(itemToDelete.postId, itemToDelete.replyId, currentUser.username);
            if (updatedPost) {
                setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
                if (selectedPost && selectedPost.id === itemToDelete.postId) {
                    setSelectedPost(updatedPost);
                }
            }
        }
        
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };


    const handleCreatePost = (title: string, content: string, tags: ForumTag[]) => {
        const newPost = addPost(title, content, tags, currentUser.username);
        if (newPost) {
            setPosts(prev => [newPost, ...prev]);
            setIsCreatingPost(false);
        }
    };

    const handleAddReply = (content: string) => {
        if (!selectedPost) return;
        const updatedPost = addReply(selectedPost.id, content, currentUser.username);
        if (updatedPost) {
            setSelectedPost(updatedPost);
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        }
    };

    const handleTogglePostUpvote = (postId: string) => {
        const updatedPost = toggleUpvotePost(postId, currentUser.username);
        if (updatedPost) {
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(updatedPost);
            }
        }
    };
    
    const handleToggleReplyUpvote = (replyId: string) => {
        if (!selectedPost) return;
        const updatedPost = toggleUpvoteReply(selectedPost.id, replyId, currentUser.username);
         if (updatedPost) {
            setSelectedPost(updatedPost);
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        }
    };


    const filteredAndSortedPosts = useMemo(() => {
        let result = posts;
        if (activeTag !== 'All') {
            result = posts.filter(p => p.tags.includes(activeTag as ForumTag));
        }
        
        switch (sortOrder) {
            case 'Most Upvoted':
                return [...result].sort((a, b) => b.upvotes.length - a.upvotes.length);
            case 'Most Replies':
                return [...result].sort((a, b) => b.replies.length - a.replies.length);
            case 'Latest':
            default:
                return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [posts, activeTag, sortOrder]);
    
    if (selectedPost) {
        return (
            <>
                <PostDetailView
                    post={selectedPost}
                    currentUser={currentUser}
                    onBack={() => setSelectedPost(null)}
                    onAddReply={handleAddReply}
                    onTogglePostUpvote={() => handleTogglePostUpvote(selectedPost.id)}
                    onToggleReplyUpvote={handleToggleReplyUpvote}
                    onDeletePost={() => handleDeleteRequest('post', selectedPost.id)}
                    onDeleteReply={(replyId) => handleDeleteRequest('reply', selectedPost.id, replyId)}
                />
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={confirmDeletion}
                    title={`Delete ${itemToDelete?.type}?`}
                    message={`Are you sure you want to permanently delete this ${itemToDelete?.type}? This action cannot be undone.`}
                    confirmText="Delete"
                />
            </>
        );
    }

    if (isCreatingPost) {
        return <CreatePostView currentUser={currentUser} onCancel={() => setIsCreatingPost(false)} onSubmit={handleCreatePost} />;
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="text-center">
                <ForumIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Community Forum</h1>
                <p className="text-gray-600 mt-2">Connect, ask questions, and share knowledge with your peers.</p>
            </div>

            <div className="p-4 bg-sky-50/80 backdrop-blur-sm rounded-xl border border-gray-200 space-y-4 sticky top-20 md:top-4 z-10">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2">
                         <label htmlFor="sort-order" className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button onClick={() => setIsCreatingPost(true)} className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                        Create New Post
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center border-t border-gray-200 pt-4">
                     <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                    <button onClick={() => setActiveTag('All')} className={`px-3 py-1 text-sm rounded-full border transition-colors ${activeTag === 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'}`}>All</button>
                    {TAGS.map(tag => (
                        <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 text-sm rounded-full border transition-colors ${activeTag === tag ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'}`}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                 {filteredAndSortedPosts.length > 0 ? (
                    filteredAndSortedPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser}
                            onSelectPost={setSelectedPost}
                            onToggleUpvote={handleTogglePostUpvote}
                            onDeletePost={() => handleDeleteRequest('post', post.id)}
                        />
                    ))
                 ) : (
                    <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
                        <p className="font-semibold text-lg text-gray-800">No posts found.</p>
                        <p className="text-gray-500 mt-1">Try changing your filters or be the first to start a conversation!</p>
                    </div>
                 )}
            </div>
             <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDeletion}
                title={`Delete ${itemToDelete?.type}?`}
                message={`Are you sure you want to permanently delete this ${itemToDelete?.type}? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default CommunityForumPage;