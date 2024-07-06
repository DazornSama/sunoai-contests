import countries from "../utils/countries";
import { Container, CoverImage, Wrapper } from "./country-flag-emoji.styled";

export default function CountryFlagEmoji(code) {
  const title = code ? countries[code] || code : undefined;
  const src = `/country_flags/${title.code.toLowerCase()}.svg`;

  return (
    <Container>
      <Wrapper title={title.code}>
        <CoverImage alt={title.code} title={title.code} src={src} />
      </Wrapper>
      <span role="img" aria-labelledby={title} title={title}>
        {code ? getCountryFlagEmoji(code) : "🏳"}
      </span>
    </Container>
  );
}

const getCountryFlagEmoji = (countryCode) => {
  const codePoints = countryCode.code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};
