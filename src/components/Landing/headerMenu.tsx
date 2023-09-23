import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Image,
  rem,
  Title,
  Menu,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from "@tabler/icons-react";
import React from "react";
import { colors, phoneWidth, tabletWidth } from "../../utils";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    // color: theme.colorScheme === "dark" ? theme.white : theme.black,
    color: theme.white,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      // backgroundColor:
      //   theme.colorScheme === "dark"
      //     ? theme.colors.dark[6]
      //     : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export default function HeaderMenu() {
  const router = useRouter();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 20px rgba(0,0,0,0.7)",
        position: "sticky",
        top: 0,
        zIndex: 99999,
        opacity: 1,
        background: colors.landingPageGray,

        margin: 0,
      }}
      px="md"
      py="lg"
    >
      <Center sx={{}}>
        <Center sx={{ width: "33%", justifyContent: "flex-start" }}>
          <Anchor
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            sx={{
              textDecoration: "none",
              textAlign: "left",
            }}
            underline={false}
          >
            <Center sx={{}}>
              <Title order={4}>(LOGO HERE)</Title>
              <Title
                fw={600}
                ff="Helvetica"
                sx={{
                  [phoneWidth]: {
                    fontSize: "20px",
                  },
                  [tabletWidth]: {
                    fontSize: "20px",
                  },
                }}
                color={"white"}
              >
                Tiktokenizer
              </Title>
            </Center>
          </Anchor>
        </Center>
        <Center
          sx={{ height: "100%", width: "33%" }}
          className={classes.hiddenMobile}
        >
          <Anchor
            underline={false}
            sx={{ color: "white" }}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={classes.link}
          >
            Home
          </Anchor>
          <HoverCard
            width={600}
            position="bottom"
            radius="md"
            shadow="md"
            withinPortal
          >
            {/* <HoverCard.Target> */}
            <Anchor
              underline={false}
              color="white"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({
                    top: document.getElementById("features").offsetTop,
                    behavior: "smooth",
                  });
                }
              }}
              className={classes.link}
            >
              <Center inline>
                <Box component="span" mr={5}>
                  Features
                </Box>
                {/* <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    /> */}
              </Center>
            </Anchor>
            {/* </HoverCard.Target> */}

            {/* <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown> */}
          </HoverCard>
          <Anchor
            underline={false}
            href={"/models"}
            color="white"
            className={classes.link}
          >
            Getting started
          </Anchor>
          {/* <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a> */}
        </Center>

        <Center
          className={classes.hiddenMobile}
          sx={{ gap: 5, width: "33%", justifyContent: "flex-end" }}
        >
          <Anchor href="/models">
            <Button
              radius={30}
              size="md"
              variant="gradient"
              gradient={{ from: "red", to: "purple" }}
            >
              Log in
            </Button>
          </Anchor>

          <Anchor href="/models">
            <Button
              radius={30}
              size="md"
              variant="gradient"
              gradient={{ from: "purple", to: "blue", deg: 35 }}
            >
              Sign up
            </Button>
          </Anchor>
        </Center>

        <Menu shadow="md" trigger="hover" width={200}>
          <Menu.Target>
            <Burger
              color="white"
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                router.push(`/login`);
              }}
            >
              Log in
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                router.push(`/login`);
              }}
            >
              Sign up
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>

      <Drawer
        opened={false}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <a href="#" className={classes.link}>
            Home
          </a>

          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
            <Button
              size="md"
              onClick={() => {
                router.push(`/login`);
              }}
              variant="default"
            >
              Log in
            </Button>
            <Button
              size="md"
              onClick={() => {
                router.push(`/login`);
              }}
            >
              Sign up
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
