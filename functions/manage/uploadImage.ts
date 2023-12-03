interface Env {
    KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context): Promise<Response> => {
    const formData = await context.request.formData();
    const file = formData.get("file");
    const data = {
        name: file.name,
        type: file.type,
        size: file.size,
    };
    console.log(JSON.stringify(data));

    return new Response(JSON.stringify(data));
};
