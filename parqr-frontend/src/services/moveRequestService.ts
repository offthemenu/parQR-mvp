import { MoveRequest } from "../types";

export class MoveRequestService {
    static async getUnreadCount(userCode: string): Promise<number> {
        const response = await fetch(`/api/v01/move_requests/unread_count/${userCode}`);
        const data = await response.json();
        return data.unread_count;
    }

    static async getPreview(userCode: string, limit = 5): Promise<MoveRequest[]> {
        const response = await fetch(`/api/v01/move_requests/preview/${userCode}?limit=${limit}`);
        const data = await response.json();
        return data.requests;
    }

    static async createRequest(targetUserCode: string, licensePlate: string): Promise<void> {
        await fetch('/api/v01/move_requests/create', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target_user_code: targetUserCode, license_plate: licensePlate })
        });
    }

    static async markAsRead(requestId: number): Promise<void> {
        await fetch(`/api/v01/move_requests/${requestId}/mark_read`, {
            method: "PUT"
        });
    }
}