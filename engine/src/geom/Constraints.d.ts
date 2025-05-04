export interface IConstraints {
    lockX: boolean;
    lockY: boolean;
    lockRotation: boolean;
}
export declare class Constraints implements IConstraints {
    lockX: boolean;
    lockY: boolean;
    lockRotation: boolean;
    constructor(lockX?: boolean, lockY?: boolean, lockRotation?: boolean);
}
