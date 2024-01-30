import fs from "fs/promises";
import PocketBase from "pocketbase";
import "cross-fetch/dist/node-polyfill.js";
import { RateLimit } from "async-sema";

const limit = RateLimit(10);

const pb = new PocketBase("http://localhost:8090");

const transferToPocketbase = async () => {
  const readedFile = await fs.readFile("./words.txt", "utf-8");
  const words = readedFile.split("\n");

  words.forEach(async (word) => {
    await limit();
    await pb.collection("words").create(
      {
        word,
        language: "id",
      },
      { $autoCancel: false }
    );
  });

  // await pb.collection("words").create({
  //   word: readedFile.split("\n")[0],
  //   language: "id",
  // });
  // await pb.collection("words").create({
  //   word: readedFile.split("\n")[2],
  //   language: "id",
  // });
};

transferToPocketbase();
