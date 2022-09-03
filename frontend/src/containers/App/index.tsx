import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from 'containers/HomePage/index';
import ProjectsPage from 'containers/ProjectsPage/index';
import AboutPage from 'containers/AboutPage/index';
import ArticlePage from 'containers/ArticlePage/index';
import DevPage from 'containers/DevPage/index';
import PogulumPage from 'containers/PogulumPage/index';
import TetrisPage from 'containers/TetrisPage';
import { StyledApp } from './App.styled';

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <StyledApp />
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />}/>
                <Route path='/projects' element={<ProjectsPage />}/>
                <Route path='/about' element={<AboutPage />}/>
                <Route path='/articles' element={<ArticlePage />}/>
                <Route path='/dev' element={<DevPage />}/>
                <Route path='/projects/pogulum' element={<PogulumPage />} />
                <Route path='/projects/tetris' element={<TetrisPage />} />
                <Route path='/projects/math' element={<DevPage />} />
            </Routes>
        </BrowserRouter>
    );    
}

export default App;