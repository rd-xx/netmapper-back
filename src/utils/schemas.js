import * as yup from "yup"

export const usernameSchema = yup.string().trim().required().label("Username")

export const emailSchema = yup.string().email().required().label("E-mail")

export const passwordSchema = yup
  .string()
  .min(8)
  .matches(/^.*(?=.*[0-9]+).*$/, "Password must contain a number")
  .matches(/^.*(?=.*\p{Ll}+).*$/u, "Password must contain a lowercase letter")
  .matches(/^.*(?=.*\p{Lu}+).*$/u, "Password must contain an uppercase letter")
  .matches(
    /^.*(?=.*[^0-9\p{L}]+).*$/u,
    "Password must contain a special character"
  )
  .required()
  .label("Password")

export const ipSchema = yup
  .string()
  .matches(
    /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?!$)|$)){4}$/,
    "Invalid IP address."
  )
  .required()
  .label("Target")
