import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import Jiotv from "../models/JioTVModel.mjs";
import fs from 'fs';

const db = new JsonDB(new Config("channel.db", true, false, "/"));

export async function setCookie(id, cookie, masterUrl, masterM3u8) {
  try {
    let uri = masterUrl.split("?");
    let data = {
      url: uri[0],
      slug: uri[1],
      mainUrl: masterUrl,
      cookie,
      genrateTime: Date.now(),
      m3u8: masterM3u8,
    };
    await db.push("/channel/" + id, data);
    
    // Update the data in the Jiotv model
    let channelData = {};
    const jiotvChannelDB = await Jiotv.findOne({ key: "channels.db" }).exec();
    if (jiotvChannelDB) {
      channelData = JSON.parse(jiotvChannelDB.value);
      channelData[id] = data;
      jiotvChannelDB.value = JSON.stringify(channelData);
      await jiotvChannelDB.save();
    }
    else {
      channelData[id] = data;
      const jiotvChannel = new Jiotv({
        key: "channels.db",
        value: JSON.stringify(channelData),
      });
      await jiotvChannel.save();
    }
    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Error saving data",
    };
  }
}


export async function getCookie(id) {
  try {
    // Retrieve data from the Jiotv model in MongoDB
    const jiotvData = await Jiotv.findOne({ key: "channels.db" }).exec();
    
    if (!jiotvData || !jiotvData.value) {
      return {
        success: false,
        data: "No data found",
      };
    }
    
    const channelData = JSON.parse(jiotvData.value);
    
    if (channelData[id] !== undefined) {
      const validTime = 60 * 60 * 20 * 1000;
      if (Date.now() - new Date(channelData[id]["genrateTime"]) > validTime) {
        return {
          success: false,
          data: "cookie expire",
        };
      }
    } else {
      return {
        success: false,
        data: "undefined",
      };
    }
    
    const cookie = channelData[id]["cookie"] || "undefined";
    return {
      success: true,
      data: cookie,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Error retrieving data",
    };
  }
}


export async function getUrl(id) {
  try {
    // Retrieve data from the Jiotv model in MongoDB
    const jiotvData = await Jiotv.findOne({ key: "channels.db" }).exec();
    
    if (!jiotvData || !jiotvData.value) {
      return {
        success: false,
        data: "No data found",
      };
    }
    
    const channelData = JSON.parse(jiotvData.value);
    if (channelData[id] !== undefined) {
      let url = channelData[id]["url"] || "undefined";
      return {
        success: url != "undefined",
        data: url,
      };
    } else {
      return {
        success: false,
        data: "undefined",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Error retrieving data",
    };
  }
}

export async function getM3u8(id) {
  try {
    // Retrieve data from the Jiotv model in MongoDB
    const jiotvData = await Jiotv.findOne({ key: "channels.db" }).exec();
    
    if (!jiotvData || !jiotvData.value) {
      return {
        success: false,
        data: "No data found",
      };
    }
    
    const channelData = JSON.parse(jiotvData.value);
    if (channelData[id] !== undefined) {
      let velidTime = 60 * 60 * 20 * 1000;
      if (Date.now() - new Date(channelData[id]["genrateTime"]) > velidTime) {
        return {
          success: false,
          data: "cookie expire",
        };
      }
    } else {
      return {
        success: false,
        data: "undefined",
      };
    }
    let m3u8 = channelData[id]["m3u8"] || "undefined";
      return {
        success: m3u8 != "undefined",
        data: m3u8,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: "Error retrieving data",
      };
    }
}

export async function getAll(id) {
  try {
    // Retrieve data from the Jiotv model in MongoDB
    const jiotvData = await Jiotv.findOne({ key: "channels.db" }).exec();
    
    if (!jiotvData || !jiotvData.value) {
      return {
        success: false,
        data: "No data found",
      };
    }
    
    const channelData = JSON.parse(jiotvData.value);
    if (channelData[id] !== undefined) {
        if (id == "all") {
          return channelData;
        } else {
          return channelData[id] || "undefined";
        }
    } else {
      return {
        success: false,
        data: "undefined",
      }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Error retrieving data",
    };
  }
}

export default {
  setCookie,
  getCookie,
  getUrl,
  getM3u8,
  getAll,
};
