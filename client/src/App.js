import './App.css';
import TestDS from './components/testDataset'; // Tests the createDataset endpoint
import TestTM from './components/testTraining'; // Tests the trainModel endpoint
import TestUL from './components/testUpload';

import Shop from './shop';

function App() {
    return (
        // Can get rid of test for actual development
        <div>
            <TestDS />
            <TestUL />
            <TestTM />
        </div>
    );
}

export default App;
