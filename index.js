const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
app.use(cors());

require("dotenv").config();

app.use(express.json());

const getToken = async (req, res) => {
  try {
    const { data } = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`
    );

    res.send(data);
  } catch (error) {
    console.log(error);
  }
};

const getVideo = async () => {
  try {
    const { data } = await axios.get(
      "https://api.twitch.tv/helix/videos?id=1663382590",
      {
        headers: {
          "Client-Id": process.env.CLIENT_ID,
          Authorization: process.env.TOKEN_INIT,
        },
      }
    );

    return { ...data, state: "offline" };
  } catch (error) {
    console.log(error);
  }
};

app.get("/", async (req, res) => {
  try {
    let videoData = {};
    const { data } = await axios.get(
      "https://api.twitch.tv/helix/streams?user_id=144903347",
      {
        headers: {
          "Client-Id": process.env.CLIENT_ID,
          Authorization: process.env.TOKEN_INIT,
        },
      }
    );

    if (data.data.length <= 0) {
      videoData = await getVideo();

      return res.send(videoData);
    }

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
