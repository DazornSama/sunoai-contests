import Countries from "i18n-iso-countries";
import CountriesEnglishLocale from "i18n-iso-countries/langs/en.json";
import { Container, CoverImage, Wrapper } from "./country-flag-emoji.styled";

Countries.registerLocale(CountriesEnglishLocale);

const countries = Countries.getNames("en", { select: "official" });

export default function CountryFlagEmoji(props) {
  const title = props.code ? countries[props.code] || props.code : undefined;
  const src = `/country_flags/${props.code.toLowerCase()}.svg`;

  return (
    <Container>
      <Wrapper title={title.code}>
        <CoverImage alt={title.code} title={title.code} src={src} />
      </Wrapper>
      {props.iso && (
        <span role="img" aria-labelledby={title} title={title}>
          {props.code ? getCountryFlagEmoji(props.code) : "🏳"}
        </span>
      )}
    </Container>
  );
}

const getCountryFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};
