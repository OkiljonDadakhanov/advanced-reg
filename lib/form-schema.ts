import { z } from "zod";

// Define the team leader schema
export const teamLeaderSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  passport_scan: z.any().refine((file) => file instanceof File, {
    message: "Passport scan is required",
  }),
  id_photo: z.any().refine((file) => file instanceof File, {
    message: "ID photo is required",
  }),
});

// Define the contestant schema
export const contestantSchema = z.object({
  full_name: z.string().min(1, "Contestant name is required"),
  date_of_birth: z
    .date({ required_error: "Date of birth is required" })
    ,
  gender: z.string().min(1, "Gender is required"),
  competition_subject: z.string().min(1, "Competition subject is required"),
  passport_number: z.string().min(1, "Passport number is required"),
  passport_expiry_date: z
    .date({
      required_error: "Passport expiry date is required",
    }),
  t_shirt_size: z.string().min(1, "T-shirt size is required"),
  special_requirements: z.string().optional(),
  passport_scan: z.any().refine((file) => file instanceof File, {
    message: "Passport scan is required",
  }),
  id_photo: z.any().refine((file) => file instanceof File, {
    message: "ID photo is required",
  }),
  parental_consent_form: z.any().optional(),
});

// Define the form schema
export const formSchema = z.object({
  country: z.string().min(1, "Country is required"),
  official_delegation_name: z.string().min(1, "Delegation name is required"),
  total_accompanying_persons: z
    .string()
    .min(1, "Number of persons is required"),
  team_leaders_count: z.string().min(1, "Number of team leaders is required"),
  team_leaders: z
    .array(teamLeaderSchema)
    .min(1, "At least one team leader is required"),
  contestants_count: z.string().min(1, "Number of contestants is required"),
  contestants: z.array(contestantSchema),
  confirm_information: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
  agree_rules: z.boolean().refine((val) => val === true, {
    message: "You must agree to the rules",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
