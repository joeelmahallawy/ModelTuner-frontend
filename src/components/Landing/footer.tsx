import {
  createStyles,
  Container,
  Group,
  Anchor,
  rem,
  Image,
  Title,
  Box,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(60),
    borderTop: `${rem(0)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    background: "black",
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    // alignItems: "center",
    alignItems: "start",
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    marginTop: 30,
    gap: 30,
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

interface FooterSimpleProps {
  links: { link: string; label: string }[];
}

export default function FooterSimple({ links }: FooterSimpleProps) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a">
      color="dimmed"
      underline={false}
      key={link.label}
      href={link.link}
      onClick={(event) => {
        if (typeof window !== "undefined" && link.link === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        event.preventDefault();
      }}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Box>
          <Anchor
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ behavior: "smooth", top: 0 });
              }
            }}
          >
            <Title>(LOGO HERE)</Title>
          </Anchor>
          <Title order={5} mt={40} fw={600} color="white">
            Copyright © 2023. All rights reserved.
          </Title>
        </Box>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
