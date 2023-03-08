import initialiseResolver from "@noir-lang/noir-source-resolver";
import initNoirWasm, { compile, acir_read_bytes } from "@noir-lang/noir_wasm";
import initialiseAztecBackend from "@noir-lang/aztec_backend";
import {
    create_proof,
    verify_proof,
    setup_generic_prover_and_verifier,
} from "@noir-lang/barretenberg";

import prepare_lib_std from "./lib_std";

export async function compileNoirSource(noir_source) {
    await initNoirWasm();

    const mainSourceIdentifier = "main.nr";

    console.log("Compiling Noir source...");

    return prepare_lib_std().then(sources => {

        sources[mainSourceIdentifier] = noir_source;

        initialiseResolver((id) => {

            console.log(`Resolving source ${id}`);

            const source = sources[id];

            if (typeof source === "undefined") {
                throw Error(`Could not resolve source for '${id}'`);
            } else {
                return source;
            }
        });

        // We're adding standard library of Noir, ie. `dep::std`
        // For now this serves as an example of loading library.
        // Note `dep::std` is going to be embeded and loading `std` this way is not going to be necessary. 
        // dependencies.add("std");


        try {
            const compiled_noir = compile({
                // contracts: false,
                // compile_options: {
                //     show_ssa: false,
                //     allow_warnings: false,
                //     show_output: false
                // },
                optional_dependencies_set: ["std"],
            });

            // const buildInfo = await build_info();
            // console.log(buildInfo);

            console.log("Noir source compilation done.");

            return compiled_noir;
        } catch (e) {
            console.log("Error while compiling:", e);
        }
    });

}

export async function createProof(compiled_noir, circuitParams) {

    await initialiseAztecBackend();

    console.log(compiled_noir);

    // This temporary hack is necessary to accomodate for recent change in acir serialisation
    // will be reverted back to bytes instead of string
    let acir_bytes = new Uint8Array(Buffer.from(compiled_noir.circuit, "hex"));

    let acir = acir_read_bytes(acir_bytes);


    // const acir = compiled_noir.circuit;

    console.log("Setting up Prover and Verifier...");

    const [prover, verifier] = await setup_generic_prover_and_verifier(acir);

    console.log("Setting up Prover and Verifier done.");

    console.log("Creating proof...");

    const proof = await create_proof(prover, acir, circuitParams);

    console.log("Creating proof done.");

    const sc = verifier.SmartContract();

    console.log(sc);
    return { verifier, proof };
}

export async function verifyProof(verifier, proof) {

    console.log("Verifying Proof...");

    const verified = await verify_proof(verifier, proof);

    console.log("Verifying Proof done, Verified ", verified);

    return { verified };
}