export const pages = [
  { title: "About", href: "#about", requireLogin : false, newTab : false },
  { title: "Media", href: "#media", requireLogin : false, newTab : false },
  { title: "Articles", href: "articles",requireLogin : false, newTab : false },
  { title: "Resume", href: "resume", requireLogin : false, newTab : true },
  { title: "Create", href: "articles/create-article", requireLogin : true, newTab : false },
  { title: "Settings", href: "settings", requireLogin : true, newTab : false },
  { title: "Logout", href: "logout", requireLogin : true, newTab : false },
];