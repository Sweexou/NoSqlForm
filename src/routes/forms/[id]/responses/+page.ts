import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const formRes = await fetch(`/api/forms/${params.id}`);
  const form = await formRes.json();

  const responsesRes = await fetch(`/api/forms/${params.id}/responses`);
  const responses = await responsesRes.json();

  return {
    form,
    responses
  };
};
