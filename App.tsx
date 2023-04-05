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

const defaultTask: Task = {
  title: '',
  description: '',
  deadline: dayjs().add(1, 'day').toISOString(),
  priority: 'low',
  isComplete: false,
  action: ['update', 'delete'],
};

export default function App() {
  // Dialog States
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] =
    React.useState<boolean>(false);

  // Snackbar (toaster)
  const [snackbar, setSnackbar] = React.useState(false);
  const [deleteSnackbar, setDeleteSnackbar] = React.useState(false);
  // redux state management
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickUpdateOpen = () => {
    setOpenUpdateDialog(true);
  };

  const handleDelSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSnackbar(false);
  };

  const displayDelSnackbar = () => {
    setDeleteSnackbar(true);
    setTimeout(() => {
      setDeleteSnackbar(false); // set the open state to false after 2 seconds
    }, 2000);
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
          <ReusableDialog
            tasks={tasks}
            task={defaultTask}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            isAdd={true}
          />
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
                    <div>
                      <Stack spacing={1}>
                        {task.action.indexOf('update') !== -1 ? (
                          <div>
                            <Button
                              startIcon={<EditOutlinedIcon />}
                              onClick={handleClickUpdateOpen}
                            >
                              Update
                            </Button>
                            <ReusableDialog
                              tasks={tasks}
                              task={task}
                              openDialog={openUpdateDialog}
                              setOpenDialog={setOpenUpdateDialog}
                              isAdd={false}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                        <Button
                          startIcon={<HighlightOffRoundedIcon />}
                          onClick={(e) => {
                            dispatch(deleteTask(task));
                            displayDelSnackbar();
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={2000}
        message="Successfully deleted"
      >
        <Alert
          onClose={handleDelSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Task successfully deleted!
        </Alert>
      </Snackbar>
    </Box>
  );
}

interface ReusableDialogProps {
  tasks: Task[];
  task: Task;
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  isAdd: boolean;
}

function ReusableDialog({
  tasks,
  task,
  openDialog,
  setOpenDialog,
  isAdd,
}: ReusableDialogProps) {
  // new task states
  const [title, setTitle] = React.useState(task.title);
  const [desc, setDesc] = React.useState(task.description);
  const [deadline, setDeadline] = React.useState<string>(task.deadline);
  const [priority, setPriority] = React.useState(task.priority);

  const [titleError, setTitleError] = React.useState(false);
  const [descError, setDescError] = React.useState(false);

  const dispatch = useDispatch();

  // Snackbar (toaster)
  const [snackbar, setSnackbar] = React.useState(false);
  const [dlSnackbar, setdlSnackbar] = React.useState(false);
  const [dupSnackbar, setDupSnackbar] = React.useState(false);

  // form dialog functions
  const resetInputs = () => {
    setTitle('');
    setDesc('');
    setDeadline(dayjs().add(1, 'day').toISOString());
    setPriority('low');
  };

  const handleCloseDialog = () => {
    resetInputs();
    setOpenDialog(false);
  };

  const isEmpty = (str: string) => {
    if (str.length === 0 || str.replace(/[\s\r\n\t]+/g, '').length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmitCloseDialog = () => {
    if (!isEmpty(title) && !isEmpty(desc)) {
      const newTask: Task = {
        title: title,
        description: desc,
        deadline: deadline,
        priority: priority,
        isComplete: task.isComplete,
        action: task.action,
      };

      if (!isAdd) {
        dispatch(updateTask(newTask));
        successRes();
        setOpenDialog(false);
      } else {
        const hasDuplicate = tasks.some(
          (task: Task) => task.title === newTask.title
        );
        if (hasDuplicate) {
          dupErr();
          resetInputs();
          setTitleError(true);
          setDescError(true);
        } else {
          dispatch(addTask(newTask));
          resetInputs();
          successRes();
          setOpenDialog(false);
        }
      }
    } else {
      resetInputs();
      setTitleError(true);
      setDescError(true);
    }
  };

  const successRes = () => {
    setSnackbar(true);
    setTimeout(() => {
      setSnackbar(false); // set the open state to false after 2 seconds
    }, 2000);
  };

  const deadlineErr = () => {
    setdlSnackbar(true);
    setTimeout(() => {
      setdlSnackbar(false); // set the open state to false after 2 seconds
    }, 2000);
  };

  const dupErr = () => {
    setDupSnackbar(true);
    setTimeout(() => {
      setDupSnackbar(false);
    }, 2000);
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

  const handleDLSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setdlSnackbar(false);
  };

  const handleDupSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setDupSnackbar(false);
  };

  // need alert for deadline
  const handleDeadlineChange = (newValue: Dayjs | null) => {
    if (newValue.isAfter(dayjs().add(1, 'day'))) {
      setDeadline(newValue.toISOString());
    } else {
      deadlineErr();
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <IconButton>
            {isAdd ? <AddCircleRoundedIcon /> : <EditOutlinedIcon />}
          </IconButton>
          {isAdd ? 'Add Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {isAdd ? (
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
            ) : (
              ''
            )}
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
                <FormControlLabel value="low" control={<Radio />} label="Low" />
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
            startIcon={isAdd ? <AddCircleRoundedIcon /> : <EditOutlinedIcon />}
            onClick={handleSubmitCloseDialog}
          >
            {isAdd ? 'Add' : 'Update'}
          </Button>
          <Button startIcon={<BlockIcon />} onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
        <Snackbar
          open={dlSnackbar}
          autoHideDuration={2000}
          message="Deadline Warning"
        >
          <Alert
            onClose={handleDLSnackbarClose}
            severity="warning"
            sx={{ width: '100%' }}
          >
            Deadline must be at least one day in advance
          </Alert>
        </Snackbar>
      </Dialog>
      <Snackbar
        open={dupSnackbar}
        autoHideDuration={2000}
        message="Duplicate Task"
      >
        <Alert
          onClose={handleDupSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          Cannot have a task with the same title
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        message={isAdd ? 'Successfully Added' : 'Successfully Updated'}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {isAdd ? 'Task successfully added!' : 'Task succesfully updated!'}
        </Alert>
      </Snackbar>
    </div>
  );
}
