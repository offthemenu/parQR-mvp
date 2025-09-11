import { User } from "../types";

export const useFeatureGating = (user: User) => {
    const isPremium = user.user_tier === 'premium';

    return {
        canAccessChat: isPremium,
        canSendMessages: isPremium,
        canCreateGroups: isPremium,
    };
};