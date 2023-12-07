import photon from "@silvia-odwyer/photon-node";

const SUPPORTED_FILETYPES = ["image/jpeg", "image/png"];

type ImageResult = {
    placeholder: Buffer;
    shrunk: Buffer;
    original: Buffer;
    width: number;
    height: number;
};

type DecodedImage = {
    width: number;
    height: number;
};

const decodeImage = async (fileType: string, buffer: Buffer): Promise<DecodedImage> => {
    const imageData = buffer.toString("base64");
    const image = photon.PhotonImage.new_from_base64(imageData);
    const width = image.get_width();
    const height = image.get_height();
    console.log("width", width, "height", height);
    return { width, height };
};

// const resizeImage = async (image: Jimp, width: number) => {
//     return image.clone().resize(width, Jimp.AUTO).getBufferAsync(Jimp.MIME_JPEG);
// };

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
        const { width, height } = await decodeImage(fileType, fileData);
        // const shrunkImage = await resizeImage(imageData, 600);

        console.log("width", width, "height", height);
        // console.log("shrunkImage", shrunkImage);
    }
    return {};
});
