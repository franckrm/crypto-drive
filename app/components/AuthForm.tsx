"use client";

type TypeForm = "sign-in" | "sign-up";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters.")
    .max(100, "Full name must be at most 100 characters."),
  email: z.email("Invalid email address."),
});

const AuthForm = ({ type }: { type: TypeForm }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {}
  return (
    <>
      <form
        id="form-rhf-input"
        className="auth-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="form-title">
          {type == "sign-in" ? "Sign In" : "Sign Up"}
        </h1>
        <FieldGroup>
          {type == "sign-up" && (
            <>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Field
                      data-invalid={fieldState.invalid}
                      className="shad-form-item"
                    >
                      <FieldLabel
                        htmlFor="form-rhf-input-fullName"
                        className="shad-form-label"
                      >
                        Full Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-input-fullName"
                        // aria-invalid={fieldState.invalid}
                        placeholder="Enter your full name"
                        autoComplete="vz"
                        className="shad-input"
                      />
                    </Field>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="shad-form-message"
                      />
                    )}
                  </>
                )}
              />
            </>
          )}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Field
                  data-invalid={fieldState.invalid}
                  className="shad-form-item"
                >
                  <FieldLabel
                    htmlFor="form-rhf-input-email"
                    className="shad-form-label"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={false}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="shad-input"
                  />
                </Field>
                <Field>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="shad-form-message"
                    />
                  )}
                </Field>
              </>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit" className="form-submit-button">
            {type == "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
        </Field>
        <div className="body-2 flex justify-center">
          <p className="text-light-100">
            {type == "sign-in"
              ? "Don't have an account? "
              : "Already have an account? "}
          </p>
          <Link
            href={type == "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-brand ml-1 font-medium"
          >
            {type == "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>
    </>
  );
};

export default AuthForm;
