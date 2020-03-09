export const isV1 = (typeof window !== 'undefined') && window.location.pathname === '/v1';

export const DISTANCE_TO_TACK = 0.0233732728;

export const invalidUsers = ['', 'Aeroiio4', 'HhhS', 'Pimdw', 'Hshshs', 'HhaaAh', 'Fcccf'];

export const defaultAccessor = isV1 ? 'distance' : 'taskContributionCount';
