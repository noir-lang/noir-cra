const noir_source = `// Example React Application presenting Noir source compilation, 
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