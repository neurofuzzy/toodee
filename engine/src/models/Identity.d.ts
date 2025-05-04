export interface Identifiable {
    id: number;
}
export interface IChild {
    parentID: number;
}
export declare class IdentityService {
    private static lastID;
    static newIdentity(): number;
}
