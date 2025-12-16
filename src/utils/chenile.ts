/**
 * Chenile Response Utilities
 * Helper functions for working with Chenile Framework responses
 */

import { GenericResponse, StateEntityServiceResponse } from 'homebase-shared';

/**
 * Extract the mutated entity from a Chenile response
 */
export function extractEntity<T>(
    response: GenericResponse<StateEntityServiceResponse<T>>
): T {
    if (!response.success) {
        throw new Error(response.description || 'Request failed');
    }
    return response.data.mutatedEntity;
}

/**
 * Get allowed actions from a Chenile response
 */
export function getAllowedActions<T>(
    response: GenericResponse<StateEntityServiceResponse<T>>
) {
    return response.data.allowedActionsAndMetadata || [];
}

/**
 * Check if a specific action is allowed
 */
export function isActionAllowed<T>(
    response: GenericResponse<StateEntityServiceResponse<T>>,
    eventId: string
): boolean {
    const actions = getAllowedActions(response);
    return actions.some((action) => action.eventId === eventId);
}

/**
 * Handle Chenile errors
 */
export function handleChenileError(error: any): string {
    if (error.chenileResponse) {
        const chenileError = error.chenileResponse;
        if (chenileError.errors && chenileError.errors.length > 0) {
            return chenileError.errors.map((e: any) => e.description).join(', ');
        }
        return chenileError.description || 'An error occurred';
    }
    return error.message || 'An unexpected error occurred';
}
