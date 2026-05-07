export const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#FFD93D' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#74B9FF' },
  { id: 'bored', label: 'Bored', emoji: '😑', color: '#B2BEC3' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#FF6B6B' },
  { id: 'chill', label: 'Chill', emoji: '😎', color: '#55EFC4' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺', color: '#A29BFE' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#FD79A8' },
  { id: 'curious', label: 'Curious', emoji: '🤔', color: '#FDCB6E' },
  { id: 'romantic', label: 'Romantic', emoji: '🥰', color: '#E84393' },
  { id: 'social', label: 'Social', emoji: '🎉', color: '#6C5CE7' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: '#00B894' },
  { id: 'study', label: 'Study', emoji: '📚', color: '#0984E3' },
  { id: 'funny', label: 'Funny', emoji: '😂', color: '#FFEAA7' },
  { id: 'emotional', label: 'Emotional', emoji: '💫', color: '#DFE6E9' },
  { id: 'talkative', label: 'Talkative', emoji: '🗣️', color: '#E17055' },
  { id: 'silent', label: 'Silent', emoji: '🤫', color: '#636E72' },
];

export const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'other', label: 'Other' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const PREFERRED_GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'everyone', label: 'Everyone' },
];

export const COMMUNICATION_MODES = [
  { id: 'text', label: 'Text Chat', icon: '💬', description: 'Send messages in real-time' },
  { id: 'voice', label: 'Voice Call', icon: '📞', description: 'Talk with your voice' },
  { id: 'video', label: 'Video Call', icon: '📹', description: 'Face-to-face conversation' },
];

export const INTERESTS = [
  'Music', 'Movies', 'Gaming', 'Sports', 'Travel', 'Photography',
  'Cooking', 'Reading', 'Art', 'Fashion', 'Fitness', 'Technology',
  'Science', 'Nature', 'Dancing', 'Writing', 'Anime', 'Comedy',
  'Podcasts', 'Yoga', 'Meditation', 'Coding', 'Design', 'Singing',
  'Volunteering', 'Pets', 'Food', 'Coffee', 'Startups', 'Crypto',
];

export const REPORT_CATEGORIES = [
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'spam', label: 'Spam or scam' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'fake-profile', label: 'Fake profile' },
  { id: 'hate-speech', label: 'Hate speech' },
  { id: 'threats', label: 'Threats or violence' },
  { id: 'underage', label: 'Underage user' },
  { id: 'other', label: 'Other' },
];

export const PRIVACY_OPTIONS = {
  location: [
    { id: 'hidden', label: 'Hide location completely' },
    { id: 'city', label: 'Show city only' },
    { id: 'region', label: 'Show region only' },
  ],
  profile: [
    { id: 'everyone', label: 'Visible to everyone' },
    { id: 'matches', label: 'Visible to matches only' },
    { id: 'hidden', label: 'Hidden profile' },
  ],
};

export const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    period: 'month',
    features: ['Unlimited matches', 'Advanced filters', 'Priority search', 'Premium badge'],
    popular: false,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 24.99,
    period: '3 months',
    features: ['Everything in Monthly', 'Profile boost', 'See who liked you', 'Custom themes'],
    popular: true,
    savings: '17%',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 79.99,
    period: 'year',
    features: ['Everything in Quarterly', 'VIP badge', 'Priority support', 'Early features'],
    popular: false,
    savings: '33%',
  },
];

export const FREE_LIMITS = {
  dailyMatches: 10,
  dailyChatRequests: 5,
  maxInterests: 5,
};

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=6C5CE7&color=fff&name=User&size=200';

export const FOLLOW_APPROVAL_OPTIONS = [
  { id: 'auto', label: 'Auto-approve — anyone can follow instantly' },
  { id: 'manual', label: 'Manual — follow requests need your approval' },
];
