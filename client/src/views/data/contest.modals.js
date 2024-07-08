import { BoltIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import Countries from "i18n-iso-countries";
import CountriesEnglishLocale from "i18n-iso-countries/langs/en.json";
import { Fragment, useEffect, useState } from "react";
import Markdown from "react-markdown";

import CountryFlagEmoji from "../../components/country-flag-emoji";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Textarea,
  Typography,
} from "../../utils/mui";

Countries.registerLocale(CountriesEnglishLocale);

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
        description: props.contest.description
          ? props.contest.description
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
          : "",
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
        startTimeError: "Time is not valid",
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
        endTimeError: "Time is not valid",
      });
    }
  };

  const onConfirm = () => {
    props.onConfirm(
      props.contest.id,
      form.name,
      form.description,
      `${form.startDate}T${form.startTime}`,
      `${form.endDate}T${form.endTime}`
    );
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
                  maxRows={17}
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
                  <Markdown className="markdown">{form.description}</Markdown>
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
          <Button
            variant="solid"
            color="primary"
            onClick={onConfirm}
            loading={props.loading}
          >
            {props.create ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

export function EditSongsModal(props) {
  const i18nCountries = Countries.getNames("en", { select: "official" });
  const countries = [];

  Object.keys(i18nCountries).forEach(function (c) {
    countries.push({ i18n: c, text: i18nCountries[c] });
  });

  const [scraping, setScraping] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    prompt: "",
    author: "",
    cover: "",
    country: "",
    idError: "",
    titleError: "",
    promptError: "",
    authorError: "",
    countryError: "",
    coverError: "",
  });

  const onIdInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Id must not be empty";
    }

    setForm({
      ...form,
      id: value,
      idError: error,
    });
  };

  const onTitleInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Title must not be empty";
    }

    setForm({
      ...form,
      title: value,
      titleError: error,
    });
  };

  const onPromptInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Prompt must not be empty";
    }

    setForm({
      ...form,
      prompt: value,
      promptError: error,
    });
  };

  const onAuthorInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Author must not be empty";
    }

    setForm({
      ...form,
      author: value,
      authorError: error,
    });
  };

  const onCountryInputChange = (event, newValue) => {
    let error = "";

    if (!newValue) {
      error = "Country must not be empty";
    }

    setForm({
      ...form,
      country: newValue,
      countryError: error,
    });
  };

  const onCoverInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Cover must not be empty";
    }

    setForm({
      ...form,
      cover: value,
      coverError: error,
    });
  };

  const countriesOptions = countries.map((c, i) => {
    return (
      <Option value={c.i18n} key={i}>
        <CountryFlagEmoji code={c.i18n} iso={false} />
        {c.text}
      </Option>
    );
  });

  const countrySelectedOption = (option) => {
    if (!option) {
      return null;
    }

    return (
      <Fragment>
        <CountryFlagEmoji code={option.value} iso={false} />
        {option.label}
      </Fragment>
    );
  };

  const onAddNewSong = () => {
    props.onAdd(
      form.id,
      props.contestId,
      form.title,
      form.prompt,
      form.author,
      form.country,
      form.cover
    );
  };

  const onDeleteSong = (songId, songTitle) => {
    props.onDelete(songId, songTitle);
  };

  const songsElement = props.songs.map((s, i) => {
    return (
      <Card variant="outlined" orientation="horizontal" key={i}>
        <AspectRatio ratio={1} sx={{ width: 90 }}>
          <img src={s.cover} loading="lazy" alt="" />
        </AspectRatio>
        <CardContent>
          <Link
            href={`https://suno.com/song/${s.id}`}
            target="_blank"
            rel="noopener"
          >
            <Typography level="title-lg">{s.title}</Typography>
          </Link>
          <Typography level="body-md">{s.author}</Typography>
          <Typography level="body-sm">{s.prompt}</Typography>
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <CountryFlagEmoji code={s.country} iso={true} />
          </div>
          <IconButton
            variant="plain"
            color="danger"
            size="sm"
            title="Delete"
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
            }}
            onClick={() => onDeleteSong(s.id, s.title)}
          >
            <TrashIcon />
          </IconButton>
        </CardContent>
      </Card>
    );
  });

  const onScrapeForSongDetails = async (songId) => {
    if (!songId) {
      return;
    }

    try {
      setScraping(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/song/${encodeURIComponent(
          songId
        )}/info`
      );

      if (response.ok && response.status === 200) {
        const result = await response.json();

        setForm({
          ...form,
          title: result.title,
          prompt: result.prompt,
          author: result.author,
          cover: result.cover,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setScraping(false);
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog size="lg" layout="fullscreen">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogTitle>Edit {props.contestName} songs</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", marginTop: "3rem" }}>
            <div style={{ flex: "1" }}>
              <Typography level="h5">Add a new one</Typography>
              <Stack spacing={2} style={{ marginTop: "1.25rem" }}>
                <FormControl error={form.idError.length > 0}>
                  <FormLabel>Id</FormLabel>
                  <div style={{ display: "flex" }}>
                    <Input
                      type="text"
                      placeholder="Type here the song id..."
                      size="md"
                      variant="outlined"
                      value={form.id}
                      onChange={onIdInputChange}
                      sx={{ flex: 1 }}
                      required
                    />
                    <IconButton
                      color="primary"
                      loading={scraping}
                      title="Get info"
                      disabled={form.id === ""}
                      onClick={() => onScrapeForSongDetails(form.id)}
                      sx={{ marginLeft: ".5rem" }}
                    >
                      <BoltIcon />
                    </IconButton>
                  </div>
                  <FormHelperText>{form.idError}</FormHelperText>
                </FormControl>
                <FormControl error={form.titleError.length > 0}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    placeholder="Type here the song title..."
                    size="md"
                    variant="outlined"
                    value={form.title}
                    onChange={onTitleInputChange}
                    required
                  />
                  <FormHelperText>{form.titleError}</FormHelperText>
                </FormControl>
                <FormControl error={form.promptError.length > 0}>
                  <FormLabel>Prompt</FormLabel>
                  <Input
                    type="text"
                    placeholder="Type here the song prompt..."
                    size="md"
                    variant="outlined"
                    value={form.prompt}
                    onChange={onPromptInputChange}
                    required
                  />
                  <FormHelperText>{form.promptError}</FormHelperText>
                </FormControl>
                <FormControl error={form.authorError.length > 0}>
                  <FormLabel>Author</FormLabel>
                  <Input
                    type="text"
                    placeholder="Type here the song author..."
                    size="md"
                    variant="outlined"
                    value={form.author}
                    onChange={onAuthorInputChange}
                    required
                  />
                  <FormHelperText>{form.authorError}</FormHelperText>
                </FormControl>
                <FormControl error={form.countryError.length > 0}>
                  <FormLabel>Country</FormLabel>
                  <Select
                    placeholder="Select song country..."
                    size="md"
                    variant="outlined"
                    onChange={onCountryInputChange}
                    renderValue={countrySelectedOption}
                    required
                  >
                    {countriesOptions}
                  </Select>
                  <FormHelperText>{form.countryError}</FormHelperText>
                </FormControl>
                <FormControl error={form.coverError.length > 0}>
                  <FormLabel>Cover</FormLabel>
                  <Input
                    type="text"
                    placeholder="Type here the song cover..."
                    size="md"
                    variant="outlined"
                    value={form.cover}
                    onChange={onCoverInputChange}
                    required
                  />
                  <FormHelperText>{form.coverError}</FormHelperText>
                </FormControl>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={onAddNewSong}
                  loading={props.loading}
                >
                  Add
                </Button>
              </Stack>
            </div>
            <div
              style={{
                flex: "4",
                marginLeft: "1.25rem",
              }}
            >
              {props.songs.length === 0 ? (
                <Typography level="body-md">Zero songs found</Typography>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    maxHeight: "700px",
                    overflowY: "auto",
                  }}
                >
                  {songsElement}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
