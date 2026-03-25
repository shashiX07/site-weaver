import tp1 from "@/assets/template-preview-1.jpg";
import tp2 from "@/assets/template-preview-2.jpg";
import tp3 from "@/assets/template-preview-3.jpg";
import tp4 from "@/assets/template-preview-4.jpg";
import tp5 from "@/assets/template-preview-5.jpg";
import tp6 from "@/assets/template-preview-6.jpg";

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "freelancer" | "admin";
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  authorId: string;
  authorName: string;
  status: "Pending" | "Approved" | "Rejected";
  downloads: number;
  createdAt: string;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  status: "Draft" | "Published";
  templateId: string;
  image: string;
  ownerId: string;
  lastEdited: string;
  content: WebsiteContent;
}

export interface WebsiteContent {
  heading: string;
  subheading: string;
  buttonText: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textColor: string;
  bgColor: string;
  padding: number;
}

// --- Keys ---
const KEYS = {
  users: "tp_users",
  currentUser: "tp_current_user",
  templates: "tp_templates",
  websites: "tp_websites",
};

// --- Helpers ---
function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function genId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// --- Seed default templates ---
const DEFAULT_TEMPLATES: Template[] = [
  { id: "t1", name: "SaaS Landing", description: "Modern SaaS landing page", category: "Business", image: tp1, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 342, createdAt: "2026-01-10" },
  { id: "t2", name: "Dark Portfolio", description: "Creative dark portfolio", category: "Portfolio", image: tp2, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 218, createdAt: "2026-01-15" },
  { id: "t3", name: "E-Commerce", description: "Clean online store", category: "Store", image: tp3, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 156, createdAt: "2026-02-01" },
  { id: "t4", name: "Restaurant", description: "Warm restaurant website", category: "Food", image: tp4, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 189, createdAt: "2026-02-10" },
  { id: "t5", name: "Blog Editorial", description: "Clean blog layout", category: "Blog", image: tp5, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 275, createdAt: "2026-02-20" },
  { id: "t6", name: "Fitness Pro", description: "Bold gym website", category: "Health", image: tp6, authorId: "system", authorName: "TemplatePro", status: "Approved", downloads: 112, createdAt: "2026-03-01" },
];

function ensureSeeded() {
  const templates = get<Template[]>(KEYS.templates, []);
  if (templates.length === 0) {
    set(KEYS.templates, DEFAULT_TEMPLATES);
  }
}

// Initialize on import
ensureSeeded();

// --- Auth ---
export function signup(name: string, email: string, password: string, role: "user" | "freelancer" = "user"): User | string {
  const users = get<(User & { password: string })[]>(KEYS.users, []);
  if (users.find((u) => u.email === email)) {
    return "Email already exists";
  }
  const user: User & { password: string } = {
    id: genId(),
    name,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  set(KEYS.users, users);
  const { password: _, ...safe } = user;
  set(KEYS.currentUser, safe);
  return safe;
}

export function login(email: string, password: string): User | string {
  const users = get<(User & { password: string })[]>(KEYS.users, []);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return "Invalid email or password";
  const { password: _, ...safe } = user;
  set(KEYS.currentUser, safe);
  return safe;
}

export function logout() {
  localStorage.removeItem(KEYS.currentUser);
}

export function getCurrentUser(): User | null {
  return get<User | null>(KEYS.currentUser, null);
}

export function updateUserRole(role: "user" | "freelancer" | "admin") {
  const user = getCurrentUser();
  if (!user) return;
  user.role = role;
  set(KEYS.currentUser, user);
  const users = get<(User & { password: string })[]>(KEYS.users, []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].role = role;
    set(KEYS.users, users);
  }
}

// --- Templates ---
export function getTemplates(): Template[] {
  return get<Template[]>(KEYS.templates, []);
}

export function getApprovedTemplates(): Template[] {
  return getTemplates().filter((t) => t.status === "Approved");
}

export function getPendingTemplates(): Template[] {
  return getTemplates().filter((t) => t.status === "Pending");
}

export function getTemplatesByAuthor(authorId: string): Template[] {
  return getTemplates().filter((t) => t.authorId === authorId);
}

export function getTemplateById(id: string): Template | undefined {
  return getTemplates().find((t) => t.id === id);
}

