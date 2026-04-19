"use client";

type FormType = "sign-in" | "sign-up";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { createAccount } from "@/lib/actions/user.actions";
import OTPModel from "./OTPModel";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.email("Invalid email address."),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user = await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      });
      setAccountId(user.accountId);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to create account. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }
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
          <Button
            type="submit"
            disabled={isLoading}
            className="form-submit-button"
          >
            {type == "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
        </Field>
        {errorMessage && <p className="error-message">*{errorMessage}*</p>}
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
      {accountId && (
        <OTPModel email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
