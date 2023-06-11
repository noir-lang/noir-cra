export declare function compileNoirSource(noir_source: any): Promise<any>;
export declare function createProof(compiled_noir: any, circuitParams: any): Promise<{
    verifier: any;
    proof: any;
}>;
export declare function verifyProof(verifier: any, proof: any): Promise<{
    verified: any;
}>;
