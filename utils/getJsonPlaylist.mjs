import fetch from "node-fetch";
import fs from "fs";
import Jiotv from "../models/JioTVModel.mjs";

export default async function genPlaylist() {
  try {
    let file;
    const options = {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    };

    const jiotvDocument = await Jiotv.findOne({ key: 'channels.jiotv' }).exec();
    if (jiotvDocument) {
      file = JSON.parse(jiotvDocument.value);
    } else {
      let req = await fetch(
        "https://jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone",
        options
      );
      let response = JSON.parse(await req.text());
      response["genrateDate"] = new Date().getTime();
      file = response;
      //fs["writeFileSync"]("./channels.jiotv", JSON.stringify(response));
      const jiotvChannel = new Jiotv({
        key: "channels.jiotv",
        value: JSON.stringify(response),
      });
      await jiotvChannel.save();
    }
    if (new Date().getTime() - file["genrateDate"] > 21600000) {
      // 6 hours
      let req = await fetch(
        "https://jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone",
        options
      );
      let response = JSON.parse(await req.text());
      response["genrateDate"] = new Date().getTime();
      //fs["writeFileSync"]("./channels.jiotv", JSON.stringify(response));
      const jiotvChannel = new Jiotv({
        key: "channels.jiotv",
        value: JSON.stringify(response),
      });
      await jiotvChannel.save();
    }
    return file;
  } catch (error) {
    console.error(error);
    return "";
  }
}
