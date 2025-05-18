const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const EventLog = require('./models/eventLog'); 

// Routes
const videoRoutes = require("./routes/video");
const commentRoutes = require("./routes/comments");
const noteRoutes = require('./routes/notes');


app.use("/video", videoRoutes); 
app.use("/comment", commentRoutes); 
app.use("/note", noteRoutes); 

app.use('/event', async (req, res) => {
    try {
      const { type, videoId, description } = req.body;
  
  
      const event = await EventLog.create({
        eventType: type,
        videoId,
        description,
        timestamp: new Date(),
      });
  
      res.status(201).json({ message: 'Event logged', event });
    } catch (error) {
      console.error('Error logging event:', error);
      res.status(500).json({ message: 'Failed to log event' });
    }
  });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
