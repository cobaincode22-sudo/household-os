import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/household_os';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB on Hostinger VPS'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- Schemas & Models ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: String,
  defaultHouseholdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
  deviceTokens: [String],
}, { timestamps: true });

const HouseholdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  currency: { type: String, default: 'IDR' },
  timezone: { type: String, default: 'Asia/Jakarta' },
  locale: { type: String, default: 'id-ID' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode: { type: String, unique: true },
}, { timestamps: true });

const MemberSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { 
    type: String, 
    enum: ['OWNER', 'ADMIN', 'ADULT', 'TEEN', 'CHILD', 'GUEST'], 
    default: 'ADULT' 
  },
  nickname: String,
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true, index: true },
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'TODO' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  category: String,
  dueDate: Date,
  recurrence: String,
  estimatedCost: Number,
  actualCost: Number,
  completedAt: Date,
}, { timestamps: true });

const TimelineSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true, index: true },
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  summary: String,
  actorName: String,
  amount: Number,
  refId: String,
  refCollection: String,
  occurredAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);
export const Household = mongoose.model('Household', HouseholdSchema);
export const Member = mongoose.model('Member', MemberSchema);
export const Task = mongoose.model('Task', TaskSchema);
export const Timeline = mongoose.model('Timeline', TimelineSchema);

// --- API Endpoints ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Household OS API', timestamp: new Date() });
});

// Household Dashboard Data Aggregator Endpoint
app.get('/api/households/:id/dashboard', async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findById(id);
    const tasks = await Task.find({ householdId: id }).limit(10).sort({ dueDate: 1 });
    const timeline = await Timeline.find({ householdId: id }).limit(10).sort({ occurredAt: -1 });

    res.json({
      household,
      tasks,
      timeline,
      stats: {
        pendingTasksCount: tasks.filter(t => t.status !== 'COMPLETED').length,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Household OS API listening on port ${PORT}`);
});