export function submitTemplate(data: { name: string; description: string; category: string }): Template | string {
  const user = getCurrentUser();
  if (!user) return "Not authenticated";
  const templates = getTemplates();
  // Pick a random preview image from defaults
  const images = [tp1, tp2, tp3, tp4, tp5, tp6];
  const template: Template = {
    id: genId(),
    name: data.name,
    description: data.description,
    category: data.category,
    image: images[Math.floor(Math.random() * images.length)],
    authorId: user.id,
    authorName: user.name,
    status: "Pending",
    downloads: 0,
    createdAt: new Date().toISOString(),
  };
  templates.push(template);
  set(KEYS.templates, templates);
  return template;
}

export function approveTemplate(id: string) {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx >= 0) {
    templates[idx].status = "Approved";
    set(KEYS.templates, templates);
  }
}

export function rejectTemplate(id: string) {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx >= 0) {
    templates[idx].status = "Rejected";
    set(KEYS.templates, templates);
  }
}

// --- Websites ---
export function getWebsites(): Website[] {
  return get<Website[]>(KEYS.websites, []);
}

export function getUserWebsites(userId: string): Website[] {
  return getWebsites().filter((w) => w.ownerId === userId);
}

export function getWebsiteById(id: string): Website | undefined {
  return getWebsites().find((w) => w.id === id);
}

export function createWebsite(templateId: string): Website | string {
  const user = getCurrentUser();
  if (!user) return "Not authenticated";
  const template = getTemplateById(templateId);
  if (!template) return "Template not found";

  // Increment downloads
  const templates = getTemplates();
  const tIdx = templates.findIndex((t) => t.id === templateId);
  if (tIdx >= 0) {
    templates[tIdx].downloads += 1;
    set(KEYS.templates, templates);
  }

  const websites = getWebsites();
  const website: Website = {
    id: genId(),
    name: `My ${template.name}`,
    url: `${user.name.toLowerCase().replace(/\s+/g, "")}.templatepro.com/${genId().slice(0, 4)}`,
    status: "Draft",
    templateId,
    image: template.image,
    ownerId: user.id,
    lastEdited: new Date().toISOString(),
    content: {
      heading: "Welcome to My Website",
      subheading: "Built with TemplatePro — customize everything visually.",
      buttonText: "Learn More",
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "Bold",
      textColor: "#1a1a2e",
      bgColor: "#ffffff",
      padding: 24,
    },
  };
  websites.push(website);
  set(KEYS.websites, websites);
  return website;
}

export function updateWebsite(id: string, updates: Partial<Website>) {
  const websites = getWebsites();
  const idx = websites.findIndex((w) => w.id === id);
  if (idx >= 0) {
    websites[idx] = { ...websites[idx], ...updates, lastEdited: new Date().toISOString() };
    set(KEYS.websites, websites);
    return websites[idx];
  }
  return null;
}

export function updateWebsiteContent(id: string, content: Partial<WebsiteContent>) {
  const websites = getWebsites();
  const idx = websites.findIndex((w) => w.id === id);
  if (idx >= 0) {
    websites[idx].content = { ...websites[idx].content, ...content };
    websites[idx].lastEdited = new Date().toISOString();
    set(KEYS.websites, websites);
    return websites[idx];
  }
  return null;
}

export function publishWebsite(id: string) {
  return updateWebsite(id, { status: "Published" });
}

export function deleteWebsite(id: string) {
  const websites = getWebsites().filter((w) => w.id !== id);
  set(KEYS.websites, websites);
}

// --- Stats ---
export function getDashboardStats(userId: string) {
  const websites = getUserWebsites(userId);
  const templates = getTemplates();
  const usedTemplateIds = new Set(websites.map((w) => w.templateId));
  return {
    websiteCount: websites.length,
    templatesUsed: usedTemplateIds.size,
    publishedCount: websites.filter((w) => w.status === "Published").length,
    draftCount: websites.filter((w) => w.status === "Draft").length,
  };
}

export function getAdminStats() {
  const templates = getTemplates();
  return {
    pending: templates.filter((t) => t.status === "Pending").length,
    approved: templates.filter((t) => t.status === "Approved").length,
    rejected: templates.filter((t) => t.status === "Rejected").length,
  };
}

// --- Time formatting ---
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
