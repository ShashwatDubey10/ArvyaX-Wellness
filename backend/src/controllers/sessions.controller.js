import Session from "../models/session.model.js";

export const getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select("title tags json_file_url user_id createdAt");

    res.json({ sessions });
  } catch (error) {
    console.error("Error in getPublicSessions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
