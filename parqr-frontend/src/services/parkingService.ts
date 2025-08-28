import { apiClient } from "../config/api";
import { ParkingSession, StartParkingRequest } from "../types";

export class ParkingService {
    static async startParkingSession(
        request: StartParkingRequest
    ): Promise<ParkingSession> {
        try {
            const response = await apiClient.post('/v01/parking/start', request);
            return response.data;
        } catch (error: any) {
            console.error('Start parking session error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async endParkingSession(
        sessionId: number,
        noteLocation?: string
    ): Promise<ParkingSession> {
        try {
            const requestData: any = { session_id: sessionId };
            if (noteLocation) {
                requestData.note_location = noteLocation;
            }
            
            const response = await apiClient.post('/v01/parking/end', requestData);
            return response.data
        } catch (error: any) {
            console.error('End parking session error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getActiveSessions(): Promise<ParkingSession[]> {
        try {
            const response = await apiClient.get('/v01/parking/active');
            return response.data.active_sessions || [];
        } catch (error: any) {
            console.error("Get active sessions error:", error.response?.data || error.message);
            throw error;
        }
    }

    static calculateSessionDuration(startTime: string, endTime?: string):
    string{
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        
        const durationMs = end.getTime() - start.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
        return `${hours}h ${minutes}m`;
        } else {
        return `${minutes}m`;
        }
    }
}