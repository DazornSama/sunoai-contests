import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Layout from "../../shared/layout";
import { useEffect, useState } from "react";
import { ContestList } from "./contest.styled";
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
import { ConfirmDeleteModal, CreateEditModal } from "./contest.modals";

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

  const deleteContest = async (contestId) => {
    try {
      setDeleteModal({
        ...deleteModal,
        deleting: true,
      });

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
        show: "true",
        message: message,
        color: color,
      });

      setDeleteModal({
        open: false,
      });
    } catch (error) {
      console.error(error);
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
          <Button>Edit songs</Button>
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
        loading={createEditModal.loading}
      />
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        contestName={deleteModal.contestName}
        onConfirm={() => deleteContest(deleteModal.contestId)}
        deleting={deleteModal.deleting}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="outlined"
        open={snackbar.show}
        color={snackbar.color}
      >
        {snackbar.message}
      </Snackbar>
    </Layout>
  );
}

export const dataContestLoader = async ({ params }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contest`);
  return await response.json();
};
