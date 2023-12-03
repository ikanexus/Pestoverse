interface Env {
    KV: KVNamespace;
    ACCOUNT_HASH: string;
}

export const onRequestGet: PagesFunction<Env> = async (context): Promise<Response> => {
    const accountHash = context.env.CF_IMAGES_ACCOUNT_HASH;

    const variant = context.params.variant;
    const imageName = context.params.image.join("/");

    return fetch(`https://imagedelivery.net/${accountHash}/${imageName}/${variant}`, {
        headers: context.request.headers,
    });
};
