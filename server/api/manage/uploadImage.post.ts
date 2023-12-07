import Jimp from "jimp-compact";

const SUPPORTED_FILETYPES = ["image/jpeg", "image/png"];

type ImageResult = {
    placeholder: Buffer;
    shrunk: Buffer;
    original: Buffer;
    width: number;
    height: number;
};

type DecodedImage = {
    imageData: Jimp;
    width: number;
    height: number;
};

const decodeImage = async (fileType: string, buffer: Buffer): Promise<DecodedImage> => {
    const image = await Jimp.read(buffer);
    const width = image.getWidth();
    const height = image.getHeight();
    console.log("width", width, "height", height);
    return { imageData: image, width, height };
};

const resizeImage = async (image: Jimp, width: number) => {
    return image.clone().resize(width, Jimp.AUTO).getBufferAsync(Jimp.MIME_JPEG);
};

const uploadImages = async (data: ImageResult, bucket: any, name: string) => {
    await bucket.put(`full/${name}`, data.original);
    await bucket.put(`shrunk/${name}`, data.shrunk);
    await bucket.put(`placeholder/${name}`, data.placeholder);
};

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
    if (formData) {
        const file = formData[0];
        const fileType = file.type || "";
        if (!SUPPORTED_FILETYPES.includes(fileType)) {
            throw createError({ statusCode: 400, statusMessage: "File type not supported" });
        }
        const fileData = file.data;
        const { imageData, width, height } = await decodeImage(fileType, fileData);
        const shrunkImage = await resizeImage(imageData, 600);

        console.log("imageData", imageData, "width", width, "height", height);
        console.log("shrunkImage", shrunkImage);
    }
    return {};
});
