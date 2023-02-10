import noir_wasm_package_json from "@noir-lang/noir_wasm/package.json";

const noir_source = `// Noir Compiler version: https://github.com/noir-lang/noir/tree/${noir_wasm_package_json.compiler.versionHash}
// Example React Application presenting Noir source compilation, 
// Proof creation and Proof verification using Create React App (https://create-react-app.dev).
// Below Noir source code is "Hello world" example in Noir.
//
// Use "Prove" Button below (or CTRL-P | CTRL-R key combinations) to compile, prove and verify.
//
// @value x = "4"
// @value y = "5"
fn main(x : Field, y : pub Field) {
  constrain x != y;
}`;

export default noir_source;