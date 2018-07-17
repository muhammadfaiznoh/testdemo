function PromptCCTV() {
    PromptModal("CCTV", null, null, "test.jpg", null, "20px", null);
}
function PromptVMS() {
    PromptModal("VMS", "Title", "Message", null, null, "20px", null);
}
function PromptPARKING() {
    PromptModal("PARKING", null, "Message", "test.jpg", null, null, "20px");
}
function PromptINCIDENT() {
    PromptModal("INCIDENT", "Title", "Message", "test.jpg", null, "20px", null);
}
function PromptTRAFFIC() {
    PromptModal("TRAFFIC", "Title", "Message", "test.jpg", null, "20px", null);
}
function PromptEVENT() {
    PromptModal("EVENT", "Title", "Message", "test.jpg", null, "20px", null);
}

function PromptModal(ModalType, Title, Message, ImageUrl, VideoUrl, TitleTextSize, MessageTextSize) {
    var vParent = document.getElementById("divMessageModal");
    vParent.innerHTML = "";
    vParent.setAttribute("style", "position:absolute;width:100%;height:100%;top:0px;left:0px;,z-index:5;display:none;background-color: rgba(0,0,0,0.7)");
    vParent.addEventListener("click", function() {
        vParent.style.display = "none";
    });
    var vContent = document.createElement("div");
    vContent.setAttribute("style", "margin:0 auto;margin-top:50px;width:80%;background-color:white");
    switch(ModalType) {
        case "CCTV":
            var vImage = document.createElement("img");
            vImage.setAttribute("style", "width:100%")
            vImage.src = ImageUrl;
            vContent.appendChild(vImage);
            break;
        case "VMS":
            var vTitle = document.createElement("div");
            vTitle.setAttribute("style", "width:100%;text-align:center;font-size:" + TitleTextSize);
            var vTitleText = document.createTextNode(Title);
            var vMessage = document.createElement("div");
            vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
            var vMessageText = document.createTextNode(Message);
            vMessage.appendChild(vMessageText);
            vTitle.appendChild(vTitleText);
            vContent.appendChild(vTitle);
            vContent.appendChild(vMessage);
            
            break;
        case "PARKING":
            var vImage = document.createElement("img");
            vImage.setAttribute("style", "width:100%")
            vImage.src = ImageUrl;
            var vMessage = document.createElement("div");
            vMessage.setAttribute("style", "width:100%;text-align:center;font-size:" + MessageTextSize);
            var vMessageText = document.createTextNode(Message);
            vMessage.appendChild(vMessageText);

            vContent.appendChild(vImage);
            vContent.appendChild(vMessage);
            break;
        case "INCIDENT":
            var vImage = document.createElement("img");
            vImage.setAttribute("style", "width:100%")
            vImage.src = ImageUrl;
            var vMessage = document.createElement("div");
            vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
            var vMessageText = document.createTextNode(Message);
            vMessage.appendChild(vMessageText);
            vContent.appendChild(vImage);
            vContent.appendChild(vMessage);
            break;
        case "TRAFFIC":
            var vTitle = document.createElement("div");
            vTitle.setAttribute("style", "width:100%;text-align:center;font-size:" + TitleTextSize);
            var vTitleText = document.createTextNode(Title);
            var vImage = document.createElement("img");
            vImage.setAttribute("style", "width:100%")
            vImage.src = ImageUrl;
            var vMessage = document.createElement("div");
            vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
            var vMessageText = document.createTextNode(Message);
            vMessage.appendChild(vMessageText);
            vTitle.appendChild(vTitleText);
            vContent.appendChild(vTitle);
            vContent.appendChild(vImage);
            vContent.appendChild(vMessage);
            break;
        case "EVENT":
            var vTitle = document.createElement("div");
            vTitle.setAttribute("style", "width:100%;text-align:center;font-size:" + TitleTextSize);
            var vTitleText = document.createTextNode(Title);
            var vMessage = document.createElement("div");
            vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
            var vMessageText = document.createTextNode(Message);
            vMessage.appendChild(vMessageText);
            vTitle.appendChild(vTitleText);
            vContent.appendChild(vTitle);
            vContent.appendChild(vMessage);
            break;
    }
    vParent.appendChild(vContent);
    vParent.style.display = "block";
}