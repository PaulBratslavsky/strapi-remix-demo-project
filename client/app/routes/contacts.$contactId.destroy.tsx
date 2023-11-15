import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContactById } from "../data.server";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  await deleteContactById(params.contactId);
  return redirect("/");
};