import { MoveRequest } from "../types";
import { apiClient } from "../config/api";

export class MoveRequestService {
    static async getUnreadCount(userCode: string): Promise<number> {
        try {
            const response = await apiClient.get(`/v01/move_requests/unread_count/${userCode}`);
            return response.data?.unread_count || 0;
        } catch (error: any) {
            console.warn(`No move requests found for user ${userCode}, returning 0`);
            // Return 0 for new users with no move requests - this is normal behavior
            return 0;
        }
    }

    static async getAllMoveRequests(userCode: string, limit = 50) : Promise<MoveRequest[]> {
        try {
            const response = await apiClient.get(`/v01/move_requests/history/${userCode}?limit=${limit}`);
            return response.data?.requests || [];
        } catch (error) {
            console.warn(`No move requests found for user ${userCode}, return empty array`);
            return [];
        }
    }

    static async getPreview(userCode: string, limit = 5): Promise<MoveRequest[]> {
        try {
            const response = await apiClient.get(`/v01/move_requests/preview/${userCode}?limit=${limit}`);
            return response.data?.requests || [];
        } catch (error: any) {
            console.warn(`No move request preview found for user ${userCode}, returning empty array`);
            // Return empty array for new users with no move requests - this is normal behavior
            return [];
        }
    }

    static async createRequest(targetUserCode: string, licensePlate: string): Promise<void> {
        const response = await apiClient.post('/v01/move_requests/create', {
            target_user_code: targetUserCode,
            license_plate: licensePlate
        });
        
        if (!response.data) {
            throw new Error('Failed to create move request');
        }
    }

    static async markAsRead(requestId: number): Promise<void> {
        const response = await apiClient.put(`/v01/move_requests/${requestId}/mark_read`);
        
        if (!response.data) {
            throw new Error('Failed to mark request as read');
        }
    }
}