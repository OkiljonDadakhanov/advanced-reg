"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download } from "lucide-react";
import { SectionContainer } from "@/components/section-container";
import type { FormValues } from "@/lib/form-schema";
import { Card, CardContent } from "@/components/ui/card";

interface TeamLeadersSectionProps {
  form: UseFormReturn<FormValues>;
  teamLeadersCount: string;
  setTeamLeadersCountAction: (value: string) => void;
}

export function TeamLeadersSection({
  form,
  teamLeadersCount,
  setTeamLeadersCountAction,
}: TeamLeadersSectionProps) {
  // Update team leaders array when teamLeadersCount changes
  useEffect(() => {
    const count = Number.parseInt(teamLeadersCount || "1");
    let currentLeaders = form.getValues().team_leaders;

    // If the field is undefined, initialize it
    if (!Array.isArray(currentLeaders)) {
      currentLeaders = [];
      form.setValue("team_leaders", currentLeaders);
    }

    if (currentLeaders.length < count) {
      const newLeaders = [...currentLeaders];
      for (let i = currentLeaders.length; i < count; i++) {
        newLeaders.push({
          full_name: "",
          email: "",
          phone_number: "",
          passport_scan: new File([""], "placeholder.pdf"),
          id_photo: new File([""], "placeholder.jpg"),
          role: "",
        });
      }
      form.setValue("team_leaders", newLeaders);
    } else if (currentLeaders.length > count) {
      form.setValue("team_leaders", currentLeaders.slice(0, count));
    }
  }, [teamLeadersCount, form]);

  return (
    <SectionContainer title="Team Leaders">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="team_leaders_count"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel className="text-slate-700 font-medium">
                Number of Team Leaders
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setTeamLeadersCountAction(value);
                }}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-slate-300 h-11">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_accompanying_persons"
          rules={{
            min: { value: 0, message: "Number must be at least 0" },
            max: { value: 5, message: "Maximum 5 people allowed" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">
                Total Number of Accompanying Persons (max 5 people)
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full bg-white border-slate-300 h-11">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-300 shadow-md rounded-md">
                    {[...Array(6).keys()].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-6">
        {Array.from({ length: Number.parseInt(teamLeadersCount || "1") }).map(
          (_, index) => (
            <Card
              key={index}
              className="border-slate-200 shadow-sm overflow-hidden sm:rounded-lg"
            >
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-medium text-slate-700">
                  Team Leader {index + 1}
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`team_leaders.${index}.full_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name as in passport"
                            className="bg-white border-slate-300 h-11"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`team_leaders.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Enter email address"
                            className="bg-white border-slate-300 h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`team_leaders.${index}.phone_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number with country code"
                            className="bg-white border-slate-300 h-11"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`team_leaders.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-300 h-11">
                              <SelectValue placeholder="Select role" />
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
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-medium text-slate-700 mb-3">
                    File Uploads for Team Leader
                  </h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`team_leaders.${index}.passport_scan`}
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
                                id={`passport-scan-${index}`}
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
                                    .getElementById(`passport-scan-${index}`)
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
                      name={`team_leaders.${index}.id_photo`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="sr-only">ID Photo</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                id={`id-photo-${index}`}
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
                                    .getElementById(`id-photo-${index}`)
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
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </SectionContainer>
  );
}
