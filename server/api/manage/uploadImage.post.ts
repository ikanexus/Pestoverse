import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";
import resize, { initResize } from "@jsquash/resize";
const SUPPORTED_FILETYPES = ["image/jpeg", "image/png"];

type ImageResult = {
    placeholder: Buffer;
    shrunk: Buffer;
    original: Buffer;
    width: number;
    height: number;
};

const resizeImage = async (file: Buffer): Promise<ImageResult> => {
    const webpEncWasm = await loadWasmInstance(() => import("@jsquash/webp/codec/enc/webp_enc_simd.wasm"));
    const resizeWasm = await loadWasmInstance(() => import("@jsquash/resize/lib/resize/squoosh_resize_bg.wasm"));
    const headers = {
        Authorization: `Basic ${Buffer.from(`api:${tinifyToken}`).toString("base64")}`,
        "Content-Type": "application/json",
    };
    const res = await fetch(`https://api.tinify.com/shrink`, {
        method: "POST",
        headers,
        body: file,
    });
    const body = await res.json();
    const output = body.output.url;
    const width = body.output.width;
    const height = body.output.height;

    const shrunk = await fetch(output, {
        method: "POST",
        headers,
        body: JSON.stringify({
            convert: { type: "image/webp" },
            resize: { method: "fit", width: 800, height: 800 },
        }),
    });

    const placeholder = await fetch(output, {
        method: "POST",
        headers,
        body: JSON.stringify({
            convert: { type: "image/webp" },
            resize: { method: "fit", width: 20, height: 20 },
        }),
    });
    const shrunkImage = await shrunk.arrayBuffer();
    const placeholderImage = await placeholder.arrayBuffer();
    return { shrunk: Buffer.from(shrunkImage), placeholder: Buffer.from(placeholderImage), original: file, width, height };
};

const toArrayBuffer = (buf: Buffer) => {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
};

const decodeImage = async (fileType: string, buffer: ArrayBuffer): Promise<ImageData> => {
    const jpegDecWasm = await loadWasmInstance(() => import("@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm"));
    const pngDecWasm = await loadWasmInstance(() => import("@jsquash/png/codec/squoosh_png_bg.wasm"));
    console.log(buffer);
    if (fileType === "image/jpeg") {
        await initJpegWasm(jpegDecWasm);
        const data = await decodeJpeg(buffer);
        return data;
    } else if (fileType === "image/png") {
        await initPngWasm(pngDecWasm);
        const data = await decodePng(buffer);
        return data;
    }

    throw createError({ statusCode: 500, statusMessage: "Can't decode image" });
};

const uploadImages = async (data: ImageResult, bucket: any, name: string) => {
    await bucket.put(`full/${name}`, data.original);
    await bucket.put(`shrunk/${name}`, data.shrunk);
    await bucket.put(`placeholder/${name}`, data.placeholder);
};

const loadWasmInstance = async (importFn: () => Promise<WebAssembly.Module>, imports = {}) => {
    const init = await importFn().then((wasm) => wasm.default || wasm);
    const { instance } = await init(imports);
    return instance;
};

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
    if (formData) {
        const file = formData[0];
        const fileType = file.type || "";
        if (!SUPPORTED_FILETYPES.includes(fileType)) {
            throw createError({ statusCode: 400, statusMessage: "File type not supported" });
        }
        const fileData = toArrayBuffer(file.data);
        const imageData = await decodeImage(fileType, fileData);

        console.log("imageData", imageData);
        // const result = await resizeImage(file.data, runtimeConfig.tinifyToken);
        // const name = "test-1.jpg";
        // const { width, height } = result;
        // console.log("width", width, "height", height);
        // await uploadImages(result, event.context.cloudflare.env.IMAGES, name);
        // return { success: true, width, height };
    }
    return {};
});
