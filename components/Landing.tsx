import Image from "next/image";
import Link from "next/link";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";
import { Logo } from "../components";
import styles from "../styles/landing.module.css";

const Theme = createTheme({
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
    },
  },
});

const StyledButton = styled(Button)`
  ${({ theme }) => `
cursor: pointer;
transition: ${theme.transitions.create(["letter-spacing", "transform"], {
    duration: theme.transitions.duration.standard,
  })};
&:hover {
  letter-spacing: ${1.1};
  transform: scale(1.08);
}
`}
`;

export const Landing = ({}) => {
  return (
    <>
      <div className={styles.logo__wrapper}>
        <Logo />
      </div>
      <div className={styles.landing__background}>
        <Image
          src="/michael-chiara-QlY4oiFbT9o-unsplash.webp"
          alt="Background Image of some people walking a trail"
          fill
          objectFit="cover"
        />
      </div>

      <div className={styles.txt__wrapper}>
        <Typography variant="h1" className={styles.landing__title}>
          Hiking.Simplified
        </Typography>
      </div>
      <div className={styles.btn__wrapper}>
        <ThemeProvider theme={Theme}>
          <StyledButton variant="text" sx={{ mr: 2, ml: 1 }}>
            <Link
              className={`${styles.txt__btn} ${styles.btn__line}`}
              href="/prefectures"
            >
              Start Walking
            </Link>
          </StyledButton>
        </ThemeProvider>
      </div>
    </>
  );
};
