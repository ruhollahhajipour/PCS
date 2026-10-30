// Content for the ICAPS section. Sources: TotalEnergies ICAPS© Mobiweb site,
// OPERCOM® methodology summary, and ICAPS coordinator job descriptions.

export const ICAPS_SOURCES = [
  { title: "ICAPS© Mobiweb – Our product (TotalEnergies)", url: "https://icaps.mobiweb.totalenergies.com/our-product" },
  { title: "ICAPS© Mobiweb – ICAPS", url: "https://icaps.mobiweb.totalenergies.com/icaps" },
  { title: "ICAPS© Mobiweb – Trainings & support", url: "https://icaps.mobiweb.totalenergies.com/our-trainings-support" },
  { title: "Explaining OPERCOM® methodology in commissioning", url: "https://pdfcoffee.com/explaining-opercom-methodology-in-commissioning-pdf-free.html" },
  { title: "ICAPS Coordinator – Biojet Project (Nesfircroft)", url: "https://www.nesfircroft.com/job/icaps-coordinator---biojet-project" },
  { title: "ICAPS Coordinator (TotalEnergies Jobs)", url: "https://jobs.totalenergies.com/nl_NL/careers/JobDetail/ICAPS-Coordinator/76499" },
];

export const ROLES = [
  {
    key: "admin",
    title: "ادمین محلی (Local Administrator)",
    channel: "وب",
    duties: [
      "پیکربندی سیستم و ایجاد پایگاه داده پروژه",
      "بارگذاری داده‌ها از فایل‌های اکسل در مدل داخلی",
      "مدیریت کاربران و عیب‌یابی",
    ],
  },
  {
    key: "super",
    title: "سرپرست (Superintendent)",
    channel: "وب",
    duties: [
      "نصب اقلام و توالی‌ها (Sequences) و اتصال آن‌ها به برگه‌های تست",
      "آماده‌سازی تسک‌ها و گواهی‌ها (Certificates)",
      "مدیریت Punch List از ایجاد تا بسته‌شدن",
    ],
  },
  {
    key: "exec",
    title: "مجری / اپراتور (Executor)",
    channel: "تبلت اندروید",
    duties: [
      "انجام تسک‌ها و ثبت نتیجهٔ تست‌ها در میدان",
      "مراجعه به مستندات مرجع",
      "ثبت ناهنجاری (Anomaly) و نقص مدارک همراه با عکس",
    ],
  },
];

export const WORKFLOW = [
  { title: "تعریف ساختار", text: "تفکیک تأسیسات به سیستم (System) و زیرسیستم (Sub-system). مسئولیت در هر مرحله منتقل می‌شود و هر زیرسیستم گواهی مستقل دارد." },
  { title: "بارگذاری داده", text: "اقلام تجهیزات، چک‌لیست‌ها و برگه‌های تست از اکسل وارد می‌شوند و هر قلم به برگه‌های تسک خود لینک می‌شود." },
  { title: "توالی و برنامه‌ریزی", text: "فعالیت‌های آینده شکسته و به‌هم متصل می‌شوند (ماژول Sequencing/Linking) و اولویت‌های راه‌اندازی رعایت می‌شود." },
  { title: "اجرا در میدان", text: "مجری روی تبلت تست‌ها را انجام می‌دهد، نتیجه و عکس ثبت می‌کند و ناهنجاری‌ها را گزارش می‌دهد." },
  { title: "Punch List", text: "موارد معیوب با اولویت A / B / C ثبت و تا بسته‌شدن پیگیری می‌شوند؛ فرم‌های رفع نقص (Clearance) طبق ماتریس امضا تأیید می‌شوند." },
  { title: "صدور گواهی", text: "با تکمیل پیش‌راه‌اندازی، گواهی RFC و پس از راه‌اندازی، گواهی AOC صادر و تحویل به بهره‌بردار انجام می‌شود." },
];

