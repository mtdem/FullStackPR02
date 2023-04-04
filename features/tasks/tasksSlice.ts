import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// data types
export interface Task {
  title: string;
  description: string;
  deadline: string;
  priority: string;
  isComplete: boolean;
  action: string[]; // null, delete only, or update and delete
}

export interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const newTask = action.payload;
      const canBeAdded = !state.tasks.some(
        (task: Task) => task.title === newTask.title
      );

      if (canBeAdded) {
        state.tasks.push(newTask);
      } else {
        console.log('duplicate object');
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const updateTask = action.payload;
      const index = state.tasks.findIndex(
        (task: Task) => task.title === updateTask.title
      );
      state.tasks[index] = updateTask;
    },
    deleteTask: (state, action: PayloadAction<Task>) => {
      const deleteTask = action.payload;
      const index = state.tasks.findIndex(
        (task: Task) => task.title === deleteTask.title
      );
      state.tasks.splice(index, 1);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
