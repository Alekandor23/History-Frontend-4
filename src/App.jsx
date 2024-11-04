import { Routes, Route } from 'react-router-dom'

import Libro from './componente/Libro'
import Navbar from './inicio/Navbar'
import Home from './inicio/Home'
import Reproductor from './componente/Reproductor'
import Audiotex from './componente/Audiotex'
import Login from './inicio/Login'
import Registro from './inicio/Registro'
import { useState } from 'react'
import Resultados from './componente/Resultados'
import Filtros from './componente/Filtros'

const App = () => {

  //estado de la  reproduccion 
  const [isVisible, setIsVisible]=useState(false);
  const [txt, setTxt] = useState("");

  const mostrarReproductor=()=>{
    setIsVisible(true);
    
  }


  return (
    <div className='app'>
      
      <Navbar></Navbar>
      <div className='content'>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Libro/:id' element={<Libro onShowReproductor={mostrarReproductor}/>} />
          <Route path='/Libro/:id/Audiotex' element={<Audiotex setTxt={setTxt} />} />

          <Route path='/Libro/busqueda/resultados' element={<Resultados/>}/>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Registro' element={<Registro/>} />
          <Route path='/Libros/:filtro/:id_filtro' element={<Filtros/>}/>
          {/* <Route path='/libros/:id' element = {}></Route> */}
        </Routes>
      </div>
      {isVisible && <Reproductor onClose={()=>{setIsVisible(false)}} txt={txt} />}
      
    </div>
  );
};

export default App;
