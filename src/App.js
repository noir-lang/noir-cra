import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useForCtrlR } from './keys';
import { ToastContainer, toast, Flip } from 'react-toastify'
// import noir_source from "./noir_source";
import { getValuesFromComments } from "./comment_values";
import NoirEditor from "./NoirEditor";
import { useRef, useState, useEffect } from 'react';

import { compileNoirSource, createProof, verifyProof } from './compile_prove_verify';

function App() {

  const [compilationButtonDisabled, setCompilationButtonDisabled] = useState(false);
  const [sourceContent, _setSourceContent] = useState(false);

  const main_nr_SourceURL = new URL('../circuits/main.nr', import.meta.url);

  const noirSource = useRef("// Loading source...");

  const setSourceContent = (content) => {
    noirSource.current = content;
    _setSourceContent(content);

  };

  useEffect(() => {
    if (!sourceContent) {
      fetch(main_nr_SourceURL)
        .then(response => response.text())
        .then(sourceData => {
          setSourceContent(sourceData);
        });
    }
  })


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
        success: {
          render({ data }) {
            return `Proof ${data.verified ? "verified 👌" : "NOT verified ❌"}`
          },
        },
        error: 'Proof verification failed 💀'
      });

    } finally {
      setCompilationButtonDisabled(false);
      console.log("====================================================");
    }

  }

  useForCtrlR(proveButtonClicked);

  if (!sourceContent) return (<div className="monaco-editor">Loading source...</div>);

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
          pauseOnHover={true}
        />
      </div>

    </div>
  );
}

export default App;
