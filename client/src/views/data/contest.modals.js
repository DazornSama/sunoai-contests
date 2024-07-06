import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { EyeIcon } from "@heroicons/react/24/solid";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Textarea,
} from "../../utils/mui";

const dateToInputDateFormat = (date) => {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();

  if (m < 10) {
    m = "0" + m;
  }

  if (d < 10) {
    d = "0" + d;
  }

  return `${y}-${m}-${d}`;
};

const dateToInputTimeFormat = (date) => {
  let h = date.getHours();
  let mm = date.getMinutes();

  if (h < 10) {
    h = "0" + h;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return `${h}:${mm}`;
};

const addDaysToDate = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);

  return newDate;
};

export function ConfirmDeleteModal(props) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog size="lg">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          Are you sure to delete {props.contestName}?
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={props.onConfirm}
            loading={props.deleting}
          >
            Yes, delete it
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

export function CreateEditModal(props) {
  const today = new Date();
  const tomorrow = addDaysToDate(today, 1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: dateToInputDateFormat(today),
    startTime: dateToInputTimeFormat(today),
    endDate: dateToInputDateFormat(tomorrow),
    endTime: dateToInputTimeFormat(tomorrow),
    nameError: "",
    descriptionError: "",
    startDateError: "",
    startTimeError: "",
    endDateError: "",
    endTimeError: "",
  });

  useEffect(() => {
    if (
      props.contest &&
      props.contest.name &&
      props.contest.startDate &&
      props.contest.endDate
    ) {
      setForm({
        ...form,
        name: props.contest.name,
        description: props.contest.description ? props.contest.description : "",
        startDate: dateToInputDateFormat(new Date(props.contest.startDate)),
        startTime: dateToInputTimeFormat(new Date(props.contest.startDate)),
        endDate: dateToInputDateFormat(new Date(props.contest.endDate)),
        endTime: dateToInputTimeFormat(new Date(props.contest.endDate)),
      });
    } else {
      setForm({
        ...form,
        name: "",
        description: "",
        startDate: dateToInputDateFormat(today),
        startTime: dateToInputTimeFormat(today),
        endDate: dateToInputDateFormat(tomorrow),
        endTime: dateToInputTimeFormat(tomorrow),
      });
    }
  }, [props]);

  const onNameInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Name must not be empty";
    }

    setForm({
      ...form,
      name: value,
      nameError: error,
    });
  };

  const onDescriptionInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    setForm({
      ...form,
      description: value,
      descriptionError: error,
    });
  };

  const onStartDateInputChanged = (event) => {
    const value = event.target.value;

    try {
      setForm({
        ...form,
        startDate: value,
        startDateError: "",
      });
    } catch {
      setForm({
        ...form,
        startDateError: "Date is not valid",
      });
    }
  };

  const onStartTimeInputChanged = (event) => {
    const value = event.target.value;

    try {
      setForm({
        ...form,
        startTime: value,
        startTimeError: "",
      });
    } catch {
      setForm({
        ...form,
        startTimeError: "Date is not valid",
      });
    }
  };

  const onEndDateInputChanged = (event) => {
    const value = event.target.value;

    try {
      setForm({
        ...form,
        endDate: value,
        endDateError: "",
      });
    } catch {
      setForm({
        ...form,
        endDateError: "Date is not valid",
      });
    }
  };

  const onEndTimeInputChanged = (event) => {
    const value = event.target.value;

    try {
      setForm({
        ...form,
        endTime: value,
        endTimeError: "",
      });
    } catch {
      setForm({
        ...form,
        endTimeError: "Date is not valid",
      });
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog size="lg" layout="fullscreen">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogTitle>
          {!props.create && props.contest
            ? `Edit ${props.contest.name}`
            : "Create new contest"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ marginTop: "3rem" }}>
            <FormControl error={form.nameError.length > 0}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Type here the contest name..."
                size="md"
                variant="outlined"
                value={form.name}
                onChange={onNameInputChange}
                required
              />
              <FormHelperText>{form.nameError}</FormHelperText>
            </FormControl>
            <FormControl error={form.descriptionError.length > 0}>
              <FormLabel>Description</FormLabel>
              <div
                style={{
                  display: "flex",
                  height: "420px",
                  maxHeight: "420px",
                  overflow: "hidden",
                }}
              >
                <Textarea
                  placeholder="Type here the contest description... (markdown supported)"
                  size="md"
                  variant="outlined"
                  value={form.description}
                  onChange={onDescriptionInputChange}
                  sx={{
                    flex: 1,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    padding: ".375rem",
                    marginLeft: "1.25rem",
                    maxHeight: "420px",
                    backgroundColor: "rgba(255, 255, 255, .05)",
                    borderRadius: "6px",
                    overflow: "auto",
                  }}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: ".325rem",
                      right: ".325rem",
                    }}
                    disabled
                  >
                    <EyeIcon />
                  </IconButton>
                  <Markdown>{form.description}</Markdown>
                </div>
              </div>
              <FormHelperText>{form.descriptionError}</FormHelperText>
            </FormControl>
            <div
              style={{
                display: "flex",
              }}
            >
              <FormControl
                error={form.startDateError.length > 0}
                sx={{ flex: 1 }}
              >
                <FormLabel>Start date</FormLabel>
                <Input
                  type="date"
                  size="md"
                  variant="outlined"
                  value={form.startDate}
                  onChange={onStartDateInputChanged}
                  required
                />
                <FormHelperText>{form.startDateError}</FormHelperText>
              </FormControl>
              <FormControl
                error={form.startTimeError.length > 0}
                sx={{ flex: 1, marginLeft: "1.25rem" }}
              >
                <FormLabel>Start time</FormLabel>
                <Input
                  type="time"
                  size="md"
                  variant="outlined"
                  value={form.startTime}
                  onChange={onStartTimeInputChanged}
                  required
                />
                <FormHelperText>{form.startTimeError}</FormHelperText>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <FormControl
                error={form.endDateError.length > 0}
                sx={{ flex: 1 }}
              >
                <FormLabel>End date</FormLabel>
                <Input
                  type="date"
                  size="md"
                  variant="outlined"
                  value={form.endDate}
                  onChange={onEndDateInputChanged}
                  required
                />
                <FormHelperText>{form.endDateError}</FormHelperText>
              </FormControl>
              <FormControl
                error={form.endTimeError.length > 0}
                sx={{ flex: 1, marginLeft: "1.25rem" }}
              >
                <FormLabel>End time</FormLabel>
                <Input
                  type="time"
                  size="md"
                  variant="outlined"
                  value={form.endTime}
                  onChange={onEndTimeInputChanged}
                  required
                />
                <FormHelperText>{form.endTimeError}</FormHelperText>
              </FormControl>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="primary">
            {props.create ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
