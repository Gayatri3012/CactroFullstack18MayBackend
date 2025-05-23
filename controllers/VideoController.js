const EventLog = require('../models/eventLog');

exports.videoDetails = async (req, res) => {
    const videoId = req.params.videoId;
    const apiKey = process.env.YOUTUBE_API_KEY; 
  
    // Construct the YouTube API URL dynamically
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=${videoId}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ message: 'Failed to fetch video data' });
      }
      const data = await response.json();
  
      if (data.items.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(data.items[0]);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
}

exports.updateVideoDetails = async (req, res) => {
    const videoId = req.params.videoId;
    const { title, description } = req.body;
    console.log(req.headers.authorization)
  
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
  
    const apiKey = process.env.YOUTUBE_API_KEY;
  
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${apiKey}`;
  
    const body = {
      id: videoId,
      snippet: {
        title,
        description,
        categoryId: "22",  
      },
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization, 
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: 'Failed to update video', error: errorData });
      }
  
      const data = await response.json();
  
      await EventLog.create({
        eventType: 'video_updated',
        description: `Video updated - Title: "${title}", Description: "${description}"`,
        videoId,
      });
  
      res.json({ message: 'Video updated successfully', video: data });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
}

