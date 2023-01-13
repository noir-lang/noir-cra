import initialiseResolver from "@noir-lang/noir-source-resolver";
import initNoirWasm, { compile } from "@noir-lang/noir_wasm";
import initialiseAztecBackend from "@noir-lang/aztec_backend";
import {
    create_proof,
    verify_proof,
    setup_generic_prover_and_verifier,
} from "@noir-lang/barretenberg";

export async function compileNoirSource(noir_source) {
    await initNoirWasm();

    initialiseResolver((id) => {

        console.log(`Resolving source ${id}`);

        return noir_source;

    });

    console.log("Compiling Noir source...");

    const compiled_noir = await compile("main.nr");

    console.log("Noir source compilation done.");

    return compiled_noir;
}

export async function createProof(compiled_noir, circuitParams) {

    await initialiseAztecBackend();

    const acir = compiled_noir.circuit;

    console.log("Setting up Prover and Verifier...");

    const [prover, verifier] = await setup_generic_prover_and_verifier(acir);

    console.log("Setting up Prover and Verifier done.");

    console.log("Creating proof...");

    const proof = await create_proof(prover, acir, circuitParams);

    console.log("Creating proof done.");

    return { verifier, proof };
}

export async function verifyProof(verifier, proof) {

    console.log("Verifying Proof...");

    const verified = await verify_proof(verifier, proof);

    console.log("Verifying Proof done, Verified ", verified);

    return verified;
}