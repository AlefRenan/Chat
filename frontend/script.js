// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login_form");
const loginInput = login.querySelector(".login_input");

//chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat_form");
const chatInput = chat.querySelector(".chat_input");
const chatMsg = chat.querySelector(".chat_messages");

const user = { id: "", name: "", color: "" };

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

let ws;

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};
const handleLogin = (e) => {
  e.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  ws = new WebSocket("wss://chat-backend-h3zm.onrender.com");
  ws.onmessage = processMessage;
};
const createMsgSelf = (content) => {
  const div = document.createElement("div");
  div.classList.add("message_self");
  div.innerHTML = content;
  return div;
};
const createMsgOther = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  div.classList.add("message_other");
  span.classList.add("message_sender");
  span.style.color = senderColor;

  div.appendChild(span);
  span.innerHTML = sender;
  div.innerHTML += content;
  return div;
};
const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId == user.id
      ? createMsgSelf(content)
      : createMsgOther(content, userName, userColor);
  chatMsg.appendChild(message);

  scrollScreen();
};

const handleSend = (e) => {
  e.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };
  ws.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);

chatForm.addEventListener("submit", handleSend);
