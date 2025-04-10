import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

const MealSchema = new mongoose.Schema({
  breakfast: [MenuItemSchema],
  lunch: [MenuItemSchema],
  snacks: [MenuItemSchema],
  dinner: [MenuItemSchema],
});

const MenuSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  meals: {
    type: MealSchema,
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
