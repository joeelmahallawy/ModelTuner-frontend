import { LuWorkflow } from "react-icons/lu";
import {
  Navbar,
  Text,
  Group,
  Code,
  ScrollArea,
  createStyles,
  rem,
  Title,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  Anchor,
  Avatar,
  Center,
  AppShell,
  Header,
  Menu,
} from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconChevronRight,
  IconChevronLeft,
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
  IconFile,
  IconHome,
  IconLayoutDashboard,
  IconRobot,
  IconUser,
  IconUsers,
  IconAdjustmentsHorizontal,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { SessionObject, User } from "../../utils/interfaces";
import { SessionContext } from "../sessionProvider";
import { IconDashboard } from "@tabler/icons-react";
import { useRouter } from "next/router";

const styles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[3],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const { classes, theme } = styles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
  const router = useRouter();

  const items = (hasLinks ? links : []).map((link) => (
    <Anchor
      underline={false}
      className={classes.link}
      sx={(t) => ({
        color: link.label === "Log out" && "red",
        "&:hover": {
          background: t.colors.gray[1],
          color: link.label === "Log out" && "red",
        },
        background: link.link == router.pathname && t.colors.gray[1],
      })}
      href={link.link}
      key={link.label}
      onClick={(event) => {
        event.preventDefault();

        router.push(`/${link.link}`);
      }}
    >
      {link.label}
    </Anchor>
  ));

  useEffect(() => {
    if (router.pathname === "/account" || router.pathname === "/organization") {
      setOpened(true);
    }
  }, []);

  return (
    <>
      <UnstyledButton
        onClick={() => {
          if (label === `Fine-tuning jobs`) {
            return router.push(`/jobs`);
          }
          if (label !== "Settings") router.push(`/${label.toLowerCase()}`);
          else setOpened((o) => !o);
        }}
        className={classes.control}
        sx={(t) => ({
          // for models

          background:
            ((label === "Models" && router.pathname === "/models") ||
              (label === "Files" && router.pathname === "/files") ||
              (label === "Account" && router.pathname === "/account") ||
              (label === "Fine-tuning jobs" && router.pathname === "/jobs")) &&
            t.colors.gray[2],
        })}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const linksData = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

// export function NavbarLinksGroup() {
//   return (
//     <Box
//       sx={(theme) => ({
//         minHeight: rem(220),
//         padding: theme.spacing.md,
//         backgroundColor:
//           theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
//       })}
//     >
//       <LinksGroup {...linksData} />
//     </Box>
//   );
// }

const mockdata = [
  {
    label: "Models",
    icon: IconRobot,
    initiallyOpened: true,
  },

  {
    label: "Fine-tuning jobs",
    icon: LuWorkflow,
  },
  {
    label: "Files",
    icon: IconFile,
  },

  {
    label: "Settings",
    icon: IconSettings,
    links: [
      { label: "Account", link: "/account" },
      // { label: "API Keys", link: "/apiKeys" },
      { label: "Log out", link: "/logout" },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function Sidebar() {
  const { classes } = useStyles();

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar width={{ sm: 325 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Title order={4}>(LOGO HERE)</Title>
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {/* <UnstyledButton
            sx={(t) => ({
              display: "flex",
              gap: 10,
              background: "red",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: t.spacing.md,
              color: t.colorScheme === "dark" ? t.colors.dark[0] : t.black,
              "&:hover": {
                backgroundColor:
                  t.colorScheme === "dark" ? t.colors.dark[8] : t.colors.gray[0],
              },
            })}
          >
            <Avatar src={session?.picture} radius="xl" />
  
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {session?.name}
              </Text>
  
              <Text color="dimmed" size="xs">
                {session?.email}
              </Text>
            </div>
  
            {<IconChevronRight size="0.9rem" stroke={1.5} />}
          </UnstyledButton> */}
      </Navbar.Section>
    </Navbar>
  );
}

const AppHeader = ({ session }: { session: SessionObject }) => {
  return (
    <Center
      pl={20}
      sx={{
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1,
        background: "white",
        // width: "calc(50vw-325px)",
        width: `calc(100vw - 325px)`,
        marginLeft: "auto",

        boxShadow: "0px 1px 10px lightgray",
        // padding: 10,
      }}
    >
      {/* <Box sx={{ width: "33%" }} /> */}

      <Center
        sx={{
          justifyContent: "flex-end",

          marginLeft: "auto",
        }}
      >
        <Menu
          trigger="hover"
          shadow="md"
          width={200}
          position="bottom"
          withArrow
        >
          <Menu.Target>
            <UnstyledButton
              sx={(t) => ({
                borderRadius: 10,
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                // width: "100%",
                padding: t.spacing.md,
                color: t.colorScheme === "dark" ? t.colors.dark[0] : t.black,
                "&:hover": {
                  backgroundColor:
                    t.colorScheme === "dark"
                      ? t.colors.dark[8]
                      : t.colors.gray[1],
                },
              })}
            >
              <Avatar src={session?.user?.picture} radius="xl" />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {session?.user?.name}
                </Text>

                <Text color="dimmed" size="xs">
                  {session?.user?.email}
                </Text>
              </div>

              {<IconChevronRight size="0.9rem" stroke={1.5} />}
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconUser size={14} />}>Account</Menu.Item>
            <Menu.Item color="red" icon={<IconTrash size={14} />}>
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>
    </Center>
  );
};

const SidebarWrapper = ({ children }) => {
  const { classes } = useStyles();

  const [session, _]: [session: SessionObject, _: any] =
    useContext(SessionContext);

  return (
    <AppShell
      padding="md"
      navbar={<Sidebar />}
      header={<AppHeader session={session} />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Center>
        <Box sx={{ width: "95%" }}>{children}</Box>
      </Center>
    </AppShell>
  );
};
export default SidebarWrapper;
