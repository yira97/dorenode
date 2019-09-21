import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import ConsoleTab from './components/ConsoleTab'
import MindNodeTab from './components/MindNodeTab'
import { GraphManager } from './graph'

const gm = new GraphManager()

let messageSeq = 1

const App: React.FC = () => {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-8">
          <MindNodeTab />
        </div>
        <div className="col-4">
          <ConsoleTab doExec={cmd => {
            const [info, res] = gm.Exec(cmd)
            messageSeq += 1
            return [messageSeq, res, info]
          }} />
        </div>
      </div>
    </div>
  );
}

export default App;
