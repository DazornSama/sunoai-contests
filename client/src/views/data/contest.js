import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Layout from "../../shared/layout";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Snackbar,
  Typography,
} from "../../utils/mui";
import {
  ConfirmDeleteModal,
  CreateEditModal,
  EditSongsModal,
} from "./contest.modals";
import { ContestList } from "./contest.styled";

const checkAuth = async () => {
  try {
    const auth = JSON.parse(sessionStorage.getItem("AUTH"));

    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: auth.username,
        password: auth.password,
      }),
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default function DataContestView() {
  const navigate = useNavigate();

  const [contests, setContests] = useState(useLoaderData());
  const [createEditModal, setCreateEditModal] = useState({
    open: false,
    create: false,
    contest: {},
    loading: false,
  });
  const [editSongsModal, setEditSongsModal] = useState({
    open: false,
    contestId: "",
    contestName: "",
    songs: [],
    loading: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    contestId: "",
    contestName: "",
    deleting: false,
  });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    color: "neutral",
  });

  useEffect(() => {
    const doCheckAuth = async () => {
      if (!(await checkAuth())) {
        navigate("./data");
      }
    };

    document.title = "Data administration - Contests";

    doCheckAuth();
  }, []);

  const onCreateEditContest = async (
    id,
    name,
    description,
    startDate,
    endDate
  ) => {
    let result = true;

    try {
      setCreateEditModal({
        ...createEditModal,
        loading: true,
      });

      let message;
      let color;

      if (createEditModal.create) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/contest`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              description: description,
              start_date: startDate,
              end_date: endDate,
            }),
          }
        );

        message = `${name} created!`;
        color = "success";

        if (!response.ok) {
          if (response.status === 400) {
            message = await response.text();
            color = "warning";
            result = false;
          } else {
            throw await response.text();
          }
        } else {
          const contest = await response.json();
          setContests([...contests, contest]);
        }
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/contest/${id}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              description: description,
              start_date: startDate,
              end_date: endDate,
            }),
          }
        );

        message = `${name} updated!`;
        color = "success";

        if (!response.ok) {
          if (response.status === 400) {
            message = await response.text();
            color = "warning";
            result = false;
          } else if (response.status === 404) {
            message = `${name} not found!`;
            color = "warning";
          } else {
            throw await response.text();
          }
        } else {
          const contest = await response.json();

          const newContests = contests.map((c) => {
            if (c.id === id) {
              return contest;
            } else {
              return c;
            }
          });

          setContests(newContests);
        }
      }

      setSnackbar({
        show: true,
        message: message,
        color: color,
      });
    } catch (error) {
      console.error(error);

      result = false;

      setSnackbar({
        show: true,
        message: "Something bad happened",
        color: "danger",
      });
    } finally {
      setCreateEditModal({
        ...createEditModal,
        open: !result,
        loading: false,
      });
    }
  };

  const deleteContest = async () => {
    let result = true;

    try {
      setDeleteModal({
        ...deleteModal,
        deleting: true,
      });

      const contestId = deleteModal.contestId;

      const contest = contests.find((x) => x.id === contestId);

      if (!contest) {
        throw new Error("Contest not found!");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/contest/${encodeURIComponent(
          contestId
        )}`,
        {
          method: "DELETE",
        }
      );

      let message = `${contest.name} deleted!`;
      let color = "success";

      if (!response.ok) {
        if (response.status === 404) {
          message = `${contest.name} not found!`;
          color = "warning";
        } else {
          throw await response.text();
        }
      }

      setContests(contests.filter((c) => c.id !== contestId));

      setSnackbar({
        show: true,
        message: message,
        color: color,
      });
    } catch (error) {
      console.error(error);

      result = false;

      setSnackbar({
        show: true,
        message: "Something bad happened",
        color: "danger",
      });
    } finally {
      setDeleteModal({
        open: !result,
        deleting: false,
      });
    }
  };

  const onAddSong = async (
    id,
    contestId,
    title,
    prompt,
    author,
    country,
    cover
  ) => {
    let song = null;

    try {
      setEditSongsModal({
        ...editSongsModal,
        loading: true,
      });

      let message = `${title} added!`;
      let color = "success";

      const response = await fetch(`${process.env.REACT_APP_API_URL}/song`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          contest_id: contestId,
          title: title,
          prompt: prompt,
          author: author,
          cover: cover,
          country: country,
        }),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 409) {
          message = await response.text();
          color = "warning";
        } else {
          throw await response.text();
        }
      } else {
        song = await response.json();
      }

      setSnackbar({
        show: true,
        message: message,
        color: color,
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        show: true,
        message: "Something bad happened",
        color: "danger",
      });
    } finally {
      setEditSongsModal({
        ...editSongsModal,
        loading: false,
        songs: song ? [...editSongsModal.songs, song] : editSongsModal.songs,
      });
    }
  };

  const onDeleteSong = async (songId, songTitle) => {
    let result = true;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/song/${encodeURIComponent(songId)}`,
        {
          method: "DELETE",
        }
      );

      let message = `${songTitle} deleted!`;
      let color = "success";

      if (!response.ok) {
        if (response.status === 404) {
          message = `${songTitle} not found!`;
          color = "warning";
        } else {
          throw await response.text();
        }
      }

      setEditSongsModal({
        ...editSongsModal,
        songs: editSongsModal.songs.filter((s) => s.id !== songId),
      });

      setSnackbar({
        show: true,
        message: message,
        color: color,
      });
    } catch (error) {
      console.error(error);

      result = false;

      setSnackbar({
        show: true,
        message: "Something bad happened",
        color: "danger",
      });
    }
  };

  const contestsElement = contests.map((c, i) => {
    const startDate = new Date(c.startDate);
    const endDate = new Date(c.endDate);

    const onOpenContestPageClick = () => {
      window.open(`../contest/${c.id}`);
    };

    return (
      <Card variant="outlined" size="md" key={i}>
        <CardContent>
          <Typography level="title-md">{c.name}</Typography>
          <Typography level="body-sm">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </Typography>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            title="Open in new tab"
            sx={{
              position: "absolute",
              top: ".875rem",
              right: ".5rem",
            }}
            onClick={onOpenContestPageClick}
          >
            <ArrowTopRightOnSquareIcon />
          </IconButton>
          <IconButton
            variant="plain"
            color="danger"
            size="sm"
            title="Delete"
            sx={{
              position: "absolute",
              top: ".875rem",
              right: "calc(.5rem + 32px + .25rem)",
            }}
            onClick={(e) =>
              setDeleteModal({
                open: true,
                contestId: c.id,
                contestName: c.name,
              })
            }
          >
            <TrashIcon />
          </IconButton>
        </CardContent>
        <CardActions sx={{ paddingTop: ".5rem" }}>
          <Button
            onClick={() =>
              setCreateEditModal({
                ...createEditModal,
                open: true,
                create: false,
                contest: c,
              })
            }
          >
            Edit details
          </Button>
          <Button
            onClick={async () => {
              setEditSongsModal({
                ...editSongsModal,
                open: true,
                contestId: c.id,
                contestName: c.name,
                songs: await dataContestSongsLoader(c.id),
              });
            }}
          >
            Edit songs
          </Button>
        </CardActions>
      </Card>
    );
  });

  return (
    <Layout
      backButton={{
        url: "../data",
      }}
    >
      <Typography level="h1">Contests</Typography>
      <ButtonGroup variant="soft" spacing=".5rem" sx={{ marginTop: "3rem" }}>
        <Button
          startDecorator={<PlusIcon />}
          onClick={() =>
            setCreateEditModal({
              ...createEditModal,
              open: true,
              create: true,
              contest: {},
            })
          }
        >
          Add a new one
        </Button>
      </ButtonGroup>
      <ContestList>{contestsElement}</ContestList>
      <CreateEditModal
        open={createEditModal.open}
        onClose={() => setCreateEditModal({ open: false })}
        create={createEditModal.create}
        contest={createEditModal.contest}
        onConfirm={onCreateEditContest}
        loading={createEditModal.loading}
      />
      <EditSongsModal
        open={editSongsModal.open}
        onClose={() => setEditSongsModal({ open: false, songs: [] })}
        contestId={editSongsModal.contestId}
        contestName={editSongsModal.contestName}
        songs={editSongsModal.songs}
        onAdd={onAddSong}
        onDelete={onDeleteSong}
        loading={editSongsModal.loading}
      />
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        contestName={deleteModal.contestName}
        onConfirm={deleteContest}
        deleting={deleteModal.deleting}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="outlined"
        open={snackbar.show}
        color={snackbar.color}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, show: false })}
      >
        {snackbar.message}
      </Snackbar>
    </Layout>
  );
}

export const dataContestLoader = async ({ params }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contest`);

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

const dataContestSongsLoader = async (contestId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/contest/${encodeURIComponent(
      contestId
    )}/songs`
  );

  if (response.ok) {
    return await response.json();
  }

  return [];
};
