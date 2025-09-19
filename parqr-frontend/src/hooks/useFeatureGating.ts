export const useFeatureGating = (userTier: string) => {
    const isPremium = userTier === 'premium';

    return {
        canAccessChat: isPremium,
        canSendMessages: isPremium,
        canCreateGroups: isPremium,
        canAddCars: isPremium,
    };
};