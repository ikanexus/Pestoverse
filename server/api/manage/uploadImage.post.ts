import { RuntimeConfig } from "nuxt/schema";

const uploadImage = async (runtimeConfig: RuntimeConfig, file: Buffer, filename: string) => {
    const formData = new FormData();
    formData.append("file", new Blob([file]));
    formData.append("id", filename);
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${runtimeConfig.cfImages.accountId}/images/v1`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${runtimeConfig.cfImages.apiKey}`,
        },
        body: formData,
    });
    return await res.json();
};

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const formData = await readMultipartFormData(event);
    if (formData) {
        const file = formData[0];
        let filename = file.filename || "filename";
        // const res = await uploadImage(runtimeConfig, file.data, filename);
        const res = { name: filename };
        return res;
    }
    return {};
});
