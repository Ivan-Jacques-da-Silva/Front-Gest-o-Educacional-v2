import React from "react";
import MasterLayout from "../masterLayout/MasterLayout.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import CadastroAudio from "../components/CadastroAudio.jsx";



const PaginaCadastroAudio = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Cadastro" />

        {/* FormPageLayer */}
        {/* <FormPageLayer /> */}
        <CadastroAudio />

      </MasterLayout>

    </>
  );
};

export default PaginaCadastroAudio;
