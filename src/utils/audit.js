const AuditLog = require('../models/AuditLog');

// Fire-and-forget audit logger — never blocks or fails the main request.
const logAudit = async ({ company, user, module, action, recordId, summary }) => {
  try {
    await AuditLog.create({
      company,
      user: user?._id,
      userName: user?.name,
      module,
      action,
      recordId,
      summary,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[AuditLog] Failed to write entry:', err.message);
  }
};

module.exports = { logAudit };
