"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainForm from "./components/MainForm";
import LoadingMainForm from "./components/LoadingMainForm";
import { fetchEmailData } from "./assets/petitions/fetchEmailData";
import { fetchTweet } from "./assets/petitions/fetchTweet";
import { fetchTYM } from "./assets/petitions/fetchTYM";
import { fetchMainContent } from "./assets/petitions/fetchMainContent";
import { fetchAllLeads } from "./assets/petitions/fetchLeads";
import { fetchConfig } from "./assets/petitions/fetchConfig";
import { fetchColors } from "./assets/petitions/fetchColors";
import { get } from "react-scroll/modules/mixins/scroller";
function Home() {
  const [configurations, setConfigurations] = useState({
    lenguage: "es",
    SearchBy: "state",
    sendMany: false,
    hasQuestions: false,
    region: "mx",
  });
  const [emailData, setEmailData] = useState({
    userName: "",
  });
  const [dataUser, setDataUser] = useState({});
  const [backendURLBase] = useState(`${process.env.NEXT_PUBLIC_URL}`);
  const [backendURLBaseServices] = useState(
    `${process.env.NEXT_PUBLIC_URL_SERVICES}`
  );
  const [clientId] = useState(`${process.env.NEXT_PUBLIC_CLIENT_ID}`|| '66f4866c9bef61674d4428c9' );
  const [id] = useState(`${process.env.NEXT_PUBLIC_CAMPAING_ID}`|| '673fdec9b1590b18f3f273bb' );
  const campaignType = 'PD'
  const [endpoints] = useState({
    toSendBatchEmails: "/email-batch/",
    toGetConfs: "/confs/",
    toGetRepresentativesPerStates: "/representatives-state/",
    toGetRepresentativesPerParty: "/representatives-party/",
    toGetAllRepresentatives: "/all-senators/",
    toGetRepresentativesByCp: "/find-mp-demo/",
    toGetMainData: "/main/",
    toGetThankYouMessage: "/typ-message/",
    toGetTweets: "/tweets/",
    toGetEmailMessage: "/email-message/",
    toSaveLeads: "/leads/",
    toSendEmails: "/email-builder/",
    toGetAllLeads: "/leads/",
    toGetColors: "/theme/",
  });
  const [mp, setMp] = useState([]);
  const [senator, setSenator] = useState([]);
  const [tweet, setTweet] = useState("");
  const [mainData, setMainData] = useState({});
  const [typData, setTypData] = useState({
    thankYouMessage: "Please enter a thank you message on the dashboard",
    secondThankYouMessage: "Please enter fill this field in the dashboard",
    repeatButtonTyp: "Please fill in this field on the dashboard",
  });
  const [loading, setLoading] = useState(true);
  const [allDataIn, setAllDataIn] = useState([]);
  const [colors, setColors] = useState({});
  const [formFields, setFormFields] = useState([]);
  useEffect(() => {
   const getInitialState = async (backendURLBase,id,clientId, campaignType) => { 
    const initialState = await fetchMainContent(backendURLBase,id,clientId, campaignType)
    const pageData = initialState.data[0]
    if(initialState.data.length > 0 ) {
      const{mainform, emailform, emailPreview} = pageData
      setMainData({mainform, emailform, emailPreview})
      setColors(pageData.style)
      setTypData(pageData.ty)
      setLoading(false)
    }
   }
   getInitialState(backendURLBase,id,clientId, campaignType)
  }, []);
  useEffect(() => {
    if (colors && Object.keys(colors).length !== 0) {
      // Verifica que colors no sea undefined y no esté vacío
      document.documentElement.style.setProperty(
        "--main-bg-color",
        colors.backgroundColor
      );
      document.documentElement.style.setProperty(
        "--main-texts-color",
        colors.text_color
      );
      document.documentElement.style.setProperty(
        "--main-inputs-bg-color",
        colors.inputBackgroundd
      );
      document.documentElement.style.setProperty(
        "--main-option-text-and-border-color",
        colors.input_text_color
      );
      document.documentElement.style.setProperty(
        "--links-checkbox-somebtns-color",
        colors.link_color
      );
      document.documentElement.style.setProperty(
        "--primary-btn-bg-color",
        colors.buttonA_color
      );
      document.documentElement.style.setProperty(
        "--primary-btn-font-color",
        colors.buttonA_text_color
      );
      document.documentElement.style.setProperty(
        "--back-btns-bg-color",
        colors.buttonB_color
      );
      document.documentElement.style.setProperty(
        "--back-btns-font-color",
        colors.buttonB_text_color
      );
    }
  }, [colors]);
  return (
    <>
      {loading && <LoadingMainForm cl={"spinner-container"} />}
      {!loading && (
        <MainForm
          configurations={configurations}
          setEmailData={setEmailData}
          emailData={emailData}
          dataUser={dataUser}
          setDataUser={setDataUser}
          mp={mp}
          setMp={setMp}
          senator={senator}
          setSenator={setSenator}
          clientId={clientId}
          endpoints={endpoints}
          tweet={tweet}
          typData={typData}
          mainData={mainData}
          formFields={formFields}
          backendURLBase={backendURLBase}
          backendURLBaseServices={backendURLBaseServices}
          allDataIn={allDataIn}
          setAllDataIn={setAllDataIn}
          colors={colors}
        />
      )}
    </>
  );
}
export default Home;
