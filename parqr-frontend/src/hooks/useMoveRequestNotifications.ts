import { useState,useEffect } from "react";
import { MoveRequestService } from "../services/moveRequestService";

export const useMoveRequestNotifications = (userCode: string) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const refreshUnreadCount = async () => {
        try {
            setIsLoading(true);
            const count = await MoveRequestService.getUnreadCount(userCode);
            setUnreadCount(count)
        } catch (error) {
            console.error("Failed to fetch move request count:", error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        refreshUnreadCount();
    }, [userCode]);

    return {
        moveRequestsUnreadCount: unreadCount,
        refreshMoveReqeustsCount: refreshUnreadCount,
        isLoadingMoveRequests: isLoading
    };
};