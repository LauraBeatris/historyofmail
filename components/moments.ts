export type Moment = { year: number; title: string; blurb: string };

export const MOMENTS: Moment[] = [
  {
    year: 1965,
    title: "MAIL on CTSS",
    blurb: "Users of MIT's time-sharing system leave messages for each other on one machine.",
  },
  {
    year: 1971,
    title: "The @ sign",
    blurb: "Ray Tomlinson sends the first message between two computers on the ARPANET.",
  },
  {
    year: 1978,
    title: "The first spam",
    blurb: "Gary Thuerk invites 400 ARPANET users to a DEC demo. Nobody is pleased.",
  },
  {
    year: 1982,
    title: "SMTP and RFC 822",
    blurb: "The envelope and the letter get written down. Both are still in use.",
  },
  {
    year: 1988,
    title: "Eudora",
    blurb: "Steve Dorner writes a mail client with a real interface. Students take it everywhere.",
  },
  {
    year: 1992,
    title: "MIME",
    blurb: "Attachments and non-English text, smuggled through a plain-text protocol.",
  },
  {
    year: 1996,
    title: "Hotmail",
    blurb: "Email leaves the desktop. Any browser, anywhere.",
  },
  {
    year: 1998,
    title: "You've got mail",
    blurb: "AOL's three words become a film title.",
  },
  {
    year: 1999,
    title: "BlackBerry 850",
    blurb: "Push email on a pager-sized keyboard. The inbox follows you home.",
  },
  {
    year: 2004,
    title: "Gmail",
    blurb: "A gigabyte of storage, search instead of folders, conversations instead of messages.",
  },
  {
    year: 2007,
    title: "Mail on iPhone",
    blurb: "A full inbox on a touchscreen, read with a thumb.",
  },
  {
    year: 2013,
    title: "Mailbox",
    blurb: "Swipe to archive, snooze until later. Inbox zero as a gesture.",
  },
  {
    year: 2020,
    title: "HEY",
    blurb: "A screener at the front door. You decide who may email you.",
  },
  {
    year: 2024,
    title: "Agents in the inbox",
    blurb: "Software that reads, triages, and answers on your behalf.",
  },
];

export const START = MOMENTS[0].year;
export const END = 2026;
