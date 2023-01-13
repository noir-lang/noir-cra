import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useForCtrlR } from './keys';
import { ToastContainer, toast, Flip } from 'react-toastify'
import noir_source from "./noir_source";
import { getValuesFromComments } from "./comment_values";
import NoirEditor from "./NoirEditor";
import { useRef, useState } from 'react';

import { compileNoirSource, createProof, verifyProof } from './compile_prove_verify';

function App() {

  const [compilationButtonDisabled, setCompilationButtonDisabled] = useState(false);

  const noirSource = useRef(noir_source);

  // async function proveButtonClicked() {
  //   getValuesFromComments(noirSource.current);
  // }
  async function proveButtonClicked() {

    if (compilationButtonDisabled) return;

    try {

      setCompilationButtonDisabled(true);

      const compiledSourcePromise = compileNoirSource(noirSource.current);

      const compiledSource = await toast.promise(compiledSourcePromise, {
        pending: 'Compiling Noir source...',
        success: 'Compilation Sucess 👌',
        error: 'Compilation failed 💀'
      });

      const circuitParams = getValuesFromComments(noirSource.current);;

      const createProofPromise = createProof(compiledSource, circuitParams);

      const { verifier, proof } = await toast.promise(createProofPromise, {
        pending: 'Creating proof...',
        success: 'Proof created 👌',
        error: 'Proof creation failed 💀'
      });


      const verifyProofPromise = verifyProof(verifier, proof);
      await toast.promise(verifyProofPromise, {
        pending: 'Verifing proof...',
        success: 'Proof verified 👌',
        error: 'Proof verification failed 💀'
      });

    } finally {
      setCompilationButtonDisabled(false);
    }

  }

  useForCtrlR(proveButtonClicked);

  return (
    <div className="monaco-editor">
      <div className="panel">
        <NoirEditor noirSource={noirSource} />
        <button className='prove-btn' disabled={compilationButtonDisabled} onClick={proveButtonClicked}>Prove</button>
        <ToastContainer
          position="bottom-right"
          theme="colored"
          autoClose={2500}
          transition={Flip}
          pauseOnFocusLoss={true}
        />
      </div>
    </div>
  );
}

export default App;
