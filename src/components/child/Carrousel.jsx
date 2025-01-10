import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
// import frase from './../../../public/assets/images/welcome PORTAL.png';
import frase from './../../img/welcome PORTAL.png';


const Carrousel = () => {
    return (
        <div className="col-xxl-12 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <h6 className="text-lg mb-0">Novidades</h6>

                    </div>
                    <div className="d-flex flex-wrap align-items-center mt-8 justify-content-center">
                        {/* <img md={12} style={{ margin: "20px", width: "90%" }}  className="" /> */}
                        <img src={frase} style={{maxHeight:"35vh"}} alt="ImagemInicio"
                            className=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrousel;