const lib_std_URLs = {
    "array.nr": new URL('../circuits/lib/std/array.nr', import.meta.url),
    "ecdsa_secp256k1.nr": new URL('../circuits/lib/std/ecdsa_secp256k1.nr', import.meta.url),
    "field.nr": new URL('../circuits/lib/std/field.nr', import.meta.url),
    "hash.nr": new URL('../circuits/lib/std/hash.nr', import.meta.url),
    "lib.nr": new URL('../circuits/lib/std/lib.nr', import.meta.url),
    "merkle.nr": new URL('../circuits/lib/std/merkle.nr', import.meta.url),
    "scalar_mul.nr": new URL('../circuits/lib/std/scalar_mul.nr', import.meta.url),
    "schnorr.nr": new URL('../circuits/lib/std/schnorr.nr', import.meta.url),
    "sha256.nr": new URL('../circuits/lib/std/sha256.nr', import.meta.url),
    "sha512.nr": new URL('../circuits/lib/std/sha512.nr', import.meta.url),
};

// For now this serves as an example of loading library.
// Note `dep::std` is going to be embeded and loading `std` this way is not going to be necessary. 
async function fetchLib() {

    const std_lib_prefix = "std";

    const pathSourcePairs = await Promise.all(Object.keys(lib_std_URLs).map((currentSourceURLkey) => {
        return fetch(lib_std_URLs[currentSourceURLkey])
            .then(response => response.text())
            .then(sourceContent => {
                return [std_lib_prefix + "/" + currentSourceURLkey, sourceContent];
            });
    }));

    return Object.fromEntries(pathSourcePairs);

}

export default fetchLib;