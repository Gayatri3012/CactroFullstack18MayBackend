exports.getComments = async (req, res) => {
  const videoId = req.params.videoId;
  const accessToken = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=20`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: 'Failed to fetch comments', error: errorData });
    }

    const data = await response.json();
    res.json(data.items); // send only the array of comment threads
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
