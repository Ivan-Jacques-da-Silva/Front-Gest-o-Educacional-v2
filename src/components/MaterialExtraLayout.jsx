import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
  Modal,
} from "react-bootstrap";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
import { MdPlayCircle } from "react-icons/md";
import { FaFilePdf, FaDownload, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "./config";
// import "./materialExtra.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function MaterialExtra() {
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [categories, setCategories] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [userType, setUserType] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [permitirDownload, setPermitirDownload] = useState(false);



  const getUserType = () => {
    const userType = localStorage.getItem("userType");
    return userType ? parseInt(userType, 10) : null;
  };

  useEffect(() => {
    const userType = getUserType();
    setUserType(userType);
  }, []);

  const handleViewPDF = (url) => {
    setPdfUrl(url);
    setShowPDF(true);
  };

  // const handleOpenVideo = (url) => {
  //   setVideoUrl(url);
  //   setShowVideo(true);
  // };

  const handleOpenVideo = (url) => {
    const videoUrlNormalizado = normalizarUrlYoutube(url);
    setVideoUrl(videoUrlNormalizado);
    setShowVideo(true);
  };


  const handleClose = () => {
    setShowPDF(false);
    setShowVideo(false);
  };

  const handleDownload = async (pdfUrls) => {
    setIsDownloading(true);
    let successCount = 0;

    try {
      for (let pdfUrl of pdfUrls) {
        if (pdfUrl) {
          const relativePath = pdfUrl.replace(API_BASE_URL, '');
          window.open(`${API_BASE_URL}/proxy-download?url=${encodeURIComponent(relativePath)}`, '_blank');
          successCount++;
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} arquivo(s) baixado(s) com sucesso!`);
      } else {
        toast.error("Nenhum arquivo foi baixado.");
      }
    } catch (error) {
      console.error("Erro ao baixar arquivos:", error);
      toast.error("Erro ao baixar os arquivos.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/material-extra/${id}`);
      fetchMaterials();
    } catch (error) {
      console.error("Erro ao excluir material:", error);
    }
  };


  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/material-extra`);
      setMaterials(response.data);
      setFilteredMaterials(response.data);
    } catch (error) {
      console.error("Erro ao buscar materiais", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleThumbnailChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnail(event.target.files[0]);
    }
  };

  const handlePdfChange = (event, index) => {
    const newPdfs = [...pdfs];
    newPdfs[index] = event.target.files[0];
    setPdfs(newPdfs);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append("thumbnail", thumbnail);
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("date", date);
  //   formData.append("youtube_url", youtubeUrl);
  //   formData.append("categories", categories);
  //   pdfs.forEach((pdf, index) => {
  //     formData.append(`pdf${index + 1}`, pdf);
  //   });

  //   try {
  //     await axios.post(`${API_BASE_URL}/material-extra`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     fetchMaterials();
  //     applyFilter();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("youtube_url", youtubeUrl);
    formData.append("categories", categories);
    formData.append("permitirDownload", permitirDownload ? 1 : 0);
    pdfs.forEach((pdf, index) => {
      formData.append(`pdf${index + 1}`, pdf);
    });

    try {
      await axios.post(`${API_BASE_URL}/material-extra`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMaterials();
      applyFilter();
    } catch (error) {
      console.error(error);
    }
  };



  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const applyFilter = () => {
    let filtered = materials;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((material) =>
        selectedCategories.some((category) =>
          material.cp_mat_extra_categories
            .split(",")
            .map((cat) => cat.trim())
            .includes(category)
        )
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((material) =>
        material.cp_mat_extra_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      const selectedDate = new Date(filterDate).toISOString().split("T")[0];
      filtered = filtered.filter((material) => {
        const materialDate = new Date(material.cp_mat_extra_date)
          .toISOString()
          .split("T")[0];
        return materialDate === selectedDate;
      });
    }

    setFilteredMaterials(filtered);
  };

  const normalizarUrlYoutube = (url) => {
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Container fluid>
      <ToastContainer />

      <Row>
        <Col xs={12} md={3} className="border-end p-3">
          <h5 className="text-center fw-bold mt-3">Filtrar</h5>
          <Form>
            <Card className="mb-3 shadow-sm h-100 p-0 radius-12">
              <Card.Header className="border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <h6 className="mb-0">Categorias</h6>
              </Card.Header>
              <Card.Body>
                <div className="category-list">
                  <Form.Group className="mb-3">
                    {Array.from(
                      new Set(
                        materials.flatMap((material) =>
                          material.cp_mat_extra_categories
                            .split(",")
                            .map((cat) => cat.trim())
                        )
                      )
                    ).map((category, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={category}
                        name={category}
                        onChange={handleCategoryChange}
                        checked={selectedCategories.includes(category)}
                        className="mb-2"
                      />
                    ))}
                  </Form.Group>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Header className=" text-white">
                <h6 className="mb-0">Pesquisar por Nome</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Header className=" text-white">
                <h6 className="mb-0">Filtrar por Data</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="rounded"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={applyFilter} className="mt-3 w-100">
                Aplicar Filtro
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                  setSelectedCategories([]);
                  setFilteredMaterials(materials);
                }}
                className="mt-1 w-100"
              >
                Limpar Filtros
              </Button>
            </div>
          </Form>
        </Col>


        <Col xs={12} md={9}>
          <Card className="my-3">
            {userType === 1 && (
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <Form.Group controlId="formThumbnail">
                        <Form.Label>Thumbnail</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={handleThumbnailChange}
                        />
                        {thumbnail && (
                          <Image
                            src={URL.createObjectURL(thumbnail)}
                            rounded
                            className="mt-3"
                            style={{
                              width: "100%",
                              height: "auto",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Digite o título"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formDescription" className="mt-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Digite a descrição"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formDate" className="mt-3">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formYoutubeUrl" className="mt-3">
                        <Form.Label>URL do YouTube</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Digite a URL do YouTube"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formPdf1">
                        <Form.Label>Anexar PDF</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => handlePdfChange(e, 0)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPdf2" className="mt-3">
                        <Form.Label>Anexar PDF</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => handlePdfChange(e, 1)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPdf3" className="mt-3">
                        <Form.Label>Anexar PDF</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={(e) => handlePdfChange(e, 2)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCategories" className="mt-3">
                        <Form.Label>Categorias</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Digite as categorias separadas por vírgula"
                          value={categories}
                          onChange={(e) => setCategories(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPermitirDownload" className="mt-3">
                        <Form.Label>Permitir Download</Form.Label>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label="Permitir"
                          checked={permitirDownload}
                          onChange={(e) => setPermitirDownload(e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 float-end"
                  >
                    Cadastrar Material
                  </Button>
                </Form>
              </Card.Body>
            )}
          </Card>

          <Col>
            {/* <h5 style={{ fontWeight: "bold" }}>Materiais</h5>{" "} */}
            {filteredMaterials.map((material, index) => (
              <Card className="my-3" key={index}>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      {material.cp_mat_extra_thumbnail && (
                        <div
                          className="image-container"
                          onClick={() =>
                            handleOpenVideo(material.cp_mat_extra_youtube_url)
                          }
                        >
                          <Image
                            src={material.cp_mat_extra_thumbnail}
                            rounded
                            style={{
                              width: "100%",
                              height: "auto",
                              cursor: "pointer",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                            }}
                          />
                          <MdPlayCircle className="play-icon" />
                        </div>
                      )}
                    </Col>
                    <Col md={4}>
                      <h5>{material.cp_mat_extra_title}</h5>
                      <p>{material.cp_mat_extra_description}</p>
                      <p>{formatDateString(material.cp_mat_extra_date)}</p>
                    </Col>
                    <Col md={4}>
                      <h6 style={{ fontWeight: "bold" }}>Categorias</h6>
                      <p>
                        {material.cp_mat_extra_categories
                          .split(",")
                          .map((cat, index) => (
                            <span key={index} className="badge bg-secondary me-1">
                              {cat.trim()}
                            </span>
                          ))}
                      </p>

                      {/* Exibir até 3 PDFs */}
                      {material.cp_mat_extra_pdf1 && (
                        <p>
                          <Button
                            variant="link"
                            onClick={() => handleViewPDF(material.cp_mat_extra_pdf1)}
                          >
                            <FaFilePdf /> PDF 1
                          </Button>
                        </p>
                      )}

                      {material.cp_mat_extra_pdf2 && (
                        <p>
                          <Button
                            variant="link"
                            onClick={() => handleViewPDF(material.cp_mat_extra_pdf2)}
                          >
                            <FaFilePdf /> PDF 2
                          </Button>
                        </p>
                      )}

                      {material.cp_mat_extra_pdf3 && (
                        <p>
                          <Button
                            variant="link"
                            onClick={() => handleViewPDF(material.cp_mat_extra_pdf3)}
                          >
                            <FaFilePdf /> PDF 3
                          </Button>
                        </p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Col>
      </Row>
      <Modal
        style={{ zIndex: "1050" }}
        show={showPDF}
        onHide={handleClose}
        centered
        fullscreen
        dialogClassName="modal-90w"
        className="custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true&zoom=100`}
            width="100%"
            className="custom-modal-iframe"
            style={{ border: "none" }}
            title="PDF Viewer"
          />
        </Modal.Body>
      </Modal>

      <Modal
        className="modal-video-conteudo"
        show={showVideo}
        style={{ zIndex: "1050" }}
        onHide={handleClose}
        centered
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar Vídeo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center d-flex w-100 justify-content-center">
          <iframe
            width="100%"
            height="80vh"
            className="custom-modal-video"
            src={videoUrl.replace("watch?v=", "embed/")}
            frameBorder="0"
            allowFullScreen
            title="YouTube Video"
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MaterialExtra;
