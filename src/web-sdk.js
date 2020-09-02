import PlacemarkCullingWorker from "./PlacemarkCulling.worker";

const worker = new PlacemarkCullingWorker();

worker.addEventListener("message", event => {
  console.log("from worker:", event.data);
});

console.log(worker);
