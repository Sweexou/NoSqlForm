import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/forms/${params.id}`);
  if (!res.ok) {
    return { form: null };
  }
  const form = await res.json();
  return { form };
};
