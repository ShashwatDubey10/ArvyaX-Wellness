import Session from "../models/session.model.js";

export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ user_id: userId }).sort({
      updatedAt: -1,
    });
    res.json({ sessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({ message: "Server error fetching your sessions" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id || id === "undefined" || id === "new" || id.length !== 24) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findOne({ _id: id, user_id: userId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json({ session });
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    res.status(500).json({ message: "Server error fetching the session" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id || id === "undefined" || id === "new" || id.length !== 24) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const deleted = await Session.findOneAndDelete({
      _id: id,
      user_id: userId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Session not found or not authorized" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Server error deleting session" });
  }
};

export const saveDraftSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, title, tags, json_file_url } = req.body;

    let session;
    if (id) {
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: userId },
        { title, tags, json_file_url, status: "draft" },
        { new: true, runValidators: true }
      );
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
    } else {
      session = new Session({
        user_id: userId,
        title,
        tags,
        json_file_url,
        status: "draft",
      });
      await session.save();
    }

    res.json({ message: "Draft saved successfully", session });
  } catch (error) {
    console.error("Error saving draft session:", error);
    res.status(500).json({ message: "Server error saving draft" });
  }
};

export const publishSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, title, tags, json_file_url } = req.body;

    if (!id || id === "undefined" || id === "new" || id.length !== 24) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findOneAndUpdate(
      { _id: id, user_id: userId },
      { title, tags, json_file_url, status: "published" },
      { new: true, runValidators: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session published successfully", session });
  } catch (error) {
    console.error("Error publishing session:", error);
    res.status(500).json({ message: "Server error publishing session" });
  }
};
