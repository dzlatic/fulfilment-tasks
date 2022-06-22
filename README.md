
---
# WxCC Custom Widget: Fulfillment Tasks


## Introduction

Out of box WxCC Desktop currently offers triggering fulfilment tasks, but only for digital interactions. Triggering other processes for voice interactions requires custom widget, and this is an example of how that might be done. Initiation of business action is also written into customer history, while backend processes should continue writing history events and that way allow the agent visibility into external asynchronous process execution. Please check [rich customer history](https://github.com/dzlatic/rich-customer-history) component as well, for more details.

<img src="./README-resources/WidgetScreenShoot1.png" width="950"  />

In this example, the agent can initiate business relevant actions during customer interaction of any type, with a simple click on the button.

<img src="./README-resources/WidgetScreenShoot2.png" width="950"  />

After click, a visual indication that action is initiated is show to the agent.

In this version of the component, the buttons must be defined in the file, and the widget must be rebuilt and published for the set of buttons, per demo or production requirements. 

### Buttons Definition

In this version of the component, the buttons must be defined in the file, and the widget must be rebuilt and published for the buttons, per demo or production requirements. The [buttons.tsx](react/src/direflow-component/buttons.tsx) file contains an array of button definitions, with following JSON code:

```
    {
        name: string valie, name of the task to be shown on the button", 
        url: string value, URL of the fulfillment task webhook, typically created in IMI, but not limited to,
        active: boolean, false or true, in case you want to have some "fake" buttons, with no webhook defined
    }
```

Please keep in mind that your webhook URL will be supplied with following parameters in JSON body:

```
      { 
        preferredChannel: string value that you can use as selector in your flow, currently hardcoded to 'sms'
        msisdn: this is a string value of ANI parameter from current desktop interaction - keep in mind that parameter could have a different nature for different digital channels
        username: string value, a unique customer identifier in your CJaaS database. Please refer to rich customer history widget for more details.
        eventParent: string value of last parent event ID in customer history, so that you can attach child events in your webhook flow, if you want to.
      }
```

## Building & publishing the widget

Best way to start would be to review documentation: https://developer.webex-cx.com/documentation/guides/desktop and learn about building Custom Widgets.

1. The very first step would be to clone this repository: https://github.com/CiscoDevNet/webex-contact-center-widget-starter .

2. Rename the folder to something like "fulfillment-tasks-XYZ" or what ever you find good for you.

3. Replace all files in starter widget repository react folder with those provided in THIS repository. The best would be to do it one file by one so that you don't loose any of the files or folders you got from original startes repository.

4. Edit "buttons.tsx" per your desired purpose.

5. In [Asp.tsx](./react/src/direflow-component/App.tsx) file, in line 19 change version number to "something else". 

6. Change value "SERVICE_HOME" in line 20 of the same file to valid value - see [this README.md file](https://github.com/dzlatic/rich-customer-history) for more info.

7. Run **yarn** command in the folder you renamed in step 2.

8. Run **yarn** command in **/react** subfolder, and then in the same folder run **yarn build** command. This will generate **/build** folder under **/react**. Use the same "something else" value from step 5 to rename **/build** directory to. This is the folder you would be publishing in next step.

9. Once build, the component should be deployed on public URL, [AWS](https://aws.amazon.com/getting-started/hands-on/host-static-website/), [Google Cloud](https://cloud.google.com/storage/docs/hosting-static-website), [Microsoft Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-host), [IBM Bluemix](https://www.ibm.com/cloud/blog/deploying-static-web-sites?mhsrc=ibmsearch_a&mhq=deploy%20static%20web%20page), [Heroku](https://gist.github.com/wh1tney/2ad13aa5fbdd83f6a489), [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-static-website-to-the-cloud-with-digitalocean-app-platform) or any other option of your choice...


## Desktop Layout Configuration 

You can copy the code below into your desktop layout, into "area"->"panel"->"children" list.

**Please keep in mind that you need to replace PATH_TO_YOUR_COMPONENT_BULD_ON_PUBLIC_WEB with the path you would got in step 5. above.**

```
        {
          "comp": "md-tab",
          "attributes": { "slot": "tab", "class": "widget-pane-tab" },
          "children": [
            { "comp": "md-icon", "attributes": { "name": "icon-recents_16" } },
            { "comp": "span", "textContent": "Tasks" }
          ]
        },
        {
          "comp": "md-tab-panel",
          "attributes": { "slot": "panel", "class": "widget-pane" },
          "children": [            {
            "comp": "tasks-fulfillment",
            "script":<PATH_TO_YOUR_COMPONENT_BULD_ON_PUBLIC_WEB>,
            "properties": {
              "isDarkMode": "$STORE.app.darkMode"
            }
          }
```

## How To Report Errors and Propose Improvements

Please contact Darko Zlatic (dzlatic@cisco.com).

