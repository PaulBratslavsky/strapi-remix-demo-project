import z from "zod";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useNavigate, useActionData } from "@remix-run/react";
import { createNewContact } from "~/data.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const formSchema = z.object({
    avatar: z.string().url().min(2),
    first: z.string().min(2),
    last: z.string().min(2),
    twitter: z.string().min(2),
  });

  const validatedFields = formSchema.safeParse({
    avatar: data.avatar,
    first: data.first,
    last: data.last,
    twitter: data.twitter,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to add new contact.",
      data: null,
    };
  }

  const newEntry = await createNewContact(data);

  if (newEntry.errors)
    return json({
      errors: data.errors,
      message: null,
      data: null,
    });

  return redirect(`/contacts/${newEntry.id}`);
};

export default function CreateContact() {
  const data = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <Form id="create-form" method="post">
      <div className="create-form-grid">
        <FormInput
          aria-label="First name"
          name="first"
          type="text"
          label="First name"
          placeholder="First"
          errors={data?.errors}
        />
        <FormInput
          aria-label="Last name"
          name="last"
          type="text"
          label="Last name"
          placeholder="Last"
          errors={data?.errors}
        />
        <FormInput
          name="twitter"
          type="text"
          label="Twitter"
          placeholder="@jack"
          errors={data?.errors}
        />
        <FormInput
          aria-label="Avatar URL"
          name="avatar"
          type="text"
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          errors={data?.errors}
        />
      </div>
      <div>
      <label>
        <span>Notes</span>
        <textarea name="note" rows={6} />
      </label>
      </div>

      <div className="button-group">
        <button type="submit">Create</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Form>
  );
}

function FormInput({
  type,
  name,
  label,
  placeholder,
  defaultValue = "",
  errors,
}: Readonly<{
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  errors: any;
  defaultValue?: string;
}>) {
  return (
    <div className="input-field">
      <div>
        <label htmlFor={name}>{label}</label>
        <div>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
        </div>
      </div>
      <ul>
        {errors && errors[name]
          ? errors[name].map((error: string) => (
              <li key={error} className="input-error">
                {error}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
