export async function onRequest(context) {
  return new Response('FUNCTION_TEST_OK', {
    headers: { 'content-type': 'text/plain' },
  });
}
