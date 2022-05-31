
---
# WxCC Custom Widget: Fulfillment Tasks


## Introduction

Out of box WxCC Desktop currently offers trigering filfilment tasks, but only for digital interactions. Trigering other processes for voice interactions requires custom widget, and this is an example of how that might be done. Initiation of business action is also written into customer history, while backend processes should continue writing history events and that way allow the agent visibility into external asyncronous process execution. Please check rich customer history component as well, for more details.

<img src="./README-resources/WidgetScreenshoot.png" width="950"  />
In this example, the agent can initiate business relevant actions during customer interaction of any type, with a simple click on the button.

<img src="./README-resources/WidgetScreenshoot.png" width="950"  />
After click, a visual indication that action is initiated is show to the agent.

In this version of the component, the buttons must be defined in the file, and the widget must be rebuilt and published for the particular set of buttons, per demo or production requirements. Here we would refer as parent events those on the main timeline, while events we get with expansion of parent nodes we refer as children events.

### Buttons Definition

In this version of the component, the buttons must be defined in the file, and the widget must be rebuilt and published for the particular set of buttons, per demo or production requirements. The file contains an array of button definitions, with folowing JSON code:

```
    {
        name: "Name of the task to be shown on the button", 
        url: "URL of the fullfilment task webhook, typically created in IMI, but not limited to",
        active: false or true, in case you want to have some "fake" buttons, with no webhook defined
    }
```

## Building & publishing the widget

Best way to start would be to review documentation: https://developer.webex-cx.com/documentation/guides/desktop and learn about building Custom Widgets.

1. The very first step would be to clone this repository: https://github.com/CiscoDevNet/webex-contact-center-widget-starter .

2. Replace all files in started widget repository with those provided in this repository and rename the root directory to “fulfillment-tasks
”.

3. Edit buttons.tsx per your desired purpose.

4. Follow instructions from starter widget README file to build the component.

5. Once build, the component should be deployed on public URL.


## Desktop Layout Configuration 

You can copy the code below into your desktop layout, into "area"->"panel"->"children" list.

```
        {
          "comp": "md-tab",
          "attributes": { "slot": "tab", "class": "widget-pane-tab" },
          "children": [
            { "comp": "md-icon", "attributes": { "name": "icon-recents_16" } },
            { "comp": "span", "textContent": "Customer History" }
          ]
        },
        {
          "comp": "md-tab-panel",
          "attributes": { "slot": "panel", "class": "widget-pane" },
          "children": [            {
            "comp": "customer-history",
            "script":"https://ciscoemearwxcccustomwidgents.s3.eu-central-1.amazonaws.com/customer-history/2.2/customer-history.js",
            "properties": {
              "isDarkMode": "$STORE.app.darkMode"
            }
          }]
        }, 
```


## How To Report Errors and Propose Improvements

Please contact Darko Zlatic (dzlatic@cisco.com).

