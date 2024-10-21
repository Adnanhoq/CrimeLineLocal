import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function mp4Conversion(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);


    return { body: "test" };
};

app.http('mp4Conversion', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: mp4Conversion
});
