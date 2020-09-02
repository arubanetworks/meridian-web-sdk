const ExampleWorker = require("./Example.worker").default;

const worker = new ExampleWorker();
console.log(worker);

worker.addEventListener("message", (event) => {
  console.log("message:", event.data);
});

worker.addEventListener("messageerror", (event) => {
  console.log("messageerror:", event);
});

worker.addEventListener("error", (event) => {
  console.log("error:", event);
});
