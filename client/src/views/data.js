import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/layout";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  FormHelperText,
  Alert,
  Card,
  Typography,
  CardContent,
  CardActions,
} from "../utils/mui";
import { LoginContainer, MenuContainer } from "./data.styled";

const _menu = [
  {
    title: "Contests",
    description: "Visualize and edit data about contests and their songs",
    url: "contests",
  },
];

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

export default function DataView() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  const [formLogin, setFormLogin] = useState({
    username: "",
    usernameError: "",
    password: "",
    passwordError: "",
    generalError: "",
    loading: false,
  });

  useEffect(() => {
    const doCheckAuth = async () => {
      if (await checkAuth()) {
        setAuth(true);
      }
    };

    document.title = "Data administration";

    doCheckAuth();
  }, []);

  useEffect(() => {
    if (formLogin.loading) {
      tryLogin();
    }
  }, [formLogin]);

  const onUsernameInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Username must not be empty";
    }

    setFormLogin({
      ...formLogin,
      username: value,
      usernameError: error,
    });
  };

  const onPasswordInputChange = (event) => {
    const value = event.target.value;
    let error = "";

    if (!value) {
      error = "Password must not be empty";
    }

    setFormLogin({
      ...formLogin,
      password: value,
      passwordError: error,
    });
  };

  const onClickLoginFormButton = () => {
    setFormLogin({
      ...formLogin,
      loading: true,
    });
  };

  const tryLogin = async () => {
    const form = formLogin;

    try {
      if (!formLogin.username) {
        form.usernameError = "Username must not be empty";
      } else if (!formLogin.password) {
        form.passwordError = "Password must not be empty";
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();

          form.generalError = data.error;
        } else {
          sessionStorage.setItem(
            "AUTH",
            JSON.stringify({
              username: formLogin.username,
              password: formLogin.password,
            })
          );

          setAuth(true);

          form = {
            username: "",
            password: "",
            usernameError: "",
            passwordError: "",
            generalError: "",
          };
        }
      }
    } catch (error) {
      form.generalError = error;
    } finally {
      setFormLogin({
        ...formLogin,
        username: form.username,
        password: form.password,
        usernameError: form.usernameError,
        passwordError: form.passwordError,
        generalError: form.generalError,
        loading: false,
      });
    }
  };

  if (!auth) {
    return (
      <Layout>
        <LoginContainer>
          <Stack spacing={2}>
            <FormControl error={formLogin.usernameError.length > 0}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                size="md"
                variant="outlined"
                value={formLogin.username}
                onChange={onUsernameInputChange}
                required
              />
              <FormHelperText>{formLogin.usernameError}</FormHelperText>
            </FormControl>
            <FormControl error={formLogin.passwordError.length > 0}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                size="md"
                variant="outlined"
                value={formLogin.password}
                onChange={onPasswordInputChange}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    onClickLoginFormButton();
                  }
                }}
                required
              />
              <FormHelperText>{formLogin.passwordError}</FormHelperText>
            </FormControl>
            <Button
              onClick={onClickLoginFormButton}
              loading={formLogin.loading}
            >
              Login
            </Button>
            {formLogin.generalError.length > 0 && (
              <Alert variant="outlined" color="danger">
                {formLogin.generalError}
              </Alert>
            )}
          </Stack>
        </LoginContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography level="h1">Menu</Typography>
      <MenuContainer>
        {_menu.map((m, i) => {
          return (
            <Card variant="outlined" size="lg" key={i}>
              <CardContent>
                <Typography level="title-lg">{m.title}</Typography>
                <Typography level="body-sm">{m.description}</Typography>
              </CardContent>
              <CardActions sx={{ paddingTop: ".5rem" }}>
                <Button onClick={() => navigate(`/data/${m.url}`)}>Go</Button>
              </CardActions>
            </Card>
          );
        })}
      </MenuContainer>
    </Layout>
  );
}
