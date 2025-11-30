alert("Allow to start the communiction")
let prompt = document.querySelector("#prompt")          // prompt work karta hai isse
let submitbtn = document.querySelector("#submit")      //submit work karte hai ise
let chatContainer = document.querySelector(".chat-container")  // button 
let imagebtn = document.querySelector("#image")  // image button work 
let image = document.querySelector("#image img")   
let imageinput = document.querySelector("#image input")

 // Gemini api (replace with your own)
 const Api_Url = "ADD_YOUR_API_URL_HERE"; // ← Replace with your API endpoint

 // user data defined null startind
 let user = {
     message: null,
     file: {
         mime_type: null,
         data: null
     }
 };

 // according to url generateResponse
 async function generateResponse(aiChatBox) {
     let text = aiChatBox.querySelector(".ai-chat-area");
     let RequestOption = {
         method: "POST",
         headers: {
             'Content-Type': 'application/json',
             // Replace the placeholder below with your own API key if required.
             // Example: 'X-goog-api-key': 'YOUR_API_KEY_HERE'
             'X-goog-api-key': 'ADD_YOUR_API_KEY_HERE'
         },
         body: JSON.stringify({
             "contents": [
                 {
                     "parts": [
                         { "text": user.message },
                         ...(user.file.data ? [{ "inline_data": user.file }] : [])
                     ]
                 }
             ]
         })
     };

     //  add to display to output for user
     try {
         let response = await fetch(Api_Url, RequestOption);
         let data = await response.json();

         // convet console to display output
         let apiResponse = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text
             ? data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
             : "No response from API.";
         text.innerHTML = apiResponse;
     } catch (error) {
         console.log(error);
         text.innerHTML = "Error: Unable to generate response.";
     } finally {
         chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
         image.src = `image.svg`;
         image.classList.remove("choose");
         user.file = {};
     }
 }



function createChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

// used to diplay user chat in frontend
function handlechatResponse(userMessage) {
    user.message = userMessage
    let html = `<img src="kTKo7BB8c.png" alt="" id="userImage" width="10%">
<div class="user-chat-area">
${user.message}
${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
    prompt.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

// smooth tarike se scroll karne ke liye 
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })

// used to diplay ai(chatbot reply) chat in frontend
    setTimeout(() => {
        let html = `<img src="robot-chatbot-generative-ai-free-png.webp" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
            <img src="loading.webp" alt="" class="load" width="50px">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)

    }, 600)

}

// enter button click and uploading
prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatResponse(prompt.value)

    }
})
// submit button work used this function
submitbtn.addEventListener("click", () => {
    handlechatResponse(prompt.value)
})
// add mic for ask question to chatbot....
// Mic button
let micBtn = document.querySelector("#mic");

// Web Speech API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Change to "hi-IN" for Hindi if needed
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
        recognition.start();
        micBtn.classList.add("listening"); // Optional: add CSS class for animation
    });

    recognition.onresult = (event) => {
        let spokenText = event.results[0][0].transcript;
        prompt.value = spokenText;
        handlechatResponse(spokenText);  // Send to chat
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Mic error: " + event.error);
    };

    recognition.onend = () => {
        micBtn.classList.remove("listening"); // Remove animation class
    };
} else { 
    micBtn.disabled = true;
    alert("Speech Recognition not supported in this browser.");
}

// image coming to computer 
imageinput.addEventListener("change", () => {
    const file = imageinput.files[0]
    if (!file) return
    let reader = new FileReader() //read image (image ko read karta hai)
    reader.onload = (e) => {
        // base 64 is convert to image to text  
        let base64string = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64string
        }
    
        // image is hold circle 
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }

    reader.readAsDataURL(file)
})


imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click()
})
