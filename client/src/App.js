import './App.css';
import TestDS from './components/testDataset'; // Tests the createDataset endpoint
import TestTM from './components/testTraining'; // Tests the trainModel endpoint
import TestUL from './components/testUpload';
import TestM from './components/testModel';
import TestPay from './components/testPayment';

import { Routes, Route } from 'react-router-dom';

import Shop from './Shop';
import Login from './Login';
import Nav from './components/nav';

function App() {
    return (
        <>

            <div className='w-screen h-screen'>
                <div className='w-full h-5/6'>
                    <Routes>
                        <Route path="/" element={<Shop />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
                <div className='w-screen h-1/6'>
                    <Nav />
                </div>
            </div>

        </>
    );
}

export default App;
