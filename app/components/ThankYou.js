import React, { useState, useEffect } from "react";
import Share from "./Share";

const ThankYou = ({
  typData,
  colors,
  setActiveSection
}) => {
  const click = (e) => {
    e.preventDefault();
    setActiveSection('mainform')
  };
  console.log(typData)
  return (
    <div  className={"container typ-container"}>      
        <div className="typ-content">
          <h3 className="typ-message">
            {typData.tymessage
              ? typData.tymessage?.text
              : 'Thankyou Message'}
          </h3>
          <h5 className="second-typ-message">
          {typData.tymessage
              ? typData.tymessage2?.text
              : 'Thankyou Message 2'}
          </h5>
          
          <h5 className="share-text">
          {typData.tymessage
              ? typData.shareText?.text
              : 'Share text'}
          </h5>
          <Share
            shareUrl={typData.shareUrl.text}
            shareMessage={typData.shareMessage.text}
            colors={colors}
          />
          <span
            id="repeatButton-typView"
            onClick={click}
            className="capitalize-style link-simulation do-again-btn"
          >
            Contact More Politicians!
          </span>
        </div>
    </div>
  );
};

export default ThankYou;