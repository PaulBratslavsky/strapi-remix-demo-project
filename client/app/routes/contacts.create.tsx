import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form,  useNavigate } from "@remix-run/react";
// import invariant from "tiny-invariant";
import { createNewContact } from "~/data.server";

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   invariant(params.contactId, "Missing contactId param");
//   const contact = await getContactById(params.contactId);
//   if (!contact) {
//     throw new Response("Not Found", { status: 404 });
//   }
//   return json({ contact });
// };

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const newEntry = await createNewContact(data);
  return redirect(`/contacts/${newEntry.Id}`);
};

export default function CreateContact() {
  // const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <p>
        <button type="submit">Create</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
