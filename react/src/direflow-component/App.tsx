


/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import React, { FC, useEffect, useState } from "react";
import { logger } from "./sdk";
import axios from 'axios';
import qs from 'qs';
import { Buttons } from "./buttons";
import { Service } from "@wxcc-desktop/sdk-types";
import { Desktop } from "@wxcc-desktop/sdk";
interface IProps {
  isDarkMode: boolean;
}

const App: FC<IProps> = (props) => {

  const componentVersion = "2.1";
  const SERVICE_HOME = "check-readme-file";



  const [darkMode, setDarkMode] = useState(true);
  const [ani, setAni] = useState("");
  const [interactionId, setInteractionId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [assignedContacts, setAssignedContacts] = useState(
    [] as {
      interaction: Service.Aqm.Contact.Interaction;
    }[]
  );
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  function getCustomerId(ani: string): void {
    let customerAni = ani;
    let mediaPrefix = "";
    if (ani.indexOf("@") === -1) {
      if (ani.length >= 15) {
        mediaPrefix = "psid";
      } else {
        mediaPrefix = "ani";
        if (ani.charAt(0) === '+') {
          customerAni = ani.substring(1);
        }
      }
    } else {
      mediaPrefix = "email";
    }
    const url = `https://${SERVICE_HOME}/getuserdata?${mediaPrefix}=${customerAni}`;
    logger.debug(`URL for getCustomer: ${url}`);
    axios.get(url)
      .then((result) => {
        if(result){
          setCustomerId(result.data['username']);
        } else {
          logger.error(`There is no customer ID for ani: ${ani}`);
        }
      })
      .catch((err) => { 
        logger.error(err);
      });
  }

  function getLastInteractionId(username: string): void {
    console.log(username);
    const url = `https://${SERVICE_HOME}/history?username=${username}`;
    axios.get(url)
      .then((result) => {
        if(result.data){
          logger.info(`Found history for customer: ${username}`);
          let historyData = [];
          historyData = result.data;
          let lastInteractionEvent = {
            id: "",
            timestamp: "",
            parent: "",
            level: 1,
            channel: "",
            source: "",
            note: "",
            link: ""
        };
        lastInteractionEvent = historyData[historyData.length - 1];
        if(lastInteractionEvent.parent) {
          setInteractionId(lastInteractionEvent.parent);
        }
        else
        {
          setInteractionId(lastInteractionEvent.id);
        }
      } else {
        logger.info(`There is no customer history for customer: ${username}`);
      }
    })
    .catch((err) => { 
      logger.error(err);
    });
  }

  async function getAssignedContacts() {
    const taskMap = await Desktop.actions.getTaskMap();
    
    const myAssignedContacts = Array.from(taskMap?.values() || []);
    setAssignedContacts(myAssignedContacts);
  }

  async function init() {
    await Desktop.config.init();
    getAssignedContacts();
  }

  useEffect(() => {
    logger.info(`Fulfillment Tasks component version: ${componentVersion}`);
    init();
  }, []);

  useEffect(() => {
    logger.debug(`isDarkMode=${props.isDarkMode}`);
    setDarkMode(props.isDarkMode);
  }, [props.isDarkMode]);

  useEffect(() => {
    if(ani){
      logger.debug(`ani=${ani}`);
      getCustomerId(ani);
    } 
  }, [ani]);
  
  useEffect(() => {
    if(customerId){
      getLastInteractionId(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    if(assignedContacts && 
      assignedContacts[0] && 
      assignedContacts[0].interaction &&
      assignedContacts[0].interaction.callAssociatedData &&
      assignedContacts[0].interaction.callAssociatedData.ani
      ){
      setAni(assignedContacts[0].interaction.callAssociatedData.ani.value);
    }
  }, [assignedContacts]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {
    logger.debug(`darkMode is set to ${darkMode}`);
  }, [showBanner]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function postCustomerHistoryEvent(description: string, username: string, interactionId: string) {
    logger.info(`Posting History event for: ${username}, ${description}, interactionId: ${interactionId}`);
    const url = `https://${SERVICE_HOME}/history`;
    const request = {
      "level": 1,
      "channel": "voice",
      "source": "agent",
      "note": description,
      "link": "",
      "parent": interactionId,
      "username": username
    };
    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      }
    };
    await axios.post(url, qs.stringify(request), config);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function invokeTask(description: string, webHookURL: string) {
    logger.info(`Agent invoking task: ${description}, url: ${webHookURL}`);
    setBannerMessage(`Fulfillment Task ${description} has been executed`);
    setShowBanner(true);
    await postCustomerHistoryEvent(description,customerId,interactionId);
    await axios.post(webHookURL,
      { 
        preferredChannel: 'sms',
        msisdn: ani,
        username: customerId,
        eventParent: interactionId
      }
    );
  }

  function hideBanner(){
    setShowBanner(false);
  }
  return (
    <div style={ darkMode ? { background: '#121212',  padding: "24px"} : { background: '#FCFCFC',  padding: "24px"}}>
      <div >
      <table>
        <tbody>
          {Buttons.map( button => {
            if(button.active) {
              return(        
                <tr key={Buttons.indexOf(button)} >
                  <td style={{ padding: "12px" }}>      
                      <md-button
                        color='blue'
                        onClick={() => invokeTask(button.name, button.url)}
                        >{button.name}
                      </md-button>
                  </td>
                </tr>
              )
            } else {
              return(        
                <tr key={Buttons.indexOf(button)} >
                  <td style={{ padding: "12px" }}>      
                      <md-button
                        color='blue'
                        >{button.name}
                      </md-button>
                  </td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
      {showBanner ? 
      <md-alert-banner 
        type="warning"
        show={showBanner}
        closable
        onClick={hideBanner} >
          {bannerMessage}
          </md-alert-banner>  : null }
      </div>
    </div>
  );
};

export default App;
