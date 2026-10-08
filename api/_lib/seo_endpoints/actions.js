/**
 * api/_lib/seo_endpoints/actions.js — User Approval, Apply & Revert Handler API
 */

const ActionManager = require("../seo/ActionManager");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { action, post_id, post_slug, diff_data, change_id, applied_by } = req.body || {};

  if (!action || !["apply", "revert"].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Supported actions: 'apply', 'revert'." });
  }

  const actionManager = new ActionManager();

  try {
    if (action === "apply") {
      if (!post_id || !diff_data) {
        return res.status(400).json({ error: "post_id and diff_data are required to apply optimization." });
      }

      const result = await actionManager.applyOptimization({
        post_id,
        post_slug,
        diff_data,
        applied_by: applied_by || "user_manual_approval",
      });

      return res.status(200).json(result);
    }

    if (action === "revert") {
      if (!change_id) {
        return res.status(400).json({ error: "change_id is required to revert a change." });
      }

      const result = await actionManager.revertChange(change_id);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("[SeoActions API] Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
