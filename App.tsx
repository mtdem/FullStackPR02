import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import BlockIcon from '@mui/icons-material/Block';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTask,
  updateTask,
  deleteTask,
  Task,
  TaskState,
} from './features/tasks/tasksSlice';
import type { RootState } from './app/store';

// components
interface UpdateDialogProps {
  task: Task;
}

function ActionField({ task }: UpdateDialogProps) {
  const [updateTaskDesc, setUpdateTaskDesc] = React.useState(task.description);
  const [descError, setDescError] = React.useState(false);
  const [updateTaskDeadline, setUpdateTaskDeadline] = React.useState<string>(
    task.deadline
  );
  const [updateTaskPrty, setUpdateTaskPrty] = React.useState(task.priority);

  const [open, setOpen] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  const hasUpdate = task.action.indexOf('update') !== -1;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitClose = () => {
    if (updateTaskDesc === '') {
      setDescError(true);
    }
    const newTask: Task = {
      title: task.title,
      description: updateTaskDesc,
      deadline: updateTaskDeadline,
      priority: updateTaskPrty,
      isComplete: task.isComplete,
      action: task.action,
    };
    dispatch(updateTask(newTask));
    setOpen(false);
  };

  const handleDeadlineChange = (newValue: Dayjs | null) => {
    if (newValue.isAfter(dayjs().add(1, 'day'))) {
      setUpdateTaskDeadline(newValue.toJSON());
    } else {
      console.log('invalid deadline');
    }
  };

  if (hasUpdate) {
    return (
      <Stack spacing={1}>
        <Button startIcon={<EditOutlinedIcon />} onClick={handleClickOpen}>
          Update
        </Button>
        {/* Update Dialog Form */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <IconButton>
              <EditOutlinedIcon />
            </IconButton>
            Edit Task
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                autoFocus
                margin="normal"
                id="description"
                label="Description"
                type="text"
                variant="standard"
                value={updateTaskDesc}
                onChange={(e) => {
                  setUpdateTaskDesc(e.target.value);
                  setDescError(false);
                }}
                required
                error={descError}
                helperText={descError ? 'required' : ''}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Deadline"
                  inputFormat="MM/DD/YYYY"
                  value={dayjs(updateTaskDeadline)}
                  onChange={handleDeadlineChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <FormControl>
                <FormLabel id="priority-label">Priority</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="priority-label"
                  name="row-radio-buttons-group"
                  defaultValue={updateTaskPrty}
                  value={updateTaskPrty}
                  onChange={(e) => setUpdateTaskPrty(e.target.value)}
                >
                  <FormControlLabel
                    value="low"
                    control={<Radio />}
                    label="Low"
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio />}
                    label="Medium"
                  />
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label="High"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={handleSubmitClose}
            >
              Update
            </Button>
            <Button startIcon={<BlockIcon />} onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          startIcon={<HighlightOffRoundedIcon />}
          onClick={(e) => dispatch(deleteTask(task))}
        >
          Delete
        </Button>
      </Stack>
    );
  } else
    return (
      <Stack spacing={1}>
        <Button
          startIcon={<HighlightOffRoundedIcon />}
          onClick={(e) => dispatch(deleteTask(task))}
        >
          Delete
        </Button>
      </Stack>
    );
}

export default function App() {
  // Dialog States
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  // new task states
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [deadline, setDeadline] = React.useState<string>(
    dayjs().add(1, 'day').toJSON()
  );
  const [priority, setPriority] = React.useState('low');

  const [titleError, setTitleError] = React.useState(true);
  const [descError, setDescError] = React.useState(true);

  // redux state management
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  // Snackbar (toaster)
  const [snackbar, setSnackbar] = React.useState(false);

  // form dialog functions
  const resetInputs = () => {
    setTitle('');
    setDesc('');
    setDeadline(dayjs());
    setPriority('low');
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    resetInputs();
    setOpenDialog(false);
  };

  const handleSubmitCloseDialog = () => {
    if (title.length > 0 && desc.length > 0) {
      const newTask: Task = {
        title: title,
        description: desc,
        deadline: deadline,
        priority: priority,
        isComplete: false,
        action: ['update', 'delete'],
      };
      dispatch(addTask(newTask));
      resetInputs();
      setOpenDialog(false);
      setSnackbar(true);
      setTimeout(() => {
        setSnackbar(false); // set the open state to false after 2 seconds
      }, 2000);
    }
    if (title === '') {
      setTitleError(true);
    }
    if (desc === '') {
      setDescError(true);
    }
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(false);
  };

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // need alert for deadline
  const handleDeadlineChange = (newValue: Dayjs | null) => {
    if (newValue.isAfter(dayjs().add(1, 'day'))) {
      setDeadline(newValue.toJSON());
    } else {
      // do something
    }
  };

  // Rendering
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* navbar menu */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Header Content */}
          <div style={{ flexGrow: 1 }} />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FRAMEWORKS
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddCircleRoundedIcon />}
            onClick={handleClickOpenDialog}
          >
            Add
          </Button>

          {/* Add Form Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              <IconButton>
                <AddCircleRoundedIcon />
              </IconButton>
              Add Task
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  autoFocus
                  margin="normal"
                  id="title"
                  label="Title"
                  type="text"
                  variant="standard"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(false);
                  }}
                  sx={{ gap: 2 }}
                  required
                  error={titleError}
                  helperText={titleError ? 'required' : ''}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  id="description"
                  label="Description"
                  type="text"
                  variant="standard"
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                    setDescError(false);
                  }}
                  required
                  error={descError}
                  helperText={descError ? 'required' : ''}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Deadline"
                    inputFormat="MM/DD/YYYY"
                    value={dayjs(deadline)}
                    onChange={handleDeadlineChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <FormControl>
                  <FormLabel id="priority-label">Priority</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="priority-label"
                    name="row-radio-buttons-group"
                    defaultValue={priority}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <FormControlLabel
                      value="low"
                      control={<Radio />}
                      label="Low"
                    />
                    <FormControlLabel
                      value="medium"
                      control={<Radio />}
                      label="Medium"
                    />
                    <FormControlLabel
                      value="high"
                      control={<Radio />}
                      label="High"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<AddCircleRoundedIcon />}
                onClick={handleSubmitCloseDialog}
              >
                Add
              </Button>
              <Button startIcon={<BlockIcon />} onClick={handleCloseDialog}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
      {/* Table Data */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Deadline</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">IsComplete</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {task.title}
                </TableCell>
                <TableCell align="right">{task.description}</TableCell>
                <TableCell align="right">
                  {dayjs(task.deadline).format('MM/DD/YYYY').toString()}
                </TableCell>
                <TableCell align="right">{task.priority}</TableCell>
                <TableCell align="right">
                  <Checkbox
                    checked={task.isComplete}
                    onChange={(e) => {
                      var newTask: Task = {
                        title: task.title,
                        description: task.description,
                        deadline: task.deadline,
                        priority: task.priority,
                        isComplete: task.isComplete,
                        action: task.action,
                      };
                      newTask.isComplete = !task.isComplete;
                      if (newTask.isComplete) {
                        newTask.action = ['delete'];
                      } else {
                        newTask.action = ['update', 'delete'];
                      }
                      dispatch(updateTask(newTask));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <ActionField task={task} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* snackbar success view */}
      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        message="Successfully added"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Task successfully added!
        </Alert>
      </Snackbar>
    </Box>
  );
}

interface ReusableDialogProps {
  task: Task;
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
}

const defaultTask: Task = {
  title: '',
  description: '',
  deadline: dayjs().add(1, 'day').toJSON(),
  priority: 'low',
  isComplete: false,
  action: ['update', 'delete'],
};
