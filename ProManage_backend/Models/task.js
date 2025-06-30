const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
  checked: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },
    assignPerson: {
      type: String,
    },
    taskSection: {
      type: String,
      enum: ["todo", "in progress", "backlog", "completed"],
      default: "todo",
    },
    dueDate: {
      type: Date,
    },
    checklists: [checklistItemSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareableLink: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Task", taskSchema);
