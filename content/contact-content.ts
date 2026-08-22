import type { ContactLocale, ContactTopicValue } from "@/lib/contact-validation";

export type ContactPageContent = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  title: string;
  description: string;
  channelsTitle: string;
  channelsDescription: string;
  emailLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  locationLabel: string;
  formTitle: string;
  formDescription: string;
  nameLabel: string;
  emailFieldLabel: string;
  phoneFieldLabel: string;
  phoneOptional: string;
  topicLabel: string;
  topicPlaceholder: string;
  messageLabel: string;
  consentLabel: string;
  submitLabel: string;
  pendingLabel: string;
  configMessage: string;
  directFallback: string;
  topicOptions: Array<{ value: ContactTopicValue; label: string }>;
};

export const contactPageContent: Record<ContactLocale, ContactPageContent> = {
  id: {
    breadcrumbHome: "Beranda",
    breadcrumbCurrent: "Kontak",
    title: "Mari mulai percakapan",
    description: "Sampaikan pertanyaan, kebutuhan solusi kelistrikan, atau peluang kerja sama. Pilih kanal langsung atau kirimkan pesan terstruktur kepada tim Afana.",
    channelsTitle: "Pilih jalur yang paling nyaman",
    channelsDescription: "Hubungi Afana secara langsung atau gunakan formulir untuk menjelaskan kebutuhan Anda dengan lebih lengkap.",
    emailLabel: "Email",
    phoneLabel: "Telepon",
    whatsappLabel: "WhatsApp",
    locationLabel: "Lokasi",
    formTitle: "Ceritakan kebutuhan Anda",
    formDescription: "Isikan informasi yang diperlukan agar pesan dapat ditinjau sesuai topiknya.",
    nameLabel: "Nama",
    emailFieldLabel: "Alamat email",
    phoneFieldLabel: "Nomor telepon",
    phoneOptional: "Opsional",
    topicLabel: "Topik",
    topicPlaceholder: "Pilih topik pesan",
    messageLabel: "Pesan",
    consentLabel: "Saya menyetujui informasi ini digunakan untuk menanggapi pesan saya dan disimpan maksimal 12 bulan.",
    submitLabel: "Kirim pesan",
    pendingLabel: "Menyimpan pesan…",
    configMessage: "Formulir sedang menunggu konfigurasi keamanan. Gunakan email, telepon, atau WhatsApp untuk menghubungi Afana.",
    directFallback: "Perlu mengirim pesan lain? Hubungi",
    topicOptions: [
      { value: "GENERAL", label: "Umum" },
      { value: "ELECTRICAL_SOLUTIONS", label: "Solusi kelistrikan" },
      { value: "PARTNERSHIP", label: "Kemitraan" },
      { value: "PROCUREMENT", label: "Pengadaan" },
      { value: "CAREER", label: "Karier" },
      { value: "MEDIA", label: "Media & Informasi" },
    ],
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
    title: "Let’s start a conversation",
    description: "Share a question, an electrical solution need, or a collaboration opportunity. Choose a direct channel or send a structured message to the Afana team.",
    channelsTitle: "Choose the channel that suits you",
    channelsDescription: "Contact Afana directly or use the form to explain your needs in more detail.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    locationLabel: "Location",
    formTitle: "Tell us what you need",
    formDescription: "Provide the essential details so your message can be reviewed under the right topic.",
    nameLabel: "Name",
    emailFieldLabel: "Email address",
    phoneFieldLabel: "Phone number",
    phoneOptional: "Optional",
    topicLabel: "Topic",
    topicPlaceholder: "Choose a message topic",
    messageLabel: "Message",
    consentLabel: "I agree that this information may be used to respond to my message and stored for up to 12 months.",
    submitLabel: "Send message",
    pendingLabel: "Saving message…",
    configMessage: "The form is waiting for its security configuration. Use email, phone, or WhatsApp to contact Afana.",
    directFallback: "Need to send another message? Contact",
    topicOptions: [
      { value: "GENERAL", label: "General" },
      { value: "ELECTRICAL_SOLUTIONS", label: "Electrical solutions" },
      { value: "PARTNERSHIP", label: "Partnership" },
      { value: "PROCUREMENT", label: "Procurement" },
      { value: "CAREER", label: "Careers" },
      { value: "MEDIA", label: "Media & Information" },
    ],
  },
};
