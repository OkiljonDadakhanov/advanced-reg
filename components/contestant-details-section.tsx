"use client";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Upload, Download } from "lucide-react";
import { SectionContainer } from "@/components/section-container";
import { Card, CardContent } from "@/components/ui/card";
import type { FormValues } from "@/lib/form-schema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ContestantDetailsSectionProps {
  form: UseFormReturn<FormValues>;
  contestantsCount: string;
  setContestantsCountAction: (value: string) => void;
}

export function ContestantDetailsSection({
  form,
  contestantsCount,
  setContestantsCountAction,
}: ContestantDetailsSectionProps) {
  // Update contestants array when contestantsCount changes
  useEffect(() => {
    const count = Number.parseInt(contestantsCount || "1");
    const currentContestants = form.getValues().contestants || [];

    // If we need more contestants, add them
    if (currentContestants.length < count) {
      const newContestants = [...currentContestants];
      for (let i = currentContestants.length; i < count; i++) {
        newContestants.push({
          full_name: "",
          gender: "",
          competition_subject: "",
          passport_number: "",
          special_requirements: "",
          t_shirt_size: "",
          passport_scan: new File([""], "placeholder.pdf"), // Provide an empty File instance
          id_photo: new File([""], "placeholder.jpg"),
        });
      }
      form.setValue("contestants", newContestants);
    }
    // If we need fewer contestants, remove them
    else if (currentContestants.length > count) {
      form.setValue("contestants", currentContestants.slice(0, count));
    }
  }, [contestantsCount, form]);

  return (
    <SectionContainer title="Contestant Details">
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="contestants_count"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <div className="mt-2 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
                ⚠️ Only a maximum of <strong>4 Mathematics</strong> contestants
                and <strong>2 Informatics</strong> contestants are allowed.
                Applications exceeding this limit will{" "}
                <strong>not be accepted</strong>.
              </div>
              <FormLabel className="text-slate-700 font-medium">
                Overall number of contestants from Mathematics and Informatics
              </FormLabel>

              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setContestantsCountAction(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-slate-300 h-11">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="p-3 sm:p-4 bg-blue-50 rounded-md border border-blue-100 mb-4">
          <div className="flex items-center mb-2">
            <Download className="h-5 w-5 mr-2 text-blue-600" />
            <h3 className="font-medium text-blue-700">Parental Consent Form</h3>
          </div>
          <p className="text-sm text-blue-600 mb-3">
            Download the official Parental Consent Form for contestants who are
            minors.
            <br />
            <span className="font-medium">
              (Required for all participants under 18 years old)
            </span>
          </p>
          <a href="/docs/form.pdf" target="_blank">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white border-blue-300 hover:bg-blue-50 text-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Parental Consent Form
            </Button>
          </a>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-slate-700 font-medium">
              Contestant Information
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              For each contestant, the following details must be provided:
            </p>
          </div>

          {/* Dynamic contestant forms based on contestantsCount */}
          {Array.from({
            length: Number.parseInt(contestantsCount || "1"),
          }).map((_, index) => (
            <Card
              key={index}
              className="border-slate-200 shadow-sm overflow-hidden sm:rounded-lg"
            >
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-medium text-slate-700">
                  Contestant {index + 1}
                </h3>
              </div>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.full_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Full Name (as in passport)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            className="bg-white border-slate-300 h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.date_of_birth`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-medium">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DatePicker
                              selected={field.value ?? null} // Ensure it never starts as undefined
                              onChange={(date) => field.onChange(date)}
                              dateFormat="PPP"
                              placeholderText="Select date"
                              className="w-full p-2 pr-10 text-left font-normal bg-white border border-slate-300 rounded-md h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <CalendarIcon className="absolute top-3 right-3 h-4 w-4 text-slate-500" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  ;
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.gender`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-300 h-11">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.competition_subject`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Competition Subject
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-300 h-11">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                            <SelectItem value="Mathematics">
                              Mathematics
                            </SelectItem>
                            <SelectItem value="Informatics">
                              Informatics
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.passport_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Passport Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter passport number"
                            className="bg-white border-slate-300 h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.passport_expiry_date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-medium">
                          Passport Expiry Date
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DatePicker
                              selected={field.value ?? null} // Ensures controlled behavior
                              onChange={(date) => field.onChange(date)}
                              dateFormat="PPP"
                              placeholderText="Select date"
                              className="w-full p-2 pr-10 text-left font-normal bg-white border border-slate-300 rounded-md h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <CalendarIcon className="absolute top-3 right-3 h-4 w-4 text-slate-500" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  ;
                  <FormField
                    control={form.control}
                    name={`contestants.${index}.t_shirt_size`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          T-shirt Size
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-300 h-11">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                            <SelectItem value="XS">XS</SelectItem>
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                            <SelectItem value="XXL">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`contestants.${index}.special_requirements`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Special Requirements
                      </FormLabel>
                      <FormDescription className="text-slate-500 text-sm">
                        If any, e.g., dietary, medical, allergies, etc.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Enter special requirements"
                          className="bg-white border-slate-300 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-medium text-slate-700 mb-3">
                    File Uploads for Contestant
                  </h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`contestants.${index}.passport_scan`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Passport Scan
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                id={`contestant-passport-scan-${index}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                  }
                                }}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `contestant-passport-scan-${index}`
                                    )
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4 text-slate-500" />
                                {value instanceof File
                                  ? value.name
                                  : "Upload Passport Scan (PDF/JPG)"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contestants.${index}.id_photo`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="sr-only">ID Photo</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                id={`contestant-id-photo-${index}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                  }
                                }}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `contestant-id-photo-${index}`
                                    )
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4 text-slate-500" />
                                {value instanceof File
                                  ? value.name
                                  : "Upload ID Photo (JPG/PNG, high quality)"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contestants.${index}.parental_consent_form`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Parental Consent Form
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                id={`contestant-consent-form-${index}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                  }
                                }}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center justify-center px-4 py-2 text-sm text-center whitespace-nowrap"
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `contestant-consent-form-${index}`
                                    )
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4 text-slate-500" />
                                <span className="truncate">
                                  {value instanceof File
                                    ? value.name
                                    : "Upload Signed Parental Consent Form (for minors, PDF)"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-700 mb-2 font-medium">
                    Sample Files:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-600">
                      <Download className="h-4 w-4 mr-1" />
                      <a
                        href="/docs/passport.pdf"
                        target="_blank"
                        className="hover:underline"
                      >
                        Download Sample Passport Scan
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Download className="h-4 w-4 mr-1" />
                      <a
                        href="/images/id_photo.png"
                        target="_blank"
                        className="hover:underline"
                      >
                        Download Sample ID Photo
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
