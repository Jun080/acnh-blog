import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderMenu from "./components/layout/Header";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateArticle from "./pages/CreateArticle";

function App() {
    return (
        <Router>
            <div className="App">
                <HeaderMenu />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/articles/new" element={<CreateArticle />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
