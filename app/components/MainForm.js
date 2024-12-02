"use client";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/cjs/Button";
import Alert from "react-bootstrap/Alert";
import List from "./List";
import ListSelect from "./ListSelect";
import ManualEmailForm from "./ManualEmailForm";
import ThankYou from "./ThankYou";
import { animateScroll as scroll } from "react-scroll";
import { fetchRepresentatives } from "../assets/petitions/fetchRepresentatives";
import { fetchLeads } from "../assets/petitions/fetchLeads";
import LoadingMainForm from "./LoadingMainForm";
const MainForm = ({
  dataUser,
  setDataUser,
  mp,
  setMp,
  setEmailData,
  emailData,
  clientId,
  states,
  tweet,
  typData,
  mainData,
  backendURLBase,
  endpoints,
  backendURLBaseServices,
  senator,
  setSenator,
  allDataIn,
  setAllDataIn,
  colors,
  formFields,
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [showLoadSpin, setShowLoadSpin] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [tac, setTac] = useState(false);
  const [emails, setEmails] = useState([]);
  const [many, setMany] = useState(false);
  const title = mainData.mainform?.title?.text;
  const instructions = mainData.mainform?.instructions?.text;
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  const renderMainFormSection= (title, instructions,mainData,error)=> {
    const handleTerms = (e) => {
      if (e.target.checked === true) {
        setTac(true);
      } else {
        setTac(false);
      }
    };

    const handleChange = (e) => {
      e.preventDefault();
      setDataUser({
        ...dataUser,
        [e.target.name]: e.target.value,
      });
    };
    const isValidEmail = (email) => {
      if (!email) {
        return false;
      }
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email.trim());
    };
    const click = async (e) => {
      e.preventDefault();
      console.log(dataUser, "dataUser");
      if (
        !isValidEmail(dataUser.emailUser) ||
        tac === false ||
        Object.getOwnPropertyNames(dataUser).length === 0 ||
        dataUser.userName === undefined ||
        dataUser.emailUser === undefined
      ) {
        setError(true);
        return;
      }
      setValidated(true);
      setError(false);
      fetchRepresentatives(
        clientId,
        dataUser.postcode,
        setMp,
        setSenator,
        setShowLoadSpin
      ).catch((error) => console.log("error", error));
      setActiveSection('listSection')
      scroll.scrollToBottom();
      fetchLeads(
        true,
        backendURLBase,
        endpoints,
        clientId,
        dataUser,
        emailData,
        "NA",
        "basic-data-user"
      );
    };
    return(
      <div className={"container container-content"}>
      {error ? (
        <Alert variant={"danger"}>
          Please fill all fields. Also, please make sure there are no spaces
          before of after your email or postcode.
        </Alert>
      ) : null}
      <Form
        name="fm-find"
        onSubmit={click}
        noValidate
        validated={validated}
      >
        <div className="instructions-container">
          <h3 className="main-texts-color main-text-title">{title}</h3>
          <p className="main-texts-color main-text-instruction">
            {instructions}
          </p>
        </div>
        {/* <h3 className="find-her-mp-text main-texts-color">{mainData.firstFormLabel1}</h3> */}
        <div className="fields-form">
          {mainData.mainform?.mainFormInputs?.map((field, key) => {
            return field.text !== "state" ? (
              <Form.Group className="field" key={key}>
                <Form.Label
                  className="select-label main-texts-color labels-text-format"
                  htmlFor={`emailInput-mainForm${key}`}
                >
                  {field.text}*
                </Form.Label>
                <Form.Control
                  id={`emailInput-mainForm${key}`}
                  type={"text"}
                  placeholder={field.placeholder}
                  name={
                    field.text === "name"
                      ? "userName"
                      : field.text === "email"
                      ? "emailUser"
                      : field.text
                  }
                  onChange={handleChange}
                  className="input-color main-form-inputs"
                  required
                />
              </Form.Group>
            ) : states.length > 0 ? (
              <Form.Group className={"field"} key={key}>
                <Form.Label className="select-label">
                  {field.text}*
                </Form.Label>
                <Form.Select
                  aria-label="DefaulValue"
                  required
                  name={field.text}
                  id="stateSelect-mainForm"
                  onChange={handleChange}
                >
                  <option key={"vacio"} value={""}>
                    {field.placeholder}
                  </option>
                  {states.sort().map((estate) => (
                    <option key={estate} value={estate}>
                      {estate}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <Form.Group className="field" key={key}>
                <Form.Label className="select-label">
                  {field.label}*
                </Form.Label>
                <Form.Control
                  id="emailInput-mainForm"
                  type={field.text}
                  placeholder={field.placeholder}
                  name={field.text}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            );
          })}
        </div>
        <Form.Group
          style={{ textAlign: "justify" }}
          className="field select-styles-form terms-and-cond-input"
          controlId="conditions"
        >
          <Form.Check
            name="conditions"
            onClick={handleTerms}
            className="links-checkboxes-color terms-and-cond-input"
            // bsPrefix="custom-checkbox"
            required
            label={
              <a
                target={"_blank"}
                className="links-checkboxes-color"
                rel={"noreferrer"}
                href={mainData.tac}
              >
                Terms and Conditions
              </a>
            }
          />
        </Form.Group>
        <Form.Group className="main-find-btn-container">
          <Button
            id="findButton-mainForm"
            type={"submit"}
            variant={"dark"}
            size={"lg"}
            onClick={click}
            className={"u-full-width capitalize-style find-btn-main-form"}
          >
            Continue
          </Button>
        </Form.Group>
        {showLoadSpin ? loading("spinner-containerB") : null}
      </Form>
    </div>
    )
  }
  const renderListSection = (mainData,senator,mp)=>{
    const selectAll = (e) => {
      fetchLeads(
        true,
        backendURLBase,
        endpoints,
        clientId,
        dataUser,
        emailData,
        "NA",
        "checkbox-list-email-preference-lead"
      );
      setMany(true);
      setEmails([...mp, ...senator]);
      setActiveSection('listSelect')
      e.preventDefault();
    };
    const back = (e) => {
      e.preventDefault;
      setActiveSection('mainform')
    };
    return( 
        <div className={"container-content senators-container"}>
        <h3 className="main-texts-color instruction-text">
          Select your representatives
        </h3>
        <div className="note-container">
          <span
            className="link-simulation links-checkboxes-color change-mode-list-btn"
            onClick={selectAll}
          >
            Email / all several representatives
          </span>
          <p>{mainData.note}</p>
        </div>
        <div className="list-container">
          <h5 className="representative-position">Senators</h5>
          <div className="representatives-container">
            {senator && senator.length > 0 ? (
              senator.map((mps, index) => (
                <List
                  setMany={setMany}
                  emailData={emailData}
                  setEmailData={setEmailData}
                  dataUser={dataUser}
                  mps={mps}
                  clientId={clientId}
                  key={index}
                  tweet={tweet}
                  colors={colors}
                  backendURLBase={backendURLBase}
                  endpoints={endpoints}
                  setActiveSection={setActiveSection}
                />
              ))
            ) : (
              <Alert variant="danger">
                No representatives have been found with the state that has
                provided us
              </Alert>
            )}
          </div>
        </div>
        <div className="list-container">
          <h5 className="representative-position">MP`S</h5>
          <div className="representatives-container">
            {mp && mp.length > 0 ? (
              mp.map((mps, index) => (
                <List
                  setMany={setMany}
                  emailData={emailData}
                  setEmailData={setEmailData}
                  dataUser={dataUser}
                  mps={mps}
                  clientId={clientId}
                  key={index}
                  tweet={tweet}
                  colors={colors}
                  backendURLBase={backendURLBase}
                  endpoints={endpoints}
                  setActiveSection={setActiveSection}
                />
              ))
            ) : (
              <Alert variant="danger">
                No representatives have been found with the state that has
                provided us
              </Alert>
            )}
          </div>
        </div>
        <Button className="back-button" onClick={back}>
          Back
        </Button>
        </div>
    )
  }
  const renderListSelectSection = (mainData,senator,mp) =>{
  return(    
  <div className={"container-content senators-container"}>
  <h2 className="main-texts-color instruction-text">
    Select all representatives you’d like to email
  </h2>
  <div className="representatives-container">
    {mp.length > 0 ? (
      <ListSelect
        setError={setError}
        setValidated={setValidated}
        emails={emails}
        tac={tac}
        emailData={emailData}
        setEmailData={setEmailData}
        dataUser={dataUser}
        clientId={clientId}
        setAllDataIn={setAllDataIn}
        backendURLBase={backendURLBase}
        endpoints={endpoints}
        setActiveSection={setActiveSection}
      />
    ) : (
      <Alert variant="danger">
        No representatives have been found with the state that has
        provided us
      </Alert>
    )}
  </div>
  </div>)
  }
  const renderSection = () => {
    switch (activeSection) {
      case 'mainForm':
        return renderMainFormSection(title,instructions,mainData)
      case 'listSection':
        return renderListSection(mainData,senator,mp) ;
      case 'listSelect':
        return renderListSelectSection(mainData,senator,mp)  
      case 'emailform':
        return <ManualEmailForm
        many={many}
        dataUser={dataUser}
        emailData={emailData}
        setEmailData={setEmailData}
        setDataUser={setDataUser}
        clientId={clientId}
        endpoints={endpoints}
        backendURLBase={backendURLBase}
        backendURLBaseServices={backendURLBaseServices}
        mainData={mainData}
        allDataIn={allDataIn}
        setActiveSection={setActiveSection}
      />;
      case 'ty':
        return <ThankYou
        emailData={emailData}
        setDataUser={setDataUser}
        setEmailData={setEmailData}
        clientId={clientId}
        typData={typData}
        colors={colors}
        setActiveSection={setActiveSection}
      />;
  default: 
  return renderMainFormSection(title,instructions,mainData)
    }
  };
  console.log(mainData);
  if (!mainData) return "loading datos";
  if (!mp) return "loading datos";
  return (
    <div className={"contenedor main-form-flex-container"}>
      <div className={"form-container"}>
        {renderSection()}
      </div>
    </div>
    
  );
};
export default MainForm;