export const INPUTS = [
  { title: "اقلام و تجهیزات", text: "فهرست تجهیزات و اقلام مهندسی (Engineering Register) از فایل اکسل، متصل به برگه‌های تسک." },
  { title: "تفکیک سیستم / زیرسیستم", text: "لیست زیرسیستم‌ها (Sub System List) و ارتباط آن‌ها با محل و فروشنده." },
  { title: "برگه‌های بازرسی و تست", text: "چک‌لیست‌های رشته‌ای (هزاران قلم در هر پروژه) و کارت‌های تست؛ قابل تطبیق با الزامات کارفرما." },
  { title: "روش‌های تست عملیاتی (OTP)", text: "رویه‌های راه‌اندازی ایمن هر تجهیز؛ بسته به کارفرما، قرارداد و منطقه متفاوت است." },
  { title: "توالی فعالیت‌ها", text: "ترتیب و وابستگی فعالیت‌های پیش‌راه‌اندازی و راه‌اندازی." },
  { title: "چک‌لیست‌های نگهداشت (Preservation)", text: "برگه‌های بازرسی و تست برای حفاظت تجهیزات تا زمان راه‌اندازی." },
  { title: "داده‌های میدانی", text: "نتایج تست، ناهنجاری‌ها و عکس‌هایی که مجری روی تبلت ثبت می‌کند." },
  { title: "ورودی‌های Punch", text: "موارد حاصل از FAT، Outstanding Work List و walkdown." },
];

export const OUTPUTS = [
  { title: "گزارش پیشرفت تست‌ها", text: "گزارش‌های روزانه و هفتگی، پیشرفت بسته‌های RFC/AOC و ساعت‌کار." },
  { title: "داشبوردها و گزارش‌ها", text: "بیش از ۳۰ گزارش و داشبورد برای تصمیم‌گیری." },
  { title: "ردیابی و مستندسازی", text: "سابقهٔ کامل همهٔ تست‌های انجام‌شده (Traceability)." },
  { title: "گواهی‌های RFC و AOC", text: "به‌ازای هر زیرسیستم، همراه با پروندهٔ بدون کاغذ و امضای الکترونیک." },
  { title: "وضعیت Punch List", text: "ردیابی ناهنجاری از کشف تا بسته‌شدن و سوابق بستن." },
  { title: "تحویل به بهره‌بردار", text: "گواهی‌ها و نقاط عطف تحویل مسئولیت (Handover)." },
  { title: "بانک اطلاعات راه‌اندازی", text: "آمار و بازخورد پروژه برای استفاده در پروژه‌های بعدی." },
];

export const MODULES = [
  "برگه‌های بازرسی و تست (Checks & Test Sheets)",
  "تست‌های عملیاتی (Operational Tests)",
  "تحویل (Handover)",
  "ورود/خروج داده و به‌روزرسانی (Import / Export)",
  "نگهداشت (Preservation)",
  "توالی و اتصال فعالیت‌ها (Sequencing / Linking)",
  "Punch List",
  "داشبورد و گزارش‌گیری",
];

export const PHASES = [
  {
    title: "پیش‌راه‌اندازی (Pre-commissioning / Mechanical Completion)",
    focus: "کارهای ایستا و بدون برق",
    items: ["بازرسی انطباق", "تست‌های ایستا", "تست لوله‌کشی"],
    cert: "RFC – Ready For Commissioning",
    punch: "موارد دستهٔ A باید قبل از امضای RFC بسته شوند.",
  },
  {
    title: "راه‌اندازی (Commissioning)",
    focus: "کارهای پویا و برقدار",
    items: ["راستی‌آزمایی پویا", "تست با سیال جایگزین", "آماده‌سازی لوله‌ها و مخازن برای استارت"],
    cert: "AOC – Achievement Of Commissioning",
    punch: "موارد دستهٔ B باید قبل از امضای AOC بسته شوند. AOC انتقال مسئولیت به بهره‌بردار را مجاز می‌کند.",
  },
];
