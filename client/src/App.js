import './App.css';
import TestDS from './components/testDataset'; // Tests the createDataset endpoint
import TestTM from './components/testTraining'; // Tests the trainModel endpoint
import TestUL from './components/testUpload';
import TestM from './components/testModel';
import TestPay from './components/testPayment';

import { Routes, Route } from 'react-router-dom';

import Shop from './shop';
import Home from './home';
import Login from './login';
import Create from './create';
import Items from './items';
import Nav from './components/nav';

import StoreProfile from './storeprofile';

function App() {
    return (
        <>
            <div className="w-screen h-screen">
                {
                    StoreProfile.getDatasetId() == "" || StoreProfile.getDatasetId() == null ? (
                        <>
                        
                            <div className="w-full h-full">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/create" element={<Create />} />
                                </Routes>
                            </div>
                        
                        </>
                    ) : (
                        <>
                            <div className="w-full h-5/6">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/shop" element={<Shop />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/create" element={<Create />} />
                                    <Route path="/items" element={<Items />} />
                                </Routes>
                            </div>
                            <div className="w-screen h-1/6">
                                <Nav />
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}

export default App;
