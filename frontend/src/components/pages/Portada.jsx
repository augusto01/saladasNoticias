import React from 'react'
import NewsList from '../NewsList.jsx';
import Aside from '../Aside.jsx';

import '../../styles/Portada.css';

const Portada = () => {
  return (
    
      <div className="row">
        <div className="col-md-9">
          <NewsList />
        </div>
        <div className="col-md-3">
          <Aside />
        </div>
      </div>
   
  )
}

export default Portada