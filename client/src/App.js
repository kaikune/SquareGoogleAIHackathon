import './App.css';
import TestDS from './components/testDataset'; // Tests the createDataset endpoint
import TestTM from './components/testTraining'; // Tests the trainModel endpoint
import TestUL from './components/testUpload';
import TestM from './components/testModel';
import TestPay from './components/testPayment';

import Shop from './shop';
import Login from './login';

function App() {
    return (
        // Can get rid of test for actual development
        <div>
            <TestDS />
            <TestUL />
            <TestTM />
            <TestM />
            <TestPay />
        </div>
    );
}

export default App;
