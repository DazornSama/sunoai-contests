import { useNavigate } from "react-router-dom";
import { Button } from "../utils/mui";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Wrapper, BackButton } from "./layout.styled";

export default function Layout(props) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(props.backButton.url);
  };

  return (
    <Wrapper>
      {props.backButton && (
        <BackButton>
          <Button
            variant="soft"
            color="neutral"
            size="md"
            startDecorator={<ArrowLeftIcon />}
            onClick={goBack}
          >
            Go back
          </Button>
        </BackButton>
      )}
      {props.children}
    </Wrapper>
  );
}
