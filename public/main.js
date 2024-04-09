const socket = io();

const clientTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("msgcontainer");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("client-total", (data) => {
  clientTotal.innerText = `Total Clients : ${data}`;
});

function sendMessage() {
  console.log("in sendmessage");
  console.log(messageInput.value);

  const data = {
    Name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  console.log(data);
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "flex items-end justify-end" : "flex items-end"
  }" >
  <div class="${
    isOwnMessage
      ? "bg-blue-500 rounded-lg p-3 max-w-md"
      : "bg-gray-200 rounded-lg p-3 max-w-md"
  }">
    <p class="text-sm"> ${data.message}</p>
    <span class="text-xs text-gray-500">26 aug 10:40</span>
  </div>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("input", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

// messageInput.addEventListener("keypress", (e) => {
//   socket.emit("feedback", {
//     feedback: `${nameInput.value} is typing...`,
//   });
// });

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = ` <li class="flex justify-center">
  <p id="feedback" class="text-sm text-gray-500">
    ${data.feedback}
  </p>
</li>`;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("p#feedback").forEach((ele) => {
    ele.parentNode.removeChild(ele);
  });
}
