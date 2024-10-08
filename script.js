const puppeteer = require("puppeteer");

exports.searchYouTube = async (searchQuery) => {
  // Launch the browser
  try
  {
  const browser = await puppeteer.launch({
    headless: true,  // Make sure headless mode is enabled
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
  });
  const page = await browser.newPage();

  // Navigate to YouTube
  await page.goto("https://www.youtube.com/");

  // Enter the search query and submit
  await page.type("input#search", searchQuery + "#music #songs");
  await page.click("button#search-icon-legacy");
  await page.waitForSelector("ytd-video-renderer", { timeout: 10000 }); // Wait for videos to be rendered

  // Extract video details
  const results = await page.evaluate(() => {
    const videoElements = document.querySelectorAll("ytd-video-renderer");
    const videos = [];
    // var id = +count;
    var id = 0;
    videoElements.forEach((video) => {
      const titleElement = video.querySelector("#video-title");
      // const thumbnailElement = video.querySelector("yt-image img");
      const durationElement = video.querySelector("div.badge-shape-wiz__text");

      const title = titleElement ? titleElement.innerText.trim() : "No title";
      const youTubeUrl = titleElement ? titleElement.href : "No URL";
      const urlObj = new URL(youTubeUrl);
      const params = new URLSearchParams(urlObj.search);
      const musicId = params.get("v");

      const musicUrl = `https://www.youtube.com/embed/${musicId}?autoplay=0&vq=large&controls=0&mute=0`;

      const thumbnailUrl = `https://img.youtube.com/vi/${musicId}/hqdefault.jpg`;

      const durration = durationElement
        ? durationElement.innerText.trim()
        : "No duration";

      const musicYouTubeId = musicId;

      id += 1;
      videos.push({
       "title": title,
      "musicUrl": musicUrl,
       "thumbnailUrl": thumbnailUrl,
      "durration" :  durration,
       "id" : id,
       "musicYouTubeId" : musicYouTubeId,
      });
    });
    return videos.slice(0, 15); // Return the top 15 results
  });

  // Print the top 5 videos
  // results.forEach((ele) => {
  //   console.log("title : ", ele.title);
  //   console.log("musicUrl : ", ele.musicUrl);
  //   console.log("thumbnailUrl : ", ele.thumbnailUrl);
  //   console.log("durration : ", ele.durration);
  //   console.log("id : ", ele.id);
  //   console.log("musicYouTubeId : ", ele.musicYouTubeId);
  //   console.log("\n");
  // });

  await browser.close();

  return results;
  }

  catch(err)
  { 
    return err
  }
};

// Example usage:
// searchYouTube("kesariya");
