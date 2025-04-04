"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GeneralInformationSection } from "@/components/general-information-section";
import { TeamLeadersSection } from "@/components/team-leaders-section";
import { ContestantDetailsSection } from "@/components/contestant-details-section";
import { SubmissionSection } from "@/components/submission-section";
import { formSchema, type FormValues } from "@/lib/form-schema";
import {
  fetchCountries,
  type Country,
  submitRegistration,
  prepareFormData,
} from "@/lib/api";
import Image from "next/image";

export default function RegistrationForm() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [contestantsCount, setContestantsCountAction] = useState<string>("1");
  const [teamLeadersCount, setTeamLeadersCountAction] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      official_delegation_name: "",
      total_accompanying_persons: "",
      team_leaders_count: "1",
      team_leaders: [
        {
          full_name: "",
          email: "",
          phone_number: "",
          role: "",
        },
      ],
      contestants_count: "1",
      contestants: [
        {
          full_name: "",
          gender: "",
          competition_subject: "",
          passport_number: "",
          special_requirements: "",
        },
      ],
      confirm_information: false,
      agree_rules: false,
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries:", error);
        setError("Failed to load countries. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, []);

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = prepareFormData(values);
      const response = await submitRegistration(formData);

      setSuccess("Registration submitted successfully!");
      console.log("Form submitted with response:", response);

      form.reset({
        country: "",
        official_delegation_name: "",
        total_accompanying_persons: "",
        team_leaders_count: "1",
        team_leaders: [
          {
            full_name: "",
            email: "",
            phone_number: "",
            role: "",
          },
        ],
        contestants_count: "1",
        contestants: [
          {
            full_name: "",
            gender: "",
            competition_subject: "",
            passport_number: "",
            special_requirements: "",
            t_shirt_size: "",
            date_of_birth: undefined,
            passport_expiry_date: undefined,
            parental_consent_form: undefined,
          },
        ],

        confirm_information: false,
        agree_rules: false,
      });

      setTeamLeadersCountAction("1");
      setContestantsCountAction("1");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <Card className="border-slate-200 shadow-md overflow-hidden">
        <CardHeader className="text-center bg-slate-50 border-b border-slate-100 py-8">
          <div className="flex justify-center items-center gap-6 mb-4">
            <Image
              src="/logo/olympic.png"
              alt="Logo 1"
              width={150}
              height={150}
            />
            <Image
              src="/logo/khorazmi.png"
              alt="Logo 2"
              width={150}
              height={150}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-800">
            Official Registration Form
          </CardTitle>
          <p className="text-slate-500 mt-2">
            Please complete all required fields accurately
          </p>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-0"
            encType="multipart/form-data"
          >
            <CardContent className="p-0">
              <GeneralInformationSection form={form} countries={countries} />
              <TeamLeadersSection
                form={form}
                teamLeadersCount={teamLeadersCount}
                setTeamLeadersCountAction={setTeamLeadersCountAction}
              />
              <ContestantDetailsSection
                form={form}
                contestantsCount={contestantsCount}
                setContestantsCountAction={setContestantsCountAction}
              />
              <SubmissionSection form={form} />

              <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>

                {/* Success message just below the button */}
                {success && (
                  <div className="w-full text-center bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-md">
                    {success}
                  </div>
                )}

                {/* Error message here too, optional */}
                {error && (
                  <div className="w-full text-center bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
