import type React from 'react';

/* crop: the 16:9 shots are cropped to 9:16 around the centre (the shot cameras keep the action there) */
export type Seg = {line: string; at?: number; ep?: string; off?: number; cont?: boolean; hold?: boolean; a?: {cx?: number; cy?: number; z?: number}; b?: {cx?: number; cy?: number; z?: number}; C?: React.FC<{f: number; dur: number}>};
export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string} = {mode: 'crop'};
